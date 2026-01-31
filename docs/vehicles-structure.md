# Estrutura do Banco de Dados - Sistema de Veículos

> Sistema completo de gerenciamento de veículos com marcas, modelos, cores, tipos e sistema de aliases.

## 🔙 [Voltar para Documentação Principal](README.md)

**Ver também**: [Estrutura do Banco de Dados - Seção 5: Veículos e Atributos](database-structure.md#5-veículos-e-atributos)

---

## Visão Geral

Este documento descreve a estrutura completa do banco de dados para o sistema de gerenciamento de veículos, incluindo tabelas principais e suas relações, aliases para flexibilidade de busca, e exemplos de uso.

## Índice

1. [Tabelas Principais](#tabelas-principais)
   - [Cores](#1-tabela-colors---cores-dos-veículos)
   - [Marcas](#2-tabela-marks---marcas-dos-veículos)
   - [Modelos](#3-tabela-models---modelos-dos-veículos)
   - [Tipos](#4-tabela-types---tipos-de-veículos)
   - [Veículos](#5-tabela-vehicles---veículos)
   - [Equipamentos](#6-tabela-equipaments---equipamentos-de-monitoramento)
   - [Passagens de Veículos](#7-tabela-vehicle_passages---passagens-de-veículos)
2. [Sistema de Aliases](#sistema-de-aliases)
3. [Relacionamentos](#relacionamentos)
4. [Padrões de Nomenclatura](#padrões-de-nomenclatura)
5. [Considerações de Performance](#considerações-de-performance)
6. [Flexibilidade de Busca](#flexibilidade-de-busca)

## Tabelas Principais

### 1. Tabela `colors` - Cores dos Veículos

| Coluna           | Tipo sugerido       | Comprimento / Detalhes                                  | Observações                                              |
| ---------------- | ------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| `id`             | `SMALLINT UNSIGNED` | AUTO_INCREMENT PK                                      | Identificador único                                      |
| `canonical_name` | `VARCHAR(50)`       | Indexado (UNIQUE)                                       | Nome canônico em inglês, ex.: `"black"`                  |
| `display_name`   | `VARCHAR(50)`       | —                                                       | Nome exibido para usuário (em português), ex.: `"Preto"` |
| `created_at`     | `DATETIME`          | Default `CURRENT_TIMESTAMP`                             | Auditoria                                                |
| `updated_at`     | `DATETIME`          | Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Auditoria                                                |

#### Tabela `color_aliases` - Aliases para Cores

| Coluna       | Tipo sugerido       | Comprimento / Detalhes      | Observações                                             |
| ------------ | ------------------- | --------------------------- | ------------------------------------------------------- |
| `id`         | `INT UNSIGNED`      | AUTO_INCREMENT PK          | Identificador único                                     |
| `color_id`   | `SMALLINT UNSIGNED` | FK → `colors.id`            | Referência para a cor principal                         |
| `alias`      | `VARCHAR(50)`       | Indexado                    | Variação do nome (ex.: `"preto"`, `"preta"`, `"black"`) |
| `created_at` | `DATETIME`          | Default `CURRENT_TIMESTAMP` | Auditoria                                               |

#### Exemplo de Dados - Cores

**Tabela `colors`:**

| id | canonical_name | display_name |
| -- | --------------- | ------------- |
| 1  | black           | Preto         |
| 2  | white           | Branco        |
| 3  | red             | Vermelho      |
| 4  | blue            | Azul          |
| 5  | green           | Verde         |

**Tabela `color_aliases`:**

| id | color_id | alias    |
| -- | --------- | -------- |
| 1  | 1         | preto    |
| 2  | 1         | preta    |
| 3  | 1         | black    |
| 4  | 2         | branco   |
| 5  | 2         | branca   |
| 6  | 2         | white    |
| 7  | 3         | vermelho |
| 8  | 3         | red      |
| 9  | 4         | azul     |
| 10 | 4         | blue     |
| 11 | 5         | verde    |
| 12 | 5         | green    |

#### Lógica de Uso - Cores

1. **Entrada do usuário**: O sistema recebe "preta"
2. **Busca em `color_aliases`**:
   ```sql
   SELECT c.*
   FROM color_aliases ca
   JOIN colors c ON ca.color_id = c.id
   WHERE ca.alias = 'preta'
   LIMIT 1;
   ```
3. **Resultado esperado**: Retorna a linha da tabela `colors` com:
   - `canonical_name` = black
   - `display_name` = Preto
4. **Saída do sistema**:
   - Para lógica interna → usar sempre o `canonical_name` (ex.: "black")
   - Para exibição → usar `display_name` (ex.: "Preto")

---

### 2. Tabela `marks` - Marcas dos Veículos

| Coluna           | Tipo sugerido       | Detalhes                                                | Observações                                       |
| ---------------- | ------------------- | ------------------------------------------------------- | ------------------------------------------------- |
| `id`             | `SMALLINT UNSIGNED` | AUTO_INCREMENT PK                                      | Identificador único                               |
| `canonical_name` | `VARCHAR(100)`      | Nome global da marca (ex.: `"General Motors"`)          | Representa a "entidade" por trás da marca         |
| `display_name`   | `VARCHAR(100)`      | Nome principal usado no sistema (ex.: `"Chevrolet"`)    | Nome preferido para exibição                      |
| `country_id`     | `SMALLINT UNSIGNED` | FK → `countries.id` (opcional)                          | País de origem da marca                           |
| `created_at`     | `DATETIME`          | Default `CURRENT_TIMESTAMP`                             | Auditoria                                         |
| `updated_at`     | `DATETIME`          | Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Auditoria                                         |

#### Tabela `mark_aliases` - Aliases para Marcas

| Coluna       | Tipo sugerido       | Detalhes                                       | Observações                  |
| ------------ | ------------------- | ---------------------------------------------- | ---------------------------- |
| `id`         | `INT UNSIGNED`      | AUTO_INCREMENT PK                             | Identificador                |
| `mark_id`    | `SMALLINT UNSIGNED` | FK → `marks.id`                                | Referência à marca principal |
| `alias`      | `VARCHAR(100)`      | Nome alternativo (ex.: `"Opel"`, `"Vauxhall"`) | Sinônimo/regional            |
| `created_at` | `DATETIME`          | Default `CURRENT_TIMESTAMP`                    | Auditoria                    |

#### Exemplo de Dados - Marcas

**Tabela `marks`:**

| id | canonical_name | display_name | country_id |
| -- | --------------- | ------------- | ----------- |
| 1  | General Motors  | Chevrolet     | (BR / US)   |
| 2  | Toyota Motor    | Toyota        | (JP)        |
| 3  | Volkswagen AG   | Volkswagen    | (DE)        |

**Tabela `mark_aliases`:**

| id | mark_id | alias     |
| -- | -------- | --------- |
| 1  | 1        | Opel      |
| 2  | 1        | Vauxhall  |
| 3  | 1        | Chevrolet |
| 4  | 2        | トヨタ      |
| 5  | 3        | VW        |

#### Lógica de Uso - Marcas

1. **Entrada do usuário**: O sistema recebe "Opel"
2. **Busca em `mark_aliases`**:
   ```sql
   SELECT m.*
   FROM mark_aliases ma
   JOIN marks m ON ma.mark_id = m.id
   WHERE ma.alias = 'Opel'
   LIMIT 1;
   ```
3. **Resultado esperado**: Traz `marks.display_name` = Chevrolet, mas você sabe que o alias "Opel" pertence à mesma entidade (General Motors)
4. **Saída do sistema**:
   - Para lógica interna → usar sempre o `canonical_name` (General Motors)
   - Para exibição padrão → usar `display_name` (Chevrolet)

---

### 3. Tabela `models` - Modelos dos Veículos

| Coluna           | Tipo sugerido       | Detalhes                                                | Observações                        |
| ---------------- | ------------------- | ------------------------------------------------------- | ---------------------------------- |
| `id`             | `INT UNSIGNED`      | AUTO_INCREMENT PK                                      | Identificador único                |
| `mark_id`        | `SMALLINT UNSIGNED` | FK → `marks.id`                                         | Relaciona modelo à marca principal |
| `canonical_name` | `VARCHAR(100)`      | Nome global do modelo (ex.: `"Corsa"`)                  | Valor canônico                     |
| `display_name`   | `VARCHAR(100)`      | Nome preferido para exibição (ex.: `"Corsa"`)           | Pode ser igual ao canônico         |
| `year_start`     | `YEAR` NULL         | Ano início de fabricação                                | Opcional                           |
| `year_end`       | `YEAR` NULL         | Ano fim de fabricação (NULL = ainda em produção)        | Opcional                           |
| `created_at`     | `DATETIME`          | Default `CURRENT_TIMESTAMP`                             | Auditoria                          |
| `updated_at`     | `DATETIME`          | Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Auditoria                          |

#### Tabela `model_aliases` - Aliases para Modelos

| Coluna       | Tipo sugerido      | Detalhes                                               | Observações               |
| ------------ | ------------------ | ------------------------------------------------------ | ------------------------- |
| `id`         | `INT UNSIGNED`     | AUTO_INCREMENT PK                                     | Identificador             |
| `model_id`   | `INT UNSIGNED`     | FK → `models.id`                                       | Relaciona ao modelo       |
| `alias`      | `VARCHAR(100)`     | Nome alternativo (ex.: `"Corsa Wind"`, `"Nova Corsa"`) | Nome regional ou variante |
| `created_at` | `DATETIME`         | Default `CURRENT_TIMESTAMP`                            | Auditoria                 |

#### Exemplo de Dados - Modelos

**Tabela `models`:**

| id | mark_id | canonical_name | display_name | generation  | year_start | year_end |
| -- | -------- | --------------- | ------------- | ----------- | ----------- | --------- |
| 1  | 1        | Corsa           | Corsa         | B           | 1994        | 2002      |
| 2  | 1        | Onix            | Onix          | 1ª Geração  | 2012        | 2019      |
| 3  | 2        | Corolla         | Corolla       | 12ª Geração | 2019        | NULL      |

**Tabela `model_aliases`:**

| id | model_id | alias           |
| -- | --------- | --------------- |
| 1  | 1         | Opel Corsa      |
| 2  | 1         | Vauxhall Corsa  |
| 3  | 1         | Chevrolet Corsa |
| 4  | 2         | Prisma          |
| 5  | 3         | カローラ           |

---

### 4. Tabela `types` - Tipos de Veículos

| Coluna           | Tipo sugerido      | Detalhes                                                | Observações                                                     |
| ---------------- | ------------------ | ------------------------------------------------------- | --------------------------------------------------------------- |
| `id`             | `TINYINT UNSIGNED` | AUTO_INCREMENT PK                                      | Pequeno número de tipos, então `TINYINT` é suficiente (até 255) |
| `canonical_name` | `VARCHAR(50)`      | Nome canônico (ex.: `"car"`, `"motorcycle"`)            | Usado internamente                                              |
| `display_name`   | `VARCHAR(50)`      | Nome de exibição (ex.: `"Carro"`, `"Moto"`)             | Apresentação para usuário                                       |
| `created_at`     | `DATETIME`         | Default `CURRENT_TIMESTAMP`                             | Auditoria                                                       |
| `updated_at`     | `DATETIME`         | Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Auditoria                                                       |

#### Tabela `type_aliases` - Aliases para Tipos

| Coluna       | Tipo sugerido      | Detalhes                                                  | Observações             |
| ------------ | ------------------ | --------------------------------------------------------- | ----------------------- |
| `id`         | `INT UNSIGNED`     | AUTO_INCREMENT PK                                        | Identificador           |
| `type_id`    | `TINYINT UNSIGNED` | FK → `types.id`                                           | Relaciona ao tipo       |
| `alias`      | `VARCHAR(50)`      | Nome alternativo (ex.: `"carro"`, `"automóvel"`, `"car"`) | Variação                |
| `created_at` | `DATETIME`         | Default `CURRENT_TIMESTAMP`                               | Auditoria               |

#### Exemplo de Dados - Tipos

**Tabela `types`:**

| id | canonical_name | display_name |
| -- | --------------- | ------------- |
| 1  | car             | Carro         |
| 2  | motorcycle      | Moto          |
| 3  | truck           | Caminhão      |
| 4  | bus             | Ônibus        |
| 5  | van             | Van           |

**Tabela `type_aliases`:**

| id | type_id | alias       |
| -- | -------- | ----------- |
| 1  | 1        | carro       |
| 2  | 1        | automóvel   |
| 3  | 1        | car         |
| 4  | 2        | moto        |
| 5  | 2        | motocicleta |
| 6  | 2        | motorcycle  |
| 7  | 3        | caminhão    |
| 8  | 3        | truck       |
| 9  | 4        | ônibus      |
| 10 | 4        | bus         |
| 11 | 5        | van         |

#### Lógica de Uso - Tipos

1. **Entrada do usuário**: O sistema recebe "automóvel"
2. **Busca em `type_aliases`**:
   ```sql
   SELECT t.*
   FROM type_aliases ta
   JOIN types t ON ta.type_id = t.id
   WHERE ta.alias = 'automóvel'
   LIMIT 1;
   ```
3. **Resultado esperado**: Retorna `types.canonical_name` = car e `display_name` = Carro
4. **Saída do sistema**:
   - Para lógica interna → usar `canonical_name` (car)
   - Para exibição → usar `display_name` (Carro)

---

### 5. Tabela `vehicles` - Veículos

| Coluna                | Tipo                             | Comprimento / Detalhes                                  | Observações                                                                                    |
| --------------------- | -------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `id`                  | `BIGINT UNSIGNED`                | AUTO_INCREMENT                                         | PK numérica sequencial                                                                         |
| `uuid`                | `CHAR(36)`                       | Indexado (`UNIQUE`)                                     | Para identificador global único (formato UUID v4, ex: `550e8400-e29b-41d4-a716-446655440000`)  |
| `plate`               | `VARCHAR(10)`                    | Indexado (`UNIQUE`)                                     | Placa do veículo. Ex: `BRA2E19`. Brasil usa 7 caracteres fixos, mas deixei 10 p/ flexibilidade |
| `mark_id`             | `INT UNSIGNED`                   | FK → `marks.id`                                         | Marca do veículo                                                                               |
| `model_id`            | `INT UNSIGNED`                   | FK → `models.id`                                        | Modelo do veículo                                                                              |
| `color_id`            | `TINYINT UNSIGNED` ou `SMALLINT` | FK → `colors.id`                                        | Se tiver poucos valores, use `TINYINT`; se mais de 255, use `SMALLINT`                         |
| `type_id`             | `TINYINT UNSIGNED` ou `SMALLINT` | FK → `types.id`                                         | Ex: carro, moto, caminhão                                                                      |
| `year_of_manufacture` | `YEAR(4)`                        | —                                                       | Ano de fabricação (ex: 2018)                                                                   |
| `year_model`          | `YEAR(4)`                        | —                                                       | Ano do modelo (ex: 2019)                                                                       |
| `chassis_number`      | `CHAR(17)`                       | Indexado (`UNIQUE`)                                     | Padrão VIN mundial tem **17 caracteres fixos**                                                 |
| `engine_number`       | `VARCHAR(50)`                    | Indexável                                               | Número do motor varia bastante entre fabricantes                                               |
| `created_at`          | `DATETIME`                       | Default `CURRENT_TIMESTAMP`                             | Auditoria                                                                                      |
| `updated_at`          | `DATETIME`                       | Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Auditoria                                                                                      |
| `deleted_at`          | `DATETIME NULL`                  | Indexável                                               | Soft delete                                                                                    |

#### Lógica de Uso - Veículos

1. **Entrada do usuário**: O sistema recebe "Opel Corsa"
2. **Busca em `model_aliases`**:
   ```sql
   SELECT m.*
   FROM model_aliases ma
   JOIN models m ON ma.model_id = m.id
   WHERE ma.alias = 'Opel Corsa'
   LIMIT 1;
   ```
3. **Resultado esperado**: Retorna `models.canonical_name` = Corsa (valor padronizado), associado à `marks.display_name` = Chevrolet
4. **Saída do sistema**:
   - Interno → usar `canonical_name` (Corsa)
   - Exibição → usar `display_name` (Corsa) ou alias da região correta (ex.: "Opel Corsa")

---

### 6. Tabela `equipaments` - Equipamentos de Monitoramento

| Coluna                    | Tipo sugerido     | Detalhes                                                               | Observações |
| ------------------------- | ----------------- | --------------------------------------------------------------------- | ----------- |
| `id`                      | `BIGINT UNSIGNED` | AUTO_INCREMENT PK                                                    | Identificador único |
| `uuid`                    | `CHAR(36)`        | Indexado (`UNIQUE`)                                                   | Para identificador global único (formato UUID v4, ex: `550e8400-e29b-41d4-a716-446655440000`) |
| `uuid_client_conciliation` | `CHAR(36)`        | Indexado (`UNIQUE`)                                                   | UUID específico para conciliação com sistemas do cliente |
| `client_identifier`       | `VARCHAR(100)`    | Identificador único do cliente/sistema (referência bruta)              | UNIQUE |
| `serial_number`           | `VARCHAR(100)`    | Número de série físico do equipamento                                 | UNIQUE |
| `latitude`                | `DECIMAL(12,10)`   | Latitude (WGS84)                                                      | Coordenada geográfica |
| `longitude`               | `DECIMAL(12,10)`   | Longitude (WGS84)                                                     | Coordenada geográfica |
| `location`                | `VARCHAR(255)`    | Endereço descritivo/localização aproximada                            | Endereço legível |
| `direction`               | `VARCHAR(50)`     | Direção da pista/estrada (ex.: "Northbound", "South", "East")         | Sentido do tráfego |
| `is_active`               | `BOOLEAN`         | Flag de status (1 = ativo, 0 = inativo)                               | Status do equipamento |
| `last_passed_at`          | `DATETIME NULL`   | Timestamp da última passagem detectada                                | Última atividade |
| `created_at`              | `DATETIME`        | Default `CURRENT_TIMESTAMP`                                           | Auditoria |
| `updated_at`              | `DATETIME`        | Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`               | Auditoria |
| `deleted_at`              | `DATETIME NULL`   | Soft delete                                                           | Exclusão lógica |

#### Campos UUID - Identificadores Únicos

A tabela `equipaments` utiliza dois campos UUID para diferentes propósitos:

**`uuid`** - Identificador Global:
- Formato UUID v4 (ex: `550e8400-e29b-41d4-a716-446655440000`)
- Usado para referências externas seguras
- Não revela informações sobre quantidade de equipamentos
- Padrão consistente com outras tabelas do sistema

**`uuid_client_conciliation`** - Conciliação com Cliente:
- UUID específico para integração com sistemas do cliente
- Facilita sincronização de dados entre sistemas
- Permite mapeamento com sistemas legados
- Cada cliente pode ter seu próprio sistema de identificação

#### Casos de Uso dos Identificadores

1. **API Externa**: Usar `uuid` para referências públicas
2. **Integração Cliente**: Usar `uuid_client_conciliation` para sincronização
3. **Auditoria Interna**: Usar `id` para performance
4. **Busca por Cliente**: Usar `client_identifier` para filtros

---


### 7. Tabela `vehicle_passages` - Passagens de Veículos

| Coluna           | Tipo sugerido     | Detalhes                                                      | Observações |
| ---------------- | ----------------- | ------------------------------------------------------------- | ----------- |
| `id`             | `BIGINT UNSIGNED` | AUTO_INCREMENT PK                                            | Identificador único |
| `vehicle_id`     | `BIGINT UNSIGNED` | FK → `vehicles.id`                                            | Referência ao veículo |
| `equipament_id`  | `BIGINT UNSIGNED` | FK → `equipaments.id`                                         | Referência ao equipamento |
| `plate`          | `VARCHAR(10)`     | Placa capturada no momento (mantém para busca e histórico)    | Placa no momento da passagem |
| `client`         | `VARCHAR(100)`    | Identificador bruto vindo do equipamento (mantido para WHERE) | ID do cliente/equipamento |
| `passed_at`      | `DATETIME`        | Data/hora da passagem                                         | Timestamp da passagem |
| `first`          | `BOOLEAN`         | Flag se foi a primeira passagem                               | Indica primeira passagem |
| `passage_images` | `JSON`            | Lista de imagens capturadas                                   | URLs/metadados das imagens |
| `latitude`       | `DECIMAL(10,8)`   | Latitude                                                      | Coordenada geográfica (pode ser NULL) |
| `longitude`      | `DECIMAL(11,8)`   | Longitude                                                     | Coordenada geográfica (pode ser NULL) |
| `location`       | `VARCHAR(255)`    | Endereço aproximado/localização                               | Endereço descritivo (pode ser NULL) |
| `created_at`     | `DATETIME`        | Default `CURRENT_TIMESTAMP`                                   | Auditoria |
| `updated_at`     | `DATETIME`        | Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`       | Auditoria |
| `deleted_at`     | `DATETIME NULL`   | Soft delete                                                   | Exclusão lógica |

---

## Sistema de Aliases

### Sanitização de Aliases

### Sistema de Sanitização

O sistema implementa um mecanismo de sanitização automática para todos os aliases, garantindo consistência e facilitando buscas:

#### Funções de Sanitização

- **`slugify(text)`**: Converte texto para formato URL-friendly (ex.: "Preto Fosco" → "preto-fosco")
- **`sanitizeAlias(text)`**: Remove acentos e caracteres especiais, normaliza espaços (ex.: "Preto Fosco" → "preto fosco")

#### Aplicação Automática

- **Entrada**: Todos os aliases são automaticamente sanitizados antes de serem persistidos
- **Busca**: As consultas de busca também são sanitizadas para garantir correspondência
- **Consistência**: Aliases duplicados ou similares são normalizados automaticamente

#### Exemplos de Sanitização

| Entrada Original | Alias Sanitizado | Observação |
| ---------------- | ---------------- | ---------- |
| "Preto Fosco"    | "preto fosco"    | Acentos removidos, espaços normalizados |
| "Azul Metálico"  | "azul metalico"  | Acentos removidos |
| "Vermelho Sangue" | "vermelho sangue" | Espaços normalizados |
| "トヨタ"          | ""               | Caracteres especiais removidos |

---

## Relacionamentos

### Diagrama de Relacionamentos

```
vehicles
├── mark_id → marks.id
├── model_id → models.id
├── color_id → colors.id
└── type_id → types.id

equipaments
└── (sem FKs externas - tabela independente)

vehicle_passages
├── vehicle_id → vehicles.id
└── equipament_id → equipaments.id

marks
└── country_id → countries.id (opcional)

models
└── mark_id → marks.id

mark_aliases
└── mark_id → marks.id

model_aliases
└── model_id → models.id

color_aliases
└── color_id → colors.id

type_aliases
└── type_id → types.id
```

### Descrição dos Relacionamentos

- **vehicles**: Tabela central que relaciona marca, modelo, cor e tipo
- **equipaments**: Tabela independente com equipamentos de monitoramento
- **vehicle_passages**: Registra passagens de veículos por equipamentos (relaciona vehicles + equipaments)
- **Aliases**: Tabelas auxiliares para flexibilidade de busca em todas as entidades principais



## Padrões de Nomenclatura

- **Tabelas principais**: Nome plural (`vehicles`, `marks`, `models`, `colors`, `types`)
- **Tabelas de alias**: Nome plural + `_aliases` (`mark_aliases`, `model_aliases`, etc.)
- **Campos de auditoria**: `created_at`, `updated_at`, `deleted_at`
- **Campos de relacionamento**: `{tabela}_id` (ex.: `mark_id`, `model_id`)

## Considerações de Performance

### Índices Recomendados

#### 📌 vehicle_passages
- **PK**: `id`
- **FKs**: `vehicle_id`, `equipament_id`
- **Busca rápida**: `plate`, `client`, `passed_at`
- **Geo (se precisar)**: índice em `(latitude, longitude)`

#### 📌 equipaments
- **PK**: `id`
- **UNIQUE**: `serial_number`, `client_identifier`
- **Busca rápida**: `is_active`, `last_passed_at`
- **Geo**: índice em `(latitude, longitude)`

#### 📌 vehicles
- **PK**: `id`
- **UNIQUE**: `uuid`, `plate`, `chassis_number`
- **FKs**: `mark_id`, `model_id`, `color_id`, `type_id`

#### 📌 Tabelas de Referência
- **marks**: `canonical_name` (UNIQUE)
- **models**: `mark_id`, `canonical_name`
- **colors**: `canonical_name` (UNIQUE)
- **types**: `canonical_name` (UNIQUE)

#### 📌 Tabelas de Alias
- **Todas as tabelas `*_aliases`**: `alias` (INDEX) para busca rápida

### Resumo de Padrões de Índices

👉 **Sempre**: PK + FKs + UNIQUE em identificadores
👉 **Índices em colunas de busca**: `plate`, `client`, `is_active`, `last_passed_at`
👉 **Índice geográfico**: `(latitude, longitude)` se tiver muita consulta por proximidade

### Otimizações

- **Soft delete**: Campo `deleted_at` para exclusão lógica em todas as tabelas principais
- **Timestamps automáticos**: `created_at` e `updated_at` com valores padrão
- **Sanitização otimizada**: Aliases são sanitizados uma vez na persistência, não em cada busca
- **Particionamento**: Considerar particionamento da tabela `vehicle_passages` por data (`passed_at`)
- **Cache**: Implementar cache para consultas frequentes de aliases

## Flexibilidade de Busca

O sistema permite buscas flexíveis através das tabelas de alias com sanitização automática:
- **Cores**: "preta" → "black" (canonical_name)
- **Marcas**: "Opel" → "General Motors" (canonical_name)
- **Modelos**: "Opel Corsa" → "Corsa" (canonical_name)
- **Tipos**: "automóvel" → "car" (canonical_name)

### Vantagens da Sanitização

1. **Consistência**: Todos os aliases seguem o mesmo padrão
2. **Busca eficiente**: Elimina variações desnecessárias
3. **Manutenção**: Facilita a limpeza e padronização de dados
4. **Experiência do usuário**: Buscas funcionam independentemente de acentos ou formatação

## Exemplos de Consultas SQL

### Busca de Veículo por Alias de Marca e Modelo

```sql
-- Buscar veículo por "Opel Corsa"
SELECT v.*, m.display_name as marca, mod.display_name as modelo
FROM vehicles v
JOIN models mod ON v.model_id = mod.id
JOIN marks m ON v.mark_id = m.id
JOIN model_aliases ma ON mod.id = ma.model_id
WHERE ma.alias = 'Opel Corsa'
LIMIT 1;
```

### Busca de Passagens por Período

```sql
-- Buscar passagens de um veículo em um período
SELECT vp.*, v.plate, m.display_name as marca, mod.display_name as modelo
FROM vehicle_passages vp
JOIN vehicles v ON vp.vehicle_id = v.id
JOIN models mod ON v.model_id = mod.id
JOIN marks m ON v.mark_id = m.id
WHERE vp.passed_at BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY vp.passed_at DESC;
```

### Busca Flexível por Cor

```sql
-- Buscar veículos por cor usando alias
SELECT v.*, c.display_name as cor
FROM vehicles v
JOIN colors c ON v.color_id = c.id
JOIN color_aliases ca ON c.id = ca.color_id
WHERE ca.alias = 'preta';
```

### Estatísticas de Passagens

```sql
-- Contar passagens por equipamento
SELECT 
    vp.equipament_id,
    e.location,
    e.direction,
    COUNT(*) as total_passagens,
    COUNT(DISTINCT vp.vehicle_id) as veiculos_unicos
FROM vehicle_passages vp
JOIN equipaments e ON vp.equipament_id = e.id
WHERE vp.passed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY vp.equipament_id, e.location, e.direction
ORDER BY total_passagens DESC;
```

### Consulta de Equipamentos Ativos

```sql
-- Buscar equipamentos ativos com última atividade
SELECT 
    e.*,
    vp.passed_at as ultima_passagem,
    v.plate as ultimo_veiculo
FROM equipaments e
LEFT JOIN vehicle_passages vp ON e.id = vp.equipament_id 
    AND vp.passed_at = e.last_passed_at
LEFT JOIN vehicles v ON vp.vehicle_id = v.id
WHERE e.is_active = 1
ORDER BY e.last_passed_at DESC;
```

### Busca por Proximidade Geográfica

```sql
-- Buscar equipamentos próximos a uma coordenada (raio de 5km)
SELECT 
    e.*,
    (6371 * acos(cos(radians(-23.5505)) * cos(radians(e.latitude)) * 
     cos(radians(e.longitude) - radians(-46.6333)) + 
     sin(radians(-23.5505)) * sin(radians(e.latitude)))) AS distance_km
FROM equipaments e
WHERE e.is_active = 1
HAVING distance_km < 5
ORDER BY distance_km;
```

Isso garante que o usuário possa encontrar veículos independentemente da variação regional ou linguística utilizada na busca, com o sistema automaticamente normalizando as entradas para melhor correspondência.
