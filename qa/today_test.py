import json, sys, threading, http.server, functools, socketserver
from playwright.sync_api import sync_playwright
root=sys.argv[1]; out=sys.argv[2]
H=functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
H.log_message=lambda *a,**k:None
srv=socketserver.TCPServer(('127.0.0.1',0),H); port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
cards=[]
for i,(n,cart,pl) in enumerate([('Ana Reyes','Doraemon',2),('Ben Santos','Avatar: The Last Airbender, a very long answer '*4,1),('Carla Lim','',0),('Dan Cruz','SpongeBob',0)]):
    c={'id':'p%d'%i,'name':n,'bmonth':3,'bday':i+1,'byear':1997,'updated':1,'cartoons':cart,'food':'Sinigang' if i<3 else '','hometown':'Balanga'}
    c['playlists']=[{'label':'%s mix %d'%(n.split()[0],k),'url':'https://open.spotify.com/playlist/x%d%d'%(i,k)} for k in range(pl)]
    cards.append(c)
errs=[]; ok=lambda c,m: print(('PASS ' if c else 'FAIL ')+m)
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,vp,scheme in [('phone',{'width':390,'height':844},'light'),('phone-dark',{'width':390,'height':844},'dark'),('desk',{'width':1280,'height':900},'light')]:
        ctx=b.new_context(viewport=vp,color_scheme=scheme); pg=ctx.new_page()
        pg.route('**/*',lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('http://127.0.0.1:%d/'%port)
        pg.evaluate("c=>{localStorage.setItem('bt:v1:batch',JSON.stringify(c));localStorage.setItem('bt:v1:seenNews',JSON.stringify('1.10.0'))}",cards)
        pg.reload(); pg.wait_for_timeout(500)
        t=pg.inner_text('.today-grid')
        ok('Featured Spotify playlist today'.upper() in t.upper() or 'Featured Spotify playlist today' in t, name+' pl card')
        ok('Featured fact of the day'.upper() in t.upper(), name+' fact card')
        n=pg.locator('.today__list li').count(); ok(n>=2, name+' fact rows=%d'%n)
        a1=pg.inner_text('.today__pl h3'); pg.click('[data-another="pl"]'); pg.wait_for_timeout(200); a2=pg.inner_text('.today__pl h3')
        ok(a1!=a2, name+' another pl %s -> %s'%(a1,a2))
        q1=pg.inner_text('.today__q'); pg.click('[data-another="fact"]'); pg.wait_for_timeout(200); q2=pg.inner_text('.today__q')
        ok(q1!=q2, name+' another fact %s -> %s'%(q1,q2))
        ow=pg.evaluate('document.documentElement.scrollWidth>innerWidth'); ok(not ow, name+' no overflow')
        href=pg.get_attribute('.today__pl ~ .today__acts a, .today__acts a.btn--solid','href'); ok(href.startswith('https://open.spotify.com/'), name+' spotify href')
        pg.locator('.today-grid').screenshot(path='%s/%s.png'%(out,name))
        ctx.close()
    # empty batch: no section
    ctx=b.new_context(); pg=ctx.new_page(); pg.goto('http://127.0.0.1:%d/'%port); pg.wait_for_timeout(300)
    ok(pg.locator('.today-grid').count()==0,'empty batch hides section'); ctx.close()
    b.close()
ok(not errs,'no page errors %s'%errs)
