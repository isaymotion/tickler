const topo=require('topojson-client');const fs=require('fs');
const w=JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-10m.json'));
const f=topo.feature(w,w.objects.countries.geometries.find(g=>g.id==='608'));
const lon0=116.8,lat1=21.3,k=61.5,kx=Math.cos(12.5*Math.PI/180);
const P=([lo,la])=>[(lo-lon0)*kx*k,(lat1-la)*k];
let polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
function dp(pts,t){if(pts.length<3)return pts;const keep=new Array(pts.length).fill(false);keep[0]=keep[pts.length-1]=true;const st=[[0,pts.length-1]];
while(st.length){const[a,b]=st.pop();let md=0,mi=-1;const[x1,y1]=pts[a],[x2,y2]=pts[b];const dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy)||1e-9;
for(let i=a+1;i<b;i++){const d=Math.abs(dy*pts[i][0]-dx*pts[i][1]+x2*y1-y2*x1)/l;if(d>md){md=d;mi=i}}
if(md>t){keep[mi]=true;st.push([a,mi],[mi,b])}}return pts.filter((_,i)=>keep[i])}
const area=r=>{let s=0;for(let i=0;i<r.length;i++){const[a,b]=r[i],[c,d]=r[(i+1)%r.length];s+=a*d-c*b}return s/2};
let d='';
for(const poly of polys){poly.forEach((ring,ri)=>{let p=ring.map(P);
 if(ri===0&&Math.abs(area(p))<6)return; if(ri>0&&Math.abs(area(p))<6)return;
 p=dp(p.slice(0,-1),0.35);if(p.length<3)return;
 const q=p.map(([x,y])=>[+x.toFixed(1),+y.toFixed(1)]);
 d+='M'+q.map(a=>a.join(' ')).join('L')+'Z';});}
const w2=+((126.8-lon0)*kx*k).toFixed(1),h=+((lat1-4.4)*k).toFixed(1);
fs.writeFileSync('path.json',JSON.stringify({w:w2,h,lon0,lat1,k,kx:+kx.toFixed(5),path:d}));
console.log(w2,h,d.length);
