# Security Practices - Vehicle Passage Processing Microservice

## Overview
This document outlines the security practices implemented in the microservice to protect against common vulnerabilities and ensure data integrity.

## 1. Input Validation & Sanitization

### Validation
All input data is validated using Laravel's Validator before processing:
- **Type validation**: Ensures correct data types (string, integer, UUID)
- **Length validation**: Enforces maximum lengths to prevent buffer overflow
- **Foreign key validation**: Verifies references exist (`exists:table,column`)
- **Required fields**: Ensures mandatory data is provided

```php
Validator::make($data, [
    'canonical_name' => 'required|string|max:255',
    'mark_id' => 'required|integer|exists:marks,id',
    'display_name' => 'nullable|string|max:255',
]);
```

### Sanitization
The `sanitizeInputData()` method protects against XSS attacks:
- **Trim whitespace**: Removes leading/trailing spaces
- **Strip HTML tags**: Uses `strip_tags()` to remove HTML/PHP tags
- **Recursive sanitization**: Handles nested arrays
- **Type preservation**: Keeps integers, booleans, null as-is

```php
protected function sanitizeInputData(array $data): array
{
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $sanitized[$key] = strip_tags(trim($value));
        }
    }
    return $sanitized;
}
```

## 2. SQL Injection Protection

### Eloquent ORM
All database operations use Laravel Eloquent ORM with parameter binding:
- **No raw SQL**: Avoids string concatenation in queries
- **Parameter binding**: Eloquent automatically uses prepared statements
- **Type safety**: UUID validation before queries

```php
// Safe - uses parameter binding
VehicleModel::where('uuid', $uuid)->first();

// Never do this - vulnerable to SQL injection
// DB::select("SELECT * FROM vehicle_models WHERE uuid = '$uuid'");
```

### UUID Validation
The `isValidUuid()` method validates format before database operations:
- Uses `Ramsey\Uuid\Uuid::isValid()` for strict validation
- Prevents malformed UUIDs from reaching the database
- Returns `400 Bad Request` for invalid formats

```php
if (!$this->isValidUuid($uuid)) {
    return $this->badRequestResponse('Invalid UUID format');
}
```

## 3. Mass Assignment Protection

### Field Whitelisting
Only explicitly allowed fields can be assigned:

```php
$allowedFields = ['canonical_name', 'display_name', 'mark_id', 'country_id'];
$data = array_intersect_key($data, array_flip($allowedFields));
```

### Protected Fields
Critical fields are blocked from updates:

```php
$protectedFields = ['uuid', 'id', 'created_at'];
foreach ($protectedFields as $field) {
    unset($data[$field]);
}
```

### Model Configuration
Ensure models define `$fillable` or `$guarded`:

```php
// In VehicleModel.php
protected $fillable = ['uuid', 'canonical_name', 'display_name', 'mark_id', 'country_id'];
```

## 4. Database Transactions

All mutations use database transactions for ACID properties:
- **Atomicity**: All-or-nothing operations
- **Consistency**: Data integrity maintained
- **Isolation**: Concurrent operations don't interfere
- **Durability**: Changes persist after commit

```php
DB::transaction(function () use ($data) {
    $model = VehicleModel::create($data);
    $this->auditLog('vehicle_model.created', $model->id, [...]);
    return $model;
});
```

## 5. Audit Logging

### Security Tracking
The `auditLog()` method tracks critical operations:
- **Who**: User ID from authentication
- **What**: Action performed (created, updated, deleted)
- **When**: Timestamp in ISO 8601 format
- **Where**: IP address and user agent
- **Context**: Relevant data (UUIDs, changes)

```php
$this->auditLog('vehicle_model.created', $model->id, [
    'uuid' => $model->uuid,
    'canonical_name' => $model->canonical_name,
]);
```

### Log Levels
Different severity levels for different operations:
- **info**: Regular operations (create, update, read)
- **warning**: Suspicious activities
- **critical**: Destructive operations (force delete)

### Audit Trail Example
```json
{
    "action": "vehicle_model.force_deleted",
    "record_id": null,
    "user_id": 123,
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "timestamp": "2026-01-07T10:30:45+00:00",
    "data": {
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "canonical_name": "Model X",
        "was_trashed": true
    }
}
```

## 6. Authorization (TODO)

### Current State
Authorization structure is in place but not yet enforced:

```php
// TODO: Implement Spatie Permission check
// if (!Auth::user()->can('delete-vehicle-models')) {
//     return $this->forbiddenResponse('Insufficient permissions');
// }
```

### Planned Implementation
1. Install `spatie/laravel-permission`
2. Define roles and permissions in database
3. Assign permissions to users/roles
4. Enforce in service methods or middleware
5. Add permission checks in Form Requests

### Recommended Permissions
- `view-vehicle-models`: List and view details
- `create-vehicle-models`: Create new records
- `update-vehicle-models`: Modify existing records
- `delete-vehicle-models`: Soft delete records
- `restore-vehicle-models`: Restore soft deleted
- `force-delete-vehicle-models`: Permanent deletion (admin only)

## 7. Rate Limiting

### Controller Level
Rate limiting is enforced at the route level:

```php
// In routes/api.php
Route::get('/vehicle-models', [VehicleModelController::class, 'index'])
    ->middleware('throttle:60,1'); // 60 requests per minute

Route::post('/vehicle-models', [VehicleModelController::class, 'store'])
    ->middleware('throttle:30,1'); // 30 requests per minute

Route::delete('/vehicle-models/{uuid}', [VehicleModelController::class, 'destroy'])
    ->middleware('throttle:30,1'); // 30 requests per minute
```

### Recommended Limits
- **Read operations**: 60 requests/minute
- **Write operations**: 30 requests/minute
- **Delete operations**: 30 requests/minute
- **Force delete**: 10 requests/minute (higher sensitivity)

## 8. Error Handling

### No Internal Details Exposure
Generic error messages for production:

```php
// Good - Generic message
return $this->errorResponse('Error creating vehicle model');

// Bad - Exposes internals
return $this->errorResponse("MySQL error: Duplicate entry 'xyz' for key 'PRIMARY'");
```

### Detailed Logging
Full error details logged for debugging:

```php
Log::error('Error creating vehicle model', [
    'error' => $e->getMessage(),
    'trace' => $e->getTraceAsString(),
    'data' => $data, // Never log passwords, tokens!
]);
```

### HTTP Status Codes
Appropriate status codes for different scenarios:
- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid UUID or malformed request
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `422 Unprocessable Entity`: Validation failed
- `500 Internal Server Error`: Server error

## 9. Cache Security

### Cache Invalidation
The `clearModelCache()` method ensures data consistency:
- Clears caches after mutations (update, delete, restore)
- Prevents stale data from being served
- Uses predictable cache key patterns

```php
protected function clearModelCache(string $uuid): void
{
    Cache::forget("vehicle_model:{$uuid}");
    Cache::forget("vehicle_model:list");
    Cache::forget("vehicle_models:all");
}
```

### Cache Key Isolation
Use namespaced cache keys to prevent collisions:
- `vehicle_model:{uuid}`: Single record
- `vehicle_model:list`: Paginated lists
- `vehicle_models:all`: Full collection

## 10. Referential Integrity

### Foreign Key Checks
The service implements comprehensive referential integrity checks to prevent orphaned data:

```php
// Check if vehicle model is in use before deletion
if ($this->isVehicleModelInUse($vehicleModel->id)) {
    $usageCount = $this->getVehicleModelUsageCount($vehicleModel->id);
    return $this->badRequestResponse(
        "Cannot delete vehicle model. It is currently used by {$usageCount} vehicle(s)."
    );
}
```

### Deletion Safety Levels

#### Soft Delete (Safe)
- Checks only **active vehicles** (non-soft-deleted)
- Allows deletion if only soft-deleted vehicles exist
- Can be reversed with restore operation
- Maintains data for historical queries

```php
// Soft delete checks active vehicles only
$this->isVehicleModelInUse($vehicleModelId); // excludes soft-deleted
```

#### Force Delete (Critical)
- Checks **ALL vehicles** (active + soft-deleted)
- Requires zero references for permanent deletion
- Irreversible operation
- Logged with 'critical' severity level

```php
// Force delete checks ALL vehicles
$this->getVehicleModelUsageCount($vehicleModelId, true); // includes soft-deleted
```

### Usage Tracking Methods

```php
// Check if model is in use (boolean)
protected function isVehicleModelInUse(int $vehicleModelId, bool $includeTrashed = false): bool

// Get count of vehicles using the model
protected function getVehicleModelUsageCount(int $vehicleModelId, bool $includeTrashed = false): int

// Get detailed breakdown of usage
protected function getVehicleModelUsageDetails(int $vehicleModelId): array
// Returns: ['active' => 5, 'trashed' => 2, 'total' => 7]
```

### Error Messages
Provide actionable guidance when deletion is prevented:

```
"Cannot delete vehicle model. It is currently used by 3 vehicle(s). 
Please reassign or delete those vehicles first."
```

### Database Relationships
All foreign keys should be properly indexed and constrained:

```sql
-- Recommended foreign key configuration
ALTER TABLE vehicles 
ADD CONSTRAINT fk_vehicles_model_id 
FOREIGN KEY (model_id) 
REFERENCES vehicle_models(id) 
ON DELETE RESTRICT;
```

## 11. Additional Security Measures

### HTTPS Only
Enforce HTTPS in production (`AppServiceProvider`):

```php
if (app()->environment('production')) {
    URL::forceScheme('https');
}
```

### CORS Configuration
Restrict cross-origin requests in `config/cors.php`:

```php
'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'https://app.example.com')),
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

### Laravel Sanctum
API token authentication configured:
- Token-based authentication
- Token abilities/scopes for fine-grained control
- Token expiration

### Database Backup
Regular backups for disaster recovery:
- Automated daily backups
- Encrypted backup storage
- Tested restore procedures

## 12. Security Checklist

Before deploying to production:

- [ ] All environment variables set (`.env`)
- [ ] `APP_DEBUG=false` in production
- [ ] HTTPS enforced
- [ ] CORS properly configured (no wildcards)
- [ ] Rate limiting enabled on all routes
- [ ] Database credentials rotated
- [ ] Sanctum tokens use secure generation
- [ ] Authorization checks implemented
- [ ] Audit logs monitored
- [ ] Error monitoring configured (e.g., Sentry)
- [ ] Security headers configured (CSP, X-Frame-Options)
- [ ] Database backups automated
- [ ] Dependency vulnerabilities scanned (`composer audit`)
- [ ] SQL injection tests passed
- [ ] XSS protection tests passed
- [ ] Referential integrity checks implemented
- [ ] Foreign key constraints enforced

## 13. Security Incident Response

### Detection
Monitor logs for suspicious activities:
- Multiple failed authentication attempts
- Unusual API usage patterns
- Unexpected error spikes
- Audit log anomalies

### Response Steps
1. **Isolate**: Temporarily disable affected endpoints
2. **Investigate**: Review audit logs and error traces
3. **Contain**: Block malicious IPs, revoke tokens
4. **Remediate**: Fix vulnerabilities, deploy patches
5. **Document**: Record incident details and lessons learned
6. **Notify**: Inform stakeholders if data breach occurred

## 14. Regular Security Maintenance

### Monthly Tasks
- Review audit logs for anomalies
- Update dependencies (`composer update`)
- Scan for vulnerabilities (`composer audit`)
- Review and rotate API tokens

### Quarterly Tasks
- Security code review
- Penetration testing
- Update security documentation
- Review and update permissions

### Annual Tasks
- Full security audit
- Update security policies
- Review disaster recovery plan
- Security training for team

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security Best Practices](https://laravel.com/docs/security)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [CWE Top 25 Most Dangerous Software Weaknesses](https://cwe.mitre.org/top25/)
