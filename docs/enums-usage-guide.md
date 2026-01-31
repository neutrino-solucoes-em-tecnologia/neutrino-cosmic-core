# PHP 8.2+ Enums Usage Guide

## Overview

This project uses PHP 8.2+ Enums for type-safe constants and predefined values. Enums provide compile-time type checking, better IDE support, and eliminate magic strings.

## Available Enums

### 1. AuditAction

**Location:** `App\Enums\AuditAction`

Defines all audit log actions in the system.

```php
use App\Enums\AuditAction;

// Basic usage
$action = AuditAction::CREATED;
echo $action->value; // 'created'

// Type-safe method parameters
public function auditLog(AuditAction $action, string $entity, int $recordId): void
{
    Log::info("Audit: {$action->value}", [
        'action' => $action->value,
        'entity' => $entity,
        'record_id' => $recordId,
    ]);
}

// Usage
$this->auditLog(AuditAction::CREATED, 'vehicle_model', $model->id);
$this->auditLog(AuditAction::FORCE_DELETED, 'user', $user->id);

// Helper methods
$action = AuditAction::CREATED;
$action->label();        // 'Created'
$action->isMutation();   // true
$action->isCritical();   // false

$action = AuditAction::FORCE_DELETED;
$action->isCritical();   // true
```

**Available Actions:**
- `CREATED` - Record created
- `UPDATED` - Record updated
- `DELETED` - Soft deleted
- `RESTORED` - Restored from soft delete
- `FORCE_DELETED` - Permanently deleted
- `VIEWED` - Viewed (read-only)
- `EXPORTED` - Data exported
- `IMPORTED` - Data imported
- `SYNCED` - Synced to external system

---

### 2. CacheTag

**Location:** `App\Enums\CacheTag`

Defines cache tags for bulk invalidation.

```php
use App\Enums\CacheTag;

// Basic usage with Laravel Cache
Cache::tags([CacheTag::USERS->value])->put('user:1', $user, 3600);

// Retrieve
$user = Cache::tags([CacheTag::USERS->value])->get('user:1');

// Flush all users cache
Cache::tags([CacheTag::USERS->value])->flush();

// Multiple tags
Cache::tags([
    CacheTag::VEHICLES->value,
    CacheTag::VEHICLE_MODELS->value
])->put('vehicle:list', $vehicles, 1800);

// Helper methods
$tag = CacheTag::USERS;
$ttl = $tag->getTTL();              // 1800 (30 minutes)
$related = $tag->getRelatedTags();  // []
$aggressive = $tag->isAggressivelyCached(); // false

// Reference data example
$tag = CacheTag::COUNTRIES;
$ttl = $tag->getTTL();              // 86400 (24 hours)
$aggressive = $tag->isAggressivelyCached(); // true

// Smart cache invalidation with related tags
function clearVehicleModelCache(string $uuid): void
{
    $tag = CacheTag::VEHICLE_MODELS;
    
    // Clear main tag
    Cache::tags([$tag->value])->flush();
    
    // Clear related tags (vehicles, vehicle_passages)
    foreach ($tag->getRelatedTags() as $relatedTag) {
        Cache::tags([$relatedTag->value])->flush();
    }
}
```

**Available Tags:**
- `USERS` - User data (TTL: 30min)
- `VEHICLES` - Vehicle records (TTL: 30min)
- `VEHICLE_MODELS` - Vehicle models (TTL: 1h)
- `VEHICLE_PASSAGES` - Passage records (TTL: 5min)
- `VEHICLE_TYPES` - Vehicle types (TTL: 24h)
- `MARKS` - Vehicle brands (TTL: 1h)
- `COUNTRIES` - Countries (TTL: 24h)
- And more...

---

### 3. HealthStatus

**Location:** `App\Enums\HealthStatus`

Defines health check status levels.

```php
use App\Enums\HealthStatus;

// Basic usage
$status = HealthStatus::HEALTHY;
echo $status->value; // 'healthy'

// In HealthCheckService
public function checkDatabase(): array
{
    try {
        DB::connection('mysql')->getPdo();
        
        return [
            'status' => HealthStatus::HEALTHY->value,
            'message' => 'MySQL connection is healthy',
        ];
    } catch (\Throwable $e) {
        return [
            'status' => HealthStatus::UNHEALTHY->value,
            'message' => 'MySQL connection failed',
            'error' => $e->getMessage(),
        ];
    }
}

// Helper methods
$status = HealthStatus::HEALTHY;
$status->getHttpStatusCode();  // 200
$status->isOperational();      // true
$status->emoji();              // '✅'
$status->color();              // 'green'

$status = HealthStatus::DEGRADED;
$status->getHttpStatusCode();  // 200
$status->isOperational();      // true
$status->emoji();              // '⚠️'
$status->color();              // 'yellow'

$status = HealthStatus::UNHEALTHY;
$status->getHttpStatusCode();  // 503
$status->isOperational();      // false
$status->emoji();              // '❌'
$status->color();              // 'red'
```

**Available Statuses:**
- `HEALTHY` - All systems operational
- `DEGRADED` - Some non-critical issues
- `UNHEALTHY` - Critical systems down
- `READY` - Ready to accept traffic (K8s)
- `NOT_READY` - Not ready for traffic
- `ALIVE` - Application is alive (K8s)

---

### 4. DatabaseConnection

**Location:** `App\Enums\DatabaseConnection`

Defines available database connections.

```php
use App\Enums\DatabaseConnection;
use Illuminate\Support\Facades\DB;

// Basic usage
$connection = DatabaseConnection::MYSQL;
echo $connection->value; // 'mysql'

// Use with Laravel DB facade
DB::connection($connection->value)->table('users')->get();

// Or shorter
DB::connection(DatabaseConnection::MYSQL->value)->select('SELECT 1');
DB::connection(DatabaseConnection::MONGODB->value)->collection('vehicles')->get();

// Helper methods
$connection = DatabaseConnection::MONGODB;
$connection->isNoSQL();        // true
$connection->isRelational();   // false
$connection->defaultPort();    // 27017

$connection = DatabaseConnection::MYSQL;
$connection->isRelational();   // true
$connection->defaultPort();    // 3306

// Type-safe method parameters
public function syncData(DatabaseConnection $from, DatabaseConnection $to): void
{
    $data = DB::connection($from->value)->table('vehicles')->get();
    
    foreach ($data as $record) {
        if ($to->isNoSQL()) {
            DB::connection($to->value)->collection('vehicles')->insert((array) $record);
        } else {
            DB::connection($to->value)->table('vehicles')->insert((array) $record);
        }
    }
}
```

**Available Connections:**
- `MYSQL` - Primary relational database
- `MONGODB` - NoSQL document database
- `SQLITE` - Testing/development database

---

### 5. QueueName

**Location:** `App\Enums\QueueName`

Defines queue names for job prioritization.

```php
use App\Enums\QueueName;

// Dispatching jobs to specific queues
ProcessVehiclePassage::dispatch($data)->onQueue(QueueName::HIGH->value);
SendEmailNotification::dispatch($user)->onQueue(QueueName::EMAILS->value);
ExportReport::dispatch($request)->onQueue(QueueName::EXPORTS->value);

// Job class with queue specified
class ProcessVehiclePassage implements ShouldQueue
{
    public string $queue = QueueName::HIGH->value;
    
    public function handle(): void
    {
        // Processing logic
    }
}

// Helper methods
$queue = QueueName::HIGH;
$queue->priority();           // 10 (highest)
$queue->recommendedWorkers(); // 5 workers
$queue->timeout();            // 60 seconds

$queue = QueueName::EXPORTS;
$queue->priority();           // 2 (low)
$queue->recommendedWorkers(); // 1 worker
$queue->timeout();            // 600 seconds (10 min)

// Worker configuration based on enum
php artisan queue:work --queue=high,default,low --timeout=120

// Or dynamically
$queue = QueueName::HIGH;
$command = sprintf(
    'php artisan queue:work --queue=%s --timeout=%d',
    $queue->value,
    $queue->timeout()
);
```

**Available Queues:**
- `HIGH` - Critical/urgent jobs (priority: 10, timeout: 60s)
- `NOTIFICATIONS` - User notifications (priority: 8, timeout: 60s)
- `EMAILS` - Email sending (priority: 8, timeout: 60s)
- `SYNC` - Data synchronization (priority: 7, timeout: 120s)
- `DEFAULT` - Standard jobs (priority: 5, timeout: 120s)
- `IMPORTS` - Data imports (priority: 3, timeout: 300s)
- `EXPORTS` - Data exports (priority: 2, timeout: 600s)
- `LOW` - Background tasks (priority: 1, timeout: 180s)

---

## Best Practices

### ✅ DO

```php
// Use enums for type safety
public function processAction(AuditAction $action): void
{
    // Compiler ensures $action is valid
}

// Use match expressions with enums
$message = match ($status) {
    HealthStatus::HEALTHY => 'All systems operational',
    HealthStatus::DEGRADED => 'Some issues detected',
    HealthStatus::UNHEALTHY => 'Critical systems down',
};

// Use enum helper methods
if ($action->isCritical()) {
    $this->sendAlert($action);
}

// Type hint in constructors
public function __construct(
    private DatabaseConnection $connection,
    private QueueName $queue
) {}
```

### ❌ DON'T

```php
// Don't use magic strings
$this->auditLog('created', 'user', 1); // ❌ No type safety

// Don't hardcode values
Cache::tags(['users'])->flush(); // ❌ Typos possible

// Don't use if/else chains
if ($status === 'healthy') { } // ❌ No compile-time check
elseif ($status === 'unhealthy') { }

// Don't bypass enums
$action = 'deleted'; // ❌ String instead of enum
```

---

## Migration Guide

### Before (Magic Strings)

```php
// Old code
$this->auditLog('created', 'vehicle_model', $model->id);
Cache::tags(['vehicle_models'])->flush();

if ($status === 'healthy') {
    return 200;
} elseif ($status === 'unhealthy') {
    return 503;
}
```

### After (Type-Safe Enums)

```php
// New code
$this->auditLog(AuditAction::CREATED, 'vehicle_model', $model->id);
Cache::tags([CacheTag::VEHICLE_MODELS->value])->flush();

$statusCode = match ($status) {
    HealthStatus::HEALTHY, HealthStatus::DEGRADED => 200,
    HealthStatus::UNHEALTHY, HealthStatus::NOT_READY => 503,
};
```

---

## Testing with Enums

```php
use App\Enums\AuditAction;
use App\Enums\HealthStatus;

class AuditServiceTest extends TestCase
{
    public function test_audit_log_with_enum()
    {
        $service = new AuditService();
        
        // Test with enum
        $service->log(AuditAction::CREATED, 'user', 1);
        
        // Assert
        $this->assertDatabaseHas('audit_logs', [
            'action' => AuditAction::CREATED->value,
            'entity' => 'user',
        ]);
    }
    
    public function test_enum_helper_methods()
    {
        $this->assertTrue(AuditAction::CREATED->isMutation());
        $this->assertFalse(AuditAction::VIEWED->isMutation());
        $this->assertTrue(AuditAction::FORCE_DELETED->isCritical());
    }
}
```

---

## IDE Support

Modern IDEs provide excellent support for enums:

- **Autocomplete**: IDE suggests all available enum cases
- **Type checking**: IDE warns if invalid value is used
- **Go to definition**: Jump to enum definition
- **Find usages**: Find all uses of specific enum case
- **Refactoring**: Safe renaming with IDE refactoring tools

---

## Performance

Enums have **zero performance overhead**:
- Compiled to regular string values at runtime
- No reflection or dynamic lookups
- Same performance as string constants
- Better memory usage (shared instances)

---

## Documentation

Each enum includes:
- ✅ Complete DocBlocks
- ✅ Helper methods with clear purpose
- ✅ Usage examples in method comments
- ✅ Type hints in all method signatures

---

## Further Reading

- [PHP 8.1+ Enumerations](https://www.php.net/manual/en/language.enumerations.php)
- [Laravel Enum Validation](https://laravel.com/docs/12.x/validation#rule-enum)
- [PHPStan Enum Support](https://phpstan.org/blog/enums-without-phpdoc)
