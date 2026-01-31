# Quick Start - Cloudflare + Nginx Setup

Passos rápidos para colocar a aplicação no ar com Cloudflare.

## 1. No Servidor (Ubuntu)

```bash
# 1. Criar diretório SSL (certificados virão do Cloudflare)
mkdir -p /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl

# 2. Build e start com Nginx
docker-compose -f docker-compose-dev.yml up -d --build nginx

# 3. Verificar serviços
docker-compose -f docker-compose-dev.yml ps
```

## 2. No Cloudflare Dashboard

### DNS (https://dash.cloudflare.com)

1. **Add Site:** `cconet.dev.br`
2. **Change Nameservers** no registrador do domínio
3. **Add DNS Record:**
   ```
   Type: A
   Name: unidac
   Content: [IP_DO_SERVIDOR]
   Proxy: ON (nuvem laranja) ✅
   ```

### SSL/TLS

1. **SSL/TLS Mode:** `Flexible` (temporário para testar)
2. **Always Use HTTPS:** ON
3. **Automatic HTTPS Rewrites:** ON

## 3. Testar

```bash
# Aguardar 1-2 minutos para propagação DNS
curl -I https://unidac.cconet.dev.br/api/health

# Deve retornar 200 OK com headers:
# server: cloudflare
# cf-ray: ...
```

## 4. Upgrade para Full Strict SSL (Recomendado)

### No Cloudflare

1. **SSL/TLS → Origin Server → Create Certificate**
   - Hostnames: `unidac.cconet.dev.br`, `*.cconet.dev.br`
   - Validity: 15 years
   - **Salve os certificados!**

2. **SSL/TLS Mode:** `Full (strict)`

### No Servidor

```bash
# Copiar certificado origin
cat > /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl/origin-cert.pem <<'EOF'
-----BEGIN CERTIFICATE-----
[COLE O CERTIFICADO DO CLOUDFLARE]
-----END CERTIFICATE-----
EOF

# Copiar chave privada
cat > /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl/origin-key.pem <<'EOF'
-----BEGIN PRIVATE KEY-----
[COLE A CHAVE PRIVADA DO CLOUDFLARE]
-----END PRIVATE KEY-----
EOF

# Ajustar permissões
chmod 600 /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl/*.pem

# Restart Nginx
docker-compose -f docker-compose-dev.yml restart nginx
```

### Atualizar Nginx Config

Edite `/home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/unidac.cconet.dev.br.conf`:

```nginx
# Adicionar redirect HTTP → HTTPS no topo
server {
    listen 80;
    listen [::]:80;
    server_name unidac.cconet.dev.br;
    return 301 https://$server_name$request_uri;
}

# Adicionar configuração HTTPS
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

    # ... resto igual (location /, security headers, etc)
}
```

```bash
# Restart Nginx
docker-compose -f docker-compose-dev.yml restart nginx
```

## 5. Firewall (Importante!)

```bash
# Permitir APENAS Cloudflare IPs
ufw allow 22/tcp  # SSH

# Cloudflare IPv4 ranges (principais)
ufw allow from 173.245.48.0/20 to any port 80,443 proto tcp
ufw allow from 103.21.244.0/22 to any port 80,443 proto tcp
ufw allow from 103.22.200.0/22 to any port 80,443 proto tcp
ufw allow from 103.31.4.0/22 to any port 80,443 proto tcp
ufw allow from 141.101.64.0/18 to any port 80,443 proto tcp
ufw allow from 108.162.192.0/18 to any port 80,443 proto tcp
ufw allow from 190.93.240.0/20 to any port 80,443 proto tcp
ufw allow from 188.114.96.0/20 to any port 80,443 proto tcp
ufw allow from 197.234.240.0/22 to any port 80,443 proto tcp
ufw allow from 198.41.128.0/17 to any port 80,443 proto tcp
ufw allow from 162.158.0.0/15 to any port 80,443 proto tcp
ufw allow from 104.16.0.0/13 to any port 80,443 proto tcp
ufw allow from 104.24.0.0/14 to any port 80,443 proto tcp
ufw allow from 172.64.0.0/13 to any port 80,443 proto tcp
ufw allow from 131.0.72.0/22 to any port 80,443 proto tcp

ufw enable
ufw status
```

## 6. Verificar

```bash
# DNS resolve para Cloudflare IPs?
dig unidac.cconet.dev.br +short

# HTTPS funciona?
curl -I https://unidac.cconet.dev.br/api/health

# SSL grade A/A+?
# https://www.ssllabs.com/ssltest/analyze.html?d=unidac.cconet.dev.br

# Headers Cloudflare presentes?
curl -I https://unidac.cconet.dev.br | grep -i cf-
```

## 7. Laravel Trust Proxies

Edite `app/Http/Middleware/TrustProxies.php`:

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * The trusted proxies for this application.
     *
     * @var array<int, string>|string|null
     */
    protected $proxies = '*'; // Confia em todos os proxies

    /**
     * The headers that should be used to detect proxies.
     *
     * @var int
     */
    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB;
}
```

```bash
# Rebuild app
docker-compose -f docker-compose-dev.yml exec app php artisan config:clear
docker-compose -f docker-compose-dev.yml restart app
```

## Troubleshooting Rápido

### Erro 520/521/522/523
```bash
# Verificar containers
docker-compose -f docker-compose-dev.yml ps

# Logs Nginx
docker-compose -f docker-compose-dev.yml logs nginx

# Logs App
docker-compose -f docker-compose-dev.yml logs app

# Testar localmente
curl http://localhost:8000/api/health
```

### Erro 525 (SSL)
```bash
# Verificar certificados existem
ls -la /home/ubuntu/ms-laravel-processamento-de-passagem/docker/nginx/ssl/

# Verificar SSL mode no Cloudflare = Full (strict)

# Testar SSL localmente
openssl s_client -connect localhost:443
```

### IP Real não aparece
```bash
# Verificar TrustProxies configurado
# Verificar Nginx tem real_ip_header CF-Connecting-IP

# Testar no controller
Route::get('/test-ip', function () {
    return [
        'ip' => request()->ip(),
        'headers' => request()->headers->all(),
    ];
});
```

## Stack Final

```
Internet
   ↓
Cloudflare CDN (SSL/TLS, DDoS protection, WAF)
   ↓ HTTPS
Nginx Reverse Proxy (172.25.0.12:80/443)
   ↓ HTTP
Laravel Octane/Swoole (172.25.0.10:8000)
   ↓
MySQL (172.25.0.2:3306)
MongoDB (172.25.0.3:27017)
Redis (172.25.0.4:6379)
Kafka (172.25.0.6:9092)
```

## Referências

- **Documentação Completa:** [docs/cloudflare-setup.md](./cloudflare-setup.md)
- **Docker Guide:** [docs/docker-usage.md](./docker-usage.md)
- **Cloudflare IPs:** https://www.cloudflare.com/ips/
- **SSL Labs Test:** https://www.ssllabs.com/ssltest/

---

✅ **Checklist:**
- [ ] DNS apontando para Cloudflare
- [ ] Nginx rodando (porta 80/443)
- [ ] SSL Full (strict) configurado
- [ ] Firewall permitindo apenas Cloudflare
- [ ] Health check OK
- [ ] IP real visível no Laravel
- [ ] SSL Labs = A ou A+
