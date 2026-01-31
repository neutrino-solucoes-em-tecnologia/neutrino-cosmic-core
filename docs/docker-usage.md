# Docker Usage Guide

Guia completo para uso do Docker no projeto Vehicle Passage Processing.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Ambientes Disponíveis](#ambientes-disponíveis)
- [Docker Compose - Desenvolvimento](#docker-compose---desenvolvimento)
- [Docker Compose - Produção](#docker-compose---produção)
- [Comandos Úteis](#comandos-úteis)
- [Migrations e Seeders](#migrations-e-seeders)
- [Acesso aos Bancos de Dados](#acesso-aos-bancos-de-dados)
- [Logs e Monitoramento](#logs-e-monitoramento)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Visão Geral

Este projeto utiliza Docker e Docker Compose para facilitar o desenvolvimento e deploy. Existem duas configurações principais:

1. **Development Stack** (`docker-compose-dev.yml`) - Stack completa local com todos os serviços
2. **Production Stack** (`docker-compose.yml`) - Apenas aplicação Laravel, conecta em serviços externos

### Tecnologias

- **Laravel 12** com PHP 8.2
- **Laravel Octane** com Swoole (4 workers)
- **MySQL 8.0** - Banco relacional
- **MongoDB 6.0** - Banco NoSQL
- **Redis 7** - Cache, queue e sessões
- **Kafka 7.5** + Zookeeper - Message broker (apenas dev)
- **Supervisor** - Process manager

---

## Ambientes Disponíveis

### Development Environment

Stack completa auto-contida para desenvolvimento local:

```yaml
Services:
  ├── mysql (172.25.0.2:3306)
  ├── mongodb (172.25.0.3:27017)
  ├── redis (172.25.0.4:6379)
  ├── zookeeper (172.25.0.5:2181)
  ├── kafka (172.25.0.6:9092/9093)
  ├── kafka-ui (172.25.0.7:8080)
  ├── app (172.25.0.10:8000)
  └── queue (172.25.0.11)
```

**Quando usar:**
- Desenvolvimento local
- Testes de integração
- Experimentação com Kafka
- Não precisa de infraestrutura externa

### Production Environment

Aplicação conectada em serviços externos:

```yaml
Services:
  ├── app (conecta em MySQL, MongoDB, Redis externos)
  └── queue (worker separado)
```

**Quando usar:**
- Deploy em ambiente de produção/staging
- Infraestrutura gerenciada separadamente
- Alta disponibilidade com clusters externos

---

## Docker Compose - Desenvolvimento

### Arquivo: `docker-compose-dev.yml`

Stack completa para desenvolvimento local incluindo todos os serviços de infraestrutura.

### Primeira Execução

```bash
# 1. Copiar arquivo de ambiente para desenvolvimento
cp .env.dev .env

# 2. Build e iniciar todos os serviços
docker-compose -f docker-compose-dev.yml up -d --build

# 3. Aguardar services ficarem healthy (~60s)
docker-compose -f docker-compose-dev.yml ps

# 4. Executar migrations
docker-compose -f docker-compose-dev.yml exec app php artisan migrate

# 5. Popular banco com seeders
docker-compose -f docker-compose-dev.yml exec app php artisan db:seed
```

### Serviços Inclusos

#### MySQL 8.0
- **Port:** 3306
- **Database:** vehicle_passages_laravel
- **User:** admin
- **Password:** password123
- **Otimizações:**
  - 500 conexões simultâneas
  - 1GB buffer pool
  - Slow query log habilitado
  - Performance schema ativo

#### MongoDB 6.0
- **Port:** 27017
- **Database:** laravel_app
- **User:** root
- **Password:** root
- **Auth Database:** admin
- **Connection String:** `mongodb://root:root@mongodb:27017/laravel_app?authSource=admin`
- **Otimizações:**
  - 1GB WiredTiger cache
  - Autenticação obrigatória

#### Redis 7
- **Port:** 6379
- **Password:** password123
- **Databases:** 16 (0-15)
- **Max Memory:** 1GB com LRU eviction
- **Persistence:** AOF + RDB
- **Uso:** Cache, queue, sessions

#### Kafka 7.5
- **Internal Port:** 9092 (entre containers)
- **External Port:** 9093 (host)
- **Topics:** Auto-create habilitado
- **Partitions:** 3 (default)
- **Retention:** 7 dias (168h)
- **Compression:** Snappy
- **Max Message Size:** 10MB

#### Kafka UI
- **Port:** 8080
- **URL:** http://localhost:8080
- **Auth:** Desabilitado (dev only)
- **Cluster:** vehicle-passages-cluster

#### Laravel App (Octane/Swoole)
- **Port:** 8000
- **Workers:** 4 Swoole workers
- **Task Workers:** 6
- **Max Requests:** 500 per worker
- **Health Check:** `/api/health`

#### Queue Worker
- **Queue:** Redis
- **Sleep:** 3s entre jobs
- **Tries:** 3 tentativas
- **Max Time:** 3600s (1h)
- **Memory Limit:** 512MB

### Comandos de Desenvolvimento

```bash
# Start da stack
docker-compose -f docker-compose-dev.yml up -d

# Stop da stack
docker-compose -f docker-compose-dev.yml down

# Rebuild após mudanças no Dockerfile
docker-compose -f docker-compose-dev.yml up -d --build app

# Restart apenas da aplicação
docker-compose -f docker-compose-dev.yml restart app

# Ver status dos containers
docker-compose -f docker-compose-dev.yml ps

# Ver logs em tempo real
docker-compose -f docker-compose-dev.yml logs -f app

# Executar comandos no container
docker-compose -f docker-compose-dev.yml exec app bash
docker-compose -f docker-compose-dev.yml exec app php artisan tinker

# Limpar tudo (CUIDADO: apaga dados)
docker-compose -f docker-compose-dev.yml down -v
```

### Configuração de Rede

A stack de desenvolvimento usa uma rede isolada `dev-stack`:

- **Subnet:** 172.25.0.0/16
- **DNS Interno:** Docker resolve automaticamente:
  - `mysql` → 172.25.0.2
  - `mongodb` → 172.25.0.3
  - `redis` → 172.25.0.4
  - `kafka` → 172.25.0.6

**Importante:** Use os nomes de serviço (mysql, mongodb, redis) no `.env` em vez de IPs.

### Volumes Persistentes

Dados são mantidos em named volumes:

```yaml
Volumes:
  - mysql_dev_data         # Dados MySQL
  - mongo_dev_data         # Dados MongoDB
  - mongo_dev_config       # Config MongoDB
  - redis_dev_data         # Dados Redis
  - zookeeper_dev_data     # Dados Zookeeper
  - zookeeper_dev_log      # Logs Zookeeper
  - kafka_dev_data         # Dados Kafka
```

Para listar volumes:
```bash
docker volume ls | grep vehicle_passages
```

Para remover volumes (apaga dados):
```bash
docker-compose -f docker-compose-dev.yml down -v
```

---

## Docker Compose - Produção

### Arquivo: `docker-compose.yml`

Configuração para produção/staging que conecta em serviços de infraestrutura externos (rede `local-stack`).

### Pré-requisitos

1. **Rede Externa:** `local-stack` deve existir
```bash
docker network create local-stack
```

2. **Serviços Externos:** MySQL, MongoDB e Redis devem estar rodando na rede `local-stack`

3. **Arquivo .env:** Configurado com hosts dos serviços externos

### Executando em Produção

```bash
# 1. Configurar .env com hosts externos
# Exemplo:
# DB_HOST=mysql-server.local-stack
# MONGODB_HOST=mongodb-server.local-stack
# REDIS_HOST=redis-server.local-stack

# 2. Build e start
docker-compose up -d --build

# 3. Verificar status
docker-compose ps

# 4. Ver logs
docker-compose logs -f app
```

### Diferenças: Dev vs Prod

| Aspecto | Desenvolvimento | Produção |
|---------|-----------------|----------|
| **Compose File** | docker-compose-dev.yml | docker-compose.yml |
| **Rede** | dev-stack (isolada) | local-stack (externa) |
| **Serviços Inclusos** | MySQL, MongoDB, Redis, Kafka, Zookeeper, Kafka UI | Apenas App + Queue |
| **Infraestrutura** | Self-contained | Externa gerenciada |
| **Debug Mode** | Habilitado | Desabilitado |
| **Restart Policy** | unless-stopped | always |
| **Health Checks** | Todos serviços | Apenas app |
| **Volumes** | Named volumes locais | Paths externos |
| **Kafka** | ✅ Incluído | ❌ Separado |
| **Porta App** | 8000 | ${APP_PORT} (variável) |

---

## Comandos Úteis

### Laravel Artisan

```bash
# Cache
docker-compose -f docker-compose-dev.yml exec app php artisan cache:clear
docker-compose -f docker-compose-dev.yml exec app php artisan config:clear
docker-compose -f docker-compose-dev.yml exec app php artisan route:clear
docker-compose -f docker-compose-dev.yml exec app php artisan view:clear

# Otimizações
docker-compose -f docker-compose-dev.yml exec app php artisan config:cache
docker-compose -f docker-compose-dev.yml exec app php artisan route:cache
docker-compose -f docker-compose-dev.yml exec app php artisan view:cache

# Queue
docker-compose -f docker-compose-dev.yml exec app php artisan queue:work
docker-compose -f docker-compose-dev.yml exec app php artisan queue:failed
docker-compose -f docker-compose-dev.yml exec app php artisan queue:retry all

# Octane
docker-compose -f docker-compose-dev.yml exec app php artisan octane:reload
docker-compose -f docker-compose-dev.yml exec app php artisan octane:status

# Tinker
docker-compose -f docker-compose-dev.yml exec app php artisan tinker
```

### Composer

```bash
# Instalar dependências
docker-compose -f docker-compose-dev.yml exec app composer install

# Atualizar dependências
docker-compose -f docker-compose-dev.yml exec app composer update

# Adicionar pacote
docker-compose -f docker-compose-dev.yml exec app composer require vendor/package

# Autoload
docker-compose -f docker-compose-dev.yml exec app composer dump-autoload
```

### Testes

```bash
# Rodar todos os testes
docker-compose -f docker-compose-dev.yml exec app php artisan test

# Rodar suite específica
docker-compose -f docker-compose-dev.yml exec app php artisan test --testsuite=Feature
docker-compose -f docker-compose-dev.yml exec app php artisan test --testsuite=Unit

# Rodar arquivo específico
docker-compose -f docker-compose-dev.yml exec app php artisan test tests/Feature/UserTest.php

# Com coverage
docker-compose -f docker-compose-dev.yml exec app php artisan test --coverage
```

### Code Quality

```bash
# Laravel Pint (PSR-12 formatting)
docker-compose -f docker-compose-dev.yml exec app vendor/bin/pint

# PHPStan (static analysis)
docker-compose -f docker-compose-dev.yml exec app composer analyse

# Swagger docs generation
docker-compose -f docker-compose-dev.yml exec app php artisan l5-swagger:generate
```

### Custom Application Commands

#### Database Synchronization (MySQL → MongoDB)

```bash
# Sync all tables (with confirmation prompt)
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-to-mongo --all

# Sync all tables (skip confirmation for automation)
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-to-mongo --all --skip-confirm

# Interactive mode (choose specific tables)
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-to-mongo

# Sync specific tables
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-to-mongo --table=users --table=vehicles

# Parallel processing (faster for large datasets)
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-to-mongo --all --parallel --workers=4 --skip-confirm

# Custom chunk size (default: 5000 records per batch)
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-to-mongo --all --chunk=10000 --skip-confirm
```

**Options:**
- `--all` - Sync all tables from the application database
- `--table=name` - Sync specific table (can specify multiple times)
- `--include-system` - Include system/excluded tables (migrations, cache, etc.)
- `--chunk=5000` - Number of records to process per batch
- `--parallel` - Enable parallel processing using queues (requires queue workers)
- `--workers=4` - Number of parallel workers (only with --parallel)
- `--skip-confirm` - Skip confirmation prompt (useful for automation)

#### Sync MySQL Indexes to MongoDB

```bash
# Sync indexes for all tables
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-indexes --all

# Dry run (show what would be done without creating indexes)
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-indexes --all --dry-run

# Sync indexes for specific tables
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-indexes --table=users --table=vehicles

# Drop existing MongoDB indexes before creating new ones
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-indexes --all --drop-existing

# Skip confirmation prompt
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-indexes --all --skip-confirm
```

**Options:**
- `--all` - Sync indexes for all tables
- `--table=name` - Sync indexes for specific table (can specify multiple times)
- `--dry-run` - Show what would be done without creating indexes
- `--drop-existing` - Drop existing MongoDB indexes before creating new ones
- `--skip-confirm` - Skip confirmation prompt

#### Process Vehicle Passages (Continuous Service)

```bash
# Start vehicle passage processor (runs continuously)
docker-compose -f docker-compose-dev.yml exec app php artisan passages:process

# With custom batch size
docker-compose -f docker-compose-dev.yml exec app php artisan passages:process --batch=100

# With sleep between iterations (polling mode)
docker-compose -f docker-compose-dev.yml exec app php artisan passages:process --sleep=1

# With error handling configuration
docker-compose -f docker-compose-dev.yml exec app php artisan passages:process --max-errors=20 --error-sleep=60
```

**Options:**
- `--batch=50` - Number of records to process per batch (default: 50)
- `--sleep=0` - Sleep time in seconds between iterations (default: 0, uses BLPOP)
- `--max-errors=10` - Maximum consecutive errors before pausing (default: 10)
- `--error-sleep=30` - Sleep time in seconds after reaching max errors (default: 30)

**Note:** This command runs continuously as a background service. Use CTRL+C to stop.

#### Process TrafficEye Results

```bash
# Process TrafficEye results from Redis
docker-compose -f docker-compose-dev.yml exec app php artisan trafficeye:process

# With custom batch size
docker-compose -f docker-compose-dev.yml exec app php artisan trafficeye:process --batch=100

# With delay between batches
docker-compose -f docker-compose-dev.yml exec app php artisan trafficeye:process --delay=2

# Process limited number of items
docker-compose -f docker-compose-dev.yml exec app php artisan trafficeye:process --limit=1000
```

**Options:**
- `--batch=50` - Number of items to process per batch (default: 50)
- `--delay=0` - Delay in seconds between batches (default: 0)
- `--limit=` - Maximum number of items to process (optional, processes all by default)

**Note:** This command processes TrafficEye analytics results with caching for optimal performance.

#### Import CSV Files

```bash
# Import all CSV files (with confirmation)
docker-compose -f docker-compose-dev.yml exec app php artisan csv:import

# Force import without confirmation
docker-compose -f docker-compose-dev.yml exec app php artisan csv:import --force
```

**Options:**
- `--force` - Skip confirmation prompt

**Imported Files:**
- `colors.csv` - Vehicle colors
- `color_aliases.csv` - Color alternative names
- `marks.csv` - Vehicle manufacturers/brands
- `mark_aliases.csv` - Mark alternative names
- `vehicle_models.csv` - Vehicle models
- `vehicle_model_aliases.csv` - Model alternative names
- `vehicle_types.csv` - Vehicle types/categories
- `vehicle_type_aliases.csv` - Type alternative names
- `equipaments.csv` - Equipment/devices

**Location:** Files must be in `database/csv/` directory

---

### Workflow Examples

**Initial Database Setup:**
```bash
# 1. Run migrations
docker-compose -f docker-compose-dev.yml exec app php artisan migrate

# 2. Import CSV reference data
docker-compose -f docker-compose-dev.yml exec app php artisan csv:import --force

# 3. Sync all data to MongoDB
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-to-mongo --all --skip-confirm

# 4. Sync indexes to MongoDB
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-indexes --all --skip-confirm
```

**Start Processing Services:**
```bash
# Start vehicle passage processor (in separate terminal or supervisor)
docker-compose -f docker-compose-dev.yml exec app php artisan passages:process

# Start TrafficEye processor (in separate terminal or supervisor)
docker-compose -f docker-compose-dev.yml exec app php artisan trafficeye:process
```

**Maintenance Operations:**
```bash
# Resync specific tables after updates
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-to-mongo --table=vehicles --table=vehicle_passages

# Rebuild MongoDB indexes
docker-compose -f docker-compose-dev.yml exec app php artisan db:sync-indexes --all --drop-existing --skip-confirm

# Reimport updated CSV files
docker-compose -f docker-compose-dev.yml exec app php artisan csv:import --force
```

---

## Migrations e Seeders

### Migrations

```bash
# Rodar migrations pendentes
docker-compose -f docker-compose-dev.yml exec app php artisan migrate

# Ver status das migrations
docker-compose -f docker-compose-dev.yml exec app php artisan migrate:status

# Rollback última migration
docker-compose -f docker-compose-dev.yml exec app php artisan migrate:rollback

# Rollback todas migrations
docker-compose -f docker-compose-dev.yml exec app php artisan migrate:reset

# Fresh migration (CUIDADO: apaga tudo)
docker-compose -f docker-compose-dev.yml exec app php artisan migrate:fresh

# Fresh com seeders
docker-compose -f docker-compose-dev.yml exec app php artisan migrate:fresh --seed
```

### Seeders

```bash
# Rodar todos os seeders
docker-compose -f docker-compose-dev.yml exec app php artisan db:seed

# Rodar seeder específico
docker-compose -f docker-compose-dev.yml exec app php artisan db:seed --class=UserSeeder

# Com force (produção)
docker-compose -f docker-compose-dev.yml exec app php artisan db:seed --force
```

---

## Acesso aos Bancos de Dados

### MySQL

#### Via Docker (CLI)
```bash
# Acessar MySQL shell
docker-compose -f docker-compose-dev.yml exec mysql mysql -uadmin -ppassword123 vehicle_passages_laravel

# Dump do banco
docker-compose -f docker-compose-dev.yml exec mysql mysqldump -uadmin -ppassword123 vehicle_passages_laravel > backup.sql

# Restore do banco
docker-compose -f docker-compose-dev.yml exec -T mysql mysql -uadmin -ppassword123 vehicle_passages_laravel < backup.sql
```

#### Via Cliente Externo (DBeaver, MySQL Workbench, etc.)
```
Host: localhost
Port: 3306
User: admin
Password: password123
Database: vehicle_passages_laravel
```

### MongoDB

#### Via Docker (CLI)
```bash
# Acessar MongoDB shell
docker-compose -f docker-compose-dev.yml exec mongodb mongosh -u root -p root --authenticationDatabase admin

# Usar database específico
docker-compose -f docker-compose-dev.yml exec mongodb mongosh -u root -p root --authenticationDatabase admin laravel_app

# Dump do banco
docker-compose -f docker-compose-dev.yml exec mongodb mongodump --uri="mongodb://root:root@localhost:27017/laravel_app?authSource=admin" --out=/tmp/backup

# Restore do banco
docker-compose -f docker-compose-dev.yml exec mongodb mongorestore --uri="mongodb://root:root@localhost:27017/laravel_app?authSource=admin" /tmp/backup/laravel_app
```

#### Via Cliente Externo (MongoDB Compass, Studio 3T, etc.)
```
Connection String: mongodb://root:root@localhost:27017/laravel_app?authSource=admin

Ou individual:
Host: localhost
Port: 27017
Username: root
Password: root
Authentication Database: admin
Database: laravel_app
```

### Redis

#### Via Docker (CLI)
```bash
# Acessar Redis CLI
docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123

# Verificar chaves
redis-cli -a password123 KEYS *

# Monitorar comandos em tempo real
docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123 MONITOR

# Ver informações do servidor
docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123 INFO

# Flush database (CUIDADO: apaga tudo)
docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123 FLUSHDB

# Flush todas databases
docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123 FLUSHALL
```

#### Via Cliente Externo (Redis Commander, RedisInsight, etc.)
```
Host: localhost
Port: 6379
Password: password123
```

### Kafka

#### Via Docker (CLI)

```bash
# Listar tópicos
docker-compose -f docker-compose-dev.yml exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Criar tópico
docker-compose -f docker-compose-dev.yml exec kafka kafka-topics \
  --bootstrap-server localhost:9092 \
  --create \
  --topic vehicle-passages \
  --partitions 3 \
  --replication-factor 1

# Descrever tópico
docker-compose -f docker-compose-dev.yml exec kafka kafka-topics \
  --bootstrap-server localhost:9092 \
  --describe \
  --topic vehicle-passages

# Deletar tópico
docker-compose -f docker-compose-dev.yml exec kafka kafka-topics \
  --bootstrap-server localhost:9092 \
  --delete \
  --topic vehicle-passages

# Produzir mensagens (console producer)
docker-compose -f docker-compose-dev.yml exec kafka kafka-console-producer \
  --bootstrap-server localhost:9092 \
  --topic vehicle-passages

# Consumir mensagens (console consumer)
docker-compose -f docker-compose-dev.yml exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic vehicle-passages \
  --from-beginning

# Consumer groups
docker-compose -f docker-compose-dev.yml exec kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --list

# Descrever consumer group
docker-compose -f docker-compose-dev.yml exec kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --describe \
  --group my-group
```

#### Via Kafka UI (Interface Web)
```
URL: http://localhost:8080
Cluster: vehicle-passages-cluster
```

**Funcionalidades:**
- Visualizar tópicos e mensagens
- Criar/deletar tópicos
- Gerenciar consumer groups
- Monitorar lag
- Ver configurações do broker

#### Via Cliente Externo (Laravel Code)
```php
// Produtor
use Kafka\Producer;

$producer = new Producer(['localhost:9093']);
$producer->send('vehicle-passages', ['data' => 'value']);

// Consumidor
use Kafka\Consumer;

$consumer = new Consumer(['localhost:9093'], 'my-group');
$consumer->subscribe(['vehicle-passages']);
```

---

## Logs e Monitoramento

### Ver Logs dos Containers

```bash
# Todos os containers
docker-compose -f docker-compose-dev.yml logs -f

# Container específico
docker-compose -f docker-compose-dev.yml logs -f app
docker-compose -f docker-compose-dev.yml logs -f mysql
docker-compose -f docker-compose-dev.yml logs -f mongodb
docker-compose -f docker-compose-dev.yml logs -f redis
docker-compose -f docker-compose-dev.yml logs -f kafka
docker-compose -f docker-compose-dev.yml logs -f queue

# Últimas N linhas
docker-compose -f docker-compose-dev.yml logs --tail=100 app

# Desde timestamp específico
docker-compose -f docker-compose-dev.yml logs --since 2026-01-13T15:00:00 app
```

### Laravel Logs

```bash
# Via Pail (real-time)
docker-compose -f docker-compose-dev.yml exec app php artisan pail

# Via tail
docker-compose -f docker-compose-dev.yml exec app tail -f storage/logs/laravel.log

# Limpar logs
docker-compose -f docker-compose-dev.yml exec app php artisan log:clear
```

### Monitorar Recursos

```bash
# Uso de recursos em tempo real
docker stats

# Container específico
docker stats vehicle_passages_app

# Processos rodando no container
docker-compose -f docker-compose-dev.yml top app

# Espaço em disco dos volumes
docker system df -v
```

### Health Checks

```bash
# Status de todos os services
docker-compose -f docker-compose-dev.yml ps

# Health check manual
docker inspect --format='{{json .State.Health}}' vehicle_passages_app | jq

# API Health endpoint
curl http://localhost:8000/api/health
```

---

## Troubleshooting

### App não inicia

#### Sintomas
- Container fica reiniciando
- Status "unhealthy"
- Erro 502/503 ao acessar

#### Diagnóstico
```bash
# Ver logs
docker-compose -f docker-compose-dev.yml logs app

# Verificar se Supervisor está rodando
docker-compose -f docker-compose-dev.yml exec app supervisorctl status

# Testar Octane manualmente
docker-compose -f docker-compose-dev.yml exec app php artisan octane:start --host=0.0.0.0 --port=8000
```

#### Soluções
```bash
# 1. Limpar cache
docker-compose -f docker-compose-dev.yml exec app php artisan cache:clear
docker-compose -f docker-compose-dev.yml exec app php artisan config:clear

# 2. Verificar permissões
docker-compose -f docker-compose-dev.yml exec app chown -R www-data:www-data storage bootstrap/cache

# 3. Rebuild
docker-compose -f docker-compose-dev.yml up -d --build app

# 4. Verificar .env
docker-compose -f docker-compose-dev.yml exec app cat .env | grep -E "DB_|MONGODB_|REDIS_"
```

### MySQL não conecta

#### Sintomas
- "Connection refused" 
- "Access denied for user"
- "Unknown database"

#### Diagnóstico
```bash
# Verificar se está rodando
docker-compose -f docker-compose-dev.yml ps mysql

# Logs do MySQL
docker-compose -f docker-compose-dev.yml logs mysql

# Testar conexão
docker-compose -f docker-compose-dev.yml exec mysql mysqladmin ping -h localhost -u root -ppassword123
```

#### Soluções
```bash
# 1. Aguardar health check
# MySQL pode demorar 30s para ficar pronto

# 2. Verificar credenciais no .env
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=vehicle_passages_laravel
DB_USERNAME=admin
DB_PASSWORD=password123

# 3. Recriar container
docker-compose -f docker-compose-dev.yml restart mysql

# 4. Verificar se o banco existe
docker-compose -f docker-compose-dev.yml exec mysql mysql -uroot -ppassword123 -e "SHOW DATABASES;"
```

### MongoDB autenticação falha

#### Sintomas
- "Authentication failed"
- "connection refused calling hello on '127.0.0.1:27017'"
- "No suitable servers found"

#### Diagnóstico
```bash
# Verificar se está rodando
docker-compose -f docker-compose-dev.yml ps mongodb

# Logs do MongoDB
docker-compose -f docker-compose-dev.yml logs mongodb

# Testar conexão
docker-compose -f docker-compose-dev.yml exec mongodb mongosh -u root -p root --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

#### Soluções
```bash
# 1. Verificar variáveis no .env
MONGODB_HOST=mongodb        # NÃO use 127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=laravel_app
MONGODB_USERNAME=root
MONGODB_PASSWORD=root
MONGODB_URI="mongodb://root:root@mongodb:27017/laravel_app?authSource=admin"

# 2. Verificar config/database.php
# Deve usar MONGODB_HOST, não MONGO_DB_HOST

# 3. Limpar cache de configuração
docker-compose -f docker-compose-dev.yml exec app php artisan config:clear

# 4. Recriar container MongoDB
docker-compose -f docker-compose-dev.yml restart mongodb
```

### Redis não aceita conexão

#### Sintomas
- "Connection refused"
- "NOAUTH Authentication required"
- "Invalid password"

#### Diagnóstico
```bash
# Verificar se está rodando
docker-compose -f docker-compose-dev.yml ps redis

# Logs do Redis
docker-compose -f docker-compose-dev.yml logs redis

# Testar conexão
docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123 PING
```

#### Soluções
```bash
# 1. Verificar variáveis no .env
REDIS_HOST=redis        # NÃO use 127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=password123
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# 2. Limpar cache
docker-compose -f docker-compose-dev.yml exec app php artisan cache:clear

# 3. Flush Redis (CUIDADO: apaga dados)
docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123 FLUSHALL

# 4. Restart Redis
docker-compose -f docker-compose-dev.yml restart redis
```

### Kafka não inicia

#### Sintomas
- Kafka em "starting" por muito tempo
- "Connection refused" do Zookeeper
- Tópicos não são criados

#### Diagnóstico
```bash
# Verificar Zookeeper primeiro
docker-compose -f docker-compose-dev.yml ps zookeeper
docker-compose -f docker-compose-dev.yml logs zookeeper

# Verificar Kafka
docker-compose -f docker-compose-dev.yml ps kafka
docker-compose -f docker-compose-dev.yml logs kafka

# Testar conexão
docker-compose -f docker-compose-dev.yml exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092
```

#### Soluções
```bash
# 1. Aguardar Zookeeper ficar healthy (~20s)
docker-compose -f docker-compose-dev.yml ps zookeeper

# 2. Aguardar Kafka ficar healthy (~30s)
docker-compose -f docker-compose-dev.yml ps kafka

# 3. Restart ordem correta
docker-compose -f docker-compose-dev.yml restart zookeeper
# Aguardar 20s
docker-compose -f docker-compose-dev.yml restart kafka

# 4. Verificar tópicos
docker-compose -f docker-compose-dev.yml exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### Performance lenta

#### Sintomas
- Requisições demoram muito
- Timeout em queries
- Alto uso de CPU/memória

#### Diagnóstico
```bash
# Ver recursos
docker stats

# Ver queries lentas MySQL
docker-compose -f docker-compose-dev.yml exec mysql tail -f /var/log/mysql/slow.log

# Ver operações MongoDB
docker-compose -f docker-compose-dev.yml exec mongodb mongosh -u root -p root --authenticationDatabase admin --eval "db.currentOp()"

# Ver slow log Redis
docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123 SLOWLOG GET 10

# Verificar cache Laravel
docker-compose -f docker-compose-dev.yml exec app php artisan cache:stats
```

#### Soluções
```bash
# 1. Limpar cache
docker-compose -f docker-compose-dev.yml exec app php artisan cache:clear
docker-compose -f docker-compose-dev.yml exec app php artisan config:cache
docker-compose -f docker-compose-dev.yml exec app php artisan route:cache

# 2. Otimizar Octane
# Aumentar workers no docker-compose-dev.yml (de 4 para 8)

# 3. Verificar índices no banco
docker-compose -f docker-compose-dev.yml exec mysql mysql -uadmin -ppassword123 vehicle_passages_laravel -e "SHOW INDEX FROM vehicle_passages;"

# 4. Ajustar recursos Docker
# Settings > Resources > aumentar CPU/Memory
```

### Erros de permissão

#### Sintomas
- "Permission denied" ao escrever arquivos
- Logs não são criados
- Cache não funciona

#### Diagnóstico
```bash
# Ver permissões
docker-compose -f docker-compose-dev.yml exec app ls -la storage/
docker-compose -f docker-compose-dev.yml exec app ls -la bootstrap/cache/

# Ver usuário rodando
docker-compose -f docker-compose-dev.yml exec app whoami
```

#### Soluções
```bash
# Corrigir permissões
docker-compose -f docker-compose-dev.yml exec app chown -R www-data:www-data storage bootstrap/cache
docker-compose -f docker-compose-dev.yml exec app chmod -R 775 storage bootstrap/cache

# Se necessário, executar como root
docker-compose -f docker-compose-dev.yml exec -u root app chown -R www-data:www-data /var/www/html
```

### Volumes não persistem dados

#### Sintomas
- Dados são perdidos ao parar containers
- Migrations somem após restart

#### Diagnóstico
```bash
# Verificar volumes
docker volume ls | grep vehicle_passages

# Inspecionar volume
docker volume inspect mysql_dev_data
```

#### Soluções
```bash
# NÃO use 'down -v' a menos que queira apagar tudo
docker-compose -f docker-compose-dev.yml down      # OK - mantém volumes
docker-compose -f docker-compose-dev.yml down -v   # APAGA TUDO

# Para backup de volume
docker run --rm -v mysql_dev_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz /data
```

---

## Best Practices

### Desenvolvimento

1. **Sempre use docker-compose-dev.yml**
   ```bash
   # Correto
   docker-compose -f docker-compose-dev.yml exec app php artisan migrate
   
   # Errado (usa produção)
   docker-compose exec app php artisan migrate
   ```

2. **Limpe cache após mudanças**
   ```bash
   docker-compose -f docker-compose-dev.yml exec app php artisan config:clear
   docker-compose -f docker-compose-dev.yml exec app php artisan cache:clear
   ```

3. **Use nomes de serviço, não IPs**
   ```bash
   # ✅ Correto - resiliente a mudanças
   DB_HOST=mysql
   MONGODB_HOST=mongodb
   REDIS_HOST=redis
   
   # ❌ Errado - vai quebrar se IP mudar
   DB_HOST=172.25.0.2
   MONGODB_HOST=172.25.0.3
   ```

4. **Não commite .env**
   ```bash
   # .env deve estar no .gitignore
   # Use .env.example como template
   cp .env.example .env
   ```

5. **Aguarde health checks**
   ```bash
   # Serviços levam tempo para ficarem healthy:
   # - MySQL: ~30s
   # - MongoDB: ~30s
   # - Kafka: ~30s (depende do Zookeeper)
   # - App: ~60s (depende de todos acima)
   
   # Verifique antes de executar comandos
   docker-compose -f docker-compose-dev.yml ps
   ```

### Produção

1. **Use docker-compose.yml (sem -f)**
   ```bash
   docker-compose up -d --build
   docker-compose logs -f app
   ```

2. **Não inclua dados sensíveis no compose**
   ```yaml
   # Use variáveis de ambiente
   environment:
     - DB_PASSWORD=${DB_PASSWORD}
   
   # Não hardcode senhas
   environment:
     - DB_PASSWORD=senhasecreta  # ❌ NUNCA!
   ```

3. **Configure restart policies**
   ```yaml
   services:
     app:
       restart: always  # Sempre reinicia em caso de falha
   ```

4. **Use volumes externos para persistência**
   ```yaml
   volumes:
     - /path/to/persistent/storage:/var/www/html/storage
   ```

5. **Monitore recursos**
   ```bash
   # Configure limites de recurso
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '2'
             memory: 2G
           reservations:
             cpus: '1'
             memory: 1G
   ```

### Segurança

1. **Nunca exponha portas desnecessárias em produção**
   ```yaml
   # Development - OK
   ports:
     - "3306:3306"  # MySQL acessível externamente
   
   # Production - Melhor
   # Não expor portas, só via rede interna
   ```

2. **Use secrets para dados sensíveis**
   ```yaml
   services:
     app:
       secrets:
         - db_password
   
   secrets:
     db_password:
       external: true
   ```

3. **Mantenha images atualizadas**
   ```bash
   # Pull latest images
   docker-compose pull
   
   # Rebuild com novas images
   docker-compose up -d --build
   ```

4. **Scan de vulnerabilidades**
   ```bash
   # Docker scan
   docker scan vehicle_passages_app
   
   # Trivy
   trivy image vehicle_passages_app
   ```

### Performance

1. **Use multi-stage builds**
   ```dockerfile
   # Build stage
   FROM composer:2 AS composer
   COPY composer.* ./
   RUN composer install --no-dev
   
   # Runtime stage
   FROM php:8.2-fpm
   COPY --from=composer /app/vendor /var/www/html/vendor
   ```

2. **Configure Octane adequadamente**
   ```bash
   # Development: poucos workers para economizar memória
   --workers=4 --task-workers=6
   
   # Production: mais workers baseado em CPUs
   --workers=16 --task-workers=16
   ```

3. **Use cache de configuração em produção**
   ```bash
   docker-compose exec app php artisan config:cache
   docker-compose exec app php artisan route:cache
   docker-compose exec app php artisan view:cache
   ```

4. **Configure limites de recursos**
   ```yaml
   services:
     mysql:
       command: >
         --max_connections=1000
         --innodb_buffer_pool_size=4G
     
     redis:
       command: redis-server --maxmemory 2gb
   ```

### Backup e Restore

1. **Backup regular dos volumes**
   ```bash
   # MySQL backup
   docker-compose -f docker-compose-dev.yml exec mysql mysqldump -uadmin -ppassword123 vehicle_passages_laravel > backup_$(date +%Y%m%d).sql
   
   # MongoDB backup
   docker-compose -f docker-compose-dev.yml exec mongodb mongodump --uri="mongodb://root:root@localhost:27017/laravel_app?authSource=admin" --out=/tmp/backup
   docker-compose -f docker-compose-dev.yml cp mongodb:/tmp/backup ./mongo_backup_$(date +%Y%m%d)
   
   # Redis backup (RDB)
   docker-compose -f docker-compose-dev.yml exec redis redis-cli -a password123 BGSAVE
   ```

2. **Teste restore periodicamente**
   ```bash
   # Criar ambiente de teste
   docker-compose -f docker-compose-dev.yml -p test up -d
   
   # Restore backup
   docker-compose -f docker-compose-dev.yml -p test exec -T mysql mysql -uadmin -ppassword123 vehicle_passages_laravel < backup.sql
   
   # Validar dados
   docker-compose -f docker-compose-dev.yml -p test exec app php artisan tinker
   ```

3. **Documente procedimentos de DR**
   - RTO (Recovery Time Objective): quanto tempo para restaurar
   - RPO (Recovery Point Objective): quanto dados podem ser perdidos
   - Procedimentos passo-a-passo
   - Contatos de emergência

---

## Referências

### Documentação Oficial

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel Octane](https://laravel.com/docs/12.x/octane)
- [Swoole Documentation](https://www.swoole.co.uk/)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Kafka Docker Images](https://hub.docker.com/r/confluentinc/cp-kafka)

### Documentação Interna

- [`docker/README-DEV.md`](../docker/README-DEV.md) - Detalhes da stack de desenvolvimento
- [`docs/octane-swoole-setup.md`](./octane-swoole-setup.md) - Configuração Octane/Swoole
- [`docs/database-structure.md`](./database-structure.md) - Estrutura dos bancos de dados
- [`.env.example`](../.env.example) - Template de configuração

### Troubleshooting Avançado

- [Docker Troubleshooting Guide](https://docs.docker.com/config/daemon/troubleshoot/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [MongoDB Production Notes](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [Redis Administration](https://redis.io/docs/management/)
- [Kafka Operations](https://kafka.apache.org/documentation/#operations)

---

## Suporte

Para problemas não cobertos nesta documentação:

1. **Verifique os logs:** `docker-compose -f docker-compose-dev.yml logs -f`
2. **Consulte a documentação oficial** das tecnologias envolvidas
3. **Abra uma issue** no repositório do projeto com:
   - Versão do Docker: `docker --version`
   - Versão do Docker Compose: `docker-compose --version`
   - Sistema Operacional
   - Logs completos do erro
   - Passos para reproduzir

---

**Última atualização:** 13 de Janeiro de 2026  
**Versão:** 1.0.0
