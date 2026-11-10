"""1.19.0: Spotify player on the featured playlist, TMDB show info (mocked), Pets screen.
Usage: python3 qa/f119_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, os
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
Q = os.path.join(os.path.dirname(os.path.abspath(__file__)), '')
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(H, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
def card(i, name, **k):
    c = {'id': i, 'name': name, 'bmonth': 5, 'bday': 10, 'byear': 1995, 'updated': '2026-11-01T00:00:00.000Z', 'hometown': 'Balanga', 'food': 'Sisig'}
    c.update(k); return c
PL = 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
me = card('p0', 'Me Tester', playlists=[{'label': 'Duty songs', 'url': PL}], netflix=[{'title': 'Stranger Things', 'url': ''}])
others = [card('p1', 'Ana Reyes', playlists=[{'label': 'Chill', 'url': PL}], netflix=[{'title': 'Stranger Things', 'url': ''}],
               petList=[{'id': 'x1', 'name': 'Mochi', 'kind': 'cat', 'breed': 'Puspin', 'note': 'Sleeps on scrubs'}]),
          card('p2', 'Ben Santos', playlists=[{'label': 'Short link', 'url': 'https://spotify.link/abc123'}]),
          card('p3', 'Carla Lim', petList=[{'id': 'x2', 'name': 'Bantay', 'kind': 'dog', 'kind2': 'x'}, {'id': 'x3', 'name': '', 'kind': 'fish'}, {'name': 'Nemo', 'kind': 'lizard'}])]
TM = {'results': [{'media_type': 'person', 'name': 'Stranger Things'},
                  {'media_type': 'tv', 'id': 66732, 'name': 'Stranger Things', 'first_air_date': '2016-07-15', 'overview': 'When a young boy vanishes, a small town uncovers a mystery.', 'backdrop_path': '/still.jpg', 'poster_path': '/poster.jpg'}]}
png = open(Q + 'photo.jpg', 'rb').read()
res = []; errs = []; tmdb_calls = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
def router(r):
    u = r.request.url
    if '127.0.0.1' in u: return r.continue_()
    if 'api.themoviedb.org' in u:
        tmdb_calls.append(u); return r.fulfill(status=200, content_type='application/json', body=json.dumps(TM), headers={'Access-Control-Allow-Origin': '*'})
    if 'image.tmdb.org' in u: return r.fulfill(status=200, content_type='image/jpeg', body=png)
    return r.abort()
with sync_playwright() as p:
    b = p.chromium.launch()
    for theme, key in (('light', 'abcdefabcdefabcdefabcdefabcdef12'), ('dark', '')):
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme=theme)
        ctx.add_init_script("Object.defineProperty(window,'TMDB_CONFIG',{configurable:true,get:function(){return {key:%s};},set:function(){}});" % json.dumps(key))
        pg = ctx.new_page(); pg.route('**/*', router)
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
        pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", [me, others]); pg.reload(); pg.wait_for_timeout(900)
        T = ' ' + theme
        def go(h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(350)
        def txt(): return pg.inner_text('main')
        # Spotify player: cycle the featured playlist until an open.spotify.com one shows
        seen_embed = seen_link_only = False
        for i in range(4):
            sec = pg.locator('section.today:has(#today-pl-h)')
            if sec.count():
                fr = sec.locator('iframe.today__embed')
                if fr.count():
                    seen_embed = 'open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M' in fr.get_attribute('src')
                elif 'Short link' in sec.inner_text(): seen_link_only = sec.locator('a[href="https://spotify.link/abc123"]').count() == 1
                btn = sec.locator('[data-another="pl"]')
                if btn.count(): btn.click(); pg.wait_for_timeout(250)
        ok(seen_embed, 'Spotify player embedded for an open.spotify.com playlist' + T)
        ok(seen_link_only, 'spotify.link playlist keeps the Open link (no player)' + T)
        # TMDB
        nf = pg.locator('section.today:has(#today-nf-h)')
        if key:
            pg.wait_for_timeout(500)
            ok(nf.locator('.today__still').count() == 1 and 'vanishes' in nf.inner_text(), 'show of the day: TMDB still + blurb' + T)
            ok('TMDB' in nf.inner_text() and nf.locator('a[href="https://www.themoviedb.org/tv/66732"]').count() == 1, 'TMDB credit link' + T)
            ok(len(tmdb_calls) == 1 and 'api_key=' in tmdb_calls[0], 'one TMDB call with the v3 key' + T)
            pg.reload(); pg.wait_for_timeout(700)
            ok(len(tmdb_calls) == 1 and pg.locator('.today__still').count() == 1, 'second open uses the cache (no new call)' + T)
            pg.screenshot(path='%s/home-%s.png' % (out, theme), full_page=True)
            go('#/about'); ok('not endorsed or certified by TMDB' in txt(), 'TMDB notice on About' + T)
        else:
            ok(nf.count() == 1 and nf.locator('.today__still').count() == 0, 'no key: show card unchanged' + T)
        # Pets screen
        go('#/pets'); tx = txt()
        ok('Mochi' in tx and 'Bantay' in tx and 'Nemo' in tx and '3 pets so far' in tx, 'batch pets gallery (nameless pet dropped, unknown kind -> Other)' + T)
        ok('Other' in pg.locator('.pet:has-text("Nemo")').inner_text(), 'unknown kind shown as Other' + T)
        pg.fill('#pet-form [name=breed]', 'Aspin')
        pg.locator('#pet-form button[type=submit]').click(); pg.wait_for_timeout(250)
        ok('name first' in pg.inner_text('#pet-status'), 'name required' + T)
        pg.fill('#pet-form [name=name]', 'Choco'); pg.select_option('#pet-form [name=kind]', 'dog')
        pg.set_input_files('#pet-photo', Q + 'photo.jpg'); pg.wait_for_timeout(700)
        ok(pg.locator('#pet-form img.pet__thumb').count() == 1 and pg.input_value('#pet-form [name=name]') == 'Choco' and pg.input_value('#pet-form [name=breed]') == 'Aspin', 'photo preview keeps typed fields' + T)
        pg.locator('#pet-form button[type=submit]').click(); pg.wait_for_timeout(400)
        mine = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).petList")
        ok(len(mine) == 1 and mine[0]['name'] == 'Choco' and mine[0]['kind'] == 'dog' and mine[0]['photo'].startswith('data:image/jpeg'), 'pet saved with photo' + T)
        ok(pg.input_value('#pet-form [name=name]') == '' and 'Add another pet' in txt(), 'form resets to Add another pet' + T)
        pg.fill('#pet-form [name=name]', 'Kiwi'); pg.select_option('#pet-form [name=kind]', 'bird'); pg.locator('#pet-form button[type=submit]').click(); pg.wait_for_timeout(400)
        pg.locator('[data-petup="1"]').click(); pg.wait_for_timeout(300)
        names = [x['name'] for x in pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).petList")]
        ok(names == ['Kiwi', 'Choco'], 'move up reorders ' + str(names) + T)
        pg.locator('[data-petedit]').nth(1).click(); pg.wait_for_timeout(300)
        ok(pg.input_value('#pet-form [name=name]') == 'Choco' and 'Edit pet' in txt(), 'edit loads the pet' + T)
        pg.fill('#pet-form [name=note]', 'Loves mangoes'); pg.locator('#pet-form button[type=submit]').click(); pg.wait_for_timeout(400)
        l = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).petList")
        ok(len(l) == 2 and l[1]['note'] == 'Loves mangoes' and l[1]['photo'].startswith('data:'), 'edit saved, photo kept' + T)
        ok(not pg.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no overflow on Pets' + T)
        pg.screenshot(path='%s/pets-%s.png' % (out, theme), full_page=True)
        pg.locator('[data-petrm="%s"]' % l[0]['id']).click(); pg.wait_for_timeout(300)
        ok([x['name'] for x in pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).petList")] == ['Choco'], 'remove pet' + T)
        # person pages + My card save keeps pets
        go('#/person/p1'); ok(pg.locator('.pet-grid .pet:has-text("Mochi")').count() == 1, 'pets on a batchmate page' + T)
        go('#/person/p0'); ok('Choco' in txt() and pg.locator('a[href="#/pets"]').count() >= 1, 'own page shows pets + edit link' + T)
        go('#/me'); pg.evaluate("document.querySelectorAll('details.fgroup').forEach(d=>d.open=true)")
        ok(pg.locator('a.tile[href="#/pets"]').count() == 1, 'My card links to My pets' + T)
        ok('Pets screen' in txt(), 'pets text field hint' + T)
        pg.locator('#me-form button[type=submit]').first.click(); pg.wait_for_timeout(600)
        ok(len(pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).petList") or []) == 1, 'saving My card keeps pets' + T)
        # search + nav
        pg.evaluate("()=>{location.hash='#/search/Mochi'}"); pg.wait_for_timeout(400)
        ok('Mochi' in txt(), 'search finds a pet' + T)
        ok(pg.locator('#sidenav a[href="#/pets"], nav a[href="#/pets"]').count() >= 1, 'Pets in the menu' + T)
        # Tagalog
        go('#/about'); pg.locator('input[name=lang][value=tl]').check(force=True); pg.wait_for_timeout(300); go('#/pets')
        ok('bt.pets' not in txt(), 'Tagalog: no raw keys on Pets' + T)
        pg.locator('input[name=lang][value=en]').count()
        ctx.close()
    b.close()
print('ERRORS:', errs)
print('%d/%d PASS' % (sum(res), len(res)))
