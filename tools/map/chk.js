global.window={};require('./places.js');const M=window.PH_MAP;
const rings=M.path.split('Z').filter(Boolean).map(s=>s.slice(1).split('L').map(p=>p.split(' ').map(Number)));
const inside=(x,y)=>{let c=false;for(const r of rings){for(let i=0,j=r.length-1;i<r.length;j=i++){const[a,b]=r[i],[p,q]=r[j];if((b>y)!=(q>y)&&x<(p-a)*(y-b)/(q-b)+a)c=!c}}return c};
const dist=(x,y)=>{let m=1e9;for(const r of rings)for(let i=0;i<r.length;i++){const[a,b]=r[i],[c,d]=r[(i+1)%r.length];const dx=c-a,dy=d-b,t=Math.max(0,Math.min(1,((x-a)*dx+(y-b)*dy)/(dx*dx+dy*dy||1)));m=Math.min(m,Math.hypot(x-a-t*dx,y-b-t*dy))}return m};
for(const p of window.PH_PLACES){if(!inside(p.x,p.y)){const d=dist(p.x,p.y);if(d>1.5)console.log(p.n,'|',p.p,d.toFixed(1)+'px',(d/M.k/1).toFixed(2)+'deg')}}
