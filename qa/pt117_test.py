"""1.17.0: partner (jowa/asawa) cards, option B — on the resident's page, Birthdays, Partners screen, search;
kept out of the batch grid, games, stats, Kris Kringle, map and Emergency. Usage: python3 qa/pt117_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, os, datetime
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
td = datetime.date.today()
def card(i, name, **k):
    c = {'id': i, 'name': name, 'bmonth': 5, 'bday': 10, 'byear': 1995, 'updated': '2026-11-01T00:00:00.000Z', 'hometown': 'Balanga', 'food': 'Sisig', 'music': 'OPM'}
    c.update(k); return c
me = card('p0', 'Me Tester', bmonth=2, bday=2)
others = [card('p1', 'Ana Reyes', bloodType='O+'), card('p2', 'Ben Santos'), card('p3', 'Carla Lim'), card('p4', 'Dan Cruz'),
          card('pa', 'Paolo Jowa', partnerOf='p1', bmonth=td.month, bday=td.day, hometown='Zamboanga', bloodType='B+'),
          card('pb', 'Gina Asawa', partnerName='ben santos', bmonth=1, bday=15),
          card('pc', 'Xavi Unknown', partnerName='Someone Else', partnerOf='<bad>!!'),
          card('pd', 'Self Ref', partnerOf='pd')]   # partnerOf == own id is dropped -> resident
res = []; errs = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    b = p.chromium.launch()
    for theme in ('light', 'dark'):
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme=theme)
        pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
        pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", [me, others]); pg.reload(); pg.wait_for_timeout(400)
        def go(h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(300)
        def txt(): return pg.inner_text('main')
        def noov(m): ok(not pg.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no overflow ' + m + ' ' + theme)
        T = ' ' + theme
        # Home
        ok('Paolo Jowa' in pg.inner_text('.bday-today'), 'partner birthday on Home banner' + T)
        ok(pg.locator('.home__stats .stat__n').first.inner_text().strip() == '6', 'Home count = 6 residents' + T)
        # Batch grid
        go('#/batch'); names = pg.locator('.pgrid .pcard__name').all_inner_texts()
        ok(len(names) == 6 and not any('Paolo' in n or 'Gina' in n or 'Xavi' in n for n in names), 'batch grid has residents only' + T)
        ok(any('Self Ref' in n for n in names), 'self-referencing partnerOf is ignored' + T)
        ok('3 partner cards' in txt(), 'batch grid links to 3 partner cards' + T)
        # Partners screen
        go('#/partners'); tx = txt()
        ok(pg.locator('.pgrid .pcard').count() == 3, 'Partners screen: 3 cards' + T)
        ok('Partner of Ana Reyes' in tx and 'Partner of Ben Santos' in tx and 'Partner of Someone Else' in tx, 'Partner of … lines (id, name match, unresolved)' + T)
        noov('partners'); pg.screenshot(path='%s/partners-%s.png' % (out, theme), full_page=True)
        # Resident pages
        go('#/person/p1'); ok('JOWA / ASAWA' in txt().upper() and pg.locator('.pt-grid a[href="#/person/pa"]').count() == 1, 'Ana page shows Paolo' + T)
        go('#/person/p2'); ok(pg.locator('.pt-grid a[href="#/person/pb"]').count() == 1, 'Ben page shows Gina (name match)' + T)
        go('#/person/p3'); ok(pg.locator('.pt-grid').count() == 0, 'Carla page: no partner section' + T)
        # Partner page
        go('#/person/pa'); tx = txt()
        ok(pg.locator('.pt-of a[href="#/person/p1"]').count() == 1, 'Paolo page links to Ana' + T)
        ok(pg.locator('.person__acts a[href^="#/quiz/"]').count() == 0, 'no quiz button on a partner page' + T)
        ok(pg.locator('.person__acts a[href^="#/tcard/"]').count() == 1, 'trading card kept on partner page' + T)
        noov('partner page'); pg.screenshot(path='%s/partner-page-%s.png' % (out, theme), full_page=True)
        go('#/person/pc'); ok('Partner of Someone Else' in txt(), 'unresolved partner shows typed name' + T)
        # Birthdays
        go('#/birthdays'); tx = txt()
        ok('Paolo Jowa' in tx and 'Gina Asawa' in tx, 'partners in Birthdays' + T)
        ok(pg.locator('.bdrow:has-text("Paolo Jowa") .em-tag').count() == 1, 'Partner tag in Birthdays' + T)
        # Kept out
        for h in ('#/stats', '#/monito', '#/emergency', '#/map', '#/superlatives/vote', '#/guess', '#/wrapped'):
            go(h); tx = txt(); ok('Paolo' not in tx and 'Gina' not in tx, 'partners not in %s%s' % (h, T))
        if theme == 'light':
            # search
            pg.evaluate("(()=>{var b=document.getElementById('lk-search-btn');if(b&&b.offsetParent&&!document.body.classList.contains('lk-search'))b.click()})()"); pg.wait_for_timeout(150); 
            ok(pg.evaluate("(()=>{var i=document.querySelector('.search input');i.value='Paolo';i.dispatchEvent(new Event('input',{bubbles:true}));return true})()"), 'typed search')
            pg.wait_for_timeout(400)
            ok('Paolo Jowa' in pg.inner_text('body'), 'search finds a partner')
            pg.keyboard.press('Escape')
            # My card: become a partner
            go('#/me'); ok(pg.locator('input[name="cardRole"][value="resident"]').is_checked(), 'resident is the default role')
            ok(pg.locator('.pt-who').is_hidden(), 'partner picker hidden for residents')
            pg.locator('input[name="cardRole"][value="partner"]').check(); pg.wait_for_timeout(100)
            ok(pg.locator('.pt-who').is_visible(), 'picker shows for partner')
            opts = pg.locator('select[name="partnerOf"] option').all_inner_texts()
            ok('Carla Lim' in opts and not any('Paolo' in o for o in opts) and 'Me Tester' not in opts, 'picker lists residents only, not me')
            pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(300)
            ok('Pick your partner' in pg.inner_text('#me-status'), 'needs a partner')
            pg.select_option('select[name="partnerOf"]', 'p3'); pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(1200)
            mc = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))")
            ok(mc.get('partnerOf') == 'p3' and mc.get('partnerName') == 'Carla Lim', 'me saved as partner of Carla')
            go('#/person/p3'); ok(pg.locator('.pt-grid a[href="#/person/p0"]').count() == 1, 'Carla page shows me')
            go('#/batch'); ok(not any('Me Tester' in n for n in pg.locator('.pgrid .pcard__name').all_inner_texts()), 'me (partner) out of batch grid')
            go('#/'); ok('Add yours' not in (pg.locator('.em-strip').inner_text() if pg.locator('.em-strip').count() else ''), 'no emergency nudge for a partner')
            # back to resident
            go('#/me'); ok(pg.locator('input[name="cardRole"][value="partner"]').is_checked(), 'partner role remembered')
            pg.locator('input[name="cardRole"][value="resident"]').check(); pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(1200)
            mc = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))")
            ok(not mc.get('partnerOf') and not mc.get('partnerName'), 'back to resident clears the link')
            # type-a-name path
            go('#/me'); pg.locator('input[name="cardRole"][value="partner"]').check(); pg.fill('input[name="partnerName"]', 'New Resident'); pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(1200)
            mc = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))")
            ok(mc.get('partnerName') == 'New Resident' and not mc.get('partnerOf'), 'typed name saved')
            # Tagalog
            pg.evaluate("localStorage.setItem('bt:v1:lang',JSON.stringify('tl'))"); pg.reload(); pg.wait_for_timeout(400); go('#/partners')
            ok('Mga jowa/asawa' in txt(), 'Tagalog title')
        ctx.close()
    b.close()
ok(not errs, 'no page errors %s' % errs[:3])
print('%d/%d passed' % (sum(res), len(res)))
sys.exit(0 if all(res) else 1)
