"""1.11.0 fun features: birthday banner, residency counter, spotlight, Who said it?, Bingo, twins,
Icebreakers, Hometown map, Batch Wrapped. Usage: python3 qa/fun_test.py ./tickler <outdir>"""
import json, sys, threading, http.server, functools, socketserver, datetime
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
H.log_message = lambda *a, **k: None
srv = socketserver.TCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
today = datetime.date.today()
rows = [
  ('Ana Reyes', 'Balanga, Bataan', 'Doraemon, Voltes V', 'Sinigang, Adobo', 'Grey\'s Anatomy', 'Tagalog, English', 1997),
  ('Ben Santos', 'Cebu City', 'Doraemon', 'Adobo, Lechon', 'House MD', 'Cebuano, English', 1995),
  ('Carla Lim', 'Quezon City', 'Avatar', 'Sinigang', 'Grey\'s Anatomy', 'Tagalog, Hokkien', 1996),
  ('Dan Cruz', 'Davao City', 'SpongeBob', 'Durian, Adobo', 'Friends', 'Bisaya, English', 1994),
  ('Ella Go', 'Tokyo, Japan', 'Doraemon, Sailor Moon', 'Ramen, Sinigang', 'Friends', 'Japanese, English', 1998),
  ('Fe Dizon', 'San Fernando, Pampanga', 'Voltes V', 'Sisig, Adobo', 'House MD', 'Kapampangan, Tagalog', 1993),
  ('Gio Tan', 'Baguio', 'Avatar, SpongeBob', 'Strawberry taho', 'Friends', 'Ilocano, English', 1997),
  ('Hana Uy', 'Mariveles, Bataan', 'Sailor Moon', 'Sinigang', 'Grey\'s Anatomy', 'Tagalog, English', 1996),
]
cards = []
for i, (n, town, cart, food, show, langs, yr) in enumerate(rows):
    m, d = (today.month, today.day) if i == 1 else ((i % 12) + 1, 10 + i)
    cards.append({'id': 'p%d' % i, 'name': n, 'bmonth': m, 'bday': d, 'byear': yr, 'updated': 1, 'hometown': town, 'cartoons': cart, 'food': food, 'shows': show,
                  'languages': langs, 'hobbies': 'Reading, Hiking' if i % 2 else 'Guitar, Hiking', 'music': 'OPM, Taylor Swift' if i % 3 else 'OPM', 'pets': 'Dog' if i % 2 else 'Cat',
                  'karaoke': 'My Way', 'medSchool': 'UP' if i % 2 else 'UST', 'playlists': []})
me = dict(cards[0]); cards = cards[1:]
start = (today - datetime.timedelta(days=99)).isoformat()   # today = day 100 -> milestone
res = []; errs = []
def ok(c, m): res.append(c); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    b = p.chromium.launch()
    def page(vp=(390, 844), scheme='light', lang='en'):
        ctx = b.new_context(viewport={'width': vp[0], 'height': vp[1]}, color_scheme=scheme)
        ctx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=BASE)
        pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('dialog', lambda d: d.accept())
        pg.goto(BASE)
        pg.evaluate("""a=>{localStorage.setItem('bt:v1:batch',JSON.stringify(a.c));localStorage.setItem('bt:v1:me',JSON.stringify(a.me));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9.9.9'));localStorage.setItem('bt:v1:startDate',JSON.stringify(a.s));localStorage.setItem('bt:v1:lang',JSON.stringify(a.l));}""", {'c': cards, 'me': me, 's': start, 'l': lang})
        pg.reload(); pg.wait_for_timeout(400)
        return ctx, pg
    def go(pg, h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(300)
    def nooverflow(pg, m): ok(not pg.evaluate('document.documentElement.scrollWidth>innerWidth+1'), m + ' no overflow')
    ctx, pg = page()
    # Home
    t = pg.inner_text('main')
    ok(pg.locator('.bday-today').count() == 1 and 'Ben' in pg.inner_text('.bday-today'), '1 birthday banner for Ben')
    pg.evaluate("delete navigator.share")
    pg.click('[data-greet]'); pg.wait_for_timeout(300)
    ok('copied' in pg.inner_text('#greet-status').lower(), '1 greet -> copied')
    clip = pg.evaluate('navigator.clipboard.readText()'); ok('Happy birthday, Ben' in clip, '1 greeting text ' + clip[:40])
    ok('Day 100' in t, '9 residency Day 100'); ok('milestone' in t.lower(), '9 milestone shown')
    ok('SPOTLIGHT' in t.upper(), '5 spotlight card')
    nooverflow(pg, 'home'); pg.screenshot(path=out + '/home-phone.png', full_page=True)
    # Who said it
    go(pg, '#/whosaid/cartoons')
    ok(pg.locator('[data-wsid]').count() == 4, '2 four options')
    n = 0
    while pg.locator('[data-wsid]').count() and n < 20:
        pg.locator('[data-wsid]').first.click(); pg.wait_for_timeout(80)
        ok(pg.locator('#ws-acts').is_visible(), '2 answered %d' % n) if n == 0 else None
        pg.click('#ws-next'); pg.wait_for_timeout(120); n += 1
    ok(pg.locator('#ws-again').count() == 1 and n == 8, '2 round done after %d' % n)
    pg.click('#ws-other'); pg.wait_for_timeout(300); ok('cartoons' not in pg.evaluate('location.hash'), '2 other question ' + pg.evaluate('location.hash'))
    nooverflow(pg, 'whosaid')
    # Bingo
    go(pg, '#/bingo')
    sz = pg.evaluate("document.querySelectorAll('.bingo__sq').length"); ok(sz in (9, 16, 25), '3 bingo squares %d' % sz)
    side = int(sz ** .5)
    for i in range(side):
        if pg.locator('.bingo__sq').nth(i).get_attribute('data-sq') is None: continue
        pg.locator('[data-sq="%d"]' % i).click(); pg.wait_for_timeout(80)
    ok('BINGO' in pg.inner_text('main'), '3 first row -> BINGO')
    ok(pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:bingo')).marks.length") >= side, '3 marks saved')
    pg.click('#bingo-reveal'); pg.wait_for_timeout(150); ok(pg.locator('.bingo__who').count() >= sz - 2, '3 reveal names')
    pg.screenshot(path=out + '/bingo-phone.png', full_page=True)
    pg.click('#bingo-new'); pg.wait_for_timeout(200); ok('BINGO' not in pg.inner_text('main').split('Bingo')[0] and pg.locator('.bingo__win').count() == 0, '3 new card clears')
    nooverflow(pg, 'bingo')
    # Twins
    go(pg, '#/stats'); ok(pg.locator('.twin').count() >= 1, '4 twins listed %d' % pg.locator('.twin').count()); nooverflow(pg, 'stats')
    pg.locator('.twins').screenshot(path=out + '/twins-phone.png')
    # Icebreakers
    go(pg, '#/icebreakers'); q1 = pg.inner_text('.ice__q'); pg.click('#ice-next'); pg.wait_for_timeout(100); q2 = pg.inner_text('.ice__q')
    ok(q1 and q1 != q2, '6 next question'); ok('Try asking' in pg.inner_text('main'), '6 ask who')
    pg.click('[data-ice="card"]'); pg.wait_for_timeout(150); ok('Ask ' in pg.inner_text('.ice__q'), '6 card mode ' + pg.inner_text('.ice__q'))
    pg.click('#ice-reveal'); pg.wait_for_timeout(100); ok(pg.locator('.ice__a').count() == 1, '6 reveal'); nooverflow(pg, 'ice')
    # Map
    go(pg, '#/map')
    spots = pg.locator('g.map__spot').count(); ok(spots >= 6, '7 spots %d' % spots)
    ok(pg.locator('.map__hosp').count() == 1, '7 hospital star')
    offt = pg.inner_text('main'); ok('Tokyo' in offt and 'Not on the map' in offt, '7 Tokyo off map')
    lst = pg.inner_text('.map__list'); ok('San Fernando' in lst and 'Pampanga' in lst and 'Cebu' in lst and 'Mariveles' in lst and 'Balanga' in lst, '7 matched places')
    pg.locator('g.map__spot').first.dispatch_event('click'); pg.wait_for_timeout(200); ok(pg.locator('.map__list li.is-sel').count() == 1, '7 tap selects')
    nooverflow(pg, 'map'); pg.screenshot(path=out + '/map-phone.png', full_page=True)
    # Wrapped
    go(pg, '#/wrapped'); k = 0
    pg.screenshot(path=out + '/wrapped-0.png')
    while pg.locator('#wr-next').count() and k < 15: pg.click('#wr-next'); pg.wait_for_timeout(80); k += 1
    ok(k >= 6, '8 wrapped slides %d' % (k + 1)); ok(pg.locator('#wr-again').count() == 1, '8 last slide')
    pg.click('#wr-prev'); pg.wait_for_timeout(80); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(80); ok(pg.locator('#wr-again').count() == 1, '8 arrow key')
    nooverflow(pg, 'wrapped')
    # About setting
    go(pg, '#/about'); ok(pg.input_value('input[name=startDate]') == start, '9 about date shows')
    pg.fill('input[name=startDate]', ''); pg.dispatch_event('input[name=startDate]', 'change'); go(pg, '#/'); ok(pg.evaluate("localStorage.getItem('bt:v1:startDate')") is None, '9 cleared -> default'); go(pg, '#/about'); ok(pg.input_value('input[name=startDate]') == '2027-01-01', '9 default 2027-01-01'); go(pg, '#/'); ok(('Starts in' in pg.inner_text('main')) or ('Day ' in pg.inner_text('main')), '9 default counter on Home')
    ctx.close()
    # Dark + Tagalog + desktop sweeps
    for name, vp, sch, lg in [('dark', (390, 844), 'dark', 'en'), ('tl', (390, 844), 'light', 'tl'), ('desk', (1280, 900), 'light', 'en')]:
        ctx, pg = page(vp, sch, lg)
        for h in ['#/', '#/whosaid', '#/bingo', '#/stats', '#/icebreakers', '#/map', '#/wrapped']:
            go(pg, h); nooverflow(pg, name + ' ' + h)
            if h in ('#/', '#/map', '#/bingo', '#/wrapped') and name != 'tl': pg.screenshot(path='%s/%s-%s.png' % (out, h.strip('#/') or 'home', name), full_page=(h != '#/wrapped'))
        ctx.close()
    b.close()
ok(not errs, 'no page errors %s' % errs[:3])
print('%d/%d passed' % (sum(res), len(res)))
