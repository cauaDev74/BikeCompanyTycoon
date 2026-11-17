# DECISIONS

Aprovadas na Fase 0 (usuário liberou a Fase 1).

| # | Decisão | Motivo |
|---|---|---|
| D1 | `--radius: 16px`, escala 4/8/12/16/24/pill derivada por `calc()` | Um único valor de raio |
| D2 | Vermelho `#ff5c5c` fora dos gráficos. Em texto pequeno só sobre navy (`.neg`, 5.52:1). Sobre royal dá 4.15:1, então só ícone, texto grande ou ao lado de seta | Medido: reprova AA em texto pequeno sobre royal |
| D3 | Texto pequeno sempre branco, mínimo 85% de opacidade (`--text-soft`) | Contraste AA |
| D4 | Estado bloqueado = vidro a 7% + foto em escala de cinza + selo com cadeado e motivo (ano ou pesquisa) | Padrão único para cartões e botões |
| D5 | Ícones 24×24, traço 2px, `currentColor`, pontas e junções arredondadas | Prompt |
| D6 | Nomes em kebab-case com prefixo de família (`icon-hub-research.svg`) | Prompt |
| D7 | Verde `#3ccb4f` mede 5.89:1 sobre royal. Mesmo assim fica restrito a números grandes, ícones e deltas em negrito | Regra do Style Bible mantida |
| D8 | Gráfico dyno: potência em branco contínuo, torque em dourado pontilhado, para não depender só de cor | Acessibilidade |
| D9 | Hub tem 12 tiles. O ícone de Configurações existe à parte (`icon-hub-settings`) | GDD §03: «doze tiles» mais Configurações |
| D10 | Fontes Lilita One e Inter vêm do projeto (`next/font`). O style guide usa Google Fonts só para pré-visualizar | Sem fonte embutida em SVG |
| D11 | O wordmark SVG referencia Lilita One. Antes de ir para produção, converter o texto em contornos se o logo for usado fora do app | Sem fonte embutida |
| D12 | Ícones de categoria da Fase 1 são funcionais, refinados na Fase 3 com as silhuetas | Escopo da fase |
| D13 | Estilo da moto 2D: **preenchida** (pintura + gradiente de sombra e brilho), contorno navy translúcido. Acabamentos via gradientes SVG, sem filtros pesados | Pergunta da Fase 1 sem resposta; escolhi a opção que permite gloss/satin/metallic/chrome visíveis |
| D14 | Motores da Fase 2: Single, Parallel Twin e Inline Four (cobrem as 3 categorias). Demais layouts caem no equivalente mais próximo e geram aviso | Escopo da fase |
| D15 | z-order do DOM difere da ordem de montagem. A animação usa `data-stage`; o DOM segue a sobreposição visual correta | Disco, garfo e motor precisam se sobrepor corretamente |
| D16 | Lamparina, para-brisa e detalhes de farol ficam na camada 8 (eletrônicos), acima da pintura | A camada 9 recortada pela carroceria escondia o farol |
| D17 | Escape sai até a linha do eixo traseiro (`exhaustOut`) e sobrepõe o pneu | Leitura mais próxima de uma moto real |
| D18 | Scooter ignora carenagem e usa quadro mínimo (tudo coberto pela carroceria) | Silhueta de scooter é todo carroceria |
