# Postman Collections - Vehicle Passage Processing API

## 📁 Collection Strategy

**Each resource has its own independent collection** to avoid Git conflicts when multiple developers work on different features simultaneously.

### Why Separate Collections?

1. **✅ No More Merge Conflicts**: Each developer works on their own collection file
2. **✅ Easier Version Control**: Clear history of changes per resource
3. **✅ Modular Testing**: Import only the collections you need
4. **✅ Independent Updates**: Update one resource without affecting others
5. **✅ Team Collaboration**: Multiple PRs for different resources won't conflict

## 📦 Available Collections

Import individual collections from the `collections/` folder:

| # | Collection | File | Endpoints | Description |
|---|-----------|------|-----------|-------------|
| 01 | **Authentication** | `01-Authentication.postman_collection.json` | 3 | Login, Get User, Logout |
| 02 | **Users** | `02-Users.postman_collection.json` | 7 | User management (CRUD + Soft Delete) |
| 03 | **Countries** | `03-Countries.postman_collection.json` | 7 | Country management |
| 04 | **Regions** | `04-Regions.postman_collection.json` | 7 | Brazilian regions (N, NE, SE, S, CO) |
| 05 | **States** | `05-States.postman_collection.json` | 7 | Brazilian states (27 UFs) |
| 06 | **Mesoregions** | `06-Mesoregions.postman_collection.json` | 7 | Brazilian mesoregions |
| 07 | **Microregions** | `07-Microregions.postman_collection.json` | 7 | Brazilian microregions |
| 08 | **Cities** | `08-Cities.postman_collection.json` | 7 | Brazilian municipalities |
| 09 | **Districts** | `09-Districts.postman_collection.json` | 7 | Brazilian districts |
| 10 | **SubDistricts** | `10-SubDistricts.postman_collection.json` | 7 | Brazilian sub-districts |
| 11 | **Health Check** | `11-HealthCheck.postman_collection.json` | 3 | Health, Readiness, Liveness probes |
| 12 | **Persons** | `12-Persons.postman_collection.json` | 7 | Person management (CRUD) |
| 13 | **Persons Documents** | `13-PersonsDocuments.postman_collection.json` | 7 | Person documents (CPF, CNH, RG, etc.) |
| 14 | **Persons Addresses** | `14-PersonsAddresses.postman_collection.json` | 7 | Person addresses with geolocation |
| 15 | **Person Monitoring Types** | `15-PersonMonitoringTypes.postman_collection.json` | 7 | Alert/notification types with priority levels |

**Total: 103 endpoints across 15 independent collections**
| 12 | **Persons** | `12-Persons.postman_collection.json` | 7 | Person management (CRUD + Soft Delete) |
| 13 | **Persons Documents** | `13-PersonDocuments.postman_collection.json` | 7 | Persons document management (CPF, RG, CNH, etc.) |
| 14 | **Persons Addresses** | `14-PersonsAddresses.postman_collection.json` | 7 | Persons physical addresses management |
| 15 | **Vehicle Types** | `15-VehicleTypes.postman_collection.json` | 7 | Vehicle type categories (car, truck, motorcycle, bus) |

**Total: 104 endpoints across 15 independent collections**
| 12 | **Persons** | `12-Persons.postman_collection.json` | 7 | Person management (CRUD + Detection Module) |
| 18 | **Vehicle Whitelists** | `18-VehicleWhitelists.postman_collection.json` | 7 | Vehicle whitelist management (CRUD + Soft Delete) |

**Total: 83 endpoints across 12 independent collections**

## 🚀 Quick Start

### 1. Import Collections

**Option A - Import All Collections:**
```bash
# In Postman: File > Import > Select Folder
# Choose: docs/postman/collections/
```

**Option B - Import Specific Collections:**
1. Open Postman
2. Click **Import**
3. Select individual `.json` files from `collections/` folder
4. Collections will appear in your sidebar

### 2. Configure Environment

Create a Postman Environment with these variables:

```json
{
  "base_url": "http://localhost:8000",
  "auth_token": "",
  "user_id": "",
  "user_uuid": "",
  "user_email": ""
}
```

### 3. Authenticate

1. Open **01 - Authentication** collection
2. Run **Login** request
3. Token and user info are automatically saved to environment
4. All other collections will use `{{auth_token}}` automatically

## 📋 Standard CRUD Pattern

Most collections follow the same 7-endpoint pattern:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/{resource}` | List with pagination & filters |
| GET | `/api/v1/{resource}/{uuid}` | Show single record |
| POST | `/api/v1/{resource}` | Create new record |
| PUT | `/api/v1/{resource}/{uuid}` | Update existing record |
| DELETE | `/api/v1/{resource}/{uuid}` | Soft delete (can be restored) |
| POST | `/api/v1/{resource}/{uuid}/restore` | Restore soft deleted record |
| DELETE | `/api/v1/{resource}/{uuid}/force` | Permanent delete (cannot be undone) |

## 🔐 Authentication Flow

```
1. Login (01-Authentication)
   ↓ (token saved automatically)
2. Use any protected endpoint
   ↓ (uses {{auth_token}} variable)
3. Logout (01-Authentication)
   ↓ (token cleared automatically)
```

## 🗺️ Geographic Hierarchy

Complete Brazilian IBGE geographic structure:

```
Country (Brasil)
  └── Region (5: N, NE, SE, S, CO)
      └── State (27 UFs)
          └── Mesoregion (137)
              └── Microregion (558)
                  └── City/Municipality (5,570)
                      └── District (10,302)
                          └── SubDistrict (finest level)
```

## 🔧 Working with Collections

### Adding a New Resource

When implementing a new CRUD resource:

1. **Create new collection file**:
   ```
   docs/postman/collections/XX-ResourceName.postman_collection.json
   ```

2. **Use this template structure**:
   ```json
   {
     "info": {
       "_postman_id": "resource-collection-v1",
       "name": "XX - Resource Name",
       "description": "Resource description",
       "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
     },
     "item": [
       // 7 CRUD endpoints here
     ],
     "variable": [
       {"key": "base_url", "value": "http://localhost:8000", "type": "string"}
     ]
   }
   ```

3. **Follow naming convention**:
   - File: `XX-ResourceName.postman_collection.json`
   - Collection: `XX - Resource Name`
   - XX = Sequential number (01, 02, 03, ...)

4. **Update this README**:
   - Add row to the table above
   - Update total endpoints count

### Git Workflow Benefits

**Before (Single Collection):**
```
❌ Developer A updates Users → commits collection
❌ Developer B updates Cities → commits collection
❌ Git conflict on same file → manual merge required
```

**After (Separate Collections):**
```
✅ Developer A updates Users → commits 02-Users.postman_collection.json
✅ Developer B updates Cities → commits 08-Cities.postman_collection.json  
✅ No conflicts → both merge automatically
```

## 📚 Additional Resources

- **API Documentation**: http://localhost:8000/api/documentation (Swagger UI)
- **Legacy Collection**: `Vehicle-Passage-Processing-API.postman_collection.json` (deprecated)
- **Technical Docs**: See `/docs` folder in repository

## 🔄 Migration from Legacy Collection

If you're using the old monolithic collection:

1. **Export your environment** (to preserve variables)
2. **Delete** old collection
3. **Import** new individual collections from `collections/` folder
4. **Import** your environment back
5. Done! No data loss, just better organization

## 🆘 Troubleshooting

### Issue: Token not working
**Solution**: Re-run Login request in `01-Authentication` collection

### Issue: Variables not shared across collections
**Solution**: Variables are environment-level. Ensure you have an active environment selected.

### Issue: Base URL incorrect
**Solution**: Update `base_url` in your environment (not in individual collections)

### Issue: Import fails
**Solution**: Ensure you're importing `.json` files, not folders. Postman expects JSON files.

---

**Version**: 2.0.0  
**Strategy**: Independent Collections (No Nesting)  
**Last Updated**: January 2026  
**Project**: CCONet - Vehicle Passage Processing API
