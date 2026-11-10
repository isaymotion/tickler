"""1.13.0 link lists. Usage: python3 qa/lists_test.py ./tickler <outdir>"""
import sys, threading, http.server, functools, socketserver, datetime
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
td = datetime.date.today()
cards = [
 {'id': 'a', 'name': 'Ana Reyes', 'bmonth': td.month, 'bday': td.day, 'byear': 1997, 'updated': 1, 'hometown': 'Balanga, Bataan',
  'lists': {'wishlist': [{'title': 'Stethoscope', 'url': 'https://shopee.ph/product/1/2'}, {'title': 'Tumbler', 'url': 'https://evil.example/x'}, {'title': 'Book light'}, {'title': 'Socks'}],
            'films': [{'title': 'Inception', 'url': 'https://letterboxd.com/film/inception/'}, {'title': 'Up'}],
            'foodSpots': [{'title': 'Jollibee Mariveles', 'url': 'https://maps.app.goo.gl/abc'}],
            'travel': [{'title': 'Siargao'}, {'title': 'Batanes'}, {'title': 'Kyoto'}],
            'study': [{'title': 'Psych Hub', 'url': 'https://example.org/x'}], 'bogus': [{'title': 'x'}]},
  'netflix': [{'title': 'The Mandalorian', 'url': 'https://www.disneyplus.com/series/x'}]},
 {'id': 'b', 'name': 'Ben Santos', 'bmonth': 4, 'bday': 5, 'byear': 1996, 'updated': 1, 'hometown': 'Cebu City',
  'lists': {'films': [{'title': 'inception'}, {'title': 'Parasite'}], 'travel': [{'title': 'Siargao'}, {'title': 'El Nido'}], 'books': [{'title': 'Atomic Habits', 'url': 'https://www.goodreads.com/book/show/1'}],
            'youtube': [{'title': 'Kurzgesagt', 'url': 'https://youtu.be/xyz'}], 'podcasts': [{'title': 'Huberman', 'url': 'https://podcasts.apple.com/x'}]}},
]
res = []; errs = []
def ok(c, m): res.append(c); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    b = p.chromium.launch()
    for tag, vp, sch, lang in [('phone', (390, 844), 'light', 'en'), ('desk', (1280, 900), 'dark', 'en'), ('tl', (390, 844), 'light', 'tl')]:
        ctx = b.new_context(viewport={'width': vp[0], 'height': vp[1]}, color_scheme=sch); pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
        pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:batch',JSON.stringify(a[0]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'));localStorage.setItem('bt:v1:lang',JSON.stringify(a[1]))}", [cards, lang]); pg.reload(); pg.wait_for_timeout(300)
        def go(h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(250)
        def noov(m): ok(not pg.evaluate('document.documentElement.scrollWidth>innerWidth+1'), tag + ' no overflow ' + m)
        noov('home')
        if lang == 'tl':
            for h in ['#/picks', '#/picks/wishlist', '#/person/a', '#/me', '#/map/travel']: go(h); noov(h)
            ctx.close(); continue
        # birthday banner wishlist
        w = pg.inner_text('.bday-today'); ok('Stethoscope' in w and 'See all 4' in w, tag + ' banner wishlist')
        ok(pg.get_attribute('.bday-today__wish a', 'href') == 'https://shopee.ph/product/1/2', tag + ' wish link')
        ok('Watch on Disney+' in pg.inner_text('.today-grid'), tag + ' disney+ button')
        # person page
        go('#/person/a'); tx = pg.inner_text('main')
        for h in ['Birthday wishlist', 'Top films', 'Favourite food spots', 'Travel bucket list', 'Study stash', 'Top 10 shows']: ok(h in tx, tag + ' section ' + h)
        hrefs = pg.eval_on_selector_all('.nf-list a', 'a=>a.map(x=>x.href)')
        ok('https://letterboxd.com/search/Up/' in hrefs, tag + ' letterboxd search fallback')
        ok(any('shopee.ph/search?keyword=Tumbler' in h for h in hrefs), tag + ' bad wishlist host dropped -> search')
        ok('https://example.org/x' in hrefs, tag + ' study any https')
        ok(any('google.com/maps/search' in h and 'Siargao' in h for h in hrefs), tag + ' maps search fallback')
        ok(pg.locator('#list-bogus').count() == 0, tag + ' unknown list dropped')
        # picks
        go('#/picks'); ok(pg.locator('.picks__chips .filter').count() >= 8, tag + ' picks chips %d' % pg.locator('.picks__chips .filter').count())
        go('#/picks/films'); first = pg.inner_text('.picks__list li:first-child'); ok('Inception' in first and '2 people' in first, tag + ' films aggregated: ' + first.replace('\n', ' '))
        go('#/picks/wishlist'); ok('Ana Reyes' in pg.inner_text('main') and pg.locator('.picks .twin').count() == 1, tag + ' wishlist by person')
        go('#/picks/travel'); ok(pg.locator('a[href="#/map/travel"]').count() >= 1, tag + ' travel -> map link')
        noov('picks')
        # map travel
        go('#/map/travel'); lst = pg.inner_text('.map__list'); ok('Siargao' in lst and 'Batanes' in lst and 'El Nido' in lst, tag + ' travel spots')
        ok('Kyoto' in pg.inner_text('main'), tag + ' Kyoto off map'); noov('map')
        ok('Siargao' in lst and '· 2' in lst, tag + ' Siargao 2 people')
        if tag == 'phone': pg.screenshot(path=out + '/map-travel.png', full_page=True)
        go('#/map'); ok('Balanga' in pg.inner_text('.map__list'), tag + ' hometown mode')
        # stats / common
        go('#/stats'); ok('Top films' in pg.inner_text('main'), tag + ' stats films')
        # editor
        go('#/me'); pg.evaluate("document.querySelectorAll('details.fgroup').forEach(d=>d.open=true)")
        ok(pg.locator('.lrows').count() == 9, tag + ' 9 list editors')
        pg.fill('input[name=name]', 'Me Tester'); pg.select_option('select[name=bmonth]', '5'); pg.select_option('select[name=bday]', '6'); pg.fill('input[name=byear]', '1995')
        pg.click('[data-ladd="wishlist"]'); r = pg.locator('#rows-wishlist .custom-row').last; r.locator('[name=lTitle]').fill('Bag'); r.locator('[name=lUrl]').fill('https://www.amazon.com/x')
        pg.click('[data-ladd="films"]'); r2 = pg.locator('#rows-films .custom-row').last; r2.locator('[name=lTitle]').fill('Inception')
        pg.click('[data-ladd="netflix"]'); r3 = pg.locator('#rows-netflix .custom-row').last; r3.locator('[name=lTitle]').fill('Loki'); r3.locator('[name=lUrl]').fill('https://www.disneyplus.com/series/loki')
        pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(200)
        ok('Shopee or Lazada' in pg.inner_text('#me-status'), tag + ' bad host blocked: ' + pg.inner_text('#me-status'))
        r.locator('[name=lUrl]').fill('https://s.lazada.com.ph/s.abc')
        pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_function("location.hash.indexOf('#/person/')===0", timeout=5000)
        me = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))")
        ok(me['lists'].get('wishlist') == [{'title': 'Bag', 'url': 'https://s.lazada.com.ph/s.abc'}] and me['netflix'][0]['url'].startswith('https://www.disneyplus.com'), tag + ' saved lists %s' % me.get('lists'))
        pg.wait_for_timeout(200); tx = pg.inner_text('main'); ok('Inception' in tx, tag + ' own card shows films')
        go('#/person/b'); ok('Inception' in pg.inner_text('main') and 'Things in common' in pg.inner_text('main'), tag + ' in common films')
        c = pg.evaluate("(()=>{var m=document.querySelector('.meter, .completeness');return m?m.textContent:''})()")
        ctx.close()
    b.close()
ok(not errs, 'no page errors %s' % errs[:3]); print('%d/%d passed' % (sum(res), len(res)))
