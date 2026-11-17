// Peças da moto 2D. Cada função recebe os anchors (geometry.js) e o BikeSpec e devolve markup SVG.
// Cores só por variáveis CSS (com fallback). Nada de fontes, scripts ou imagens externas.
const f = n => Math.round(n * 10) / 10;
const pt = p => `${f(p[0])},${f(p[1])}`;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const rot = (p, deg) => { const t = deg * Math.PI / 180; return [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)]; };
const METAL = 'var(--metal,#c5cedb)', METAL_D = 'var(--metal-dark,#66748a)', RUBBER = 'var(--rubber,#14171c)', ACC = 'var(--accent-paint,#f2c230)', OUT = 'var(--outline,rgba(7,26,74,.55))';
const line = (a, b, w, s, o = '') => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" ${o}/>`;
const poly = (pts, w, s, o = '') => `<polyline points="${pts.map(pt).join(' ')}" fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o}/>`;
const circ = (c, r, fill, stroke = 'none', sw = 0, o = '') => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${o}/>`;
const coil = (a, b, n, amp, w, s) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, pts = [a];
  for (let i = 0; i < n; i++) { const t = (i + .5) / n, k = i % 2 ? -amp : amp; pts.push([a[0] + dx * t + nx * k, a[1] + dy * t + ny * k]); }
  pts.push(b); return poly(pts, w, s);
};
const FRAME_COL = { steel: '#27313f', aluminum: '#b4bfcd', carbon: '#10141a' };

// ---------- mapa de equivalências: o que ainda é aproximado nesta fase ----------
export const FALLBACK = {
  engine: { v: 'parallel', boxer: 'parallel', inline3: 'inline', v4: 'inline', inline6: 'inline', electric: 'parallel' },
  frame: { monocoque: 'perimeter' }, fork: { semiactive: 'usd' }, shock: { linkage: 'mono', semiactive: 'mono' },
  brake: { monoblock: 'radial' }, exhaust: { underseat: 'full' }
};
export const OPTIONS = {
  engine: ['single', 'parallel', 'inline'], cooling: ['air', 'oil', 'liquid'],
  frame: ['backbone', 'cradle', 'doublecradle', 'trellis', 'perimeter', 'twinspar'], material: ['steel', 'aluminum', 'carbon'],
  fork: ['telescopic', 'cartridge', 'usd'], shock: ['dual', 'mono'], brake: ['drum', 'single', 'twin', 'radial'],
  wheels: ['spoke', 'steel', 'alloy', 'forged', 'carbon'], tyres: ['commuter', 'touring', 'sport', 'track', 'offroad'],
  fairing: ['none', 'half', 'full', 'touring', 'winglets'], exhaust: ['stock', 'twin', 'megaphone', 'slipon', 'full', 'titanium'],
  electronics: ['tft', 'led', 'radar', 'cruise', 'riding_modes', 'traction_control', 'quickshifter', 'imu']
};

// ---------- 6 · rodas e pneus (independentes, para o aro receber o acento) ----------
export function wheelsParts(A, s) {
  const tyre = [], rim = [], R = A.R, tw = A.tyreW, ri = R - tw, t = s.tyres || 'sport', type = s.wheels || 'spoke';
  for (const c of [A.rear, A.front]) {
    let g = `<g transform="translate(${f(c[0])} ${f(c[1])})">`;
    g += `<circle r="${f(R - tw / 2)}" fill="none" stroke="${RUBBER}" stroke-width="${f(tw)}"/>`;
    if (t === 'commuter') g += `<circle r="${f(R - tw * .5)}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="${f(tw * .55)}" stroke-dasharray="3 7"/>`;
    if (t === 'touring') g += `<circle r="${f(R - tw * .5)}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="${f(tw * .3)}" stroke-dasharray="16 6"/>`;
    if (t === 'sport' || t === 'track') g += `<circle r="${f(R - 4)}" fill="none" stroke="#fff" stroke-opacity="${t === 'track' ? .05 : .1}" stroke-width="2"/>`;
    if (t === 'offroad') g += `<circle r="${f(R - 3)}" fill="none" stroke="${RUBBER}" stroke-width="8" stroke-dasharray="10 8"/><circle r="${f(R - 3)}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="2" stroke-dasharray="10 8"/>`;
    tyre.push(g + '</g>');
    let r = `<g transform="translate(${f(c[0])} ${f(c[1])})">`;
    r += `<circle r="${f(ri)}" fill="none" stroke="${METAL}" stroke-width="6"/><circle r="${f(ri - 5)}" fill="none" stroke="${ACC}" stroke-width="3"/>`;
    if (type === 'spoke') { for (let i = 0; i < 28; i++) { const a = i * 2 * Math.PI / 28, o = i % 2 ? .12 : -.12; r += `<line x1="${f(12 * Math.cos(a))}" y1="${f(12 * Math.sin(a))}" x2="${f((ri - 5) * Math.cos(a + o))}" y2="${f((ri - 5) * Math.sin(a + o))}" stroke="${METAL}" stroke-width="1.3"/>`; } }
    else if (type === 'steel') { r += `<circle r="${f(ri - 5)}" fill="${METAL_D}"/>`; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; r += `<circle cx="${f(ri * .6 * Math.cos(a))}" cy="${f(ri * .6 * Math.sin(a))}" r="${f(ri * .12)}" fill="${RUBBER}"/>`; } }
    else { const n = type === 'forged' ? 7 : 5, w = type === 'forged' ? 7 : type === 'carbon' ? 13 : 11, col = type === 'carbon' ? '#232a35' : METAL;
      for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; r += `<line x1="0" y1="0" x2="${f((ri - 4) * Math.cos(a))}" y2="${f((ri - 4) * Math.sin(a))}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`; }
      if (type === 'carbon') r += `<circle r="${f(ri - 5)}" fill="none" stroke="#3a4352" stroke-width="2" stroke-dasharray="3 3"/>`; }
    r += circ([0, 0], 13, METAL_D, METAL, 3) + '</g>';
    rim.push(r);
  }
  return `<g id="${s._uid}-tyres">${tyre.join('')}</g><g id="${s._uid}-rims">${rim.join('')}</g>`;
}

// ---------- 1 · motor (3 layouts na Fase 2) ----------
export function engineLayer(A, s) {
  const e = s._engine, [cx, cy] = A.engine, sc = A.cat === 'scooter';
  const tilt = sc ? 82 : e.layout === 'single' ? 6 : e.layout === 'parallel' ? 12 : (A.cat === 'sportbike' ? 26 : 16);
  const bw = sc ? 52 : e.layout === 'single' ? 62 : e.layout === 'parallel' ? 72 : 98, bh = sc ? 70 : e.layout === 'single' ? 96 : 104;
  const depth = Math.min(e.cylinders, 4), liquid = e.cooling === 'liquid';
  let g = `<rect x="${cx - (sc ? 70 : 88)}" y="${cy - 34}" width="${sc ? 140 : 170}" height="${sc ? 64 : 72}" rx="24" fill="${METAL_D}" stroke="${OUT}" stroke-width="2"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="${sc ? 22 : 26}" fill="${METAL}" stroke="${METAL_D}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="8" fill="${METAL_D}"/>`;
  g += `<rect x="${cx - 82}" y="${cy + 6}" width="52" height="26" rx="8" fill="${METAL}" opacity=".55"/>`;
  const barrel = (dx, dim) => {
    let b = `<g transform="translate(${cx + dx} ${cy}) rotate(${tilt})" ${dim ? 'opacity=".5"' : ''}>`;
    b += `<rect x="${-bw / 2}" y="${-bh - 6}" width="${bw}" height="${bh}" rx="6" fill="${dim ? METAL_D : METAL_D}" stroke="${OUT}" stroke-width="2"/>`;
    if (!liquid) for (let y = -bh; y < -14; y += 11) b += `<rect x="${-bw / 2 - 6}" y="${y}" width="${bw + 12}" height="5" rx="2" fill="${METAL}"/>`;
    else b += `<rect x="${-bw / 2 + 6}" y="${-bh}" width="${bw - 12}" height="${bh - 14}" rx="5" fill="${METAL}" opacity=".35"/>`;
    b += `<rect x="${-bw / 2 - 3}" y="${-bh - 42}" width="${bw + 6}" height="40" rx="8" fill="${METAL}" stroke="${OUT}" stroke-width="2"/>`;
    b += `<rect x="${-bw / 2 + 6}" y="${-bh - 58}" width="${bw - 12}" height="18" rx="6" fill="${METAL_D}" stroke="${OUT}" stroke-width="2"/>`;
    if (!dim) for (let i = 0; i < 4; i++) b += `<circle cx="${f(-bw / 2 + 14 + i * (bw - 28) / 3)}" cy="${-bh - 49}" r="2.6" fill="${METAL}"/>`;
    return b + '</g>';
  };
  for (let d = depth - 1; d >= 1; d--) g += barrel(-9 * d, true);
  g += barrel(0, false);
  if (liquid && !sc) { const p = add(A.engine, rot([bw / 2 + 24, -bh * .55], tilt)); g += `<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${tilt})"><rect x="-17" y="-48" width="34" height="96" rx="9" fill="${METAL_D}" stroke="${OUT}" stroke-width="2"/>${[-36, -24, -12, 0, 12, 24, 36].map(y => `<line x1="-12" y1="${y}" x2="12" y2="${y}" stroke="${METAL}" stroke-width="3"/>`).join('')}</g>`; }
  return g;
}

// ---------- 2 · escapamento ----------
export function exhaustLayer(A, s) {
  const e = s._engine, [cx, cy] = A.engine, sc = A.cat === 'scooter', type = s._exhaust;
  const tilt = sc ? 82 : e.layout === 'single' ? 6 : e.layout === 'parallel' ? 12 : (A.cat === 'sportbike' ? 26 : 16);
  const bw = e.layout === 'single' ? 62 : e.layout === 'parallel' ? 72 : 98, bh = 100;
  const H0 = add(A.engine, rot([sc ? 40 : bw / 2 - 4, sc ? -30 : -bh - 14], tilt));
  const Mf = [cx - (sc ? 20 : 70), cy + (sc ? 40 : 84)], Mr = A.exhaustOut;
  const u = [Mr[0] - Mf[0], Mr[1] - Mf[1]], len = Math.hypot(...u), un = [u[0] / len, u[1] / len], nn = [-un[1], un[0]];
  let g = '';
  const nPipes = Math.min(e.cylinders, 4);
  for (let i = 0; i < nPipes; i++) { const o = (i - (nPipes - 1) / 2) * 4;
    g += `<path d="M${pt(add(H0, [0, o]))} C${pt(add(H0, [26, 36 + o]))} ${pt([cx + 92, cy + 4 + o])} ${pt([cx + 62, cy + 62 + o])} S${pt([cx + 20, cy + 82 + o])} ${pt(add(Mf, [0, o * .5]))}" fill="none" stroke="${METAL}" stroke-width="9" stroke-linecap="round"/><path d="M${pt(add(H0, [0, o]))} C${pt(add(H0, [26, 36 + o]))} ${pt([cx + 92, cy + 4 + o])} ${pt([cx + 62, cy + 62 + o])} S${pt([cx + 20, cy + 82 + o])} ${pt(add(Mf, [0, o * .5]))}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>`; }
  const can = (a, b, w) => line(a, b, w + 4, METAL_D) + line(a, b, w, METAL) + line(add(a, [0, -w * .22]), add(b, [0, -w * .22]), 3, '#fff', 'stroke-opacity=".45"');
  if (type === 'stock') g += can(Mf, Mr, 34) + circ(Mr, 12, RUBBER);
  else if (type === 'twin') { const o1 = [0, 18], o2 = [0, -16]; g += can(add(Mf, o1), add(Mr, o1), 21) + can(add(Mf, [18, -4]), add(Mr, [4, -22]), 21) + circ(add(Mr, o1), 8, RUBBER) + circ(add(Mr, [4, -22]), 8, RUBBER); }
  else if (type === 'megaphone') { const p0 = [Mf[0] + un[0] * 60, Mf[1] + un[1] * 60]; g += `<polygon points="${pt(add(p0, [nn[0] * 7, nn[1] * 7]))} ${pt(add(Mr, [nn[0] * 22, nn[1] * 22]))} ${pt(add(Mr, [-nn[0] * 22, -nn[1] * 22]))} ${pt(add(p0, [-nn[0] * 7, -nn[1] * 7]))}" fill="${METAL}" stroke="${METAL_D}" stroke-width="3" stroke-linejoin="round"/>` + `<ellipse cx="${f(Mr[0])}" cy="${f(Mr[1])}" rx="8" ry="22" transform="rotate(${f(Math.atan2(un[1], un[0]) * 180 / Math.PI)} ${f(Mr[0])} ${f(Mr[1])})" fill="${RUBBER}"/>`; }
  else { const full = type === 'full' || type === 'titanium', cb = [Mr[0] - un[0] * (full ? 130 : 105), Mr[1] - un[1] * (full ? 130 : 105)], tip = add(Mr, [0, full ? -16 : 0]);
    g += line(Mf, cb, 14, METAL_D) + line(Mf, cb, 10, METAL) + can(cb, tip, full ? 28 : 30) + circ(tip, 10, RUBBER);
    if (type === 'titanium') g += line(add(cb, [30, 0]), add(tip, [-20, 0]), 5, ACC, 'stroke-opacity=".8"'); }
  return g;
}

// ---------- 3 · chassi (quadro + balança) ----------
export function chassisLayer(A, s) {
  const col = FRAME_COL[s._material] || FRAME_COL.steel, hi = s._material === 'aluminum' ? '#fff' : '#9fb0c8', H = A.head, P = A.pivot;
  const T = [A.seat[0] + 14, A.seat[1] + 34], E = [A.engine[0] + 14, A.engine[1] + 74], F = [A.engine[0] + 112, A.engine[1] + 14], RS = [A.seat[0] - 78, A.seat[1] + 40];
  const tube = (pts, w) => poly(pts, w, col) + poly(pts, Math.max(1.5, w * .18), hi, 'stroke-opacity=".28"');
  let g = tube([P, A.rear], 17);
  if (A.cat === 'scooter') return g + tube([H, [A.engine[0] + 220, A.engine[1] + 36], P], 12);
  const t = s._frame;
  if (t === 'backbone') g += tube([H, [P[0] + 20, P[1] - 80]], 18) + tube([[P[0] + 20, P[1] - 80], P], 12) + tube([[P[0] + 20, P[1] - 80], RS], 9) + tube([H, F, E, P], 8);
  else if (t === 'cradle') g += tube([H, T], 14) + tube([T, P], 12) + tube([H, F, E, P], 12) + tube([T, RS], 9);
  else if (t === 'doublecradle') g += poly([H, F, E, P].map(p => add(p, [-6, 8])), 11, col, 'opacity=".6"') + tube([H, T], 14) + tube([T, P], 12) + tube([H, F, E, P], 12) + tube([T, RS], 9);
  else if (t === 'trellis') { const m1 = lerp(H, T, .5), m2 = lerp(H, P, .5), m3 = lerp(T, P, .5), m4 = lerp(H, T, .8), m5 = lerp(H, P, .8);
    g += tube([H, T], 9) + tube([H, P], 9) + tube([T, P], 9) + tube([m1, m2, m3, m1], 6) + tube([m4, m5], 6) + tube([T, RS], 8); }
  else { const two = t === 'twinspar', w = two ? 20 : 30, mid = [lerp(H, P, .5)[0], H[1] + 34];
    if (two) g += poly([add(H, [0, 12]), add(mid, [0, 14]), add(P, [-4, -8])], 14, col, 'opacity=".55"');
    g += poly([H, mid, P], w, col) + poly([H, mid, P], w * .22, hi, 'stroke-opacity=".35"') + tube([lerp(mid, P, .55), RS], 9) + tube([[P[0] + 6, P[1] - 4], [P[0] - 10, P[1] - 54]], 14); }
  return g;
}

// ---------- 4 · suspensão (garfo, guidão, amortecedor) ----------
export function suspensionLayer(A, s) {
  const top = A.forkTop, ax = A.front, d = A.forkDir, ft = s._fork, mid = lerp(top, ax, ft === 'usd' ? .5 : .46);
  let g = '';
  if (ft === 'usd') g += line(top, mid, 18, METAL_D) + line(top, mid, 4, '#fff', 'stroke-opacity=".25"') + line(mid, ax, 11, METAL) + line(mid, ax, 3, '#fff', 'stroke-opacity=".5"') + line(lerp(top, mid, .7), add(lerp(top, mid, .7), [-26 * d[1] * 0 - 14, 0]), 4, METAL_D);
  else { g += line(top, mid, ft === 'cartridge' ? 13 : 11, METAL) + line(top, mid, 3, '#fff', 'stroke-opacity=".5"') + line(mid, ax, ft === 'cartridge' ? 15 : 14, METAL_D) + line(lerp(mid, ax, .22), lerp(mid, ax, .78), 3, ACC, ft === 'cartridge' ? '' : 'stroke-opacity="0"');
    if (ft === 'telescopic') for (let i = 0; i < 4; i++) { const p = lerp(top, mid, .2 + i * .2); g += line(add(p, [-8, 0]), add(p, [8, 0]), 3, METAL_D); } }
  g += `<rect x="${f(top[0] - 24)}" y="${f(top[1] - 4)}" width="48" height="12" rx="6" fill="${METAL_D}" stroke="${OUT}" stroke-width="2" transform="rotate(${f(-Math.atan2(d[0], d[1]) * 0)} ${f(top[0])} ${f(top[1])})"/>`;
  g += circ(A.front, 14, METAL_D, METAL, 3);
  if (A.bar === 'flat') g += line(top, [top[0] - 6, top[1] - 40], 9, METAL_D) + line([top[0] - 6, top[1] - 40], [top[0] - 50, top[1] - 44], 12, RUBBER) + `<ellipse cx="${f(top[0] - 38)}" cy="${f(top[1] - 62)}" rx="11" ry="8" fill="${METAL_D}"/>` + line([top[0] - 38, top[1] - 54], [top[0] - 38, top[1] - 44], 3, METAL_D);
  else { const y0 = top[1] + (A.cat === 'cafe-racer' ? 4 : 10); g += line([top[0] + 2, y0], [top[0] - 38, y0 - 4], 12, RUBBER) + line([top[0] - 2, y0 + 2], [top[0] + 6, y0 + 2], 8, METAL_D); }
  const sh = s._shock, dualTop = [A.rear[0] + 96, A.seat[1] + 34], dualBot = [A.rear[0] + 8, A.rear[1] - 4], monoTop = [A.pivot[0] + 40, A.seat[1] + 40], monoBot = [A.pivot[0] - 14, A.pivot[1] + 6];
  const unit = (a, b, op = '') => { const m = lerp(a, b, .38); return `<g ${op}>` + line(a, m, 9, METAL_D) + line(m, b, 12, METAL) + coil(lerp(a, b, .3), lerp(a, b, .93), 9, 9, 3.4, ACC) + circ(a, 6, METAL_D) + circ(b, 6, METAL_D) + '</g>'; };
  if (sh === 'dual') g += unit(add(dualBot, [-6, -6]), add(dualTop, [-6, -4]), 'opacity=".55"') + unit(dualBot, dualTop);
  else g += unit(monoBot, monoTop) + line(add(monoBot, [-20, 14]), monoBot, 7, METAL_D) + line(add(monoBot, [-20, 14]), add(A.pivot, [-30, 10]), 7, METAL_D);
  return g;
}

// ---------- 5 · freios ----------
export function brakesLayer(A, s) {
  const br = s._brake, rd = s.brakes && s.brakes.rearDisc, R = A.R;
  const disc = (c, r, twin) => { let o = '';
    if (twin) o += `<circle cx="${f(c[0] - 6)}" cy="${f(c[1])}" r="${f(r)}" fill="none" stroke="${METAL_D}" stroke-width="7"/>`;
    o += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="none" stroke="${METAL}" stroke-width="7"/><circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r - 4)}" fill="none" stroke="${METAL_D}" stroke-width="1.5"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; o += circ([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)], 1.6, RUBBER); } return o; };
  const cal = (c, r, ang, big, accent) => { const a = ang * Math.PI / 180, p = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)], w = big ? 22 : 18, h = big ? 40 : 32;
    return `<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(ang + 90)})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="${accent ? ACC : METAL_D}" stroke="${OUT}" stroke-width="2"/><rect x="${-w / 2 + 4}" y="${-h / 2 + 5}" width="${w - 8}" height="6" rx="3" fill="#fff" opacity=".35"/></g>`; };
  let g = '';
  if (br === 'drum') g += circ(A.front, R * .32, METAL_D, METAL, 4) + circ(A.front, R * .18, METAL, METAL_D, 2);
  else { const r = R * .6, tw = br !== 'single'; g += disc(A.front, r, tw) + cal(A.front, r, 215, br === 'radial', br === 'radial'); if (tw) g += cal(A.front, r, 240, false, false); }
  if (rd && br !== 'drum') g += disc(A.rear, R * .44, false) + cal(A.rear, R * .44, 32, false, false);
  else if (br === 'drum' || !rd) g += circ(A.rear, R * .3, METAL_D, METAL, 4);
  return g;
}

// ---------- 7 · carroceria (formas pintáveis + extras) ----------
export function bodyShapes(A, s) {
  const H = A.head, h = (x, y) => `${f(H[0] + x)} ${f(H[1] + y)}`, S = [], X = [];
  const fa = s._fairing;
  const fenderF = `M${f(A.front[0] - 62)} ${f(A.front[1] - A.R - 8)} Q${f(A.front[0])} ${f(A.front[1] - A.R - 42)} ${f(A.front[0] + 66)} ${f(A.front[1] - A.R + 2)} L${f(A.front[0] + 58)} ${f(A.front[1] - A.R + 12)} Q${f(A.front[0])} ${f(A.front[1] - A.R - 22)} ${f(A.front[0] - 56)} ${f(A.front[1] - A.R + 4)} Z`;
  if (A.cat === 'scooter') {
    S.push({ d: 'M684 186 C704 171 744 173 758 191 L746 250 C740 330 720 398 664 442 L572 442 C620 386 628 330 628 272 Z', paint: true });
    S.push({ d: 'M470 438 L660 438 L660 466 C660 470 656 472 652 472 L478 472 C470 472 466 468 466 462 Z', paint: true });
    S.push({ d: 'M312 332 C310 282 350 258 430 256 L494 262 C498 340 494 412 466 452 L360 456 C326 444 312 392 312 332 Z', paint: true });
    S.push({ d: `M${f(A.rear[0] - 112)} 372 C${f(A.rear[0] - 108)} 300 ${f(A.rear[0] - 60)} 282 ${f(A.rear[0])} 282 C${f(A.rear[0] + 66)} 282 ${f(A.rear[0] + 104)} 316 ${f(A.rear[0] + 108)} 372 L${f(A.rear[0] + 90)} 372 C${f(A.rear[0] + 86)} 328 ${f(A.rear[0] + 52)} 304 ${f(A.rear[0])} 304 C${f(A.rear[0] - 48)} 304 ${f(A.rear[0] - 86)} 328 ${f(A.rear[0] - 92)} 372 Z`, paint: true });
    S.push({ d: 'M316 258 C360 236 440 236 496 252 L494 266 C440 258 360 258 318 270 Z', paint: false, fill: 'var(--seat,#1b2029)' });
    S.push({ d: fenderF, paint: true });
    X.push(`<ellipse cx="${f(H[0] + 24)}" cy="${f(H[1] + 4)}" rx="22" ry="26" fill="var(--lamp,#f3f6ff)" stroke="${OUT}" stroke-width="3"/>`);
  } else {
    const cr = A.cat === 'cafe-racer';
    if (cr) {
      S.push({ d: 'M435 192 C452 152 560 134 656 148 C672 151 676 176 660 190 C590 207 500 214 435 202 Z', paint: true });
      S.push({ d: 'M205 232 C195 192 240 162 312 162 C362 162 402 176 438 190 L436 210 L242 236 Z', paint: true });
      S.push({ d: 'M214 238 C208 228 216 218 232 216 L330 206 L330 214 L240 240 Z', paint: false, fill: 'var(--seat,#1b2029)' });
      S.push({ d: 'M318 170 C360 164 404 178 440 192 L438 200 C400 190 360 182 318 180 Z', paint: false, fill: 'var(--seat,#1b2029)' });
      S.push({ d: fenderF, paint: true });
    } else {
      S.push({ d: 'M428 200 C452 162 556 150 640 166 L656 188 C580 208 500 216 428 218 Z', paint: true });
      S.push({ d: 'M186 240 C210 206 270 192 340 202 L444 216 L432 238 L226 250 Z', paint: true });
      S.push({ d: 'M248 214 C290 196 346 194 400 208 L400 216 C346 206 292 208 252 224 Z', paint: false, fill: 'var(--seat,#1b2029)' });
      if (fa === 'none') S.push({ d: fenderF, paint: true });
    }
    if (fa === 'half' || fa === 'touring') {
      const tall = fa === 'touring' ? -34 : 0;
      S.push({ d: `M${h(-34, -34)} C${h(-10, -66 + tall)} ${h(40, -46 + tall)} ${h(52, -4)} C${h(60, 36)} ${h(38, 64)} ${h(6, 64)} C${h(-26, 62)} ${h(-44, 22)} ${h(-34, -34)} Z`, paint: true });
      X.push(`<path d="M${h(-14, -60 + tall)} L${h(18, -52 + tall)} L${h(26, -16)} L${h(-8, -20)} Z" fill="#cfe4ff" fill-opacity=".38" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`);
    }
    if (fa === 'full' || fa === 'winglets') {
      S.push({ d: `M${h(-64, -2)} C${h(-34, -44)} ${h(-10, -62)} ${h(16, -62)} L${h(32, -30)} C${h(70, -4)} ${h(92, 40)} ${h(76, 84)} L${h(34, 112)} C${h(-20, 140)} ${h(-90, 170)} ${h(-170, 182)} L${h(-196, 160)} C${h(-150, 128)} ${h(-100, 84)} ${h(-58, 24)} Z`, paint: true });
      X.push(`<path d="M${h(-6, -60)} L${h(20, -60)} L${h(32, -28)} L${h(-18, -24)} Z" fill="#cfe4ff" fill-opacity=".38" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`);
      if (fa === 'winglets') S.push({ d: `M${h(44, 80)} L${h(104, 70)} L${h(96, 92)} L${h(40, 100)} Z`, paint: true });
    }
    if (fa === 'none' || fa === 'half' || fa === 'touring') X.push(`<ellipse cx="${f(H[0] + 28)}" cy="${f(H[1] + 14)}" rx="20" ry="25" transform="rotate(-18 ${f(H[0] + 28)} ${f(H[1] + 14)})" fill="var(--lamp,#f3f6ff)" stroke="${OUT}" stroke-width="3"/>`);
    else X.push(`<ellipse cx="${f(H[0] + 50)}" cy="${f(H[1] + 34)}" rx="14" ry="22" transform="rotate(-18 ${f(H[0] + 50)} ${f(H[1] + 34)})" fill="var(--lamp,#f3f6ff)" stroke="${OUT}" stroke-width="3"/>`);
  }
  return { shapes: S, extras: X.join('') };
}

// ---------- 8 · eletrônicos (detalhes pequenos) ----------
export function electronicsLayer(A, s) {
  const ids = s._electronics, H = A.head, top = A.forkTop; let g = '';
  const lamp = A.cat === 'scooter' ? [H[0] + 24, H[1] + 4] : (s._fairing === 'full' || s._fairing === 'winglets') ? [H[0] + 50, H[1] + 34] : [H[0] + 28, H[1] + 14];
  if (ids.includes('led')) g += `<ellipse cx="${f(lamp[0])}" cy="${f(lamp[1])}" rx="26" ry="31" fill="none" stroke="${ACC}" stroke-width="3" stroke-opacity=".9"/><ellipse cx="${f(lamp[0])}" cy="${f(lamp[1])}" rx="33" ry="38" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`;
  if (ids.includes('tft')) g += `<g transform="translate(${f(top[0] - 30)} ${f(top[1] - 26)}) rotate(-18)"><rect width="34" height="20" rx="4" fill="#0a1226" stroke="${METAL}" stroke-width="2"/><rect x="4" y="4" width="14" height="4" rx="2" fill="var(--accent,#3ccb4f)"/><rect x="4" y="11" width="24" height="3" rx="1.5" fill="#fff" opacity=".6"/></g>`;
  if (ids.includes('radar')) g += `<rect x="${f(lamp[0] + 18)}" y="${f(lamp[1] - 4)}" width="14" height="30" rx="5" fill="#0a1226" stroke="${METAL}" stroke-width="2"/><circle cx="${f(lamp[0] + 25)}" cy="${f(lamp[1] + 11)}" r="3.5" fill="${ACC}"/>`;
  if (ids.some(i => ['cruise', 'riding_modes', 'traction_control', 'quickshifter', 'imu'].includes(i))) g += [0, 1, 2].map(i => circ([top[0] - 16 - i * 7, top[1] + (A.cat === 'scooter' ? -52 : 12)], 2.4, 'var(--accent,#3ccb4f)')).join('');
  return g;
}
