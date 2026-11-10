import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
im=Image.open(sys.argv[1]).convert('RGB')
SET=sys.argv[2]
a=np.array(im).astype(float)
mx=a.max(2);mn=a.min(2);sat=(mx-mn)/np.maximum(mx,1)
# checker: neutral, mid-gray (tones ~150 and ~178); sticker border is >=235
bg=(sat<0.06)&(mx<212)&(mx>120)
bg=ndi.binary_opening(bg,iterations=1)
# sticker = everything not checker; drop specks, fill holes
bg2=(sat<0.06)&(mx<226)&(mx>120)
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
objs=ndi.find_objects(lab)
items=[]
for k in keep:
    sl=objs[k-1];cy=(sl[0].start+sl[0].stop)/2;cx=(sl[1].start+sl[1].stop)/2
    items.append((int(cy>384),cx,k))
items.sort()
assert len(items)==8
order=[k for _,_,k in items]
outs=[]
for i,k in enumerate(order):
    m=ndi.binary_fill_holes(lab==k)
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
    c=ImageOps_pad=Image.new('RGBA',(c.width+2*pad,c.height+2*pad),(0,0,0,0)).__class__  # placeholder
    c=Image.fromarray(out,'RGBA').crop((x0,y0,x1,y1))
    t=Image.new('RGBA',(c.width+2*pad,c.height+2*pad),(255,255,255,0));t.paste(c,(pad,pad))
    s=min(1,512/max(t.size))
    if s<1: t=t.resize((max(1,round(t.width*s)),max(1,round(t.height*s))),Image.LANCZOS)
    cv=Image.new('RGBA',(512,512),(0,0,0,0))
    cv.paste(t,((512-t.width)//2,(512-t.height)//2))
    name=f'/home/claude/stickers/out/{SET}-{i+1:02d}-{slugs[i]}'
    cv.save(name+'.png');cv.save(name+'.webp',quality=85,method=6)
    outs.append(cv)
sfx='' if SET=='goose' else '-'+SET
for fn,col in [(f'preview{sfx}.png','#1b2426'),(f'preview{sfx}-light.png','#ffffff')]:
    sh=Image.new('RGBA',(4*512,2*512),col)
    for i,o in enumerate(outs): sh.alpha_composite(o,((i%4)*512,(i//4)*512))
    sh.convert('RGB').save('/home/claude/stickers/out/'+fn)
