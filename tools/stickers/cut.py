import sys, os
# Usage: [CHECK=lo,hi] [STICKER_OUT=dir] python3 cut.py <sheet.jpg> <set> [slug1,...,slug8] [first-number]
#   e.g. CHECK=55,125 python3 cut.py src/goose-sheet-2.jpg goose dance,time-to-eat,time-to-sleep,karaoke,brb,nerd-mode,daldal,hugs 9
#   CHECK = tone range of the fake checkerboard (default 120,212 for light gray; 55,125 for the dark ones)
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
im=Image.open(sys.argv[1]).convert('RGB')
SET=sys.argv[2]
# checker tone range: default light gray checker (150/178); dark sheets: CHECK=55,125
LO,HI=[int(v) for v in os.environ.get('CHECK','120,212').split(',')]
a=np.array(im).astype(float)
mx=a.max(2);mn=a.min(2)
# neutral = low chroma; absolute floor so dark checkers with a slight tint still count
sat=(mx-mn)/np.maximum(mx,1)
sat=np.where((mx-mn)<10,0,sat)
# checker: neutral, mid-gray (tones ~150 and ~178); sticker border is >=235
bg=(sat<0.06)&(mx<HI)&(mx>LO)
bg=ndi.binary_opening(bg,iterations=1)
# sticker = everything not checker; drop specks, fill holes
bg2=(sat<0.06)&(mx<HI+14)&(mx>LO)
bg2=ndi.binary_opening(bg2,structure=np.ones((3,3)))
bl,bn=ndi.label(bg2)
bs=ndi.sum(bg2,bl,range(1,bn+1))
bgbig=np.isin(bl,[i+1 for i,v in enumerate(bs) if v>40])
bgbig=ndi.binary_dilation(bgbig,iterations=1)
st=~bg
st=ndi.binary_opening(st,structure=np.ones((3,3)),iterations=2)
lab,n=ndi.label(st)
sizes=ndi.sum(st,lab,range(1,n+1))
keep=[i+1 for i,s in enumerate(sizes) if s>5000]
print(n,len(keep),[int(sizes[k-1]) for k in keep])
slugs=['congrats','you-got-this','amazing','sadness','cheer-up','hooray','love','crying']
# optional: argv[3] = comma-separated 8 slugs, argv[4] = first sticker number (default 1)
if len(sys.argv)>3: slugs=sys.argv[3].split(',')
START=int(sys.argv[4]) if len(sys.argv)>4 else 1
OUT=os.environ.get('STICKER_OUT','/home/claude/stickers/out')
os.makedirs(OUT,exist_ok=True)
objs=ndi.find_objects(lab)
# group every piece >300 px into its 4x2 grid cell (detached notes/sparkles stay with their sticker)
H,W=a.shape[:2]
cells={}
for k in range(1,n+1):
    if sizes[k-1]<300: continue
    sl=objs[k-1];cy=(sl[0].start+sl[0].stop)/2;cx=(sl[1].start+sl[1].stop)/2
    cells.setdefault((int(cy>H/2),min(3,int(cx/(W/4)))),[]).append(k)
cells={c:ks for c,ks in cells.items() if sum(sizes[k-1] for k in ks)>20000}
assert len(cells)==8, sorted(cells)
outs=[]
for i,c in enumerate(sorted(cells)):
    m=np.isin(lab,cells[c])
    m=ndi.binary_fill_holes(m)
    m=ndi.binary_closing(m,iterations=2)
    m=ndi.binary_fill_holes(m)
    m&=~bgbig
    m=ndi.binary_opening(m,iterations=1)
    # smooth edge: soft alpha from slightly blurred mask, eroded ~0.5px to kill gray fringe
    al=ndi.gaussian_filter(m.astype(float),1.0)
    al=np.clip((al-0.5)*2.2+0.5,0,1)
    ys,xs=np.where(al>0.01)
    y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgb=a.copy()
    # decontaminate fringe: for edge pixels, replace color with nearest solid-sticker color
    core=ndi.binary_erosion(m,iterations=2)
    idx=ndi.distance_transform_edt(~core,return_distances=False,return_indices=True)
    fringe=(al>0)&~core
    rgb[fringe]=a[idx[0][fringe],idx[1][fringe]]
    # keep real pixels for core; fringe is white border so nearest is white-ish
    out=np.dstack([rgb,al*255]).clip(0,255).astype(np.uint8)
    pad=6
    c=Image.fromarray(out,'RGBA').crop((x0,y0,x1,y1))
    t=Image.new('RGBA',(c.width+2*pad,c.height+2*pad),(255,255,255,0));t.paste(c,(pad,pad))
    s=min(1,512/max(t.size))
    if s<1: t=t.resize((max(1,round(t.width*s)),max(1,round(t.height*s))),Image.LANCZOS)
    cv=Image.new('RGBA',(512,512),(0,0,0,0))
    cv.paste(t,((512-t.width)//2,(512-t.height)//2))
    name=f'{OUT}/{SET}-{i+START:02d}-{slugs[i]}'
    cv.save(name+'.png');cv.save(name+'.webp',quality=85,method=6)
    outs.append(cv)
sfx='-'+SET+('' if START==1 else f'-{START:02d}')
for fn,col in [(f'preview{sfx}.png','#1b2426'),(f'preview{sfx}-light.png','#ffffff')]:
    sh=Image.new('RGBA',(4*512,2*512),col)
    for i,o in enumerate(outs): sh.alpha_composite(o,((i%4)*512,(i//4)*512))
    sh.convert('RGB').save(os.path.join(OUT,fn))
