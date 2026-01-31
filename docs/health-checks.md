# Health Checks Documentation

## Overview

Health checks provide real-time monitoring of application components and dependencies. This implementation is designed for production environments with Kubernetes orchestration support.

## Endpoints

### 1. Overall Health Check

**Endpoint:** `GET /api/v1/health`  
**Authentication:** None (public)  
**Purpose:** Comprehensive health check of all components

**Response Format:**

```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2026-01-12T14:30:00.000000Z",
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

**Status Codes:**
- `200 OK` - System is healthy or degraded
- `503 Service Unavailable` - System is unhealthy

**Status Definitions:**
- **healthy**: All components are operational
- **degraded**: Non-critical components have issues (e.g., storage >80%)
- **unhealthy**: Critical components failed (database, Redis)

### 2. Readiness Probe

**Endpoint:** `GET /api/v1/health/ready`  
**Authentication:** None (public)  
**Purpose:** Kubernetes readiness probe (can accept traffic?)

**Response Format:**

```json
{
  "status": "ready|not_ready",
  "timestamp": "2026-01-12T14:30:00.000000Z",
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
    }
  }
}
```

**Status Codes:**
- `200 OK` - Ready to accept traffic
- `503 Service Unavailable` - Not ready

**Kubernetes Configuration:**

```yaml
readinessProbe:
  httpGet:
    path: /api/v1/health/ready
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  successThreshold: 1
  failureThreshold: 3
```

### 3. Liveness Probe

**Endpoint:** `GET /api/v1/health/live`  
**Authentication:** None (public)  
**Purpose:** Kubernetes liveness probe (is application alive?)

**Response Format:**

```json
{
  "status": "alive",
  "timestamp": "2026-01-12T14:30:00.000000Z",
  "uptime": "2d 5h 30m"
}
```

**Status Codes:**
- `200 OK` - Application is alive

**Kubernetes Configuration:**

```yaml
livenessProbe:
  httpGet:
    path: /api/v1/health/live
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  successThreshold: 1
  failureThreshold: 3
```

## Component Checks

### Database (MySQL)

**Checks:**
- Connection availability
- PDO connection test
- Simple query execution (`SELECT 1`)
- Response time measurement

**Critical:** Yes (system is unhealthy if failed)

### MongoDB

**Checks:**
- MongoDB client connection
- Simple collection query
- Response time measurement

**Critical:** Yes (system is unhealthy if failed)

### Redis

**Checks:**
- Connection availability
- Write operation (`Cache::put`)
- Read operation (`Cache::get`)
- Response time measurement

**Critical:** Yes (system is unhealthy if failed)

### Queue

**Checks:**
- Queue connection availability
- Queue size retrieval
- Response time measurement

**Critical:** No (system is degraded if failed)

### Storage

**Checks:**
- Disk space availability
- Free space calculation
- Usage percentage

**Critical:** No (degraded if >80%, unhealthy if >90%)

## Testing Health Checks

### Manual Testing

**Overall Health:**
```bash
curl http://localhost:8000/api/v1/health
```

**Readiness:**
```bash
curl http://localhost:8000/api/v1/health/ready
```

**Liveness:**
```bash
curl http://localhost:8000/api/v1/health/live
```

**With Headers:**
```bash
curl -H "Accept: application/json" \
     -H "X-API-Version: 1" \
     http://localhost:8000/api/v1/health
```

### Automated Testing

**Create Feature Test:**

```php
<?php

namespace Tests\Feature\HealthCheck;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    public function test_health_endpoint_returns_200()
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'timestamp',
            'response_time',
            'checks' => [
                'database',
                'mongodb',
                'redis',
                'queue',
                'storage',
            ],
        ]);
    }

    public function test_readiness_endpoint_returns_200()
    {
        $response = $this->getJson('/api/v1/health/ready');

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'ready',
        ]);
    }

    public function test_liveness_endpoint_returns_200()
    {
        $response = $this->getJson('/api/v1/health/live');

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'alive',
        ]);
    }
}
```

## Monitoring Integration

### Prometheus

**Metrics Endpoint (Future Enhancement):**

```php
// routes/api/v1/metrics.php
Route::get('/metrics', [MetricsController::class, 'index']);
```

**Example Prometheus Config:**

```yaml
scrape_configs:
  - job_name: 'laravel-health'
    metrics_path: '/api/v1/health'
    static_configs:
      - targets: ['app:8000']
```

### Grafana

**Create Dashboard:**

1. Add Prometheus data source
2. Create panels for:
   - Overall health status (gauge)
   - Component health (table)
   - Response times (graph)
   - Storage usage (gauge)
   - Queue size (graph)

### New Relic

**Custom Events:**

```php
if (extension_loaded('newrelic')) {
    newrelic_custom_event('HealthCheck', [
        'status' => $status,
        'response_time' => $responseTime,
        'database_latency' => $dbLatency,
    ]);
}
```

## Best Practices

### DO ✅

- **Monitor regularly**: Set up automated health check monitoring (every 30s)
- **Set appropriate timeouts**: Health checks should respond quickly (<3s)
- **Use separate probes**: Use different endpoints for readiness vs liveness
- **Alert on failures**: Configure alerts for consecutive failures (3+)
- **Log health events**: Log critical health status changes
- **Test failure scenarios**: Simulate component failures during testing
- **Keep checks lightweight**: Avoid expensive operations in health checks

### DON'T ❌

- **Don't require authentication**: Health checks should be publicly accessible
- **Don't run migrations**: Health checks should only verify, not modify
- **Don't check external APIs**: Focus on internal components only
- **Don't expose sensitive data**: Keep error messages generic
- **Don't use same endpoint**: Separate readiness and liveness probes
- **Don't ignore warnings**: Act on degraded status before it becomes critical

## Troubleshooting

### Health Check Returns 503

**Possible Causes:**
1. Database connection failed
2. Redis connection failed
3. MongoDB connection failed

**Resolution:**
```bash
# Check database
php artisan tinker
>>> DB::connection('mysql')->getPdo()

# Check Redis
php artisan tinker
>>> Cache::put('test', 'ok', 10)
>>> Cache::get('test')

# Check MongoDB
php artisan tinker
>>> DB::connection('mongodb')->getMongoClient()

# Check logs
tail -f storage/logs/laravel.log
```

### Readiness Probe Failing in Kubernetes

**Possible Causes:**
1. Application not fully started
2. Database migrations pending
3. Initial data seeding incomplete

**Resolution:**
```bash
# Increase initialDelaySeconds
kubectl edit deployment/laravel-app

# Check pod logs
kubectl logs pod/laravel-app-xxx

# Check events
kubectl describe pod/laravel-app-xxx
```

### Liveness Probe Failing (Restart Loop)

**Possible Causes:**
1. Application deadlock
2. Memory leak
3. Timeout too aggressive

**Resolution:**
```bash
# Check resource usage
kubectl top pod/laravel-app-xxx

# Check logs before restart
kubectl logs --previous pod/laravel-app-xxx

# Increase timeout and period
kubectl edit deployment/laravel-app
```

## Security Considerations

### Public Endpoints

Health check endpoints are **intentionally public** (no authentication required) because:
- Kubernetes needs access before authentication is initialized
- Monitoring tools need rapid access without token management
- Load balancers need quick health verification

### Information Disclosure

**Safe to Expose:**
- Component status (healthy/unhealthy)
- Response times
- Uptime
- Storage usage

**Never Expose:**
- Database credentials
- Connection strings
- Internal IP addresses
- Stack traces
- Detailed error messages

**Current Implementation:**
```php
// ✅ SAFE
return [
    'status' => 'unhealthy',
    'message' => 'Database connection failed',
];

// ❌ UNSAFE
return [
    'status' => 'unhealthy',
    'error' => 'Connection refused to 10.0.0.5:3306',
    'trace' => $e->getTraceAsString(),
];
```

## Production Checklist

Before deploying health checks to production:

- [ ] Test all endpoints return correct status codes
- [ ] Verify Kubernetes probes configured with appropriate timeouts
- [ ] Set up monitoring alerts (PagerDuty, Slack, email)
- [ ] Configure Grafana dashboards for visualization
- [ ] Test failure scenarios (stop database, Redis, etc.)
- [ ] Document runbook for health check failures
- [ ] Train ops team on health check interpretation
- [ ] Set up log aggregation for health events
- [ ] Configure rate limiting if needed (prevent DDoS)
- [ ] Test health checks under load (stress testing)

## Future Enhancements

### 1. Circuit Breaker Pattern

Automatically disable failing components temporarily:

```php
if ($failureCount > 3) {
    CircuitBreaker::open('database');
    // Redirect traffic to read-only MongoDB
}
```

### 2. Detailed Metrics

Add more granular metrics:
- Active connections count
- Query execution time (p95, p99)
- Cache hit rate
- Queue processing rate

### 3. Dependency Graph

Visualize component dependencies:
```
API → Database (critical)
    → MongoDB (degraded fallback)
    → Redis (critical)
    → Queue (optional)
```

### 4. Health Check History

Store historical health data:
```php
HealthCheckHistory::create([
    'timestamp' => now(),
    'status' => 'healthy',
    'response_time' => 25.5,
    'components' => json_encode($checks),
]);
```

### 5. Custom Component Checks

Allow registration of custom checkers:
```php
HealthCheckService::register('kafka', KafkaHealthChecker::class);
```

## References

- [Kubernetes Liveness and Readiness Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Health Check Response Format for HTTP APIs (RFC)](https://datatracker.ietf.org/doc/html/draft-inadarei-api-health-check)
- [Microservices Health Check Best Practices](https://microservices.io/patterns/observability/health-check-api.html)
- [Laravel Health Check Package](https://github.com/spatie/laravel-health)

## Support

For issues or questions about health checks:
- Email: dev@cconet.com
- Slack: #cconet-support
- Documentation: /docs/health-checks.md
