# Tabelas de Pessoas - Status de Migração

> Mapeamento detalhado de todas as tabelas relacionadas a pessoas entre o sistema legado e o novo microserviço.

## 🔙 [Voltar para Documentação Principal](README.md)

**Ver também**: 
- [Mapeamento Geral de Tabelas](tables.md)
- [Estrutura do Banco de Dados - Seção 7: Pessoas](database-structure.md#7-pessoas)
- [Sistema de Monitoramento de Pessoas](person-monitoring-system.md)

---

## 📊 Resumo Executivo

| Status | Quantidade | Percentual |
|--------|------------|------------|
| ✅ Migradas | 5 | 33% |
| ⏳ Pendentes | 10 | 67% |
| **Total** | **15** | **100%** |

---

## ✅ Tabelas Migradas

### 1. `pessoa` → `persons`

**Status**: ✅ **Migrada e Expandida**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `full_name` | VARCHAR(255) | INDEX | Nome completo |
| `social_name` | VARCHAR(255) | NULL | Nome social |
| `birth_date` | DATE | NULL, INDEX | Data de nascimento |
| `gender` | ENUM('M','F','O','N') | NULL, INDEX | Gênero |
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

**Melhorias Implementadas**:
- ✅ UUID para identificação externa segura
- ✅ Soft deletes implementado
- ✅ Audit trail completo (created_by, updated_by)
- ✅ Sistema de blacklist integrado
- ✅ Relacionamentos geográficos (país, cidade, estado)
- ✅ Índices otimizados para consultas frequentes
- ✅ Sincronização automática com MongoDB

**Model**: `App\Models\Person\Person`  
**Observer**: `App\Observers\Person\PersonObserver`  
**MongoDB Collection**: `persons`

---

### 2. `pessoa_documento` → `person_documents`

**Status**: ✅ **Migrada**

#### Estrutura Nova

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

**Constraints Especiais**:
- UNIQUE (`person_id`, `document_type`, `document_number`) - Previne duplicação

**Melhorias Implementadas**:
- ✅ Suporte a múltiplos tipos de documentos
- ✅ Validação de datas (emissão, validade)
- ✅ Constraint de unicidade para prevenir duplicação
- ✅ Audit trail completo
- ✅ Soft deletes
- ✅ Sincronização MongoDB

**Model**: `App\Models\Person\PersonDocument`  
**Observer**: `App\Observers\Person\PersonDocumentObserver`  
**MongoDB Collection**: `person_documents`

---

### 3. `pessoa_endereco` → `person_addresses`

**Status**: ✅ **Migrada**

#### Estrutura Nova

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

**Melhorias Implementadas**:
- ✅ Múltiplos tipos de endereço
- ✅ Flag de endereço principal
- ✅ Coordenadas geográficas opcionais
- ✅ Relacionamentos com cidades e estados
- ✅ Índices otimizados (postal_code, city_id, state_id)
- ✅ Audit trail completo
- ✅ Sincronização MongoDB

**Model**: `App\Models\Person\PersonAddress`  
**Observer**: `App\Observers\Person\PersonAddressObserver`  
**Seeder**: `PersonAddressSeeder` (endereços brasileiros realistas)  
**MongoDB Collection**: `person_addresses`

---

### 4. `tipo_monitoramento_pessoa` → `person_monitoring_types`

**Status**: ✅ **Migrada e Refatorada**

#### Estrutura Nova

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `client_id` | BIGINT UNSIGNED | INDEX, FK→clients | Cliente proprietário |
| `name` | VARCHAR(50) | | Nome curto do tipo |
| `description` | VARCHAR(255) | | Descrição detalhada |
| `priority` | ENUM | 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL' | Prioridade do alerta |
| `color` | VARCHAR(7) | DEFAULT '#FF5733' | Cor hexadecimal |
| `audio_file` | VARCHAR(255) | NULL | Nome do arquivo de áudio |
| `generates_occurrence` | BOOLEAN | DEFAULT false | Se gera ocorrência automática |
| `show_screen_alert` | BOOLEAN | DEFAULT false | Se exibe alerta na tela |
| `push_notification_id` | BIGINT UNSIGNED | NULL, FK→person_monitoring_type_notifications | Template Push |
| `sms_notification_id` | BIGINT UNSIGNED | NULL, FK→person_monitoring_type_notifications | Template SMS |
| `whatsapp_notification_id` | BIGINT UNSIGNED | NULL, FK→person_monitoring_type_notifications | Template WhatsApp |
| `email_notification_id` | BIGINT UNSIGNED | NULL, FK→person_monitoring_type_notifications | Template Email |
| `is_active` | BOOLEAN | DEFAULT true, INDEX | Status ativo/inativo |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário criador |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Melhorias Implementadas**:
- ✅ Sistema de prioridades (LOW → CRITICAL)
- ✅ Integração com templates de notificação multi-canal
- ✅ Alertas visuais e sonoros configuráveis
- ✅ Geração automática de ocorrências
- ✅ Índices otimizados para consultas por cliente e prioridade
- ✅ Métodos helper: `isCritical()`, `isHigh()`, `hasNotifications()`, `shouldAlert()`

**Model**: `App\Models\Persons\PersonMonitoringType`  
**Observer**: `App\Observers\Persons\PersonMonitoringTypeObserver`  
**Seeder**: `PersonMonitoringTypeSeeder` (8 tipos de monitoramento)  
**MongoDB Collection**: `person_monitoring_types`

**Ver**: [Sistema de Monitoramento de Pessoas](person-monitoring-system.md)

---

### 5. `person_monitoring_type_notifications` (Nova Tabela)

**Status**: ✅ **Criada no Novo Sistema**

#### Estrutura

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID único |
| `uuid` | UUID | UNIQUE | Identificador externo |
| `client_id` | BIGINT UNSIGNED | INDEX, FK→clients | Cliente proprietário |
| `name` | VARCHAR(100) | | Nome do template |
| `description` | TEXT | NULL | Descrição detalhada |
| `notification_channel` | ENUM | 'PUSH', 'SMS', 'WHATSAPP', 'EMAIL' | Canal de notificação |
| `message_template` | TEXT | | Template com variáveis {{var}} |
| `subject_template` | TEXT | NULL | Template do assunto (Email) |
| `configuration` | JSON | NULL | Configurações do canal |
| `is_active` | BOOLEAN | DEFAULT true, INDEX | Status ativo/inativo |
| `created_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário criador |
| `updated_by` | BIGINT UNSIGNED | NULL, FK→users | Usuário que atualizou |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

**Funcionalidades**:
- ✅ Templates reutilizáveis por canal
- ✅ Suporte a variáveis: `{{pessoa_nome}}`, `{{cpf}}`, `{{equipamento_nome}}`, etc.
- ✅ Método `renderTemplate($variables)` para substituição de variáveis
- ✅ Configurações específicas por canal (JSON)
- ✅ Relacionamentos bidirecionais com monitoring types

**Model**: `App\Models\Persons\PersonMonitoringTypeNotification`  
**Observer**: `App\Observers\Persons\PersonMonitoringTypeNotificationObserver`  
**MongoDB Collection**: `person_monitoring_type_notifications`

---

## ⏳ Tabelas Pendentes de Migração

### 1. `pessoa_foto`

**Descrição**: Fotos/imagens de pessoas  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- person_id (FK)
- photo_type (profile, document, etc.)
- file_path / storage_path
- mime_type
- file_size
- is_primary
- Audit trail

**Complexidade**: Média  
**Dependências**: Sistema de storage/filesystem

---

### 2. `pessoa_relacionamento`

**Descrição**: Relacionamentos entre pessoas (familiar, profissional, etc.)  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- person_id (pessoa principal)
- related_person_id
- relationship_type (spouse, parent, child, colleague, etc.)
- start_date / end_date
- notes
- Audit trail

**Complexidade**: Média  
**Dependências**: Lógica de relacionamentos bidirecionais

---

### 3. `pessoa_redesocial`

**Descrição**: Perfis de redes sociais das pessoas  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- person_id (FK)
- social_network (facebook, instagram, twitter, linkedin, etc.)
- profile_url
- username
- is_verified
- last_updated
- Audit trail

**Complexidade**: Baixa

---

### 4. `pessoa_redesocial_relacionamento`

**Descrição**: Relacionamentos/conexões em redes sociais  
**Prioridade**: 🟢 **Baixa**

**Campos Esperados**:
- person_social_id
- related_person_social_id
- relationship_type
- discovered_at
- Audit trail

**Complexidade**: Média  
**Dependências**: `pessoa_redesocial`

---

### 5. `pessoa_uuid`

**Status**: ❌ **Descontinuada**

**Motivo**: UUID agora é campo direto na tabela `persons`

---

### 6. `pessoa_alerta`

**Descrição**: Alertas configurados para pessoas específicas  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- person_id (FK)
- alert_type_id (FK)
- monitoring_type_id (FK)
- is_active
- expires_at
- notes
- Audit trail

**Complexidade**: Média  
**Dependências**: Sistema de alertas

---

### 7. `pessoa_desaparecida`

**Descrição**: Registro de pessoas desaparecidas  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- person_id (FK)
- missing_since
- last_seen_location
- last_seen_by
- reporting_person_id
- police_report_number
- status (missing, found, closed)
- case_notes
- found_at / found_location
- Audit trail

**Complexidade**: Alta  
**Dependências**: Sistema de ocorrências

---

### 8. `pessoa_gm`

**Descrição**: Integração específica com sistema GM  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- person_id (FK)
- gm_id (ID no sistema GM)
- sync_status
- last_sync_at
- gm_data (JSON)

**Complexidade**: Baixa  
**Dependências**: Definição de integração GM

---

### 9. `pessoa_proprios`

**Descrição**: Vínculo de pessoas com sistema escolar "Próprios"  
**Prioridade**: 🟢 **Baixa**

**Campos Esperados**:
- person_id (FK)
- proprios_id (FK)
- relationship_type (student, teacher, parent, etc.)
- enrollment_number
- is_active
- Audit trail

**Complexidade**: Média  
**Dependências**: Sistema Próprios (escolar)

---

### 10. `pessoa_rec_no`

**Descrição**: Reconhecimento facial / biometria  
**Prioridade**: 🟡 **Média**

**Campos Esperados**:
- person_id (FK)
- recognition_type (facial, fingerprint, iris, etc.)
- biometric_data (binário ou hash)
- quality_score
- registered_at
- Audit trail

**Complexidade**: Alta  
**Dependências**: Sistema de biometria/reconhecimento

---

### 11. `passagem_pessoa`

**Descrição**: Registros de passagens de pessoas por equipamentos  
**Prioridade**: 🔴 **Alta**

**Campos Esperados**:
- person_id (FK)
- equipament_id (FK)
- passed_at
- confidence_score
- detection_type (facial_recognition, document_scan, manual)
- images (JSON)
- location
- latitude / longitude
- Audit trail

**Complexidade**: Alta  
**Dependências**: Sistema de detecção/reconhecimento de pessoas

---

## 📋 Roadmap de Migração

### Fase 1 - Crítico (Q1 2026)
1. ✅ `pessoa` → `persons` *(concluído)*
2. ✅ `pessoa_documento` → `person_documents` *(concluído)*
3. ✅ `pessoa_endereco` → `person_addresses` *(concluído)*
4. ⏳ `pessoa_foto` → `person_photos`
5. ⏳ `pessoa_alerta` → `person_alerts`
6. ⏳ `pessoa_desaparecida` → `missing_persons`
7. ⏳ `passagem_pessoa` → `person_passages`

### Fase 2 - Importante (Q2 2026)
8. ⏳ `pessoa_relacionamento` → `person_relationships`
9. ⏳ `pessoa_redesocial` → `person_social_networks`
10. ⏳ `pessoa_rec_no` → `person_biometrics`
11. ⏳ `pessoa_gm` → `person_gm_integration`

### Fase 3 - Opcional (Q3 2026)
12. ⏳ `pessoa_redesocial_relacionamento` → `person_social_relationships`
13. ⏳ `pessoa_proprios` → `person_school_links`

---

## 🔧 Padrões de Implementação

### Convenções Adotadas

1. **Nomenclatura**: `person_` prefix para todas as tabelas
2. **UUID**: Todas as tabelas possuem campo `uuid` UNIQUE
3. **Soft Deletes**: `deleted_at` em todas as tabelas
4. **Audit Trail**: `created_by`, `updated_by` em todas as tabelas
5. **Timestamps**: `created_at`, `updated_at` automáticos
6. **Índices**: Campos de busca/filtro sempre indexados
7. **Foreign Keys**: Sempre com estratégia de deleção definida (CASCADE ou SET NULL)

### Estrutura de Models

```php
namespace App\Models\Person;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonExample extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uuid', 'person_id', /* outros campos */
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
    ];

    // Relacionamentos
    public function person() {
        return $this->belongsTo(Person::class);
    }
}
```

### Estrutura de Observers

```php
namespace App\Observers\Person;

use App\Models\Person\PersonExample;
use MongoDB\Laravel\Eloquent\Model as MongoModel;

class PersonExampleObserver
{
    public function created(PersonExample $model): void
    {
        $this->syncToMongoDB($model);
    }

    public function updated(PersonExample $model): void
    {
        $this->syncToMongoDB($model);
    }

    protected function syncToMongoDB(PersonExample $model): void
    {
        DB::connection('mongodb')
            ->collection('person_examples')
            ->updateOne(
                ['id' => $model->id],
                ['$set' => $model->toArray()],
                ['upsert' => true]
            );
    }
}
```

---

## 📊 Métricas de Progresso

### Tabelas
- ✅ Migradas: **5** (33%)
- ⏳ Pendentes: **10** (67%)
- ❌ Descontinuadas: **0** (0%)

### Linhas de Código (estimado)
- Models: ~1.200 linhas
- Observers: ~600 linhas
- Migrations: ~800 linhas
- Seeders: ~400 linhas
- Tests: ~1.500 linhas

### Complexidade
- 🟢 Baixa: 3 tabelas
- 🟡 Média: 5 tabelas
- 🔴 Alta: 4 tabelas

---

## 🔗 Referências

- [Estrutura do Banco de Dados - Pessoas](database-structure.md#7-pessoas)
- [Sistema de Monitoramento de Pessoas](person-monitoring-system.md)
- [Mapeamento Geral de Tabelas](tables.md)
- [API de Pessoas](../routes/persons.php) *(quando implementado)*

---

**Última Atualização**: Dezembro 2025  
**Responsável**: Equipe CCONet  
**Status Geral**: 🟡 Em Progresso (33% concluído)