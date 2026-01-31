# Estrutura do Banco de Dados - Vehicle Passage Processing

> Documentação técnica completa de todas as 32 tabelas do sistema com arquitetura dual MySQL + MongoDB.

## 🔙 [Voltar para Documentação Principal](README.md)

---

## Visão Geral

Este documento descreve a estrutura completa do banco de dados do microserviço de processamento de passagens de veículos. O sistema utiliza **arquitetura dual** com MySQL para dados relacionais e MongoDB para armazenamento de documentos flexíveis.

### Bancos de Dados

- **MySQL** (`vehicle_passages`): Banco relacional principal
- **MongoDB** (`vehicle_passages_laravel`): Banco de documentos para dados não estruturados
- **Sincronização**: Observers sincronizam automaticamente dados entre MySQL e MongoDB

---

## Índice por Domínio

1. [Autenticação e Controle de Acesso](#1-autenticação-e-controle-de-acesso)
2. [Clientes e Integrações](#2-clientes-e-integrações)
3. [Equipamentos](#3-equipamentos)
4. [Localização Geográfica](#4-localização-geográfica)
5. [Veículos e Atributos](#5-veículos-e-atributos)
6. [Passagens de Veículos](#6-passagens-de-veículos)
7. [Pessoas](#7-pessoas)
8. [Sistema de Monitoramento](#8-sistema-de-monitoramento)
9. [Sistema Laravel](#9-sistema-laravel)

---

## 1. Autenticação e Controle de Acesso

### `users`
Tabela de usuários do sistema.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE, INDEX | Identificador externo |
| `name` | VARCHAR(255) | INDEX | Nome do usuário |
| `email` | VARCHAR(255) | UNIQUE, INDEX | Email do usuário |
| `email_verified_at` | TIMESTAMP | NULL | Data de verificação do email |
| `password` | VARCHAR(255) | | Senha hash |
| `remember_token` | VARCHAR(100) | NULL | Token de "lembrar-me" |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `name` (INDEX)
- `email` (UNIQUE, INDEX)

### `personal_access_tokens`
Tokens de acesso da API (Laravel Sanctum).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `tokenable_type` | VARCHAR(255) | | Tipo do modelo tokenizable |
| `tokenable_id` | BIGINT UNSIGNED | | ID do modelo tokenizable |
| `name` | VARCHAR(255) | | Nome do token |
| `token` | VARCHAR(64) | UNIQUE | Hash do token |
| `abilities` | TEXT | NULL | Habilidades/permissões |
| `last_used_at` | TIMESTAMP | NULL | Último uso |
| `expires_at` | TIMESTAMP | NULL | Data de expiração |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |

**Índices**:
- `token` (UNIQUE)
- `tokenable_type, tokenable_id` (INDEX)

### `password_reset_tokens`
Tokens de reset de senha.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `email` | VARCHAR(255) | PK | Email do usuário |
| `token` | VARCHAR(255) | | Token de reset |
| `created_at` | TIMESTAMP | NULL | Data de criação |

### `sessions`
Sessões ativas no sistema.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | VARCHAR(255) | PK | ID da sessão |
| `user_id` | BIGINT UNSIGNED | NULL, INDEX, FK→users | ID do usuário |
| `ip_address` | VARCHAR(45) | NULL | IP do cliente |
| `user_agent` | TEXT | NULL | User agent |
| `payload` | LONGTEXT | | Dados da sessão |
| `last_activity` | INTEGER | INDEX | Timestamp da última atividade |

---

## 2. Clientes e Integrações

### `clients`
Clientes/organizações que utilizam o sistema.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE, INDEX | Identificador externo |
| `code` | VARCHAR(255) | UNIQUE, INDEX | Código único do cliente |
| `active` | BOOLEAN | DEFAULT false, INDEX | Status ativo/inativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE)
- `code` (UNIQUE)
- `active` (INDEX)
- `code, active` (INDEX composto)

**Relações**:
- `hasMany` → equipaments
- `hasMany` → client_integrations
- `hasMany` → vehicle_whitelists
- `hasMany` → person_monitoring_types
- `hasMany` → person_monitoring_type_notifications

### `client_integrations`
Integrações configuradas por cliente (APIs externas, sistemas locais).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `client_id` | BIGINT UNSIGNED | INDEX, FK→clients | Cliente proprietário |
| `active` | BOOLEAN | DEFAULT false, INDEX | Status da integração |
| `integration_name` | VARCHAR(255) | | Nome da integração |
| `integration_type` | ENUM | 'local', 'external', INDEX | Tipo de integração |
| `settings` | JSON | | Configurações da integração |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE)
- `client_id` (INDEX)
- `active` (INDEX)
- `integration_type` (INDEX)
- `client_id, active` (INDEX composto)
- `client_id, integration_type` (INDEX composto)

**Relações**:
- `belongsTo` → clients

**Constraints**:
- `FK client_id` REFERENCES `clients(id)` ON DELETE CASCADE

---

## 3. Equipamentos

### `equipaments`
Equipamentos de captura (câmeras LPR, sensores, etc.).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `uuid_client_conciliation` | UUID | | UUID para conciliação com sistema do cliente |
| `client_id` | BIGINT UNSIGNED | NULL, INDEX | Cliente proprietário |
| `client_identifier` | VARCHAR(255) | INDEX | Identificador no sistema do cliente |
| `serial_number` | VARCHAR(255) | INDEX | Número de série do equipamento |
| `latitude` | DECIMAL(10,7) | NULL | Latitude GPS |
| `longitude` | DECIMAL(10,7) | NULL | Longitude GPS |
| `location` | VARCHAR(255) | | Descrição do local |
| `direction` | VARCHAR(255) | | Direção (entrada/saída/etc) |
| `is_active` | BOOLEAN | INDEX | Status ativo/inativo |
| `last_passed_at` | TIMESTAMP | NULL | Última passagem registrada |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `client_id` (INDEX)
- `client_identifier` (INDEX)
- `serial_number` (INDEX)
- `is_active` (INDEX)
- `is_active, last_passed_at` (INDEX composto)
- `client_id, is_active` (INDEX composto)

**Relações**:
- `belongsTo` → clients
- `hasMany` → vehicle_passages

---

## 4. Localização Geográfica

Hierarquia geográfica completa do Brasil (baseada em IBGE).

### `countries`
Países.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `ibge_id` | BIGINT UNSIGNED | NULL, UNIQUE | Código IBGE |
| `name` | VARCHAR(255) | INDEX | Nome do país (PT) |
| `name_en` | VARCHAR(255) | INDEX | Nome do país (EN) |
| `region_code` | VARCHAR(255) | NULL, INDEX | Código da região |
| `sub_region_code` | VARCHAR(255) | NULL | Código da sub-região |
| `intermediate_region_code` | VARCHAR(255) | NULL | Código da região intermediária |
| `region_id` | BIGINT UNSIGNED | NULL | ID da região |
| `iso_alpha2` | VARCHAR(2) | NULL, UNIQUE | Código ISO Alpha-2 |
| `iso_alpha3` | VARCHAR(3) | NULL, UNIQUE | Código ISO Alpha-3 |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `ibge_id` (UNIQUE)
- `iso_alpha2` (UNIQUE)
- `iso_alpha3` (UNIQUE)
- `name` (INDEX)
- `name_en` (INDEX)
- `region_code` (INDEX)

### `regions`
Regiões do Brasil (Norte, Nordeste, Sul, Sudeste, Centro-Oeste).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `ibge_id` | VARCHAR(255) | UNIQUE | Código IBGE |
| `code` | VARCHAR(255) | UNIQUE | Código da região |
| `name` | VARCHAR(255) | INDEX | Nome da região |
| `name_en` | VARCHAR(255) | NULL | Nome em inglês |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `ibge_id` (UNIQUE)
- `code` (UNIQUE)
- `name` (INDEX)

**Relações**:
- `hasMany` → states

### `states`
Estados do Brasil (UF).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `ibge_id` | VARCHAR(7) | UNIQUE | Código IBGE |
| `code` | VARCHAR(2) | UNIQUE | Sigla do estado (SP, RJ, etc) |
| `name` | VARCHAR(100) | INDEX | Nome do estado |
| `name_en` | VARCHAR(100) | | Nome em inglês |
| `region_id` | BIGINT UNSIGNED | INDEX, FK→regions | Região do estado |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `ibge_id` (UNIQUE)
- `code` (UNIQUE)
- `name` (INDEX)
- `region_id, name` (INDEX composto)

**Relações**:
- `belongsTo` → regions
- `hasMany` → mesoregions
- `hasMany` → cities
- `hasMany` → persons (birth_state)
- `hasMany` → person_addresses

**Constraints**:
- `FK region_id` REFERENCES `regions(id)` ON DELETE CASCADE

### `mesoregions`
Mesorregiões do IBGE.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `ibge_id` | BIGINT UNSIGNED | UNIQUE | Código IBGE |
| `name` | VARCHAR(255) | INDEX | Nome da mesorregião |
| `name_en` | VARCHAR(255) | NULL | Nome em inglês |
| `state_id` | BIGINT UNSIGNED | INDEX, FK→states | Estado |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `ibge_id` (UNIQUE)
- `name` (INDEX)
- `state_id, name` (INDEX composto)

**Relações**:
- `belongsTo` → states
- `hasMany` → microregions

**Constraints**:
- `FK state_id` REFERENCES `states(id)` ON DELETE CASCADE

### `microregions`
Microrregiões do IBGE.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `ibge_id` | BIGINT UNSIGNED | UNIQUE | Código IBGE |
| `name` | VARCHAR(255) | INDEX | Nome da microrregião |
| `name_en` | VARCHAR(255) | NULL | Nome em inglês |
| `mesoregion_id` | BIGINT UNSIGNED | INDEX, FK→mesoregions | Mesorregião |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `ibge_id` (UNIQUE)
- `name` (INDEX)
- `mesoregion_id, name` (INDEX composto)

**Relações**:
- `belongsTo` → mesoregions
- `hasMany` → cities

**Constraints**:
- `FK mesoregion_id` REFERENCES `mesoregions(id)` ON DELETE CASCADE

### `cities`
Cidades/Municípios.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `ibge_id` | BIGINT UNSIGNED | UNIQUE | Código IBGE |
| `name` | VARCHAR(255) | INDEX | Nome da cidade |
| `name_en` | VARCHAR(255) | NULL | Nome em inglês |
| `microregion_id` | BIGINT UNSIGNED | INDEX, FK→microregions | Microrregião |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `ibge_id` (UNIQUE)
- `name` (INDEX)
- `microregion_id, name` (INDEX composto)

**Relações**:
- `belongsTo` → microregions
- `hasMany` → persons (birth_city)
- `hasMany` → person_addresses

**Constraints**:
- `FK microregion_id` REFERENCES `microregions(id)` ON DELETE CASCADE

---

## 5. Veículos e Atributos

### `marks`
Marcas de veículos (Toyota, Ford, Volkswagen, etc.).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `canonical_name` | VARCHAR(255) | INDEX | Nome normalizado |
| `display_name` | VARCHAR(255) | INDEX | Nome para exibição |
| `country_id` | BIGINT UNSIGNED | INDEX, FK→countries | País de origem |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `canonical_name` (INDEX)
- `display_name` (INDEX)
- `country_id, canonical_name` (INDEX composto)
- `country_id, display_name` (INDEX composto)

**Relações**:
- `belongsTo` → countries
- `hasMany` → vehicle_models
- `hasMany` → mark_aliases
- `hasMany` → vehicles

**Constraints**:
- `FK country_id` REFERENCES `countries(id)` ON DELETE CASCADE

### `mark_aliases`
Aliases/variações de nomes de marcas.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `mark_id` | BIGINT UNSIGNED | INDEX, FK→marks | Marca referenciada |
| `alias` | VARCHAR(255) | INDEX | Nome alternativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `alias` (INDEX)
- `mark_id, alias` (INDEX composto)

**Relações**:
- `belongsTo` → marks

**Constraints**:
- `FK mark_id` REFERENCES `marks(id)` ON DELETE CASCADE

### `vehicle_models`
Modelos de veículos (Corolla, Fiesta, Gol, etc.).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `mark_id` | BIGINT UNSIGNED | INDEX, FK→marks | Marca do veículo |
| `country_id` | BIGINT UNSIGNED | NULL, INDEX, FK→countries | País de origem |
| `canonical_name` | VARCHAR(255) | INDEX | Nome normalizado |
| `display_name` | VARCHAR(255) | INDEX | Nome para exibição |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `canonical_name` (INDEX)
- `display_name` (INDEX)
- `mark_id, canonical_name` (INDEX composto)
- `mark_id, display_name` (INDEX composto)
- `country_id, canonical_name` (INDEX composto)

**Relações**:
- `belongsTo` → marks
- `belongsTo` → countries
- `hasMany` → vehicle_model_aliases
- `hasMany` → vehicles

**Constraints**:
- `FK mark_id` REFERENCES `marks(id)` ON DELETE CASCADE
- `FK country_id` REFERENCES `countries(id)` ON DELETE SET NULL

### `vehicle_model_aliases`
Aliases/variações de nomes de modelos.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `vehicle_model_id` | BIGINT UNSIGNED | INDEX, FK→vehicle_models | Modelo referenciado |
| `alias` | VARCHAR(255) | INDEX | Nome alternativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `alias` (INDEX)
- `vehicle_model_id, alias` (INDEX composto)

**Relações**:
- `belongsTo` → vehicle_models

**Constraints**:
- `FK vehicle_model_id` REFERENCES `vehicle_models(id)` ON DELETE CASCADE

### `colors`
Cores de veículos.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `canonical_name` | VARCHAR(255) | UNIQUE, INDEX | Nome normalizado |
| `display_name` | VARCHAR(255) | INDEX | Nome para exibição |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `canonical_name` (UNIQUE, INDEX)
- `display_name` (INDEX)

**Relações**:
- `hasMany` → color_aliases
- `hasMany` → vehicles

### `color_aliases`
Aliases/variações de nomes de cores.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `color_id` | BIGINT UNSIGNED | INDEX, FK→colors | Cor referenciada |
| `alias` | VARCHAR(255) | INDEX | Nome alternativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `alias` (INDEX)
- `color_id, alias` (INDEX composto)

**Relações**:
- `belongsTo` → colors

**Constraints**:
- `FK color_id` REFERENCES `colors(id)` ON DELETE CASCADE

### `vehicle_types`
Tipos de veículos (Carro, Moto, Caminhão, Ônibus, etc.).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `canonical_name` | VARCHAR(255) | UNIQUE | Nome normalizado |
| `display_name` | VARCHAR(255) | INDEX | Nome para exibição |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `canonical_name` (UNIQUE)
- `display_name` (INDEX)

**Relações**:
- `hasMany` → vehicle_type_aliases
- `hasMany` → vehicles

### `vehicle_type_aliases`
Aliases/variações de tipos de veículos.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `vehicle_type_id` | BIGINT UNSIGNED | INDEX, FK→vehicle_types | Tipo referenciado |
| `alias` | VARCHAR(255) | INDEX | Nome alternativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `alias` (INDEX)
- `vehicle_type_id, alias` (INDEX composto)

**Relações**:
- `belongsTo` → vehicle_types

**Constraints**:
- `FK vehicle_type_id` REFERENCES `vehicle_types(id)` ON DELETE CASCADE

### `vehicles`
Veículos cadastrados.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `plate` | VARCHAR(10) | NULL, INDEX | Placa do veículo |
| `mark_id` | BIGINT UNSIGNED | NULL, INDEX, FK→marks | Marca |
| `model_id` | BIGINT UNSIGNED | NULL, INDEX, FK→vehicle_models | Modelo |
| `color_id` | BIGINT UNSIGNED | NULL, INDEX, FK→colors | Cor |
| `type_id` | BIGINT UNSIGNED | NULL, INDEX, FK→vehicle_types | Tipo |
| `year_of_manufacture` | YEAR | NULL | Ano de fabricação |
| `year_model` | YEAR | NULL | Ano do modelo |
| `chassis_number` | VARCHAR(50) | NULL | Número do chassis |
| `engine_number` | VARCHAR(50) | NULL | Número do motor |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (INDEX)
- `plate` (INDEX)
- `mark_id` (INDEX)
- `model_id` (INDEX)
- `color_id` (INDEX)
- `type_id` (INDEX)
- `plate, mark_id, model_id` (INDEX composto)

**Relações**:
- `belongsTo` → marks
- `belongsTo` → vehicle_models
- `belongsTo` → colors
- `belongsTo` → vehicle_types
- `hasMany` → vehicle_passages
- `hasMany` → vehicle_whitelists

**Constraints**:
- `FK mark_id` REFERENCES `marks(id)` ON DELETE SET NULL
- `FK model_id` REFERENCES `vehicle_models(id)` ON DELETE SET NULL
- `FK color_id` REFERENCES `colors(id)` ON DELETE SET NULL
- `FK type_id` REFERENCES `vehicle_types(id)` ON DELETE SET NULL

---

## 6. Passagens de Veículos

### `vehicle_passages`
Registros de passagens de veículos pelos equipamentos.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE, INDEX | Identificador externo |
| `client_id` | BIGINT UNSIGNED | NULL, INDEX, FK→clients | Cliente associado |
| `vehicle_id` | BIGINT UNSIGNED | NULL, INDEX, FK→vehicles | Veículo identificado |
| `equipament_id` | BIGINT UNSIGNED | NULL, INDEX, FK→equipaments | Equipamento que capturou |
| `plate` | VARCHAR(20) | NULL, INDEX | Placa capturada |
| `client` | VARCHAR(255) | NULL | Identificador do cliente (legado) |
| `passed_at` | TIMESTAMP | NULL, INDEX | Data/hora da passagem |
| `first` | BOOLEAN | DEFAULT false | Primeira passagem deste veículo |
| `passage_images` | JSON | NULL | URLs/paths das imagens |
| `latitude` | DECIMAL(10,8) | NULL | Latitude da passagem |
| `longitude` | DECIMAL(11,8) | NULL | Longitude da passagem |
| `location` | VARCHAR(500) | NULL | Descrição do local |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE, INDEX)
- `client_id` (INDEX)
- `vehicle_id` (INDEX)
- `equipament_id` (INDEX)
- `plate` (INDEX)
- `passed_at` (INDEX)
- `vehicle_id, passed_at` (INDEX composto)
- `equipament_id, passed_at` (INDEX composto)
- `plate, passed_at` (INDEX composto)

**Relações**:
- `belongsTo` → clients
- `belongsTo` → vehicles
- `belongsTo` → equipaments

**Constraints**:
- `FK client_id` REFERENCES `clients(id)` ON DELETE SET NULL
- `FK vehicle_id` REFERENCES `vehicles(id)` ON DELETE SET NULL
- `FK equipament_id` REFERENCES `equipaments(id)` ON DELETE SET NULL

### `vehicle_whitelists`
Lista de veículos autorizados/permitidos por cliente.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `client_id` | BIGINT UNSIGNED | INDEX, FK→clients | Cliente |
| `vehicle_id` | BIGINT UNSIGNED | INDEX, FK→vehicles | Veículo autorizado |
| `observation` | VARCHAR(255) | NULL | Observações |
| `status` | ENUM | 'active', 'inactive', INDEX | Status da autorização |
| `monitor_until` | DATETIME | NULL, INDEX | Validade da autorização |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que criou |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | INDEX | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE)
- `client_id, vehicle_id` (UNIQUE composto - unique_client_vehicle)
- `status` (INDEX)
- `monitor_until` (INDEX)
- `client_id, status` (INDEX composto)
- `created_at` (INDEX)

**Relações**:
- `belongsTo` → clients
- `belongsTo` → vehicles
- `belongsTo` → users (created_by)
- `belongsTo` → users (updated_by)

**Constraints**:
- `FK client_id` REFERENCES `clients(id)` ON DELETE CASCADE
- `FK vehicle_id` REFERENCES `vehicles(id)` ON DELETE CASCADE
- `FK created_by` REFERENCES `users(id)` ON DELETE SET NULL
- `FK updated_by` REFERENCES `users(id)` ON DELETE SET NULL

---

## 7. Pessoas

### `persons`
Cadastro de pessoas.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `full_name` | VARCHAR(255) | INDEX | Nome completo |
| `social_name` | VARCHAR(255) | NULL | Nome social |
| `birth_date` | DATE | NULL, INDEX | Data de nascimento |
| `gender` | ENUM | 'M', 'F', 'O', 'N', INDEX | Gênero |
| `mother_name` | VARCHAR(255) | NULL | Nome da mãe |
| `father_name` | VARCHAR(255) | NULL | Nome do pai |
| `country_id` | BIGINT UNSIGNED | NULL, FK→countries | Nacionalidade |
| `birth_city_id` | BIGINT UNSIGNED | NULL, FK→cities | Cidade de nascimento |
| `birth_state_id` | BIGINT UNSIGNED | NULL, FK→states | UF de nascimento |
| `is_blacklisted` | BOOLEAN | DEFAULT false, INDEX | Flag de blacklist |
| `blacklist_reason` | TEXT | NULL | Motivo da blacklist |
| `blacklisted_at` | TIMESTAMP | NULL | Data da blacklist |
| `blacklisted_by` | BIGINT UNSIGNED | NULL, FK→users | Quem adicionou à blacklist |
| `notes` | TEXT | NULL | Observações gerais |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário criador |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE)
- `full_name` (INDEX)
- `birth_date` (INDEX)
- `is_blacklisted` (INDEX)
- `gender` (INDEX)
- `country_id, birth_state_id` (INDEX composto)

**Relações**:
- `belongsTo` → countries
- `belongsTo` → cities (birth_city)
- `belongsTo` → states (birth_state)
- `belongsTo` → users (blacklisted_by)
- `belongsTo` → users (created_by)
- `belongsTo` → users (updated_by)
- `hasMany` → person_documents
- `hasMany` → person_addresses

**Constraints**:
- `FK country_id` REFERENCES `countries(id)` ON DELETE SET NULL
- `FK birth_city_id` REFERENCES `cities(id)` ON DELETE SET NULL
- `FK birth_state_id` REFERENCES `states(id)` ON DELETE SET NULL
- `FK blacklisted_by` REFERENCES `users(id)` ON DELETE SET NULL
- `FK created_by` REFERENCES `users(id)` ON DELETE SET NULL
- `FK updated_by` REFERENCES `users(id)` ON DELETE SET NULL

### `person_documents`
Documentos das pessoas (CPF, RG, CNH, Passaporte, etc.).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `person_id` | BIGINT UNSIGNED | FK→persons | Pessoa proprietária |
| `document_type` | ENUM | 'CPF', 'CNH', 'RG', 'RNE', 'PASSPORT', 'OTHER' | Tipo do documento |
| `document_number` | VARCHAR(255) | INDEX | Número do documento |
| `issuing_agency` | VARCHAR(255) | NULL | Órgão emissor |
| `issue_date` | DATE | NULL | Data de emissão |
| `expiry_date` | DATE | NULL | Data de validade |
| `notes` | TEXT | NULL | Observações |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário criador |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE)
- `document_type` (INDEX)
- `document_number` (INDEX)
- `person_id, document_type, document_number` (UNIQUE composto - unique_person_document)

**Relações**:
- `belongsTo` → persons
- `belongsTo` → users (created_by)
- `belongsTo` → users (updated_by)

**Constraints**:
- `FK person_id` REFERENCES `persons(id)` ON DELETE CASCADE
- `FK created_by` REFERENCES `users(id)` ON DELETE SET NULL
- `FK updated_by` REFERENCES `users(id)` ON DELETE SET NULL

### `person_addresses`
Endereços das pessoas.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `person_id` | BIGINT UNSIGNED | INDEX, FK→persons | Pessoa proprietária |
| `address_type` | ENUM | 'RESIDENTIAL', 'COMMERCIAL', 'MAILING', 'OTHER' | Tipo de endereço |
| `street` | VARCHAR(255) | | Logradouro |
| `number` | VARCHAR(20) | | Número |
| `complement` | VARCHAR(255) | NULL | Complemento |
| `neighborhood` | VARCHAR(255) | | Bairro |
| `postal_code` | VARCHAR(10) | INDEX | CEP |
| `city_id` | BIGINT UNSIGNED | INDEX, FK→cities | Cidade |
| `state_id` | BIGINT UNSIGNED | INDEX, FK→states | Estado |
| `is_primary` | BOOLEAN | DEFAULT false, INDEX | Endereço principal |
| `latitude` | DECIMAL(10,8) | NULL | Latitude |
| `longitude` | DECIMAL(11,8) | NULL | Longitude |
| `notes` | TEXT | NULL | Observações |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário criador |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE)
- `person_id` (INDEX)
- `postal_code` (INDEX)
- `city_id` (INDEX)
- `state_id` (INDEX)
- `is_primary` (INDEX)
- `person_id, is_primary` (INDEX composto)

**Relações**:
- `belongsTo` → persons
- `belongsTo` → cities
- `belongsTo` → states
- `belongsTo` → users (created_by)
- `belongsTo` → users (updated_by)

**Constraints**:
- `FK person_id` REFERENCES `persons(id)` ON DELETE CASCADE
- `FK city_id` REFERENCES `cities(id)` ON DELETE CASCADE
- `FK state_id` REFERENCES `states(id)` ON DELETE CASCADE
- `FK created_by` REFERENCES `users(id)` ON DELETE SET NULL
- `FK updated_by` REFERENCES `users(id)` ON DELETE SET NULL

---

## 8. Sistema de Monitoramento

### `person_monitoring_types`
Tipos de monitoramento de pessoas (Mandado de Prisão, Suspeito, VIP, etc.).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `client_id` | BIGINT UNSIGNED | INDEX, FK→clients | Cliente proprietário |
| `name` | VARCHAR(50) | | Nome curto do tipo |
| `description` | VARCHAR(255) | | Descrição detalhada |
| `priority` | ENUM | 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', INDEX | Prioridade do alerta |
| `color` | VARCHAR(7) | DEFAULT '#FF5733' | Cor hexadecimal |
| `audio_file` | VARCHAR(255) | NULL | Nome do arquivo de áudio |
| `generates_occurrence` | BOOLEAN | DEFAULT false | Se gera ocorrência automática |
| `show_screen_alert` | BOOLEAN | DEFAULT false | Se exibe alerta na tela |
| `push_notification_id` | BIGINT UNSIGNED | NULL, INDEX, FK→person_monitoring_type_notifications | Template de notificação Push |
| `sms_notification_id` | BIGINT UNSIGNED | NULL, INDEX, FK→person_monitoring_type_notifications | Template de notificação SMS |
| `whatsapp_notification_id` | BIGINT UNSIGNED | NULL, INDEX, FK→person_monitoring_type_notifications | Template de notificação WhatsApp |
| `email_notification_id` | BIGINT UNSIGNED | NULL, INDEX, FK→person_monitoring_type_notifications | Template de notificação Email |
| `is_active` | BOOLEAN | DEFAULT true, INDEX | Status ativo/inativo |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário criador |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE)
- `client_id` (INDEX)
- `is_active` (INDEX)
- `priority` (INDEX)
- `client_id, is_active` (INDEX composto - pmt_client_active_idx)
- `client_id, priority, is_active` (INDEX composto - pmt_client_priority_idx)
- `push_notification_id` (INDEX)
- `sms_notification_id` (INDEX)
- `whatsapp_notification_id` (INDEX)
- `email_notification_id` (INDEX)

**Relações**:
- `belongsTo` → clients
- `belongsTo` → person_monitoring_type_notifications (pushNotification)
- `belongsTo` → person_monitoring_type_notifications (smsNotification)
- `belongsTo` → person_monitoring_type_notifications (whatsappNotification)
- `belongsTo` → person_monitoring_type_notifications (emailNotification)
- `belongsTo` → users (created_by)
- `belongsTo` → users (updated_by)

**Constraints**:
- `FK client_id` REFERENCES `clients(id)` ON DELETE CASCADE
- `FK push_notification_id` REFERENCES `person_monitoring_type_notifications(id)` ON DELETE SET NULL
- `FK sms_notification_id` REFERENCES `person_monitoring_type_notifications(id)` ON DELETE SET NULL
- `FK whatsapp_notification_id` REFERENCES `person_monitoring_type_notifications(id)` ON DELETE SET NULL
- `FK email_notification_id` REFERENCES `person_monitoring_type_notifications(id)` ON DELETE SET NULL
- `FK created_by` REFERENCES `users(id)` ON DELETE SET NULL
- `FK updated_by` REFERENCES `users(id)` ON DELETE SET NULL

### `person_monitoring_type_notifications`
Templates de notificações reutilizáveis por canal.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `client_id` | BIGINT UNSIGNED | INDEX, FK→clients | Cliente proprietário |
| `name` | VARCHAR(100) | | Nome do template |
| `description` | TEXT | NULL | Descrição detalhada |
| `notification_channel` | ENUM | 'PUSH', 'SMS', 'WHATSAPP', 'EMAIL', INDEX | Canal de notificação |
| `message_template` | TEXT | | Template da mensagem com variáveis {{var}} |
| `subject_template` | TEXT | NULL | Template do assunto (Email) |
| `configuration` | JSON | NULL | Configurações específicas do canal |
| `is_active` | BOOLEAN | DEFAULT true, INDEX | Status ativo/inativo |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário criador |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Índices**:
- `uuid` (UNIQUE)
- `client_id` (INDEX)
- `notification_channel` (INDEX)
- `is_active` (INDEX)
- `client_id, notification_channel, is_active` (INDEX composto - pmtn_client_channel_idx)
- `client_id, is_active` (INDEX composto - pmtn_client_active_idx)

**Relações**:
- `belongsTo` → clients
- `belongsTo` → users (created_by)
- `belongsTo` → users (updated_by)
- `hasMany` → person_monitoring_types (pushMonitoringTypes)
- `hasMany` → person_monitoring_types (smsMonitoringTypes)
- `hasMany` → person_monitoring_types (whatsappMonitoringTypes)
- `hasMany` → person_monitoring_types (emailMonitoringTypes)

**Constraints**:
- `FK client_id` REFERENCES `clients(id)` ON DELETE CASCADE
- `FK created_by` REFERENCES `users(id)` ON DELETE SET NULL
- `FK updated_by` REFERENCES `users(id)` ON DELETE SET NULL

---

## 9. Sistema Laravel

### `cache`
Cache do sistema (sessions, locks, etc.).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `key` | VARCHAR(255) | PK | Chave do cache |
| `value` | MEDIUMTEXT | | Valor armazenado |
| `expiration` | INTEGER | | Timestamp de expiração |

### `cache_locks`
Locks distribuídos para cache.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `key` | VARCHAR(255) | PK | Chave do lock |
| `owner` | VARCHAR(255) | | Proprietário do lock |
| `expiration` | INTEGER | | Timestamp de expiração |

### `jobs`
Fila de jobs assíncronos (queue).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `queue` | VARCHAR(255) | INDEX | Nome da fila |
| `payload` | LONGTEXT | | Dados do job serializado |
| `attempts` | TINYINT UNSIGNED | | Número de tentativas |
| `reserved_at` | INTEGER UNSIGNED | NULL | Timestamp de reserva |
| `available_at` | INTEGER UNSIGNED | | Timestamp de disponibilidade |
| `created_at` | INTEGER UNSIGNED | | Timestamp de criação |

**Índices**:
- `queue` (INDEX)

### `job_batches`
Lotes de jobs para processamento em batch.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | VARCHAR(255) | PK | ID do batch |
| `name` | VARCHAR(255) | | Nome do batch |
| `total_jobs` | INTEGER | | Total de jobs no batch |
| `pending_jobs` | INTEGER | | Jobs pendentes |
| `failed_jobs` | INTEGER | | Jobs que falharam |
| `failed_job_ids` | LONGTEXT | | IDs dos jobs que falharam |
| `options` | MEDIUMTEXT | NULL | Opções do batch |
| `cancelled_at` | INTEGER | NULL | Timestamp de cancelamento |
| `created_at` | INTEGER | | Timestamp de criação |
| `finished_at` | INTEGER | NULL | Timestamp de conclusão |

### `failed_jobs`
Jobs que falharam.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | VARCHAR(255) | UNIQUE | UUID do failed job |
| `connection` | TEXT | | Conexão usada |
| `queue` | TEXT | | Fila de origem |
| `payload` | LONGTEXT | | Dados do job |
| `exception` | LONGTEXT | | Exceção/erro |
| `failed_at` | TIMESTAMP | | Data/hora da falha |

**Índices**:
- `uuid` (UNIQUE)

---

## Diagrama de Relacionamentos

### Domínio de Veículos
```
countries
    ↓
marks ─→ mark_aliases
    ↓
vehicle_models ─→ vehicle_model_aliases
    ↓
vehicles ←─ colors ─→ color_aliases
    ↓       vehicle_types ─→ vehicle_type_aliases
vehicle_passages
    ↓
equipaments ←─ clients
```

### Domínio de Pessoas
```
countries
    ↓
regions
    ↓
states
    ↓
mesoregions
    ↓
microregions
    ↓
cities
    ↓
persons ─→ person_documents
    ↓
person_addresses
```

### Domínio de Monitoramento
```
clients
    ↓
person_monitoring_type_notifications
    ↓
person_monitoring_types (com 4 FKs para notifications)
```

---

## Convenções e Padrões

### Nomenclatura
- **Tabelas**: snake_case, plural (users, vehicle_passages)
- **Colunas**: snake_case (full_name, created_at)
- **Foreign Keys**: `{tabela_singular}_id` (client_id, vehicle_id)
- **Índices**: nome descritivo ou padrão Laravel

### Campos Padrão

#### Todas as Tabelas
- `id`: BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT
- `created_at`: TIMESTAMP (automático)
- `updated_at`: TIMESTAMP (automático)
- `deleted_at`: TIMESTAMP NULL (soft delete)

#### Tabelas de Entidades
- `uuid`: UUID UNIQUE (identificador externo seguro)

#### Tabelas com Audit Trail
- `created_by`: FK para users (quem criou)
- `updated_by`: FK para users (quem atualizou)

### Tipos de Dados

- **IDs**: BIGINT UNSIGNED
- **UUIDs**: UUID (Laravel) ou CHAR(36) (MySQL nativo)
- **Textos Curtos**: VARCHAR(255)
- **Textos Longos**: TEXT
- **Datas**: DATE
- **Data/Hora**: TIMESTAMP ou DATETIME
- **Booleanos**: BOOLEAN (TINYINT(1))
- **Enums**: ENUM('valor1', 'valor2')
- **JSON**: JSON (nativo MySQL 5.7+)
- **Decimais**: DECIMAL(precisão, escala)

### Índices

#### Tipos de Índices Criados
1. **PRIMARY KEY**: Identificador único (id)
2. **UNIQUE**: Valores únicos (uuid, email, códigos)
3. **INDEX**: Busca rápida (foreign keys, campos de filtro)
4. **INDEX COMPOSTO**: Consultas com múltiplos campos (client_id, is_active)

#### Estratégia de Indexação
- **Foreign Keys**: Sempre indexadas
- **Campos de Filtro**: is_active, status, type
- **Campos de Busca**: name, email, plate, document_number
- **Campos de Ordenação**: created_at, passed_at, last_activity
- **Índices Compostos**: Para consultas frequentes com múltiplos filtros

### Soft Deletes

Todas as tabelas implementam soft delete (`deleted_at`), exceto:
- Tabelas de sistema Laravel (cache, jobs, sessions)
- Tabelas de relacionamento N:N (quando aplicável)

### Foreign Keys

#### Estratégias de Deleção
- **CASCADE**: Deletar registros dependentes (endereços quando pessoa é deletada)
- **SET NULL**: Manter registro mas remover referência (veículos quando marca é deletada)
- **RESTRICT**: Prevenir deleção se houver dependentes (padrão Laravel)

#### Padrão Usado
- Relacionamentos hierárquicos: CASCADE
- Relacionamentos opcionais: SET NULL
- Audit trail (created_by, updated_by): SET NULL

---

## MongoDB Collections

Os dados também são sincronizados automaticamente no MongoDB através de Observers:

### Collections Principais
- `clients`
- `users`
- `equipaments`
- `vehicles`
- `vehicle_passages`
- `persons`
- `person_documents`
- `person_addresses`
- `person_monitoring_types`
- `person_monitoring_type_notifications`

### Estrutura
- Cada documento possui `_id` (ObjectId gerado pelo MongoDB)
- Campos idênticos à estrutura MySQL
- Timestamps em formato ISO 8601

---

## Performance e Otimização

### Queries Otimizadas

1. **Eager Loading**: Use `with()` para evitar N+1 queries
   ```php
   Vehicle::with(['mark', 'model', 'color'])->get();
   ```

2. **Select Específico**: Carregue apenas campos necessários
   ```php
   Vehicle::select('id', 'plate', 'mark_id')->get();
   ```

3. **Índices**: Todos os campos de filtro/busca estão indexados

4. **Paginação**: Use sempre para listas grandes
   ```php
   VehiclePassage::paginate(15);
   ```

### Manutenção

#### Análise de Performance
```sql
-- Ver índices de uma tabela
SHOW INDEX FROM vehicle_passages;

-- Analisar query
EXPLAIN SELECT * FROM vehicles WHERE plate = 'ABC1234';

-- Ver tamanho das tabelas
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = "vehicle_passages"
ORDER BY (data_length + index_length) DESC;
```

#### Backup
```bash
# MySQL
mysqldump -u user -p vehicle_passages > backup.sql

# MongoDB
mongodump --db vehicle_passages_laravel --out /backup/
```

---

## Migrations

### Ordem de Execução

As migrations são executadas em ordem cronológica pelo nome do arquivo:

1. **Sistema Base**: users, cache, jobs
2. **Localização**: countries → regions → states → mesoregions → microregions → cities
3. **Clientes**: clients → client_integrations
4. **Equipamentos**: equipaments
5. **Veículos**: marks → vehicle_models → colors → vehicle_types → vehicles → aliases
6. **Passagens**: vehicle_passages, vehicle_whitelists
7. **Pessoas**: persons → person_documents → person_addresses
8. **Monitoramento**: person_monitoring_types → person_monitoring_type_notifications

### Rollback Seguro

Todas as migrations implementam `down()` method para rollback:

```bash
# Reverter última migration
php artisan migrate:rollback

# Reverter todas
php artisan migrate:reset

# Recrear banco do zero
php artisan migrate:fresh --seed
```

---

## Segurança

### Proteções Implementadas

1. **SQL Injection**: Eloquent ORM usa prepared statements
2. **Mass Assignment**: `$fillable` ou `$guarded` em todos os models
3. **Soft Deletes**: Dados nunca são realmente deletados
4. **Audit Trail**: Rastreamento de criação/atualização
5. **Foreign Keys**: Integridade referencial garantida
6. **Unique Constraints**: Previne duplicações

### Dados Sensíveis

- Senhas sempre em hash (bcrypt)
- Tokens criptografados
- Dados pessoais com LGPD compliance
- Logs de acesso via audit trail

---

## Referências

- [Laravel Database Migrations](https://laravel.com/docs/migrations)
- [Laravel Eloquent ORM](https://laravel.com/docs/eloquent)
- [Laravel MongoDB](https://github.com/mongodb/laravel-mongodb)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [IBGE Localidades](https://servicodados.ibge.gov.br/api/docs/localidades)
