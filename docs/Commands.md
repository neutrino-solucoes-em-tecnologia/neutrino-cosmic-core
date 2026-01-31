# Console Commands Documentation

> Documentação completa de todos os comandos Artisan disponíveis no microserviço de processamento de passagens de veículos.

## 📚 Índice

- [csv:import](#csvimport) - Importa arquivos CSV para popular o banco de dados
- [db:sync-indexes](#dbsync-indexes) - Replica índices do MySQL para MongoDB
- [passages:process](#passagesprocess) - Processa passagens de veículos do Redis
- [trafficeye:process](#trafficeyeprocess) - Processa resultados do TrafficEye

## 🔙 [Voltar para Documentação Principal](README.md)

---

## csv:import

Comando utilitário para importar arquivos CSV e popular o banco de dados com dados de referência (marcas, modelos, cores, tipos de veículos, equipamentos e aliases).

### Descrição

Este comando importa múltiplos arquivos CSV localizados no diretório `database/csv/` para suas respectivas tabelas no banco de dados. É utilizado principalmente para popular tabelas de referência durante a configuração inicial do sistema ou para atualizações em massa de dados.

### Sintaxe

```bash
php artisan csv:import [OPTIONS]
```

### Opções

| Opção | Tipo | Descrição |
|-------|------|-----------|
| `--force` | Flag | Executa importação sem solicitar confirmação |

### Arquivos Processados

O comando importa os seguintes arquivos na ordem listada:

| Arquivo | Importador | Tabela de Destino | Descrição |
|---------|-----------|-------------------|-----------|
| `colors.csv` | `ColorImport` | `colors` | Cores de veículos |
| `color_aliases.csv` | `ColorAliasImport` | `color_aliases` | Aliases de cores (ex: WHITE → Branco) |
| `marks.csv` | `MarkImport` | `marks` | Marcas de veículos |
| `mark_aliases.csv` | `MarkAliasImport` | `mark_aliases` | Aliases de marcas (ex: VW → Volkswagen) |
| `vehicle_models.csv` | `VehicleModelImport` | `vehicle_models` | Modelos de veículos |
| `vehicle_model_aliases.csv` | `VehicleModelAliasImport` | `vehicle_model_aliases` | Aliases de modelos |
| `vehicle_types.csv` | `VehicleTypeImport` | `vehicle_types` | Tipos de veículos (Carro, Moto, Caminhão, etc) |
| `vehicle_type_aliases.csv` | `VehicleTypeAliasImport` | `vehicle_type_aliases` | Aliases de tipos (ex: CAR → Carro) |
| `equipaments.csv` | `EquipamentImport` | `equipaments` | Equipamentos de captura |

### Funcionamento

1. **Validação de Diretório**: Verifica se `database/csv/` existe
2. **Confirmação**: Solicita confirmação do usuário (pode ser pulada com `--force`)
3. **Processamento Sequencial**: Importa cada arquivo na ordem definida
4. **Validação de Existência**: Pula arquivo se não existir (com warning)
5. **Tratamento de Erros**: Captura exceções e exibe mensagem de erro sem parar o processo
6. **Feedback Visual**: Exibe progresso e resultado de cada importação

### Estrutura dos CSV

#### colors.csv
```csv
canonical_name,display_name,country_id
white,Branco,1
black,Preto,1
gray,Cinza,1
```

#### color_aliases.csv
```csv
alias,color_id
WHITE,1
white,1
BRANCO,1
```

#### marks.csv
```csv
canonical_name,display_name,country_id
fiat,FIAT,1
volkswagen,Volkswagen,2
```

#### mark_aliases.csv
```csv
alias,mark_id
VW,2
vw,2
Volks,2
```

#### vehicle_models.csv
```csv
canonical_name,display_name,mark_id
uno,UNO,1
gol,GOL,2
```

#### vehicle_model_aliases.csv
```csv
alias,model_id,mark_id
uno mille,1,1
gol g5,2,2
```

#### vehicle_types.csv
```csv
canonical_name,display_name
car,Carro
motorcycle,Moto
truck,Caminhão
```

#### vehicle_type_aliases.csv
```csv
alias,type_id
CAR,1
vehicle,1
MOTORCYCLE,2
```

#### equipaments.csv
```csv
uuid,name,location,latitude,longitude
uuid-123-abc,Equipamento 01,Avenida Paulista,-23.561414,-46.655881
```

### Exemplos de Uso

```bash
# Com confirmação interativa
php artisan csv:import

# Forçar importação sem confirmação
php artisan csv:import --force

# Exemplo de output
Importing: colors.csv
✓ colors.csv
Importing: color_aliases.csv
✓ color_aliases.csv
Importing: marks.csv
✓ marks.csv
File not found: equipaments.csv
Done!
```

### Importadores (Import Classes)

Cada importador estende `Maatwebsite\Excel\Concerns\ToModel` e implementa a lógica de mapeamento:

```php
namespace App\Imports;

use App\Models\Color;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ColorImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Color([
            'canonical_name' => $row['canonical_name'],
            'display_name' => $row['display_name'],
            'country_id' => $row['country_id'] ?? null,
        ]);
    }
}
```

### Dependências

- **Package**: `maatwebsite/excel` (Laravel Excel)
- **Localização dos CSVs**: `database/csv/`
- **Localização dos Importadores**: `app/Imports/`

### Quando Usar

1. **Setup Inicial**: Após migrar banco de dados pela primeira vez
2. **Atualização de Dados**: Adicionar novas marcas, modelos ou cores
3. **Sincronização**: Manter dados consistentes entre ambientes
4. **Recuperação**: Restaurar dados de referência após backup

### Ordem de Importação

A ordem é importante devido às dependências de chaves estrangeiras:

```
1. colors (sem dependências)
2. color_aliases (depende de colors)
3. marks (sem dependências)
4. mark_aliases (depende de marks)
5. vehicle_models (depende de marks)
6. vehicle_model_aliases (depende de vehicle_models + marks)
7. vehicle_types (sem dependências)
8. vehicle_type_aliases (depende de vehicle_types)
9. equipaments (sem dependências)
```

### Tratamento de Erros

```bash
# Arquivo não encontrado
File not found: equipaments.csv

# Erro de validação
✗ colors.csv: Column 'canonical_name' is required

# Erro de chave estrangeira
✗ mark_aliases.csv: Foreign key constraint fails
```

O comando continua processando os próximos arquivos mesmo se um falhar.

### Preparação dos Arquivos CSV

1. **Codificação**: Use UTF-8
2. **Separador**: Vírgula (`,`)
3. **Primeira Linha**: Cabeçalhos das colunas
4. **Sem BOM**: Remover Byte Order Mark se existir
5. **Line Endings**: LF ou CRLF (ambos funcionam)

### Limpeza Antes de Importar

Se precisar reimportar do zero:

```bash
# Truncar tabelas (cuidado: apaga todos os dados!)
php artisan db:seed --class=TruncateReferenceTables

# Ou via SQL
TRUNCATE TABLE color_aliases;
TRUNCATE TABLE mark_aliases;
TRUNCATE TABLE vehicle_model_aliases;
TRUNCATE TABLE vehicle_type_aliases;
TRUNCATE TABLE vehicle_models;
TRUNCATE TABLE colors;
TRUNCATE TABLE marks;
TRUNCATE TABLE vehicle_types;
TRUNCATE TABLE equipaments;
```

### Validação Pós-Importação

```bash
# Contar registros importados
php artisan tinker
> \App\Models\Color::count()
> \App\Models\Mark::count()
> \App\Models\VehicleModel::count()

# Verificar aliases
> \App\Models\Mark::with('markAliases')->find(1)
```

### Troubleshooting

#### Erro: "File not found"

- Verificar se o arquivo existe em `database/csv/`
- Verificar nome do arquivo (case-sensitive em Linux)

#### Erro: "Foreign key constraint fails"

- Importar tabelas pai primeiro (ex: `marks` antes de `mark_aliases`)
- Verificar se IDs referenciados existem

#### Erro: "Column not found"

- Verificar se cabeçalhos do CSV correspondem aos esperados
- Verificar se não há espaços extras nos nomes das colunas

#### Importação duplicada

- Implementar lógica de `updateOrCreate` nos importadores
- Ou limpar tabelas antes de importar novamente

---

## db:sync-indexes

Comando para identificar índices do MySQL e replicá-los automaticamente para o MongoDB, otimizando o desempenho de consultas na arquitetura dual-database.

### Descrição

Este comando analisa os índices existentes nas tabelas MySQL (via `information_schema.STATISTICS`), compara com os índices das collections MongoDB correspondentes, e replica automaticamente os índices do MySQL para o MongoDB preservando nomes, estrutura (simples/compostos) e propriedades (unique).

É essencial para manter a paridade de performance entre MySQL e MongoDB quando o projeto utiliza ambas as bases de dados.

### Sintaxe

```bash
php artisan db:sync-indexes [OPTIONS]
```

### Opções

| Opção | Tipo | Descrição |
|-------|------|-----------|
| `--table=*` | Array | Tabela(s) específica(s) para sincronizar índices (pode especificar múltiplas vezes) |
| `--all` | Flag | Sincroniza índices de todas as tabelas |
| `--dry-run` | Flag | Mostra o que seria feito sem executar as mudanças |
| `--drop-existing` | Flag | Remove índices existentes do MongoDB antes de criar novos |
| `--skip-confirm` | Flag | Pula prompt de confirmação |

### Funcionamento

1. **Identificação MySQL**: Consulta `information_schema.STATISTICS` para listar todos os índices (exceto PRIMARY KEY)
2. **Identificação MongoDB**: Lista índices existentes nas collections MongoDB via `listIndexes()`
3. **Comparação**: Identifica quais índices precisam ser criados
4. **Criação**: Cria índices no MongoDB com mesmo nome e estrutura do MySQL
5. **Validação**: Verifica se collection existe antes de criar índices
6. **Relatório**: Exibe estatísticas completas da operação

### Características dos Índices Replicados

- ✅ **Nomes preservados**: Usa exatamente o mesmo nome do MySQL
- ✅ **Índices simples**: `CREATE INDEX name ON table (column)`
- ✅ **Índices compostos**: `CREATE INDEX name ON table (col1, col2, col3)`
- ✅ **Índices UNIQUE**: Propriedade `unique: true` preservada
- ✅ **Ordem ascendente**: Todos os índices criados com ordem 1 (ascending)

### Tabelas Excluídas Automaticamente

Tabelas de sistema que não têm sincronização de índices:
- `migrations`
- `cache`, `cache_locks`
- `sessions`
- `jobs`, `job_batches`, `failed_jobs`
- `password_reset_tokens`
- `personal_access_tokens`

### Exemplos de Uso

#### Modo Dry Run (Visualizar sem aplicar)

```bash
# Ver todos os índices que seriam criados
php artisan db:sync-indexes --all --dry-run

# Output:
# 🔍 MySQL → MongoDB Index Synchronization Tool
#
# 📊 Index Synchronization Plan:
#    Source: MySQL database "vehicle_passages_laravel"
#    Target: MongoDB database "vehicle_passages_laravel"
#    Mode: DRY RUN (no changes)
#
# Tables to process:
#   • vehicles: 11 MySQL indexes, 0 MongoDB indexes
#   • vehicle_passages: 7 MySQL indexes, 0 MongoDB indexes
#   ...
#
# 🔄 Processing table: vehicles
#   → Found {count: 11} MySQL indexes
#   → Found {count: 0} MongoDB indexes
#   [DRY RUN] Would create index 'vehicles_plate_index' on fields: plate
#   [DRY RUN] Would create index 'vehicles_uuid_index' on fields: uuid
#   ...
#   ✓ Created 11 indexes in MongoDB
```

#### Sincronizar Todas as Tabelas

```bash
# Com confirmação interativa
php artisan db:sync-indexes --all

# Sem confirmação (automático)
php artisan db:sync-indexes --all --skip-confirm
```

#### Sincronizar Tabelas Específicas

```bash
# Uma tabela
php artisan db:sync-indexes --table=vehicles

# Múltiplas tabelas
php artisan db:sync-indexes --table=vehicles --table=vehicle_passages --table=users
```

#### Recriar Índices (Drop + Create)

```bash
# Remove todos os índices existentes e recria
php artisan db:sync-indexes --all --drop-existing --skip-confirm

# Útil quando:
# - Índices do MongoDB ficaram desatualizados
# - Mudanças na estrutura de índices do MySQL
# - Corrigir índices corrompidos
```

#### Modo Interativo

```bash
# Sem opções, entra em modo interativo
php artisan db:sync-indexes

# Output:
# 📋 Available tables:
#   [1] vehicles (11 MySQL indexes)
#   [2] vehicle_passages (7 MySQL indexes)
#   [3] users (4 MySQL indexes)
#   ...
#
# What would you like to do?
#   [0] All tables
#   [1] Select specific tables
#   [2] Cancel
# > 1
#
# Enter table numbers (comma-separated, e.g., 1,3,5):
# > 1,2
```

### Output Detalhado

```bash
php artisan db:sync-indexes --table=vehicles --skip-confirm

# 🔍 MySQL → MongoDB Index Synchronization Tool
#
# 📊 Index Synchronization Plan:
#    Source: MySQL database "vehicle_passages_laravel"
#    Target: MongoDB database "vehicle_passages_laravel"
#    Mode: LIVE
#
# Tables to process:
#   • vehicles: 11 MySQL indexes, 0 MongoDB indexes
#
# 🔄 Processing table: vehicles
#   → Found {count: 11} MySQL indexes
#   → Found {count: 0} MongoDB indexes
#     ✓ idx_vehicles_plate_char_1: plate_char_1
#     ✓ idx_vehicles_plate_fulltext: plate_normalized
#     ✓ idx_vehicles_plate_pattern: plate_char_1, plate_char_4, plate_char_5
#     ✓ vehicles_color_id_index: color_id
#     ✓ vehicles_mark_id_index: mark_id
#     ✓ vehicles_model_id_index: model_id
#     ✓ vehicles_plate_index: plate
#     ✓ vehicles_plate_mark_id_model_id_index: plate, mark_id, model_id
#     ✓ vehicles_type_id_index: type_id
#     ✓ vehicles_uuid_index: uuid
#     ⚠️  Could not create index 'idx_vehicles_plate_normalized_unique': 
#         E11000 duplicate key error (null values)
#   ✓ Created 10 indexes in MongoDB
#
# 📈 Summary:
#   • Tables processed: 1
#   • MySQL indexes found: 11
#   • MongoDB indexes found (before): 0
#   • MongoDB indexes created: 10
#   • Errors: 1
#
# ⚠️  Synchronization completed with errors - check logs for details
```

### Tipos de Índices Suportados

#### Índice Simples

```sql
-- MySQL
CREATE INDEX vehicles_plate_index ON vehicles (plate);

-- Replicado no MongoDB como:
db.vehicles.createIndex({ plate: 1 }, { name: "vehicles_plate_index" })
```

#### Índice Composto (Múltiplas Colunas)

```sql
-- MySQL
CREATE INDEX vehicles_plate_mark_id_model_id_index 
ON vehicles (plate, mark_id, model_id);

-- Replicado no MongoDB como:
db.vehicles.createIndex(
    { plate: 1, mark_id: 1, model_id: 1 }, 
    { name: "vehicles_plate_mark_id_model_id_index" }
)
```

#### Índice UNIQUE

```sql
-- MySQL
CREATE UNIQUE INDEX vehicles_uuid_index ON vehicles (uuid);

-- Replicado no MongoDB como:
db.vehicles.createIndex(
    { uuid: 1 }, 
    { name: "vehicles_uuid_index", unique: true }
)
```

### Verificação de Índices

#### Via MongoDB Shell

```javascript
// Listar índices de uma collection
db.vehicles.getIndexes()

// Verificar performance de uma query
db.vehicles.find({ plate: "ABC1234" }).explain("executionStats")

// Verificar uso de índices
db.vehicles.aggregate([
    { $indexStats: {} }
])
```

#### Via Artisan Tinker

```php
php artisan tinker

// Ver índices via MongoDB PHP Driver
>>> $mongo = DB::connection('mongodb')->getMongoDB();
>>> $collection = $mongo->selectCollection('vehicles');
>>> iterator_to_array($collection->listIndexes());
```

### Tratamento de Erros

#### Collection Não Existe

```bash
🔄 Processing table: new_table
  → Found {count: 5} MySQL indexes
  → Found {count: 0} MongoDB indexes
  ⚠️  MongoDB collection 'new_table' does not exist - skipping
```

**Solução**: Sincronizar dados primeiro com `php artisan db:sync-to-mongo --table=new_table`

#### Índice UNIQUE com Dados Duplicados

```bash
⚠️  Could not create index 'countries_iso_alpha2_unique': 
    Index build failed: E11000 duplicate key error 
    collection: vehicle_passages_laravel.countries 
    index: countries_iso_alpha2_unique dup key: { iso_alpha2: "BS" }
```

**Solução**: Limpar dados duplicados no MySQL antes de recriar o índice
```sql
-- Identificar duplicatas
SELECT iso_alpha2, COUNT(*) 
FROM countries 
GROUP BY iso_alpha2 
HAVING COUNT(*) > 1;

-- Remover duplicatas mantendo apenas uma
DELETE c1 FROM countries c1
INNER JOIN countries c2 
WHERE c1.id > c2.id 
AND c1.iso_alpha2 = c2.iso_alpha2;
```

#### Índice UNIQUE com Valores NULL Duplicados

```bash
⚠️  Could not create index 'idx_vehicles_plate_normalized_unique': 
    E11000 duplicate key error (null values)
```

**Solução**: MongoDB UNIQUE permite apenas um documento com NULL. Alterar para non-unique ou popular valores NULL:
```sql
-- Opção 1: Remover UNIQUE no MySQL
ALTER TABLE vehicles DROP INDEX idx_vehicles_plate_normalized_unique;
ALTER TABLE vehicles ADD INDEX idx_vehicles_plate_normalized (plate_normalized);

-- Opção 2: Popular valores NULL
UPDATE vehicles SET plate_normalized = UPPER(REPLACE(plate, '-', '')) WHERE plate_normalized IS NULL;
```

### Quando Usar

#### Setup Inicial

Após sincronizar dados pela primeira vez:

```bash
# 1. Sincronizar dados
php artisan db:sync-to-mongo --all --skip-confirm

# 2. Criar índices
php artisan db:sync-indexes --all --skip-confirm
```

#### Após Alterar Índices MySQL

Sempre que criar/modificar índices no MySQL:

```bash
# Aplicar migration
php artisan migrate

# Replicar índices para MongoDB
php artisan db:sync-indexes --table=nome_da_tabela --drop-existing
```

#### Otimização de Performance

Se queries MongoDB estão lentas:

```bash
# Verificar se índices estão sincronizados
php artisan db:sync-indexes --all --dry-run

# Aplicar índices faltantes
php artisan db:sync-indexes --all
```

#### Recuperação de Disaster

Se MongoDB perdeu índices:

```bash
# Recriar todos os índices
php artisan db:sync-indexes --all --drop-existing --skip-confirm
```

### Performance

Benchmark em banco com 31 tabelas e 184 índices:

| Métrica | Valor |
|---------|-------|
| Tabelas processadas | 31 |
| Índices identificados (MySQL) | 184 |
| Índices criados (MongoDB) | 180 |
| Tempo total | ~15-20 segundos |
| Taxa | ~9-12 índices/segundo |

### Estatísticas Finais

```bash
📈 Summary:
  • Tables processed: 31
  • MySQL indexes found: 184
  • MongoDB indexes found (before): 0
  • MongoDB indexes created: 180
  • Indexes dropped: 0
  • Indexes skipped: 0
  • Errors: 4

✓ Index synchronization completed successfully
```

### Integração com CI/CD

#### GitHub Actions

```yaml
name: Sync Indexes to MongoDB

on:
  push:
    paths:
      - 'database/migrations/**'

jobs:
  sync-indexes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mongodb
      
      - name: Install dependencies
        run: composer install --no-dev
      
      - name: Run migrations
        run: php artisan migrate --force
      
      - name: Sync indexes
        run: php artisan db:sync-indexes --all --skip-confirm
        env:
          DB_CONNECTION: mysql
          DB_HOST: ${{ secrets.DB_HOST }}
          MONGO_URI: ${{ secrets.MONGO_URI }}
```

#### Script de Deploy

```bash
#!/bin/bash

# deploy.sh

echo "🚀 Deploying application..."

# Pull latest code
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader

# Run migrations
php artisan migrate --force

# Sync indexes to MongoDB
php artisan db:sync-indexes --all --skip-confirm

# Restart services
supervisorctl restart all

echo "✅ Deploy completed!"
```

### Monitoramento de Índices

#### Script de Verificação

```php
// check-indexes.php
<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$mysqlIndexCount = DB::select("
    SELECT COUNT(*) as total 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'vehicle_passages_laravel' 
    AND INDEX_NAME != 'PRIMARY'
")[0]->total;

$mongo = DB::connection('mongodb')->getMongoDB();
$collections = iterator_to_array($mongo->listCollections());
$mongoIndexCount = 0;

foreach ($collections as $collection) {
    $indexes = iterator_to_array($collection->listIndexes());
    $mongoIndexCount += count($indexes) - 1; // -1 para _id_
}

echo "MySQL indexes: {$mysqlIndexCount}\n";
echo "MongoDB indexes: {$mongoIndexCount}\n";

if ($mysqlIndexCount > $mongoIndexCount) {
    echo "⚠️  MongoDB is missing " . ($mysqlIndexCount - $mongoIndexCount) . " indexes\n";
    exit(1);
}

echo "✅ Indexes are in sync\n";
```

### Dependências

- **PHP MongoDB Extension**: `mongodb` (via PECL)
- **Package**: `mongodb/laravel-mongodb` ^5.5
- **MySQL**: Para consultar `information_schema.STATISTICS`
- **MongoDB**: Para `createIndex()` e `listIndexes()`

### Limitações

1. **Índices Fulltext**: MySQL FULLTEXT não é replicado (MongoDB usa text indexes com sintaxe diferente)
2. **Índices Spatial**: GIS/Spatial indexes não são suportados
3. **Ordem Descendente**: Todos os índices criados com ordem ascendente (1)
4. **Índices Funcionais**: MySQL 8.0+ functional indexes não são replicados
5. **PRIMARY KEY**: Sempre ignorado (MongoDB usa `_id`)

### Troubleshooting

#### Erro: "Class 'MongoDB\Driver\Manager' not found"

```bash
# Instalar extensão MongoDB para PHP
pecl install mongodb

# Adicionar ao php.ini
echo "extension=mongodb.so" >> /etc/php/8.2/cli/php.ini

# Verificar instalação
php -m | grep mongodb
```

#### Erro: "Connection refused" (MongoDB)

```bash
# Verificar variáveis de ambiente
php artisan tinker
>>> config('database.connections.mongodb')

# Testar conexão
>>> DB::connection('mongodb')->getMongoDB()->listCollections();
```

#### Índices não aparecem no MongoDB

```bash
# Verificar se comando rodou com sucesso
php artisan db:sync-indexes --table=vehicles --skip-confirm

# Verificar logs
tail -f storage/logs/laravel.log

# Verificar diretamente no MongoDB
mongo
> use vehicle_passages_laravel
> db.vehicles.getIndexes()
```

---

## passages:process

Comando daemon otimizado para processamento massivo de passagens de veículos consumidas da fila Redis.

### Descrição

Este comando monitora continuamente a fila Redis `vehicle_image_uploaded` (configurável via `.env`), processa as passagens recebidas do serviço NestJS, cria registros de veículos e passagens no banco de dados (MySQL + MongoDB) e publica os dados processados na fila `vehicle_analitics_trafficeye` para análise externa.

### Sintaxe

```bash
php artisan passages:process [OPTIONS]
```

### Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `--batch` | Integer | `50` | Número de itens a processar por batch |
| `--delay` | Integer | `0` | Delay em segundos entre batches |
| `--limit` | Integer | `null` | Número máximo de itens a processar (ilimitado se não especificado) |

### Variáveis de Ambiente

```env
VEHICLE_PASSAGES_REDIS_KEY=vehicle_image_uploaded
VEHICLE_ANALITICS_TRAFFICEYE_REDIS_KEY=vehicle_analitics_trafficeye
```

### Funcionamento

1. **Consumo da Fila**: Faz `LPOP` da fila Redis (operação atômica)
2. **Validação de Dados**: Valida estrutura do JSON recebido
3. **Busca/Criação de Veículo**:
   - Verifica cache em memória (até 1000 veículos)
   - Busca no MySQL por placa
   - Busca no MongoDB como fallback
   - Cria novo veículo se não existir (com proteção contra race condition)
4. **Mapeamento de Equipamento**: Resolve `hardware_id` para `equipament_id`
5. **Criação de Passagem**: Insere registro em MySQL + sincroniza MongoDB
6. **Publicação Analytics**: Envia passagem processada para fila de analytics

### Otimizações de Performance

- **Cache de Veículos**: Mantém até 1000 veículos em memória
- **Batch Processing**: Processa múltiplos itens por iteração
- **Zero Delay**: Sem delays entre batches por padrão
- **Logs Mínimos**: Apenas estatísticas agregadas
- **Eager Loading**: Pré-carrega relações quando necessário

### Proteção Contra Race Conditions

- **Unique Constraints**: `plate` e `uuid` são únicos na tabela `vehicles`
- **Transactions**: Criação de veículos dentro de transação
- **Duplicate Handling**: Captura exceções de chave duplicada e busca registro criado por outro processo
- **Redis LPOP Atômico**: Garante que cada item é processado apenas uma vez

### Exemplos de Uso

```bash
# Processamento massivo padrão (50 itens/batch)
php artisan passages:process

# Alta performance (100 itens/batch)
php artisan passages:process --batch=100

# Com delay de 1 segundo entre batches
php artisan passages:process --batch=50 --delay=1

# Processar apenas 1000 itens
php artisan passages:process --batch=50 --limit=1000

# Performance máxima com batch grande
php artisan passages:process --batch=200
```

### Output de Exemplo

```
🚀 Processamento iniciado | Batch: 50 | Limite: ∞
📊 Stats | Processados: 50 | Erros: 0 | Restantes: 7770 | Taxa: 125.50/s | Tempo: 0.40s
📊 Stats | Processados: 100 | Erros: 0 | Restantes: 7720 | Taxa: 127.23/s | Tempo: 0.79s
📊 Stats | Processados: 500 | Erros: 0 | Restantes: 7320 | Taxa: 126.89/s | Tempo: 3.94s
📊 FINAL | Processados: 7820 | Erros: 0 | Restantes: 0 | Taxa: 126.45/s | Tempo: 61.85s
🛑 Encerrado
```

### Estrutura do Payload (Input)

```json
{
  "plate": "ABC1234",
  "hardware_id": "uuid-do-equipamento",
  "date": "2025-12-15T10:30:00Z",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "correlation_id": "uuid-de-correlacao",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "processed_by": "nest-service"
}
```

### Parar o Comando

Pressione `Ctrl+C` para parada graceful (aguarda batch atual terminar).

### Processamento Distribuído

É seguro executar este comando em **múltiplos servidores simultaneamente**:

```bash
# Servidor 1
php artisan passages:process --batch=50

# Servidor 2
php artisan passages:process --batch=50

# Servidor 3
php artisan passages:process --batch=50
```

O Redis `LPOP` é atômico, e as transações com unique constraints previnem duplicação de veículos.

---

## trafficeye:process

Comando daemon otimizado para processamento massivo de resultados de reconhecimento do TrafficEye AI.

### Descrição

Este comando monitora continuamente a fila Redis `vehicle_analytics_trafficeye_result` (configurável via `.env`), processa os resultados de reconhecimento MMR (Make Model Recognition) retornados pelo serviço externo TrafficEye, e atualiza as características dos veículos (marca, modelo, cor, tipo) no banco de dados.

### Sintaxe

```bash
php artisan trafficeye:process [OPTIONS]
```

### Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `--batch` | Integer | `50` | Número de itens a processar por batch |
| `--delay` | Integer | `0` | Delay em segundos entre batches |
| `--limit` | Integer | `null` | Número máximo de itens a processar (ilimitado se não especificado) |

### Variáveis de Ambiente

```env
VEHICLE_ANALITICS_TRAFFICEYE_RESULT_REDIS_KEY=vehicle_analytics_trafficeye_result
```

### Funcionamento

1. **Consumo da Fila**: Faz `LPOP` da fila Redis com resultados do TrafficEye
2. **Validação de Sucesso**: Verifica se `success: true` e se há resposta válida
3. **Extração de MMR**: Extrai dados de reconhecimento (make, model, color, category)
4. **Busca de IDs**:
   - **Marca**: Busca por canonical_name, display_name ou aliases (cache: 500 itens)
   - **Modelo**: Busca filtrada por marca + aliases (cache: 500 itens)
   - **Cor**: Busca por canonical_name, display_name ou aliases (cache: 200 itens)
   - **Tipo**: Busca por canonical_name, display_name ou aliases (cache: 100 itens)
5. **Atualização de Veículo**: Atualiza apenas campos diferentes + sincroniza MongoDB
6. **Publicação de Stats**: Exibe estatísticas agregadas

### Otimizações de Performance

- **5 Caches Independentes**:
  - Marks: até 500 itens
  - Models: até 500 itens
  - Colors: até 200 itens
  - Types: até 100 itens
  - Vehicle Passages: até 1000 itens
- **Eager Loading**: `VehiclePassage::with('vehicle')` para reduzir queries
- **Batch Processing**: Processa múltiplos itens por iteração
- **Zero Delay**: Sem delays entre batches por padrão
- **Logs Mínimos**: Apenas estatísticas agregadas

### Proteção Contra Race Conditions

- **Transactions**: Atualizações de veículos dentro de transação
- **Rollback Automático**: Em caso de erro durante update
- **Cache para Lookups**: Reduz consultas simultâneas ao banco

### Suporte a Aliases

O comando suporta aliases para mapeamento flexível de nomes:

```
TrafficEye Response    →    Database
---------------------------------------------
"VW"                  →    Volkswagen (ID: 15)
"WHITE"               →    Branco (ID: 2)
"CAR"                 →    Carro (ID: 1)
"Fiat"                →    FIAT (ID: 3)
```

Aliases são configurados nas tabelas:
- `mark_aliases`
- `vehicle_model_aliases`
- `color_aliases`
- `vehicle_type_aliases`

### Exemplos de Uso

```bash
# Processamento massivo padrão (50 itens/batch)
php artisan trafficeye:process

# Alta performance (100 itens/batch)
php artisan trafficeye:process --batch=100

# Com delay de 1 segundo entre batches
php artisan trafficeye:process --batch=50 --delay=1

# Processar apenas 500 resultados
php artisan trafficeye:process --batch=50 --limit=500

# Performance máxima
php artisan trafficeye:process --batch=200
```

### Output de Exemplo

```
🚀 Processamento TrafficEye iniciado | Batch: 50 | Limite: ∞
📊 Stats | Processados: 50 | Erros: 0 | Restantes: 120 | Taxa: 95.20/s | Tempo: 0.53s
📊 Stats | Processados: 100 | Erros: 0 | Restantes: 70 | Taxa: 94.89/s | Tempo: 1.05s
📊 FINAL | Processados: 170 | Erros: 0 | Restantes: 0 | Taxa: 94.78/s | Tempo: 1.79s
🛑 Encerrado
```

### Estrutura do Payload (Input)

```json
{
  "uuid": "correlation-uuid",
  "passagemId": 12345,
  "plate": "ABC1234",
  "success": true,
  "trafficEyeResponse": {
    "data": {
      "combinations": [
        {
          "roadUsers": [
            {
              "mmr": {
                "make": {
                  "value": "Fiat",
                  "score": 0.9995
                },
                "model": {
                  "value": "Uno",
                  "score": 0.9957
                },
                "generation": {
                  "value": "2010-2014",
                  "score": 0.8532
                },
                "color": {
                  "value": "GRAY",
                  "score": 0.5190
                },
                "category": {
                  "value": "CAR",
                  "score": 0.9961
                },
                "view": {
                  "value": "FRONT"
                }
              }
            }
          ]
        }
      ]
    }
  }
}
```

### Lógica de Atualização

O comando atualiza o veículo **APENAS** se os valores forem diferentes dos atuais:

```php
// Exemplo: só atualiza se marca mudou
if ($markFound && $vehicle->mark_id !== $markFound->id) {
    $updates['mark_id'] = $markFound->id;
}
```

Se nenhum campo precisa ser atualizado, o veículo não é tocado (economia de I/O).

### Parar o Comando

Pressione `Ctrl+C` para parada graceful (aguarda batch atual terminar).

### Processamento Distribuído

É seguro executar este comando em **múltiplos servidores simultaneamente**:

```bash
# Servidor 1
php artisan trafficeye:process --batch=50

# Servidor 2
php artisan trafficeye:process --batch=50
```

As transações e caches previnem race conditions durante atualizações.

---

## Fluxo Completo de Processamento

```
┌─────────────┐
│  NestJS App │
└──────┬──────┘
       │ Publica imagem de passagem
       ▼
┌──────────────────────────────┐
│ vehicle_image_uploaded       │ (Redis Queue)
└──────────────┬───────────────┘
               │
               │ php artisan passages:process
               ▼
┌──────────────────────────────┐
│ ProcessVehiclePassages       │
│ - Cria Vehicle               │
│ - Cria VehiclePassage        │
│ - Sincroniza MongoDB         │
└──────────────┬───────────────┘
               │ Publica para analytics
               ▼
┌──────────────────────────────┐
│ vehicle_analitics_trafficeye │ (Redis Queue)
└──────────────┬───────────────┘
               │
               │ Serviço Externo consome
               │ Chama TrafficEye API
               ▼
┌──────────────────────────────┐
│ vehicle_analytics_trafficeye_result │ (Redis Queue)
└──────────────┬───────────────┘
               │
               │ php artisan trafficeye:process
               ▼
┌──────────────────────────────┐
│ ProcessTrafficEyeResults     │
│ - Busca marca/modelo/cor     │
│ - Atualiza Vehicle           │
│ - Sincroniza MongoDB         │
└──────────────────────────────┘
```

---

## Monitoramento em Produção

### Supervisor (Linux)

```ini
[program:vehicle-passages-processor]
command=php /path/to/artisan passages:process --batch=100
directory=/path/to/project
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/supervisor/passages-processor.log

[program:trafficeye-processor]
command=php /path/to/artisan trafficeye:process --batch=100
directory=/path/to/project
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/supervisor/trafficeye-processor.log
```

### PM2 (Windows/Linux)

```json
{
  "apps": [
    {
      "name": "passages-processor",
      "script": "php",
      "args": "artisan passages:process --batch=100",
      "cwd": "/path/to/project",
      "instances": 3,
      "exec_mode": "cluster",
      "autorestart": true
    },
    {
      "name": "trafficeye-processor",
      "script": "php",
      "args": "artisan trafficeye:process --batch=100",
      "cwd": "/path/to/project",
      "instances": 2,
      "exec_mode": "cluster",
      "autorestart": true
    }
  ]
}
```

### Docker Compose

```yaml
services:
  passages-processor:
    image: your-app-image
    command: php artisan passages:process --batch=100
    restart: always
    deploy:
      replicas: 3
    environment:
      - REDIS_HOST=redis
      - DB_HOST=mysql

  trafficeye-processor:
    image: your-app-image
    command: php artisan trafficeye:process --batch=100
    restart: always
    deploy:
      replicas: 2
    environment:
      - REDIS_HOST=redis
      - DB_HOST=mysql
```

---

## Métricas de Performance

### Benchmarks Esperados

| Comando | Batch Size | Throughput | Uso Memória | Uso CPU |
|---------|-----------|------------|-------------|---------|
| `passages:process` | 50 | ~120-130 itens/s | 150-200 MB | 40-60% |
| `passages:process` | 100 | ~140-150 itens/s | 200-250 MB | 60-80% |
| `trafficeye:process` | 50 | ~90-100 itens/s | 100-150 MB | 30-50% |
| `trafficeye:process` | 100 | ~110-120 itens/s | 150-200 MB | 50-70% |

*Benchmarks baseados em servidor com 8 cores, 16GB RAM, SSD, MySQL otimizado*

### Tuning de Performance

1. **Aumentar batch size**: Melhor throughput, maior uso de memória
2. **Múltiplas instâncias**: Escalabilidade horizontal
3. **Otimizar MySQL**: Indexes, query cache, connection pool
4. **Redis rápido**: Usar Redis local ou na mesma rede
5. **Monitorar caches**: Verificar hit rate dos caches em memória

---

## Troubleshooting

### Comando não processa nada

```bash
# Verificar se há itens na fila
redis-cli -h localhost -p 6379
> AUTH password123
> LLEN vehicle_image_uploaded
```

### Performance baixa

- Verificar latência de rede (Redis/MySQL)
- Aumentar batch size
- Verificar slow queries no MySQL
- Monitorar uso de CPU/memória

### Erros de race condition

- Verificar se migrations com unique constraints foram aplicadas
- Verificar logs para identificar padrão de duplicação

### Memória crescendo

- Reduzir batch size
- Verificar limite de caches (podem estar muito altos)
- Reiniciar processo periodicamente (supervisor/pm2)

---

## Changelog

### v1.0.0 (2025-12-15)

- ✅ Comando `csv:import` para importação de dados de referência
- ✅ Comando `passages:process` implementado
- ✅ Comando `trafficeye:process` implementado
- ✅ Sistema de caching em 5 camadas
- ✅ Proteção contra race conditions
- ✅ Batch processing otimizado
- ✅ Suporte a processamento distribuído
- ✅ Graceful shutdown com signal handlers
- ✅ Estatísticas agregadas por batch
