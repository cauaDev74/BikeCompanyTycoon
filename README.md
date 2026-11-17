# Bike Company Tycoon — Assets visuais

Assets de arte e UI do jogo **Bike Company Tycoon**, um simulador de negócios e engenharia de motocicletas (1960 a 2060+) para Web, PWA e Android. O projeto-alvo é Next.js + React + Tailwind v4.

O GDD v1.0 (não incluído neste repositório) é a fonte da verdade. Quando ele é omisso, vale o Style Bible, e cada decisão fica registrada em `docs/DECISIONS.md`.

## Status das fases

| Fase | Conteúdo | Status |
|---|---|---|
| 0 | Entendimento, suposições e decisões | Concluída |
| 1 | Tokens, vidro, UI kit, ícones essenciais, logo e PWA | Concluída |
| 2 | Moto procedural 2D (3 categorias, 3 motores) | Concluída |
| 3 | 9 categorias, todas as peças, ilustrações, ícones restantes | Pendente |
| 4 | Peças fotográficas (prompts ou imagens) e lacunas do GDD | Pendente |
| 5 | Motion e auditoria final | Pendente |

## Estrutura

```
assets/
  tokens/        design-tokens.css, tailwind-theme.css
  ui/            glass.css (vidro e componentes base)
  icons/         30 SVGs 24x24 (hub, kpi, cat)
  brand/         logos, favicons, company-logo.js, pwa/
  bike2d/        moto procedural: renderer, peças, exemplos, demo.html
  style-guide.html   página que mostra tudo da Fase 1
  manifest.json      lista de assets com status e dependências
docs/
  DECISIONS.md   decisões de design (D1-D12)
  QA-REPORT.md   checklist de qualidade da fase
```

## Como usar

**Pré-visualizar:** abra `assets/style-guide.html` no navegador. Ele carrega Lilita One e Inter do Google Fonts apenas para pré-visualização.

**Tailwind v4** (no CSS global do app):

```css
@import "tailwindcss";
@import "../assets/tokens/design-tokens.css";
@import "../assets/tokens/tailwind-theme.css";
@import "../assets/ui/glass.css";
```

No projeto Next.js, carregue as fontes com `next/font` (Lilita One e Inter).

**Logo da empresa do jogador:**

```js
import { companyLogoSVG } from "./assets/brand/company-logo.js";
const svg = companyLogoSVG({ shape: "shield", primary: "#c8102e", secondary: "#f2c230" });
```

Formas: shield, circle, hexagon, diamond, star, chevron, roundel, pennant.

**Moto 2D:** abra `assets/bike2d/demo.html` (seletor de peças ao vivo) ou veja `assets/bike2d/README.md`. `node build.mjs` dentro de `assets/bike2d/` regenera exemplos e demo.

## Convenções

- Nomes em kebab-case com prefixo de família: `icon-hub-research.svg`, `part-frame-trellis.webp`, `bike2d-wheel-forged.svg`.
- Só as cores do Style Bible. Texto pequeno é branco. Verde só em números grandes, ícones e deltas em negrito.
- Ícones: grade 24x24, traço 2px, `currentColor`.
- Todo asset novo entra no `assets/manifest.json` com status `done`, `prompt-only` ou `todo`.
- Limites de peso: SVG de camada abaixo de 20 KB, WebP de peça abaixo de 120 KB, herói 16:9 abaixo de 250 KB.
