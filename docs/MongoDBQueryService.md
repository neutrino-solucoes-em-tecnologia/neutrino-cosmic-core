# MongoDBQueryService - Guia Completo de Relacionamentos

> Interface Eloquent-like para consultas MongoDB com suporte completo a relacionamentos.

## 🔙 [Voltar para Documentação Principal](README.md)

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Tipos de Relacionamentos](#tipos-de-relacionamentos)
4. [Consultas Básicas](#consultas-básicas)
5. [Relacionamentos Simples](#relacionamentos-simples)
6. [Relacionamentos Aninhados](#relacionamentos-aninhados)
7. [Filtragem com whereHas](#filtragem-com-wherehas)
8. [Contagem de Relacionamentos](#contagem-de-relacionamentos)
9. [Casos de Uso Práticos](#casos-de-uso-práticos)
10. [Referência Completa de Métodos](#referência-completa-de-métodos)

---

## Visão Geral

O **MongoDBQueryService** é uma classe que fornece uma interface fluente **estilo Eloquent** para consultar coleções MongoDB com suporte completo a **relacionamentos**. Ela foi projetada para manter a mesma sintaxe familiar do Eloquent ORM do Laravel, mas trabalhando diretamente com o MongoDB.

### Características Principais

✅ Interface fluente (method chaining)  
✅ Suporte completo a relacionamentos (hasMany, belongsTo, hasOne)  
✅ Relacionamentos aninhados com notação de ponto (e.g., `users.posts.comments`)  
✅ Filtragem por relacionamento (whereHas, whereDoesntHave)  
✅ Contagem de relacionamentos (withCount)  
✅ Paginação automática  
✅ Operadores de consulta compatíveis com Eloquent  
✅ Eager loading para evitar N+1 queries  

### Arquitetura

```
MySQL (Primary)  ←→  Observers  →  MongoDB (Synchronized)
    ↓                                       ↓
Eloquent ORM                    MongoDBQueryService
```

**Fluxo de Sincronização:**
1. Dados são salvos/atualizados no MySQL via Eloquent
2. Observers interceptam eventos (created, updated, deleted)
3. Dados são automaticamente sincronizados para MongoDB
4. MongoDBQueryService consulta o MongoDB com sintaxe Eloquent

---

## Configuração Inicial

### Conexão MongoDB

Certifique-se de que a conexão MongoDB está configurada em `config/database.php`:

```php
'mongodb' => [
    'driver' => 'mongodb',
    'dsn' => env('MONGO_URI', 'mongodb://localhost:27017'),
    'database' => env('MONGO_DATABASE', 'vehicle_passages_laravel'),
],
```

### Variáveis de Ambiente (.env)

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DATABASE=vehicle_passages_laravel
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_AUTH_DATABASE=admin
```

### Criando uma Instância

```php
use App\Services\Integrations\MongoDBQueryService;

// Conectar a uma coleção específica
$mongo = new MongoDBQueryService('colors');
```

---

## Tipos de Relacionamentos

### 1. hasMany (Um-para-Muitos)

**Definição:** Um registro possui vários registros relacionados.

**Exemplo:** Uma cor (`Color`) possui vários aliases (`ColorAlias`).

**Estrutura de Dados:**
```
colors collection:
{ id: 1, name: "Preto", canonical_name: "preto" }

color_aliases collection:
{ id: 1, color_id: 1, alias: "black" }
{ id: 2, color_id: 1, alias: "negro" }
{ id: 3, color_id: 1, alias: "schwarz" }
```

**Código:**
```php
$mongo = new MongoDBQueryService('colors');

// Carregar cor com todos os seus aliases
$color = $mongo->with('color_aliases', 'color_id')->find(1);

// Resultado:
// $color->name = "Preto"
// $color->color_aliases = Collection [
//     { id: 1, color_id: 1, alias: "black" },
//     { id: 2, color_id: 1, alias: "negro" },
//     { id: 3, color_id: 1, alias: "schwarz" }
// ]
```

**Usando hasMany() explicitamente:**
```php
$color = $mongo->hasMany('color_aliases', 'color_id', 'id')->find(1);
```

### 2. belongsTo (Muitos-para-Um / Inverso)

**Definição:** Um registro pertence a um registro pai.

**Exemplo:** Um alias de cor (`ColorAlias`) pertence a uma cor (`Color`).

**Estrutura de Dados:**
```
color_aliases collection:
{ id: 1, color_id: 1, alias: "black" }

colors collection:
{ id: 1, name: "Preto", canonical_name: "preto" }
```

**Código:**
```php
$mongo = new MongoDBQueryService('color_aliases');

// Carregar alias com a cor pai
$alias = $mongo->belongsTo('colors', 'color_id', 'id')->find(1);

// Resultado:
// $alias->alias = "black"
// $alias->color_id = 1
// $alias->colors = { id: 1, name: "Preto", canonical_name: "preto" }
```

**Nota:** O nome do relacionamento será `colors` (nome da coleção) por padrão. Para customizar:

```php
$alias = $mongo->belongsTo('colors', 'color_id', 'id', 'color')->find(1);
// Agora: $alias->color (ao invés de $alias->colors)
```

### 3. hasOne (Um-para-Um)

**Definição:** Um registro possui exatamente um registro relacionado.

**Exemplo:** Um usuário possui um perfil.

**Estrutura de Dados:**
```
users collection:
{ id: 1, name: "João Silva", email: "joao@example.com" }

profiles collection:
{ id: 1, user_id: 1, bio: "Desenvolvedor Laravel", avatar: "avatar.jpg" }
```

**Código:**
```php
$mongo = new MongoDBQueryService('users');

// Carregar usuário com perfil
$user = $mongo->hasOne('profiles', 'user_id', 'id')->find(1);

// Resultado:
// $user->name = "João Silva"
// $user->profiles = { id: 1, user_id: 1, bio: "Desenvolvedor Laravel", ... }
```

---

## Consultas Básicas

### Buscar por ID

```php
$mongo = new MongoDBQueryService('colors');
$color = $mongo->find(1);

// Resultado: objeto com todos os campos da cor
echo $color->name; // "Preto"
```

### Buscar com Condições (where)

```php
$mongo = new MongoDBQueryService('colors');

// Buscar cor específica
$color = $mongo->where('canonical_name', '=', 'preto')->first();

// Sintaxe simplificada (operador '=' implícito)
$color = $mongo->where('canonical_name', 'preto')->first();

// Operadores suportados:
$mongo->where('id', '>', 10)->get();           // maior que
$mongo->where('id', '>=', 10)->get();          // maior ou igual
$mongo->where('id', '<', 100)->get();          // menor que
$mongo->where('id', '<=', 100)->get();         // menor ou igual
$mongo->where('name', '!=', 'Preto')->get();   // diferente
$mongo->where('name', 'like', 'Pret')->get();  // LIKE (regex case-insensitive)
$mongo->where('id', 'in', [1, 2, 3])->get();   // IN
$mongo->where('id', 'nin', [1, 2, 3])->get();  // NOT IN
```

### Múltiplas Condições

```php
$mongo = new MongoDBQueryService('vehicle_models');

$models = $mongo
    ->where('mark_id', '=', 5)
    ->where('year', '>=', 2020)
    ->get();
```

### Ordenação

```php
$mongo = new MongoDBQueryService('colors');

// Ordem crescente
$colors = $mongo->orderBy('name', 'asc')->get();

// Ordem decrescente
$colors = $mongo->orderBy('created_at', 'desc')->get();

// Múltiplas ordenações
$colors = $mongo
    ->orderBy('name', 'asc')
    ->orderBy('id', 'desc')
    ->get();
```

### Limitar Resultados

```php
$mongo = new MongoDBQueryService('colors');

// Pegar apenas 10 resultados
$colors = $mongo->limit(10)->get();

// Pular os primeiros 5 e pegar 10
$colors = $mongo->skip(5)->limit(10)->get();
```

### Contagem

```php
$mongo = new MongoDBQueryService('colors');

// Contar todos os registros
$total = $mongo->count();

// Contar com condições
$total = $mongo->where('canonical_name', 'like', 'azul')->count();
```

### Paginação

```php
$mongo = new MongoDBQueryService('colors');

// Página 1, 15 itens por página (padrão)
$result = $mongo->paginate();

// Página 2, 20 itens por página
$result = $mongo->paginate(20, 2);

// Estrutura do resultado:
// [
//     'data' => Collection,        // Itens da página atual
//     'total' => 150,              // Total de registros
//     'per_page' => 20,            // Itens por página
//     'current_page' => 2,         // Página atual
//     'last_page' => 8             // Última página
// ]
```

---

## Relacionamentos Simples

### Exemplo 1: Cores e Aliases

**Cenário:** Carregar uma cor com todos os seus aliases.

```php
$mongo = new MongoDBQueryService('colors');

// Buscar cor com aliases
$color = $mongo->with('color_aliases', 'color_id')->find(1);

// Acessar dados
echo $color->name; // "Preto"
echo $color->color_aliases->count(); // 12

// Iterar pelos aliases
foreach ($color->color_aliases as $alias) {
    echo $alias->alias; // "black", "negro", "schwarz", ...
}
```

### Exemplo 2: Marca e País (belongsTo)

**Cenário:** Carregar uma marca com o país de origem.

```php
$mongo = new MongoDBQueryService('marks');

// Buscar marca com país
$mark = $mongo->belongsTo('countries', 'country_id', 'id')->find(5);

// Acessar dados
echo $mark->name; // "CHEVROLET"
echo $mark->countries->name; // "Brasil"
```

### Exemplo 3: País com Marcas (hasMany)

**Cenário:** Carregar um país com todas as suas marcas.

```php
$mongo = new MongoDBQueryService('countries');

// Buscar país com marcas
$country = $mongo->with('marks', 'country_id')->find(1);

// Acessar dados
echo $country->name; // "Brasil"
echo $country->marks->count(); // 424

// Listar marcas
foreach ($country->marks as $mark) {
    echo $mark->name; // "CHEVROLET", "FIAT", "VOLKSWAGEN", ...
}
```

### Exemplo 4: Múltiplos Relacionamentos

**Cenário:** Carregar um país com marcas E modelos de veículos.

```php
$mongo = new MongoDBQueryService('countries');

// Buscar país com marcas e modelos
$country = $mongo
    ->with('marks', 'country_id')
    ->with('vehicle_models', 'country_id')
    ->find(1);

// Acessar dados
echo $country->name; // "Brasil"
echo $country->marks->count(); // 424 marcas
echo $country->vehicle_models->count(); // 2919 modelos
```

---

## Relacionamentos Aninhados

### Notação de Ponto (Dot Notation)

**Definição:** Carregar relacionamentos dentro de relacionamentos usando ponto (`.`).

**Exemplo:** `'marks.vehicle_models.vehicle_model_aliases'`
- Carrega `marks` do país
- Para cada marca, carrega `vehicle_models`
- Para cada modelo, carrega `vehicle_model_aliases`

### Exemplo 1: País → Marcas → Modelos

**Cenário:** Carregar país com marcas e os modelos de cada marca.

```php
$mongo = new MongoDBQueryService('countries');

// Carregar país com marcas e modelos das marcas
$country = $mongo->with('marks.vehicle_models', 'country_id')->find(1);

// Acessar dados
echo $country->name; // "Brasil"

foreach ($country->marks as $mark) {
    echo $mark->name; // "CHEVROLET"
    echo $mark->vehicle_models->count(); // 99 modelos
    
    foreach ($mark->vehicle_models as $model) {
        echo $model->name; // "Onix", "Cruze", "S10", ...
    }
}
```

### Exemplo 2: Marca → Modelos → Aliases (3 Níveis)

**Cenário:** Carregar marca com modelos e aliases de cada modelo.

```php
$mongo = new MongoDBQueryService('marks');

// Carregar marca com modelos e aliases dos modelos
$mark = $mongo->with('vehicle_models.vehicle_model_aliases', 'mark_id')->find(5);

// Acessar dados
echo $mark->name; // "CHEVROLET"

foreach ($mark->vehicle_models as $model) {
    echo $model->name; // "Onix"
    
    foreach ($model->vehicle_model_aliases as $alias) {
        echo $alias->alias; // "onix", "ônix", "onyx", ...
    }
}
```

### Exemplo 3: Hierarquia IBGE (7 Níveis)

**Cenário:** Carregar região com toda a hierarquia geográfica.

```php
$mongo = new MongoDBQueryService('regions');

// Carregar região com estados, mesorregiões e microrregiões
$region = $mongo->with('states.mesoregions.microregions', 'region_id')->first();

// Acessar dados
echo $region->name; // "Norte"

foreach ($region->states as $state) {
    echo $state->name; // "Rondônia"
    
    foreach ($state->mesoregions as $meso) {
        echo $meso->name; // "Madeira-Guaporé"
        
        foreach ($meso->microregions as $micro) {
            echo $micro->name; // "Porto Velho"
        }
    }
}
```

### Exemplo 4: Hierarquia Completa (Bottom-Up)

**Cenário:** Carregar cidade com toda a hierarquia até região.

```php
$mongo = new MongoDBQueryService('cities');

// Carregar cidade com microregião
$city = $mongo->belongsTo('microregions', 'microregion_id', 'id')->first();

// Depois carregar mesorregião da microregião
if ($city && $city->microregions) {
    $microregion = (new MongoDBQueryService('microregions'))
        ->where('id', '=', $city->microregion_id)
        ->belongsTo('mesoregions', 'mesoregion_id', 'id')
        ->first();
    
    if ($microregion && $microregion->mesoregions) {
        // Depois carregar estado da mesorregião
        $mesoregion = (new MongoDBQueryService('mesoregions'))
            ->where('id', '=', $microregion->mesoregion_id)
            ->belongsTo('states', 'state_id', 'id')
            ->first();
        
        // Navegação completa: City → Microregion → Mesoregion → State → Region
    }
}
```

---

## Filtragem com whereHas

### Conceito

**whereHas** filtra registros **baseado na existência** de relacionamentos.

**Exemplo:** "Buscar apenas cores que tenham aliases"

### Sintaxe Básica

```php
$mongo = new MongoDBQueryService('colors');

// Buscar apenas cores que possuem aliases
$colorsWithAliases = $mongo->whereHas('color_aliases', 'color_id')->get();

// Resultado: apenas cores que têm pelo menos 1 alias
```

### Como Funciona Internamente

1. **Query no relacionamento:** Busca todos os `color_aliases`
2. **Coleta IDs:** Pega todos os `color_id` únicos
3. **Filtra principal:** Adiciona `WHERE id IN [1, 2, 3...]` na query de `colors`

### Exemplo 1: Países com Marcas

```php
$mongo = new MongoDBQueryService('countries');

// Buscar apenas países que possuem marcas cadastradas
$countriesWithMarks = $mongo->whereHas('marks', 'country_id')->get();

// Resultado:
// Apenas países como "Brasil", "Alemanha", "Japão", etc.
// Exclui países sem marcas
```

### Exemplo 2: Marcas com Modelos

```php
$mongo = new MongoDBQueryService('marks');

// Buscar apenas marcas que possuem modelos
$marksWithModels = $mongo->whereHas('vehicle_models', 'mark_id')->get();

// Com limit
$topMarks = $mongo
    ->whereHas('vehicle_models', 'mark_id')
    ->limit(10)
    ->get();
```

### Exemplo 3: whereHas com Callback (Condições Avançadas)

**Cenário:** Buscar marcas que possuem modelos de um ano específico.

```php
$mongo = new MongoDBQueryService('marks');

// Buscar marcas que têm modelos do ano 2020
$marks = $mongo->whereHas('vehicle_models', 'mark_id', function($query) {
    $query->where('year', '=', 2020);
})->get();
```

### Exemplo 4: whereDoesntHave (Inverso)

**Conceito:** Buscar registros que **NÃO** possuem relacionamentos.

```php
$mongo = new MongoDBQueryService('colors');

// Buscar cores que NÃO possuem aliases
$colorsWithoutAliases = $mongo->whereDoesntHave('color_aliases', 'color_id')->get();

// Resultado: apenas cores sem aliases cadastrados
```

### Exemplo 5: Combinando whereHas com with

**Cenário:** Filtrar por relacionamento E carregar o relacionamento.

```php
$mongo = new MongoDBQueryService('countries');

// Buscar países com marcas E carregar as marcas
$countries = $mongo
    ->whereHas('marks', 'country_id')
    ->with('marks', 'country_id')
    ->get();

// Resultado:
// Apenas países com marcas, e cada país tem o array de marcas carregado
foreach ($countries as $country) {
    echo $country->name;
    echo $country->marks->count(); // Marcas carregadas
}
```

---

## Contagem de Relacionamentos

### withCount - Contar Sem Carregar

**Conceito:** Adicionar contagem de relacionamentos sem carregar os dados completos.

**Vantagem:** Performance - conta no banco sem carregar todos os registros.

### Sintaxe Básica

```php
$mongo = new MongoDBQueryService('colors');

// Adicionar contagem de aliases
$colors = $mongo->withCount('color_aliases', 'color_id')->limit(10)->get();

// Resultado:
foreach ($colors as $color) {
    echo $color->name; // "Preto"
    echo $color->color_aliases_count; // 12 (apenas o número, sem carregar aliases)
}
```

### Exemplo 1: Tipos de Veículos com Contagem de Aliases

```php
$mongo = new MongoDBQueryService('vehicle_types');

// Buscar tipos com contagem de aliases
$types = $mongo->withCount('vehicle_type_aliases', 'vehicle_type_id')->get();

foreach ($types as $type) {
    echo "{$type->name}: {$type->vehicle_type_aliases_count} aliases";
}

// Resultado:
// "Carro: 3 aliases"
// "Moto: 2 aliases"
// "Caminhão: 1 alias"
```

### Exemplo 2: Nome Customizado para Contagem

```php
$mongo = new MongoDBQueryService('colors');

// Usar nome customizado para o campo de contagem
$colors = $mongo->withCount('color_aliases', 'color_id', 'total_aliases')->get();

foreach ($colors as $color) {
    echo $color->total_aliases; // Nome customizado
}
```

### Exemplo 3: Múltiplas Contagens

```php
$mongo = new MongoDBQueryService('countries');

// Adicionar contagem de marcas E modelos
$country = $mongo
    ->withCount('marks', 'country_id', 'total_marks')
    ->withCount('vehicle_models', 'country_id', 'total_models')
    ->find(1);

echo $country->name; // "Brasil"
echo $country->total_marks; // 424
echo $country->total_models; // 2919
```

### Exemplo 4: Combinar withCount + with

```php
$mongo = new MongoDBQueryService('marks');

// Carregar modelos E adicionar contagem de aliases
$mark = $mongo
    ->with('vehicle_models', 'mark_id')
    ->withCount('mark_aliases', 'mark_id', 'alias_count')
    ->find(5);

echo $mark->name; // "CHEVROLET"
echo $mark->alias_count; // 1 (apenas contagem)
echo $mark->vehicle_models->count(); // 99 (dados completos)
```

---

## Casos de Uso Práticos

### Caso 1: Dashboard de Estatísticas

**Objetivo:** Exibir estatísticas de um país (total de marcas, modelos, etc).

```php
$mongo = new MongoDBQueryService('countries');

// Buscar país com contagens
$country = $mongo
    ->withCount('marks', 'country_id', 'total_marks')
    ->withCount('vehicle_models', 'country_id', 'total_models')
    ->where('name', '=', 'Brasil')
    ->first();

// Exibir no dashboard
echo "País: {$country->name}";
echo "Total de Marcas: {$country->total_marks}";
echo "Total de Modelos: {$country->total_models}";
```

### Caso 2: Autocomplete de Veículos

**Objetivo:** Buscar modelos com informações da marca.

```php
$mongo = new MongoDBQueryService('vehicle_models');

// Buscar modelos com nome parecido + dados da marca
$search = 'Onix';
$models = $mongo
    ->where('name', 'like', $search)
    ->belongsTo('marks', 'mark_id', 'id', 'mark')
    ->limit(10)
    ->get();

// Resultado para autocomplete
foreach ($models as $model) {
    echo "{$model->mark->name} {$model->name}"; // "CHEVROLET Onix"
}
```

### Caso 3: Listagem de Marcas Ativas

**Objetivo:** Listar apenas marcas que possuem modelos cadastrados.

```php
$mongo = new MongoDBQueryService('marks');

// Buscar marcas com modelos + contagem
$marks = $mongo
    ->whereHas('vehicle_models', 'mark_id')
    ->withCount('vehicle_models', 'mark_id', 'model_count')
    ->orderBy('name', 'asc')
    ->get();

foreach ($marks as $mark) {
    echo "{$mark->name} ({$mark->model_count} modelos)";
}

// Resultado:
// "CHEVROLET (99 modelos)"
// "FIAT (85 modelos)"
// "VOLKSWAGEN (92 modelos)"
```

### Caso 4: Relatório Hierárquico (IBGE)

**Objetivo:** Gerar relatório de regiões com estados e contagens.

```php
$mongo = new MongoDBQueryService('regions');

// Buscar regiões com estados e contagens
$regions = $mongo
    ->with('states', 'region_id')
    ->withCount('states', 'region_id', 'state_count')
    ->get();

foreach ($regions as $region) {
    echo "\n{$region->name} ({$region->state_count} estados):";
    
    foreach ($region->states as $state) {
        echo "\n  - {$state->name}";
    }
}

// Resultado:
// Norte (7 estados):
//   - Rondônia
//   - Acre
//   - Amazonas
//   - ...
```

### Caso 5: Busca com Múltiplos Filtros

**Objetivo:** Buscar modelos com múltiplas condições.

```php
$mongo = new MongoDBQueryService('vehicle_models');

// Buscar modelos de uma marca específica, com aliases, do ano >= 2020
$models = $mongo
    ->where('mark_id', '=', 5)
    ->where('year', '>=', 2020)
    ->whereHas('vehicle_model_aliases', 'vehicle_model_id')
    ->with('vehicle_model_aliases', 'vehicle_model_id')
    ->belongsTo('marks', 'mark_id', 'id', 'mark')
    ->orderBy('name', 'asc')
    ->paginate(20, 1);

// Resultado paginado:
// $models['data'] = Collection de modelos
// $models['total'] = Total de resultados
// $models['current_page'] = 1
// $models['last_page'] = 5
```

### Caso 6: Validação de Dados

**Objetivo:** Verificar se existem registros órfãos.

```php
$mongo = new MongoDBQueryService('vehicle_model_aliases');

// Buscar aliases sem modelo pai
$orphanAliases = $mongo->whereDoesntHave('vehicle_models', 'vehicle_model_id')->get();

if ($orphanAliases->count() > 0) {
    echo "Encontrados {$orphanAliases->count()} aliases órfãos!";
    
    foreach ($orphanAliases as $alias) {
        echo "\nAlias ID {$alias->id} - modelo inexistente: {$alias->vehicle_model_id}";
    }
}
```

### Caso 7: Exportação de Dados Completos

**Objetivo:** Exportar marca com todos os relacionamentos para JSON.

```php
$mongo = new MongoDBQueryService('marks');

// Carregar marca com TODOS os dados
$mark = $mongo
    ->belongsTo('countries', 'country_id', 'id', 'country')
    ->with('mark_aliases', 'mark_id')
    ->with('vehicle_models.vehicle_model_aliases', 'mark_id')
    ->find(5);

// Converter para array/JSON
$export = [
    'marca' => $mark->name,
    'pais' => $mark->country->name,
    'aliases' => $mark->mark_aliases->pluck('alias')->toArray(),
    'modelos' => $mark->vehicle_models->map(function($model) {
        return [
            'nome' => $model->name,
            'ano' => $model->year,
            'aliases' => $model->vehicle_model_aliases->pluck('alias')->toArray()
        ];
    })->toArray()
];

return json_encode($export, JSON_PRETTY_PRINT);
```

---

## Referência Completa de Métodos

### Métodos de Consulta

#### `find($id)`
Buscar documento por ID.

```php
$color = $mongo->find(1);
```

#### `where($field, $operator, $value)`
Adicionar condição WHERE.

```php
$mongo->where('name', '=', 'Preto');
$mongo->where('id', '>', 10);
$mongo->where('name', 'like', 'azul');
```

**Operadores suportados:**
- `=` - Igual
- `!=`, `<>` - Diferente
- `>` - Maior que
- `>=` - Maior ou igual
- `<` - Menor que
- `<=` - Menor ou igual
- `like` - LIKE (regex case-insensitive)
- `in` - IN (array de valores)
- `nin`, `not in` - NOT IN

#### `get()`
Obter todos os resultados.

```php
$colors = $mongo->where('active', '=', true)->get();
```

#### `first()`
Obter primeiro resultado.

```php
$color = $mongo->where('canonical_name', 'preto')->first();
```

#### `count()`
Contar resultados.

```php
$total = $mongo->where('active', '=', true)->count();
```

#### `exists()`
Verificar se existe algum resultado.

```php
$hasColors = $mongo->where('name', 'like', 'azul')->exists();
```

#### `paginate($perPage, $page)`
Paginar resultados.

```php
$result = $mongo->paginate(20, 1);
// Retorna: ['data', 'total', 'per_page', 'current_page', 'last_page']
```

---

### Métodos de Relacionamento

#### `with($collection, $foreignKey, $localKey, $relationName)`
Eager loading (hasMany por padrão).

```php
// Básico
$mongo->with('color_aliases', 'color_id');

// Customizado
$mongo->with('color_aliases', 'color_id', 'id', 'aliases');

// Aninhado
$mongo->with('marks.vehicle_models', 'country_id');
```

#### `hasMany($collection, $foreignKey, $localKey, $relationName)`
Relacionamento um-para-muitos explícito.

```php
$mongo->hasMany('color_aliases', 'color_id', 'id', 'aliases');
```

#### `belongsTo($collection, $foreignKey, $ownerKey, $relationName)`
Relacionamento muitos-para-um.

```php
$mongo->belongsTo('colors', 'color_id', 'id', 'color');
```

#### `hasOne($collection, $foreignKey, $localKey, $relationName)`
Relacionamento um-para-um.

```php
$mongo->hasOne('profiles', 'user_id', 'id', 'profile');
```

#### `whereHas($relation, $foreignKey, $callback)`
Filtrar por existência de relacionamento.

```php
// Simples
$mongo->whereHas('color_aliases', 'color_id');

// Com callback
$mongo->whereHas('vehicle_models', 'mark_id', function($query) {
    $query->where('year', '=', 2020);
});
```

#### `whereDoesntHave($relation, $foreignKey)`
Filtrar por inexistência de relacionamento.

```php
$mongo->whereDoesntHave('color_aliases', 'color_id');
```

#### `withCount($relation, $foreignKey, $countName)`
Adicionar contagem de relacionamento.

```php
$mongo->withCount('color_aliases', 'color_id');
$mongo->withCount('color_aliases', 'color_id', 'total_aliases');
```

---

### Métodos de Ordenação e Limite

#### `orderBy($field, $direction)`
Ordenar resultados.

```php
$mongo->orderBy('name', 'asc');
$mongo->orderBy('created_at', 'desc');
```

#### `limit($limit)`
Limitar número de resultados.

```php
$mongo->limit(10);
```

#### `skip($skip)`
Pular resultados (offset).

```php
$mongo->skip(20)->limit(10); // Página 3
```

---

### Métodos de Manipulação

#### `create($data)`
Criar novo documento.

```php
$id = $mongo->create([
    'name' => 'Nova Cor',
    'canonical_name' => 'nova_cor'
]);
```

#### `update($data)`
Atualizar documentos.

```php
$modified = $mongo
    ->where('id', '=', 1)
    ->update(['name' => 'Cor Atualizada']);
```

#### `delete()`
Deletar documentos.

```php
$deleted = $mongo->where('id', '=', 1)->delete();
```

---

## Boas Práticas

### ✅ DO (Faça)

1. **Use eager loading para evitar N+1 queries:**
```php
// ✅ BOM - 2 queries
$colors = $mongo->with('color_aliases', 'color_id')->get();

// ❌ RUIM - N+1 queries (1 + N)
$colors = $mongo->get();
foreach ($colors as $color) {
    $aliases = (new MongoDBQueryService('color_aliases'))
        ->where('color_id', '=', $color->id)->get();
}
```

2. **Use whereHas para filtrar por relacionamentos:**
```php
// ✅ BOM - filtra no banco
$colors = $mongo->whereHas('color_aliases', 'color_id')->get();

// ❌ RUIM - carrega tudo e filtra em memória
$colors = $mongo->with('color_aliases', 'color_id')->get()
    ->filter(fn($c) => $c->color_aliases->count() > 0);
```

3. **Use withCount quando só precisar do número:**
```php
// ✅ BOM - só conta
$colors = $mongo->withCount('color_aliases', 'color_id')->get();

// ❌ RUIM - carrega tudo
$colors = $mongo->with('color_aliases', 'color_id')->get();
foreach ($colors as $color) {
    $count = $color->color_aliases->count();
}
```

4. **Use paginação para grandes conjuntos de dados:**
```php
// ✅ BOM
$result = $mongo->paginate(50, $page);

// ❌ RUIM
$all = $mongo->get(); // Pode carregar milhares de registros
```

5. **Sempre adicione limit em queries abertas:**
```php
// ✅ BOM
$recent = $mongo->orderBy('created_at', 'desc')->limit(10)->get();

// ❌ RUIM (pode retornar milhares)
$all = $mongo->orderBy('created_at', 'desc')->get();
```

### ❌ DON'T (Não Faça)

1. **Não faça múltiplas queries quando pode usar relacionamentos:**
```php
// ❌ RUIM
$color = $mongo->find(1);
$aliases = (new MongoDBQueryService('color_aliases'))
    ->where('color_id', '=', $color->id)->get();

// ✅ BOM
$color = $mongo->with('color_aliases', 'color_id')->find(1);
```

2. **Não carregue relacionamentos desnecessários:**
```php
// ❌ RUIM - carrega dados não usados
$color = $mongo
    ->with('color_aliases', 'color_id')
    ->with('vehicles', 'color_id')
    ->with('passages', 'color_id')
    ->find(1);
echo $color->name; // Só usa name

// ✅ BOM
$color = $mongo->find(1);
echo $color->name;
```

3. **Não use relacionamentos aninhados excessivamente:**
```php
// ❌ RUIM - 5 níveis de aninhamento
$region = $mongo->with('states.mesoregions.microregions.cities.districts')->first();

// ✅ BOM - carregue sob demanda
$region = $mongo->with('states', 'region_id')->first();
// Depois carregue mais se necessário
```

---

## Troubleshooting

### Problema: Relacionamento retorna vazio

**Causa:** Foreign key incorreta ou dados não sincronizados.

**Solução:**
```php
// Verifique se os dados existem
$count = (new MongoDBQueryService('color_aliases'))
    ->where('color_id', '=', 1)
    ->count();
echo "Aliases da cor 1: {$count}";

// Verifique se a foreign key está correta
$color = $mongo->with('color_aliases', 'color_id')->find(1);
dd($color); // Inspecione o resultado
```

### Problema: whereHas retorna 0 resultados

**Causa:** Foreign key invertida ou dados não existem.

**Solução:**
```php
// Teste a query do relacionamento separadamente
$aliases = (new MongoDBQueryService('color_aliases'))->get();
dd($aliases); // Verifique os dados

// Verifique a foreign key
$colors = $mongo->whereHas('color_aliases', 'color_id')->get();
```

### Problema: Nested relationships não carregam

**Causa:** Notação de ponto incorreta ou foreign keys erradas.

**Solução:**
```php
// Carregue nível por nível para debug
$country = $mongo->with('marks', 'country_id')->find(1);
dd($country->marks); // Verificar primeiro nível

$mark = (new MongoDBQueryService('marks'))
    ->with('vehicle_models', 'mark_id')
    ->first();
dd($mark->vehicle_models); // Verificar segundo nível

// Depois combine
$country = $mongo->with('marks.vehicle_models', 'country_id')->find(1);
```

### Problema: Performance lenta

**Causa:** N+1 queries ou falta de índices.

**Solução:**
```php
// Use eager loading
$colors = $mongo->with('color_aliases', 'color_id')->get();

// Use limit
$colors = $mongo->limit(100)->get();

// Use whereHas ao invés de filtrar em memória
$colors = $mongo->whereHas('color_aliases', 'color_id')->get();

// Adicione índices no MongoDB (via migration ou comando)
// db.color_aliases.createIndex({ color_id: 1 })
```

---

## Resumo Final

O **MongoDBQueryService** é uma camada de abstração poderosa que permite:

✅ Consultar MongoDB com sintaxe Eloquent familiar  
✅ Carregar relacionamentos automaticamente (eager loading)  
✅ Filtrar por existência de relacionamentos (whereHas)  
✅ Contar relacionamentos sem carregar dados (withCount)  
✅ Navegar hierarquias complexas (dot notation)  
✅ Paginar resultados facilmente  
✅ Manter performance com queries otimizadas  

**Principais vantagens:**
- Mesma sintaxe do Eloquent (curva de aprendizado zero)
- Relacionamentos funcionam como no MySQL
- Performance superior ao Eloquent-MongoDB em alguns cenários
- Flexibilidade total do MongoDB preservada

**Quando usar:**
- Consultas complexas com relacionamentos
- Dados já sincronizados do MySQL
- Queries de leitura (relatórios, dashboards, APIs)
- Navegação em hierarquias (IBGE, categorias, etc)

**Quando NÃO usar:**
- Escrita de dados (use Eloquent no MySQL, os Observers sincronizam)
- Transações ACID (use MySQL)
- Relacionamentos polimórficos complexos

---

## Documentação Adicional

- **Repositório:** `app/Services/Integrations/MongoDBQueryService.php`
- **Testes:** `database/seeders/AllModelsRelationshipTestSeeder.php`
- **Exemplos práticos:** Execute `php artisan db:seed --class=AllModelsRelationshipTestSeeder`

**Relatório de Testes:**
Após executar o seeder, um relatório completo com 49 testes é gerado em:
`storage/app/reports/relatorio-relacionamentos-{timestamp}.txt`

Este relatório demonstra todos os tipos de relacionamentos funcionando na prática.

---

**Última atualização:** 09/12/2025  
**Versão:** 1.0  
**Autor:** CCONet Team
