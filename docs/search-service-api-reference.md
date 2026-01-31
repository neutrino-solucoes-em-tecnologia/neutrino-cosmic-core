# SearchService - Referência Completa de API

## Índice
- [Visão Geral](#visão-geral)
- [Endpoints Genéricos](#endpoints-genéricos)
- [Filtros](#filtros)
- [Operadores](#operadores)
- [Ordenação](#ordenação)
- [Paginação](#paginação)
- [Busca Genérica](#busca-genérica)
- [Relacionamentos](#relacionamentos)
- [Exemplos Práticos](#exemplos-práticos)
- [Códigos de Resposta](#códigos-de-resposta)

---

## Visão Geral

O `SearchService` é um serviço genérico que fornece funcionalidades de busca, filtro, ordenação e paginação para qualquer entidade/collection do sistema. Ele suporta MongoDB como fonte primária com fallback automático para MySQL.

### Características
- ✅ Filtros dinâmicos via query parameters
- ✅ Múltiplos operadores de comparação
- ✅ Ordenação por múltiplos campos
- ✅ Paginação automática
- ✅ Busca genérica (full-text search)
- ✅ Suporte a relacionamentos
- ✅ Fallback automático MySQL quando MongoDB está offline
- ✅ Respostas JSON padronizadas

---

## Endpoints Genéricos

### Listar Registros
```http
GET /api/{resource}?[parameters]
```

### Buscar por ID
```http
GET /api/{resource}/{id}
```

**Exemplo:**
```http
GET /api/users
GET /api/users/1
```

---

## Filtros

O SearchService suporta dois formatos de filtros para máxima flexibilidade:

### Sintaxe Básica

#### 1. Filtro Simples (Igualdade) - Formato Curto
Ideal para comparações de igualdade simples. O operador `eq` é assumido automaticamente.

```http
GET /api/users?filter[campo]=valor
```

**Exemplos:**
```http
GET /api/users?filter[email]=user@example.com
GET /api/users?filter[name]=João Silva
GET /api/users?filter[uuid]=0c1f0198-3268-41df-8972-0f0389a4dff1
GET /api/users?filter[active]=1
```

**Equivalente em formato completo:**
```http
GET /api/users?filter[email][operator]=eq&filter[email][value]=user@example.com
```

#### 2. Filtro com Operador - Formato Completo
Necessário para operadores diferentes de igualdade (like, gt, in, etc).

```http
GET /api/users?filter[campo][operator]=operador&filter[campo][value]=valor
```

**Exemplos:**
```http
GET /api/users?filter[id][operator]=gt&filter[id][value]=10
GET /api/users?filter[created_at][operator]=gte&filter[created_at][value]=2026-01-01
GET /api/users?filter[name][operator]=like&filter[name][value]=João
GET /api/users?filter[status][operator]=ne&filter[status][value]=inactive
```

### Múltiplos Filtros
Você pode combinar múltiplos filtros (ambos os formatos) na mesma requisição:

```http
# Misturando formatos simples e completo
GET /api/users?filter[active]=1&filter[role]=admin&filter[age][operator]=gte&filter[age][value]=18

# Apenas formato simples
GET /api/users?filter[uuid]=abc-123&filter[active]=1

# Apenas formato completo
GET /api/users?filter[name][operator]=like&filter[name][value]=João&filter[created_at][operator]=gte&filter[created_at][value]=2026-01-01
```

---

## Operadores

### Lista Completa de Operadores

| Operador | Alias | Significado | Exemplo Formato Completo | Exemplo Formato Simples | MongoDB | SQL |
|----------|-------|-------------|--------------------------|-------------------------|---------|-----|
| `eq` | `=` | Igual | `filter[id][operator]=eq&filter[id][value]=5` | `filter[id]=5` | `{id: 5}` | `id = 5` |
| `ne` | `!=`, `<>` | Diferente | `filter[status][operator]=ne&filter[status][value]=inactive` | ❌ | `{status: {$ne: 'inactive'}}` | `status != 'inactive'` |
| `gt` | `>` | Maior que | `filter[age][operator]=gt&filter[age][value]=18` | ❌ | `{age: {$gt: 18}}` | `age > 18` |
| `gte` | `>=` | Maior ou igual | `filter[price][operator]=gte&filter[price][value]=100` | ❌ | `{price: {$gte: 100}}` | `price >= 100` |
| `lt` | `<` | Menor que | `filter[stock][operator]=lt&filter[stock][value]=10` | ❌ | `{stock: {$lt: 10}}` | `stock < 10` |
| `lte` | `<=` | Menor ou igual | `filter[quantity][operator]=lte&filter[quantity][value]=50` | ❌ | `{quantity: {$lte: 50}}` | `quantity <= 50` |
| `like` | - | Contém (case-insensitive) | `filter[name][operator]=like&filter[name][value]=João` | ❌ | `{name: {$regex: 'João', $options: 'i'}}` | `name LIKE '%João%'` |
| `in` | - | Dentro de um array | `filter[status][operator]=in&filter[status][value][]=active&filter[status][value][]=pending` | ❌ | `{status: {$in: ['active', 'pending']}}` | `status IN ('active', 'pending')` |
| `nin` | `not_in` | Não está em array | `filter[role][operator]=nin&filter[role][value][]=guest&filter[role][value][]=banned` | ❌ | `{role: {$nin: ['guest', 'banned']}}` | `role NOT IN ('guest', 'banned')` |

> **Nota:** ❌ indica que o formato simples não está disponível para esse operador - use o formato completo com `operator` e `value`.

### Exemplos Detalhados por Operador

#### 1. Igualdade (`eq` ou `=`)
```http
# Formato simples (recomendado para igualdade)
GET /api/users?filter[email]=admin@example.com
GET /api/users?filter[uuid]=0c1f0198-3268-41df-8972-0f0389a4dff1

# Formato completo (equivalente)
GET /api/users?filter[email][operator]=eq&filter[email][value]=admin@example.com
```

#### 2. Diferente (`ne`, `!=`, `<>`)
```http
# Formato completo
GET /api/users?filter[status][operator]=ne&filter[status][value]=deleted
GET /api/products?filter[stock][operator]=ne&filter[stock][value]=0
```

#### 3. Maior que (`gt`, `>`)
```http
# Formato completo
GET /api/users?filter[id][operator]=gt&filter[id][value]=100
GET /api/orders?filter[total][operator]=gt&filter[total][value]=500.00
GET /api/products?filter[price][operator]=gt&filter[price][value]=99.99
```

#### 4. Maior ou igual (`gte`, `>=`)
```http
# Formato completo
GET /api/users?filter[age][operator]=gte&filter[age][value]=18
GET /api/orders?filter[created_at][operator]=gte&filter[created_at][value]=2026-01-01
```

#### 5. Menor que (`lt`, `<`)
```http
# Formato completo
GET /api/products?filter[stock][operator]=lt&filter[stock][value]=5
GET /api/users?filter[login_attempts][operator]=lt&filter[login_attempts][value]=3
```

#### 6. Menor ou igual (`lte`, `<=`)
```http
# Formato completo
GET /api/products?filter[price][operator]=lte&filter[price][value]=100
GET /api/users?filter[failed_logins][operator]=lte&filter[failed_logins][value]=5
```

#### 7. Like - Busca Parcial (`like`)
```http
# Formato completo
# Busca usuários com nome contendo "João"
GET /api/users?filter[name][operator]=like&filter[name][value]=João

# Busca emails do domínio example.com
GET /api/users?filter[email][operator]=like&filter[email][value]=@example.com

# Case-insensitive por padrão
GET /api/users?filter[name][operator]=like&filter[name][value]=joão  # Encontra "João", "JOÃO", "joão"
```

#### 8. In - Múltiplos Valores (`in`)
```http
# Formato completo
# Buscar múltiplos status
GET /api/orders?filter[status][operator]=in&filter[status][value][]=pending&filter[status][value][]=processing&filter[status][value][]=shipped

# Buscar múltiplos IDs
GET /api/users?filter[id][operator]=in&filter[id][value][]=1&filter[id][value][]=5&filter[id][value][]=10

# Buscar múltiplas roles
GET /api/users?filter[role][operator]=in&filter[role][value][]=admin&filter[role][value][]=moderator
```

#### 9. Not In - Exclusão de Valores (`nin`, `not_in`)
```http
# Formato completo
# Excluir status específicos
GET /api/orders?filter[status][operator]=nin&filter[status][value][]=cancelled&filter[status][value][]=deleted

# Excluir IDs específicos
GET /api/users?filter[id][operator]=nin&filter[id][value][]=1&filter[id][value][]=2

# Excluir roles
GET /api/users?filter[role][operator]=nin&filter[role][value][]=guest&filter[role][value][]=banned
```

---

## Ordenação

### Sintaxe

```http
GET /api/users?sort={campo}           # Ascendente (padrão)
GET /api/users?sort=-{campo}          # Descendente (prefixo -)
GET /api/users?sort={campo1},-{campo2} # Múltiplos campos
```

### Exemplos

#### Ordenação Simples
```http
# Ascendente
GET /api/users?sort=name
GET /api/products?sort=price

# Descendente
GET /api/users?sort=-created_at
GET /api/products?sort=-price
```

#### Ordenação Múltipla
```http
# Por nome (ASC) e depois por data de criação (DESC)
GET /api/users?sort=name,-created_at

# Por status (ASC), prioridade (DESC) e data (DESC)
GET /api/orders?sort=status,-priority,-created_at
```

#### Combinando Ordenação com Filtros
```http
GET /api/users?filter[active]=1&sort=-created_at
GET /api/products?filter[stock][gt]=0&sort=price
```

---

## Paginação

### Parâmetros

| Parâmetro | Padrão | Descrição |
|-----------|--------|-----------|
| `page` | 1 | Número da página atual |
| `per_page` | 15 | Itens por página (configurável no service) |

### Sintaxe
```http
GET /api/users?page={número}
```

### Exemplos
```http
# Primeira página (padrão)
GET /api/users

# Segunda página
GET /api/users?page=2

# Terceira página
GET /api/users?page=3
```

### Estrutura da Resposta Paginada
```json
{
  "success": true,
  "message": "Registros listados com sucesso",
  "data": [
    {
      "id": 1,
      "name": "User 1",
      "email": "user1@example.com"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 15,
    "total": 150,
    "from": 1,
    "to": 15
  }
}
```

### Campos de Metadados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `current_page` | int | Página atual |
| `last_page` | int | Última página disponível |
| `per_page` | int | Itens por página |
| `total` | int | Total de registros encontrados |
| `from` | int\|null | Índice do primeiro item da página |
| `to` | int\|null | Índice do último item da página |

---

## Busca Genérica

### Sintaxe
```http
GET /api/users?search={termo}&search_fields[]={campo1}&search_fields[]={campo2}
```

### Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `search` | Sim | Termo de busca |
| `search_fields[]` | Não | Campos onde buscar (padrão: name, email) |

### Exemplos

#### Busca Básica (campos padrão)
```http
# Busca "João" nos campos name e email
GET /api/users?search=João
```

#### Busca em Campos Específicos
```http
# Busca apenas no nome
GET /api/users?search=João&search_fields[]=name

# Busca em múltiplos campos
GET /api/users?search=admin&search_fields[]=name&search_fields[]=email&search_fields[]=role
```

#### Combinando Busca com Filtros
```http
# Busca usuários ativos que contenham "João"
GET /api/users?search=João&filter[active]=1

# Busca com filtro e ordenação
GET /api/users?search=João&filter[role]=admin&sort=-created_at
```

---

## Relacionamentos

### Usando `searchWithRelations()`

O SearchService suporta carregamento de relacionamentos (eager loading).

```php
// No seu service
$this->searchService->searchWithRelations(
    collection: 'vehicles',
    modelClass: Vehicle::class,
    request: $request,
    relationships: [
        'vehicle_types',  // Relacionamento simples
        [
            'collection' => 'vehicle_models',
            'foreign_key' => 'vehicle_model_id'
        ]
    ],
    perPage: 15
);
```

### Relacionamentos Aninhados

Suporte a dot notation para relacionamentos aninhados:

```php
$mongo->with('vehicle_models.vehicle_model_aliases')
```

---

## Exemplos Práticos

### Caso 1: Listar Usuários Ativos
```http
GET /api/users?filter[active]=1&sort=name
```

### Caso 2: Buscar Pedidos Pendentes Acima de R$ 100
```http
# Formato simples + completo
GET /api/orders?filter[status]=pending&filter[total][operator]=gte&filter[total][value]=100&sort=-created_at
```

### Caso 3: Listar Produtos em Estoque Baixo
```http
# Formato completo para range
GET /api/products?filter[stock][operator]=lt&filter[stock][value]=10&filter[stock_min][operator]=gt&filter[stock_min][value]=0&sort=stock
```

### Caso 4: Buscar Usuários Criados em Janeiro de 2026
```http
# Formato completo para range de datas
GET /api/users?filter[created_at][operator]=gte&filter[created_at][value]=2026-01-01&filter[created_at_max][operator]=lt&filter[created_at_max][value]=2026-02-01&sort=-created_at
```

### Caso 5: Buscar por Múltiplos Status
```http
# Formato completo (in operator)
GET /api/orders?filter[status][operator]=in&filter[status][value][]=pending&filter[status][value][]=processing&filter[status][value][]=shipped&sort=-created_at&page=1
```

### Caso 6: Excluir Usuários Inativos e Deletados
```http
# Formato completo (nin operator)
GET /api/users?filter[status][operator]=nin&filter[status][value][]=inactive&filter[status][value][]=deleted&sort=name
```

### Caso 7: Busca com Filtro Complexo
```http
# Misturando formatos simples e completo
GET /api/users?search=João&search_fields[]=name&search_fields[]=email&filter[role]=admin&filter[active]=1&sort=-last_login&page=1
```

### Caso 8: Range de Datas
```http
# Formato completo para range
# Usuários criados entre 01/01/2026 e 31/01/2026
GET /api/users?filter[created_at][operator]=gte&filter[created_at][value]=2026-01-01&filter[created_at_end][operator]=lte&filter[created_at_end][value]=2026-01-31
```

### Caso 9: Múltiplos Filtros e Ordenação
```http
# Formato completo (in) + formato simples (active) + formato completo (like)
GET /api/vehicles?filter[type_id][operator]=in&filter[type_id][value][]=1&filter[type_id][value][]=2&filter[color][operator]=like&filter[color][value]=preto&filter[active]=1&sort=-created_at&page=1
```

---

## Códigos de Resposta

### Respostas de Sucesso

| Código | Status | Descrição | Uso |
|--------|--------|-----------|-----|
| 200 | OK | Requisição bem-sucedida | GET, listagem |
| 201 | Created | Recurso criado com sucesso | POST |

### Respostas de Erro

| Código | Status | Descrição |
|--------|--------|-----------|
| 400 | Bad Request | Parâmetros inválidos |
| 401 | Unauthorized | Não autenticado |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 422 | Unprocessable Entity | Validação falhou |
| 500 | Internal Server Error | Erro no servidor |

### Estrutura de Resposta de Sucesso
```json
{
  "success": true,
  "message": "Registros listados com sucesso",
  "data": [...],
  "meta": {...}
}
```

### Estrutura de Resposta de Erro
```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errors": {
    "campo": ["Erro detalhado"]
  }
}
```

---

## Métodos Programáticos do SearchService

Além dos endpoints HTTP, o SearchService oferece métodos programáticos para uso dentro de services e controllers.

### Métodos Disponíveis

#### 1. `search()` - Busca paginada com filtros
Busca com paginação, filtros, ordenação e relacionamentos automáticos.

```php
public function search(
    string $collection,
    ?string $modelClass,
    Request $request,
    int $perPage = 15,
    array $allowedSearchFields = ['name', 'email'],
    array $allowedFilterFields = [],
    array $allowedSortFields = [],
    bool $withRelations = true
): JsonResponse
```

#### 2. `findById()` - Buscar por ID
Busca um único registro pelo ID.

```php
public function findById(
    string $collection,
    ?string $modelClass,
    int $id,
    bool $withRelations = true
): JsonResponse
```

#### 3. `findByUuid()` - Buscar por UUID
Busca um único registro pelo UUID.

```php
public function findByUuid(
    string $collection,
    ?string $modelClass,
    string $uuid,
    bool $withRelations = true
): JsonResponse
```

#### 4. `findBy()` - Buscar por campo único
Busca um único registro por qualquer campo com operador customizado.

```php
public function findBy(
    string $collection,
    ?string $modelClass,
    string $field,
    mixed $value,
    string $operator = '=',
    bool $withRelations = true
): JsonResponse
```

**Exemplos:**
```php
// Buscar por email
$user = $this->searchService->findBy('users', User::class, 'email', 'john@example.com');

// Buscar por placa
$vehicle = $this->searchService->findBy('vehicles', Vehicle::class, 'plate', 'ABC1234');

// Buscar com operador LIKE
$post = $this->searchService->findBy('posts', Post::class, 'slug', 'laravel%', 'like');
```

#### 5. `findWhere()` - Buscar com múltiplas condições (1 registro) ⭐ NOVO
Busca um único registro com múltiplas condições (AND lógico).

```php
public function findWhere(
    string $collection,
    ?string $modelClass,
    array $conditions,
    bool $withRelations = true
): JsonResponse
```

**Formato das condições:**

```php
// Formato simples (todos com operador =)
$conditions = [
    'vehicle_id' => 1,
    'client_id' => 2,
    'status' => 'active'
];

// Formato avançado (com operadores customizados)
$conditions = [
    ['vehicle_id', '=', 1],
    ['client_id', '=', 2],
    ['status', '=', 'active'],
    ['monitor_until', '>=', date('Y-m-d H:i:s')]
];

// Formato misto (combinando simples e avançado)
$conditions = [
    'client_id' => 2,
    ['status', '=', 'active'],
    ['monitor_until', '>=', date('Y-m-d H:i:s')]
];
```

**Exemplos práticos:**

```php
// Buscar whitelist ativa para veículo e cliente
$whitelist = $this->searchService->findWhere('vehicle_whitelists', VehicleWhitelist::class, [
    ['vehicle_id', '=', $passage->vehicle_id],
    ['client_id', '=', $passage->client_id],
    ['status', '=', 'active'],
    ['monitor_until', '>=', date('Y-m-d H:i:s')]
]);

// Buscar usuário ativo por email e role
$admin = $this->searchService->findWhere('users', User::class, [
    'email' => 'admin@example.com',
    'role' => 'admin',
    'active' => 1
]);

// Buscar pedido específico
$order = $this->searchService->findWhere('orders', Order::class, [
    'order_number' => 'ORD-12345',
    'customer_id' => 100,
    ['total', '>=', 500]
]);
```

#### 6. `findAllBy()` - Buscar múltiplos por campo único
Busca todos os registros que correspondem a um campo/valor.

```php
public function findAllBy(
    string $collection,
    ?string $modelClass,
    string $field,
    mixed $value,
    string $operator = '=',
    bool $withRelations = true,
    ?int $limit = null
): JsonResponse
```

**Exemplos:**
```php
// Buscar todos os usuários ativos
$users = $this->searchService->findAllBy('users', User::class, 'status', 'active');

// Buscar primeiros 10 veículos de uma marca
$vehicles = $this->searchService->findAllBy('vehicles', Vehicle::class, 'mark_id', 5, '=', true, 10);

// Buscar passagens após determinada data
$passages = $this->searchService->findAllBy(
    'vehicle_passages', 
    VehiclePassage::class, 
    'created_at', 
    '2026-01-01', 
    '>='
);
```

#### 7. `findAllWhere()` - Buscar múltiplos com múltiplas condições ⭐ NOVO
Busca todos os registros que correspondem a múltiplas condições (AND lógico).

```php
public function findAllWhere(
    string $collection,
    ?string $modelClass,
    array $conditions,
    bool $withRelations = true,
    ?int $limit = null
): JsonResponse
```

**Exemplos práticos:**

```php
// Buscar todas as passagens de um veículo em um cliente
$passages = $this->searchService->findAllWhere('vehicle_passages', VehiclePassage::class, [
    'vehicle_id' => 123,
    'client_id' => 5,
    'status' => 'processed'
]);

// Buscar veículos com múltiplos critérios
$vehicles = $this->searchService->findAllWhere('vehicles', Vehicle::class, [
    ['mark_id', '=', 1],
    ['year_of_manufacture', '>=', 2020],
    ['status', '=', 'active']
], true, 50); // Máximo 50 resultados

// Buscar monitoramentos ativos de um cliente
$monitorings = $this->searchService->findAllWhere('vehicle_monitoring', VehicleMonitoring::class, [
    'client_id' => 10,
    ['status', '=', 'active'],
    ['valid_until', '>=', now()->format('Y-m-d H:i:s')]
]);

// Buscar usuários com filtros complexos
$users = $this->searchService->findAllWhere('users', User::class, [
    ['role', '=', 'admin'],
    ['active', '=', 1],
    ['last_login', '>=', '2026-01-01']
], true, 100);
```

#### 8. `searchWithRelations()` - Busca com relacionamentos explícitos
Busca com relacionamentos MongoDB explícitos.

```php
public function searchWithRelations(
    string $collection,
    ?string $modelClass,
    Request $request,
    array $relationships,
    int $perPage = 15,
    array $allowedSearchFields = ['name', 'email'],
    array $allowedFilterFields = [],
    array $allowedSortFields = []
): JsonResponse
```

---

## Comparação dos Métodos de Busca

| Método | Retorna | Condições | Paginado | Melhor para |
|--------|---------|-----------|----------|-------------|
| `search()` | Múltiplos | Via Request | ✅ Sim | Endpoints HTTP com filtros dinâmicos |
| `findById()` | 1 registro | ID exato | ❌ Não | Buscar por ID (int) |
| `findByUuid()` | 1 registro | UUID exato | ❌ Não | Buscar por UUID (string) |
| `findBy()` | 1 registro | 1 campo | ❌ Não | Busca simples (email, slug, etc) |
| **`findWhere()`** ⭐ | **1 registro** | **Múltiplas (AND)** | ❌ Não | **Busca com vários filtros** |
| `findAllBy()` | Múltiplos | 1 campo | ❌ Não | Listar por categoria, status, etc |
| **`findAllWhere()`** ⭐ | **Múltiplos** | **Múltiplas (AND)** | ❌ Não | **Listar com vários filtros** |
| `searchWithRelations()` | Múltiplos | Via Request | ✅ Sim | Endpoints com relacionamentos explícitos |

---

## Integração com Seu Service

### Exemplo: VehicleService

```php
<?php

namespace App\Services\Core;

use App\Models\Vehicles\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleService
{
    protected SearchService $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Listar veículos com filtros (HTTP endpoint)
     */
    public function getAllVehicles(Request $request): JsonResponse
    {
        return $this->searchService->search(
            collection: 'vehicles',
            modelClass: Vehicle::class,
            request: $request,
            perPage: 20
        );
    }

    /**
     * Buscar veículo por ID
     */
    public function getVehicleById(int $id): JsonResponse
    {
        return $this->searchService->findById(
            collection: 'vehicles',
            modelClass: Vehicle::class,
            id: $id
        );
    }

    /**
     * Buscar veículo por UUID
     */
    public function getVehicleByUuid(string $uuid): JsonResponse
    {
        return $this->searchService->findByUuid(
            collection: 'vehicles',
            modelClass: Vehicle::class,
            uuid: $uuid
        );
    }

    /**
     * Buscar veículo por placa
     */
    public function getVehicleByPlate(string $plate): JsonResponse
    {
        return $this->searchService->findBy(
            collection: 'vehicles',
            modelClass: Vehicle::class,
            field: 'plate',
            value: $plate
        );
    }

    /**
     * Buscar todos os veículos de uma marca
     */
    public function getVehiclesByMark(int $markId): JsonResponse
    {
        return $this->searchService->findAllBy(
            collection: 'vehicles',
            modelClass: Vehicle::class,
            field: 'mark_id',
            value: $markId
        );
    }

    /**
     * Buscar veículos com múltiplos filtros
     */
    public function getVehiclesByFilters(int $markId, int $year, string $color): JsonResponse
    {
        return $this->searchService->findAllWhere(
            collection: 'vehicles',
            modelClass: Vehicle::class,
            conditions: [
                'mark_id' => $markId,
                ['year_of_manufacture', '>=', $year],
                ['color', '=', $color]
            ],
            limit: 100
        );
    }
}
```

### Exemplo: VehicleAlertService (Uso Real)

```php
<?php

namespace App\Services\BusinessRules;

use App\Models\Vehicles\VehicleMonitoring;
use App\Models\Vehicles\VehicleWhitelist;
use App\Services\Core\SearchService;

class VehicleAlertService
{
    protected SearchService $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Verificar se veículo está na whitelist
     */
    public function whiteList($passage)
    {
        return $this->searchService->findWhere(
            'vehicle_whitelists',
            VehicleWhitelist::class,
            [
                ['vehicle_id', '=', $passage->vehicle_id],
                ['client_id', '=', $passage->client_id],
                ['status', '=', 'active'],
                ['monitor_until', '>=', date('Y-m-d H:i:s')]
            ]
        );
    }

    /**
     * Buscar monitoramento ativo do veículo
     */
    public function vehicleMonitoring($passage)
    {
        return $this->searchService->findWhere(
            'vehicle_monitoring',
            VehicleMonitoring::class,
            [
                'vehicle_id' => $passage->vehicle_id,
                'client_id' => $passage->client_id,
                ['status', '=', 'active']
            ]
        );
    }

    /**
     * Buscar todos os monitoramentos de um cliente
     */
    public function getClientMonitorings(int $clientId, bool $activeOnly = true)
    {
        $conditions = ['client_id' => $clientId];

        if ($activeOnly) {
            $conditions[] = ['status', '=', 'active'];
            $conditions[] = ['valid_until', '>=', now()->format('Y-m-d H:i:s')];
        }

        return $this->searchService->findAllWhere(
            'vehicle_monitoring',
            VehicleMonitoring::class,
            $conditions
        );
    }
}
```

---

## Boas Práticas

### 1. Validação de Entrada
Sempre valide os parâmetros de entrada usando Form Requests:

```php
class UserSearchRequest extends FormRequest
{
    public function rules()
    {
        return [
            'page' => 'integer|min:1',
            'filter' => 'array',
            'filter.active' => 'boolean',
            'filter.id.gt' => 'integer',
            'sort' => 'string',
            'search' => 'string|max:255',
        ];
    }
}
```

### 2. Limitar Campos de Busca
Para performance, limite os campos onde a busca genérica pode ocorrer:

```php
// No controller ou service
$searchFields = $request->input('search_fields', ['name', 'email']);
$allowedFields = ['name', 'email', 'phone'];
$searchFields = array_intersect($searchFields, $allowedFields);
```

### 3. Documentar Endpoints com Swagger
```php
/**
 * @OA\Get(
 *     path="/api/users",
 *     summary="List users with filters",
 *     @OA\Parameter(name="filter[active]", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Parameter(name="sort", in="query", required=false, @OA\Schema(type="string")),
 *     @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Success")
 * )
 */
```

### 4. Índices de Banco de Dados
Certifique-se de ter índices para campos frequentemente filtrados/ordenados:

```php
// Migration
$table->index('email');
$table->index('created_at');
$table->index(['active', 'created_at']);
```

---

## Troubleshooting

### Problema: Filtros não funcionam
- Verifique a sintaxe: `filter[campo][operador]=valor`
- Certifique-se de que o campo existe na collection/tabela
- Verifique os logs em `storage/logs/laravel.log`

### Problema: Fallback MySQL não funciona
- Verifique se a classe do model foi passada corretamente
- Confirme que o model está mapeado em `MongoDBQueryService::inferModelClass()`
- Verifique conexão com MySQL

### Problema: Performance lenta
- Adicione índices nos campos filtrados/ordenados
- Reduza o `per_page` se necessário
- Use relacionamentos apenas quando necessário
- Considere cache para queries frequentes

---

## Suporte e Contribuições

Para dúvidas ou sugestões, consulte:
- Documentação técnica: `docs/MongoDBQueryService.md`
- Issues: Abra um ticket no repositório
- Code Review: Siga os padrões PSR-12 e DocBlocks

**Versão:** 2.0.0  
**Última atualização:** 09/01/2026  
**Novidades:**
- ⭐ **NEW:** Método `findWhere()` - Busca 1 registro com múltiplas condições
- ⭐ **NEW:** Método `findAllWhere()` - Busca múltiplos registros com múltiplas condições
- Suporte a formato simples e avançado de condições
- Exemplos práticos de uso em VehicleAlertService
