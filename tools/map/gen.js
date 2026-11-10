const M=require('./path.json');const S=require('./places_src.js');
const kx=M.kx,k=M.k;
const pl=S.map(([n,p,lo,la,aka,kind])=>{const o={n,p,x:+((lo-M.lon0)*kx*k).toFixed(1),y:+((M.lat1-la)*k).toFixed(1)};if(aka&&aka.length)o.aka=aka;if(kind)o.kind=kind;return o});
const hdr=`/* Offline Philippines hometown map data.
 * Outline: Natural Earth 10m admin-0 countries (public domain) via the npm package world-atlas (countries-10m.json),
 * simplified (Douglas-Peucker, ~0.35px) and projected equirectangular: x=(lon-lon0)*kx*k, y=(lat1-lat)*k, kx=cos(12.5deg).
 * Place coordinates are approximate (about 0.05 deg) and meant for plotting dots only.
 */
`;
const out=hdr+'window.PH_MAP = '+JSON.stringify(M).replace(/"(\w+)":/g,'$1:')+';\nwindow.PH_PLACES = [\n'+pl.map(o=>' '+JSON.stringify(o).replace(/"(\w+)":/g,'$1:')).join(',\n')+'\n];\n';
require('fs').writeFileSync('places.js',out);
console.log(pl.length,pl.filter(p=>p.kind==='province').length);
