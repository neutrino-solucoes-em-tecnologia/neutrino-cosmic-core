# Mapeamento de Tabelas - Sistema Legado → Sistema Atual

> Documentação de mapeamento entre tabelas do sistema legado e a nova arquitetura do microserviço.

## 🔙 [Voltar para Documentação Principal](README.md)

**Ver também**: [Estrutura do Banco de Dados](database-structure.md)

---

## 📊 Legenda

- ✅ **Migrada** - Tabela já implementada no novo sistema
- 🔄 **Mapeada** - Tabela renomeada/refatorada
- ⏳ **Pendente** - Aguardando migração
- ❌ **Descontinuada** - Não será migrada (funcionalidade removida/obsoleta)

---

## 🗂️ Tabelas por Domínio

### 🚗 Veículos

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `cor` | 🔄 | `colors` | Renomeada e normalizada |
| `cor_veiculo` | 🔄 | `color_aliases` | Sistema de aliases implementado |
| `marca_modelo` | 🔄 | `marks`, `vehicle_models` | Separada em 2 tabelas |
| `veiculos_marcas` | 🔄 | `marks`, `mark_aliases` | Normalizada com aliases |
| `veiculos_modelos` | 🔄 | `vehicle_models`, `vehicle_model_aliases` | Sistema de aliases |
| `veiculos_tipos` | 🔄 | `vehicle_types`, `vehicle_type_aliases` | Normalizada |
| `veiculos_cores` | 🔄 | `colors`, `color_aliases` | Consolidada |
| `tipo_veiculo` | 🔄 | `vehicle_types` | Renomeada |
| `veiculo` | ✅ | `vehicles` | Migrada |
| `veiculos` | ✅ | `vehicles` | Consolidada |
| `veiculo_whitelist` | ✅ | `vehicle_whitelists` | Migrada |

### 📍 Passagens de Veículos

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `passagens` | 🔄 | `vehicle_passages` | Consolidada |
| `passagens_v2` | ✅ | `vehicle_passages` | Versão atual |
| `passagens_view` | ❌ | - | View SQL, não migrada |
| `leitura` | ⏳ | - | Aguardando definição |
| `veiculos_lpr` | ⏳ | - | Aguardando definição |

### 👤 Pessoas

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `pessoa` | ✅ | `persons` | Migrada e expandida |
| `pessoa_documento` | ✅ | `person_documents` | Migrada |
| `pessoa_endereco` | ✅ | `person_addresses` | Migrada |
| `pessoa_foto` | ⏳ | - | Aguardando migração |
| `pessoa_relacionamento` | ⏳ | - | Aguardando migração |
| `pessoa_redesocial` | ⏳ | - | Aguardando migração |
| `pessoa_redesocial_relacionamento` | ⏳ | - | Aguardando migração |
| `pessoa_uuid` | ❌ | - | UUID agora é campo em `persons` |
| `pessoa_alerta` | ⏳ | - | Aguardando migração |
| `pessoa_desaparecida` | ⏳ | - | Aguardando migração |
| `pessoa_gm` | ⏳ | - | Aguardando migração |
| `pessoa_monitoramento` | 🔄 | `person_monitoring_types` | Refatorada |
| `pessoa_proprios` | ⏳ | - | Aguardando migração |
| `pessoa_rec_no` | ⏳ | - | Aguardando migração |
| `passagem_pessoa` | ⏳ | - | Aguardando migração |

### 🏢 Clientes e Equipamentos

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `cliente` | ✅ | `clients` | Migrada |
| `cliente_servico` | ⏳ | - | Aguardando migração |
| `equipamento` | ✅ | `equipaments` | Migrada |
| `equipamento_faixa` | ⏳ | - | Aguardando migração |
| `equipamento_instabilidade` | ⏳ | - | Aguardando migração |
| `equipamento_ivss` | ⏳ | - | Aguardando migração |
| `equipamento_one` | ⏳ | - | Aguardando migração |
| `equipamento_sirene` | ⏳ | - | Aguardando migração |
| `equipamento_tipo_evento` | ⏳ | - | Aguardando migração |
| `equipamentos_integracao` | ⏳ | - | Aguardando migração |

### 🔔 Alertas e Monitoramento

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `alerta` | ⏳ | - | Aguardando migração |
| `alerta_acoes` | ⏳ | - | Aguardando migração |
| `alerta_celular` | ⏳ | - | Aguardando migração |
| `alerta_notificacao` | ⏳ | - | Aguardando migração |
| `alerta_notificacao_ativo` | ⏳ | - | Aguardando migração |
| `alertas_passagens_clone` | ❌ | - | Tabela temporária/clone |
| `tipo_alerta` | ⏳ | - | Aguardando migração |
| `tipo_alerta_meteorologico` | ⏳ | - | Aguardando migração |
| `tipo_monitoramento_pessoa` | 🔄 | `person_monitoring_types` | Refatorada |
| `classificacao_tipo_monitoramento` | ⏳ | - | Aguardando migração |
| `monitoramento_caracteristicas` | ⏳ | - | Aguardando migração |
| `monitoramento_comportamental` | ⏳ | - | Aguardando migração |

### 📋 Ocorrências e Investigações

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `ocorrencia` | ⏳ | - | Aguardando migração |
| `ocorrencia_natureza` | ⏳ | - | Aguardando migração |
| `ocorrencia_pessoa` | ⏳ | - | Aguardando migração |
| `ocorrencia_passagem_veiculo` | ⏳ | - | Aguardando migração |
| `investigacao` | ⏳ | - | Aguardando migração |
| `investigacao_envolvimento` | ⏳ | - | Aguardando migração |
| `veiculos_ocorrencia` | ⏳ | - | Aguardando migração |

### 🌍 Localização

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `cidade` | 🔄 | `cities` | Expandida com hierarquia IBGE completa |
| `cidades_integracao` | ⏳ | - | Aguardando migração |

**Nova hierarquia implementada**:
- ✅ `countries` - Países
- ✅ `regions` - Regiões do Brasil
- ✅ `states` - Estados (UF)
- ✅ `mesoregions` - Mesorregiões
- ✅ `microregions` - Microrregiões
- ✅ `cities` - Municípios
- ✅ `districts` - Distritos *(se aplicável)*
- ✅ `subdistricts` - Subdistritos *(se aplicável)*

### 🔐 Autenticação e Controle de Acesso

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `usuario_cconet` | 🔄 | `users` | Consolidada |
| `usuario_externo` | 🔄 | `users` | Consolidada (usar flag ou tipo) |
| `usuario_token` | 🔄 | `personal_access_tokens` | Laravel Sanctum |
| `auth_token` | 🔄 | `personal_access_tokens` | Laravel Sanctum |

### 🔗 Integrações

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `integracao` | ✅ | `client_integrations` | Migrada e expandida |
| `integracao_defesa_civil` | ⏳ | - | Aguardando migração |
| `parceiros_integracao` | ⏳ | - | Aguardando migração |
| `instituicao_conveniada` | ⏳ | - | Aguardando migração |

### 📊 Classificações e Tipos

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `classificacao` | ⏳ | - | Aguardando definição |
| `classificacao_veiculo` | ⏳ | - | Aguardando definição |
| `tipo_documento` | ⏳ | - | Agora é ENUM em `person_documents` |
| `tipo_evento` | ⏳ | - | Aguardando migração |

### 📷 Câmeras e Dispositivos

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `camera_monitoramento_mapa` | ⏳ | - | Aguardando migração |
| `camera_pessoa_cidada` | ⏳ | - | Aguardando migração |
| `fabricante_camera` | ⏳ | - | Aguardando migração |
| `device` | ⏳ | - | Aguardando migração |

### 📝 Logs e Auditoria

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `log_acesso` | ⏳ | - | Aguardando migração |
| `log_consulta_instituicao_conveniada` | ⏳ | - | Aguardando migração |
| `log_exportacao_face` | ⏳ | - | Aguardando migração |
| `log_exportacao_passagem` | ⏳ | - | Aguardando migração |
| `log_one` | ⏳ | - | Aguardando migração |
| `email_log` | ⏳ | - | Aguardando migração |

### 🏫 Sistema Próprios (Escolar)

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `proprios` | ⏳ | - | Aguardando migração |
| `proprios_contato_alerta` | ⏳ | - | Aguardando migração |
| `proprios_equipamento` | ⏳ | - | Aguardando migração |
| `proprios_sala` | ⏳ | - | Aguardando migração |
| `proprios_turmas` | ⏳ | - | Aguardando migração |
| `lista_presenca` | ⏳ | - | Aguardando migração |
| `lista_presenca_aluno` | ⏳ | - | Aguardando migração |

### 🌧️ Meteorologia e Defesa Civil

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `acumulado_chuva_hora` | ⏳ | - | Aguardando migração |
| `rel_chuva_acumulada_hora` | ⏳ | - | Aguardando migração |
| `rel_chuva_acumulada_hora_2` | ⏳ | - | Aguardando migração |
| `leitura_cemaden` | ⏳ | - | Aguardando migração |

### 🔧 Sistema e Configurações

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `parametros` | ⏳ | - | Aguardando migração |
| `atualizacao_cconet` | ⏳ | - | Aguardando migração |
| `endpoint` | ⏳ | - | Aguardando migração |
| `chave` | ⏳ | - | Aguardando migração |
| `mensagem_service` | ⏳ | - | Aguardando migração |
| `periodo` | ⏳ | - | Aguardando migração |
| `matriz` | ⏳ | - | Aguardando migração |

### 🗑️ Descontinuadas / Sistema

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `phinxlog` | ❌ | - | Laravel usa `migrations` |
| `almox_pessoas_autorizadas` | ⏳ | - | Aguardando definição |
| `registros_cortex` | ⏳ | - | Aguardando definição |
| `ivss_alerta_evento` | ⏳ | - | Aguardando definição |

### 🏷️ Tags e Atributos

| Tabela Legado | Status | Nova Tabela | Observações |
|---------------|--------|-------------|-------------|
| `veiculos_atributos` | ⏳ | - | Aguardando migração |
| `veiculos_atributos_tags` | ⏳ | - | Aguardando migração |
| `veiculos_tags` | ⏳ | - | Aguardando migração |
| `veiculos_consulta` | ⏳ | - | Aguardando migração |
| `veiculos_correcao_passagem` | ⏳ | - | Aguardando migração |
| `veiculos_monitorados` | ⏳ | - | Aguardando migração |
| `veiculos_monitorados_celular` | ⏳ | - | Aguardando migração |

---

## 📈 Estatísticas de Migração

| Status | Quantidade | Percentual |
|--------|------------|------------|
| ✅ Migradas | 23 | ~18% |
| 🔄 Mapeadas/Refatoradas | 15 | ~12% |
| ⏳ Pendentes | 85 | ~67% |
| ❌ Descontinuadas | 4 | ~3% |
| **Total** | **127** | **100%** |

---

## 🎯 Prioridades de Migração

### Alta Prioridade
1. ✅ Sistema de Veículos (completo)
2. ✅ Sistema de Pessoas (básico)
3. ✅ Localização Geográfica (completo)
4. ✅ Sistema de Monitoramento (completo)
5. ⏳ Sistema de Ocorrências
6. ⏳ Sistema de Alertas

### Média Prioridade
7. ⏳ Logs e Auditoria
8. ⏳ Integrações Externas
9. ⏳ Câmeras e Dispositivos
10. ⏳ Fotos e Relacionamentos de Pessoas

### Baixa Prioridade
11. ⏳ Sistema Próprios (Escolar)
12. ⏳ Meteorologia
13. ⏳ Tags e Atributos Customizados

---

## 💡 Notas de Implementação

### Mudanças de Arquitetura

1. **UUID em todas as entidades**: Todas as tabelas agora possuem campo `uuid` para identificação externa segura
2. **Soft Deletes**: Implementado em todas as tabelas principais
3. **Audit Trail**: Campos `created_by`, `updated_by` em todas as entidades
4. **Timestamps**: `created_at`, `updated_at` automáticos via Eloquent
5. **Normalização**: Separação de tabelas e aliases para melhor performance
6. **Índices**: Índices otimizados em todos os campos de busca/filtro
7. **Foreign Keys**: Integridade referencial garantida

### Dual Database

- **MySQL**: Dados relacionais estruturados
- **MongoDB**: Réplica sincronizada automaticamente
- **Observers**: Sincronização bidirecional automática

### Convenções

- **Nomenclatura**: `snake_case` para tabelas e colunas
- **Pluralização**: Tabelas no plural (users, vehicles, persons)
- **Foreign Keys**: `{table_singular}_id` (client_id, vehicle_id)

---

## 🔗 Referências

- [Estrutura Completa do Banco de Dados](database-structure.md)
- [Sistema de Veículos](vehicles-structure.md)
- [Sistema de Monitoramento de Pessoas](person-monitoring-system.md)
- [Arquitetura de Localizações](locations-architecture.md)

---

**Última Atualização**: Dezembro 2025  
**Responsável**: Equipe CCONet