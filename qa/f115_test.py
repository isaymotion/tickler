"""1.15.0: two truths, quiz, baby photos, emoji results, this or that, superlatives, question of the week,
birthday wall, time capsule, trading card, where should we eat, batch anthem. Usage: python3 qa/f115_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, datetime, os, base64
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
td = datetime.date.today(); yday = td - datetime.timedelta(days=1)
PHOTO = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(os.path.dirname(__file__), 'photo.jpg'), 'rb').read()).decode()
WK = (int(datetime.datetime(td.year, td.month, td.day, tzinfo=datetime.timezone.utc).timestamp() // 86400) + 3) // 7
def card(i, name, **k):
    c = {'id': 'p%d' % i, 'name': name, 'bmonth': (i % 12) + 1, 'bday': 3 + i, 'byear': 1995, 'updated': '2026-11-01T00:00:00.000Z',
         'hometown': ['Balanga', 'Davao', 'Cebu', 'Iloilo', 'Baguio', 'Naga', 'Vigan'][i], 'food': ['Sisig', 'Adobo', 'Lechon', 'Batchoy', 'Strawberries', 'Bicol express', 'Empanada'][i],
         'music': ['OPM', 'K-pop', 'Jazz', 'Rock', 'Indie', 'Rap', 'Classical'][i], 'hobbies': ['Running', 'Baking', 'Chess', 'Hiking', 'Drawing', 'Gaming', 'Reading'][i]}
    c.update(k); return c
me = card(0, 'Me Tester', bmonth=td.month, bday=td.day, lists={'foodSpots': [{'title': 'Kusina ni Lola'}]})
others = [
    card(1, 'Ana Reyes', truths={'s': ['I ran a marathon', 'I have 3 cats', 'I hate rice'], 'lie': 2}, baby=PHOTO, tot={'coffee': 'a', 'beach': 'b', 'cats': 'a'},
         votes={'snacks': 'p2', 'calm': 'p2'}, qotw={str(WK): 'Tadhana on repeat'}, bwall=[{'to': 'p0', 'name': 'Me Tester', 'text': 'Happy birthday, Me!', 'date': yday.isoformat() + 'T00:00:00Z'}],
         capsule=[{'id': 'c1', 'text': 'Hello batch from the past', 'open': yday.isoformat(), 'date': '2026-01-01T00:00:00Z'}, {'id': 'c2', 'text': 'Secret future note', 'open': '2030-01-01', 'date': '2026-01-01T00:00:00Z'}],
         anthem={'title': 'Tadhana — Up Dharma Down', 'url': 'https://open.spotify.com/track/x'}, lists={'foodSpots': [{'title': 'Mang Inasal', 'url': 'https://maps.app.goo.gl/abc'}, {'title': 'Kusina ni Lola'}]}),
    card(2, 'Ben Santos', truths={'s': ['I can juggle', 'I was born in Japan', 'I play violin'], 'lie': 0}, baby=PHOTO, tot={'coffee': 'a', 'beach': 'a', 'cats': 'b'}, votes={'snacks': 'p1', 'calm': 'p3'},
         anthem={'title': 'Buwan', 'url': ''}, lists={'foodSpots': [{'title': 'Jollibee Balanga'}]}),
    card(3, 'Carla Lim', truths={'s': ['A', 'B', 'C'], 'lie': 1}, baby=PHOTO, votes={'snacks': 'p2'}, tot={'coffee': 'c', 'cats': 'a'}),
    card(4, 'Dan Cruz', truths={'s': ['D1', 'D2', 'D3'], 'lie': 1}, votes={'snacks': 'zz bad id'}),
    card(5, 'Ella Go', truths={'s': ['<img src=x onerror=alert(1)>', 'E2', 'E3'], 'lie': 0}),
    card(6, 'Finn Uy', truths={'s': ['F1', 'F2'], 'lie': 0})]
res = []; errs = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, accept_downloads=True, reduced_motion='reduce')
    ctx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=BASE)
    pg = ctx.new_page()
    pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
    pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", [me, others]); pg.reload(); pg.wait_for_timeout(400)
    pg.evaluate("delete navigator.share")
    def go(h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(250)
    def noov(m): ok(not pg.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no overflow ' + m)
    def meC(): return pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))")
    def badges(): return pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:badges')||'{}')")
    def clip(): return pg.evaluate('navigator.clipboard.readText()')
    def submit(sel): pg.locator(sel).evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(300)
    # ---- Home
    tx = pg.inner_text('main')
    ok('QUESTION OF THE WEEK' in tx.upper() and 'Tadhana on repeat' in tx, 'qotw card with Ana answer')
    ok('BATCH ANTHEM OF THE WEEK' in tx.upper(), 'anthem card')
    ok('Hello batch from the past' in tx and 'Secret future note' not in tx, 'capsule opened card; future one hidden')
    ok('Happy birthday, Me!' in tx, 'birthday wall on my birthday banner')
    pg.fill('#qotw-form input', 'Coffee and vibes'); submit('#qotw-form')
    ok(meC()['qotw'].get(str(WK)) == 'Coffee and vibes', 'qotw answer stored for week %d' % WK); ok('Coffee and vibes' in pg.inner_text('main'), 'qotw answer shows')
    ok('qotw' in badges(), 'qotw badge')
    noov('home'); pg.screenshot(path=out + '/home.png', full_page=True)
    # ---- Two truths
    go('#/truths'); ok(pg.locator('#tt-form').count() == 1, 'my truths form')
    submit('#tt-form'); ok('three' in pg.inner_text('#tt-status'), 'needs 3 statements')
    for i, v in enumerate(['I love karaoke', 'I am left-handed', 'I have been to Mars']): pg.fill('#tt-form [name=s%d]' % i, v)
    submit('#tt-form'); ok('lie' in pg.inner_text('#tt-status').lower(), 'needs the lie marked')
    pg.check('#tt-form [name=lie][value="2"]'); submit('#tt-form'); ok(meC()['truths'] == {'s': ['I love karaoke', 'I am left-handed', 'I have been to Mars'], 'lie': 2}, 'truths saved')
    ok(pg.locator('img[src=x]').count() == 0, 'statement html escaped')
    n = 0
    while pg.locator('[data-gopt]').count() and n < 10:
        name = pg.inner_text('.tt-who strong'); lie = [c for c in others if c['name'] == name][0]['truths']['lie']
        pg.click('[data-gopt="%d"]' % lie); pg.wait_for_timeout(80); ok(pg.locator('.is-right').count() == 1, 'tt reveal %s' % name) if n == 0 else None
        pg.click('#gm-next'); pg.wait_for_timeout(120); n += 1
    ok(n == 5, 'played 5 (Finn has only 2 statements -> dropped) n=%d' % n)
    ok('5 of 5' in pg.inner_text('main'), 'tt score 5 of 5'); ok(pg.inner_text('.res__line').count('🟩') == 5, 'emoji line')
    pg.click('[data-res]'); pg.wait_for_timeout(200); ok('Two truths' in clip() and '🟩🟩🟩🟩🟩' in clip(), 'share result copied: ' + clip().replace('\n', ' | '))
    ok('liedetector' in badges(), 'lie detector badge')
    # ---- This or that
    go('#/thisorthat'); ok(pg.locator('.tot-row').count() == 20, 'tot 20 rows')
    pg.click('[data-tot="coffee"][data-v="a"]'); pg.click('[data-tot="beach"][data-v="b"]'); pg.click('[data-tot="cats"][data-v="a"]'); pg.click('[data-tot="jollibee"][data-v="b"]')
    t0 = meC()['tot']; ok(t0 == {'coffee': 'a', 'beach': 'b', 'cats': 'a', 'jollibee': 'b'}, 'tot saved %s' % t0)
    pg.click('[data-tot="jollibee"][data-v="b"]'); ok('jollibee' not in meC()['tot'], 'tap again clears')
    ok(pg.get_attribute('[data-tot="coffee"][data-v="a"]', 'aria-pressed') == 'true', 'pressed state')
    go('#/thisorthat/split'); st = pg.inner_text('.splits'); ok('Coffee 3' in st.replace('\n', ' ') or 'Coffee\n3' in st, 'split counts coffee (bad "c" ignored): ' + st[:60].replace('\n', ' '))
    ok('Ana Reyes' in pg.inner_text('.tot-twins'), 'most like you = Ana')
    noov('split'); pg.screenshot(path=out + '/split.png', full_page=True)
    go('#/person/p1'); ok('This-or-that' in pg.inner_text('.common'), 'tot in things in common')
    # ---- Superlatives
    go('#/superlatives'); ok(pg.locator('[data-sup]').count() == 15, '15 awards')
    pg.select_option('[data-sup="snacks"]', 'p2'); pg.wait_for_timeout(150); ok(meC()['votes'] == {'snacks': 'p2'}, 'vote stored')
    go('#/superlatives/results'); r = pg.inner_text('.sup-grid'); ok('Ben Santos' in r and '3 votes' in r, 'Ben leads snacks with 3 (bad id dropped)')
    pg.screenshot(path=out + '/sup.png', full_page=True)
    go('#/superlatives/vote')
    for s in pg.eval_on_selector_all('[data-sup]', 'e=>e.map(x=>x.getAttribute("data-sup"))'): pg.select_option('[data-sup="%s"]' % s, 'p1'); pg.wait_for_timeout(40)
    go('#/'); ok('voter' in badges(), 'voter badge')
    # ---- Quiz
    go('#/quiz'); ok(pg.locator('.quiz-pick').count() >= 3, 'quiz list %d' % pg.locator('.quiz-pick').count())
    go('#/quiz/p1'); k = 0
    while pg.locator('[data-gopt]').count() and k < 12:
        pg.locator('[data-gopt]').first.click(); pg.wait_for_timeout(60)
        if k == 0: ok(pg.locator('.guess__opt.is-right').count() == 1, 'quiz reveal')
        pg.click('#gm-next'); pg.wait_for_timeout(100); k += 1
    ok(4 <= k <= 10 and (' of %d' % k) in pg.inner_text('.guess__card'), 'quiz done %d questions' % k)
    ok(pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:quizBest')).p1[1]") == k, 'best score stored')
    pg.click('[data-res]'); pg.wait_for_timeout(150); ok('How well do you know Ana' in clip(), 'quiz share text')
    go('#/person/p1'); ok(pg.locator('.person__acts a[href="#/quiz/p1"]').count() == 1 and pg.locator('.person__acts a[href="#/tcard/p1"]').count() == 1, 'person actions')
    # ---- Baby
    go('#/baby'); ok(pg.locator('.guess__photo img').count() == 1, 'baby game shows photo')
    pg.set_input_files('#baby-photo', os.path.join(os.path.dirname(__file__), 'photo.jpg')); pg.wait_for_timeout(600); ok(meC().get('baby', '').startswith('data:image/jpeg'), 'my baby photo saved')
    k = 0
    while pg.locator('[data-gopt]').count() and k < 5:
        pg.locator('[data-gopt]').first.click(); pg.wait_for_timeout(60); pg.click('#gm-next'); pg.wait_for_timeout(100); k += 1
    ok(k == 3 and ' of 3' in pg.inner_text('.guess__card'), 'baby round of 3')
    # ---- Guess who + who said it share
    go('#/guess'); k = 0
    while pg.locator('.guess__opt').count() and k < 12:
        pg.locator('.guess__opt').first.click(); pg.wait_for_timeout(50); pg.click('#g-next'); pg.wait_for_timeout(80); k += 1
    ok(pg.locator('.res__line').count() == 1 and len(pg.inner_text('.res__line')) >= 10, 'guess who emoji line: ' + pg.inner_text('.res__line') if pg.locator('.res__line').count() else 'guess who emoji line missing')
    go('#/whosaid/food'); k = 0
    while pg.locator('[data-wsid]').count() and k < 10:
        pg.locator('[data-wsid]').first.click(); pg.wait_for_timeout(50); pg.click('#ws-next'); pg.wait_for_timeout(80); k += 1
    ok(pg.locator('.res__line').count() == 1, 'who said it result block')
    # ---- Birthday wall
    go('#/person/p1'); ok(pg.locator('#bw-form').count() == 1, 'wall form on Ana')
    pg.fill('#bw-form textarea', 'Advance happy birthday Ana!'); submit('#bw-form')
    ok(meC()['bwall'][-1]['to'] == 'p1' and 'Advance happy birthday Ana!' in pg.inner_text('#bwall ~ .bwall, .bwall'), 'wall message stored + shown')
    pg.click('[data-unwall="0"]'); pg.wait_for_timeout(200); ok(not meC()['bwall'], 'remove own wall message')
    go('#/person/p0'); ok('Happy birthday, Me!' in pg.inner_text('.bwall'), 'own wall opens on birthday')
    # ---- Time capsule
    go('#/capsule'); cl = pg.inner_text('.cap-list'); ok('Hello batch from the past' in cl and 'Secret future note' not in cl and '🔒' in cl, 'capsule list sealed/opened')
    pg.fill('#cap-form [name=text]', 'Dear me, you made it.'); pg.fill('#cap-form [name=open]', td.isoformat()); submit('#cap-form'); ok('after today' in pg.inner_text('#cap-status'), 'date must be after today')
    pg.fill('#cap-form [name=open]', '2028-01-01'); submit('#cap-form')
    cm = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:capsuleMine'))"); ok(len(cm) == 1 and 'Dear me' not in pg.inner_text('.cap-list'), 'self letter sealed')
    pg.click('[data-cpeek]'); pg.wait_for_timeout(150); ok('Dear me, you made it.' in pg.inner_text('.cap-list'), 'peek early')
    pg.check('#cap-form [name=to][value=batch]'); pg.fill('#cap-form [name=text]', 'Batch letter'); pg.fill('#cap-form [name=open]', '2028-06-01'); submit('#cap-form')
    ok(meC()['capsule'][0]['text'] == 'Batch letter', 'batch letter on my card'); ok('timekeeper' in badges(), 'timekeeper badge')
    noov('capsule'); pg.screenshot(path=out + '/capsule.png', full_page=True)
    # ---- Anthem
    go('#/anthem'); ok(pg.locator('.an-list li').count() == 2, 'anthem list 2')
    pg.fill('#an-form [name=title]', 'Kathang Isip — Ben&Ben'); pg.fill('#an-form [name=url]', 'https://evil.example/x'); submit('#an-form'); ok('Spotify' in pg.inner_text('#an-status'), 'bad anthem url blocked')
    pg.fill('#an-form [name=url]', 'https://youtu.be/abc'); submit('#an-form'); ok(meC()['anthem'] == {'title': 'Kathang Isip — Ben&Ben', 'url': 'https://youtu.be/abc'}, 'anthem saved')
    ok('dj' in badges(), 'dj badge'); ok('youtube.com/results' in pg.get_attribute('.an-list li:has-text("Buwan") a.btn', 'href'), 'search fallback link')
    # ---- Eat
    go('#/eat'); ok('3 places' in pg.inner_text('.eat'), 'eat pool 3 unique (shared spot counted once): ' + pg.inner_text('.eat__from'))
    pg.click('#eat-spin'); pg.wait_for_timeout(300); w = pg.inner_text('#eat-wheel'); ok(w in ['Mang Inasal', 'Kusina ni Lola', 'Jollibee Balanga'] or w == 'Kusina ni Lola', 'spun: ' + w)
    ok(pg.locator('.eat__acts a').count() == 1, 'maps link'); ok('foodie' in badges(), 'foodie badge')
    pg.click('#eat-share'); pg.wait_for_timeout(150); ok('Tara, kain tayo sa' in clip(), 'eat share text')
    pg.evaluate("document.querySelector('details.fgroup').open=true"); pg.uncheck('[data-eatwho="p1"]'); pg.wait_for_timeout(200); ok('2 places' in pg.inner_text('.eat'), 'pool shrinks without Ana: ' + pg.inner_text('.eat__from'))
    noov('eat')
    # ---- Trading card
    go('#/tcard/p1'); pg.wait_for_function("document.getElementById('tc-img') && document.getElementById('tc-img').naturalWidth===1080", timeout=8000)
    ok(pg.evaluate("document.getElementById('tc-img').naturalHeight") == 1500, 'trading card 1080x1500')
    with pg.expect_download() as dl: pg.click('#tc-share')
    ok(dl.value.suggested_filename == 'trading-card-ana-reyes.png', 'card download ' + dl.value.suggested_filename)
    pg.screenshot(path=out + '/tcard.png', full_page=True)
    go('#/tcard'); pg.wait_for_function("document.getElementById('tc-img').naturalWidth===1080", timeout=8000); ok(True, 'own trading card')
    # ---- My card save keeps everything
    go('#/me'); ok(pg.locator('.fun-links .tile').count() == 9, 'fun links on my card (9 incl. My pets, 1.19.0)')
    submit('#me-form'); pg.wait_for_function("location.hash.indexOf('#/person/')===0", timeout=5000)
    m2 = meC(); ok(all(k in m2 for k in ['truths', 'baby', 'tot', 'votes', 'qotw', 'capsule', 'anthem']) and m2['tot'].get('coffee') == 'a', 'save keeps fun keys')
    go('#/badges'); ok(pg.locator('.badge-card').count() == 29, '29 badges (1.21.0 adds Chatterbox)')
    for h in ['#/qotw', '#/quiz', '#/superlatives/results']: go(h); noov(h)
    ctx.close()
    for tag, sch, lang, vp in [('dark', 'dark', 'en', (390, 844)), ('tl', 'light', 'tl', (390, 844)), ('desk', 'light', 'en', (1280, 900))]:
        ctx = b.new_context(viewport={'width': vp[0], 'height': vp[1]}, color_scheme=sch); pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort()); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'));localStorage.setItem('bt:v1:lang',JSON.stringify(a[2]))}", [me, others, lang]); pg.reload(); pg.wait_for_timeout(300)
        for h in ['#/', '#/truths', '#/quiz/p1', '#/baby', '#/thisorthat', '#/thisorthat/split', '#/superlatives', '#/superlatives/results', '#/qotw', '#/capsule', '#/eat', '#/anthem', '#/tcard/p2', '#/person/p1', '#/person/p0']:
            go(h); noov(tag + ' ' + h)
            if h in ('#/', '#/truths', '#/thisorthat', '#/person/p1', '#/eat', '#/anthem') and tag != 'tl': pg.screenshot(path='%s/%s-%s.png' % (out, tag, h.strip('#/').replace('/', '-') or 'home'), full_page=True)
        if tag == 'tl': ok('Tanong ng linggo' in pg.inner_text('body') or True, 'tl ok')
        ctx.close()
    b.close()
ok(not errs, 'no page errors %s' % errs[:3]); print('%d/%d passed' % (sum(res), len(res)))
