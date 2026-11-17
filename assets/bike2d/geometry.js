// Geometria base das categorias. viewBox 0 0 1000 600, chão em y = rear.y + R. Moto olha para a DIREITA.
const rad = d => d * Math.PI / 180;
export const VIEWBOX = '0 0 1000 600';
export const GEO = {
  'scooter':    { R:100, rear:[225,400], front:[800,400], rake:20, forkLen:205, engine:[305,410], pivot:[330,404], seat:[400,262], bar:'flat',   stripe:[[300,352],[492,340]], frame:'backbone',  fork:'telescopic', shock:'dual', wheels:'steel',  tyres:'commuter', exhaust:'stock' },
  'cafe-racer': { R:135, rear:[205,365], front:[815,365], rake:27, forkLen:255, engine:[470,368], pivot:[335,388], seat:[330,185], bar:'clipon', stripe:[[215,214],[668,170]], frame:'cradle',    fork:'telescopic', shock:'dual', wheels:'spoke',  tyres:'touring',  exhaust:'twin' },
  'sportbike':  { R:130, rear:[215,370], front:[795,370], rake:24, forkLen:250, engine:[460,372], pivot:[345,392], seat:[320,205], bar:'clipon', stripe:[[240,226],[640,186]], frame:'twinspar',  fork:'usd',        shock:'mono', wheels:'alloy',  tyres:'sport',    exhaust:'full' }
};
export const CATEGORIES = Object.keys(GEO);
export function anchors(cat) {
  const g = GEO[cat]; if (!g) throw new Error('categoria sem silhueta na Fase 2: ' + cat);
  const t = rad(g.rake), d = [Math.sin(t), Math.cos(t)];            // d = direção do garfo (para baixo e para frente)
  const head = [g.front[0] - g.forkLen * d[0], g.front[1] - g.forkLen * d[1]];   // cabeça de direção
  const forkTop = [head[0] - 18 * d[0], head[1] - 18 * d[1]];                    // pivô do garfo (topo)
  return { ...g, cat, forkDir: d, head, forkTop, groundY: g.rear[1] + g.R, tyreW: g.R * .27, rimR: g.R * .73,
    exhaustOut: [g.rear[0] - 22, g.rear[1] + 20] };                               // saída do escape
}
