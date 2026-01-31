# Sistema de Monitoramento de Pessoas

> Sistema completo de alertas e notificações multi-canal para monitoramento de pessoas com templates reutilizáveis.

## 🔙 [Voltar para Documentação Principal](README.md)

**Ver também**: [Estrutura do Banco de Dados - Seção 8: Sistema de Monitoramento](database-structure.md#8-sistema-de-monitoramento)

---

## Visão Geral

O Sistema de Monitoramento de Pessoas permite a criação e gerenciamento de alertas automáticos baseados em diferentes tipos de situações (mandados de prisão, listas de monitoramento, pessoas de interesse, etc.). O sistema utiliza templates de notificação reutilizáveis para envio por múltiplos canais (Push, SMS, WhatsApp, Email).

## Arquitetura

### Tabelas Principais

#### `person_monitoring_types`
Armazena os tipos de monitoramento disponíveis para cada cliente.

**Campos principais:**
- `name` - Nome curto do tipo (ex: "Mandado de Prisão")
- `description` - Descrição detalhada do tipo de monitoramento
- `priority` - Prioridade do alerta: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `color` - Cor hexadecimal para exibição visual
- `audio_file` - Nome do arquivo de áudio para alerta sonoro
- `generates_occurrence` - Se deve gerar ocorrência automaticamente
- `push_notification_id` - FK para template de notificação Push
- `sms_notification_id` - FK para template de notificação SMS
- `whatsapp_notification_id` - FK para template de notificação WhatsApp
- `email_notification_id` - FK para template de notificação Email

#### `person_monitoring_type_notifications`
Armazena templates de notificação reutilizáveis por canal.

**Campos principais:**
- `name` - Nome do template (ex: "Alerta de Pessoa Suspeita")
- `notification_channel` - Canal: `PUSH`, `SMS`, `WHATSAPP`, `EMAIL`
- `message_template` - Template com variáveis (ex: "Alerta: {{pessoa_nome}} detectado")
- `subject_template` - Template do assunto (apenas Email)
- `configuration` - JSON com configs específicas do canal
- `is_active` - Se o template está ativo

### Relacionamentos

```
Client (1) ─────< (N) PersonMonitoringTypeNotification
Client (1) ─────< (N) PersonMonitoringType
    │
    ├─> push_notification_id ──────> PersonMonitoringTypeNotification
    ├─> sms_notification_id ───────> PersonMonitoringTypeNotification
    ├─> whatsapp_notification_id ──> PersonMonitoringTypeNotification
    └─> email_notification_id ─────> PersonMonitoringTypeNotification
```

## Uso Básico

### 1. Criar Templates de Notificação

```php
use App\Models\Persons\PersonMonitoringTypeNotification;

// Template para notificação Push
$pushTemplate = PersonMonitoringTypeNotification::create([
    'uuid' => Str::uuid(),
    'client_id' => $clientId,
    'name' => 'Alerta de Mandado de Prisão',
    'notification_channel' => 'PUSH',
    'message_template' => '🚨 MANDADO DE PRISÃO - {{pessoa_nome}} foi detectado no equipamento {{equipamento_nome}} ({{placa}})',
    'configuration' => json_encode([
        'priority' => 'high',
        'sound' => 'alert_critical.mp3',
        'vibration' => [200, 100, 200]
    ]),
    'is_active' => true,
    'created_by' => auth()->id()
]);

// Template para SMS
$smsTemplate = PersonMonitoringTypeNotification::create([
    'uuid' => Str::uuid(),
    'client_id' => $clientId,
    'name' => 'SMS - Mandado de Prisão',
    'notification_channel' => 'SMS',
    'message_template' => 'ALERTA: {{pessoa_nome}} (CPF: {{cpf}}) detectado. Mandado de prisão ativo. Local: {{equipamento_nome}}',
    'is_active' => true,
    'created_by' => auth()->id()
]);

// Template para Email
$emailTemplate = PersonMonitoringTypeNotification::create([
    'uuid' => Str::uuid(),
    'client_id' => $clientId,
    'name' => 'Email - Mandado de Prisão',
    'notification_channel' => 'EMAIL',
    'subject_template' => '🚨 Alerta CRÍTICO: Pessoa com Mandado de Prisão Detectada',
    'message_template' => '<h2>Alerta de Mandado de Prisão</h2><p><strong>Pessoa:</strong> {{pessoa_nome}}</p><p><strong>CPF:</strong> {{cpf}}</p><p><strong>Local:</strong> {{equipamento_nome}}</p><p><strong>Placa:</strong> {{placa}}</p><p><strong>Data/Hora:</strong> {{data_hora}}</p>',
    'is_active' => true,
    'created_by' => auth()->id()
]);
```

### 2. Criar Tipo de Monitoramento

```php
use App\Models\Persons\PersonMonitoringType;

$monitoringType = PersonMonitoringType::create([
    'uuid' => Str::uuid(),
    'client_id' => $clientId,
    'name' => 'Mandado de Prisão',
    'description' => 'Pessoa com mandado de prisão ativo que deve ser detida imediatamente',
    'priority' => 'CRITICAL',
    'color' => '#dc2626',
    'audio_file' => 'alert_critical_warrant.mp3',
    'generates_occurrence' => true,
    'push_notification_id' => $pushTemplate->id,
    'sms_notification_id' => $smsTemplate->id,
    'whatsapp_notification_id' => $whatsappTemplate->id,
    'email_notification_id' => $emailTemplate->id,
    'is_active' => true,
    'created_by' => auth()->id()
]);
```

### 3. Renderizar Templates com Variáveis Reais

Quando uma pessoa é detectada, você deve substituir as variáveis do template pelos valores reais:

```php
// Dados da detecção
$detectionData = [
    'pessoa_nome' => 'João da Silva',
    'cpf' => '123.456.789-00',
    'equipamento_nome' => 'Câmera Entrada Principal',
    'placa' => 'ABC-1234',
    'data_hora' => now()->format('d/m/Y H:i:s')
];

// Buscar o tipo de monitoramento
$monitoringType = PersonMonitoringType::find($personMonitoringTypeId);

// Obter todas as notificações configuradas
$notifications = $monitoringType->getAllNotifications();

foreach ($notifications as $notification) {
    // Renderizar o template com as variáveis
    $message = $notification->renderTemplate($detectionData);
    
    // Para Email, também renderizar o subject
    if ($notification->isChannel('EMAIL')) {
        $subject = str_replace(
            array_map(fn($k) => "{{{$k}}}", array_keys($detectionData)),
            array_values($detectionData),
            $notification->subject_template
        );
    }
    
    // Enviar a notificação conforme o canal
    switch ($notification->notification_channel) {
        case 'PUSH':
            // Enviar notificação Push
            $this->sendPushNotification($message, $notification->configuration);
            break;
            
        case 'SMS':
            // Enviar SMS
            $this->sendSms($phoneNumber, $message);
            break;
            
        case 'WHATSAPP':
            // Enviar WhatsApp
            $this->sendWhatsApp($phoneNumber, $message);
            break;
            
        case 'EMAIL':
            // Enviar Email
            $this->sendEmail($email, $subject, $message);
            break;
    }
}
```

### 4. Métodos Úteis da Model

#### PersonMonitoringType

```php
// Verificar prioridade
if ($monitoringType->isCritical()) {
    // Ação imediata necessária
}

if ($monitoringType->isHigh()) {
    // Alta prioridade
}

// Verificar se tem notificações configuradas
if ($monitoringType->hasNotifications()) {
    // Enviar alertas
}

// Obter todas as notificações (remove nulls)
$activeNotifications = $monitoringType->getAllNotifications();

// Verificar se deve gerar alerta
if ($monitoringType->shouldAlert()) {
    // Dispara alertas
}
```

#### PersonMonitoringTypeNotification

```php
// Renderizar template
$message = $notification->renderTemplate([
    'pessoa_nome' => 'Maria Santos',
    'cpf' => '987.654.321-00'
]);

// Verificar canal
if ($notification->isChannel('EMAIL')) {
    // Lógica específica para email
}
```

## Variáveis de Template

### Variáveis Comuns

As seguintes variáveis podem ser usadas nos templates:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `{{pessoa_nome}}` | Nome completo da pessoa | "João da Silva" |
| `{{cpf}}` | CPF formatado | "123.456.789-00" |
| `{{equipamento_nome}}` | Nome do equipamento que detectou | "Câmera Entrada Principal" |
| `{{placa}}` | Placa do veículo | "ABC-1234" |
| `{{data_hora}}` | Data e hora da detecção | "23/12/2025 14:30:15" |
| `{{local}}` | Descrição do local | "Portaria Principal" |
| `{{observacao}}` | Observações sobre o monitoramento | "Suspeito de furto" |

### Adicionando Novas Variáveis

Para adicionar novas variáveis ao sistema:

1. **Certifique-se que o dado está disponível** no momento da detecção
2. **Use o padrão `{{nome_variavel}}`** no template
3. **Passe o valor no array** ao chamar `renderTemplate()`:

```php
$notification->renderTemplate([
    'pessoa_nome' => $person->full_name,
    'cpf' => $person->primary_document,
    'equipamento_nome' => $equipment->name,
    'placa' => $vehicle->plate,
    'data_hora' => now()->format('d/m/Y H:i:s'),
    // Novas variáveis
    'veiculo_modelo' => $vehicle->model->name,
    'veiculo_cor' => $vehicle->color->name,
    'velocidade' => $passage->speed . ' km/h',
    'direcao' => $passage->direction
]);
```

## Exemplo Completo: Service de Notificação

```php
<?php

namespace App\Services;

use App\Models\Persons\PersonMonitoringType;
use Illuminate\Support\Facades\Log;

/**
 * Service para envio de notificações de monitoramento de pessoas.
 *
 * @package App\Services
 * @author CCONet Team
 */
class PersonMonitoringNotificationService
{
    /**
     * Enviar todas as notificações para um tipo de monitoramento.
     *
     * @param int $monitoringTypeId ID do tipo de monitoramento
     * @param array $data Dados para substituição de variáveis
     * @return array Array com resultados do envio
     * @throws \RuntimeException Se o tipo de monitoramento não existir
     */
    public function sendNotifications(int $monitoringTypeId, array $data): array
    {
        try {
            $monitoringType = PersonMonitoringType::findOrFail($monitoringTypeId);
            
            if (!$monitoringType->shouldAlert()) {
                return ['success' => false, 'message' => 'Tipo de monitoramento inativo'];
            }
            
            $notifications = $monitoringType->getAllNotifications();
            $results = [];
            
            foreach ($notifications as $notification) {
                $message = $notification->renderTemplate($data);
                
                $result = match ($notification->notification_channel) {
                    'PUSH' => $this->sendPush($message, $notification->configuration),
                    'SMS' => $this->sendSms($data['phone'] ?? null, $message),
                    'WHATSAPP' => $this->sendWhatsApp($data['phone'] ?? null, $message),
                    'EMAIL' => $this->sendEmail(
                        $data['email'] ?? null,
                        $this->renderSubject($notification, $data),
                        $message
                    ),
                    default => ['success' => false, 'error' => 'Canal desconhecido']
                };
                
                $results[$notification->notification_channel] = $result;
            }
            
            return ['success' => true, 'results' => $results];
            
        } catch (\Exception $e) {
            Log::error('Erro ao enviar notificações de monitoramento', [
                'monitoring_type_id' => $monitoringTypeId,
                'error' => $e->getMessage()
            ]);
            
            throw new \RuntimeException('Falha ao enviar notificações: ' . $e->getMessage());
        }
    }
    
    /**
     * Renderizar subject do email com variáveis.
     *
     * @param \App\Models\Persons\PersonMonitoringTypeNotification $notification
     * @param array $data Dados para substituição
     * @return string Subject renderizado
     */
    protected function renderSubject($notification, array $data): string
    {
        if (empty($notification->subject_template)) {
            return 'Alerta de Monitoramento';
        }
        
        return str_replace(
            array_map(fn($k) => "{{{$k}}}", array_keys($data)),
            array_values($data),
            $notification->subject_template
        );
    }
    
    /**
     * Enviar notificação Push.
     *
     * @param string $message Mensagem renderizada
     * @param string|null $configuration Configurações do canal
     * @return array Resultado do envio
     */
    protected function sendPush(string $message, ?string $configuration): array
    {
        // Implementar integração com serviço de Push (Firebase, OneSignal, etc)
        return ['success' => true, 'channel' => 'PUSH'];
    }
    
    /**
     * Enviar SMS.
     *
     * @param string|null $phone Número do telefone
     * @param string $message Mensagem renderizada
     * @return array Resultado do envio
     */
    protected function sendSms(?string $phone, string $message): array
    {
        // Implementar integração com gateway SMS
        return ['success' => true, 'channel' => 'SMS'];
    }
    
    /**
     * Enviar mensagem WhatsApp.
     *
     * @param string|null $phone Número do telefone
     * @param string $message Mensagem renderizada
     * @return array Resultado do envio
     */
    protected function sendWhatsApp(?string $phone, string $message): array
    {
        // Implementar integração com WhatsApp Business API
        return ['success' => true, 'channel' => 'WHATSAPP'];
    }
    
    /**
     * Enviar email.
     *
     * @param string|null $email Endereço de email
     * @param string $subject Assunto do email
     * @param string $message Corpo do email (HTML)
     * @return array Resultado do envio
     */
    protected function sendEmail(?string $email, string $subject, string $message): array
    {
        // Implementar envio de email via Laravel Mail
        return ['success' => true, 'channel' => 'EMAIL'];
    }
}
```

## Índices de Performance

O sistema possui índices otimizados para consultas frequentes:

### `person_monitoring_types`
- `pmt_client_active_idx`: (`client_id`, `is_active`) - Buscar tipos ativos por cliente
- `pmt_client_priority_idx`: (`client_id`, `priority`, `is_active`) - Filtrar por prioridade

### `person_monitoring_type_notifications`
- `pmtn_client_channel_idx`: (`client_id`, `notification_channel`, `is_active`) - Buscar templates por canal
- `pmtn_client_active_idx`: (`client_id`, `is_active`) - Templates ativos do cliente

## Sincronização MongoDB

Ambas as models possuem Observers que sincronizam automaticamente os dados com MongoDB:
- `PersonMonitoringTypeObserver`
- `PersonMonitoringTypeNotificationObserver`

Os dados são armazenados nas collections:
- `person_monitoring_types`
- `person_monitoring_type_notifications`

## Seeding

Para popular o banco com dados de exemplo:

```bash
php artisan db:seed --class=PersonMonitoringTypeSeeder
```

O seeder cria:
- **11 templates** por cliente (3 SMS, 3 WhatsApp, 2 Email, 3 Push)
- **8 tipos de monitoramento** com prioridades e configurações realistas

## Boas Práticas

1. **Cache os tipos de monitoramento ativos** para evitar consultas repetidas
2. **Valide os dados** antes de renderizar templates
3. **Use filas** para envio assíncrono de notificações
4. **Log todas as notificações enviadas** para auditoria
5. **Implemente retry logic** para falhas de envio
6. **Respeite rate limits** dos provedores de notificação
7. **Permita que usuários configurem** quais canais desejam receber
8. **Teste templates** antes de ativar em produção

## Segurança

- ✅ Todas as queries usam Eloquent ORM (proteção contra SQL Injection)
- ✅ Audit trail completo (`created_by`, `updated_by`)
- ✅ Soft deletes habilitado
- ✅ Validação de input via Form Requests (recomendado)
- ✅ Templates armazenados no banco (não em código)
- ⚠️ **Sanitize HTML** nos templates de email para prevenir XSS
- ⚠️ **Valide números de telefone** antes de enviar SMS/WhatsApp
- ⚠️ **Rate limiting** para prevenir spam

## Troubleshooting

### Template não está renderizando variáveis
- Verifique se as variáveis estão no formato `{{nome_variavel}}`
- Confirme que o array passado para `renderTemplate()` contém as chaves corretas
- Use `dd()` para debug: `dd($notification->renderTemplate($data))`

### Notificações não estão sendo enviadas
- Verifique se `is_active = true` no tipo e nos templates
- Confirme que os FKs de notificação estão configurados
- Use `getAllNotifications()` para ver quais templates estão disponíveis
- Check logs: `tail -f storage/logs/laravel.log`

### Performance lenta em consultas
- Verifique se os índices estão criados: `SHOW INDEX FROM person_monitoring_types`
- Use `explain` para analisar queries: `DB::table('person_monitoring_types')->where(...)->explain()`
- Considere eager loading: `PersonMonitoringType::with(['pushNotification', 'smsNotification'])->get()`

## Próximos Passos

1. Implementar integrações reais com provedores de notificação
2. Criar dashboard para gerenciamento de templates
3. Adicionar histórico de notificações enviadas
4. Implementar preferências de notificação por usuário
5. Criar testes automatizados para templates
6. Adicionar suporte a anexos em emails
7. Implementar templates multi-idioma
