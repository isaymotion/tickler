"""1.14.0: monito-monita, badges, events, shoutouts, ask me about, word of the day. Usage: python3 qa/f114_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, datetime, os, tempfile
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
td = datetime.date.today()
def card(i, name, **k):
    c = {'id': 'p%d' % i, 'name': name, 'bmonth': (i % 12) + 1, 'bday': 3 + i, 'byear': 1995, 'updated': '2026-11-01T00:00:00.000Z'}; c.update(k); return c
me = card(0, 'Me Tester', askMe='Running, Cats', lists={'wishlist': [{'title': 'Mug'}]})
others = [card(1, 'Ana Reyes', askMe='K-dramas, Hiking, Baking, Extra', teachWords='Mayap a abak — good morning (Kapampangan)\nSalamat po — thank you',
               lists={'wishlist': [{'title': 'Stethoscope', 'url': 'https://shopee.ph/x'}]}),
          card(2, 'Ben Santos', teachWords='Maayong buntag: good morning', shoutouts=[{'to': 'p0', 'name': 'Me Tester', 'text': 'Thanks for the notes!', 'date': '2026-11-09T00:00:00Z'}], badges=['bingo', 'zzz-bad', 'started']),
          card(3, 'Carla Lim'), card(4, 'Dan Cruz'), card(5, 'Ella Go')]
res = []; errs = []
def ok(c, m): res.append(c); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, accept_downloads=True)
    ctx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=BASE)
    pg = ctx.new_page()
    pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
    pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", [me, others]); pg.reload(); pg.wait_for_timeout(400)
    pg.evaluate("delete navigator.share")
    def go(h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(250)
    def noov(m): ok(not pg.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no overflow ' + m)
    # Home
    tx = pg.inner_text('main')
    ok('WORD OF THE DAY' in tx.upper(), 'word card'); w1 = pg.inner_text('.word__w'); pg.click('[data-another="word"]'); pg.wait_for_timeout(100); ok(pg.inner_text('.word__w') != w1, 'word another %s -> %s' % (w1, pg.inner_text('.word__w')))
    ok('Thanks for the notes!' in tx, 'shoutout for you on home')
    ok('First day of residency' in tx, 'next event stat (first day)')
    badges = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:badges')||'{}')"); ok('started' in badges and 'collector5' in badges, 'auto badges %s' % sorted(badges))
    ok(pg.locator('.toast.is-on').count() == 1, 'toast shown')
    meb = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).badges"); ok('collector5' in meb, 'badges copied to my card')
    noov('home'); pg.screenshot(path=out + '/home.png', full_page=True)
    # batch grid chips
    go('#/batch'); ok(pg.locator('.pcard .askme__t').count() == 5, 'ask chips on grid (3 Ana + 2 me) = %d' % pg.locator('.pcard .askme__t').count())
    # person + shoutouts
    go('#/person/p2'); t2 = pg.inner_text('main'); ok('Bingo!' in t2 and 'zzz' not in t2, 'badge chips on Ben (bad id dropped)')
    pg.fill('#shout-form textarea', 'You rock, Ben!'); pg.locator('#shout-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(300)
    ok('You rock, Ben!' in pg.inner_text('.shouts'), 'shoutout shows on Ben')
    ms = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).shoutouts"); ok(len(ms) == 1 and ms[0]['to'] == 'p2', 'stored on my card')
    ok('shoutout' in pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:badges'))"), 'cheerleader badge')
    pg.click('[data-unshout="0"]'); pg.wait_for_timeout(200); ok('You rock' not in pg.inner_text('.shouts'), 'remove shoutout')
    go('#/person/p1'); ok('Ask me about' in pg.inner_text('.person__head') or 'ASK ME ABOUT' in pg.inner_text('.person__head').upper(), 'ask chips on person'); ok(pg.locator('.person__head .askme__t').count() == 3, 'max 3 chips')
    go('#/person/p0'); ok('Shoutouts for you' in pg.inner_text('main') and 'Thanks for the notes!' in pg.inner_text('main'), 'own page shoutouts for you')
    for i in [3, 4, 5]: go('#/person/p%d' % i)
    go('#/'); ok('meteveryone' in pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:badges'))"), 'met everyone badge')
    # Badges page
    go('#/badges'); ok(pg.locator('.badge-card.is-on').count() >= 4, 'badges page earned %d' % pg.locator('.badge-card.is-on').count()); noov('badges')
    # Events
    go('#/events'); ok('First day of residency' in pg.inner_text('.ev-list'), 'builtin event')
    d1 = (td + datetime.timedelta(days=5)).isoformat()
    pg.fill('#ev-form [name=title]', 'Welcome dinner'); pg.fill('#ev-form [name=date]', d1); pg.fill('#ev-form [name=time]', '18:30'); pg.fill('#ev-form [name=place]', 'Balanga')
    pg.locator('#ev-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(250)
    ok('Welcome dinner' in pg.inner_text('.ev-list') and 'In 5 days' in pg.inner_text('.ev-list').title() or 'in 5 days' in pg.inner_text('.ev-list').lower(), 'event added with countdown')
    pg.locator('[data-evedit]').first.click(); pg.wait_for_timeout(200); ok(pg.input_value('#ev-form [name=title]') == 'Welcome dinner', 'edit loads')
    pg.fill('#ev-form [name=title]', 'Welcome dinner!'); pg.locator('#ev-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(200)
    ok(len(pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:events'))")) == 1 and 'Welcome dinner!' in pg.inner_text('.ev-list'), 'edit saved, no dup')
    with pg.expect_download() as dl: pg.locator('[data-evcal]').first.click()
    ics = open(dl.value.path()).read(); ok('BEGIN:VEVENT' in ics, 'event ics')
    with pg.expect_download() as dl: pg.click('#ev-all')
    ics = open(dl.value.path()).read(); ok(ics.count('BEGIN:VEVENT') == 2 and 'T183000' in ics, 'all ics (2 events, timed)')
    ok('planner' in pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:badges'))"), 'planner badge')
    noov('events'); pg.screenshot(path=out + '/events.png', full_page=True)
    # share batch includes events; import merges
    go('#/share')
    with pg.expect_download() as dl: pg.click('#sh-all')
    pay = json.load(open(dl.value.path())); ok(len(pay.get('events', [])) == 1, 'batch file carries events')
    pay['events'][0]['title'] = 'Newer title'; pay['events'][0]['updated'] = '2099-01-01T00:00:00Z'
    pay['events'].append({'id': 'x1', 'title': 'Board review', 'date': (td + datetime.timedelta(days=40)).isoformat(), 'updated': '2026-01-01T00:00:00Z'})
    fp = os.path.join(tempfile.mkdtemp(), 'b.json'); json.dump(pay, open(fp, 'w'))
    pg.set_input_files('#sh-file', fp); pg.wait_for_timeout(400); ok('2 event' in pg.inner_text('#sh-status'), 'import events msg: ' + pg.inner_text('#sh-status'))
    evs = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:events'))"); ok(sorted(e['title'] for e in evs) == ['Board review', 'Newer title'], 'events merged')
    go('#/'); ok('Newer title' in pg.inner_text('.home__stats'), 'home next event = soonest stored')
    # Monito
    go('#/monito'); ok(pg.locator('#mm-form [name=p]:checked').count() == 6, 'all checked')
    pg.fill('#mm-form [name=budget]', '₱500'); pg.fill('#mm-form [name=date]', (td + datetime.timedelta(days=30)).isoformat())
    pg.locator('#mm-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(300)
    m = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:monito'))")
    givers = [x[0] for x in m['pairs']]; recv = [x[1] for x in m['pairs']]
    ok(len(m['pairs']) == 6 and sorted(givers) == sorted(recv) and all(a != b2 for a, b2 in m['pairs']), 'valid derangement')
    ok('hidden' in pg.inner_text('.mm-list') and '→' not in pg.inner_text('.mm-list'), 'matches hidden')
    pa = [x for x in m['pairs'] if x[1] == 'p1'][0][0]
    pg.click('[data-mmsend="%s"]' % pa); pg.wait_for_timeout(300)
    clip = pg.evaluate('navigator.clipboard.readText()'); ok('Ana Reyes' in clip and '₱500' in clip and 'Stethoscope' in clip and 'shopee.ph/x' in clip, 'message has match, budget, wishlist')
    ok('sent' in pg.inner_text('.mm-list'), 'marked sent')
    pg.click('[data-mmpeek="%s"]' % pa); pg.wait_for_timeout(150); ok('→ Ana Reyes' in pg.inner_text('.mm-list'), 'peek')
    ok(any(e['id'].startswith('monito-') for e in pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:events'))")), 'exchange added to events')
    ok('monito' in pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:badges'))"), 'monito badge')
    noov('monito'); pg.screenshot(path=out + '/monito.png', full_page=True)
    pg.click('#mm-redraw'); pg.wait_for_timeout(200); ok(pg.locator('#mm-form').count() == 1, 'redraw -> setup')
    # editor has new fields; save keeps shoutouts/badges
    go('#/me'); pg.evaluate("document.querySelectorAll('details.fgroup').forEach(d=>d.open=true)")
    ok(pg.locator('[name=askMe]').count() == 1 and pg.locator('[name=teachWords]').count() == 1, 'new fields in editor')
    pg.fill('[name=teachWords]', 'Agyamanak — thank you (Ilocano)'); pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_function("location.hash.indexOf('#/person/')===0", timeout=5000)
    mm = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))"); ok(len(mm['badges']) >= 5 and mm['teachWords'].startswith('Agyamanak'), 'save keeps badges')
    ok('polyglot' in pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:badges'))"), 'polyglot badge')
    ctx.close()
    for tag, sch, lang, vp in [('dark', 'dark', 'en', (390, 844)), ('tl', 'light', 'tl', (390, 844)), ('desk', 'light', 'en', (1280, 900))]:
        ctx = b.new_context(viewport={'width': vp[0], 'height': vp[1]}, color_scheme=sch); pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort()); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'));localStorage.setItem('bt:v1:lang',JSON.stringify(a[2]))}", [me, others, lang]); pg.reload(); pg.wait_for_timeout(300)
        for h in ['#/', '#/events', '#/monito', '#/badges', '#/person/p2', '#/batch']:
            go(h); noov(tag + ' ' + h)
            if tag != 'tl' and h in ('#/', '#/badges', '#/person/p2'): pg.screenshot(path='%s/%s-%s.png' % (out, tag, h.strip('#/').replace('/', '-') or 'home'), full_page=True)
        ctx.close()
    b.close()
ok(not errs, 'no page errors %s' % errs[:3]); print('%d/%d passed' % (sum(res), len(res)))
