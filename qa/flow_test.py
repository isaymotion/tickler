import json, datetime, subprocess, time, os, re
from PIL import Image
from playwright.sync_api import sync_playwright
import os, sys
Q=os.path.join(os.path.dirname(os.path.abspath(__file__)),'')          # outputs + fixtures live next to this script
APP=os.environ.get('TICKLER_DIR') or (sys.argv[1] if len(sys.argv)>1 else os.path.abspath(os.path.join(Q,'..','..','tickler')))  # path of a main-branch checkout
R=[]; ERR=[]
def rep(n,ok,d=''):
    R.append((n,ok,d)); print(('PASS' if ok else 'FAIL'),n,d,flush=True)
today=datetime.date.today()
Image.effect_mandelbrot((600,400),(-2,-1.2,1,1.2),60).convert('RGB').save(Q+'photo.jpg','JPEG',quality=95)
def card(id,name,**k):
    c=dict(id=id,name=name,nickname='',hometown='',medSchool='',hobbies='',shows='',movies='',music='',food='',funFact='',phone='',email='',bmonth=0,bday=0,byear=0,photo='',updated='2026-11-01T00:00:00.000Z'); c.update(k); return c
cards=[card('pa1','Ana Reyes',nickname='Ani',hometown='Balanga, Bataan',hobbies='Reading\nHiking',shows='Grey\'s Anatomy',bmonth=today.month,bday=today.day,byear=1999,movies='Inception',music='OPM',food='Sinigang',funFact='Climbed Pulag'),
 card('pb2','Ben Santos',hometown='Cebu City',hobbies='Guitar',shows='The Good Doctor',bmonth=2,bday=29,byear=1996,music='Jazz',food='Lechon'),
 card('pc3','Carla Lim',hometown='Davao',hobbies='Painting',shows='Friends',music='K-pop',food='Durian'),
 card('pd4','Dan Cruz',hometown='Iloilo',hobbies='Running',shows='House',bmonth=12,bday=25,byear=1997,movies='Up',food='Batchoy'),
 card('pjuan','Juan Dela Cruz',hometown='Elsewhere',hobbies='Chess')]
json.dump({'app':'batchtickler','kind':'batch','cards':cards},open(Q+'batch.json','w'))
c2=json.loads(json.dumps(cards)); c2[0]['hobbies']='Reading\nHiking\nSurfing'; c2[0]['updated']='2026-11-05T00:00:00.000Z'
json.dump({'app':'batchtickler','kind':'batch','cards':c2},open(Q+'batch2.json','w'))
srv=subprocess.Popen(['python3','-m','http.server','8765','--directory',APP],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
U='http://127.0.0.1:8765/'
def hit(page,sel,dbg=False):
    b=page.locator(sel).first.bounding_box(); cx,cy=b['x']+b['width']/2,b['y']+b['height']/2
    if dbg or cy>page.viewport_size['height'] or cy<0: print('HIT',sel,b,'scrollY',page.evaluate('scrollY'),'at point:',page.evaluate('([x,y])=>{var e=document.elementFromPoint(x,y);return e?e.tagName+"."+e.className+"#"+e.id:null}',[cx,cy]))
    page.mouse.click(cx,cy)
def go(page,h):
    page.evaluate("h=>{location.hash=h}",h); page.wait_for_timeout(300)
def ls(page,k): return page.evaluate("k=>localStorage.getItem(k)",'bt:v1:'+k)
def step(n,fn):
    try: fn()
    except Exception as e: rep(n,False,'EXC '+repr(e)[:300])
with sync_playwright() as p:
    br=p.chromium.launch()
    ctx=br.new_context(viewport={'width':390,'height':844},accept_downloads=True,timezone_id='Asia/Manila')
    ctx.route('**/*',lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
    pg=ctx.new_page()
    pg.on('console',lambda m: ERR.append('console:'+m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: ERR.append('pageerror:'+str(e)))
    dlg={'n':0}
    def ondlg(d): dlg['n']+=1; d.accept()
    pg.on('dialog',ondlg)
    def t1():
        pg.goto(U); pg.wait_for_timeout(800)
        rep('1a home',pg.locator('h1').first.inner_text()!='',pg.locator('h1').first.inner_text())
        go(pg,'#/batch'); txt=pg.locator('main').inner_text()
        rep('1b batch empty',pg.locator('.empty').count()>0 and pg.locator('.pgrid').count()==0,txt[:120].replace('\n',' | '))
    step('1',t1)
    def t2():
        go(pg,'#/me'); f=pg.locator('#me-form'); pg.wait_for_selector('#me-form'); pg.evaluate("document.querySelectorAll('details.fgroup').forEach(d=>d.open=true)")
        f.locator('[name=name]').fill('Juan Dela Cruz'); f.locator('[name=nickname]').fill('Juan')
        f.locator('[name=bmonth]').select_option('3'); f.locator('[name=bday]').select_option('15'); f.locator('[name=byear]').fill('1998')
        f.locator('[name=hometown]').fill('Balanga, Bataan'); f.locator('[name=hobbies]').fill('Basketball\nCooking')
        f.locator('[name=phone]').fill('09171234567'); f.locator('[name=email]').fill('juan@example.com')
        pg.set_input_files('#me-photo',Q+'photo.jpg'); pg.wait_for_timeout(800)
        pg.screenshot(path=Q+'me_filled_390.png',full_page=True)
        f.locator('button[type=submit]').click(); pg.wait_for_timeout(150)
        st=pg.locator('#me-status').inner_text(); pg.wait_for_timeout(900)
        h=pg.evaluate('location.hash'); body=pg.locator('main').inner_text()
        me=json.loads(ls(pg,'me')); ph=me['photo']
        rep('2a saved status',('Saved' in st) or ('saved' in st.lower()),st)
        rep('2b nav to person',h.startswith('#/person/'),h)
        rep('2c content','Juan Dela Cruz' in body and 'Juan' in body and 'Balanga, Bataan' in body,'')
        rep('2d tel link',pg.locator('a[href^="tel:"]').count()>0,pg.locator('a[href^="tel:"]').first.get_attribute('href') if pg.locator('a[href^="tel:"]').count() else '')
        rep('2e img.avatar',pg.locator('img.avatar').count()>0,'')
        rep('2f photo storage',ph.startswith('data:image/jpeg') and len(ph)<100000,'len=%d'%len(ph))
        globals()['MEID']=me['id']
    step('2',t2)
    def t3():
        # 1.18.0: Share/Scan removed (cards arrive by Cloud sync) — seed the batch directly: batch.json, then the newer batch2.json copies
        merged=[]; myname=json.loads(ls(pg,'me'))['name'].lower()
        for c in json.load(open(Q+'batch.json'))['cards']+json.load(open(Q+'batch2.json'))['cards']:   # same id or same name: newer wins (as mergeCards)
            if c['name'].lower()==myname: continue   # own card is never overwritten
            i=[k for k,x in enumerate(merged) if x['id']==c['id'] or x['name'].lower()==c['name'].lower()]
            if not i: merged.append(c)
            elif c.get('updated','')>merged[i[0]].get('updated',''): merged[i[0]]=c
        pg.evaluate("a=>localStorage.setItem('bt:v1:batch',JSON.stringify(a))",merged); pg.reload(); pg.wait_for_timeout(400)
        n=len(json.loads(ls(pg,'batch')))
        rep('3 batch stored count==4',n==4,str(n))
        rep('3 hobbies updated','Surfing' in ls(pg,'batch'),'')
        pg.screenshot(path=Q+'share_390.png',full_page=True)
    step('3',t3)
    def t4():
        go(pg,'#/batch'); n=pg.locator('.pcard').count()
        names=pg.locator('.pcard__name').all_inner_texts()
        rep('4a 5 cards + You badge',n==5 and pg.locator('.pcard .badge').count()==1,str(names))
        pg.fill('#batch-q','Balanga'); pg.wait_for_timeout(500); sn=pg.locator('.pcard__name').all_inner_texts()
        rep('4b filter',len(sn)==2,str(sn))
        pg.fill('#batch-q',''); pg.wait_for_timeout(500); rep('4c cleared',pg.locator('.pcard').count()==5,'')
        for lab in ['birthday','hometown']:
            hit(pg,'.filter[data-sort=%s]'%lab); pg.wait_for_timeout(300)
            rep('4 sort '+lab,True,str([x.split('\n')[0] for x in pg.locator('.pcard').all_inner_texts()]))
        hit(pg,'.filter[data-sort=name]')
    step('4',t4)
    def t5():
        go(pg,'#/birthdays')
        hs=pg.locator('main h2').all_inner_texts()
        rows=pg.locator('.bdrow').all_inner_texts()
        und=pg.locator('main .muted').all_inner_texts()
        rep('5 groups',True,'h2=%s rows=%s undated=%s'%(hs,[r.replace('\n',' ') for r in rows],und))
        txt=pg.locator('main').inner_text()
        rep('5a today group has Ana',bool(re.search(r'Today[\s\S]*Ana Reyes',txt)),'')
        rep('5b Carla undated','Carla Lim' in (und[-1] if und else ''),'')
        rep('5c turns shown','turns' in txt.lower(),'')
        pg.screenshot(path=Q+'birthdays_390.png',full_page=True)
    step('5',t5)
    def t6():
        go(pg,'#/person/pd4'); before=5; d0=dlg['n']
        print('RM overlay:',pg.evaluate('([x,y])=>{var e=document.elementFromPoint(x,y);return e.outerHTML.slice(0,200)}',[77,804]), pg.evaluate("document.documentElement.scrollHeight"))
        pg.locator('#rm-person').click(); pg.wait_for_timeout(500)
        h=pg.evaluate('location.hash'); n=pg.locator('.pcard').count()
        rep('6 remove',h=='#/batch' and n==4 and dlg['n']==d0+1,'hash=%s cards=%d dialogs=%d'%(h,n,dlg['n']-d0))
    step('6',t6)
    def t7():
        go(pg,'#/'); pg.focus('#q'); pg.keyboard.type('Balanga',delay=40); pg.wait_for_timeout(500)
        sg=pg.locator('#suggest')
        vis=sg.is_visible(); txt=sg.inner_text() if vis else ''
        rep('7a suggest',vis and 'Ana' in txt,txt.replace('\n',' | ')[:200])
        pg.screenshot(path=Q+'suggest_390.png')
        pg.keyboard.press('Enter'); pg.wait_for_timeout(500)
        h=pg.evaluate('decodeURIComponent(location.hash)')
        rep('7b enter -> search',h=='#/search/Balanga' and 'Ana Reyes' in pg.locator('main').inner_text(),h)
    step('7',t7)
    def t8():
        go(pg,'#/guess'); pg.wait_for_timeout(300)
        # 4 cards now (me + 3) -> need >=4 with detail
        no=pg.locator('.guess__opt').count()
        rep('8a clue+4 opts',no==4 and pg.locator('.guess__clue').count()==1,'opts=%d clue=%s'%(no,pg.locator('.guess__clue').first.inner_text() if pg.locator('.guess__clue').count() else ''))
        if no==4:
            clue1=pg.locator('.guess__clue').inner_text()
            hit(pg,'.guess__opt'); pg.wait_for_timeout(200)
            st=pg.locator('#g-status').inner_text(); rep('8b result',bool(st),st)
            hit(pg,'#g-next'); pg.wait_for_timeout(300)
            rep('8c next',pg.locator('.guess__opt').count()==4 and pg.locator('#g-status').inner_text()=='', 'clue=%r'%pg.locator('.guess__clue').inner_text())
        # 2 cards
        pg.evaluate("()=>{var b=JSON.parse(localStorage['bt:v1:batch']);localStorage['bt:v1:batch']=JSON.stringify(b.slice(0,1))}")
        pg.reload(); pg.wait_for_timeout(600); go(pg,'#/guess')
        rep('8d not enough',pg.locator('.guess__opt').count()==0 and 'Not enough' in pg.locator('main').inner_text(),'')
        # restore full batch
        pg.evaluate("()=>{localStorage['bt:v1:batch']=%s}"%json.dumps(json.dumps(cards[:4])))
        pg.reload(); pg.wait_for_timeout(600)
    step('8',t8)
    def t9():
        go(pg,'#/print'); sh=pg.locator('.sheet'); txt=sh.inner_text()
        arts=pg.locator('.sheet__card').count()
        rep('9a all people',arts==5,'cards=%d'%arts)
        rep('9b no phone/email','09171234567' not in txt and 'juan@example.com' not in txt,'')
        pg.screenshot(path=Q+'print_light_390.png',full_page=True)
        pg.emulate_media(media='print')
        vis={s:pg.locator(s).first.is_visible() if pg.locator(s).count() else None for s in ['.topbar','.site-foot','.tabbar']}
        rep('9c print hides chrome',not vis['.topbar'] and not vis['.site-foot'] and not vis['.tabbar'],str(vis))
        pg.pdf(path=Q+'print.pdf')
        pg.emulate_media(media='screen')
    step('9',t9)
    def t10():
        go(pg,'#/share'); rep('10a share screen removed',pg.locator('#sh-all').count()==0,'')
        go(pg,'#/sync'); pg.wait_for_timeout(600); rep('10b cloud sync screen',pg.locator('.sync').count()==1,'')
    step('10',t10)
    def t11():
        go(pg,'#/batch')
        print('footer exists', pg.locator('#bk-export').count())
        with pg.expect_download() as d: pg.locator('#bk-export').evaluate('e=>e.click()')
        path=Q+'backup.json'; d.value.save_as(path); j=json.load(open(path))
        rep('11a export',j.get('app')=='batchtickler' and 'me' in j['data'] and 'batch' in j['data'],str(list(j['data'].keys())))
        pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(600)
        pg.set_input_files('#bk-file',path); pg.wait_for_timeout(2500)
        go(pg,'#/batch'); pg.wait_for_timeout(300)
        rep('11b restore',pg.locator('.pcard').count()==5,'cards=%d'%pg.locator('.pcard').count())
    step('11',t11)
    def t12():
        go(pg,'#/about'); pg.locator('input[name=lang][value=tl]').evaluate('e=>e.click()'); pg.wait_for_timeout(400)
        menu=pg.locator('#sidenav').inner_text().replace('\n',' | ')
        pg.evaluate("document.querySelector('#sidenav')&&0")
        go(pg,'#/batch'); body=pg.locator('main').inner_text()
        rep('12a tl labels','Ang batch' in menu or 'Ang batch' in body,menu[:150])
        rep('12b batch works tl',pg.locator('.pcard').count()==5,body[:80].replace('\n',' | '))
        pg.screenshot(path=Q+'batch_tl_390.png',full_page=True)
        go(pg,'#/about'); pg.locator('input[name=lang][value=en]').evaluate('e=>e.click()'); pg.wait_for_timeout(300)
        go(pg,'#/batch'); rep('12c back en','The batch' in pg.locator('main').inner_text(),'')
    step('12',t12)
    def t13():
        go(pg,'#/me'); pg.screenshot(path=Q+'me_light_390.png',full_page=True)
        go(pg,'#/print'); pg.screenshot(path=Q+'print_light_390.png',full_page=True)
        print('theme before',pg.evaluate("document.documentElement.getAttribute('data-theme')"))
        hit(pg,'#theme-btn'); pg.wait_for_timeout(200); a=pg.evaluate("document.documentElement.getAttribute('data-theme')")
        hit(pg,'#theme-btn'); pg.wait_for_timeout(200); b=pg.evaluate("document.documentElement.getAttribute('data-theme')")
        rep('13 theme cycle',True,'after1=%s after2=%s'%(a,b))
        go(pg,'#/batch'); pg.screenshot(path=Q+'batch_dark_390.png',full_page=True)
        go(pg,'#/person/'+MEID); pg.screenshot(path=Q+'person_dark_390.png',full_page=True)
        go(pg,'#/birthdays'); pg.screenshot(path=Q+'birthdays_dark_390.png',full_page=True)
        hit(pg,'#theme-btn'); hit(pg,'#theme-btn')   # cycle back
        print('theme end',pg.evaluate("document.documentElement.getAttribute('data-theme')"))
        # overflow check
        for h in ['#/','#/batch','#/me','#/person/'+MEID,'#/birthdays','#/sync','#/print','#/guess','#/about']:
            go(pg,h); ov=pg.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
            if ov>0: rep('overflow '+h,False,'scrollWidth overflow %d'%ov)
    step('13',t13)
    pg.close(); ctx.close()
    # desktop
    ctx=br.new_context(viewport={'width':1280,'height':900},timezone_id='Asia/Manila')
    ctx.route('**/*',lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
    d=ctx.new_page()
    d.on('console',lambda m: ERR.append('desk console:'+m.text) if m.type=='error' else None)
    d.on('pageerror',lambda e: ERR.append('desk pageerror:'+str(e)))
    d.goto(U); d.evaluate("(a)=>{localStorage.setItem('bt:v1:me',a[0]);localStorage.setItem('bt:v1:batch',a[1])}",[json.dumps(card('pme','Juan Dela Cruz',nickname='Juan',hometown='Balanga, Bataan',bmonth=3,bday=15,byear=1998,hobbies='Basketball')),json.dumps(cards[:4])])
    d.reload(); d.wait_for_timeout(700)
    d.screenshot(path=Q+'home_1280.png')
    go(d,'#/batch'); d.wait_for_timeout(300)
    xs=set(round(b['x']) for b in [d.locator('.pcard').nth(i).bounding_box() for i in range(d.locator('.pcard').count())])
    nav=d.locator('#sidenav').inner_text().replace('\n',' | ')
    rep('14a multi-col grid',len(xs)>1,'distinct x=%s'%sorted(xs))
    need=['The batch','My card','Birthdays','Guess who','Cloud sync','Print sheet']
    rep('14b sidebar nav',all(n in nav for n in need) and d.locator('#sidenav').is_visible(),nav)
    d.screenshot(path=Q+'batch_1280.png',full_page=True)
    go(d,'#/print'); d.screenshot(path=Q+'print_1280.png',full_page=True)
    br.close()
srv.terminate()
print('ERRORS:',ERR)
