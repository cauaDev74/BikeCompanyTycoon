// node build.mjs  → gera silhouettes/, examples/ e demo.html
import fs from 'node:fs';
import { renderBikeSVG, PAINTS, FINISHES } from './renderer.js';
import { CATEGORIES } from './geometry.js';
import { OPTIONS } from './parts.js';
const base = JSON.parse(fs.readFileSync('./bikespec-example.json', 'utf8'));
const wrap = r => `<?xml version="1.0" encoding="UTF-8"?>\n` + r.svg.replace('<svg ', '<svg ').replace(/\n/g, '') + '\n';
const examples = {
  'cafe-1960-classic': base,
  'cafe-trellis-alloy': { ...base, frame: { type: 'trellis', material: 'steel' }, fork: 'cartridge', shock: 'mono', brakes: { front: 'single', rearDisc: true }, wheels: 'alloy', tyres: 'sport', exhaust: 'megaphone', engine: { layout: 'inline', cylinders: 4, cooling: 'liquid' }, paint: { color: '#1f5a3a', accent: '#f2c230', finish: 'satin' } },
  'scooter-commuter': { category: 'scooter', engine: { layout: 'single', cylinders: 1, cooling: 'air' }, paint: { color: '#22c8a8', accent: '#ffffff', finish: 'gloss' }, electronics: ['led'] },
  'scooter-modern': { category: 'scooter', engine: { layout: 'single', cylinders: 1, cooling: 'liquid' }, wheels: 'alloy', tyres: 'touring', fork: 'cartridge', brakes: { front: 'single', rearDisc: false }, paint: { color: '#e9ecef', accent: '#1f5fd1', finish: 'metallic' }, electronics: ['led', 'tft'] },
  'sport-superbike': { category: 'sportbike', engine: { layout: 'inline', cylinders: 4, cooling: 'liquid' }, frame: { type: 'twinspar', material: 'aluminum' }, fork: 'usd', shock: 'mono', brakes: { front: 'radial', rearDisc: true }, wheels: 'forged', tyres: 'track', fairing: 'full', exhaust: 'titanium', electronics: ['tft', 'led', 'quickshifter', 'imu'], paint: { color: '#c8102e', accent: '#ffffff', finish: 'gloss' } },
  'sport-winglets-chrome': { category: 'sportbike', engine: { layout: 'inline', cylinders: 4, cooling: 'liquid' }, frame: { type: 'perimeter', material: 'carbon' }, fork: 'usd', shock: 'mono', brakes: { front: 'twin', rearDisc: true }, wheels: 'carbon', tyres: 'sport', fairing: 'winglets', exhaust: 'full', electronics: ['tft', 'radar'], paint: { color: '#121417', accent: '#ff6a1a', finish: 'chrome' } },
  'sport-naked-twin': { category: 'sportbike', engine: { layout: 'parallel', cylinders: 2, cooling: 'liquid' }, frame: { type: 'trellis', material: 'steel' }, fork: 'cartridge', shock: 'mono', brakes: { front: 'twin', rearDisc: true }, wheels: 'alloy', tyres: 'sport', fairing: 'half', exhaust: 'slipon', paint: { color: '#ff6a1a', accent: '#121417', finish: 'matte' } },
  'cafe-single-spoke': { category: 'cafe-racer', engine: { layout: 'single', cylinders: 1, cooling: 'air' }, frame: { type: 'backbone', material: 'steel' }, wheels: 'steel', tyres: 'commuter', exhaust: 'stock', paint: { color: '#1f5fd1', accent: '#e9ecef', finish: 'gloss' } },
  'cafe-double-cradle': { category: 'cafe-racer', engine: { layout: 'inline', cylinders: 4, cooling: 'oil' }, frame: { type: 'doublecradle', material: 'steel' }, fork: 'usd', shock: 'dual', brakes: { front: 'twin', rearDisc: true }, wheels: 'alloy', tyres: 'sport', fairing: 'half', exhaust: 'full', paint: { color: '#6a2c6e', accent: '#f2c230', finish: 'metallic' } },
  'sport-offroad-tyres': { category: 'sportbike', engine: { layout: 'single', cylinders: 1, cooling: 'liquid' }, frame: { type: 'backbone', material: 'aluminum' }, tyres: 'offroad', wheels: 'spoke', fairing: 'touring', exhaust: 'megaphone', paint: { color: '#f2c230', accent: '#121417', finish: 'satin' } },
  'cafe-semiactive-approx': { ...base, fork: 'semiactive', shock: 'linkage', brakes: { front: 'monoblock', rearDisc: true }, frame: { type: 'monocoque', material: 'carbon' }, exhaust: 'underseat', engine: { layout: 'v', cylinders: 2 } , paint: { color: '#4a5560', accent: '#3ccb4f', finish: 'metallic' } }
};
fs.mkdirSync('examples', { recursive: true }); fs.mkdirSync('silhouettes', { recursive: true });
const report = [];
for (const [k, spec] of Object.entries(examples)) { const r = renderBikeSVG(spec, { uid: k.replace(/[^a-z0-9]/g, '') }); fs.writeFileSync(`examples/bike2d-${k}.svg`, wrap(r)); report.push({ k, kb: +(r.svg.length / 1024).toFixed(1), maxLayerKb: +(Math.max(...Object.values(r.layerSizes)) / 1024).toFixed(1), warnings: r.warnings }); }
for (const c of CATEGORIES) { const r = renderBikeSVG({ category: c, paint: { color: '#c8102e' } }, { uid: 'sil' + c.replace(/-/g, ''), only: ['wheels', 'body'] }); fs.writeFileSync(`silhouettes/bike2d-sil-${c}.svg`, wrap(r)); }
fs.writeFileSync('build-report.json', JSON.stringify(report, null, 1));
// demo.html autônomo: inlina os módulos
const strip = f => fs.readFileSync(f, 'utf8').replace(/^import .*$/gm, '').replace(/^export (const|function)/gm, '$1');
const css = fs.readFileSync('../tokens/design-tokens.css', 'utf8') + fs.readFileSync('../ui/glass.css', 'utf8');
const tpl = fs.readFileSync('demo.template.html', 'utf8');
const data = { options: OPTIONS, paints: PAINTS, finishes: FINISHES, categories: CATEGORIES, examples };
fs.writeFileSync('demo.html', tpl.replace('/*CSS*/', css).replace('/*CODE*/', strip('geometry.js') + '\n' + strip('parts.js') + '\n' + strip('renderer.js') + `\nconst DATA=${JSON.stringify(data)};`));
console.log(JSON.stringify(report.map(r => [r.k, r.kb, r.maxLayerKb, r.warnings.length])));
