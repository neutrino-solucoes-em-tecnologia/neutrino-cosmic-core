# Tabelas de Veículos - Status de Migração

> Mapeamento detalhado de todas as tabelas relacionadas a veículos entre o sistema legado e o novo microserviço.

## 🔙 [Voltar para Documentação Principal](README.md)

**Ver também**: 
- [Mapeamento Geral de Tabelas](tables.md)
- [Estrutura do Banco de Dados - Seção 5: Veículos e Atributos](database-structure.md#5-veículos-e-atributos)
- [Estrutura de Veículos](vehicles-structure.md)

---

## 📊 Resumo Executivo

| Status | Quantidade | Percentual |
|--------|------------|------------|
| ✅ Migradas | 11 | 55% |
| ⏳ Pendentes | 9 | 45% |
| **Total** | **20** | **100%** |

---

## ✅ Tabelas Migradas

### 1. `cor` → `colors`

**Status**: ✅ **Migrada e Normalizada**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `canonical_name` | VARCHAR(255) | UNIQUE, INDEX | Nome normalizado (inglês) |
| `display_name` | VARCHAR(255) | INDEX | Nome para exibição (português) |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Separação entre nome canônico (interno) e nome de exibição
- ✅ UUID para identificação externa
- ✅ Índices otimizados
- ✅ Soft deletes
- ✅ Sincronização MongoDB

**Model**: `App\Models\Vehicle\Color`  
**MongoDB Collection**: `colors`  
**Importador CSV**: `App\Imports\ColorImport`

**Exemplos**:
- canonical_name: `black` → display_name: `Preto`
- canonical_name: `white` → display_name: `Branco`

---

### 2. `cor_veiculo` → `color_aliases`

**Status**: ✅ **Migrada - Sistema de Aliases**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `color_id` | BIGINT UNSIGNED | INDEX, FK→colors | Cor referenciada |
| `alias` | VARCHAR(255) | INDEX | Nome alternativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Sistema de aliases para flexibilidade de busca
- ✅ Múltiplas variações aceitas (preto, preta, black, negro)
- ✅ Índice composto (color_id, alias)

**Model**: `App\Models\Vehicle\ColorAlias`  
**MongoDB Collection**: `color_aliases`  
**Importador CSV**: `App\Imports\ColorAliasImport`

---

### 3. `veiculos_marcas` → `marks`

**Status**: ✅ **Migrada e Normalizada**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `canonical_name` | VARCHAR(255) | INDEX | Nome global da marca |
| `display_name` | VARCHAR(255) | INDEX | Nome preferido para exibição |
| `country_id` | BIGINT UNSIGNED | FK→countries | País de origem |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Relacionamento com países (origem da marca)
- ✅ Separação entre nome global e nome de exibição
- ✅ Índices compostos para busca eficiente

**Model**: `App\Models\Vehicle\Mark`  
**MongoDB Collection**: `marks`  
**Importador CSV**: `App\Imports\MarkImport`

**Exemplos**:
- canonical_name: `General Motors` → display_name: `Chevrolet`
- canonical_name: `Volkswagen AG` → display_name: `Volkswagen`

---

### 4. `marca_modelo` → `mark_aliases`

**Status**: ✅ **Migrada - Sistema de Aliases**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `mark_id` | BIGINT UNSIGNED | INDEX, FK→marks | Marca referenciada |
| `alias` | VARCHAR(255) | INDEX | Nome alternativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Aliases para variações regionais (Opel, Vauxhall → Chevrolet)
- ✅ Suporte a abreviações (VW → Volkswagen)
- ✅ Índice composto (mark_id, alias)

**Model**: `App\Models\Vehicle\MarkAlias`  
**MongoDB Collection**: `mark_aliases`  
**Importador CSV**: `App\Imports\MarkAliasImport`

---

### 5. `veiculos_modelos` → `vehicle_models`

**Status**: ✅ **Migrada e Expandida**

#### Estrutura Nova

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

**Melhorias Implementadas**:
- ✅ Relacionamento com marca (FK)
- ✅ Relacionamento com país de origem
- ✅ Índices compostos (mark_id + canonical_name)

**Model**: `App\Models\Vehicle\VehicleModel`  
**MongoDB Collection**: `vehicle_models`  
**Importador CSV**: `App\Imports\VehicleModelImport`

---

### 6. `vehicle_model_aliases`

**Status**: ✅ **Criada - Sistema de Aliases**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `vehicle_model_id` | BIGINT UNSIGNED | INDEX, FK→vehicle_models | Modelo referenciado |
| `alias` | VARCHAR(255) | INDEX | Nome alternativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Aliases para variações (Corsa Wind, Nova Corsa → Corsa)
- ✅ Suporte a gerações (Gol G5, Gol G6 → Gol)

**Model**: `App\Models\Vehicle\VehicleModelAlias`  
**MongoDB Collection**: `vehicle_model_aliases`  
**Importador CSV**: `App\Imports\VehicleModelAliasImport`

---

### 7. `veiculos_tipos` → `vehicle_types`

**Status**: ✅ **Migrada e Normalizada**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `canonical_name` | VARCHAR(255) | UNIQUE | Nome normalizado |
| `display_name` | VARCHAR(255) | INDEX | Nome para exibição |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Tipos normalizados (car, motorcycle, truck, bus, etc.)
- ✅ Display names em português

**Model**: `App\Models\Vehicle\VehicleType`  
**MongoDB Collection**: `vehicle_types`  
**Importador CSV**: `App\Imports\VehicleTypeImport`

**Exemplos**:
- canonical_name: `car` → display_name: `Carro`
- canonical_name: `motorcycle` → display_name: `Moto`

---

### 8. `tipo_veiculo` → `vehicle_type_aliases`

**Status**: ✅ **Migrada - Sistema de Aliases**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | INDEX | Identificador externo |
| `vehicle_type_id` | BIGINT UNSIGNED | INDEX, FK→vehicle_types | Tipo referenciado |
| `alias` | VARCHAR(255) | INDEX | Nome alternativo |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Aliases multi-idioma (CAR, vehicle, auto → Carro)
- ✅ Flexibilidade para diferentes nomenclaturas

**Model**: `App\Models\Vehicle\VehicleTypeAlias`  
**MongoDB Collection**: `vehicle_type_aliases`  
**Importador CSV**: `App\Imports\VehicleTypeAliasImport`

---

### 9. `veiculo` / `veiculos` → `vehicles`

**Status**: ✅ **Consolidada**

#### Estrutura Nova

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

**Melhorias Implementadas**:
- ✅ Consolidação de `veiculo` e `veiculos` em uma única tabela
- ✅ Relacionamentos completos (marca, modelo, cor, tipo)
- ✅ Índice composto (plate, mark_id, model_id)
- ✅ Campos adicionais (chassis, motor)

**Model**: `App\Models\Vehicle\Vehicle`  
**MongoDB Collection**: `vehicles`

---

### 10. `passagens_v2` → `vehicle_passages`

**Status**: ✅ **Migrada**

#### Estrutura Nova

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
| `first` | BOOLEAN | DEFAULT false | Primeira passagem |
| `passage_images` | JSON | NULL | URLs/paths das imagens |
| `latitude` | DECIMAL(10,8) | NULL | Latitude |
| `longitude` | DECIMAL(11,8) | NULL | Longitude |
| `location` | VARCHAR(500) | NULL | Descrição do local |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Relacionamento com cliente via FK
- ✅ Coordenadas geográficas
- ✅ Array de imagens (JSON)
- ✅ Índices compostos para consultas temporais

**Model**: `App\Models\Vehicle\VehiclePassage`  
**MongoDB Collection**: `vehicle_passages`

---

### 11. `veiculo_whitelist` → `vehicle_whitelists`

**Status**: ✅ **Migrada**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `client_id` | BIGINT UNSIGNED | INDEX, FK→clients | Cliente |
| `vehicle_id` | BIGINT UNSIGNED | INDEX, FK→vehicles | Veículo autorizado |
| `observation` | VARCHAR(255) | NULL | Observações |
| `status` | ENUM | 'active', 'inactive' | Status da autorização |
| `monitor_until` | DATETIME | NULL, INDEX | Validade da autorização |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que criou |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | INDEX | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Constraint UNIQUE (client_id, vehicle_id)
- ✅ Validade temporal (monitor_until)
- ✅ Audit trail completo
- ✅ Índices otimizados

**Model**: `App\Models\Vehicle\VehicleWhitelist`  
**MongoDB Collection**: `vehicle_whitelists`

---

## ⏳ Tabelas Pendentes de Migração

### 1. `veiculos_cores`

**Status**: ❌ **Descontinuada / Consolidada**

**Motivo**: Funcionalidade consolidada em `colors` e `color_aliases`

---

### 2. `classificacao_veiculo`

**Descrição**: Classificações adicionais de veículos  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- vehicle_id (FK)
- classification_type (commercial, official, emergency, etc.)
- classification_value
- valid_from / valid_until
- Audit trail

**Complexidade**: Baixa

---

### 3. `veiculos_atributos`

**Descrição**: Atributos customizados para veículos  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- vehicle_id (FK)
- attribute_key
- attribute_value
- attribute_type (text, number, boolean, date, etc.)
- Audit trail

**Complexidade**: Média

---

### 4. `veiculos_atributos_tags`

**Descrição**: Tags associadas a atributos de veículos  
**Prioridade**: 🟢 **Baixa**

**Campos Esperados**:
- vehicle_attribute_id (FK)
- tag_name
- tag_value
- Audit trail

**Complexidade**: Baixa  
**Dependências**: `veiculos_atributos`

---

### 5. `veiculos_consulta`

**Descrição**: Log de consultas realizadas sobre veículos  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- vehicle_id (FK)
- user_id (FK)
- consulted_at
- query_type
- query_parameters (JSON)
- result_found (boolean)
- Audit trail

**Complexidade**: Baixa

---

### 6. `veiculos_correcao_passagem`

**Descrição**: Correções manuais em passagens de veículos  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- passage_id (FK)
- corrected_by (FK→users)
- correction_type (plate, vehicle_id, datetime, etc.)
- old_value
- new_value
- reason
- corrected_at
- Audit trail

**Complexidade**: Média  
**Dependências**: Sistema de passagens

---

### 7. `veiculos_lpr`

**Descrição**: Dados específicos de LPR (License Plate Recognition)  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- passage_id (FK)
- confidence_score
- plate_image_path
- ocr_result
- processing_time_ms
- algorithm_version
- raw_data (JSON)
- Audit trail

**Complexidade**: Alta  
**Dependências**: Sistema de processamento LPR

---

### 8. `veiculos_tags`

**Descrição**: Sistema de tags para veículos  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- vehicle_id (FK)
- tag_name
- tag_category
- tag_color
- created_by (FK→users)
- expires_at
- Audit trail

**Complexidade**: Baixa

---

### 9. `veiculos_monitorados`

**Descrição**: Veículos sob monitoramento especial  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- vehicle_id (FK)
- client_id (FK)
- monitoring_type_id (FK)
- reason
- started_at
- expires_at
- is_active
- alert_on_passage (boolean)
- notes
- Audit trail

**Complexidade**: Média  
**Dependências**: Sistema de alertas

---

### 10. `veiculos_monitorados_celular`

**Descrição**: Notificações mobile para veículos monitorados  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- monitored_vehicle_id (FK)
- user_id (FK)
- device_token
- notification_enabled
- last_notified_at
- Audit trail

**Complexidade**: Média  
**Dependências**: `veiculos_monitorados`, sistema de notificações

---

### 11. `veiculos_ocorrencia`

**Descrição**: Vínculo entre veículos e ocorrências  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- vehicle_id (FK)
- occurrence_id (FK)
- involvement_type (suspect, victim, witness, stolen, etc.)
- notes
- Audit trail

**Complexidade**: Baixa  
**Dependências**: Sistema de ocorrências

---

### 12. `passagens`

**Status**: 🔄 **Consolidada em `vehicle_passages`**

**Motivo**: Versão anterior consolidada com `passagens_v2`

---

### 13. `passagens_view`

**Status**: ❌ **Descontinuada**

**Motivo**: View SQL, não requer migração (pode ser recriada se necessário)

---

### 14. `leitura`

**Descrição**: Leituras brutas de equipamentos (antes do processamento)  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- equipament_id (FK)
- raw_data (JSON/TEXT)
- read_at
- processed (boolean)
- processed_at
- processing_result
- Audit trail

**Complexidade**: Média

---

## 📋 Roadmap de Migração

### Fase 1 - Sistema Base (✅ Concluído)
1. ✅ `cor` → `colors`
2. ✅ `cor_veiculo` → `color_aliases`
3. ✅ `veiculos_marcas` → `marks`
4. ✅ `marca_modelo` → `mark_aliases`
5. ✅ `veiculos_modelos` → `vehicle_models`
6. ✅ `vehicle_model_aliases`
7. ✅ `veiculos_tipos` → `vehicle_types`
8. ✅ `tipo_veiculo` → `vehicle_type_aliases`
9. ✅ `veiculo/veiculos` → `vehicles`
10. ✅ `passagens_v2` → `vehicle_passages`
11. ✅ `veiculo_whitelist` → `vehicle_whitelists`

### Fase 2 - Monitoramento e Alertas (Q1 2026)
12. ⏳ `veiculos_monitorados` → `monitored_vehicles`
13. ⏳ `veiculos_monitorados_celular` → `monitored_vehicle_notifications`
14. ⏳ `veiculos_ocorrencia` → `vehicle_occurrences`
15. ⏳ `veiculos_correcao_passagem` → `passage_corrections`

### Fase 3 - LPR e Processamento (Q2 2026)
16. ⏳ `veiculos_lpr` → `vehicle_lpr_data`
17. ⏳ `leitura` → `equipment_readings`

### Fase 4 - Atributos e Tags (Q3 2026)
18. ⏳ `veiculos_atributos` → `vehicle_attributes`
19. ⏳ `veiculos_tags` → `vehicle_tags`
20. ⏳ `classificacao_veiculo` → `vehicle_classifications`
21. ⏳ `veiculos_consulta` → `vehicle_query_logs`

---

## 🔧 Padrões de Implementação

### Sistema de Aliases

Todas as entidades principais possuem tabelas de aliases:

```php
// Busca com aliases
$color = ColorAlias::where('alias', 'preto')
    ->with('color')
    ->first()
    ->color;

// Resultado
// canonical_name: 'black'
// display_name: 'Preto'
```

### Importação via CSV

Comando unificado para importar dados de referência:

```bash
php artisan csv:import --force
```

Arquivos suportados:
- `colors.csv`
- `color_aliases.csv`
- `marks.csv`
- `mark_aliases.csv`
- `vehicle_models.csv`
- `vehicle_model_aliases.csv`
- `vehicle_types.csv`
- `vehicle_type_aliases.csv`

### Relacionamentos Eloquent

```php
// Vehicle Model
class Vehicle extends Model
{
    public function mark() {
        return $this->belongsTo(Mark::class);
    }
    
    public function model() {
        return $this->belongsTo(VehicleModel::class, 'model_id');
    }
    
    public function color() {
        return $this->belongsTo(Color::class);
    }
    
    public function type() {
        return $this->belongsTo(VehicleType::class, 'type_id');
    }
    
    public function passages() {
        return $this->hasMany(VehiclePassage::class);
    }
    
    public function whitelists() {
        return $this->hasMany(VehicleWhitelist::class);
    }
}
```

### Observers para MongoDB

Todas as models de veículos possuem observers para sincronização automática:

```php
// Registrado em AppServiceProvider
Vehicle::observe(VehicleObserver::class);
Color::observe(ColorObserver::class);
Mark::observe(MarkObserver::class);
// etc...
```

---

## 📊 Métricas de Progresso

### Tabelas
- ✅ Migradas: **11** (55%)
- ⏳ Pendentes: **9** (45%)
- ❌ Descontinuadas: **0** (0%)

### Linhas de Código (estimado)
- Models: ~2.500 linhas
- Observers: ~1.200 linhas
- Migrations: ~1.800 linhas
- Importers: ~900 linhas
- Tests: ~3.000 linhas

### Importadores CSV
- ✅ Implementados: **8** (colors, color_aliases, marks, mark_aliases, vehicle_models, vehicle_model_aliases, vehicle_types, vehicle_type_aliases)
- ⏳ Pendentes: **0**

### Complexidade
- 🟢 Baixa: 5 tabelas
- 🟡 Média: 7 tabelas
- 🔴 Alta: 3 tabelas

---

## 🎯 Prioridades Próximas Fases

### Alta Prioridade
1. `veiculos_monitorados` - Sistema de monitoramento ativo
2. `veiculos_ocorrencia` - Vínculo com ocorrências
3. `veiculos_lpr` - Dados de reconhecimento de placa
4. `veiculos_correcao_passagem` - Correções manuais
5. `leitura` - Processamento de leituras brutas

### Média Prioridade
6. `classificacao_veiculo` - Classificações adicionais
7. `veiculos_atributos` - Atributos customizados
8. `veiculos_tags` - Sistema de tags
9. `veiculos_consulta` - Log de consultas
10. `veiculos_monitorados_celular` - Notificações mobile

### Baixa Prioridade
11. `veiculos_atributos_tags` - Tags de atributos (dependente)

---

## 🔗 Referências

- [Estrutura do Banco de Dados - Veículos](database-structure.md#5-veículos-e-atributos)
- [Estrutura de Veículos](vehicles-structure.md)
- [Comandos - csv:import](Commands.md#csvimport)
- [Mapeamento Geral de Tabelas](tables.md)

---

**Última Atualização**: Dezembro 2025  
**Responsável**: Equipe CCONet  
**Status Geral**: 🟢 Em Bom Andamento (55% concluído)