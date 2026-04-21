# Neutrino — Style Guide de Identidade Visual

> Documento de referência para o design system do site institucional.  
> Fonte de verdade: `src/index.css` e `tailwind.config.ts`.

---

## 1. Princípios Visuais

A identidade da Neutrino combina **austeridade corporativa** com **personalidade tech**.  
O visual é predominantemente preto e branco, com o **Quantum Cyan** (`#00D6E8`) como único acento cromático vibrante — reservado para hierarquia e destaque. Elementos animados (partículas, gradientes) reforçam o posicionamento de alta engenharia sem quebrar a seriedade.

**Três pilares:**
- **Clareza** — informação respirando, sem poluição visual
- **Peso** — tipografia bold, espaçamentos generosos, autoridade
- **Precisão** — grid rígido, proporções calculadas, sem decoração gratuita

---

## 2. Paleta de Cores

### 2.1 Cores Primárias

| Token | CSS Variable | HSL | Hex | Uso |
|---|---|---|---|---|
| `primary` | `--primary` | `0 0% 9%` | `#161616` | Botões CTA, texto principal, inversões de seção |
| `primary-foreground` | `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Texto sobre fundo primary |
| `background` | `--background` | `0 0% 100%` | `#FFFFFF` | Fundo da página |
| `foreground` | `--foreground` | `0 0% 9%` | `#161616` | Texto padrão |

### 2.2 Cor de Marca — Quantum

A cor Quantum é o **único acento cromático** da marca. Usar com parcimônia — apenas para highlights, CTAs secundários e elementos interativos de destaque.

| Token | CSS Variable | HSL | Hex | Uso |
|---|---|---|---|---|
| `quantum` | `--quantum` | `191 100% 42%` | `#00C5D9` | Acento principal da marca |
| `quantum-foreground` | `--quantum-foreground` | `0 0% 100%` | `#FFFFFF` | Texto sobre fundo quantum |
| `quantum-glow` | `--quantum-glow` | `271 91% 65%` | `#A96CF0` | Roxo para variação de glow/destaque |
| `primary-glow` | `--primary-glow` | `191 100% 50%` | `#00EFFF` | Versão brilhante para efeitos hover |

> **Regra de uso:** Quantum aparece em no máximo 1–2 elementos por seção. Nunca em blocos de texto corrido.

### 2.3 Superfícies e Suporte

| Token | CSS Variable | HSL | Hex | Uso |
|---|---|---|---|---|
| `secondary` | `--secondary` | `0 0% 96%` | `#F5F5F5` | Fundo de seções alternadas |
| `secondary-foreground` | `--secondary-foreground` | `0 0% 9%` | `#161616` | Texto sobre secondary |
| `secondary-glow` | `--secondary-glow` | `0 0% 78%` | `#C7C7C7` | Bordas e linhas decorativas |
| `accent` | `--accent` | `191 30% 94%` | `#EDF5F6` | Tint ciano sutil para hover states |
| `accent-foreground` | `--accent-foreground` | `191 80% 25%` | `#0A4D54` | Texto escuro sobre accent |
| `muted` | `--muted` | `0 0% 98%` | `#FAFAFA` | Fundos de cards e tags |
| `muted-foreground` | `--muted-foreground` | `0 0% 45%` | `#737373` | Texto de apoio, labels, subtítulos |

### 2.4 Bordas e Feedback

| Token | CSS Variable | HSL | Hex | Uso |
|---|---|---|---|---|
| `border` | `--border` | `0 0% 90%` | `#E6E6E6` | Bordas de cards, divisores |
| `input` | `--input` | `0 0% 90%` | `#E6E6E6` | Bordas de campos de formulário |
| `ring` | `--ring` | `191 100% 42%` | `#00C5D9` | Focus ring (Quantum) |
| `destructive` | `--destructive` | `0 84% 60%` | `#F06060` | Erros, alertas destrutivos |

### 2.5 Seção Invertida (Footer / Dark Sections)

Para seções com fundo escuro, usar `bg-primary` (`#161616`) como base e texto em branco. O Footer utiliza este padrão.

```
Fundo:   bg-primary  →  #161616
Texto:   text-primary-foreground  →  #FFFFFF
Apoio:   rgba(255,255,255,0.6)  →  texto secundário
Bordas:  rgba(255,255,255,0.12)  →  divisores sutis
```

---

## 3. Tipografia

### 3.1 Famílias

| Família | Classe Tailwind | Pesos | Uso |
|---|---|---|---|
| **Orbitron** | `font-orbitron` | 400, 600, 700, 900 | Headlines, nome da marca, labels uppercase tech |
| **Inter** | `font-inter` | 400, 500, 600 | Corpo de texto, UI copy, parágrafos |
| System fallback | — | 400, 700 | Fallback automático |

> **Regra:** Orbitron exclusivamente em títulos e elementos de identidade. Inter em todo o resto. Nunca misturar nas mesmas linhas.

### 3.2 Escala de Tamanhos

| Nível | Classe | Tamanho | Uso |
|---|---|---|---|
| Display | `text-6xl` / `text-7xl` | 60–84px | Hero title |
| H1 | `text-5xl` | 48px | Page title principal |
| H2 | `text-4xl` / `text-5xl` | 36–48px | Section titles |
| H3 | `text-2xl` / `text-3xl` | 24–30px | Sub-seções |
| H4 | `text-xl` | 20px | Títulos de cards |
| Body Large | `text-lg` / `text-xl` | 18–20px | Lead paragraphs |
| Body | `text-base` | 16px | Texto corrido |
| Small | `text-sm` | 14px | Captions, descrições de cards |
| Label / Eyebrow | `text-xs` | 12px | Uppercase labels de seção |

### 3.3 Pesos

| Peso | Classe | Uso |
|---|---|---|
| 400 | `font-normal` | Texto corrido |
| 500 | `font-medium` | Links, botões secundários |
| 600 | `font-semibold` | Subtítulos, destaques inline |
| 700 | `font-bold` | Títulos de seção, H3/H4 |
| 900 | `font-black` | Hero title, nome da marca |

### 3.4 Espaçamento entre Letras

| Contexto | Classe | Valor |
|---|---|---|
| Titles tight | `tracking-tight` | -0.015em |
| Body padrão | `tracking-normal` | 0 |
| Labels/eyebrows | `tracking-[0.2em]` | 0.2em |
| Small caps | `tracking-widest` | 0.1em |

### 3.5 Alturas de Linha

| Contexto | Classe | Valor |
|---|---|---|
| Títulos grandes | `leading-none` / `leading-[1.15]` | 1–1.15 |
| Títulos médios | `leading-tight` / `leading-[1.2]` | 1.2–1.25 |
| Corpo de texto | `leading-relaxed` / `leading-[1.6]` | 1.6–1.65 |
| Lead paragraphs | `leading-[1.7]` | 1.7 |

---

## 4. Espaçamento e Layout

### 4.1 Container

```
max-w-7xl   →  1280px  (largura máxima do conteúdo)
px-4        →  mobile
px-6        →  sm (640px+)
px-12       →  md (768px+)
```

### 4.2 Ritmo Vertical de Seções

```
py-32   →  256px  (seções principais — padrão)
py-20   →  160px  (seções compactas)
py-16   →  128px  (mobile / seções menores)
```

### 4.3 Gaps de Grid

```
gap-8    →  cards em grid 2 colunas
gap-12   →  grid com conteúdo mais denso
gap-16   →  layout de 2 colunas grandes
gap-20   →  seções com muito respiro
```

---

## 5. Bordas e Raios

### 5.1 Border Radius

| Classe | Valor | Uso |
|---|---|---|
| `rounded-sm` | 2px | Badges muito pequenos |
| `rounded` / `rounded-md` | 4–6px | Tags, inputs |
| `rounded-lg` | `var(--radius)` = 6px | Cards padrão |
| `rounded-xl` | 12px | Modais, botões maiores |
| `rounded-2xl` | 16px | Cards de destaque |
| `rounded-full` | 9999px | Avatares, pills |

> **Padrão dominante no site:** Cards sem border-radius (arestas retas) na maioria das seções — estética mais corporativa/severa.

### 5.2 Bordas

- Padrão: `border border-border` → `1px solid #E6E6E6`
- Hover: `hover:border-foreground` → `#161616`
- Dark sections: `border-white/10` → translúcido

---

## 6. Sombras

| Token | CSS Variable | Valor | Uso |
|---|---|---|---|
| `shadow-card` | `--shadow-card` | `0 1px 2px hsl(0 0% 0% / 0.05)` | Cards em repouso |
| `shadow-glow` | `--shadow-glow` | `0 0 25px hsl(191 100% 42% / 0.35)` | Hover / Quantum glow |
| `shadow-quantum` | `--shadow-quantum` | `0 0 30px hsl(271 91% 65% / 0.35)` | Efeito roxo |
| `shadow-golden` | `--shadow-golden` | `0 0 20px hsl(45 93% 58% / 0.40)` | Efeito dourado (reservado) |

**Padrão de interação de card:**
```
repouso:  shadow-card
hover:    shadow-glow  +  border-foreground
```

---

## 7. Gradientes

| Token | CSS Variable | Composição | Uso |
|---|---|---|---|
| `bg-gradient-cosmic` | `--gradient-cosmic` | Preto → Azul profundo → Roxo | Fundos de seções heroicas |
| `bg-gradient-energy` | `--gradient-energy` | Cyan → Roxo | Barras de destaque, botões |
| `bg-gradient-orbital` | `--gradient-orbital` | Branco → Tint ciano suave | Transições entre seções |

**Gradiente de texto animado (`.text-shine`):**
```
Azul céu (hsl 200 85% 45%) → Roxo (hsl 271 91% 65%) → Branco → Rosa (hsl 328 86% 64%) → Azul
Animação: shine 2.5s ease-in-out infinite
```

---

## 8. Efeitos e Classes Utilitárias

### 8.1 Classes CSS Customizadas

| Classe | Efeito |
|---|---|
| `.cosmic-glow` | `box-shadow: var(--shadow-glow)` — brilho ciano |
| `.quantum-glow` | `box-shadow: var(--shadow-quantum)` — brilho roxo |
| `.golden-glow` | `box-shadow: var(--shadow-golden)` — brilho dourado |
| `.text-shine` | Texto com gradiente cromático animado |
| `.particle-trail` | Efeito de partícula com radial gradient pseudo-element |
| `.tech-logo-contrast` | Melhoria de contraste para logos de tecnologia |

### 8.2 Blur Decorativo

```
blur-3xl   →  64px  (fundos de seção com elementos decorativos desfocados)
blur-md    →  12px  (overlays sutis)
```

---

## 9. Animações e Motion

### 9.1 Keyframes disponíveis

| Nome | Duração | Uso |
|---|---|---|
| `fade-in` | 0.6s ease-out | Entrada de seções ao scroll |
| `scale-in` | 0.5s ease-out | Entrada de cards/modais |
| `float` | 6s ease-in-out ∞ | Elementos decorativos flutuantes |
| `orbit` | 20s linear ∞ | Elementos em rotação orbital |
| `pulse-glow` | 3s ease-in-out ∞ | Pulsação de elementos em destaque |
| `shine` | 2s linear ∞ | Animação do gradiente de texto |
| `particle-float` | 8s ease-in-out ∞ | Movimento de partículas de fundo |

### 9.2 Transições Padrão

```
Hover de cards:     transition-all duration-300
Troca de cor:       transition-colors duration-300
Suave (CSS var):    var(--transition-smooth)  →  0.4s cubic-bezier(0.4, 0, 0.2, 1)
Elástico (CSS var): var(--transition-bounce)  →  0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### 9.3 Princípio de Motion

- Entradas de seção via **Framer Motion** (`whileInView`, `once: true`)
- Transições de UI via **Tailwind** (`transition-*`, `duration-*`)
- Animações decorativas via **keyframes CSS** (`animation-*`)

---

## 10. Breakpoints

| Prefixo | Largura | Contexto |
|---|---|---|
| — | < 640px | Mobile (base) |
| `sm:` | 640px+ | Tablet pequeno |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Desktop |
| `xl:` | 1280px+ | Desktop largo |
| `2xl:` | 1400px+ | Widescreen |

**Padrão de tipografia responsiva:**
```
text-3xl sm:text-4xl md:text-5xl lg:text-6xl
```

**Padrão de padding responsivo:**
```
py-16 sm:py-20 md:py-32
px-4 sm:px-6 md:px-12
```

---

## 11. Padrão de Componentes

### Card de Conteúdo (padrão dominante no site)

```tsx
<div className="group bg-white p-8 border border-border hover:border-foreground transition-all duration-300 hover:shadow-lg">
  {/* Ícone com hover invertido */}
  <div className="w-12 h-12 bg-secondary group-hover:bg-primary transition-colors duration-300">
    <Icon className="text-foreground group-hover:text-primary-foreground" />
  </div>
  {/* Numeração */}
  <span className="text-xs font-bold text-muted-foreground">01</span>
  {/* Título */}
  <h3 className="text-xl font-bold text-foreground">Título</h3>
  {/* Descrição */}
  <p className="text-sm text-muted-foreground leading-relaxed">Texto</p>
</div>
```

### Eyebrow Label (acima dos títulos de seção)

```tsx
<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8">
  Nome da Seção
</p>
```

### Título de Seção

```tsx
<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] tracking-tight">
  Título principal da seção
</h2>
```

### Botão Primário

```tsx
<button className="bg-primary text-primary-foreground px-8 py-4 font-semibold hover:bg-primary/90 transition-colors duration-300">
  CTA
</button>
```

### Botão Quantum (acento de marca)

```tsx
<button className="bg-quantum text-quantum-foreground px-8 py-4 font-semibold hover:shadow-glow transition-all duration-300">
  CTA de Destaque
</button>
```

---

## 12. O que NÃO fazer

- **Não** usar `gray-*` hardcoded nos componentes — sempre usar os tokens do design system
- **Não** usar Orbitron em texto corrido ou parágrafos
- **Não** aplicar `quantum` em mais de 1–2 elementos por seção
- **Não** criar novos gradientes fora dos 3 definidos (`cosmic`, `energy`, `orbital`) sem alinhar com este documento
- **Não** usar border-radius em cards que seguem o padrão corporativo de arestas retas
- **Não** adicionar novas famílias tipográficas sem atualizar este documento

---

## 13. Referências de Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/index.css` | CSS variables — fonte de verdade de todos os tokens |
| `tailwind.config.ts` | Mapeamento Tailwind dos tokens + keyframes + animações |
| `index.html` | Import das Google Fonts (Orbitron, Inter) |
| `src/components/` | Implementação dos padrões deste guia |
