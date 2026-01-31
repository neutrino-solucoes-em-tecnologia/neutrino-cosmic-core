# TERMO DE REFERÊNCIA TÉCNICA
## Microserviço de Processamento de Passagens Veiculares - CCONet

**Versão:** 1.0  
**Data:** 19 de Janeiro de 2026  
**Projeto:** CCONet - Sistema de Monitoramento Veicular

---

## 1. OBJETIVO

Desenvolver, manter e operar um microserviço API-only de alta performance e disponibilidade para processamento, validação, normalização, persistência e consulta de eventos de passagem veicular, fornecendo base consistente, resiliente e auditável para pipelines analíticos, operacionais e investigativos.

### 1.1. Objetivos Específicos

- **Processamento de Alto Volume**: Sustentar ≥6.000 passagens/minuto (360.000/hora) de múltiplas fontes
- **Baixa Latência**: Consultas API com p95 ≤50ms e p99 ≤80ms
- **Alta Disponibilidade**: SLA de 99,9% com recuperação automática de falhas
- **Integridade de Dados**: Zero perda de eventos em operação nominal
- **Auditabilidade Completa**: Rastreamento de todas as operações críticas
- **Segurança Rigorosa**: Conformidade OWASP e LGPD/GDPR

---

## 2. ESCOPO

### 2.1. Dentro do Escopo

- Recepção de eventos via API REST autenticada (JSON)
- Recepção de eventos via workers consumindo filas Redis/Kafka
- Validação sintática e semântica de dados veiculares
- Normalização e sanitização de dados
- Persistência dual (MySQL relacional + MongoDB documental)
- Sincronização assíncrona MySQL → MongoDB com observers
- Consultas otimizadas (MongoDB first, MySQL fallback)
- Gerenciamento de entidades de referência (países, marcas, modelos, cores, tipos)
- Sistema de monitoramento de veículos e pessoas
- Alertas e notificações configuráveis
- API RESTful completa (CRUD + busca avançada)
- Sistema de filas resiliente com DLQ (Dead Letter Queue)
- Observabilidade completa (logs, métricas, health checks)
- Documentação Swagger/OpenAPI automática
- Testes automatizados (unitários + integração)

### 2.2. Fora do Escopo

- Análise de imagens (OCR de placas, reconhecimento facial)
- Classificação veicular por IA/ML
- Visualização frontend (dashboards, mapas)
- Integração com hardware de câmeras (responsabilidade do gateway)
- Processamento de streaming em tempo real (agregações complexas)
- Backup e disaster recovery (responsabilidade da infraestrutura)

---

## 3. ARQUITETURA TECNOLÓGICA

### 3.1. Stack Principal

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **Framework** | Laravel | 12.x | Maturidade, ecossistema, performance |
| **Linguagem** | PHP | 8.2+ | Tipagem forte, JIT compiler, async |
| **Banco Relacional** | MySQL | 8.0+ | ACID, integridade referencial, índices |
| **Banco Documental** | MongoDB | 7.0+ | Performance leitura, schema flexível |
| **Cache/Sessão** | Redis | 7.x | In-memory, pub/sub, filas |
| **Filas** | Redis/Kafka | - | Resiliência, ordenação, replay |
| **Autenticação** | Laravel Sanctum | 4.x | Tokens SPA/mobile, simplicidade |
| **Observabilidade** | Logs JSON + Metrics | - | Prometheus-compatible, estruturado |

### 3.2. Arquitetura Dual-Database

**Estratégia de Leitura (Read-First MongoDB):**
```
Cliente → API Request → SearchService → MongoDB (tentativa) → MySQL (fallback) → Response
```

**Estratégia de Escrita (Write-First MySQL):**
```
Cliente → API Request → Service → MySQL (transação) → Observer → MongoDB (async) → Response
```

**Benefícios:**
- ✅ MySQL = fonte única da verdade (ACID, constraints)
- ✅ MongoDB = performance extrema em leitura (hit rate 92%+)
- ✅ Fallback automático = resiliência sem configuração
- ✅ Sincronização via Observers = código desacoplado
- ✅ Consistência eventual aceitável (lag <1,5s)

### 3.3. Padrão Arquitetural MVC+S (Model-View-Controller + Service)

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (HTTP/JSON)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  ROUTES (routes/api.php + domain files)                     │
│  - Middleware: auth:sanctum, throttle, cors                 │
│  - Rate Limiting: 60 reads/min, 30 writes/min              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  CONTROLLERS (app/Http/Controllers/Api)                     │
│  - Thin controllers (apenas HTTP handling)                  │
│  - Form Requests para validação                             │
│  - API Resources para response formatting                   │
│  - Try-catch obrigatório                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICES (app/Services/{Domain})                           │
│  - Business logic completa                                  │
│  - SearchService para reads (MongoDB first)                 │
│  - Try-catch obrigatório + logging                          │
│  - Cache management                                         │
│  - Audit logging                                            │
│  - Sanitização de input                                     │
└─────────┬───────────────────────────────────┬───────────────┘
          │                                   │
          ▼                                   ▼
┌──────────────────────┐         ┌──────────────────────────┐
│  MODELS (Eloquent)   │         │  OBSERVERS               │
│  - MySQL: extends    │         │  - Auto-sync MongoDB     │
│    Model             │◄────────┤  - Event dispatch        │
│  - MongoDB: extends  │         │  - Created/Updated/      │
│    MongoDB\Model     │         │    Deleted/Restored      │
└──────────┬───────────┘         └──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  DATABASES                                                   │
│  - MySQL: Source of truth (ACID, constraints)               │
│  - MongoDB: High-performance reads (92%+ hit rate)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. PADRÕES DE CÓDIGO E QUALIDADE

### 4.1. PSR-12 Extended Coding Standard (OBRIGATÓRIO)

**Todas** as classes, métodos e propriedades devem seguir PSR-12:

- **Indentação**: 4 espaços (sem tabs)
- **Chaves**: Classes/métodos → linha seguinte; Estruturas de controle → mesma linha
- **Visibilidade**: Declarada em todas propriedades e métodos
- **Tipagem**: Type hints obrigatórios onde possível
- **Comprimento de linha**: ≤120 caracteres
- **Uma declaração por linha**

**Validação Automática:**
```bash
vendor/bin/pint              # Formatar todo código
vendor/bin/pint --test       # Verificar sem modificar
```

### 4.2. DocBlocks Completos (OBRIGATÓRIO)

**Todas** as classes, métodos e propriedades devem ter DocBlocks:

```php
/**
 * Service for vehicle passage processing.
 *
 * Handles all business logic for vehicle passage management including
 * validation, normalization, persistence, and query operations.
 *
 * @package App\Services\Vehicles
 * @author CCONet Team
 */
class VehiclePassageService
{
    /**
     * Search service for MongoDB-first queries.
     *
     * @var SearchService
     */
    protected SearchService $searchService;

    /**
     * Process incoming vehicle passage event.
     *
     * Validates the passage data, normalizes timestamps to UTC,
     * persists to MySQL with transaction, and triggers async MongoDB sync.
     *
     * @param  array<string, mixed>  $data  Raw passage data from camera feed
     * @return JsonResponse JSON response with created passage or error
     * @throws ValidationException If data validation fails
     * @throws \Throwable If database transaction fails
     */
    public function processPassage(array $data): JsonResponse
    {
        // Implementation
    }
}
```

**Requisitos DocBlock:**
- `@param` com tipo e descrição para CADA parâmetro
- `@return` com tipo e descrição do retorno
- `@throws` para CADA exceção possível
- `@var` para todas as propriedades
- `@package` e `@author` nas classes

### 4.3. Idioma das Mensagens (CRÍTICO)

**TODAS mensagens user-facing devem ser em INGLÊS:**

```php
// ✅ CORRETO
return $this->successResponse($user, 'User created successfully');
Log::error('Error creating user', ['error' => $e->getMessage()]);
return $this->notFoundResponse('User not found');

// ❌ INCORRETO
return $this->successResponse($user, 'Usuário criado com sucesso');
Log::error('Erro ao criar usuário', ['error' => $e->getMessage()]);
return $this->notFoundResponse('Usuário não encontrado');
```

**Aplicável a:**
- Mensagens de API (success, error, validation)
- Logs estruturados
- Exceções
- Mensagens de validação (Form Requests)
- Respostas de serviços

**Exceções:**
- Comentários de código (inglês ou português)
- DocBlocks (inglês ou português)
- Documentação técnica (português)

### 4.4. Tratamento de Erros (OBRIGATÓRIO)

**TODOS os métodos de serviço devem ter try-catch:**

```php
public function createVehicleModel(array $data): JsonResponse
{
    try {
        // 1. Sanitize input
        $data = $this->sanitizeInputData($data);
        
        // 2. Validate
        $validator = Validator::make($data, [
            'canonical_name' => 'required|string|max:255',
            'mark_id' => 'required|integer|exists:marks,id',
        ]);

        if ($validator->fails()) {
            return $this->unprocessableEntityResponse($validator->errors()->toArray());
        }

        // 3. Transaction
        $vehicleModel = DB::transaction(function () use ($data) {
            $model = VehicleModel::create($data);
            
            // 4. Audit log
            $this->auditLog('vehicle_model.created', $model->id, [
                'uuid' => $model->uuid,
                'name' => $model->canonical_name,
            ]);
            
            return $model;
        });

        // 5. Clear cache
        $this->clearModelCache($vehicleModel->uuid);

        return $this->createdResponse(
            new VehicleModelResource($vehicleModel),
            'Vehicle model created successfully'
        );
        
    } catch (ValidationException $e) {
        return $this->unprocessableEntityResponse($e->errors());
        
    } catch (\Throwable $e) {
        // 6. Structured logging
        Log::error('Error creating vehicle model', [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(), // SEMPRE incluir trace
            'data' => $data,
            'user_id' => Auth::id(),
            'ip' => request()->ip(),
        ]);

        // 7. Generic error to user (sem detalhes internos)
        return $this->errorResponse('Error creating vehicle model');
    }
}
```

**Requisitos:**
- Usar `\Throwable` (não `\Exception`) para captura mais ampla
- SEMPRE logar erros com contexto completo
- SEMPRE incluir `'trace' => $e->getTraceAsString()`
- Retornar mensagens genéricas ao usuário (sem stack traces)
- Usar catch específico para ValidationException antes do genérico

### 4.5. Tipagem Forte (OBRIGATÓRIO)

**Todas as assinaturas de método devem ter type hints:**

```php
// ✅ CORRETO
public function updateVehicleModelByUuid(
    string $uuid, 
    array $data
): JsonResponse

protected function isValidUuid(string $uuid): bool

protected function getVehicleModelUsageCount(
    int $vehicleModelId, 
    bool $includeTrashed = false
): int

// ❌ INCORRETO (sem tipos)
public function updateVehicleModelByUuid($uuid, $data)
protected function isValidUuid($uuid)
```

**DocBlocks com tipos específicos:**
```php
/**
 * @param  string  $uuid  The vehicle UUID
 * @param  array<string, mixed>  $data  Updated vehicle data
 * @param  array<int, string>  $fields  List of field names
 * @return Collection<int, Vehicle>  Collection of vehicle models
 */
```

### 4.6. Análise Estática (PHPStan Level 6)

**Código deve passar PHPStan Level 6 sem erros:**

```bash
composer analyse               # Run PHPStan
```

**Configuração (phpstan.neon):**
```yaml
parameters:
    level: 6
    paths:
        - app
        - routes
    ignoreErrors:
        - '#Unsafe usage of new static#'  # Laravel factories
```

---

## 5. SEGURANÇA (OWASP Top 10)

### 5.1. Sanitização de Input (Obrigatória)

**SEMPRE sanitizar dados antes de validação:**

```php
protected function sanitizeInputData(array $data): array
{
    $sanitized = [];

    foreach ($data as $key => $value) {
        if (is_string($value)) {
            // Remove HTML tags, trim whitespace
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
```

**Proteção contra:**
- XSS (Cross-Site Scripting)
- HTML Injection
- Script Injection

### 5.2. Proteção contra SQL Injection

**SEMPRE usar Eloquent ORM (prepared statements automáticos):**

```php
// ✅ SEGURO - Parameter binding automático
$vehicle = Vehicle::where('uuid', $uuid)->first();
$models = VehicleModel::where('mark_id', $markId)
    ->where('active', true)
    ->get();

// ❌ VULNERÁVEL - Nunca concatenar strings
// DB::select("SELECT * FROM vehicles WHERE uuid = '$uuid'");
```

**Validação de UUID obrigatória:**
```php
protected function isValidUuid(string $uuid): bool
{
    return Uuid::isValid($uuid);
}

// Usar antes de queries
if (!$this->isValidUuid($uuid)) {
    return $this->badRequestResponse('Invalid UUID format');
}
```

### 5.3. Proteção contra Mass Assignment

**Whitelist de campos permitidos:**

```php
// Permitir apenas campos específicos
$allowedFields = ['canonical_name', 'display_name', 'mark_id', 'country_id'];
$data = array_intersect_key($data, array_flip($allowedFields));

// Bloquear campos protegidos
$protectedFields = ['uuid', 'id', 'created_at', 'updated_at', 'deleted_at'];
foreach ($protectedFields as $field) {
    unset($data[$field]);
}
```

**Configuração de Model:**
```php
class VehicleModel extends Model
{
    // Approach 1: Whitelist (recomendado)
    protected $fillable = [
        'uuid',
        'canonical_name',
        'display_name',
        'mark_id',
        'country_id',
    ];
    
    // Approach 2: Blacklist
    protected $guarded = ['id', 'created_at', 'updated_at'];
}
```

### 5.4. Integridade Referencial

**Validar existência de foreign keys antes de deletion:**

```php
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

// Uso antes de soft delete
if ($this->isVehicleModelInUse($vehicleModel->id)) {
    $count = $this->getVehicleModelUsageCount($vehicleModel->id);
    return $this->badRequestResponse(
        "Cannot delete vehicle model. It is currently used by {$count} vehicle(s)."
    );
}

// Uso antes de force delete (incluir soft deleted)
$totalUsage = $this->getVehicleModelUsageCount($vehicleModel->id, true);
if ($totalUsage > 0) {
    return $this->badRequestResponse(
        "Cannot permanently delete. Referenced by {$totalUsage} vehicle(s) (including trashed)."
    );
}
```

### 5.5. Audit Logging (Operações Críticas)

**Logar TODAS as operações CRUD críticas:**

```php
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

// Exemplos de uso
$this->auditLog('vehicle_model.created', $model->id, ['uuid' => $model->uuid]);
$this->auditLog('vehicle_model.updated', $model->id, ['changes' => $changes]);
$this->auditLog('vehicle_model.soft_deleted', $model->id);
$this->auditLog('vehicle_model.restored', $model->id, [], 'warning');
$this->auditLog('vehicle_model.force_deleted', null, $auditData, 'critical');
```

### 5.6. Autenticação e Autorização

**Laravel Sanctum para autenticação de API:**

```php
// routes/api.php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('throttle:60,1'); // 60 requests/min
    
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('throttle:30,1'); // 30 requests/min
});
```

**Rate Limiting por tipo de operação:**
- Leitura (GET): 60 requests/min
- Escrita (POST/PUT/PATCH): 30 requests/min
- Deleção (DELETE): 30 requests/min

**Headers de segurança (CORS configurado):**
```php
// config/cors.php
'allowed_origins' => env('CORS_ALLOWED_ORIGINS', '*'),
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```

### 5.7. Checklist de Segurança (Pré-Deploy)

- [ ] Input sanitization aplicada (strip_tags + trim)
- [ ] Validação de UUID antes de queries
- [ ] Mass assignment protection (fillable/guarded)
- [ ] Integridade referencial verificada antes de deletions
- [ ] Audit logging em operações críticas
- [ ] Try-catch em todos os services
- [ ] Stack traces apenas em logs (não em responses)
- [ ] CORS configurado restritivamente
- [ ] Rate limiting ativo
- [ ] Autenticação Sanctum obrigatória
- [ ] Testes de segurança passando

---

## 6. PERFORMANCE E OTIMIZAÇÃO

### 6.1. Estratégia de Leitura (MongoDB First)

**SearchService como camada única de leitura:**

```php
public function getAllVehicleModels(Request $request): JsonResponse
{
    return $this->searchService->search(
        collection: 'vehicle_models',
        modelClass: VehicleModel::class,
        request: $request,
        perPage: 15,
        allowedSearchFields: ['canonical_name', 'display_name'],
        allowedFilterFields: ['uuid', 'mark_id', 'country_id'],
        allowedSortFields: ['canonical_name', 'created_at'],
        withRelations: false // Controle de relacionamentos
    );
}

public function getVehicleModelByUuid(string $uuid): JsonResponse
{
    if (!$this->isValidUuid($uuid)) {
        return $this->badRequestResponse('Invalid UUID format');
    }
    
    return $this->searchService->findByUuid(
        collection: 'vehicle_models',
        modelClass: VehicleModel::class,
        uuid: $uuid,
        withRelations: false
    );
}
```

**Benefícios:**
- MongoDB p95 = 15-30ms (vs MySQL 35-50ms)
- Cache hit rate ≥92%
- Fallback automático para MySQL
- Código centralizado (fácil otimizar)

### 6.2. Estratégia de Escrita (MySQL First + Observer)

**Transações ACID no MySQL:**

```php
public function createVehicleModel(array $data): JsonResponse
{
    try {
        $vehicleModel = DB::transaction(function () use ($data) {
            // 1. Insert MySQL (source of truth)
            $model = VehicleModel::create($data);
            
            // 2. Audit log
            $this->auditLog('vehicle_model.created', $model->id, [
                'uuid' => $model->uuid,
            ]);
            
            return $model;
        });
        
        // 3. Observer dispara sync MongoDB automaticamente
        
        // 4. Clear cache
        $this->clearModelCache($vehicleModel->uuid);

        return $this->createdResponse(
            new VehicleModelResource($vehicleModel),
            'Vehicle model created successfully'
        );
    } catch (\Throwable $e) {
        Log::error('Error creating vehicle model', [...]);
        return $this->errorResponse('Error creating vehicle model');
    }
}
```

**Observer para sincronização automática:**

```php
// app/Observers/VehicleModelObserver.php
class VehicleModelObserver
{
    public function created(VehicleModel $vehicleModel): void
    {
        $this->syncToMongoDB($vehicleModel, 'created');
    }

    public function updated(VehicleModel $vehicleModel): void
    {
        $this->syncToMongoDB($vehicleModel, 'updated');
    }

    public function deleted(VehicleModel $vehicleModel): void
    {
        $this->syncToMongoDB($vehicleModel, 'deleted');
    }

    protected function syncToMongoDB(VehicleModel $model, string $action): void
    {
        dispatch(function () use ($model, $action) {
            try {
                $collection = DB::connection('mongodb')
                    ->collection('vehicle_models');
                
                if ($action === 'deleted') {
                    $collection->where('id', $model->id)->delete();
                } else {
                    $collection->updateOrInsert(
                        ['id' => $model->id],
                        $model->toArray()
                    );
                }
            } catch (\Throwable $e) {
                Log::error("MongoDB sync failed: {$action}", [
                    'model' => 'VehicleModel',
                    'id' => $model->id,
                    'error' => $e->getMessage(),
                ]);
            }
        })->afterResponse(); // Non-blocking
    }
}
```

### 6.3. Gerenciamento de Cache

**Invalidação seletiva após mutações:**

```php
protected function clearModelCache(string $uuid): void
{
    $cacheKeys = [
        "vehicle_model:{$uuid}",
        "vehicle_model:list",
        "vehicle_models:all",
        "vehicle_models:by_mark",
    ];

    foreach ($cacheKeys as $key) {
        Cache::forget($key);
    }
    
    // Clear tags (se usando Redis)
    Cache::tags(['vehicle_models'])->flush();
}

// Chamar após create/update/delete/restore
$this->clearModelCache($vehicleModel->uuid);
```

**Cache de leitura com TTL:**

```php
public function getAllVehicleModels(Request $request): JsonResponse
{
    if (!config('vehicle_models.cache.enabled')) {
        return $this->fetchVehicleModels($request);
    }
    
    $cacheKey = $this->generateCacheKey('vehicle_models.list', $request->all());
    
    return Cache::tags(config('vehicle_models.cache.tags'))
        ->remember($cacheKey, config('vehicle_models.cache.ttl'), function () use ($request) {
            return $this->fetchVehicleModels($request);
        });
}
```

### 6.4. Prevenção de N+1 Queries

**Eager loading de relacionamentos:**

```php
// ❌ N+1 Query Problem
$vehicles = Vehicle::all(); // 1 query
foreach ($vehicles as $vehicle) {
    echo $vehicle->model->name; // +N queries
    echo $vehicle->color->name; // +N queries
}

// ✅ Solução: Eager Loading
$vehicles = Vehicle::with(['model', 'color', 'vehicleType'])
    ->get(); // 4 queries total
foreach ($vehicles as $vehicle) {
    echo $vehicle->model->name;
    echo $vehicle->color->name;
}
```

**Controle via withRelations:**

```php
// Entidades principais (com relacionamentos)
return $this->searchService->search(
    collection: 'vehicles',
    modelClass: Vehicle::class,
    request: $request,
    withRelations: true // Carrega model, color, vehicleType
);

// Dados de referência (sem relacionamentos)
return $this->searchService->search(
    collection: 'colors',
    modelClass: Color::class,
    request: $request,
    withRelations: false // Performance
);
```

### 6.5. Índices de Banco de Dados

**MySQL (obrigatórios):**

```sql
-- Índices em foreign keys
CREATE INDEX idx_vehicles_model_id ON vehicles(model_id);
CREATE INDEX idx_vehicles_color_id ON vehicles(color_id);
CREATE INDEX idx_vehicles_vehicle_type_id ON vehicles(vehicle_type_id);

-- Índices em campos de busca
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_uuid ON vehicles(uuid);

-- Índices compostos para queries complexas
CREATE INDEX idx_vehicle_passages_vehicle_equipament 
    ON vehicle_passages(vehicle_id, equipament_id);

-- Índice para soft deletes
CREATE INDEX idx_vehicles_deleted_at ON vehicles(deleted_at);
```

**MongoDB (recomendados):**

```javascript
// Índice em UUID (queries principais)
db.vehicles.createIndex({ "uuid": 1 }, { unique: true });

// Índice em campos de busca
db.vehicles.createIndex({ "plate": 1 });
db.vehicles.createIndex({ "model_id": 1 });

// Índice composto para ordenação
db.vehicles.createIndex({ "created_at": -1, "id": -1 });

// Índice text para full-text search
db.vehicles.createIndex({ 
    "plate": "text", 
    "canonical_name": "text" 
});
```

### 6.6. Métricas de Performance (SLOs)

| Operação | Target p95 | Target p99 | Método |
|----------|------------|------------|--------|
| **API GET (list)** | ≤50ms | ≤80ms | MongoDB first |
| **API GET (single)** | ≤30ms | ≤50ms | MongoDB first |
| **API POST (create)** | ≤150ms | ≤250ms | MySQL transaction |
| **API PUT (update)** | ≤150ms | ≤250ms | MySQL transaction |
| **API DELETE (soft)** | ≤100ms | ≤200ms | MySQL + cache clear |
| **MongoDB Sync Lag** | ≤1.5s | ≤3.0s | Observer + job |
| **Cache Hit Rate** | ≥92% | ≥95% | Redis |
| **Worker Throughput** | ≥6,000/min | ≥8,000/min | Kafka + Redis |

---

## 7. RESILIÊNCIA E RECUPERAÇÃO

### 7.1. Padrão CQRS para Workers

**Aplicado APENAS em workers de alto volume (não na API):**

```
Camera Feeds → Kafka → Redis Queue → ProcessVehiclePassages Worker
                                              ↓
                                    CreateVehiclePassageCommand
                                              ↓
                                         Validation
                                         /        \
                                  Valid /          \ Invalid
                                       /            \
                              Handler               Dead Letter Queue
                                 ↓                       ↓
                        MySQL Transaction         Manual Review/Replay
                                 ↓
                          Event Dispatch
                        (MongoDB, Alerts)
```

**Benefícios:**
- Centralização de validação
- Dead Letter Queue para dados inválidos
- Segurança transacional
- Dispatch de eventos assíncrono
- Audit trail completo
- Robustez = menos crashes = maior throughput efetivo

**Volumes:**
- Worker ProcessVehiclePassages: 6.000 passagens/min
- API REST: <100 req/min (não usa CQRS)

### 7.2. Dead Letter Queue (DLQ)

**Isolamento de eventos inválidos:**

```php
// Worker ProcessVehiclePassages
protected function handleInvalidPassage(array $data, array $errors): void
{
    // 1. Log structured error
    Log::warning('Invalid vehicle passage - moved to DLQ', [
        'errors' => $errors,
        'data' => $data,
        'timestamp' => now()->toIso8601String(),
    ]);
    
    // 2. Push to Dead Letter Queue
    Redis::rpush('dlq:vehicle_passages', json_encode([
        'data' => $data,
        'errors' => $errors,
        'timestamp' => now()->toIso8601String(),
        'attempts' => 1,
    ]));
    
    // 3. Metrics
    $this->incrementMetric('dlq.vehicle_passages.total');
}

// Comando para reprocessar DLQ
php artisan passages:replay-dlq --limit=100 --dry-run
```

**Características:**
- Preservação de eventos inválidos (zero perda)
- Metadados de erro detalhados
- TTL configurável (padrão: 7 dias)
- Comando de replay manual
- Métricas de DLQ para alertas

### 7.3. Retentativas e Circuit Breaker

**Retentativas exponenciais:**

```php
protected function executeWithRetry(callable $callback, int $maxAttempts = 3): mixed
{
    $attempt = 0;
    
    while ($attempt < $maxAttempts) {
        try {
            return $callback();
        } catch (\Throwable $e) {
            $attempt++;
            
            if ($attempt >= $maxAttempts) {
                throw $e;
            }
            
            // Exponential backoff: 100ms, 200ms, 400ms
            $delay = 100 * pow(2, $attempt - 1);
            usleep($delay * 1000);
            
            Log::warning("Retry attempt {$attempt}/{$maxAttempts}", [
                'error' => $e->getMessage(),
                'delay_ms' => $delay,
            ]);
        }
    }
}
```

**Circuit Breaker para dependências externas:**

```php
// Estado: CLOSED → OPEN → HALF_OPEN → CLOSED
class CircuitBreaker
{
    protected string $state = 'CLOSED';
    protected int $failureCount = 0;
    protected int $successCount = 0;
    protected Carbon $openedAt;
    
    public function call(callable $callback): mixed
    {
        if ($this->state === 'OPEN') {
            if ($this->shouldAttemptReset()) {
                $this->state = 'HALF_OPEN';
            } else {
                throw new CircuitOpenException('Circuit is open');
            }
        }
        
        try {
            $result = $callback();
            $this->onSuccess();
            return $result;
        } catch (\Throwable $e) {
            $this->onFailure();
            throw $e;
        }
    }
    
    protected function onFailure(): void
    {
        $this->failureCount++;
        
        if ($this->failureCount >= 5) { // Threshold
            $this->state = 'OPEN';
            $this->openedAt = now();
            Log::critical('Circuit breaker opened', [
                'failures' => $this->failureCount,
            ]);
        }
    }
    
    protected function shouldAttemptReset(): bool
    {
        // Timeout: 60 segundos
        return $this->openedAt->addSeconds(60)->isPast();
    }
}
```

**Métricas:**
- `cb_state{resource="redis"}` = CLOSED/OPEN/HALF_OPEN
- `cb_errors_total{resource="redis"}` = total de falhas
- `cb_open_events_total` = vezes que abriu

### 7.4. Sincronização MySQL → MongoDB

**Comando de sincronização bulk:**

```bash
# Sincronizar todas as tabelas (sequencial)
php artisan db:sync-to-mongo --all

# Sincronização paralela (5-10x mais rápida)
php artisan queue:work --tries=3 &
php artisan db:sync-to-mongo --all --parallel --workers=10 --chunk=5000

# Sincronizar tabelas específicas
php artisan db:sync-to-mongo --table=marks --table=vehicle_models --table=colors
```

**Características:**
- Throughput: 5.000-10.000 registros/segundo
- Processamento em chunks (padrão: 5.000)
- Bulk operations no MongoDB
- Progresso em tempo real
- Suporte a modelos Eloquent (preserva casts)
- Fallback para raw data
- Logging automático de erros
- Zero perda de dados

**Replay garantido:**
- Window: últimos 30 minutos
- WAL (Write-Ahead Log) local para fallback
- Checksums SHA-256 para integridade
- Deduplicação ≥99%

### 7.5. Estratégias de Recuperação

**Falha de MongoDB (leitura):**
```
Cliente → SearchService → MongoDB (erro) → Fallback MySQL → Response
```
- Automático, transparente
- Latência aumenta (35-50ms vs 15-30ms)
- Log de fallback para monitoramento

**Falha de MySQL (escrita):**
```
API Request → Service → MySQL (erro) → WAL local → HTTP 202 (degraded)
                                            ↓
                                    Replay async (até 15min)
```
- WAL em storage local
- Resposta 202 Accepted (modo degradado)
- Replay automático quando MySQL volta
- Zero perda de dados

**Falha de Redis (fila):**
```
Worker → Redis (erro) → Circuit Breaker → HTTP 503
                              ↓
                    Pausa de 60s → Retry
```
- Circuit breaker evita cascata
- Kafka mantém eventos (replay garantido)
- Alertas automáticos

---

## 8. OBSERVABILIDADE

### 8.1. Health Checks (Kubernetes-Ready)

**Endpoints:**

| Endpoint | Propósito | Uso | Status |
|----------|-----------|-----|--------|
| `GET /api/v1/health` | Health completo | Monitoramento geral | 200/503 |
| `GET /api/v1/health/ready` | Readiness probe | K8s readiness | 200/503 |
| `GET /api/v1/health/live` | Liveness probe | K8s liveness | 200/503 |

**Response do /health:**

```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2026-01-19T10:30:00.000000Z",
  "response_time": "25.50ms",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "MySQL connection is healthy",
      "response_time": "2.15ms"
    },
    "mongodb": {
      "status": "healthy",
      "message": "MongoDB connection is healthy",
      "response_time": "1.80ms"
    },
    "redis": {
      "status": "healthy",
      "message": "Redis connection is healthy",
      "response_time": "0.95ms"
    },
    "queue": {
      "status": "healthy",
      "message": "Queue connection is healthy",
      "queue_size": 5,
      "response_time": "1.20ms"
    },
    "storage": {
      "status": "healthy",
      "message": "Storage is healthy",
      "free_space": "50.25 GB",
      "total_space": "100.00 GB",
      "used_percentage": "49.75%"
    }
  }
}
```

**Status Definitions:**
- `healthy`: Todos os componentes operacionais
- `degraded`: Componentes não-críticos com problemas (storage >80%)
- `unhealthy`: Componentes críticos falharam (database, Redis)

**Kubernetes Configuration:**

```yaml
livenessProbe:
  httpGet:
    path: /api/v1/health/live
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/v1/health/ready
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 2
```

### 8.2. Logs Estruturados (JSON)

**TODOS os logs devem ser JSON estruturados:**

```php
Log::info('Vehicle passage processed', [
    'passage_id' => $passage->id,
    'passage_uuid' => $passage->uuid,
    'vehicle_id' => $passage->vehicle_id,
    'vehicle_plate' => $passage->vehicle->plate ?? null,
    'equipament_id' => $passage->equipament_id,
    'timestamp' => now()->toIso8601String(),
    'processing_time_ms' => $processingTime,
    'user_id' => Auth::id(),
    'ip_address' => request()->ip(),
]);

Log::error('Failed to process vehicle passage', [
    'error' => $e->getMessage(),
    'file' => $e->getFile(),
    'line' => $e->getLine(),
    'trace' => $e->getTraceAsString(),
    'passage_data' => $passageData,
    'timestamp' => now()->toIso8601String(),
]);
```

**Campos obrigatórios:**
- `timestamp` (ISO-8601)
- `user_id` (se autenticado)
- `ip_address` (request IP)
- `error` + `trace` (em logs de erro)
- Contexto de negócio (IDs, UUIDs, valores relevantes)

**Níveis de log:**
- `DEBUG`: Desenvolvimento apenas
- `INFO`: Operações normais (passage processed, user created)
- `WARNING`: Situações anormais mas recuperáveis (cache miss, fallback)
- `ERROR`: Falhas que precisam investigação
- `CRITICAL`: Falhas críticas (database down, data corruption)

### 8.3. Métricas (Prometheus-Compatible)

**Métricas expostas (futuro endpoint /metrics):**

```plaintext
# Ingestão
ingest_queue_depth{queue="vehicle_passages"} 150
ingest_throughput_total{queue="vehicle_passages"} 360000
ingest_latency_ms{queue="vehicle_passages",percentile="p50"} 15.5
ingest_latency_ms{queue="vehicle_passages",percentile="p95"} 45.2
ingest_latency_ms{queue="vehicle_passages",percentile="p99"} 78.8
ingest_errors_total{queue="vehicle_passages",type="validation"} 42

# Deduplicação
dedup_suppressed_total{queue="vehicle_passages"} 1250
dedup_hit_rate{queue="vehicle_passages"} 0.95

# Processamento
processing_lag_ms{queue="vehicle_passages"} 1200
processing_success_total{worker="vehicle_passages"} 358750
processing_failed_total{worker="vehicle_passages"} 12

# Cache
cache_hit_total{resource="vehicle_models"} 9200
cache_miss_total{resource="vehicle_models"} 800
cache_hit_rate{resource="vehicle_models"} 0.92

# Circuit Breaker
cb_state{resource="redis",circuit="enqueue"} 0  # 0=CLOSED, 1=OPEN, 2=HALF_OPEN
cb_errors_total{resource="redis",circuit="enqueue"} 3
cb_open_events_total{resource="redis",circuit="enqueue"} 1

# API
http_requests_total{method="GET",endpoint="/api/vehicles",status="200"} 5420
http_request_duration_ms{method="GET",endpoint="/api/vehicles",percentile="p95"} 48.5

# Database
db_query_duration_ms{database="mysql",operation="select",percentile="p95"} 35.2
db_query_duration_ms{database="mongodb",operation="find",percentile="p95"} 18.7
db_connection_errors_total{database="mysql"} 0
db_connection_errors_total{database="mongodb"} 2

# DLQ
dlq_events_total{queue="vehicle_passages"} 42
dlq_replay_success_total{queue="vehicle_passages"} 38
dlq_replay_failed_total{queue="vehicle_passages"} 4
```

### 8.4. Tracing Distribuído (OpenTelemetry - Futuro)

**Spans principais:**

```plaintext
ingestVehiclePassage (parent)
├── validatePassageData
├── deduplicatePassage
├── enqueuePassage
└── publishToStream

processVehiclePassage (parent)
├── dequeueFromRedis
├── createVehiclePassageCommand
├── validateCommand
├── handleCommand
│   ├── mysqlTransaction
│   └── auditLog
└── dispatchEvents
    ├── syncToMongoDB
    ├── checkAlerts
    └── sendNotifications
```

**Trace Context:**
- `trace_id`: Identificador único do request
- `span_id`: Identificador do span atual
- `parent_span_id`: Span pai
- `service.name`: vehicle-passage-processing
- `service.version`: 1.0.0

---

## 9. TESTES E QUALIDADE

### 9.1. Cobertura de Testes (Mínimos)

| Tipo | Cobertura Mínima | Localização |
|------|------------------|-------------|
| **Unit Tests** | ≥80% | `tests/Unit/` |
| **Feature Tests** | ≥70% | `tests/Feature/` |
| **Integration Tests** | ≥60% | `tests/Feature/` |
| **E2E Tests** | Críticos apenas | `tests/Feature/` |

**Executar testes:**

```bash
composer test                 # Todos os testes
php artisan test --parallel   # Paralelo (mais rápido)
php artisan test --coverage   # Com cobertura
```

### 9.2. Estrutura de Testes por Recurso

**Para cada recurso (exemplo: VehicleModel):**

```
tests/
  Feature/
    VehicleModel/
      VehicleModelIndexTest.php        # GET /api/vehicle-models
      VehicleModelShowTest.php         # GET /api/vehicle-models/{uuid}
      VehicleModelStoreTest.php        # POST /api/vehicle-models
      VehicleModelUpdateTest.php       # PUT/PATCH /api/vehicle-models/{uuid}
      VehicleModelDestroyTest.php      # DELETE /api/vehicle-models/{uuid}
      VehicleModelRestoreTest.php      # POST /api/vehicle-models/{uuid}/restore
      VehicleModelForceDeleteTest.php  # DELETE /api/vehicle-models/{uuid}/force
  Unit/
    Services/
      VehicleModelServiceTest.php      # Lógica de negócio
      VehicleModelReferentialIntegrityTest.php  # Constraints
```

**Template de Feature Test:**

```php
<?php

namespace Tests\Feature\VehicleModel;

use Tests\TestCase;
use App\Models\Vehicles\VehicleModel;
use App\Models\Vehicles\Mark;
use App\Models\Locations\Country;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VehicleModelStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs($this->createAuthenticatedUser());
    }

    /** @test */
    public function it_creates_vehicle_model_with_valid_data(): void
    {
        $mark = Mark::factory()->create();
        $country = Country::factory()->create();
        
        $data = [
            'canonical_name' => 'COROLLA',
            'display_name' => 'Corolla',
            'mark_id' => $mark->id,
            'country_id' => $country->id,
        ];

        $response = $this->postJson('/api/vehicle-models', $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'canonical_name',
                    'display_name',
                    'mark_id',
                    'country_id',
                    'created_at',
                ]
            ]);

        $this->assertDatabaseHas('vehicle_models', [
            'canonical_name' => 'COROLLA',
            'mark_id' => $mark->id,
        ]);
    }

    /** @test */
    public function it_validates_required_fields(): void
    {
        $response = $this->postJson('/api/vehicle-models', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['canonical_name', 'mark_id']);
    }

    /** @test */
    public function it_validates_mark_exists(): void
    {
        $response = $this->postJson('/api/vehicle-models', [
            'canonical_name' => 'COROLLA',
            'mark_id' => 99999, // Non-existent
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['mark_id']);
    }

    /** @test */
    public function it_requires_authentication(): void
    {
        $this->withoutMiddleware(\Illuminate\Auth\Middleware\Authenticate::class);
        
        $response = $this->postJson('/api/vehicle-models', [
            'canonical_name' => 'COROLLA',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function it_applies_rate_limiting(): void
    {
        // Send 31 requests (limit is 30/min)
        for ($i = 0; $i < 31; $i++) {
            $response = $this->postJson('/api/vehicle-models', [
                'canonical_name' => "MODEL_{$i}",
                'mark_id' => Mark::factory()->create()->id,
            ]);
        }

        $response->assertStatus(429); // Too Many Requests
    }
}
```

### 9.3. Testes de Integração Críticos

**Sincronização MySQL → MongoDB:**

```php
/** @test */
public function it_syncs_to_mongodb_after_create(): void
{
    $vehicleModel = VehicleModel::create([
        'canonical_name' => 'COROLLA',
        'mark_id' => Mark::factory()->create()->id,
    ]);

    // Wait for observer + job
    sleep(2);

    $mongoDoc = DB::connection('mongodb')
        ->collection('vehicle_models')
        ->where('id', $vehicleModel->id)
        ->first();

    $this->assertNotNull($mongoDoc);
    $this->assertEquals('COROLLA', $mongoDoc['canonical_name']);
}
```

**Fallback MongoDB → MySQL:**

```php
/** @test */
public function it_falls_back_to_mysql_when_mongodb_unavailable(): void
{
    // Simulate MongoDB down
    Config::set('database.connections.mongodb.host', 'invalid_host');

    $response = $this->getJson('/api/vehicle-models');

    $response->assertStatus(200); // Fallback worked
    $this->assertDatabaseCount('vehicle_models', $response->json('meta.total'));
}
```

**Integridade Referencial:**

```php
/** @test */
public function it_prevents_deletion_when_model_in_use(): void
{
    $vehicleModel = VehicleModel::factory()->create();
    Vehicle::factory()->create(['model_id' => $vehicleModel->id]);

    $response = $this->deleteJson("/api/vehicle-models/{$vehicleModel->uuid}");

    $response->assertStatus(400)
        ->assertJson([
            'message' => 'Cannot delete vehicle model. It is currently used by 1 vehicle(s).'
        ]);

    $this->assertDatabaseHas('vehicle_models', ['id' => $vehicleModel->id]);
}
```

### 9.4. Testes de Carga (Obrigatórios Pré-Deploy)

**Performance de API:**

```bash
# Apache Bench (100 concurrent users, 1000 requests)
ab -n 1000 -c 100 -H "Authorization: Bearer {token}" \
   http://localhost:8000/api/vehicles

# Expected results:
# - p95 latency ≤ 50ms
# - p99 latency ≤ 80ms
# - Success rate ≥ 99.9%
```

**Throughput de Worker:**

```bash
# Injetar 10.000 passagens no Redis
php artisan passages:seed-redis --count=10000

# Iniciar worker
php artisan queue:work --tries=3

# Monitorar throughput
php artisan passages:monitor

# Expected results:
# - Throughput ≥ 6.000 passagens/min
# - Failure rate ≤ 0.1%
# - DLQ rate ≤ 1%
```

**Sincronização MySQL → MongoDB:**

```bash
# Sincronizar 100.000 registros
php artisan db:sync-to-mongo --table=vehicle_passages --parallel --workers=10

# Expected results:
# - Throughput ≥ 5.000 registros/segundo
# - Zero data loss
# - Zero duplicates
```

### 9.5. Checklist Qualidade (Pré-Commit)

- [ ] Código formatado com Pint (PSR-12)
- [ ] PHPStan Level 6 passando sem erros
- [ ] Todos os testes passando (`composer test`)
- [ ] Cobertura ≥80% (unit), ≥70% (feature)
- [ ] DocBlocks completos
- [ ] Mensagens em inglês
- [ ] Try-catch em services
- [ ] Input sanitization aplicada
- [ ] Audit logging em operações críticas
- [ ] Integridade referencial verificada
- [ ] Swagger documentation atualizada
- [ ] **CHANGELOG.md atualizado**
- [ ] Commit message seguindo Conventional Commits

---

## 10. DOCUMENTAÇÃO

### 10.1. Swagger/OpenAPI (Obrigatório)

**TODOS os endpoints devem ter anotações Swagger:**

```php
/**
 * List all vehicle models with pagination and filters.
 *
 * @OA\Get(
 *     path="/api/vehicle-models",
 *     summary="List vehicle models",
 *     description="Retrieve paginated list of vehicle models with optional filters and sorting",
 *     operationId="listVehicleModels",
 *     tags={"Vehicle Models"},
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(
 *         name="page",
 *         in="query",
 *         description="Page number",
 *         required=false,
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Parameter(
 *         name="per_page",
 *         in="query",
 *         description="Items per page",
 *         required=false,
 *         @OA\Schema(type="integer", example=15, minimum=1, maximum=100)
 *     ),
 *     @OA\Parameter(
 *         name="search",
 *         in="query",
 *         description="Search term for name fields",
 *         required=false,
 *         @OA\Schema(type="string", example="corolla")
 *     ),
 *     @OA\Parameter(
 *         name="filter[mark_id]",
 *         in="query",
 *         description="Filter by mark ID",
 *         required=false,
 *         @OA\Schema(type="integer", example=5)
 *     ),
 *     @OA\Parameter(
 *         name="sort",
 *         in="query",
 *         description="Sort field (prefix with - for descending)",
 *         required=false,
 *         @OA\Schema(type="string", example="-created_at")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successful operation",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="data",
 *                 type="array",
 *                 @OA\Items(ref="#/components/schemas/VehicleModel")
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(property="current_page", type="integer", example=1),
 *                 @OA\Property(property="per_page", type="integer", example=15),
 *                 @OA\Property(property="total", type="integer", example=150),
 *                 @OA\Property(property="last_page", type="integer", example=10)
 *             )
 *         )
 *     ),
 *     @OA\Response(response=401, description="Unauthenticated"),
 *     @OA\Response(response=429, description="Too many requests")
 * )
 */
public function index(IndexVehicleModelRequest $request): JsonResponse
{
    // Implementation
}
```

**Gerar documentação:**

```bash
php artisan l5-swagger:generate
```

**Acessar documentação:**

```
http://localhost:8000/api/documentation
```

### 10.2. Postman Collections (Estratégia Modular)

**Estrutura de diretórios:**

```
docs/postman/
├── README.md (Redirect para collections/)
├── .gitignore (Ignora collection monolítica legada)
└── collections/
    ├── README.md (Documentação completa)
    ├── 01-Authentication.postman_collection.json
    ├── 02-Users.postman_collection.json
    ├── 03-Countries.postman_collection.json
    ├── 04-Regions.postman_collection.json
    ├── 05-States.postman_collection.json
    ├── 06-Cities.postman_collection.json
    ├── 07-Marks.postman_collection.json
    ├── 08-VehicleModels.postman_collection.json
    ├── 09-Colors.postman_collection.json
    ├── 10-VehicleTypes.postman_collection.json
    ├── 11-Vehicles.postman_collection.json
    ├── 12-VehiclePassages.postman_collection.json
    └── 99-HealthChecks.postman_collection.json
```

**Benefícios da estratégia modular:**
- ✅ Zero conflitos de merge (arquivo separado por recurso)
- ✅ Desenvolvimento paralelo (diferentes devs, diferentes recursos)
- ✅ Rastreamento claro de mudanças (Git diff por recurso)
- ✅ Importação seletiva (apenas collections necessárias)
- ✅ Revisões de código facilitadas (mudanças isoladas)

**Padrão CRUD (7 endpoints por recurso):**
1. List All - `GET /api/{resource}`
2. Show by UUID - `GET /api/{resource}/{uuid}`
3. Create - `POST /api/{resource}`
4. Update - `PUT/PATCH /api/{resource}/{uuid}`
5. Soft Delete - `DELETE /api/{resource}/{uuid}`
6. Restore - `POST /api/{resource}/{uuid}/restore`
7. Force Delete - `DELETE /api/{resource}/{uuid}/force`

**Variáveis de ambiente compartilhadas:**
- `{{base_url}}` = http://localhost:8000
- `{{auth_token}}` = Bearer token do login

### 10.3. Changelog (Formato Keep a Changelog)

**CRÍTICO: CHANGELOG.md só pode ser atualizado na branch `staging`**

**Estrutura:**

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- VehicleModelService with CRUD operations and referential integrity checks
  - Prevents deletion when model is in use by vehicles
  - Supports soft delete, restore, and force delete operations
  - Performance: MongoDB-first queries with p95 ≤30ms
  - Documentation: Swagger annotations complete

### Changed
- SearchService refactored to support MongoDB-first strategy
  - Automatic fallback to MySQL when MongoDB unavailable
  - Reduced query latency by 40% (50ms → 30ms p95)
  - Improved cache hit rate: 85% → 92%

### Fixed
- UUID validation in VehicleModelService was accepting invalid formats
  - Added strict RFC 4122 compliance check using Ramsey\Uuid
  - Resolves issue where malformed UUIDs caused database errors
  - Performance impact: <1ms per validation

### Breaking Changes
- VehicleModel API now requires `country_id` field (previously optional)
  - Migration: Run `php artisan migrate` to add NOT NULL constraint
  - Impact: Existing API clients must include `country_id` in POST/PUT requests

## [1.2.0] - 2026-01-15

### Added
- CQRS pattern for ProcessVehiclePassages worker
  - CreateVehiclePassageCommand with validation
  - CreateVehiclePassageHandler with transaction safety
  - Dead Letter Queue for invalid camera feed data
  - Throughput improvement: 4,500 → 6,000 passages/min (+33%)

### Changed
- Switched from SQLite to MySQL for production database
  - Configuration: Updated `.env` and `config/database.php`
  - Migration path: Export SQLite → Import MySQL

## [1.1.0] - 2026-01-10

### Added
- MongoDB integration for high-performance reads
  - Dual-database architecture (MySQL + MongoDB)
  - Automatic sync via Eloquent Observers
  - Query latency reduced from 80ms to 30ms (p95)

### Security
- Input sanitization with `strip_tags()` applied to all user input
- Mass assignment protection with field whitelisting
- UUID validation before all database queries
```

**Quando atualizar:**
- Antes de CADA commit (em staging branch apenas)
- Sob seção `[Unreleased]`
- Incluir métricas (performance, cobertura, LOC)
- Linkar documentação relacionada
- Destacar breaking changes

**Versioning (Semantic Versioning):**
- **MAJOR** (X.0.0): Breaking changes incompatíveis
- **MINOR** (0.X.0): Novas features, retrocompatível
- **PATCH** (0.0.X): Bug fixes, retrocompatível

### 10.4. README.md Atualizado

**Seções obrigatórias:**

```markdown
# Vehicle Passage Processing Microservice

API-only microservice for processing vehicle passages - CCONet Project

## Features
- 🚀 High-performance (6,000 passages/min)
- 💾 Dual-database (MySQL + MongoDB)
- 🔒 Security-first (OWASP compliant)
- 📊 Observable (logs, metrics, health checks)
- 🧪 Tested (≥80% coverage)
- 📚 Documented (Swagger + Postman)

## Tech Stack
- Laravel 12
- PHP 8.2+
- MySQL 8.0+
- MongoDB 7.0+
- Redis 7.x

## Quick Start
```bash
composer setup        # Install dependencies + env setup
composer dev          # Start server + queue + logs
composer test         # Run tests
```

## Documentation
- [API Documentation](http://localhost:8000/api/documentation) (Swagger)
- [Postman Collections](docs/postman/collections/)
- [Architecture](docs/README.md)
- [Security Practices](docs/security-practices.md)
- [Health Checks](docs/health-checks.md)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## License
Proprietary - CCONet
```

---

## 11. CONTEINERIZAÇÃO E DEPLOY

### 11.1. Docker Multi-Stage Build

**Dockerfile otimizado:**

```dockerfile
# Stage 1: Dependencies
FROM php:8.2-fpm-alpine AS dependencies

RUN apk add --no-cache \
    libpq-dev \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring xml

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Stage 2: Application
FROM php:8.2-fpm-alpine AS application

RUN apk add --no-cache \
    nginx \
    supervisor \
    && adduser -D -u 1000 app

COPY --from=dependencies /app/vendor /app/vendor
COPY --chown=app:app . /app

WORKDIR /app

RUN composer dump-autoload --optimize --classmap-authoritative \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

USER app

EXPOSE 8000 9000

CMD ["supervisord", "-c", "/app/docker/supervisor/supervisord.conf"]
```

**Características:**
- Imagem final ≤200MB
- Usuário não-root (app:1000)
- Read-only filesystem
- No secrets in image
- Multi-stage para otimização

### 11.2. Docker Compose (Desenvolvimento)

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: application
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=local
      - DB_HOST=mysql
      - MONGO_HOST=mongodb
      - REDIS_HOST=redis
    volumes:
      - ./storage:/app/storage
    depends_on:
      - mysql
      - mongodb
      - redis
    networks:
      - cconet

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: vehicle_passages
      MYSQL_ROOT_PASSWORD: secret
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - cconet

  mongodb:
    image: mongo:7.0
    environment:
      MONGO_INITDB_DATABASE: vehicle_passages_laravel
    volumes:
      - mongo_data:/data/db
    networks:
      - cconet

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - cconet

volumes:
  mysql_data:
  mongo_data:
  redis_data:

networks:
  cconet:
    driver: bridge
```

### 11.3. Kubernetes Deployment

**deployment.yaml:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vehicle-passage-api
  labels:
    app: vehicle-passage-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: vehicle-passage-api
  template:
    metadata:
      labels:
        app: vehicle-passage-api
    spec:
      containers:
      - name: api
        image: registry.cconet.com/vehicle-passage-api:1.2.0
        ports:
        - containerPort: 8000
          name: http
        env:
        - name: APP_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: host
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /api/v1/health/live
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/v1/health/ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          readOnlyRootFilesystem: true
          allowPrivilegeEscalation: false
```

**Horizontal Pod Autoscaler:**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vehicle-passage-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vehicle-passage-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_request_latency_p95_ms
      target:
        type: AverageValue
        averageValue: "50"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 120
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 25
        periodSeconds: 60
```

**Características:**
- Scale-out automático baseado em latência p95
- Histerese para evitar flapping
- Cooldown: 2min up, 5min down
- Rolling update sem downtime
- Rollback em ≤2min

---

## 12. GOVERNANÇA

### 12.1. Workflow de Branches (Git Flow Modificado)

```
main (production-ready)
  ↑
staging (pre-production, CHANGELOG updates allowed here)
  ↑
develop (integration)
  ↑
feature/* (new features)
fix/* (bug fixes)
hotfix/* (production emergency)
```

**Regras:**
- `main`: Apenas via PR de `staging` + aprovação
- `staging`: Apenas via PR de `develop` + testes passando
- `develop`: Via PR de `feature/*` ou `fix/*`
- **CHANGELOG.md**: APENAS em `staging` (crítico)

### 12.2. Conventional Commits (Obrigatório)

**Formato:**

```
<type>: <short description>

<detailed description>

<footer>
```

**Tipos:**
- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Documentação apenas
- `style`: Formatação de código (sem mudança lógica)
- `refactor`: Refatoração (sem feature/bug change)
- `perf`: Melhoria de performance
- `test`: Adição/atualização de testes
- `chore`: Tarefas de manutenção (deps, config)
- `build`: Build system changes
- `ci`: CI/CD changes

**Exemplos:**

```
feat: add VehicleModelService with referential integrity checks

Implemented complete CRUD service for vehicle models with:
- MongoDB-first read strategy (p95 ≤30ms)
- Referential integrity validation before deletions
- Soft delete, restore, and force delete support
- Complete Swagger documentation
- Feature and unit tests (95% coverage)

Files changed: 8 (+650, -0)
- Controller: 7 endpoints (index, show, store, update, destroy, restore, forceDelete)
- Service: Business logic with error handling
- Form Requests: 7 validation classes
- API Resource: Response formatting
- Tests: Feature (7) + Unit (1)
- Routes: Registered with rate limiting
- Swagger: Complete API documentation

Breaking changes: None
```

```
fix: strict UUID validation in vehicle model queries

Added Ramsey\Uuid::isValid() for strict RFC 4122 compliance.
Previously accepted malformed UUIDs causing database errors.

Resolves: #123
Performance: <1ms per validation
```

### 12.3. Code Review Checklist (Aprovadores)

**Documentação (Peso: 15%):**
- [ ] DocBlocks completos em classes/métodos
- [ ] Mensagens em inglês
- [ ] Swagger annotations adicionadas
- [ ] CHANGELOG.md atualizado (se em staging)

**Tratamento de Erros (Peso: 20%):**
- [ ] Try-catch em todos os services
- [ ] Stack traces nos logs
- [ ] Mensagens genéricas ao usuário

**Segurança (Peso: 25%):**
- [ ] Input sanitization aplicada
- [ ] Mass assignment protection
- [ ] Audit logging em operações críticas
- [ ] Integridade referencial verificada
- [ ] UUID validation antes de queries

**Testes (Peso: 20%):**
- [ ] Unit tests para business logic
- [ ] Feature tests para endpoints
- [ ] Testes de integridade referencial
- [ ] Cobertura ≥80% (unit), ≥70% (feature)

**Performance (Peso: 10%):**
- [ ] Transações de database
- [ ] Cache management
- [ ] N+1 queries prevenidos
- [ ] Eager loading de relacionamentos

**Padrões (Peso: 5%):**
- [ ] PSR-12 formatação (Pint)
- [ ] PHPStan Level 6 passando
- [ ] Type safety
- [ ] OWASP compliance

**Automação (Peso: 5%):**
- [ ] CI/CD pipeline passando
- [ ] Tests automatizados passando
- [ ] Build Docker bem-sucedido
- [ ] Vulnerabilities scan limpo

**Score mínimo para aprovação: 85%**

### 12.4. SLOs (Service Level Objectives)

| Métrica | Target | Medição |
|---------|--------|---------|
| **API Availability** | ≥99.9% | Uptime mensal |
| **API Latency (p95)** | ≤50ms | Prometheus metrics |
| **API Latency (p99)** | ≤80ms | Prometheus metrics |
| **Worker Throughput** | ≥6,000/min | Queue metrics |
| **Data Loss Rate** | 0% | Audit logs |
| **MongoDB Sync Lag (p95)** | ≤1.5s | Replication metrics |
| **Cache Hit Rate** | ≥92% | Redis metrics |
| **DLQ Rate** | ≤1% | Worker metrics |
| **Error Rate** | ≤0.1% | Log aggregation |

**Alertas automáticos:**
- Availability <99.9% → PagerDuty
- p95 latency >50ms por 5min → Slack
- Worker throughput <5,000/min → Slack
- DLQ rate >2% → Email + Slack
- MongoDB sync lag >3s → Email

---

## 13. EVOLUÇÃO E ROADMAP

### 13.1. Melhorias Planejadas (Q1 2026)

**Performance:**
- [ ] Implementar Redis Cluster (HA)
- [ ] Adicionar read replicas MySQL
- [ ] MongoDB sharding por região geográfica
- [ ] Query result caching (GraphQL-style)

**Observabilidade:**
- [ ] OpenTelemetry tracing distribuído
- [ ] Prometheus metrics endpoint (`/metrics`)
- [ ] Grafana dashboards automatizados
- [ ] Log aggregation com ELK stack

**Segurança:**
- [ ] Spatie Permissions para RBAC
- [ ] OAuth2 além de Sanctum
- [ ] Field-level encryption (dados sensíveis)
- [ ] Security headers middleware

**Arquitetura:**
- [ ] Event Sourcing para auditoria completa
- [ ] Kafka para event streaming
- [ ] gRPC para comunicação entre microserviços
- [ ] API Gateway (Kong/Traefik)

### 13.2. Próximas Integrações

**Fontes de Dados:**
- [ ] Body cams (polícia)
- [ ] Drones (monitoramento aéreo)
- [ ] DETRAN (dados veiculares)
- [ ] PRF (rodovias federais)
- [ ] CÓRTEX (inteligência criminal)

**Conectores:**
- [ ] WebSocket real-time feed
- [ ] MQTT para IoT devices
- [ ] FTP batch import
- [ ] Webhook callbacks

### 13.3. Schema Evolution

**Versionamento de API:**
- Current: `/api/v1/*`
- Next: `/api/v2/*` (deprecation: 6 meses)

**Backward Compatibility:**
- Manter v1 por 12 meses após v2 launch
- Deprecation warnings em headers
- Migration guides documentados

---

## 14. CRITÉRIOS DE ACEITAÇÃO

### 14.1. Funcionalidade

- [ ] Sustentação de ≥6.000 passagens/min por 1 hora sem perda
- [ ] API p95 latency ≤50ms, p99 ≤80ms
- [ ] MongoDB sync lag p95 ≤1.5s
- [ ] Cache hit rate ≥92%
- [ ] Zero perda de dados em operação nominal
- [ ] Deduplicação ≥95% de duplicatas simuladas
- [ ] Backpressure funcional (HTTP 429/503 quando sobrecarga)
- [ ] Fallback MongoDB → MySQL automático

### 14.2. Qualidade

- [ ] Cobertura de testes: unit ≥80%, feature ≥70%
- [ ] PHPStan Level 6 sem erros
- [ ] PSR-12 compliance 100%
- [ ] DocBlocks completos em 100% das classes/métodos
- [ ] Mensagens em inglês 100%
- [ ] Swagger documentation completa

### 14.3. Segurança

- [ ] Input sanitization em 100% dos endpoints
- [ ] UUID validation antes de todas as queries
- [ ] Mass assignment protection configurada
- [ ] Audit logging em operações críticas
- [ ] Integridade referencial verificada antes de deletions
- [ ] Zero vulnerabilidades críticas (scan automatizado)
- [ ] Rate limiting ativo (60 reads/min, 30 writes/min)

### 14.4. Resiliência

- [ ] Falha de MongoDB → fallback MySQL sem downtime
- [ ] Falha de MySQL → WAL local + replay automático
- [ ] Falha de Redis → circuit breaker + HTTP 503
- [ ] Falha de 1 pod K8s → zero perda de requests
- [ ] Replay garantido de últimos 30 minutos
- [ ] DLQ funcional com motivo detalhado

### 14.5. Observabilidade

- [ ] Health checks funcionais (/health, /ready, /live)
- [ ] Logs JSON estruturados com trace_id
- [ ] Métricas Prometheus-compatible
- [ ] Tracing OpenTelemetry (spans principais)
- [ ] Alertas configurados (latência, throughput, erros)

---

## 15. ENTREGÁVEIS

### 15.1. Código

- [ ] Repositório Git com histórico completo
- [ ] Branches: main, staging, develop protegidos
- [ ] CI/CD pipelines configurados (GitHub Actions)
- [ ] Docker images publicadas em registry
- [ ] Helm charts para Kubernetes

### 15.2. Documentação

- [ ] README.md atualizado
- [ ] CHANGELOG.md completo (Keep a Changelog)
- [ ] Swagger/OpenAPI completo (`/api/documentation`)
- [ ] Postman collections modulares (docs/postman/collections/)
- [ ] Architecture diagrams (docs/architecture/)
- [ ] Security practices (docs/security-practices.md)
- [ ] Deployment guide (docs/deployment.md)

### 15.3. Testes

- [ ] Relatório de cobertura (≥80% unit, ≥70% feature)
- [ ] Testes de carga (Apache Bench, k6)
- [ ] Testes de caos (falhas simuladas)
- [ ] Testes de segurança (OWASP ZAP)
- [ ] Performance benchmarks

### 15.4. Infraestrutura

- [ ] Kubernetes manifests (deployment, service, hpa, ingress)
- [ ] Terraform/Helm charts
- [ ] Monitoring dashboards (Grafana)
- [ ] Alerting rules (Prometheus Alertmanager)
- [ ] Backup strategy documentada

### 15.5. Operacional

- [ ] Manual operacional (runbook)
- [ ] Incident response playbook
- [ ] Disaster recovery plan
- [ ] SLA/SLO definitions
- [ ] On-call rotation schedule

---

## 16. APÊNDICES

### 16.1. Glossário

| Termo | Definição |
|-------|-----------|
| **API-only** | Microserviço sem frontend, apenas endpoints REST |
| **Dual-database** | Arquitetura com MySQL (write) + MongoDB (read) |
| **CQRS** | Command Query Responsibility Segregation |
| **DLQ** | Dead Letter Queue - fila para eventos inválidos |
| **p95/p99** | Percentil 95/99 de latência |
| **Sanctum** | Sistema de autenticação Laravel para SPAs/mobile |
| **Observer** | Padrão Laravel para hooks de model (created, updated, deleted) |
| **Eager Loading** | Carregar relacionamentos antecipadamente (prevenir N+1) |
| **Soft Delete** | Deleção lógica (flag deleted_at, não remove do banco) |
| **WAL** | Write-Ahead Log - log para recovery |
| **Circuit Breaker** | Padrão de resiliência para falhas de dependências |

### 16.2. Referências

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [PSR-12 Coding Standard](https://www.php-fig.org/psr/psr-12/)
- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)

### 16.3. Contatos

| Função | Nome | Email | Slack |
|--------|------|-------|-------|
| **Tech Lead** | TBD | tech-lead@cconet.com | @tech-lead |
| **DevOps** | TBD | devops@cconet.com | @devops |
| **Security** | TBD | security@cconet.com | @security |
| **Product Owner** | TBD | po@cconet.com | @po |

---

## 17. HISTÓRICO DE REVISÕES

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-01-19 | GitHub Copilot | Versão inicial completa |

---

**Aprovações:**

| Função | Nome | Assinatura | Data |
|--------|------|------------|------|
| Tech Lead | _______________ | _______________ | ____/____/____ |
| DevOps | _______________ | _______________ | ____/____/____ |
| Security | _______________ | _______________ | ____/____/____ |
| Product Owner | _______________ | _______________ | ____/____/____ |

---

**Fim do Documento**
