import { anchors, VIEWBOX, GEO } from './geometry.js';
import { FALLBACK, OPTIONS, wheelsParts, engineLayer, exhaustLayer, chassisLayer, suspensionLayer, brakesLayer, bodyShapes, electronicsLayer } from './parts.js';

export const STAGES = ['engine', 'exhaust', 'chassis', 'suspension', 'brakes', 'wheels', 'body', 'electronics', 'paint'];
export const FINISHES = ['gloss', 'matte', 'satin', 'metallic', 'chrome'];
export const PAINTS = { 'Racing Red': '#c8102e', 'Signal Orange': '#ff6a1a', 'Sunburst Yellow': '#f2c230', 'British Green': '#1f5a3a', 'Teal Mist': '#22c8a8', 'Ocean Blue': '#1f5fd1', 'Midnight Navy': '#15213a', 'Plum': '#6a2c6e', 'Pearl White': '#e9ecef', 'Silver': '#a9b1ba', 'Gunmetal': '#4a5560', 'Jet Black': '#121417' };
// z-order do DOM (de baixo para cima). A ANIMAÇÃO usa data-stage (1 a 9), que segue a ordem do GDD.
const Z = ['wheels', 'chassis', 'suspension', 'engine', 'exhaust', 'brakes', 'body', 'paint', 'electronics'];

function resolve(slot, id, def, warn) {
  const map = FALLBACK[slot] || {}, ok = OPTIONS[slot] || [];
  if (id == null) return def;
  if (map[id]) { warn.push(`${slot}: «${id}» aproximado como «${map[id]}»`); return map[id]; }
  if (ok.length && !ok.includes(id)) { warn.push(`${slot}: «${id}» desconhecido, usando «${def}»`); return def; }
  return id;
}
const hex = c => (/^#[0-9a-f]{6}$/i.test(c) ? c : '#c8102e');

export function renderBikeSVG(spec, opts = {}) {
  const warn = [], uid = opts.uid || 'b2d', only = opts.only || null;
  const cat = spec.category; if (!GEO[cat]) throw new Error(`Categoria «${cat}» ainda sem silhueta (Fase 2: ${Object.keys(GEO).join(', ')})`);
  const A = anchors(cat), g = GEO[cat], e = spec.engine || {};
  const layout = FALLBACK.engine[e.layout] || e.layout || 'single';
  if (FALLBACK.engine[e.layout]) warn.push(`engine: layout «${e.layout}» aproximado como «${layout}»`);
  const s = { ...spec, _uid: uid,
    _engine: { layout: ['single', 'parallel', 'inline'].includes(layout) ? layout : 'single', cylinders: e.cylinders || (layout === 'single' ? 1 : layout === 'parallel' ? 2 : 4), cooling: e.cooling || (layout === 'inline' ? 'liquid' : 'air') },
    _frame: resolve('frame', spec.frame && spec.frame.type, g.frame, warn), _material: (spec.frame && spec.frame.material) || 'steel',
    _fork: resolve('fork', spec.fork, g.fork, warn), _shock: resolve('shock', spec.shock, g.shock, warn),
    _brake: resolve('brake', spec.brakes && spec.brakes.front, 'single', warn), _exhaust: resolve('exhaust', spec.exhaust, g.exhaust, warn),
    wheels: resolve('wheels', spec.wheels, g.wheels, warn), tyres: resolve('tyres', spec.tyres, g.tyres, warn),
    _fairing: cat === 'scooter' ? 'none' : resolve('fairing', spec.fairing, 'none', warn), _electronics: spec.electronics || [] };
  if (cat === 'scooter' && spec.fairing && spec.fairing !== 'none') warn.push('fairing: scooter não usa carenagem (ignorada)');
  const paint = spec.paint || {}, color = hex(paint.color), accent = hex(paint.accent || '#f2c230'), finish = FINISHES.includes(paint.finish) ? paint.finish : 'gloss';
  const body = bodyShapes(A, s);
  const layers = {
    engine: engineLayer(A, s), exhaust: exhaustLayer(A, s), chassis: chassisLayer(A, s), suspension: suspensionLayer(A, s), brakes: brakesLayer(A, s),
    wheels: wheelsParts(A, s),
    body: body.shapes.map(p => `<path d="${p.d}" fill="${p.paint ? 'var(--primer,#9aa6b5)' : p.fill}" stroke="var(--outline,rgba(7,26,74,.55))" stroke-width="2.5" stroke-linejoin="round"/>`).join('')   ,
    electronics: body.extras + electronicsLayer(A, s), paint: ''
  };
  const clipId = `${uid}-clip`, painted = body.shapes.filter(p => p.paint);
  const defs = `<clipPath id="${clipId}">${painted.map(p => `<path d="${p.d}"/>`).join('')}</clipPath>
<linearGradient id="${uid}-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".55" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>
<linearGradient id="${uid}-hi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset=".32" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${uid}-chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8ff"/><stop offset=".28" stop-color="#8d9bb0"/><stop offset=".5" stop-color="#e9eef7"/><stop offset=".62" stop-color="#5a6678"/><stop offset="1" stop-color="#c9d3e2"/></linearGradient>
<pattern id="${uid}-flake" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#fff" fill-opacity=".55"/><circle cx="6.5" cy="6" r=".8" fill="#fff" fill-opacity=".35"/></pattern>`;
  const full = '<rect x="0" y="0" width="1000" height="600"';
  let pnt = `<g clip-path="url(#${clipId})">`;
  if (finish === 'chrome') pnt += `${full} fill="url(#${uid}-chrome)"/>${full} fill="url(#${uid}-hi)" opacity=".5"/>`;
  else { pnt += `${full} fill="var(--paint,#c8102e)"/>${full} fill="url(#${uid}-shade)"/>`;
    if (finish === 'gloss') pnt += `${full} fill="url(#${uid}-hi)"/>`;
    if (finish === 'satin') pnt += `${full} fill="url(#${uid}-hi)" opacity=".35"/>`;
    if (finish === 'metallic') pnt += `${full} fill="url(#${uid}-flake)"/>${full} fill="url(#${uid}-hi)" opacity=".5"/>`; }
  const st = g.stripe; pnt += `<polyline points="${st.map(p => p.join(',')).join(' ')}" fill="none" stroke="var(--accent-paint,#f2c230)" stroke-width="12" stroke-linecap="butt" opacity="${finish === 'chrome' ? 0 : .95}"/></g>`;
  layers.paint = pnt;
  const wb = (A.front[0] - A.rear[0]) / 2 + A.R;
  const css = `<style>.b2d-anim .b2d-layer{animation:b2d-in 520ms cubic-bezier(.2,.8,.2,1) both;animation-delay:calc((var(--stage) - 1) * 520ms)}@keyframes b2d-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.b2d-anim .b2d-layer{animation:none}}</style>`;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" class="bike2d${opts.animate ? ' b2d-anim' : ''}" viewBox="${VIEWBOX}" role="img" aria-label="${cat}" style="--paint:${color};--accent-paint:${accent}">${css}<defs>${defs}</defs>`;
  out += `<ellipse cx="${(A.rear[0] + A.front[0]) / 2}" cy="${A.groundY + 4}" rx="${wb + 10}" ry="11" fill="#071a4a" opacity=".38"/>`;
  const sizes = {};
  for (const k of Z) { if (only && !only.includes(k)) continue; sizes[k] = layers[k].length;
    out += `<g id="${uid}-layer-${k}" class="b2d-layer" data-stage="${STAGES.indexOf(k) + 1}" style="--stage:${STAGES.indexOf(k) + 1}">${layers[k]}</g>`; }
  out += '</svg>';
  return { svg: out, warnings: warn, layerSizes: sizes, anchors: { rearAxle: A.rear, frontAxle: A.front, steeringHead: A.head, forkPivot: A.forkTop, engineMount: A.engine, exhaustOut: A.exhaustOut, seat: A.seat, swingarmPivot: A.pivot, ground: A.groundY } };
}
