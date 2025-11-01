# Vercel Deployment Guide

## ✅ Arquivos de Configuração Criados

### vercel.json
- Configuração de rewrites para SPA (Single Page Application)
- Headers de segurança (XSS Protection, Content-Type Options)
- Configuração específica para sitemap.xml

### public/_redirects
- Fallback para todas as rotas apontarem para index.html
- Compatibilidade com diferentes provedores de hosting

## 🚀 Deploy Steps

1. **Commit das configurações:**
```bash
git add .
git commit -m "fix: add Vercel SPA routing configuration"
git push origin main
```

2. **Vercel Deploy:**
- As mudanças serão automaticamente deployadas
- Todas as rotas (/sobre, /ecossistema, /privacidade, /cookies) funcionarão

## 🔧 Troubleshooting

### Se ainda der 404:
1. Verificar se o build está correto no Vercel dashboard
2. Checar logs de build para erros
3. Confirmar se o domínio está apontando corretamente

### Build Commands (se necessário):
- Build Command: `npm run build` ou `yarn build`
- Output Directory: `dist`
- Install Command: `npm install` ou `yarn install`

### Configurações do Vercel Project:
- Framework Preset: Vite
- Node.js Version: 18.x (recomendado)
- Root Directory: `/` (se não especificado)

## ✅ Rotas Configuradas:
- `/` - Homepage
- `/sobre` - Página Sobre
- `/ecossistema` - Ecossistema de empresas
- `/privacidade` - Política de Privacidade
- `/cookies` - Política de Cookies
- `/*` - Todas as outras rotas redirecionam para NotFound

## 📝 Notas Importantes:
- O BrowserRouter precisa do vercel.json para funcionar em produção
- Sem essa configuração, apenas a rota `/` funcionaria
- O arquivo _redirects serve como backup para outros hosts