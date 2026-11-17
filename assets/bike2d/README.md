# Bike2D — moto procedural em SVG (Fase 2)

`renderBikeSVG(spec, opts)` recebe um **BikeSpec** e devolve `{ svg, warnings, layerSizes, anchors }`. Não há dependências, scripts nem imagens externas.

```js
import { renderBikeSVG } from "./renderer.js";
const { svg, warnings } = renderBikeSVG(spec, { animate: true, uid: "garage1" });
```

Opções: `animate` (montagem em 9 etapas, 520 ms cada), `uid` (prefixo de ids; use um por SVG na mesma página), `only` (lista de camadas, usado nas silhuetas).

## Camadas e ordem
`data-stage` segue o GDD: 1 engine · 2 exhaust · 3 chassis · 4 suspension · 5 brakes · 6 wheels · 7 body · 8 electronics · 9 paint.
A **ordem no DOM (z-order) é diferente** da ordem de montagem: wheels, chassis, suspension, engine, exhaust, brakes, body, paint, electronics. A animação usa só `data-stage`. Ids: `{uid}-layer-{nome}`; pneus e aros ficam em `{uid}-tyres` e `{uid}-rims`.

## Pontos de ancoragem (viewBox 0 0 1000 600)
Devolvidos em `anchors`: `rearAxle`, `frontAxle`, `steeringHead`, `forkPivot`, `engineMount`, `exhaustOut`, `seat`, `swingarmPivot`, `ground`.

| Categoria | Entre-eixos | Roda (raio) | Inclinação do garfo | Banco (y) |
|---|---|---|---|---|
| scooter | 575 | 100 | 20° | 262 |
| cafe-racer | 610 | 135 | 27° | 185 |
| sportbike | 580 | 130 | 24° | 205 |

## Cor e acabamento
Variáveis: `--paint`, `--accent-paint` (definidas no `<svg>` pelo renderizador, sobrescrevíveis por CSS), `--metal`, `--metal-dark`, `--rubber`, `--primer`, `--seat`, `--lamp`, `--outline`.
Acabamentos (`paint.finish`): `gloss`, `matte`, `satin`, `metallic`, `chrome` (chrome ignora a cor e usa gradiente de espelho). Antes do estágio 9 a carroceria aparece em primer cinza.

## BikeSpec
Ver `bikespec-example.json`. Ids seguem o GDD (`doublecradle`, `usd`, `dual`, `mono`, `spoke`, `alloy`, `offroad`, `slipon`...).

## Cobertura na Fase 2
| Slot | Desenhado | Aproximado (aviso em `warnings`) |
|---|---|---|
| Categoria | scooter, cafe-racer, sportbike | demais categorias lançam erro (Fase 3) |
| Motor | single, parallel, inline (1/2/4 cil.) | v, boxer, inline3, v4, inline6, electric |
| Quadro | backbone, cradle, doublecradle, trellis, perimeter, twinspar | monocoque |
| Garfo | telescopic, cartridge, usd | semiactive |
| Amortecedor | dual, mono | linkage, semiactive |
| Freio | drum, single, twin, radial (+ disco traseiro) | monoblock |
| Rodas | spoke, steel, alloy, forged, carbon | — |
| Pneus | commuter, touring, sport, track, offroad | — |
| Carenagem | none, half, full, touring, winglets | — (scooter ignora) |
| Escape | stock, twin, megaphone, slipon, full, titanium | underseat |
| Eletrônicos | tft, led, radar (visuais); demais = LEDs de comando | — |

## Build
`node build.mjs` regenera `silhouettes/`, `examples/` e `demo.html` (autônomo, abre por `file://`). Exige Node 18+.
