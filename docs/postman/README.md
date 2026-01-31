# Postman Collections - Vehicle Passage Processing API

## ⚠️ IMPORTANT: New Collection Strategy

**We have migrated from a single monolithic collection to independent resource collections.**

### Why the Change?

- ❌ **Old Problem**: Single large file caused constant Git merge conflicts
- ✅ **New Solution**: Each resource has its own collection file - zero conflicts!

### 📁 New Structure

All collections are now in the **`collections/`** folder:

```
docs/postman/collections/
├── README.md (Complete documentation)
├── 01-Authentication.postman_collection.json
├── 02-Users.postman_collection.json
├── 03-Countries.postman_collection.json
├── 04-Regions.postman_collection.json
├── 05-States.postman_collection.json
├── 06-Mesoregions.postman_collection.json
├── 07-Microregions.postman_collection.json
├── 08-Cities.postman_collection.json
├── 09-Districts.postman_collection.json
├── 10-SubDistricts.postman_collection.json
└── 11-HealthCheck.postman_collection.json
```

**Total: 76 endpoints across 11 independent collections**

## 🚀 Quick Start

### Import All Collections

1. Open Postman
2. Click **Import**
3. Select the **`collections/`** folder
4. All 11 collections will be imported at once

**OR** import individual collections as needed.

### Complete Documentation

➡️ **See [collections/README.md](./collections/README.md) for:**
- Detailed usage instructions
- Authentication flow
- Environment setup
- Benefits of new strategy
- Migration guide from old collection

## 🎯 Benefits

✅ **Zero Merge Conflicts**: Each developer works on separate files  
✅ **Independent Updates**: Change Users without affecting Cities  
✅ **Modular Testing**: Import only what you need  
✅ **Better Git History**: Clear change tracking per resource  
✅ **Team Collaboration**: Multiple PRs won't conflict

## 🔄 Migration from Old Collection

If you have the old monolithic collection:

1. **Delete** old collection from Postman
2. **Import** new collections from `collections/` folder
3. **Done!** Environment variables work the same way

---

## 🎯 Code Quality: 100/100

Esta API reflete todas as melhorias de arquitetura e qualidade:
- ✅ **PHPStan Level 6**: Análise estática avançada
- ✅ **PHP 8.2+ Enums**: Type-safe constants com comportamentos ricos
- ✅ **Service Refactoring**: 3 traits reutilizáveis, 182 linhas eliminadas
- ✅ **CQRS Pattern**: Workers-only para processamento assíncrono
- ✅ **API Versioning**: Endpoints versionados (`/api/v1/`)
- ✅ **Health Checks**: 3 endpoints para Kubernetes (health, ready, live)

## 📦 Legacy Files

- **Vehicle-Passage-Processing-API.postman_collection.json**: Deprecated (ignored by Git)
  - Old monolithic collection - **DO NOT USE**
  - Kept for local backward compatibility only
  - Use `collections/` folder instead

---

**Version**: 2.0.0  
**Strategy**: Independent Collections (Modular Approach)  
**Last Updated**: January 2026  
**Project**: CCONet - Vehicle Passage Processing API
