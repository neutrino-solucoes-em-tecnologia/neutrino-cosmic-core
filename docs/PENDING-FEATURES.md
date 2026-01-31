# Pending Features - Resources to Implement

This document tracks all database resources (based on migrations) that still need CRUD implementation.

**Last Updated:** January 12, 2026  
**Status:** 7/35 resources implemented (20%)

---

## ✅ Implemented Resources (7)

### Authentication & Users
- [x] **Users** - Complete CRUD (7 endpoints)
- [x] **Personal Access Tokens** - Managed by Sanctum

### Locations
- [x] **Countries** - Complete CRUD (7 endpoints)

### Vehicles
- [x] **Vehicles** - Complete CRUD (7 endpoints)
- [x] **Vehicle Models** - Complete CRUD (7 endpoints)
- [x] **Vehicle Passages** - Complete CRUD (7 endpoints)

### System
- [x] **Health Checks** - 3 endpoints (health, ready, live)

---

## 🔴 Pending Implementation (28 resources)

### High Priority - Core Vehicle Resources

#### 1. Marks (Vehicle Brands)
- **Table:** `marks`
- **Model:** `App\Models\Vehicles\Mark`
- **Priority:** HIGH
- **Dependencies:** None
- **Used By:** VehicleModel, Vehicle
- **Endpoints Needed:**
  - GET /api/marks - List with pagination/filters
  - GET /api/marks/{uuid} - Show single mark
  - POST /api/marks - Create new mark
  - PUT /api/marks/{uuid} - Update mark
  - DELETE /api/marks/{uuid} - Soft delete
  - POST /api/marks/{uuid}/restore - Restore deleted
  - DELETE /api/marks/{uuid}/force - Force delete
- **Estimated Effort:** 4 hours

#### 2. Mark Aliases
- **Table:** `mark_aliases`
- **Model:** `App\Models\Vehicles\MarkAlias`
- **Priority:** HIGH
- **Dependencies:** Marks
- **Used By:** Vehicle search/normalization
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 3. Vehicle Types
- **Table:** `vehicle_types`
- **Model:** `App\Models\Vehicles\VehicleType`
- **Priority:** HIGH
- **Dependencies:** None
- **Used By:** Vehicle, VehicleModel
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 4. Vehicle Type Aliases
- **Table:** `vehicle_type_aliases`
- **Model:** `App\Models\Vehicles\VehicleTypeAlias`
- **Priority:** HIGH
- **Dependencies:** VehicleTypes
- **Used By:** Vehicle search/normalization
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 5. Colors
- **Table:** `colors`
- **Model:** `App\Models\Common\Color`
- **Priority:** HIGH
- **Dependencies:** None
- **Used By:** Vehicle
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 6. Color Aliases
- **Table:** `color_aliases`
- **Model:** `App\Models\Common\ColorAlias`
- **Priority:** HIGH
- **Dependencies:** Colors
- **Used By:** Vehicle search/normalization
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

---

### High Priority - Geographic Hierarchy

#### 7. Regions
- **Table:** `regions`
- **Model:** `App\Models\Locations\Region`
- **Priority:** HIGH
- **Dependencies:** Country
- **Used By:** State
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 8. States
- **Table:** `states`
- **Model:** `App\Models\Locations\State`
- **Priority:** HIGH
- **Dependencies:** Country, Region
- **Used By:** City, VehiclePassage
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 9. Mesoregions
- **Table:** `mesoregions`
- **Model:** `App\Models\Locations\Mesoregion`
- **Priority:** MEDIUM
- **Dependencies:** State
- **Used By:** Microregion
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 10. Microregions
- **Table:** `microregions`
- **Model:** `App\Models\Locations\Microregion`
- **Priority:** MEDIUM
- **Dependencies:** Mesoregion
- **Used By:** City
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 11. Cities
- **Table:** `cities`
- **Model:** `App\Models\Locations\City`
- **Priority:** HIGH
- **Dependencies:** State, Microregion
- **Used By:** District, VehiclePassage
- **Endpoints Needed:** 7 CRUD endpoints
- **Special:** Large dataset (5,570 municipalities)
- **Estimated Effort:** 4 hours

#### 12. Districts
- **Table:** `districts`
- **Model:** `App\Models\Locations\District`
- **Priority:** LOW
- **Dependencies:** City
- **Used By:** SubDistrict
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 13. SubDistricts
- **Table:** `sub_districts`
- **Model:** `App\Models\Locations\SubDistrict`
- **Priority:** LOW
- **Dependencies:** District
- **Used By:** None (leaf node)
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

---

### Medium Priority - Equipment & Clients

#### 14. Equipaments
- **Table:** `equipaments`
- **Model:** `App\Models\Common\Equipament`
- **Priority:** MEDIUM
- **Dependencies:** None
- **Used By:** VehiclePassage
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 15. Clients
- **Table:** `clients`
- **Model:** `App\Models\Clients\Client`
- **Priority:** MEDIUM
- **Dependencies:** None
- **Used By:** VehiclePassage, ClientIntegration
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 4 hours

#### 16. Client Integrations
- **Table:** `client_integrations`
- **Model:** `App\Models\Clients\ClientIntegration`
- **Priority:** MEDIUM
- **Dependencies:** Client
- **Used By:** External API integrations
- **Endpoints Needed:** 7 CRUD endpoints
- **Special:** Contains API credentials (sensitive data)
- **Estimated Effort:** 4 hours

---

### Medium Priority - Person Management

#### 17. Persons
- **Table:** `persons`
- **Model:** `App\Models\Persons\Person`
- **Priority:** MEDIUM
- **Dependencies:** None
- **Used By:** PersonDocument, PersonAddress, PersonMonitoringType
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 4 hours

#### 18. Person Documents
- **Table:** `person_documents`
- **Model:** `App\Models\Persons\PersonDocument`
- **Priority:** MEDIUM
- **Dependencies:** Person
- **Used By:** Person identification
- **Endpoints Needed:** 7 CRUD endpoints
- **Special:** Multiple document types per person (CPF, RG, CNH, Passport)
- **Estimated Effort:** 4 hours

#### 19. Person Addresses
- **Table:** `person_addresses`
- **Model:** `App\Models\Persons\PersonAddress`
- **Priority:** MEDIUM
- **Dependencies:** Person, City
- **Used By:** Person location tracking
- **Endpoints Needed:** 7 CRUD endpoints
- **Special:** Geolocation support (latitude, longitude)
- **Estimated Effort:** 4 hours

---

### Low Priority - Monitoring Systems

#### 20. Vehicle Monitoring Types
- **Table:** `vehicle_monitoring_types`
- **Model:** `App\Models\Vehicles\VehicleMonitoringType`
- **Priority:** LOW
- **Dependencies:** None
- **Used By:** VehicleMonitoring
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 21. Vehicle Monitoring
- **Table:** `vehicle_monitoring`
- **Model:** `App\Models\Vehicles\VehicleMonitoring`
- **Priority:** LOW
- **Dependencies:** Vehicle, VehicleMonitoringType
- **Used By:** Monitoring notifications
- **Endpoints Needed:** 7 CRUD endpoints
- **Special:** Notification channels (email, SMS, WhatsApp, push)
- **Estimated Effort:** 5 hours

#### 22. Vehicle Monitoring Notifications
- **Table:** `vehicle_monitoring_notifications`
- **Model:** `App\Models\Vehicles\VehicleMonitoringNotification`
- **Priority:** LOW
- **Dependencies:** VehicleMonitoring
- **Used By:** Notification history
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 4 hours

#### 23. Vehicle Whitelists
- **Table:** `vehicle_whitelists`
- **Model:** `App\Models\Vehicles\VehicleWhitelist`
- **Priority:** LOW
- **Dependencies:** Vehicle
- **Used By:** Monitoring bypass logic
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 3 hours

#### 24. Person Monitoring Types
- **Table:** `person_monitoring_types`
- **Model:** `App\Models\Persons\PersonMonitoringType`
- **Priority:** LOW
- **Dependencies:** Person
- **Used By:** Person monitoring
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 4 hours

#### 25. Person Monitoring Type Notifications
- **Table:** `person_monitoring_type_notifications`
- **Model:** `App\Models\Persons\PersonMonitoringTypeNotification`
- **Priority:** LOW
- **Dependencies:** PersonMonitoringType
- **Used By:** Notification history
- **Endpoints Needed:** 7 CRUD endpoints
- **Estimated Effort:** 4 hours

---

### System Tables (No CRUD Needed)

#### 26. Cache Table
- **Table:** `cache`
- **Purpose:** Laravel cache storage
- **Action:** No CRUD needed (managed by Laravel)

#### 27. Jobs Table
- **Table:** `jobs`
- **Purpose:** Queue jobs storage
- **Action:** No CRUD needed (managed by Laravel Queue)

#### 28. Failed Jobs Table
- **Table:** `failed_jobs`
- **Purpose:** Failed queue jobs
- **Action:** No CRUD needed (managed by Laravel Queue)

---

## 📊 Implementation Summary

### By Priority

| Priority | Resources | Estimated Hours |
|----------|-----------|-----------------|
| HIGH | 11 resources | 37 hours |
| MEDIUM | 9 resources | 34 hours |
| LOW | 8 resources | 30 hours |
| **TOTAL** | **28 resources** | **101 hours** |

### By Domain

| Domain | Resources | Status |
|--------|-----------|--------|
| **Vehicles** | 10 total | 3 done (30%) |
| **Locations** | 8 total | 1 done (12.5%) |
| **Persons** | 6 total | 1 done (16.7%) |
| **Common** | 3 total | 0 done (0%) |
| **Clients** | 2 total | 0 done (0%) |
| **System** | 6 total | 1 done (16.7%) |

### Implementation Phases (Recommended Order)

#### Phase 1: Core Vehicle Resources (HIGH Priority - Week 1-2)
1. Marks + Mark Aliases (7 hours)
2. Vehicle Types + Type Aliases (6 hours)
3. Colors + Color Aliases (6 hours)

**Total Phase 1:** 19 hours

#### Phase 2: Geographic Hierarchy (HIGH Priority - Week 2-3)
4. Regions (3 hours)
5. States (3 hours)
6. Cities (4 hours)

**Total Phase 2:** 10 hours

#### Phase 3: Equipment & Clients (MEDIUM Priority - Week 3-4)
7. Equipaments (3 hours)
8. Clients (4 hours)
9. Client Integrations (4 hours)

**Total Phase 3:** 11 hours

#### Phase 4: Person Management (MEDIUM Priority - Week 4-5)
10. Persons (4 hours)
11. Person Documents (4 hours)
12. Person Addresses (4 hours)

**Total Phase 4:** 12 hours

#### Phase 5: Extended Locations (MEDIUM/LOW Priority - Week 5-6)
13. Mesoregions (3 hours)
14. Microregions (3 hours)
15. Districts (3 hours)
16. SubDistricts (3 hours)

**Total Phase 5:** 12 hours

#### Phase 6: Monitoring Systems (LOW Priority - Week 6-8)
17. Vehicle Monitoring Types (3 hours)
18. Vehicle Monitoring (5 hours)
19. Vehicle Monitoring Notifications (4 hours)
20. Vehicle Whitelists (3 hours)
21. Person Monitoring Types (4 hours)
22. Person Monitoring Type Notifications (4 hours)

**Total Phase 6:** 23 hours

---

## 🎯 Quick Wins (Can be done in 1 day each)

These resources have no complex dependencies and can be implemented quickly:

1. **Equipaments** - Simple reference table
2. **Regions** - 5 Brazilian regions only
3. **Vehicle Types** - Car, Truck, Motorcycle, Bus, etc.
4. **Colors** - Standard color list

---

## 📝 Notes

### Standard CRUD Pattern
Each resource implementation should include:

1. **Controller** (`app/Http/Controllers/Api/{Domain}/{Resource}Controller.php`)
   - 7 methods: index, show, store, update, destroy, restore, forceDelete
   - Complete Swagger documentation

2. **Service** (`app/Services/{Domain}/{Resource}Service.php`)
   - Business logic with error handling
   - Cache management (if applicable)
   - Use SearchService for reads
   - Use traits: ValidatesAndSanitizesTrait, AuditLoggingTrait, ReferentialIntegrityTrait

3. **Form Requests** (`app/Http/Requests/{Resource}/`)
   - 7 request classes for validation

4. **API Resource** (`app/Http/Resources/{Resource}Resource.php`)
   - JSON response formatting

5. **Routes** (`routes/{domain}.php`)
   - 7 routes with authentication and rate limiting

6. **Tests** (`tests/Feature/{Resource}/` and `tests/Unit/{Resource}/`)
   - Feature tests for all endpoints
   - Unit tests for service logic

7. **Documentation**
   - Update Postman collection
   - Update Swagger docs
   - Update CHANGELOG.md

### Reference Implementation
Use existing implementations as templates:
- **Best Example:** VehicleModelController + VehicleModelService
- **Service Traits:** ValidatesAndSanitizesTrait, AuditLoggingTrait, ReferentialIntegrityTrait
- **Form Requests Pattern:** UserController requests

---

## 🔄 Changelog Updates

When implementing each resource, update `CHANGELOG.md` under `[Unreleased]` section:

```markdown
### Added
- {Resource} CRUD endpoints (7 endpoints)
  - Controller: {ResourceController.php}
  - Service: {ResourceService.php} with SearchService integration
  - Complete Swagger documentation
  - Tests: Feature and unit tests
```

---

## 📞 Questions?

For implementation questions, refer to:
- `.github/copilot-instructions.md` - Complete coding standards
- `docs/README.md` - Architecture overview
- `docs/technical-maturity-assessment.md` - Quality standards

---

**Last Updated:** January 12, 2026  
**Maintained By:** CCONet Team
