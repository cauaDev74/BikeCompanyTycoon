# QA — Fase 1

| Item | Resultado |
|---|---|
| Só tokens de cor e fontes definidos | OK |
| Contraste AA | Branco/royal 12.57, branco/navy 16.72, verde/royal 5.89, dourado/royal 8.82, vermelho/navy 5.52. Vermelho/royal 4.15 (corrigido pela D2) |
| Texto pequeno nunca em verde | Verde só em `.num-money` (grande) e deltas em negrito |
| SVG válido, sem script ou imagem externa | OK (ícones, marca, PWA) |
| 380px sem rolagem horizontal | OK (scrollWidth 380 medido no Chromium) |
| Estados hover/pressed/disabled/bloqueado | Botão, tile, aba e cartão de peça |
| Reduced motion | Cascata e toast desligados via `prefers-reduced-motion` |
| Sem marca real nem texto em imagem | OK |
| Peso | Todos os SVGs abaixo de 2 KB |

## Pendências
- Lilita One e Inter não carregaram no teste (sem rede). Conferir tipografia no navegador.
- Ícones PWA: PNG 192/512 gerados a partir do SVG maskable. Revisar a zona segura em dispositivo real.
- Foto do cartão de peça é provisória até a Fase 4.
- Hover/pressed foram revisados no CSS, não por interação real.

# QA — Fase 2

| Item | Resultado |
|---|---|
| SVG válido, sem scripts ou imagens externas | OK (`xmllint` em 11 exemplos e 3 silhuetas) |
| Mesmo viewBox e ancoragens em todas as camadas | OK, `0 0 1000 600` com ancoragens por categoria |
| Combinações coerentes (mínimo 10) | 11 exemplos revisados visualmente + **40 combinações aleatórias por viewport** sem erro, sem `NaN`/`undefined` e sempre com 9 camadas |
| Peso por camada (limite 20 KB) | OK: a maior camada tem 6,5 KB; o SVG completo, de 14 a 22 KB |
| 380px e desktop | OK, sem rolagem horizontal (`scrollWidth` 380 e 1280) |
| Estados e acessibilidade | Seletores de 44px, swatches com `aria-label`/`aria-pressed`, reduced-motion desliga a montagem |
| Montagem em 9 etapas (520 ms) | Implementada via `animation-delay`; barra de etapas na demo |

## Limites conhecidos
- Só 3 categorias e 3 motores desenhados; o resto é aproximado e avisa em `warnings` (ver `bike2d/README.md`).
- A inclinação do motor e o arranjo das 4 cilindradas usam deslocamento lateral, uma convenção de vista lateral, não geometria real.
- O visual foi conferido em capturas do Chromium. Falta teste em dispositivo real.
- As silhuetas de categoria da Fase 2 são estruturais: refino de proporções (banco, tanque, carenagem) fica para a Fase 3.
