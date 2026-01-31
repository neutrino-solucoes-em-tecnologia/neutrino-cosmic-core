# Importação de Modelos de Veículos via CSV

> Guia de importação de modelos de veículos (carros, motos, caminhões, náutica) a partir de arquivos CSV.

**📌 Nota**: Esta documentação descreve um processo de importação legado. Para importação via comando Laravel, veja [csv:import em Commands.md](Commands.md#csvimport).

## 🔙 [Voltar para Documentação Principal](README.md)

---

## 📁 Arquivos CSV Disponíveis

O sistema suporta importação dos seguintes tipos de veículos:

- **`modelos-caminhao.csv`** - Modelos de caminhões
- **`modelos-carro.csv`** - Modelos de carros
- **`modelos-moto.csv`** - Modelos de motos  
- **`modelos-nautica.csv`** - Modelos náuticos

## 🚀 Como Importar

### 1. Pré-requisitos

- Banco de dados configurado e acessível
- Variáveis de ambiente configuradas (`.env`)
- Projeto compilado (`npm run build`)
- Marcas já importadas no sistema

### 2. Executar Importação

#### Opção 1: Comandos NPM (Recomendado)
```bash
# Importar todos os tipos de veículos
npm run models:import

# Limpar todos os modelos
npm run models:clear
```

#### Opção 2: Scripts Diretos
```bash
# Importar todos os tipos de veículos
node scripts/import-models-from-csv.js

# Ou executar diretamente o TypeScript (se disponível)
npx ts-node src/scripts/import-models-from-csv.ts
```

### 3. Executar Limpeza (se necessário)

#### Opção 1: Comando NPM (Recomendado)
```bash
# Limpar todos os modelos
npm run models:clear
```

#### Opção 2: Script Direto
```bash
# Limpar todos os modelos
node scripts/clear-models-direct.js
```

## 📊 Estrutura dos Arquivos CSV

Todos os arquivos CSV seguem o mesmo formato:

```csv
ID;IDMARCA;NOME
320;14;HR
734;4;1113
735;4;1214
...
```

### Campos:
- **`ID`**: Identificador único do modelo (não usado na importação)
- **`IDMARCA`**: ID da marca no sistema (deve existir)
- **`NOME`**: Nome do modelo

## 🔄 Processo de Importação

### 1. Validação
- Verifica se a marca existe no sistema
- Evita duplicação de modelos
- Valida formato dos dados

### 2. Criação de Modelos
- Cria entidade `Model` com dados do CSV
- Define `canonical_name` e `display_name` como o nome do CSV
- Anos de fabricação ficam como `undefined` (ainda em produção)

### 3. Geração Automática de Aliases
O sistema cria automaticamente aliases para cada modelo:

- **Alias básico**: `{Marca} {Nome do Modelo}`
- **Abreviação**: `{Iniciais da Marca} {Nome do Modelo}`
- **Específicos por marca**:
  - Volkswagen → `VW {Nome}`
  - General Motors → `GM {Nome}`
  - Toyota → `トヨタ {Nome}` (japonês)
  - Honda → `ホンダ {Nome}` (japonês)

### 4. Sanitização
- Aliases são sanitizados usando `sanitizeAlias()`
- Remove acentos e caracteres especiais
- Converte para minúsculas
- Normaliza espaços

## 📈 Estatísticas de Importação

O sistema fornece relatórios detalhados:

```
🚀 Iniciando importação de modelos de todos os tipos de veículos...

🚗 Importando modelos de Caminhão do arquivo: modelos-caminhao.csv
📊 Total de linhas no CSV: 341
✅ Modelo criado: HR (Marca)
  📝 Alias criado: "Marca HR" → "marca hr"
  📝 Alias criado: "MR HR" → "mr hr"

📊 Resumo Caminhão:
  Modelos: 341 criados, 0 ignorados
  Aliases: 682 criados, 0 ignorados

🎉 Importação concluída!
📊 Resumo Geral:
  Total de modelos processados: 1364
  Modelos criados: 1364
  Modelos ignorados: 0
  Total de aliases processados: 2728
  Aliases criados: 2728
  Aliases ignorados: 0
```

## ⚠️ Considerações Importantes

### 1. Dependências
- **Marcas devem existir**: O sistema verifica se `IDMARCA` existe antes de criar modelos
- **Executar seeds primeiro**: Execute `npm run seed` para criar marcas antes da importação

### 2. Performance
- **Logging desabilitado**: Para melhor performance durante importação
- **Processamento em lote**: Modelos são processados sequencialmente
- **Verificação de duplicatas**: Evita recriar modelos existentes

### 3. Tratamento de Erros
- **Linhas inválidas**: São ignoradas e reportadas
- **Marcas inexistentes**: Modelos são pulados com aviso
- **Erros de banco**: São capturados e reportados

### 4. Rollback
- Use `clear-models-direct.js` para remover modelos se necessário
- **Cuidado**: A limpeza remove TODOS os modelos e aliases

## 🔧 Personalização

### Modificar Geração de Aliases

Edite o método `generateAliases()` em `src/scripts/import-models-from-csv.ts`:

```typescript
private generateAliases(modelName: string, markName: string): string[] {
  const aliases: string[] = [];
  
  // Seu código personalizado aqui
  
  return aliases;
}
```

### Adicionar Novos Tipos de Veículo

Edite o array `csvFiles` em `importAllVehicleTypes()`:

```typescript
const csvFiles = [
  // ... arquivos existentes
  { path: 'docs/marks-and-models/novo-tipo.csv', type: 'Novo Tipo' },
];
```

## 📝 Logs e Monitoramento

### Níveis de Log
- **✅ Sucesso**: Modelos e aliases criados
- **⏭️  Ignorado**: Modelos já existentes
- **⚠️  Aviso**: Problemas não críticos
- **❌ Erro**: Falhas que impedem importação

### Arquivos de Log
- Logs são exibidos no console
- Para salvar logs: `node scripts/import-models-from-csv.js > import.log 2>&1`

## 🚨 Troubleshooting

### Erro: "Marca ID X não encontrada"
- Execute `npm run seed` primeiro
- Verifique se as marcas existem no banco

### Erro: "Arquivo não encontrado"
- Verifique se os arquivos CSV estão em `docs/marks-and-models/`
- Confirme nomes dos arquivos

### Erro de Conexão com Banco
- Verifique variáveis de ambiente (`.env`)
- Confirme se o banco está rodando
- Teste conexão manualmente

### Performance Lenta
- Verifique se o banco tem índices adequados
- Considere executar em horários de baixo uso
- Monitore uso de CPU e memória

## 📚 Arquivos Relacionados

- **`src/scripts/import-models-from-csv.ts`** - Script principal de importação
- **`src/scripts/clear-models-direct.ts`** - Script de limpeza
- **`scripts/import-models-from-csv.js`** - Executável JavaScript
- **`scripts/clear-models-direct.js`** - Executável de limpeza
- **`src/utils/text.utils.ts`** - Utilitários de sanitização
- **`src/modules/models/`** - Módulo de modelos
- **`src/modules/marks/`** - Módulo de marcas
