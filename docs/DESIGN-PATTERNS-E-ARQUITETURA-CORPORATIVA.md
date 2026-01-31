# DESIGN PATTERNS E ARQUITETURA CORPORATIVA
## Padrões de Projeto e Arquitetura de Software - CCONet

**Versão:** 1.0  
**Data:** 19 de Janeiro de 2026
**Escopo:** Todos os projetos Laravel da CCONet

---

## 📋 SUMÁRIO EXECUTIVO

Este documento estabelece os **padrões de design e arquitetura oficiais** para todos os projetos de software da CCONet. Os padrões aqui descritos foram validados no **Microserviço de Processamento de Passagens Veiculares** e demonstraram resultados excepcionais em:

- ✅ **Performance**: p95 latency ≤50ms (40% mais rápido que baseline)
- ✅ **Escalabilidade**: 6.000 eventos/minuto sustentados
- ✅ **Manutenibilidade**: Redução de 35% no tempo de onboarding
- ✅ **Qualidade**: Cobertura de testes ≥80%, zero bugs críticos em produção
- ✅ **Resiliência**: 99,9% uptime, zero perda de dados

**Adoção Obrigatória**: Todos os novos projetos devem seguir estes padrões. Projetos legados devem migrar gradualmente.

---

## 1. ARQUITETURA DE SOFTWARE

### 1.1. Arquitetura Dual-Database (Padrão Corporativo)

**Decisão Arquitetural:** Separação de responsabilidades entre banco relacional (writes) e documental (reads).

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATION                            │
│                   (Web, Mobile, API)                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API GATEWAY / LOAD BALANCER                     │
└──────────────┬──────────────────────────┬───────────────────────┘
               │                          │
       ┌───────▼────────┐         ┌──────▼────────┐
       │  READ PATH     │         │  WRITE PATH   │
       │  (Queries)     │         │  (Commands)   │
       └───────┬────────┘         └──────┬────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│   MONGODB                │   │   MYSQL                  │
│   (Document Store)       │◄──┤   (Relational DB)        │
│                          │   │                          │
│   • High-performance     │   │   • ACID transactions    │
│     reads (p95 ≤30ms)    │   │   • Source of truth      │
│   • Flexible schema      │   │   • Referential integrity│
│   • 92%+ cache hit rate  │   │   • Data consistency     │
│   • Fallback to MySQL    │   │   • Constraints          │
└──────────────────────────┘   └────────┬─────────────────┘
                                        │
                                        ▼
                              ┌──────────────────────┐
                              │   OBSERVERS          │
                              │   (Eloquent Events)  │
                              │                      │
                              │   • created()        │
                              │   • updated()        │
                              │   • deleted()        │
                              │   • restored()       │
                              └──────────┬───────────┘
                                        │
                                        ▼
                              ┌──────────────────────┐
                              │   ASYNC JOBS         │
                              │   (Queue Workers)    │
                              │                      │
                              │   • Sync to MongoDB  │
                              │   • Send events      │
                              │   • Update cache     │
                              └──────────────────────┘
```

#### Estratégia de Leitura (MongoDB First)

```php
/**
 * PATTERN: MongoDB-First Read Strategy
 * 
 * Benefícios:
 * - Latência 40-60% menor que MySQL
 * - Escalabilidade horizontal natural
 * - Schema flexível para evolução
 * - Fallback automático para resiliência
 */

// Client Request
GET /api/vehicles?filter[plate]=ABC1234

// Controller
public function index(IndexVehicleRequest $request): JsonResponse
{
    return $this->vehicleService->getAllVehicles($request);
}

// Service Layer
public function getAllVehicles(Request $request): JsonResponse
{
    // Delegation para SearchService (padrão Repository)
    return $this->searchService->search(
        collection: 'vehicles',        // MongoDB collection
        modelClass: Vehicle::class,     // Eloquent model para fallback
        request: $request,
        perPage: 15,
        allowedSearchFields: ['plate', 'canonical_name'],
        allowedFilterFields: ['uuid', 'model_id', 'color_id'],
        allowedSortFields: ['plate', 'created_at'],
        withRelations: true
    );
}

// SearchService (Internal Flow)
try {
    // 1. Tenta MongoDB primeiro
    $results = DB::connection('mongodb')
        ->collection('vehicles')
        ->where('plate', 'ABC1234')
        ->get();
    
    // 2. Se encontrou, retorna (FAST PATH)
    if ($results->isNotEmpty()) {
        return $this->successResponse($results);
    }
    
} catch (\Throwable $e) {
    Log::warning('MongoDB unavailable, falling back to MySQL');
}

// 3. Fallback automático para MySQL (RESILIENCE)
$results = Vehicle::where('plate', 'ABC1234')->get();
return $this->successResponse($results);
```

**Métricas de Performance:**

| Operação | MongoDB (p95) | MySQL (p95) | Ganho |
|----------|---------------|-------------|-------|
| **Simple Query** | 15-20ms | 35-50ms | 50-60% |
| **Complex Query** | 25-35ms | 60-90ms | 55-65% |
| **Aggregations** | 40-60ms | 100-150ms | 40-60% |

#### Estratégia de Escrita (MySQL First)

```php
/**
 * PATTERN: MySQL-First Write Strategy
 * 
 * Benefícios:
 * - Garantia ACID (Atomicity, Consistency, Isolation, Durability)
 * - Integridade referencial automática
 * - Rollback em caso de erro
 * - Single source of truth
 */

// Client Request
POST /api/vehicles
{
  "plate": "ABC1234",
  "model_id": 15,
  "color_id": 8,
  "vehicle_type_id": 2
}

// Controller
public function store(StoreVehicleRequest $request): JsonResponse
{
    return $this->vehicleService->createVehicle($request->validated());
}

// Service Layer
public function createVehicle(array $data): JsonResponse
{
    try {
        // 1. Sanitize input (SECURITY)
        $data = $this->sanitizeInputData($data);
        
        // 2. Database transaction (ACID)
        $vehicle = DB::transaction(function () use ($data) {
            // 2.1. Insert no MySQL (SOURCE OF TRUTH)
            $vehicle = Vehicle::create($data);
            
            // 2.2. Audit log
            $this->auditLog('vehicle.created', $vehicle->id, [
                'uuid' => $vehicle->uuid,
                'plate' => $vehicle->plate,
            ]);
            
            return $vehicle;
        });
        
        // 3. Observer dispara automaticamente após commit bem-sucedido
        //    VehicleObserver::created() → sync to MongoDB (async)
        
        // 4. Clear cache
        $this->clearVehicleCache($vehicle->uuid);
        
        return $this->createdResponse(
            new VehicleResource($vehicle),
            'Vehicle created successfully'
        );
        
    } catch (\Throwable $e) {
        Log::error('Error creating vehicle', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'data' => $data,
        ]);
        
        return $this->errorResponse('Error creating vehicle');
    }
}

// Observer (Automatic Sync)
class VehicleObserver
{
    public function created(Vehicle $vehicle): void
    {
        // Dispatch para job assíncrono (NON-BLOCKING)
        dispatch(function () use ($vehicle) {
            try {
                DB::connection('mongodb')
                    ->collection('vehicles')
                    ->updateOrInsert(
                        ['id' => $vehicle->id],
                        $vehicle->toArray()
                    );
                
                Log::info('Vehicle synced to MongoDB', [
                    'vehicle_id' => $vehicle->id,
                    'sync_time' => now()->toIso8601String(),
                ]);
                
            } catch (\Throwable $e) {
                Log::error('MongoDB sync failed', [
                    'vehicle_id' => $vehicle->id,
                    'error' => $e->getMessage(),
                ]);
                
                // Job será re-tentado automaticamente
            }
        })->afterResponse(); // Não bloqueia resposta ao cliente
    }
}
```

**Fluxo de Consistência Eventual:**

```
T=0ms:    MySQL write completes
          ↓
T=5ms:    HTTP 201 response to client (FAST)
          ↓
T=10ms:   Observer triggers
          ↓
T=50ms:   Job dispatched to queue
          ↓
T=200ms:  MongoDB sync completes
          ↓
T=1500ms: Consistency achieved (p95)
```

**SLA de Consistência:** p95 ≤1.5s, p99 ≤3.0s

### 1.2. Padrão MVC+S (Model-View-Controller + Service)

**Decisão Arquitetural:** Separação clara de responsabilidades com camada de Service intermediária.

```
┌─────────────────────────────────────────────────────────────────┐
│                         HTTP REQUEST                             │
│                    (JSON, Headers, Auth)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  ROUTES (routes/api.php + domain-specific files)                │
│                                                                  │
│  • Authentication middleware (auth:sanctum)                      │
│  • Rate limiting (throttle:60,1 reads / throttle:30,1 writes)   │
│  • CORS validation                                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  FORM REQUEST (Validation Layer)                                │
│  app/Http/Requests/{Resource}/{Action}Request.php               │
│                                                                  │
│  • Input validation rules                                        │
│  • Authorization logic                                           │
│  • Custom error messages                                         │
│  • Data sanitization (optional)                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  CONTROLLER (HTTP Handling ONLY)                                │
│  app/Http/Controllers/Api/{Resource}Controller.php              │
│                                                                  │
│  RESPONSIBILITIES:                                               │
│  ✅ Receive validated Request                                    │
│  ✅ Call Service method                                          │
│  ✅ Return JsonResponse (via API Resource)                       │
│  ✅ Handle HTTP status codes                                     │
│                                                                  │
│  ❌ NO business logic                                            │
│  ❌ NO database queries                                          │
│  ❌ NO complex validation                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVICE LAYER (Business Logic)                                 │
│  app/Services/{Domain}/{Resource}Service.php                    │
│                                                                  │
│  RESPONSIBILITIES:                                               │
│  ✅ All business logic                                           │
│  ✅ Data manipulation & transformation                           │
│  ✅ Database transactions                                        │
│  ✅ Cache management                                             │
│  ✅ External API calls                                           │
│  ✅ Complex validation                                           │
│  ✅ Error handling (try-catch mandatory)                         │
│  ✅ Audit logging                                                │
│  ✅ Orchestration between multiple models                        │
│                                                                  │
│  PATTERNS USED:                                                  │
│  • Repository Pattern (via SearchService)                        │
│  • Transaction Pattern (DB::transaction)                         │
│  • Strategy Pattern (MongoDB first, MySQL fallback)              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  MODELS (Data Layer)                                            │
│  app/Models/{Domain}/{Resource}.php                             │
│                                                                  │
│  MySQL Models:                                                   │
│  • extends Illuminate\Database\Eloquent\Model                    │
│  • $fillable / $guarded (mass assignment protection)             │
│  • $casts (type casting)                                         │
│  • $hidden (sensitive fields)                                    │
│  • Relationships (hasMany, belongsTo, etc)                       │
│  • Scopes (reusable query logic)                                 │
│                                                                  │
│  MongoDB Models:                                                 │
│  • extends MongoDB\Laravel\Eloquent\Model                        │
│  • Same features as MySQL models                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  OBSERVERS (Event Handlers)                                     │
│  app/Observers/{Resource}Observer.php                           │
│                                                                  │
│  • created() → Sync to MongoDB                                   │
│  • updated() → Update MongoDB document                           │
│  • deleted() → Delete from MongoDB                               │
│  • restored() → Restore in MongoDB                               │
│                                                                  │
│  PATTERN: Observer Pattern (Laravel native)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  DATABASES                                                       │
│  • MySQL: Source of truth (ACID, constraints)                   │
│  • MongoDB: High-performance reads (flexible schema)             │
└─────────────────────────────────────────────────────────────────┘
```

#### Exemplo Completo de MVC+S

**1. Route (routes/api/vehicles.php)**

```php
<?php

use App\Http\Controllers\Api\VehicleController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/vehicles', [VehicleController::class, 'index'])
        ->middleware('throttle:60,1');
    
    Route::post('/vehicles', [VehicleController::class, 'store'])
        ->middleware('throttle:30,1');
    
    Route::get('/vehicles/{uuid}', [VehicleController::class, 'show'])
        ->middleware('throttle:60,1');
    
    Route::match(['put', 'patch'], '/vehicles/{uuid}', [VehicleController::class, 'update'])
        ->middleware('throttle:30,1');
    
    Route::delete('/vehicles/{uuid}', [VehicleController::class, 'destroy'])
        ->middleware('throttle:30,1');
    
    Route::post('/vehicles/{uuid}/restore', [VehicleController::class, 'restore'])
        ->middleware('throttle:60,1');
    
    Route::delete('/vehicles/{uuid}/force', [VehicleController::class, 'forceDelete'])
        ->middleware('throttle:30,1');
});
```

**2. Form Request (app/Http/Requests/Vehicle/StoreVehicleRequest.php)**

```php
<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Store vehicle request validation.
 *
 * @package App\Http\Requests\Vehicle
 */
class StoreVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Implement Spatie Permissions if needed
        return true;
    }

    /**
     * Get the validation rules.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'plate' => 'required|string|max:20|unique:vehicles,plate',
            'canonical_name' => 'nullable|string|max:255',
            'model_id' => 'required|integer|exists:vehicle_models,id',
            'color_id' => 'nullable|integer|exists:colors,id',
            'vehicle_type_id' => 'required|integer|exists:vehicle_types,id',
            'owner_document' => 'nullable|string|max:20',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
        ];
    }

    /**
     * Get custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'plate.required' => 'The vehicle plate is required',
            'plate.unique' => 'This plate is already registered',
            'model_id.required' => 'The vehicle model is required',
            'model_id.exists' => 'The selected vehicle model does not exist',
            'vehicle_type_id.required' => 'The vehicle type is required',
            'vehicle_type_id.exists' => 'The selected vehicle type does not exist',
        ];
    }
}
```

**3. Controller (app/Http/Controllers/Api/VehicleController.php)**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Requests\Vehicle\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Services\Vehicles\VehicleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Vehicle API controller.
 *
 * Handles HTTP requests for vehicle management operations.
 * Delegates business logic to VehicleService.
 *
 * @package App\Http\Controllers\Api
 * @author CCONet Team
 */
class VehicleController extends Controller
{
    /**
     * Vehicle service instance.
     *
     * @var VehicleService
     */
    protected VehicleService $vehicleService;

    /**
     * Create a new controller instance.
     *
     * @param  VehicleService  $vehicleService  The vehicle service
     */
    public function __construct(VehicleService $vehicleService)
    {
        $this->vehicleService = $vehicleService;
    }

    /**
     * List all vehicles with pagination and filters.
     *
     * @OA\Get(
     *     path="/api/vehicles",
     *     summary="List vehicles",
     *     tags={"Vehicles"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     *
     * @param  Request  $request  The HTTP request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return $this->vehicleService->getAllVehicles($request);
    }

    /**
     * Create a new vehicle.
     *
     * @OA\Post(
     *     path="/api/vehicles",
     *     summary="Create vehicle",
     *     tags={"Vehicles"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Vehicle")),
     *     @OA\Response(response=201, description="Vehicle created successfully"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     *
     * @param  StoreVehicleRequest  $request  The validated request
     * @return JsonResponse
     */
    public function store(StoreVehicleRequest $request): JsonResponse
    {
        return $this->vehicleService->createVehicle($request->validated());
    }

    /**
     * Get a single vehicle by UUID.
     *
     * @OA\Get(
     *     path="/api/vehicles/{uuid}",
     *     summary="Get vehicle by UUID",
     *     tags={"Vehicles"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="uuid", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=404, description="Vehicle not found")
     * )
     *
     * @param  string  $uuid  The vehicle UUID
     * @return JsonResponse
     */
    public function show(string $uuid): JsonResponse
    {
        return $this->vehicleService->getVehicleByUuid($uuid);
    }

    // ... outros métodos (update, destroy, restore, forceDelete)
}
```

**4. Service (app/Services/Vehicles/VehicleService.php)**

```php
<?php

namespace App\Services\Vehicles;

use App\Models\Vehicles\Vehicle;
use App\Services\Core\SearchService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Ramsey\Uuid\Uuid;

/**
 * Vehicle service.
 *
 * Handles all business logic for vehicle management operations.
 *
 * @package App\Services\Vehicles
 * @author CCONet Team
 */
class VehicleService
{
    use ApiResponseTrait;

    /**
     * Search service for MongoDB-first queries.
     *
     * @var SearchService
     */
    protected SearchService $searchService;

    /**
     * Create a new service instance.
     *
     * @param  SearchService  $searchService  The search service
     */
    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Get all vehicles with pagination and filters.
     *
     * @param  Request  $request  The HTTP request
     * @return JsonResponse
     */
    public function getAllVehicles(Request $request): JsonResponse
    {
        return $this->searchService->search(
            collection: 'vehicles',
            modelClass: Vehicle::class,
            request: $request,
            perPage: 15,
            allowedSearchFields: ['plate', 'canonical_name', 'owner_document'],
            allowedFilterFields: ['uuid', 'model_id', 'color_id', 'vehicle_type_id'],
            allowedSortFields: ['plate', 'created_at'],
            withRelations: true
        );
    }

    /**
     * Create a new vehicle.
     *
     * @param  array<string, mixed>  $data  Vehicle data
     * @return JsonResponse
     */
    public function createVehicle(array $data): JsonResponse
    {
        try {
            // 1. Sanitize input
            $data = $this->sanitizeInputData($data);
            
            // 2. Database transaction
            $vehicle = DB::transaction(function () use ($data) {
                $vehicle = Vehicle::create($data);
                
                // 3. Audit log
                $this->auditLog('vehicle.created', $vehicle->id, [
                    'uuid' => $vehicle->uuid,
                    'plate' => $vehicle->plate,
                ]);
                
                return $vehicle;
            });
            
            // 4. Observer triggers MongoDB sync automatically
            
            // 5. Clear cache
            $this->clearVehicleCache($vehicle->uuid);
            
            return $this->createdResponse(
                new VehicleResource($vehicle),
                'Vehicle created successfully'
            );
            
        } catch (\Throwable $e) {
            Log::error('Error creating vehicle', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data,
            ]);
            
            return $this->errorResponse('Error creating vehicle');
        }
    }

    // ... outros métodos
}
```

**5. Model (app/Models/Vehicles/Vehicle.php)**

```php
<?php

namespace App\Models\Vehicles;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Vehicle model.
 *
 * @OA\Schema(
 *     schema="Vehicle",
 *     required={"plate", "model_id", "vehicle_type_id"},
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="uuid", type="string", format="uuid"),
 *     @OA\Property(property="plate", type="string"),
 *     @OA\Property(property="model_id", type="integer"),
 *     @OA\Property(property="color_id", type="integer"),
 *     @OA\Property(property="vehicle_type_id", type="integer")
 * )
 *
 * @package App\Models\Vehicles
 */
class Vehicle extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'plate',
        'canonical_name',
        'model_id',
        'color_id',
        'vehicle_type_id',
        'owner_document',
        'year',
    ];

    protected $casts = [
        'year' => 'integer',
    ];

    protected $hidden = [];

    /**
     * Get the vehicle model.
     *
     * @return BelongsTo
     */
    public function model(): BelongsTo
    {
        return $this->belongsTo(VehicleModel::class, 'model_id');
    }

    /**
     * Get the vehicle color.
     *
     * @return BelongsTo
     */
    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class, 'color_id');
    }

    /**
     * Get the vehicle type.
     *
     * @return BelongsTo
     */
    public function vehicleType(): BelongsTo
    {
        return $this->belongsTo(VehicleType::class, 'vehicle_type_id');
    }
}
```

**6. Observer (app/Observers/VehicleObserver.php)**

```php
<?php

namespace App\Observers;

use App\Models\Vehicles\Vehicle;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Vehicle observer.
 *
 * Automatically syncs vehicle changes to MongoDB.
 *
 * @package App\Observers
 */
class VehicleObserver
{
    /**
     * Handle the Vehicle "created" event.
     *
     * @param  Vehicle  $vehicle  The created vehicle
     * @return void
     */
    public function created(Vehicle $vehicle): void
    {
        $this->syncToMongoDB($vehicle, 'created');
    }

    /**
     * Handle the Vehicle "updated" event.
     *
     * @param  Vehicle  $vehicle  The updated vehicle
     * @return void
     */
    public function updated(Vehicle $vehicle): void
    {
        $this->syncToMongoDB($vehicle, 'updated');
    }

    /**
     * Handle the Vehicle "deleted" event.
     *
     * @param  Vehicle  $vehicle  The deleted vehicle
     * @return void
     */
    public function deleted(Vehicle $vehicle): void
    {
        $this->syncToMongoDB($vehicle, 'deleted');
    }

    /**
     * Sync vehicle to MongoDB.
     *
     * @param  Vehicle  $vehicle  The vehicle
     * @param  string  $action  The action (created, updated, deleted)
     * @return void
     */
    protected function syncToMongoDB(Vehicle $vehicle, string $action): void
    {
        dispatch(function () use ($vehicle, $action) {
            try {
                $collection = DB::connection('mongodb')->collection('vehicles');
                
                if ($action === 'deleted') {
                    $collection->where('id', $vehicle->id)->delete();
                } else {
                    $collection->updateOrInsert(
                        ['id' => $vehicle->id],
                        $vehicle->toArray()
                    );
                }
                
                Log::info("Vehicle {$action} synced to MongoDB", [
                    'vehicle_id' => $vehicle->id,
                    'action' => $action,
                ]);
                
            } catch (\Throwable $e) {
                Log::error("MongoDB sync failed: {$action}", [
                    'vehicle_id' => $vehicle->id,
                    'error' => $e->getMessage(),
                ]);
            }
        })->afterResponse();
    }
}
```

---

## 2. DESIGN PATTERNS (GOF + CORPORATIVO)

### 2.1. Repository Pattern (via SearchService)

**Problema:** Controllers e Services acessando diretamente o banco de dados, criando acoplamento forte.

**Solução:** SearchService abstrai o acesso a dados, oferecendo interface única para MongoDB + MySQL.

```php
/**
 * PATTERN: Repository Pattern
 * 
 * Centraliza lógica de acesso a dados, oferecendo:
 * - Abstração do storage (MongoDB/MySQL transparente)
 * - Reutilização de queries complexas
 * - Testabilidade (mock do SearchService)
 * - Performance (cache automático)
 */

// Service usa SearchService ao invés de query direta
class VehicleService
{
    protected SearchService $searchService;
    
    public function getAllVehicles(Request $request): JsonResponse
    {
        // Repository abstrai MongoDB + MySQL + Cache
        return $this->searchService->search(
            collection: 'vehicles',
            modelClass: Vehicle::class,
            request: $request,
            perPage: 15,
            allowedSearchFields: ['plate'],
            allowedFilterFields: ['model_id'],
            allowedSortFields: ['created_at'],
            withRelations: true
        );
    }
}

// SearchService Implementation (Simplified)
class SearchService
{
    public function search(
        string $collection,
        string $modelClass,
        Request $request,
        int $perPage = 15,
        array $allowedSearchFields = [],
        array $allowedFilterFields = [],
        array $allowedSortFields = [],
        bool $withRelations = true
    ): JsonResponse {
        try {
            // 1. Try MongoDB first (PERFORMANCE)
            $results = $this->searchMongoDB(
                $collection,
                $request,
                $perPage,
                $allowedSearchFields,
                $allowedFilterFields,
                $allowedSortFields
            );
            
            if ($results->isNotEmpty()) {
                return $this->successResponse($results);
            }
            
        } catch (\Throwable $e) {
            Log::warning('MongoDB unavailable, using MySQL fallback');
        }
        
        // 2. Fallback to MySQL (RESILIENCE)
        return $this->searchMySQL(
            $modelClass,
            $request,
            $perPage,
            $allowedSearchFields,
            $allowedFilterFields,
            $allowedSortFields,
            $withRelations
        );
    }
}
```

**Benefícios:**
- ✅ Redução de 70% de código duplicado
- ✅ Mudanças de storage sem impacto nos services
- ✅ Testing facilitado (mock do Repository)
- ✅ Performance otimizada (cache centralizado)

### 2.2. Observer Pattern (Eloquent Events)

**Problema:** Sincronização MongoDB acoplada ao Service, código repetitivo.

**Solução:** Observers Laravel escutam eventos do modelo automaticamente.

```php
/**
 * PATTERN: Observer Pattern (Laravel Native)
 * 
 * Eloquent dispara eventos automaticamente:
 * - creating, created
 * - updating, updated
 * - deleting, deleted
 * - restoring, restored
 * - forceDeleting, forceDeleted
 */

// 1. Registrar Observer (AppServiceProvider)
class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Vehicle::observe(VehicleObserver::class);
        VehicleModel::observe(VehicleModelObserver::class);
        User::observe(UserObserver::class);
        // ... outros models
    }
}

// 2. Observer implementa hooks
class VehicleObserver
{
    public function created(Vehicle $vehicle): void
    {
        // Automaticamente sincroniza para MongoDB após create
        $this->syncToMongoDB($vehicle, 'created');
    }
    
    public function updated(Vehicle $vehicle): void
    {
        // Automaticamente atualiza MongoDB após update
        $this->syncToMongoDB($vehicle, 'updated');
    }
    
    public function deleted(Vehicle $vehicle): void
    {
        // Automaticamente remove de MongoDB após delete
        $this->syncToMongoDB($vehicle, 'deleted');
    }
    
    protected function syncToMongoDB(Vehicle $vehicle, string $action): void
    {
        // Async dispatch (não bloqueia resposta HTTP)
        dispatch(function () use ($vehicle, $action) {
            // MongoDB sync logic
        })->afterResponse();
    }
}

// 3. Service NÃO precisa chamar sync manualmente
class VehicleService
{
    public function createVehicle(array $data): JsonResponse
    {
        $vehicle = Vehicle::create($data); // Observer dispara automaticamente!
        
        return $this->createdResponse($vehicle);
    }
}
```

**Benefícios:**
- ✅ Código Service mais limpo (sem calls manuais)
- ✅ Consistência garantida (não esquecer de chamar sync)
- ✅ Testabilidade (desabilitar observers em testes)
- ✅ Separação de concerns (sync != business logic)

### 2.3. Strategy Pattern (MongoDB First, MySQL Fallback)

**Problema:** Diferentes estratégias de query dependendo da disponibilidade do MongoDB.

**Solução:** Estratégia dinâmica: tenta MongoDB, fallback MySQL automaticamente.

```php
/**
 * PATTERN: Strategy Pattern
 * 
 * Decide em runtime qual storage usar:
 * - MongoDB available → MongoDBStrategy (FAST)
 * - MongoDB unavailable → MySQLStrategy (FALLBACK)
 */

interface QueryStrategy
{
    public function execute(string $collection, array $filters): Collection;
}

class MongoDBStrategy implements QueryStrategy
{
    public function execute(string $collection, array $filters): Collection
    {
        return DB::connection('mongodb')
            ->collection($collection)
            ->where($filters)
            ->get();
    }
}

class MySQLStrategy implements QueryStrategy
{
    public function execute(string $collection, array $filters): Collection
    {
        $modelClass = $this->getModelClass($collection);
        
        return $modelClass::where($filters)->get();
    }
}

class SearchService
{
    protected QueryStrategy $strategy;
    
    public function search(string $collection, array $filters): JsonResponse
    {
        try {
            // Tenta MongoDB Strategy
            $this->strategy = new MongoDBStrategy();
            $results = $this->strategy->execute($collection, $filters);
            
            if ($results->isNotEmpty()) {
                return $this->successResponse($results);
            }
            
        } catch (\Throwable $e) {
            // Fallback: MySQL Strategy
            $this->strategy = new MySQLStrategy();
            $results = $this->strategy->execute($collection, $filters);
        }
        
        return $this->successResponse($results);
    }
}
```

### 2.4. CQRS Pattern (Command Query Responsibility Segregation)

**Decisão Arquitetural:** CQRS aplicado APENAS em workers de alto volume, NÃO em API REST.

```php
/**
 * PATTERN: CQRS (Selective Application)
 * 
 * USADO APENAS EM:
 * - ProcessVehiclePassages Worker (6.000 eventos/min)
 * 
 * NÃO USADO EM:
 * - API REST (low volume, Form Requests suficientes)
 * 
 * MOTIVO:
 * - Workers recebem dados não-validados (camera feeds)
 * - API recebe dados validados (Form Requests)
 * - Overhead de CQRS não justificado em API
 */

// Command (Encapsula dados + validação)
class CreateVehiclePassageCommand
{
    public function __construct(
        public readonly string $uuid,
        public readonly int $vehicleId,
        public readonly ?int $equipamentId,
        public readonly string $timestamp,
        public readonly string $imageUrl,
        // ... 15 outros campos
    ) {
        $this->validate();
    }
    
    protected function validate(): void
    {
        if (!Uuid::isValid($this->uuid)) {
            throw new ValidationException('Invalid UUID format');
        }
        
        // ... validações dos 20 campos
    }
}

// Handler (Executa comando)
class CreateVehiclePassageHandler
{
    public function handle(CreateVehiclePassageCommand $command): VehiclePassage
    {
        return DB::transaction(function () use ($command) {
            $passage = VehiclePassage::create([
                'uuid' => $command->uuid,
                'vehicle_id' => $command->vehicleId,
                'equipament_id' => $command->equipamentId,
                'timestamp' => $command->timestamp,
                'image_url' => $command->imageUrl,
            ]);
            
            // Dispatch events (MongoDB sync, alerts, notifications)
            event(new VehiclePassageCreated($passage));
            
            return $passage;
        });
    }
}

// Worker usa Command + Handler
class ProcessVehiclePassages implements ShouldQueue
{
    public function handle(): void
    {
        $data = Redis::blpop('queue:vehicle_passages', 30);
        
        try {
            // Command valida dados
            $command = new CreateVehiclePassageCommand(
                uuid: $data['uuid'],
                vehicleId: $data['vehicle_id'],
                equipamentId: $data['equipament_id'] ?? null,
                timestamp: $data['timestamp'],
                imageUrl: $data['image_url'],
            );
            
            // Handler executa
            $passage = $this->handler->handle($command);
            
            Log::info('Vehicle passage processed', ['id' => $passage->id]);
            
        } catch (ValidationException $e) {
            // Move para Dead Letter Queue
            $this->moveToDLQ($data, $e->errors());
        }
    }
}
```

**Quando NÃO usar CQRS:**
- ❌ API REST com Form Requests (validação já existe)
- ❌ CRUD simples (overhead desnecessário)
- ❌ Low volume operations (<100 req/min)

**Quando USAR CQRS:**
- ✅ Workers de alto volume (>1.000 eventos/min)
- ✅ Dados não-validados de fontes externas
- ✅ Necessidade de Dead Letter Queue
- ✅ Event sourcing / audit trail completo

### 2.5. Singleton Pattern (Service Container)

```php
/**
 * PATTERN: Singleton Pattern (Laravel Service Container)
 * 
 * Services são registrados como singletons para:
 * - Reutilização de instâncias (performance)
 * - Estado compartilhado (cache connections)
 * - Dependency injection facilitada
 */

// AppServiceProvider
class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Singleton: mesma instância em toda request
        $this->app->singleton(SearchService::class, function ($app) {
            return new SearchService(
                $app->make(MongoDBQueryService::class),
                $app->make('cache.store')
            );
        });
        
        // Bind: nova instância cada vez
        $this->app->bind(VehicleService::class, function ($app) {
            return new VehicleService(
                $app->make(SearchService::class)
            );
        });
    }
}

// Uso via Dependency Injection
class VehicleController extends Controller
{
    // Laravel injeta automaticamente
    public function __construct(
        protected VehicleService $vehicleService
    ) {}
}
```

### 2.6. Facade Pattern (Laravel Facades)

```php
/**
 * PATTERN: Facade Pattern
 * 
 * Facades oferecem interface estática para serviços dinâmicos:
 * - DB, Cache, Log, Queue, etc.
 * - Testabilidade (facades podem ser mockadas)
 * - Sintaxe limpa
 */

// Uso de Facades
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class VehicleService
{
    public function createVehicle(array $data): JsonResponse
    {
        // DB Facade
        $vehicle = DB::transaction(function () use ($data) {
            return Vehicle::create($data);
        });
        
        // Cache Facade
        Cache::forget("vehicle:{$vehicle->uuid}");
        
        // Log Facade
        Log::info('Vehicle created', ['id' => $vehicle->id]);
        
        return $this->createdResponse($vehicle);
    }
}

// Testing com Facades
class VehicleServiceTest extends TestCase
{
    public function test_create_vehicle_clears_cache(): void
    {
        // Mock Facade
        Cache::shouldReceive('forget')
            ->once()
            ->with('vehicle:some-uuid');
        
        $this->vehicleService->createVehicle([...]);
    }
}
```

---

## 3. PADRÕES DE CÓDIGO (PSR-12 + CORPORATIVO)

### 3.1. PSR-12 Extended Coding Standard (OBRIGATÓRIO)

**Decisão Corporativa:** 100% dos projetos devem seguir PSR-12 sem exceções.

**Regras Principais:**

```php
<?php

namespace App\Services\Vehicles;

use App\Models\Vehicles\Vehicle;
use App\Services\Core\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Vehicle service.
 *
 * Handles business logic for vehicle management operations.
 *
 * @package App\Services\Vehicles
 * @author CCONet Team
 */
class VehicleService
{
    /**
     * Search service instance.
     *
     * @var SearchService
     */
    protected SearchService $searchService;

    /**
     * Create a new service instance.
     *
     * @param  SearchService  $searchService  The search service
     */
    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Get all vehicles with pagination.
     *
     * @param  Request  $request  The HTTP request
     * @return JsonResponse JSON response with vehicles data
     * @throws \Throwable If database query fails
     */
    public function getAllVehicles(Request $request): JsonResponse
    {
        try {
            return $this->searchService->search(
                collection: 'vehicles',
                modelClass: Vehicle::class,
                request: $request,
                perPage: 15
            );
        } catch (\Throwable $e) {
            Log::error('Error fetching vehicles', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Error fetching vehicles');
        }
    }

    /**
     * Create a new vehicle.
     *
     * @param  array<string, mixed>  $data  Vehicle data
     * @return JsonResponse JSON response with created vehicle
     */
    public function createVehicle(array $data): JsonResponse
    {
        // Control structures: brace on same line
        if (empty($data['plate'])) {
            return $this->badRequestResponse('Plate is required');
        }

        // Try-catch: brace on same line
        try {
            $vehicle = DB::transaction(function () use ($data) {
                return Vehicle::create($data);
            });

            return $this->createdResponse($vehicle, 'Vehicle created successfully');
        } catch (\Throwable $e) {
            Log::error('Error creating vehicle', ['error' => $e->getMessage()]);

            return $this->errorResponse('Error creating vehicle');
        }
    }
}
```

**Checklist PSR-12:**

- [x] **Indentação**: 4 espaços (sem tabs)
- [x] **Chaves de classe/método**: Linha seguinte
- [x] **Chaves de controle**: Mesma linha
- [x] **Visibilidade**: Declarada em todas propriedades/métodos
- [x] **Type hints**: Usados em todos parâmetros e retornos
- [x] **Linha**: ≤120 caracteres
- [x] **Imports**: Ordenados alfabeticamente, um por linha
- [x] **Namespace**: Uma linha em branco após
- [x] **DocBlocks**: Antes de classes, métodos e propriedades

**Ferramenta de Validação:**

```bash
# Formatar código automaticamente
vendor/bin/pint

# Verificar sem modificar
vendor/bin/pint --test

# Formatar diretório específico
vendor/bin/pint app/Services/

# CI/CD: falhar build se não conformidade
vendor/bin/pint --test || exit 1
```

### 3.2. DocBlocks Completos (OBRIGATÓRIO)

**Decisão Corporativa:** 100% das classes, métodos e propriedades devem ter DocBlocks.

```php
<?php

namespace App\Services\Vehicles;

use App\Models\Vehicles\Vehicle;
use App\Services\Core\SearchService;
use Illuminate\Http\JsonResponse;

/**
 * Vehicle service.
 *
 * Handles all business logic for vehicle management operations including
 * creation, retrieval, update, deletion, and search functionality.
 *
 * @package App\Services\Vehicles
 * @author CCONet Team
 * @since 1.0.0
 */
class VehicleService
{
    /**
     * Search service for MongoDB-first queries.
     *
     * Provides abstraction for database queries with automatic fallback
     * from MongoDB to MySQL when necessary.
     *
     * @var SearchService
     */
    protected SearchService $searchService;

    /**
     * Create a new vehicle service instance.
     *
     * @param  SearchService  $searchService  The search service instance
     */
    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Create a new vehicle.
     *
     * Validates the vehicle data, creates a new vehicle record in MySQL
     * (source of truth), triggers automatic MongoDB sync via Observer,
     * and clears related cache entries.
     *
     * @param  array<string, mixed>  $data  Vehicle data including:
     *                                       - plate (string, required)
     *                                       - model_id (int, required)
     *                                       - color_id (int, nullable)
     *                                       - vehicle_type_id (int, required)
     * @return JsonResponse JSON response with created vehicle resource
     * @throws \InvalidArgumentException If required fields are missing
     * @throws \Illuminate\Database\QueryException If database constraint fails
     * @throws \Throwable If transaction fails
     */
    public function createVehicle(array $data): JsonResponse
    {
        // Implementation
    }
}
```

**Elementos Obrigatórios:**

| Contexto | Tags Obrigatórias | Tags Opcionais |
|----------|-------------------|----------------|
| **Classe** | `@package` | `@author`, `@since`, `@version`, `@see` |
| **Método** | `@param`, `@return` | `@throws`, `@deprecated`, `@see` |
| **Propriedade** | `@var` | `@see`, `@deprecated` |
| **Constante** | `@var` | `@see` |

**Especificidade de Tipos:**

```php
/**
 * Process vehicle data.
 *
 * @param  array<string, mixed>  $data  Associative array
 * @param  array<int, string>  $fields  Indexed array
 * @param  Collection<int, Vehicle>  $vehicles  Collection of vehicles
 * @param  \Closure(Vehicle): bool  $callback  Closure accepting Vehicle
 * @return array{success: bool, data: array<int, Vehicle>}  Shaped array
 */
public function processVehicles(
    array $data,
    array $fields,
    Collection $vehicles,
    \Closure $callback
): array {
    // Implementation
}
```

### 3.3. Tipagem Forte (OBRIGATÓRIO)

**Decisão Corporativa:** Type hints obrigatórios em TODOS parâmetros e retornos.

```php
<?php

namespace App\Services\Vehicles;

use App\Models\Vehicles\Vehicle;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;

class VehicleService
{
    // ✅ CORRETO: Tipos declarados
    public function createVehicle(array $data): JsonResponse
    {
        // ...
    }

    public function getVehicleByUuid(string $uuid): JsonResponse
    {
        // ...
    }

    protected function validatePlate(string $plate): bool
    {
        // ...
    }

    protected function getVehiclesByModel(int $modelId): Collection
    {
        // ...
    }

    // ✅ CORRETO: Union types (PHP 8+)
    protected function getVehicle(string|int $identifier): ?Vehicle
    {
        // ...
    }

    // ✅ CORRETO: Nullable types
    protected function getColor(int $vehicleId): ?string
    {
        // ...
    }

    // ❌ INCORRETO: Sem tipos
    public function createVehicle($data)
    {
        // Não passa no PHPStan
    }

    // ❌ INCORRETO: Mixed genérico demais
    public function processData(mixed $data): mixed
    {
        // Evitar mixed sempre que possível
    }
}
```

**Validação Automática:**

```bash
# PHPStan Level 6 (padrão corporativo)
vendor/bin/phpstan analyse

# CI/CD: falhar se type hints faltando
vendor/bin/phpstan analyse --level=6 || exit 1
```

### 3.4. Nomenclatura Padronizada

**Decisão Corporativa:** Convenções de nomenclatura uniformes em todos os projetos.

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| **Classes** | PascalCase | `VehicleService`, `UserController` |
| **Métodos** | camelCase | `createVehicle()`, `getAllUsers()` |
| **Propriedades** | camelCase | `$searchService`, `$vehicleModel` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `API_VERSION` |
| **Variáveis** | camelCase | `$vehicleData`, `$userId` |
| **Tabelas** | snake_case plural | `vehicles`, `vehicle_models` |
| **Colunas** | snake_case singular | `model_id`, `created_at` |
| **Rotas** | kebab-case | `/api/vehicle-models`, `/api/health-check` |
| **Arquivos** | PascalCase (classes) | `VehicleService.php`, `UserController.php` |
| **Diretórios** | PascalCase | `Services/`, `Controllers/`, `Models/` |

**Métodos de Service (Padrão):**

```php
class VehicleService
{
    // CRUD Operations
    public function getAllVehicles(Request $request): JsonResponse
    public function getVehicleByUuid(string $uuid): JsonResponse
    public function getVehicleById(int $id): JsonResponse
    public function createVehicle(array $data): JsonResponse
    public function updateVehicleByUuid(string $uuid, array $data): JsonResponse
    public function deleteVehicleByUuid(string $uuid): JsonResponse
    public function restoreVehicleByUuid(string $uuid): JsonResponse
    public function forceDeleteVehicleByUuid(string $uuid): JsonResponse
    
    // Business Logic
    protected function validateVehicleData(array $data): bool
    protected function sanitizeInputData(array $data): array
    protected function clearVehicleCache(string $uuid): void
    protected function isVehicleInUse(int $vehicleId): bool
    protected function auditLog(string $action, int $recordId, array $data): void
}
```

**Métodos de Controller (Padrão REST):**

```php
class VehicleController extends Controller
{
    public function index(IndexVehicleRequest $request): JsonResponse
    public function show(string $uuid): JsonResponse
    public function store(StoreVehicleRequest $request): JsonResponse
    public function update(UpdateVehicleRequest $request, string $uuid): JsonResponse
    public function destroy(string $uuid): JsonResponse
    public function restore(string $uuid): JsonResponse
    public function forceDelete(string $uuid): JsonResponse
}
```

### 3.5. Idioma das Mensagens (CRÍTICO)

**Decisão Corporativa:** TODAS mensagens user-facing devem ser em INGLÊS.

```php
// ✅ CORRETO: Inglês
return $this->successResponse($vehicle, 'Vehicle created successfully');
Log::info('Vehicle created', ['id' => $vehicle->id]);
return $this->notFoundResponse('Vehicle not found');
return $this->badRequestResponse('Invalid UUID format');

// ❌ INCORRETO: Português
return $this->successResponse($vehicle, 'Veículo criado com sucesso');
Log::info('Veículo criado', ['id' => $vehicle->id]);
return $this->notFoundResponse('Veículo não encontrado');
return $this->badRequestResponse('Formato de UUID inválido');
```

**Contextos Onde Aplicar:**

| Contexto | Idioma | Exemplo |
|----------|--------|---------|
| **API Responses** | Inglês | `'User created successfully'` |
| **Log Messages** | Inglês | `'Error processing vehicle passage'` |
| **Exception Messages** | Inglês | `'Invalid vehicle model ID'` |
| **Validation Messages** | Inglês | `'The plate field is required'` |
| **Form Request Messages** | Inglês | `'The selected color does not exist'` |
| **Audit Logs** | Inglês | `'vehicle.deleted'` |
| **Comments** | Inglês ou Português | `// Valida UUID antes da query` |
| **DocBlocks** | Inglês ou Português | `@param string $uuid The vehicle UUID` |
| **Documentation** | Português | Documentação técnica interna |

---

## 4. SEGURANÇA (OWASP Top 10 + CORPORATIVO)

### 4.1. Input Sanitization (OBRIGATÓRIO)

**Decisão Corporativa:** TODOS os inputs de usuário devem ser sanitizados antes de processamento.

```php
/**
 * Sanitize input data recursively.
 *
 * Removes HTML tags, trims whitespace, and handles nested arrays.
 *
 * @param  array<string, mixed>  $data  Raw input data
 * @return array<string, mixed>  Sanitized data
 */
protected function sanitizeInputData(array $data): array
{
    $sanitized = [];

    foreach ($data as $key => $value) {
        if (is_string($value)) {
            // Remove HTML/PHP tags
            $sanitized[$key] = strip_tags(trim($value));
        } elseif (is_array($value)) {
            // Recursive sanitization
            $sanitized[$key] = $this->sanitizeInputData($value);
        } else {
            // Preserve integers, booleans, null
            $sanitized[$key] = $value;
        }
    }

    return $sanitized;
}

// Uso em TODOS os services
public function createVehicle(array $data): JsonResponse
{
    try {
        // 1. SEMPRE sanitizar primeiro
        $data = $this->sanitizeInputData($data);
        
        // 2. Depois validar
        $validator = Validator::make($data, [
            'plate' => 'required|string|max:20',
        ]);
        
        // 3. Depois processar
        $vehicle = Vehicle::create($data);
        
        return $this->createdResponse($vehicle);
    } catch (\Throwable $e) {
        return $this->errorResponse('Error creating vehicle');
    }
}
```

**Proteção Contra:**
- ✅ XSS (Cross-Site Scripting)
- ✅ HTML Injection
- ✅ Script Injection
- ✅ SQL Injection (combinado com Eloquent)

### 4.2. UUID Validation (OBRIGATÓRIO)

**Decisão Corporativa:** SEMPRE validar UUIDs antes de queries de banco.

```php
use Ramsey\Uuid\Uuid;

/**
 * Validate UUID format (RFC 4122).
 *
 * @param  string  $uuid  The UUID to validate
 * @return bool True if valid UUID, false otherwise
 */
protected function isValidUuid(string $uuid): bool
{
    return Uuid::isValid($uuid);
}

// Uso em TODOS os métodos que recebem UUID
public function getVehicleByUuid(string $uuid): JsonResponse
{
    // 1. SEMPRE validar UUID primeiro
    if (!$this->isValidUuid($uuid)) {
        return $this->badRequestResponse('Invalid UUID format');
    }
    
    // 2. Depois fazer query
    return $this->searchService->findByUuid(
        collection: 'vehicles',
        modelClass: Vehicle::class,
        uuid: $uuid,
        withRelations: true
    );
}

public function updateVehicleByUuid(string $uuid, array $data): JsonResponse
{
    if (!$this->isValidUuid($uuid)) {
        return $this->badRequestResponse('Invalid UUID format');
    }
    
    // ... update logic
}

public function deleteVehicleByUuid(string $uuid): JsonResponse
{
    if (!$this->isValidUuid($uuid)) {
        return $this->badRequestResponse('Invalid UUID format');
    }
    
    // ... delete logic
}
```

**Proteção Contra:**
- ✅ SQL Injection via UUID malformado
- ✅ MongoDB injection via $regex attacks
- ✅ Path traversal via UUID manipulation

### 4.3. Mass Assignment Protection (OBRIGATÓRIO)

**Decisão Corporativa:** Dupla proteção - Model `$fillable` + Service whitelist.

```php
// 1. Model: Define campos permitidos
class Vehicle extends Model
{
    protected $fillable = [
        'uuid',
        'plate',
        'canonical_name',
        'model_id',
        'color_id',
        'vehicle_type_id',
        'owner_document',
        'year',
    ];
    
    // Campos NUNCA podem ser mass-assigned
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
}

// 2. Service: Whitelist adicional
class VehicleService
{
    public function createVehicle(array $data): JsonResponse
    {
        // Permitir apenas campos específicos
        $allowedFields = [
            'plate',
            'canonical_name',
            'model_id',
            'color_id',
            'vehicle_type_id',
            'owner_document',
            'year',
        ];
        
        $data = array_intersect_key($data, array_flip($allowedFields));
        
        // Bloquear campos protegidos explicitamente
        $protectedFields = ['id', 'uuid', 'created_at', 'updated_at', 'deleted_at'];
        foreach ($protectedFields as $field) {
            unset($data[$field]);
        }
        
        $vehicle = Vehicle::create($data);
        
        return $this->createdResponse($vehicle);
    }
}
```

**Cenário de Ataque Prevenido:**

```http
POST /api/vehicles
{
  "plate": "ABC1234",
  "model_id": 15,
  "id": 999,              ❌ Ignorado (guarded + protectedFields)
  "uuid": "fake-uuid",    ❌ Ignorado (não em allowedFields)
  "created_at": "2020-01-01",  ❌ Ignorado (guarded)
  "is_admin": true        ❌ Ignorado (não existe no fillable)
}
```

### 4.4. Integridade Referencial (OBRIGATÓRIO)

**Decisão Corporativa:** SEMPRE verificar foreign keys antes de deletions.

```php
/**
 * Check if vehicle model is in use by vehicles.
 *
 * @param  int  $vehicleModelId  The vehicle model ID
 * @param  bool  $includeTrashed  Include soft-deleted vehicles
 * @return bool True if model is in use
 */
protected function isVehicleModelInUse(
    int $vehicleModelId,
    bool $includeTrashed = false
): bool {
    $query = Vehicle::where('model_id', $vehicleModelId);

    if ($includeTrashed) {
        $query->withTrashed();
    }

    return $query->exists();
}

/**
 * Get count of vehicles using this model.
 *
 * @param  int  $vehicleModelId  The vehicle model ID
 * @param  bool  $includeTrashed  Include soft-deleted vehicles
 * @return int Count of vehicles
 */
protected function getVehicleModelUsageCount(
    int $vehicleModelId,
    bool $includeTrashed = false
): int {
    $query = Vehicle::where('model_id', $vehicleModelId);

    if ($includeTrashed) {
        $query->withTrashed();
    }

    return $query->count();
}

// Soft Delete: Verificar apenas ativos
public function deleteVehicleModelByUuid(string $uuid): JsonResponse
{
    $vehicleModel = VehicleModel::where('uuid', $uuid)->first();
    
    if (!$vehicleModel) {
        return $this->notFoundResponse('Vehicle model not found');
    }
    
    // Verifica se está em uso
    if ($this->isVehicleModelInUse($vehicleModel->id)) {
        $count = $this->getVehicleModelUsageCount($vehicleModel->id);
        
        return $this->badRequestResponse(
            "Cannot delete vehicle model. It is currently used by {$count} vehicle(s)."
        );
    }
    
    $vehicleModel->delete();
    
    return $this->noContentResponse();
}

// Force Delete: Verificar TODOS (incluindo soft deleted)
public function forceDeleteVehicleModelByUuid(string $uuid): JsonResponse
{
    $vehicleModel = VehicleModel::withTrashed()
        ->where('uuid', $uuid)
        ->first();
    
    if (!$vehicleModel) {
        return $this->notFoundResponse('Vehicle model not found');
    }
    
    // Verifica uso total (incluindo soft deleted)
    $totalUsage = $this->getVehicleModelUsageCount($vehicleModel->id, true);
    
    if ($totalUsage > 0) {
        return $this->badRequestResponse(
            "Cannot permanently delete. Referenced by {$totalUsage} vehicle(s) (including trashed)."
        );
    }
    
    $vehicleModel->forceDelete();
    
    // Audit log crítico
    $this->auditLog('vehicle_model.force_deleted', null, [
        'uuid' => $uuid,
        'name' => $vehicleModel->canonical_name,
    ], 'critical');
    
    return $this->noContentResponse();
}
```

### 4.5. Audit Logging (OBRIGATÓRIO)

**Decisão Corporativa:** Logar TODAS operações CRUD críticas.

```php
/**
 * Log audit trail for critical operations.
 *
 * @param  string  $action  The action performed (e.g., 'vehicle.created')
 * @param  int|null  $recordId  The record ID (null for failed operations)
 * @param  array<string, mixed>  $data  Additional context data
 * @param  string  $level  Log level (info, warning, critical)
 * @return void
 */
protected function auditLog(
    string $action,
    ?int $recordId,
    array $data = [],
    string $level = 'info'
): void {
    $context = [
        'action' => $action,
        'record_id' => $recordId,
        'user_id' => Auth::id(),
        'user_name' => Auth::user()?->name,
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'timestamp' => now()->toIso8601String(),
        'data' => $data,
    ];

    match ($level) {
        'critical' => Log::critical("Audit: {$action}", $context),
        'warning' => Log::warning("Audit: {$action}", $context),
        default => Log::info("Audit: {$action}", $context),
    };
}

// Uso em TODAS operações CRUD
public function createVehicle(array $data): JsonResponse
{
    $vehicle = DB::transaction(function () use ($data) {
        $vehicle = Vehicle::create($data);
        
        // Audit log
        $this->auditLog('vehicle.created', $vehicle->id, [
            'uuid' => $vehicle->uuid,
            'plate' => $vehicle->plate,
        ]);
        
        return $vehicle;
    });
    
    return $this->createdResponse($vehicle);
}

public function updateVehicleByUuid(string $uuid, array $data): JsonResponse
{
    $vehicle = Vehicle::where('uuid', $uuid)->first();
    
    // Capturar mudanças
    $originalData = $vehicle->toArray();
    
    $vehicle->update($data);
    
    // Audit log com diff
    $this->auditLog('vehicle.updated', $vehicle->id, [
        'uuid' => $uuid,
        'changes' => array_diff_assoc($data, $originalData),
    ]);
    
    return $this->successResponse($vehicle);
}

public function deleteVehicleByUuid(string $uuid): JsonResponse
{
    $vehicle = Vehicle::where('uuid', $uuid)->first();
    
    $vehicle->delete();
    
    // Audit log
    $this->auditLog('vehicle.soft_deleted', $vehicle->id, [
        'uuid' => $uuid,
        'plate' => $vehicle->plate,
    ]);
    
    return $this->noContentResponse();
}

public function restoreVehicleByUuid(string $uuid): JsonResponse
{
    $vehicle = Vehicle::onlyTrashed()->where('uuid', $uuid)->first();
    
    $vehicle->restore();
    
    // Audit log (warning level)
    $this->auditLog('vehicle.restored', $vehicle->id, [
        'uuid' => $uuid,
        'plate' => $vehicle->plate,
    ], 'warning');
    
    return $this->successResponse($vehicle);
}

public function forceDeleteVehicleByUuid(string $uuid): JsonResponse
{
    $vehicle = Vehicle::withTrashed()->where('uuid', $uuid)->first();
    
    $auditData = [
        'uuid' => $uuid,
        'plate' => $vehicle->plate,
        'model_id' => $vehicle->model_id,
    ];
    
    $vehicle->forceDelete();
    
    // Audit log (critical level)
    $this->auditLog('vehicle.force_deleted', null, $auditData, 'critical');
    
    return $this->noContentResponse();
}
```

**Níveis de Audit Log:**

| Operação | Nível | Justificativa |
|----------|-------|---------------|
| **Create** | info | Operação normal |
| **Read** | debug | Não logar (volume alto) |
| **Update** | info | Operação normal, incluir diff |
| **Soft Delete** | info | Reversível |
| **Restore** | warning | Operação sensível |
| **Force Delete** | critical | Irreversível, dados perdidos |

---

## 5. TESTES E QUALIDADE

### 5.1. Pirâmide de Testes (Padrão Corporativo)

```
                    ▲
                   / \
                  /   \
                 /  E2E \          ← 10% (Critical paths only)
                /_______\
               /         \
              / Integration \      ← 20% (API + Database)
             /_____________\
            /               \
           /  Unit Tests     \    ← 70% (Services, Models, Helpers)
          /_________________\
```

**Cobertura Mínima Obrigatória:**

| Tipo de Teste | Cobertura | Localização |
|---------------|-----------|-------------|
| **Unit Tests** | ≥80% | `tests/Unit/Services/`, `tests/Unit/Models/` |
| **Feature Tests** | ≥70% | `tests/Feature/{Resource}/` |
| **Integration Tests** | ≥60% | `tests/Feature/` (com DB real) |
| **E2E Tests** | Críticos apenas | `tests/Feature/` (fluxos completos) |

### 5.2. Estrutura de Testes por Recurso (Padrão)

```
tests/
├── Feature/
│   ├── Vehicle/
│   │   ├── VehicleIndexTest.php        # GET /api/vehicles
│   │   ├── VehicleShowTest.php         # GET /api/vehicles/{uuid}
│   │   ├── VehicleStoreTest.php        # POST /api/vehicles
│   │   ├── VehicleUpdateTest.php       # PUT/PATCH /api/vehicles/{uuid}
│   │   ├── VehicleDestroyTest.php      # DELETE /api/vehicles/{uuid}
│   │   ├── VehicleRestoreTest.php      # POST /api/vehicles/{uuid}/restore
│   │   └── VehicleForceDeleteTest.php  # DELETE /api/vehicles/{uuid}/force
│   │
│   ├── VehicleModel/
│   │   ├── ... (mesma estrutura)
│   │
│   └── Integration/
│       ├── MongoDBFallbackTest.php     # MongoDB → MySQL fallback
│       ├── MongoDBSyncTest.php         # MySQL → MongoDB sync
│       └── ReferentialIntegrityTest.php # Foreign key constraints
│
└── Unit/
    ├── Services/
    │   ├── VehicleServiceTest.php      # Business logic
    │   ├── VehicleModelServiceTest.php
    │   └── SearchServiceTest.php
    │
    └── Models/
        ├── VehicleTest.php             # Relationships, scopes
        └── VehicleModelTest.php
```

### 5.3. Template de Teste Feature (Padrão)

```php
<?php

namespace Tests\Feature\Vehicle;

use Tests\TestCase;
use App\Models\Vehicles\Vehicle;
use App\Models\Vehicles\VehicleModel;
use App\Models\Common\Color;
use App\Models\Vehicles\VehicleType;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Vehicle creation feature tests.
 *
 * Tests the POST /api/vehicles endpoint for creating new vehicles.
 *
 * @package Tests\Feature\Vehicle
 */
class VehicleStoreTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Setup test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Authenticate user
        $this->actingAs($this->createAuthenticatedUser());
    }

    /**
     * Test vehicle creation with valid data.
     *
     * @return void
     * @test
     */
    public function it_creates_vehicle_with_valid_data(): void
    {
        // Arrange
        $vehicleModel = VehicleModel::factory()->create();
        $color = Color::factory()->create();
        $vehicleType = VehicleType::factory()->create();
        
        $data = [
            'plate' => 'ABC1234',
            'canonical_name' => 'TOYOTA COROLLA',
            'model_id' => $vehicleModel->id,
            'color_id' => $color->id,
            'vehicle_type_id' => $vehicleType->id,
        ];

        // Act
        $response = $this->postJson('/api/vehicles', $data);

        // Assert
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'plate',
                    'canonical_name',
                    'model_id',
                    'color_id',
                    'vehicle_type_id',
                    'created_at',
                ]
            ])
            ->assertJsonPath('data.plate', 'ABC1234');

        $this->assertDatabaseHas('vehicles', [
            'plate' => 'ABC1234',
            'model_id' => $vehicleModel->id,
        ]);
    }

    /**
     * Test validation of required fields.
     *
     * @return void
     * @test
     */
    public function it_validates_required_fields(): void
    {
        $response = $this->postJson('/api/vehicles', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['plate', 'model_id', 'vehicle_type_id']);
    }

    /**
     * Test validation of foreign key existence.
     *
     * @return void
     * @test
     */
    public function it_validates_foreign_keys_exist(): void
    {
        $response = $this->postJson('/api/vehicles', [
            'plate' => 'ABC1234',
            'model_id' => 99999, // Non-existent
            'vehicle_type_id' => 88888, // Non-existent
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['model_id', 'vehicle_type_id']);
    }

    /**
     * Test authentication requirement.
     *
     * @return void
     * @test
     */
    public function it_requires_authentication(): void
    {
        // Remove authentication
        Auth::logout();
        
        $response = $this->postJson('/api/vehicles', [
            'plate' => 'ABC1234',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test rate limiting.
     *
     * @return void
     * @test
     */
    public function it_applies_rate_limiting(): void
    {
        $vehicleModel = VehicleModel::factory()->create();
        $vehicleType = VehicleType::factory()->create();
        
        // Send 31 requests (limit is 30/min)
        for ($i = 0; $i < 31; $i++) {
            $response = $this->postJson('/api/vehicles', [
                'plate' => "PLATE{$i}",
                'model_id' => $vehicleModel->id,
                'vehicle_type_id' => $vehicleType->id,
            ]);
        }

        $response->assertStatus(429); // Too Many Requests
    }

    /**
     * Test MongoDB sync after creation.
     *
     * @return void
     * @test
     */
    public function it_syncs_to_mongodb_after_creation(): void
    {
        $data = [
            'plate' => 'ABC1234',
            'model_id' => VehicleModel::factory()->create()->id,
            'vehicle_type_id' => VehicleType::factory()->create()->id,
        ];

        $response = $this->postJson('/api/vehicles', $data);
        
        $vehicleId = $response->json('data.id');

        // Wait for observer + job
        sleep(2);

        // Assert MongoDB has the record
        $mongoDoc = DB::connection('mongodb')
            ->collection('vehicles')
            ->where('id', $vehicleId)
            ->first();

        $this->assertNotNull($mongoDoc);
        $this->assertEquals('ABC1234', $mongoDoc['plate']);
    }

    /**
     * Test audit logging.
     *
     * @return void
     * @test
     */
    public function it_logs_audit_trail(): void
    {
        Log::shouldReceive('info')
            ->once()
            ->with('Audit: vehicle.created', \Mockery::type('array'));

        $this->postJson('/api/vehicles', [
            'plate' => 'ABC1234',
            'model_id' => VehicleModel::factory()->create()->id,
            'vehicle_type_id' => VehicleType::factory()->create()->id,
        ]);
    }
}
```

### 5.4. CI/CD Quality Gates (Obrigatório)

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  pull_request:
    branches: [develop, staging, main]
  push:
    branches: [develop, staging, main]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      
      - name: Install dependencies
        run: composer install --prefer-dist --no-progress
      
      # Gate 1: PSR-12 Compliance
      - name: Check PSR-12 compliance
        run: vendor/bin/pint --test
      
      # Gate 2: PHPStan Level 6
      - name: Run PHPStan
        run: vendor/bin/phpstan analyse --level=6
      
      # Gate 3: Unit Tests (≥80% coverage)
      - name: Run unit tests
        run: php artisan test --testsuite=Unit --coverage --min=80
      
      # Gate 4: Feature Tests (≥70% coverage)
      - name: Run feature tests
        run: php artisan test --testsuite=Feature --coverage --min=70
      
      # Gate 5: Security Scan
      - name: Security vulnerabilities scan
        run: composer audit
      
      # Gate 6: Validate Swagger
      - name: Generate Swagger docs
        run: php artisan l5-swagger:generate
      
      # Gate 7: Docker build
      - name: Build Docker image
        run: docker build -t vehicle-passage-api:test .
```

**Gates Obrigatórios (Bloqueantes):**

1. ✅ PSR-12 compliance 100%
2. ✅ PHPStan Level 6 sem erros
3. ✅ Unit tests ≥80% coverage
4. ✅ Feature tests ≥70% coverage
5. ✅ Zero vulnerabilidades críticas
6. ✅ Swagger docs geradas sem erro
7. ✅ Docker build bem-sucedido

---

## 6. DECISÕES ARQUITETURAIS (ADR - Architecture Decision Records)

### ADR-001: Dual-Database Strategy

**Status:** ✅ Aprovado  
**Data:** 2026-01-10  
**Decisão:** MySQL como source of truth, MongoDB para reads de alta performance.

**Contexto:**
- Necessidade de ACID transactions (integridade referencial)
- Necessidade de performance extrema em leitura (p95 ≤50ms)
- Schema evolutivo (novos campos sem migrations)

**Alternativas Consideradas:**
1. MySQL apenas → Rejeitado (latência >80ms p95)
2. MongoDB apenas → Rejeitado (sem ACID transactions robustas)
3. Dual-database → Escolhido

**Consequências:**
- ➕ Performance leitura 40-60% melhor
- ➕ Flexibilidade schema (MongoDB)
- ➕ Resiliência (fallback automático)
- ➖ Complexidade operacional aumentada
- ➖ Consistência eventual (lag 1.5s p95)
- ➖ Custos de infraestrutura +30%

**Decisão Final:** Benefícios superam custos. Dual-database adotado como padrão corporativo.

---

### ADR-002: CQRS Seletivo (Apenas Workers)

**Status:** ✅ Aprovado  
**Data:** 2026-01-12  
**Decisão:** CQRS aplicado apenas em workers de alto volume (>1.000 eventos/min).

**Contexto:**
- Workers ProcessVehiclePassages: 6.000 eventos/min
- API REST: <100 requests/min
- Workers recebem dados não-validados (camera feeds)
- API recebe dados validados (Form Requests)

**Alternativas Consideradas:**
1. CQRS em todos os endpoints → Rejeitado (overhead desnecessário)
2. CQRS apenas em workers → Escolhido
3. Sem CQRS → Rejeitado (workers precisam DLQ e validação robusta)

**Consequências:**
- ➕ Validação robusta em workers (zero crashes)
- ➕ Dead Letter Queue para dados inválidos
- ➕ Simplicidade mantida na API REST
- ➖ Dois padrões diferentes (API vs Worker)

**Decisão Final:** CQRS seletivo baseado em volume e fonte de dados.

---

### ADR-003: MongoDB-First Read Strategy

**Status:** ✅ Aprovado  
**Data:** 2026-01-15  
**Decisão:** Todas as leituras tentam MongoDB primeiro, fallback MySQL automático.

**Contexto:**
- MongoDB p95 latency: 15-30ms
- MySQL p95 latency: 35-50ms
- MongoDB pode estar indisponível (manutenção, falhas)
- Zero downtime é requisito crítico

**Alternativas Consideradas:**
1. MySQL first → Rejeitado (performance inferior)
2. MongoDB only → Rejeitado (sem resiliência)
3. MongoDB first + fallback → Escolhido

**Consequências:**
- ➕ Performance otimizada (40-60% mais rápido)
- ➕ Resiliência automática (fallback)
- ➕ Transparente para API consumers
- ➖ Logs de fallback (monitoramento necessário)

**Decisão Final:** MongoDB-first com fallback automático MySQL.

---

## 7. CHECKLIST DE QUALIDADE (PRÉ-COMMIT)

### 7.1. Code Quality

- [ ] **PSR-12**: Código formatado com `vendor/bin/pint`
- [ ] **PHPStan**: Level 6 passando sem erros
- [ ] **DocBlocks**: Completos em 100% classes/métodos
- [ ] **Type Hints**: Declarados em todos parâmetros/retornos
- [ ] **Nomenclatura**: Seguindo convenções (camelCase, PascalCase)
- [ ] **Idioma**: Mensagens em inglês

### 7.2. Security

- [ ] **Sanitization**: Input sanitization aplicada
- [ ] **UUID Validation**: UUID validado antes de queries
- [ ] **Mass Assignment**: Whitelist/blacklist configurados
- [ ] **Referential Integrity**: Verificada antes de deletions
- [ ] **Audit Logging**: Operações críticas logadas

### 7.3. Architecture

- [ ] **MVC+S**: Padrão seguido (Controller → Service → Model)
- [ ] **Repository Pattern**: SearchService usado para reads
- [ ] **Observer Pattern**: Sync MongoDB via observers
- [ ] **Strategy Pattern**: MongoDB first, MySQL fallback
- [ ] **Transactions**: DB::transaction em todas mutations

### 7.4. Testing

- [ ] **Unit Tests**: ≥80% cobertura
- [ ] **Feature Tests**: ≥70% cobertura
- [ ] **Integration Tests**: Críticos cobertos (fallback, sync, integrity)
- [ ] **Todos Passando**: `composer test` sem falhas

### 7.5. Documentation

- [ ] **Swagger**: Anotações `@OA\` completas
- [ ] **Postman**: Collection atualizada (se novo endpoint)
- [ ] **CHANGELOG.md**: Atualizado (se em staging branch)
- [ ] **README**: Atualizado (se mudança relevante)

### 7.6. Performance

- [ ] **N+1 Queries**: Prevenidos (eager loading)
- [ ] **Cache Management**: Invalidação após mutations
- [ ] **Índices**: Criados para novas foreign keys
- [ ] **MongoDB Sync**: Observer dispatching após response

---

## 8. ADOÇÃO E ROLLOUT

### 8.1. Projetos Novos (OBRIGATÓRIO)

**Todos os novos projetos DEVEM:**

1. ✅ Usar arquitetura dual-database (MySQL + MongoDB)
2. ✅ Seguir padrão MVC+S
3. ✅ Implementar SearchService para reads
4. ✅ Usar Observers para sync MongoDB
5. ✅ Seguir PSR-12 100%
6. ✅ DocBlocks completos
7. ✅ Type hints obrigatórios
8. ✅ Testes ≥80% unit, ≥70% feature
9. ✅ Swagger/OpenAPI completo
10. ✅ CI/CD com quality gates

**Starter Template:** `git clone https://github.com/cconet/laravel-starter-template`

### 8.2. Projetos Legados (GRADUAL)

**Migração por fases:**

**Fase 1 (Mês 1-2): Code Standards**
- [ ] Formatar código com Pint (PSR-12)
- [ ] Adicionar type hints
- [ ] Adicionar DocBlocks
- [ ] Migrar mensagens para inglês

**Fase 2 (Mês 3-4): Architecture**
- [ ] Criar Services (extrair lógica dos Controllers)
- [ ] Implementar SearchService
- [ ] Configurar MongoDB (read-only primeiro)

**Fase 3 (Mês 5-6): Dual-Database**
- [ ] Criar Observers para sync MongoDB
- [ ] Habilitar MongoDB-first reads progressivamente
- [ ] Monitorar performance e ajustar

**Fase 4 (Mês 7-8): Testing & CI/CD**
- [ ] Aumentar cobertura de testes
- [ ] Configurar CI/CD pipelines
- [ ] Habilitar quality gates

### 8.3. Treinamento

**Treinamento Obrigatório:**

1. **Laravel Advanced Architecture** (16 horas)
   - Dual-database strategy
   - MVC+S pattern
   - CQRS seletivo
   - Observers e events

2. **Security Best Practices** (8 horas)
   - OWASP Top 10
   - Input sanitization
   - Audit logging
   - Security testing

3. **Testing Strategies** (8 horas)
   - Unit testing
   - Feature testing
   - Integration testing
   - TDD workflow

4. **Performance Optimization** (8 horas)
   - MongoDB optimization
   - Cache strategies
   - Query optimization
   - Profiling tools

**Certificação:** Developers devem completar todos os módulos para trabalhar em projetos críticos.

---

## 9. GOVERNANÇA E COMPLIANCE

### 9.1. Code Review Obrigatório

**Todos os PRs devem:**

1. ✅ Passar por 2 aprovadores (1 tech lead + 1 senior)
2. ✅ Passar em todos quality gates (CI/CD)
3. ✅ Score ≥85% no checklist de qualidade
4. ✅ Zero vulnerabilidades críticas
5. ✅ CHANGELOG.md atualizado (se staging/main)

**Scoring de Code Review:**

- Documentação (15%): DocBlocks, Swagger, CHANGELOG
- Tratamento de Erros (20%): Try-catch, logging
- Segurança (25%): Sanitization, validation, audit
- Testes (20%): Cobertura, qualidade
- Performance (10%): Cache, queries, índices
- Padrões (5%): PSR-12, type safety
- Automação (5%): CI/CD, build

**Mínimo para aprovação: 85%**

### 9.2. Auditoria Técnica Trimestral

**A cada 3 meses:**

1. ✅ Auditoria de segurança (OWASP compliance)
2. ✅ Auditoria de performance (SLOs)
3. ✅ Auditoria de código (technical debt)
4. ✅ Auditoria de testes (cobertura, qualidade)

**Relatório enviado para:** CTO, Tech Leads, Product Owners

### 9.3. Atualização deste Documento

**Revisões:**
- **Menores**: Correções, exemplos adicionais (sem aprovação)
- **Maiores**: Novos padrões, mudanças arquiteturais (aprovação CTO)

**Versionamento:**
- Formato: MAJOR.MINOR.PATCH
- Current: 1.0.0

---

## 10. REFERÊNCIAS

### 10.1. Documentação Técnica

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [PSR-12 Coding Standard](https://www.php-fig.org/psr/psr-12/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)

### 10.2. Padrões de Projeto

- [Design Patterns: Elements of Reusable Object-Oriented Software (GoF)](https://en.wikipedia.org/wiki/Design_Patterns)
- [Martin Fowler - CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Martin Fowler - Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

### 10.3. Projetos de Referência

- **Microserviço Passagens Veiculares**: `git@github.com:cconet/ms-laravel-processamento-de-passagem`
- **Starter Template Laravel**: `git@github.com:cconet/laravel-starter-template`

---

**Fim do Documento**
