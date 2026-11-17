// Gerador de logo da empresa do jogador: 8 formas x cor primária x cor secundária opcional.
export const LOGO_SHAPES = {
  shield:'M50 6L88 20V50C88 74 72 90 50 96C28 90 12 74 12 50V20Z',
  circle:'M50 6a44 44 0 1 0 .01 0Z',
  hexagon:'M50 5L89 27.5V72.5L50 95L11 72.5V27.5Z',
  diamond:'M50 4L96 50L50 96L4 50Z',
  star:(()=>{let p=[];for(let i=0;i<10;i++){const r=i%2?19:46,a=-Math.PI/2+i*Math.PI/5;p.push((50+r*Math.cos(a)).toFixed(1)+' '+(52+r*Math.sin(a)).toFixed(1))}return 'M'+p.join('L')+'Z'})(),
  chevron:'M12 14H88V56L50 92L12 56Z',
  roundel:'M24 8H76A16 16 0 0 1 92 24V76A16 16 0 0 1 76 92H24A16 16 0 0 1 8 76V24A16 16 0 0 1 24 8Z',
  pennant:'M10 12L92 50L10 88Z'
};
export function companyLogoSVG({shape='shield',primary='#c8102e',secondary=null,size=96}={}){
  const d=LOGO_SHAPES[shape]||LOGO_SHAPES.shield, inner=secondary||'#ffffff';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="Logo da empresa"><path d="${d}" fill="${primary}" stroke="#ffffff" stroke-opacity=".9" stroke-width="3" stroke-linejoin="round"/><path d="${d}" fill="${inner}" transform="translate(50 50) scale(.5) translate(-50 -50)"/></svg>`;
}
