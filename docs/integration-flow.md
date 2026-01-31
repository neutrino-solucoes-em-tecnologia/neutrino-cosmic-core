# Fluxo de Processo de Integrações

**Projeto**: Vehicle Passage Processing Microservice - CCONet  
**Versão**: 1.0  
**Data**: 28/01/2026  

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Integrações](#arquitetura-de-integrações)
3. [Fluxo de Processamento](#fluxo-de-processamento)
4. [Tipos de Integração](#tipos-de-integração)
5. [Integrações Necessárias](#integrações-necessárias)
6. [Configuração e Deployment](#configuração-e-deployment)

---

## Visão Geral

O sistema de integrações permite que passagens de veículos detectadas sejam enviadas automaticamente para múltiplas APIs externas e sistemas internos de acordo com as configurações de cada cliente.

### Características Principais

- ✅ **Multi-tenant**: Cada cliente pode ter suas próprias integrações
- ✅ **Configurável**: Integrações ativadas/desativadas via banco de dados
- ✅ **Escalável**: Suporta múltiplas integrações simultâneas
- ✅ **Resiliente**: Retry automático com backoff exponencial
- ✅ **Auditável**: Logs completos de todas as tentativas
- ✅ **Flexível**: Suporta integrações locais e externas

---

## Arquitetura de Integrações

### Componentes do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      VEHICLE PASSAGE CREATED                     │
│                    (via Observer/Controller)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CheckIntegrations Service                      │
│                        (Orquestrador)                            │
│                                                                  │
│  1. Carrega Client com integrações ativas (eager loading)       │
│  2. Para cada integração:                                        │
│     - Verifica se está ativa                                     │
│     - Roteia para processador apropriado                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌──────────────────────┐    ┌──────────────────────┐
│  LOCAL INTEGRATION   │    │ EXTERNAL INTEGRATION │
│   (Processamento     │    │    (API Externa)     │
│      Interno)        │    │                      │
└──────────────────────┘    └──────────────────────┘
         │                           │
         ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│  - Redis             │    │  - HTTP Request      │
│  - MongoDB           │    │  - Retry Logic       │
│  - Filas             │    │  - Error Handling    │
│  - Análises          │    │  - Response Log      │
└──────────────────────┘    └──────────────────────┘
         │                           │
         └────────────┬──────────────┘
                      ▼
         ┌────────────────────────┐
         │   LOG & AUDIT TRAIL    │
         │  (MySQL + MongoDB)     │
         └────────────────────────┘
```

### Modelo de Dados

#### Tabela `client_integrations`
```sql
CREATE TABLE client_integrations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    client_id BIGINT UNSIGNED NOT NULL,
    active BOOLEAN DEFAULT FALSE,
    integration_name VARCHAR(255) NOT NULL,
    integration_type ENUM('local', 'external') NOT NULL,
    settings JSON NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
```

#### Estrutura do campo `settings` (JSON)

**Para integrações EXTERNAL:**
```json
{
  "webhook_url": "https://api.example.com/endpoint",
  "auth_token": "bearer_token_here",
  "auth_type": "bearer|header|query",
  "headers": {
    "X-Custom-Header": "value"
  },
  "timeout": 30,
  "retry": 3,
  "retry_delay": 100,
  "payload_format": "pmpr|cortex|detecta|custom"
}
```

**Para integrações LOCAL:**
```json
{
  "redis_key": "vehicle_analitics_trafficeye",
  "mongodb_collection": "behavioral_passages",
  "queue_name": "ai-processing",
  "enabled_features": ["clone_detection", "behavior_analysis"]
}
```

---

## Fluxo de Processamento

### 1. Detecção da Passagem

```
Câmera LPR detecta veículo
         ↓
Sistema OCR processa imagem
         ↓
VehiclePassage criado no banco
         ↓
Observer/Event dispara processamento
```

### 2. Verificação de Integrações

```php
// app/Services/Clients/CheckIntegrations.php

public function check(VehiclePassage $vehiclePassage): ?array
{
    // 1. Carrega cliente com integrações ativas
    $client = $vehiclePassage->client()
        ->with(['integrations' => function ($query) {
            $query->where('active', true);
        }])
        ->first();

    // 2. Verifica se tem integrações
    if (!$client || $client->integrations->isEmpty()) {
        return null;
    }

    // 3. Processa cada integração
    $results = [];
    foreach ($client->integrations as $integration) {
        $results[] = $this->processIntegration($integration, $vehiclePassage);
    }

    return $results;
}
```

### 3. Roteamento por Tipo

```php
protected function processIntegration(ClientIntegration $integration, VehiclePassage $vehiclePassage): array
{
    return match ($integration->integration_type) {
        'local' => $this->processLocalIntegration($integration, $vehiclePassage),
        'external' => $this->processExternalIntegration($integration, $vehiclePassage),
        default => ['status' => 'error', 'message' => 'Unknown integration type'],
    };
}
```

### 4. Processamento Local

```php
protected function processLocalIntegration(ClientIntegration $integration, VehiclePassage $vehiclePassage): array
{
    $result = match ($integration->integration_name) {
        'TrafficEye' => app(TrafficEyeService::class)->handlePassage($vehiclePassage),
        'BehavioralAnalysis' => app(BehavioralAnalysisService::class)->handlePassage($vehiclePassage),
        'ClonedPlatesDetection' => app(ClonedPlatesService::class)->handlePassage($vehiclePassage),
        'AIProcessing' => app(AIProcessingService::class)->handlePassage($vehiclePassage),
        default => throw new \Exception("Unknown local integration"),
    };

    return [
        'status' => 'success',
        'type' => 'local',
        'integration_name' => $integration->integration_name,
        'result' => $result,
    ];
}
```

### 5. Processamento External

```php
protected function processExternalIntegration(ClientIntegration $integration, VehiclePassage $vehiclePassage): array
{
    $settings = $integration->settings;
    
    // Constrói payload específico
    $payload = $this->buildPayload($integration->integration_name, $vehiclePassage, $settings);
    
    // Constrói headers
    $headers = $this->buildHeaders($integration, $settings);
    
    // Envia HTTP request com retry
    $response = Http::timeout($settings['timeout'] ?? 30)
        ->retry($settings['retry'] ?? 3, $settings['retry_delay'] ?? 100)
        ->withHeaders($headers)
        ->post($settings['webhook_url'], $payload);
    
    return [
        'status' => $response->successful() ? 'success' : 'failed',
        'type' => 'external',
        'integration_name' => $integration->integration_name,
        'http_status' => $response->status(),
        'response' => $response->json(),
    ];
}
```

### 6. Construção de Payload

```php
protected function buildPayload(string $integrationName, VehiclePassage $vehiclePassage, array $settings): array
{
    return match ($integrationName) {
        'PMPR' => app(PMPRPayloadBuilder::class)->build($vehiclePassage, $settings),
        'CORTEX' => app(CortexPayloadBuilder::class)->build($vehiclePassage, $settings),
        'DETECTA' => app(DetectaPayloadBuilder::class)->build($vehiclePassage, $settings),
        'HELIOS' => app(HeliosPayloadBuilder::class)->build($vehiclePassage, $settings),
        'PRF' => app(PRFPayloadBuilder::class)->build($vehiclePassage, $settings),
        'PRFSP' => app(PRFSPPayloadBuilder::class)->build($vehiclePassage, $settings),
        'INFOCAR' => app(InfocarPayloadBuilder::class)->build($vehiclePassage, $settings),
        'METROPOLYS' => app(MetropolysPayloadBuilder::class)->build($vehiclePassage, $settings),
        default => $vehiclePassage->toArray(),
    };
}
```

---

## Tipos de Integração

### Local Integration (Processamento Interno)

**Características:**
- Não faz chamadas HTTP externas
- Processa dados internamente
- Mais rápido e confiável
- Usado para análises, caching, filas

**Exemplos:**
1. **TrafficEye**: Envia para Redis para analytics
2. **Behavioral Analysis**: Analisa padrões de comportamento
3. **Cloned Plates Detection**: Detecta placas clonadas
4. **AI Processing**: Envia para fila de processamento IA

**Implementação:**
```php
// app/Services/Integrations/TrafficEyeService.php
class TrafficEyeService
{
    protected RedisService $redisService;

    public function handlePassage(VehiclePassage $vehiclePassage): bool
    {
        $analyticsKey = config('integrations.trafficeye.redis_key');
        
        $this->redisService->rpush(
            $analyticsKey, 
            json_encode($vehiclePassage->toArray()),
            withoutPrefix: true
        );
        
        return true;
    }
}
```

### External Integration (API Externa)

**Características:**
- Envia dados via HTTP para APIs externas
- Configuração via `settings` JSON
- Retry automático com backoff
- Timeout configurável

**Exemplos:**
1. **PMPR**: Polícia Militar do Paraná
2. **CORTEX**: Azure Service Bus
3. **DETECTA**: Segurança SP
4. **HELIOS**: Polícia Militar MG
5. **PRF/PRFSP**: Polícia Rodoviária Federal

**Implementação:**
```php
// app/Services/Integrations/PayloadBuilders/PMPRPayloadBuilder.php
class PMPRPayloadBuilder
{
    public function build(VehiclePassage $vehiclePassage, array $settings): array
    {
        return [
            'placa' => $vehiclePassage->plate,
            'grauFidelidade' => (string) $vehiclePassage->confidence_score,
            'velocidade' => $vehiclePassage->speed ?? '',
            'dataRegistro' => $vehiclePassage->passed_at->format('d/m/Y H:i:s'),
            'dataCamera' => $vehiclePassage->camera_date->format('d/m/Y H:i:s'),
            'latitude' => (string) $vehiclePassage->latitude,
            'longitude' => (string) $vehiclePassage->longitude,
            'arquivo' => $this->getBase64Image($vehiclePassage),
        ];
    }
    
    protected function getBase64Image(VehiclePassage $vehiclePassage): string
    {
        // Busca primeira imagem da passagem
        $image = $vehiclePassage->passage_images->first();
        
        if (!$image) {
            return '';
        }
        
        // Se já está em base64, retorna
        if ($image->base64_content) {
            return $image->base64_content;
        }
        
        // Se é URL, baixa e converte
        if ($image->url) {
            $content = file_get_contents($image->url);
            return base64_encode($content);
        }
        
        return '';
    }
}
```

---

## Integrações Necessárias

### Sprint 1: Alta Prioridade - APIs Críticas (26 SP)

#### 1. PMPR - Polícia Militar do Paraná (8 SP)
- **Tipo**: External
- **Endpoint**: `https://apigateway.paas.pr.gov.br/sesp/lpr-detecta/api/v2/detecta`
- **Método**: POST
- **Autenticação**: Authorization header + Camera identifier
- **Payload**: Placa, coordenadas, fidelidade, velocidade, imagem BASE64
- **Formato Data**: `dd/mm/yyyy HH:mm:ss`

#### 2. CORTEX V2 - Azure Service Bus (10 SP)
- **Tipo**: External
- **Endpoint**: `https://cortexveiculos.servicebus.windows.net/cpn/messages?timeout=5`
- **Método**: POST
- **Autenticação**: SharedAccessSignature
- **Payload**: Placa, dataHoraLocal, coordenadas, codigoLocal, idMovimento, imagem BASE64
- **Formato Data**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss`)

#### 3. DETECTA - Segurança SP (8 SP)
- **Tipo**: External
- **Endpoint**: `https://segurancasp.servicebus.windows.net/cconet/messages`
- **Método**: POST
- **Autenticação**: SharedAccessSignature
- **Payload**: Placa, dataHoraLocal, codigoLocal, imagem BASE64
- **Formato Data**: ISO 8601

---

### Sprint 2: Alta Prioridade - Continuação (23 SP)

#### 4. HELIOS - Polícia Militar MG (8 SP)
- **Tipo**: External
- **Endpoint**: `https://helios.policiamilitar.mg.gov.br/v3/api/_track/register`
- **Método**: POST
- **Autenticação**: JWT Bearer Token
- **Payload**: Campos abreviados (cam, plc, dat, img)
- **Formato Data**: ISO 8601
- **Observação**: Token JWT expira, precisa refresh

#### 5. PRF - Polícia Rodoviária Federal (10 SP)
- **Tipo**: External
- **Endpoint**: `https://spiaeventos.servicebus.windows.net/stream05/messages`
- **Método**: POST
- **Autenticação**: SharedAccessSignature
- **Payload**: Placa, dataHoraTz (com timezone), camera (numero, lat, lng), empresa, key
- **Formato Data**: ISO 8601 com timezone (`-03:00`)

#### 6. Passagens Genérico (5 SP)
- **Tipo**: Local
- **Processamento**: Armazenamento MySQL + MongoDB
- **Payload**: Estrutura simplificada para novos clientes
- **Uso**: Base para clientes sem integração específica

---

### Sprint 3: Alta/Média Prioridade (26 SP)

#### 7. PRFSP - PRF São Paulo (10 SP)
- **Tipo**: External
- **Endpoint**: `https://spiaeventos.servicebus.windows.net/stream05/messages` (mesmo da PRF)
- **Método**: POST
- **Autenticação**: SharedAccessSignature (compartilhada com PRF)
- **Payload**: Similar à PRF mas com imagem BASE64 incluída
- **Diferença**: Específico para São Paulo, inclui imagem

#### 8. Placas Clonadas (8 SP)
- **Tipo**: Local
- **Processamento**: Correlação retroativa + Alertas
- **Armazenamento**: MySQL `cloned_plates` + MongoDB
- **Funcionalidade**: Busca histórico, detecta padrões suspeitos, gera alertas

#### 9. INFOCAR (8 SP)
- **Tipo**: External
- **Endpoint**: `http://infocar.fusioncenter.com.br/api/v1/EnviarImagemLocalizacao`
- **Método**: POST
- **Autenticação**: Chave base64
- **Payload**: dado, tipo (PLACA), data_evento, coordenadas, origem (CCONET), URL, chave, img1

---

### Sprint 4: Média Prioridade (24 SP)

#### 10. METROPOLYS (10 SP)
- **Tipo**: External
- **Endpoint**: `https://sjp.metropolys.cloud/api/{api_key}/integration/ingest`
- **Método**: POST
- **Autenticação**: API Key no path
- **Payload**: Estrutura aninhada (type + data), foto via URL externa
- **Formato**: `type: "cconet.com.br:passagem"`

#### 11. Passagens IA (6 SP)
- **Tipo**: Local
- **Processamento**: Fila de processamento + Download de imagem
- **Armazenamento**: MongoDB `ai_passages`
- **Funcionalidade**: Processa foto_url externa, envia para análise IA

#### 12. TrafficEye (8 SP)
- **Tipo**: Local (já implementado parcialmente)
- **Processamento**: Redis analytics
- **Funcionalidade**: Análise de tráfego em tempo real
- **Melhorias**: Adicionar validações e métricas

---

### Sprint 5: Finalização (5 SP)

#### 13. Passagem Comportamental (5 SP)
- **Tipo**: Local
- **Processamento**: Análise comportamental
- **Armazenamento**: MongoDB `behavioral_passages`
- **Funcionalidade**: Detecta padrões, veículos frequentes, rotas suspeitas

---

## Configuração e Deployment

### 1. Variáveis de Ambiente

Adicionar no `.env`:

```env
# PMPR Integration
PMPR_AUTH_TOKEN=7f0ec4f584fe2170b69dc1697c2fb475
PMPR_CAMERA_ID=GMPG_77770109151
PMPR_WEBHOOK_URL=https://apigateway.paas.pr.gov.br/sesp/lpr-detecta/api/v2/detecta

# CORTEX Integration
CORTEX_SAS_TOKEN=SharedAccessSignature_sr=cortexveiculos.servicebus.windows.net...
CORTEX_SERVICE_BUS_URL=https://cortexveiculos.servicebus.windows.net/cpn/messages

# DETECTA Integration
DETECTA_SAS_TOKEN=SharedAccessSignature_sr=segurancasp.servicebus.windows.net...
DETECTA_SERVICE_BUS_URL=https://segurancasp.servicebus.windows.net/cconet/messages

# HELIOS Integration
HELIOS_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HELIOS_API_URL=https://helios.policiamilitar.mg.gov.br/v3/api/_track/register
HELIOS_TOKEN_REFRESH_URL=https://helios.policiamilitar.mg.gov.br/v3/api/auth/refresh

# PRF/PRFSP Integration
PRF_SAS_TOKEN=SharedAccessSignature_sr=spiaeventos.servicebus.windows.net...
PRF_SERVICE_BUS_URL=https://spiaeventos.servicebus.windows.net/stream05/messages
PRF_EMPRESA=CPN INFORMATICA
PRF_KEY=B3611754FE98A388DB813F9A0F3022

# INFOCAR Integration
INFOCAR_API_URL=http://infocar.fusioncenter.com.br/api/v1/EnviarImagemLocalizacao
INFOCAR_CHAVE=QTdwajMxUzpUNjhzVmE0Mng=
INFOCAR_URL_CONSULTA=http://fdatacast.com/GetDadosV1/Dados.asmx

# METROPOLYS Integration
METROPOLYS_API_URL=https://sjp.metropolys.cloud/api/{api_key}/integration/ingest
METROPOLYS_API_KEY=bcafa5f9-ae74-4202-9509-ddab4972c555

# Local Integrations
TRAFFICEYE_REDIS_KEY=vehicle_analitics_trafficeye
BEHAVIORAL_MONGODB_COLLECTION=behavioral_passages
AI_QUEUE_NAME=ai-processing
CLONED_PLATES_ALERT_EMAIL=alerts@cconet.com
```

### 2. Seed de Integrações

```bash
php artisan db:seed --class=ClientIntegrationSeeder
```

### 3. Testes

```bash
# Testar integração específica
php artisan test --filter=PMPRIntegrationTest

# Testar todas as integrações
php artisan test tests/Feature/Integrations/

# Testar orquestrador
php artisan test tests/Unit/Services/Clients/CheckIntegrationsTest.php
```

### 4. Monitoramento

**Métricas a acompanhar:**
- Taxa de sucesso por integração
- Tempo médio de resposta
- Total de tentativas de retry
- Taxa de erros por tipo (timeout, 4xx, 5xx)
- Volume de passagens por integração

**Logs estruturados:**
```php
Log::info('Integration processed', [
    'integration_id' => $integration->id,
    'integration_name' => $integration->integration_name,
    'vehicle_passage_id' => $vehiclePassage->id,
    'status' => $result['status'],
    'http_status' => $result['http_status'] ?? null,
    'processing_time_ms' => $processingTime,
    'timestamp' => now()->toIso8601String(),
]);
```

---

## Resumo

### Totais do Projeto
- **13 Integrações**
- **104 Story Points**
- **166 horas estimadas**
- **5 Sprints**

### Tipos de Integração
- **External**: 9 integrações (APIs externas via HTTP)
- **Local**: 4 integrações (processamento interno)

### Tecnologias Utilizadas
- **Laravel 12**: Framework principal
- **MySQL**: Configurações e tracking
- **MongoDB**: Payloads e analytics
- **Redis**: Cache e filas
- **Azure Service Bus**: CORTEX, DETECTA, PRF/PRFSP
- **JWT**: HELIOS authentication
- **HTTP Client**: Guzzle/Laravel HTTP

---

**Documentação Relacionada:**
- [Estrutura Segmentada de Mensagens](integrations-concept/structure_documentation.md)
- [Tasks do Azure DevOps](integrations-concept/AZURE_DEVOPS_TASKS.md)
- [Exemplos de Payloads](integrations-concept/)
