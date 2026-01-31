# Cloudflare Setup Guide

Guia completo para configurar Cloudflare na frente da aplicação Vehicle Passage Processing.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do DNS](#configuração-do-dns)
- [Configuração do SSL/TLS](#configuração-do-ssltls)
- [Configuração do Firewall](#configuração-do-firewall)
- [Page Rules](#page-rules)
- [Workers (Opcional)](#workers-opcional)
- [Nginx Reverse Proxy](#nginx-reverse-proxy)
- [Verificação](#verificação)
- [Troubleshooting](#troubleshooting)

---

## Visão Geral

Arquitetura com Cloudflare:

```
Internet → Cloudflare CDN → Nginx Reverse Proxy → Laravel Octane (Swoole)
           (SSL/TLS)        (Port 80)              (Port 8000)
```

**Benefícios:**
- ✅ SSL/TLS gratuito e automático
- ✅ CDN global com cache
- ✅ Proteção DDoS
- ✅ Web Application Firewall (WAF)
- ✅ Analytics e logs
- ✅ Rate limiting
- ✅ Bot protection

---

## Pré-requisitos

1. **Conta Cloudflare** (Free ou superior)
2. **Domínio registrado** (cconet.dev.br)
3. **Acesso ao servidor** com Docker
4. **Porta 80 liberada** no firewall
5. **Nginx rodando** como reverse proxy

---

## Configuração do DNS

### 1. Adicionar Domínio ao Cloudflare

1. Login em https://dash.cloudflare.com
2. Clique em "Add a Site"
3. Digite `cconet.dev.br`
4. Escolha o plano (Free é suficiente)
5. Cloudflare vai escanear seus registros DNS existentes

### 2. Configurar Nameservers

Cloudflare vai fornecer 2 nameservers:

```
名前サーバー 1: apollo.ns.cloudflare.com
名前サーバー 2: lucy.ns.cloudflare.com
```

**No seu registrador de domínio** (Registro.br, GoDaddy, etc.):
1. Acesse configurações do domínio `cconet.dev.br`
2. Altere nameservers para os fornecidos pelo Cloudflare
3. Aguarde propagação (pode levar até 24h, geralmente < 1h)

### 3. Adicionar Registro DNS

No painel Cloudflare → DNS → Records:

#### Registro Principal (Produção)
```
Type: A
Name: unidac
Content: [IP_DO_SERVIDOR]
Proxy status: Proxied (nuvem laranja) ✅
TTL: Auto
```

#### Registro de Desenvolvimento (Opcional)
```
Type: A
Name: unidac-dev
Content: [IP_DO_SERVIDOR]
Proxy status: Proxied (nuvem laranja) ✅
TTL: Auto
```

#### Registro Wildcard (Opcional - para múltiplos subdomínios)
```
Type: A
Name: *
Content: [IP_DO_SERVIDOR]
Proxy status: Proxied (nuvem laranja) ✅
TTL: Auto
```

**⚠️ Importante:**
- **Proxied (laranja)** = Cloudflare CDN ativo + proteção
- **DNS only (cinza)** = Apenas resolução DNS (sem CDN)

---

## Configuração do SSL/TLS

### 1. Modo SSL/TLS

Cloudflare → SSL/TLS → Overview:

**Escolha:** `Flexible` ou `Full (strict)` (recomendado)

#### Modos disponíveis:

| Modo | Client → Cloudflare | Cloudflare → Origin | Recomendação |
|------|---------------------|---------------------|--------------|
| **Off** | HTTP | HTTP | ❌ Nunca usar |
| **Flexible** | HTTPS | HTTP | ⚠️ OK para teste rápido |
| **Full** | HTTPS | HTTPS (any cert) | ✅ Bom |
| **Full (strict)** | HTTPS | HTTPS (valid cert) | ✅✅ Melhor |

**Recomendação:** Use `Full (strict)` com Cloudflare Origin Certificate

### 2. Gerar Cloudflare Origin Certificate

Para usar `Full (strict)`, gere um certificado origin:

1. Cloudflare → SSL/TLS → Origin Server
2. Clique em "Create Certificate"
3. Configurações:
   - **Key type:** RSA
   - **Hostnames:** 
     - `unidac.cconet.dev.br`
     - `*.cconet.dev.br` (wildcard)
   - **Validity:** 15 years
4. Clique em "Create"

Cloudflare vai gerar:
- **Origin Certificate** (salvар como `origin-cert.pem`)
- **Private Key** (salvar como `origin-key.pem`)

⚠️ **Importante:** Salve esses arquivos imediatamente, não podem ser recuperados!

### 3. Instalar Certificado no Servidor

```bash
# Criar diretório para certificados
mkdir -p /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl

# Copiar certificados (substitua pelo conteúdo real)
cat > /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl/origin-cert.pem <<'EOF'
-----BEGIN CERTIFICATE-----
[COLE O CERTIFICADO AQUI]
-----END CERTIFICATE-----
EOF

cat > /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl/origin-key.pem <<'EOF'
-----BEGIN PRIVATE KEY-----
[COLE A CHAVE PRIVADA AQUI]
-----END PRIVATE KEY-----
EOF

# Ajustar permissões
chmod 600 /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl/*.pem
```

### 4. Atualizar Configuração Nginx para HTTPS

Edite `/docker/nginx/unidac.cconet.dev.br.conf`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name unidac.cconet.dev.br;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name unidac.cconet.dev.br;

    # Cloudflare Origin Certificate
    ssl_certificate /etc/nginx/ssl/origin-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/origin-key.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # ... resto da configuração igual
}
```

### 5. Configurações Adicionais SSL/TLS

#### Always Use HTTPS
Cloudflare → SSL/TLS → Edge Certificates → Always Use HTTPS: **ON**

#### Automatic HTTPS Rewrites
Cloudflare → SSL/TLS → Edge Certificates → Automatic HTTPS Rewrites: **ON**

#### Minimum TLS Version
Cloudflare → SSL/TLS → Edge Certificates → Minimum TLS Version: **TLS 1.2**

#### Opportunistic Encryption
Cloudflare → SSL/TLS → Edge Certificates → Opportunistic Encryption: **ON**

#### TLS 1.3
Cloudflare → SSL/TLS → Edge Certificates → TLS 1.3: **ON**

---

## Configuração do Firewall

### 1. Cloudflare Firewall Rules

Cloudflare → Security → WAF:

#### Regra 1: Permitir apenas IPs do Brasil (Opcional)
```
Field: Country
Operator: does not equal
Value: BR
Action: Challenge (Captcha)
```

#### Regra 2: Bloquear bots maliciosos
```
Field: Threat Score
Operator: greater than
Value: 10
Action: Block
```

#### Regra 3: Rate Limiting API
```
Field: URI Path
Operator: starts with
Value: /api/
Rate: 100 requests per 1 minute
Action: Block for 60 seconds
```

### 2. IP Access Rules

Cloudflare → Security → WAF → Tools → IP Access Rules:

**Whitelist IPs confiáveis:**
```
IP: [SEU_IP_ESCRITORIO]
Action: Whitelist
```

**Blacklist IPs maliciosos:**
```
IP: [IP_MALICIOSO]
Action: Block
```

### 3. Firewall do Servidor (UFW/iptables)

**Permitir APENAS Cloudflare IPs:**

```bash
# Instalar UFW
apt install ufw -y

# Regras padrão
ufw default deny incoming
ufw default allow outgoing

# SSH (alterar porta se necessário)
ufw allow 22/tcp

# HTTP/HTTPS apenas de Cloudflare
# Lista atualizada: https://www.cloudflare.com/ips/

# IPv4
ufw allow from 173.245.48.0/20 to any port 80 proto tcp
ufw allow from 103.21.244.0/22 to any port 80 proto tcp
ufw allow from 103.22.200.0/22 to any port 80 proto tcp
ufw allow from 103.31.4.0/22 to any port 80 proto tcp
ufw allow from 141.101.64.0/18 to any port 80 proto tcp
ufw allow from 108.162.192.0/18 to any port 80 proto tcp
ufw allow from 190.93.240.0/20 to any port 80 proto tcp
ufw allow from 188.114.96.0/20 to any port 80 proto tcp
ufw allow from 197.234.240.0/22 to any port 80 proto tcp
ufw allow from 198.41.128.0/17 to any port 80 proto tcp
ufw allow from 162.158.0.0/15 to any port 80 proto tcp
ufw allow from 104.16.0.0/13 to any port 80 proto tcp
ufw allow from 104.24.0.0/14 to any port 80 proto tcp
ufw allow from 172.64.0.0/13 to any port 80 proto tcp
ufw allow from 131.0.72.0/22 to any port 80 proto tcp

# Habilitar UFW
ufw enable
ufw status verbose
```

---

## Page Rules

Cloudflare → Rules → Page Rules:

### Regra 1: Cache API Responses (Selectivo)
```
URL: unidac.cconet.dev.br/api/v1/countries*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 hour
```

### Regra 2: Bypass cache para autenticação
```
URL: unidac.cconet.dev.br/api/v1/login*
Settings:
  - Cache Level: Bypass
```

### Regra 3: Security Level High para admin
```
URL: unidac.cconet.dev.br/admin/*
Settings:
  - Security Level: High
  - Browser Integrity Check: On
```

---

## Nginx Reverse Proxy

### 1. Adicionar Nginx ao Docker Compose

Edite `docker-compose-dev.yml` (ou `docker-compose.yml` para produção):

```yaml
services:
  # ... outros serviços

  nginx:
    build:
      context: ./docker/nginx
      dockerfile: Dockerfile
    container_name: vehicle_passages_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/unidac.cconet.dev.br.conf:/etc/nginx/conf.d/default.conf:ro
      - ./docker/nginx/ssl:/etc/nginx/ssl:ro
      - /var/log/nginx:/var/log/nginx
    networks:
      - dev-stack
    depends_on:
      - app
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/api/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

networks:
  dev-stack:
    driver: bridge
```

### 2. Iniciar Stack com Nginx

```bash
# Build e start
docker-compose -f docker-compose-dev.yml up -d --build nginx

# Verificar status
docker-compose -f docker-compose-dev.yml ps nginx

# Ver logs
docker-compose -f docker-compose-dev.yml logs -f nginx
```

### 3. Testar Localmente

```bash
# Adicionar entrada no /etc/hosts (desenvolvimento)
echo "127.0.0.1 unidac.cconet.dev.br" | sudo tee -a /etc/hosts

# Testar
curl -H "Host: unidac.cconet.dev.br" http://localhost/api/health
```

---

## Verificação

### 1. DNS Propagação

```bash
# Verificar resolução DNS
dig unidac.cconet.dev.br +short
nslookup unidac.cconet.dev.br

# Deve retornar IPs do Cloudflare, não seu servidor!
```

### 2. SSL/TLS

```bash
# Verificar certificado
openssl s_client -connect unidac.cconet.dev.br:443 -servername unidac.cconet.dev.br

# Teste online
https://www.ssllabs.com/ssltest/analyze.html?d=unidac.cconet.dev.br
```

### 3. Headers Cloudflare

```bash
# Verificar headers CF
curl -I https://unidac.cconet.dev.br

# Deve conter:
# cf-ray: ...
# cf-cache-status: ...
# server: cloudflare
```

### 4. Real IP

Verifique se Laravel recebe o IP real do client:

```php
// No controller
dd(request()->ip());

// Deve retornar IP real do cliente, não IP do Cloudflare
```

No Nginx, já está configurado:
```nginx
real_ip_header CF-Connecting-IP;
```

### 5. Health Check

```bash
# Teste direto
curl https://unidac.cconet.dev.br/api/health

# Deve retornar 200 OK
```

---

## Troubleshooting

### Erro 520: Web Server Returned an Unknown Error

**Causa:** Servidor origin não responde ou erro no Nginx

**Solução:**
```bash
# Verificar logs Nginx
docker-compose -f docker-compose-dev.yml logs nginx

# Verificar app está rodando
docker-compose -f docker-compose-dev.yml ps app

# Testar diretamente no servidor
curl http://localhost:8000/api/health
```

### Erro 521: Web Server Is Down

**Causa:** Nginx/app não está rodando ou porta bloqueada

**Solução:**
```bash
# Verificar containers
docker-compose -f docker-compose-dev.yml ps

# Verificar porta 80 liberada
netstat -tulpn | grep :80

# Verificar firewall
ufw status
```

### Erro 522: Connection Timed Out

**Causa:** Firewall bloqueando Cloudflare IPs

**Solução:**
```bash
# Adicionar Cloudflare IPs ao firewall (veja seção Firewall)

# Testar conexão do Cloudflare
curl -H "CF-Connecting-IP: 1.2.3.4" http://[SEU_IP]:80/api/health
```

### Erro 523: Origin Is Unreachable

**Causa:** DNS incorreto ou servidor fora do ar

**Solução:**
```bash
# Verificar DNS no Cloudflare
# IP deve estar correto

# Verificar servidor está online
ping [IP_DO_SERVIDOR]

# Verificar porta 80 acessível
telnet [IP_DO_SERVIDOR] 80
```

### Erro 525: SSL Handshake Failed

**Causa:** Problema com certificado origin ou modo SSL incorreto

**Solução:**
```bash
# Verificar modo SSL no Cloudflare (deve ser Full ou Full strict)

# Verificar certificado origin instalado
ls -la /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl/

# Testar SSL localmente
openssl s_client -connect localhost:443 -servername unidac.cconet.dev.br
```

### IP Real do Cliente não aparece

**Causa:** Nginx não está lendo CF-Connecting-IP

**Solução:**
```nginx
# Adicionar no nginx.conf
set_real_ip_from [CLOUDFLARE_IP_RANGES];
real_ip_header CF-Connecting-IP;
```

**Laravel Trust Proxies:**

Edite `app/Http/Middleware/TrustProxies.php`:

```php
protected $proxies = '*'; // Confia em todos os proxies

protected $headers =
    Request::HEADER_X_FORWARDED_FOR |
    Request::HEADER_X_FORWARDED_HOST |
    Request::HEADER_X_FORWARDED_PORT |
    Request::HEADER_X_FORWARDED_PROTO |
    Request::HEADER_X_FORWARDED_AWS_ELB;
```

### Cache não está funcionando

**Solução:**
```bash
# Purge cache no Cloudflare
# Dashboard → Caching → Configuration → Purge Everything

# Verificar headers
curl -I https://unidac.cconet.dev.br/api/v1/countries
# Procure por: cf-cache-status: HIT (cache funcionando)
```

### Rate Limiting muito agressivo

**Solução:**
```
# Cloudflare → Security → WAF → Rate limiting rules
# Ajuste os limites ou adicione IPs à whitelist
```

---

## Otimizações Cloudflare

### 1. Speed Optimizations

**Auto Minify:**
Cloudflare → Speed → Optimization:
- JavaScript: ON
- CSS: ON
- HTML: ON

**Brotli Compression:**
Cloudflare → Speed → Optimization → Brotli: ON

**Early Hints:**
Cloudflare → Speed → Optimization → Early Hints: ON

**Rocket Loader:**
Cloudflare → Speed → Optimization → Rocket Loader: OFF (pode quebrar apps)

### 2. Caching

**Caching Level:**
Cloudflare → Caching → Configuration → Caching Level: Standard

**Browser Cache TTL:**
Cloudflare → Caching → Configuration → Browser Cache TTL: Respect Existing Headers

**Always Online:**
Cloudflare → Caching → Configuration → Always Online: ON

### 3. Network

**HTTP/2:**
Cloudflare → Network → HTTP/2: ON

**HTTP/3 (QUIC):**
Cloudflare → Network → HTTP/3 (with QUIC): ON

**0-RTT Connection Resumption:**
Cloudflare → Network → 0-RTT Connection Resumption: ON

**WebSockets:**
Cloudflare → Network → WebSockets: ON

---

## Monitoramento

### Cloudflare Analytics

Dashboard → Analytics:
- **Traffic:** Visualizar requisições, bandwidth, ameaças
- **Performance:** Cache hit rate, response times
- **Security:** Eventos de segurança, bloqueios

### Logs

**Logpush (Enterprise only):**
Cloudflare → Analytics → Logs → Logpush

**Alternativa Free:**
- Use logs do Nginx
- Analise CF-Ray headers
- Monitore via Cloudflare dashboard

### Alertas

**Cloudflare Notifications:**
1. Cloudflare → Notifications
2. Configurar alertas para:
   - Downtime do origin
   - Aumento de tráfego
   - Ataques DDoS
   - Erros SSL

---

## Checklist de Deploy

- [ ] Domínio adicionado ao Cloudflare
- [ ] Nameservers atualizados no registrador
- [ ] Registro DNS A criado (proxied)
- [ ] SSL/TLS configurado (Full strict)
- [ ] Cloudflare Origin Certificate instalado
- [ ] Nginx configurado como reverse proxy
- [ ] Firewall permite apenas Cloudflare IPs
- [ ] Page Rules configuradas
- [ ] WAF rules ativas
- [ ] Health check funcionando
- [ ] SSL Labs scan = A ou A+
- [ ] IP real do cliente visível no Laravel
- [ ] Cache funcionando (cf-cache-status: HIT)
- [ ] Logs configurados
- [ ] Alertas configurados

---

## Referências

- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Cloudflare SSL/TLS Documentation](https://developers.cloudflare.com/ssl/)
- [Cloudflare WAF Documentation](https://developers.cloudflare.com/waf/)
- [Cloudflare IP Ranges](https://www.cloudflare.com/ips/)
- [Nginx + Cloudflare Guide](https://support.cloudflare.com/hc/en-us/articles/200170786)
- [Laravel Trust Proxies](https://laravel.com/docs/12.x/requests#configuring-trusted-proxies)

---

**Última atualização:** 13 de Janeiro de 2026  
**Versão:** 1.0.0
