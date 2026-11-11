"""1.23.0: My card is easier to find (tab bar, menu, Home strip) and edit (section Edit links, jump chips,
next empty question, sticky Save). Usage: python3 qa/nav123_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, os
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
U = '2026-11-01T00:00:00.000Z'
PH = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='
me = {'id': 'p0', 'name': 'Me Tester', 'bmonth': 3, 'bday': 3, 'byear': 1995, 'hometown': 'Cebu', 'food': 'Sinigang', 'updated': U}
others = [{'id': 'p1', 'name': 'Ana Reyes', 'bmonth': 4, 'bday': 4, 'byear': 1996, 'hometown': 'Manila', 'updated': U}]
partner = {'id': 'q9', 'name': 'Hubby Tester', 'bmonth': 5, 'bday': 5, 'byear': 1990, 'partnerOf': 'p1', 'partnerName': 'Ana Reyes', 'updated': U}
res = []; errs = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
def seed(pg, mine, batch):
    pg.goto(BASE)
    pg.evaluate("a=>{localStorage.clear();if(a[0])localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", [mine, batch])
    pg.reload(); pg.wait_for_timeout(500)
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    pg = ctx.new_page()
    pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('dialog', lambda d: d.accept())
    def go(h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(350)
    def tap(sel):
        bb = pg.locator(sel).first.bounding_box(); pg.mouse.click(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2); pg.wait_for_timeout(350)
    # ---- no card yet
    seed(pg, None, others)
    tabs = pg.locator('.tabbar [data-tab]').evaluate_all("l=>l.map(e=>e.getAttribute('data-tab'))")
    ok(tabs == ['home', 'chat', 'me', 'emergency', 'menu'], 'tab bar order %s' % tabs)
    ok(pg.evaluate("getComputedStyle(document.querySelector('.tabbar')).gridTemplateColumns.split(' ').length") == 5, 'tab bar has 5 columns')
    ok(pg.locator('.tabbar [data-tab="me"]').is_visible() and 'My card' in pg.inner_text('.tabbar [data-tab="me"]'), 'My card tab visible and labelled')
    ok('tab-me--todo' in pg.get_attribute('.tabbar [data-tab="me"]', 'class'), 'tab marked to-do without a card')
    ok(pg.locator('.nv-me--none').count() == 1 and 'Make my card' in pg.inner_text('.nv-me--none'), 'Home: make-your-card box')
    ok(pg.evaluate("document.querySelector('.wrap.home').firstElementChild.classList.contains('nv-me')"), 'Home: the box comes first')
    tap('.tabbar [data-tab="me"]')
    ok(pg.evaluate('location.hash') == '#/me', 'tab opens My card')
    ok('is-active' in pg.get_attribute('.tabbar [data-tab="me"]', 'class') and pg.get_attribute('.tabbar [data-tab="me"]', 'aria-current') == 'page', 'tab active on My card')
    ok(pg.locator('.nv-jump').count() == 1 and pg.locator('#me-clear').count() == 0, 'new card: jump chips shown, no Clear')
    # ---- with a card
    seed(pg, me, others)
    ok('tab-me--todo' not in pg.get_attribute('.tabbar [data-tab="me"]', 'class'), 'tab no longer to-do')
    strip = pg.locator('.nv-me')
    ok(strip.count() == 1 and 'Me Tester' in strip.inner_text() and 'filled in' in strip.inner_text(), 'Home: Your card strip with name and progress')
    ok(pg.get_attribute('.nv-me__who', 'href') == '#/person/p0' and pg.get_attribute('.nv-me__acts a', 'href') == '#/me', 'strip links: view + edit')
    ok(pg.locator('.home-chat').count() == 0 and pg.evaluate("document.querySelector('.wrap.home').firstElementChild.classList.contains('nv-me')"), 'not in the cloud: strip first (with chat, chat121 checks chat then strip)')
    pg.screenshot(path=os.path.join(out, 'home.png'))
    # menu: My card right under Home
    tap('#tab-menu')
    items = pg.locator('#sidenav a.nav-item').evaluate_all("l=>l.map(e=>e.getAttribute('href'))")
    ok(items[:3] == ['#/', '#/chat', '#/me'] and items.count('#/me') == 1 and items.count('#/chat') == 1, 'menu: Home, Chat, My card (%s)' % items[:3])
    ok('#/about' in items and '#/whats-new' in items, 'menu still has About and What’s new')
    tap('#nav-close') if pg.locator('#nav-close').is_visible() else None
    ok(pg.locator('.site-foot a[href="#/about"]').count() == 1, 'footer still links About')
    # own person page: edit links + empty sections
    go('#/person/p0')
    ok('is-active' in pg.get_attribute('.tabbar [data-tab="me"]', 'class'), 'tab active on my own page')
    eds = pg.locator('.nv-edit').evaluate_all("l=>l.map(e=>e.getAttribute('href'))")
    ok('#/me/basics' in eds and '#/me/favourites' in eds, 'own page: Edit on filled sections %s' % eds)
    chips = pg.locator('.nv-empty .nv-chip').evaluate_all("l=>l.map(e=>e.getAttribute('href'))")
    ok('#/me/background' in chips and '#/me/life' in chips and '#/me/playlists' in chips and '#/me/basics' not in chips, 'own page: empty sections listed (%d)' % len(chips))
    ok(set(eds).isdisjoint(chips), 'no section both edited and empty')
    ok(pg.locator('.nv-edit').first.get_attribute('aria-label').startswith('Edit '), 'edit link has a full label')
    pg.screenshot(path=os.path.join(out, 'own-page.png'), full_page=True)
    go('#/person/p1')
    ok(pg.locator('.nv-edit').count() == 0 and pg.locator('.nv-empty').count() == 0, 'someone else’s page: no edit links')
    ok('is-active' not in pg.get_attribute('.tabbar [data-tab="me"]', 'class'), 'tab not active on someone else')
    # deep link opens only that section
    go('#/person/p0'); pg.locator('.nv-edit[href="#/me/favourites"]').click(); pg.wait_for_timeout(500)
    opened = pg.evaluate("[...document.querySelectorAll('#me-form details.fgroup')].filter(d=>d.open).map(d=>d.querySelector('.fgroup__n').getAttribute('data-group'))")
    ok(pg.evaluate('location.hash') == '#/me/favourites' and opened == ['favourites'], 'Edit opens only Favourites %s' % opened)
    ok(pg.input_value('[name=food]') == 'Sinigang' and pg.locator('[name=food]').is_visible(), 'the section’s fields are there')
    top = pg.evaluate("document.querySelector('.fgroup__n[data-group=favourites]').closest('details').getBoundingClientRect().top")
    ok(0 <= top < 300, 'scrolled to the section (top=%d)' % top)
    go('#/me/list-wishlist')
    ok(pg.evaluate("[...document.querySelectorAll('#me-form details.fgroup')].filter(d=>d.open).map(d=>d.querySelector('.fgroup__n').getAttribute('data-group'))") == ['list-wishlist'], 'list sections deep-link too')
    go('#/me/emergency')
    ok(pg.evaluate("document.querySelector('.fgroup__n[data-group=emergency]').closest('details').open"), '#/me/emergency still opens Emergency')
    go('#/me/nonsense'); ok(pg.locator('#me-form').count() == 1 and not errs, 'unknown section is harmless')
    # jump chips
    go('#/me')
    n = pg.locator('.nv-jump [data-nvjump]').count()
    ok(n == pg.locator('#me-form details.fgroup').count(), 'one jump chip per section (%d)' % n)
    ok(pg.inner_text('[data-nvn=favourites]') == pg.inner_text('.fgroup__n[data-group=favourites]') != '', 'chip shows the count ' + pg.inner_text('[data-nvn=favourites]'))
    pg.locator('[data-nvjump=life]').click(); pg.wait_for_timeout(400)
    ok(pg.evaluate("document.querySelector('.fgroup__n[data-group=life]').closest('details').open") and pg.evaluate("document.querySelector('.fgroup__n[data-group=basics]').closest('details').open"), 'chip opens Life and leaves the others')
    top = pg.evaluate("document.querySelector('.fgroup__n[data-group=life]').closest('details').getBoundingClientRect().top")
    ok(0 <= top < 300, 'chip scrolls to Life (top=%d)' % top)
    # next empty question
    go('#/'); go('#/me')
    pg.locator('#nv-next').click(); pg.wait_for_timeout(300)
    first = pg.evaluate("document.activeElement.name")
    exp = pg.evaluate("window.CARD_FIELDS.map(f=>f.key).filter(k=>!document.getElementById('me-form').elements[k].value.trim())")
    ok(first == exp[0], 'next empty focuses the first blank (%s)' % first)
    pg.locator('#nv-next').click(); pg.wait_for_timeout(300)
    ok(pg.evaluate("document.activeElement.name") == exp[1], 'tapping again moves on (%s)' % exp[1])
    pg.keyboard.type('zzz'); pg.wait_for_timeout(500)
    ok(pg.inner_text('[data-nvn=basics]') == pg.inner_text('.fgroup__n[data-group=basics]'), 'chip count follows typing ' + pg.inner_text('[data-nvn=basics]'))
    ok(pg.evaluate("document.activeElement.closest('details').open"), 'its section is open')
    # sticky save
    pg.evaluate("document.querySelectorAll('details.fgroup').forEach(d=>d.open=true)"); pg.evaluate("window.scrollTo(0, 1500)"); pg.wait_for_timeout(300)
    sb = pg.locator('#me-form button[type=submit]').bounding_box(); tb = pg.locator('.tabbar').bounding_box()
    ok(sb and 0 < sb['y'] and sb['y'] + sb['height'] <= 844, 'Save visible mid-form (y=%d)' % (sb['y'] if sb else -1))
    hid = pg.evaluate("document.body.classList.contains('tabbar-hidden')")
    ok(hid or sb['y'] + sb['height'] <= tb['y'] + 1, 'Save not under the tab bar')
    ok(pg.evaluate("getComputedStyle(document.querySelector('.nv-save')).position") == 'sticky', 'Save bar is sticky')
    ok(pg.evaluate("!document.querySelector('.nv-save').contains(document.getElementById('me-clear'))") and pg.locator('#me-clear').count() == 1, 'Clear is out of the Save bar')
    pg.screenshot(path=os.path.join(out, 'me-sticky.png'))
    # save still works and the draft note is intact
    ok(pg.locator('#me-draft-note').count() == 1, 'draft note still there')
    pg.fill('[name=hometown]', 'Mariveles'); pg.locator('#me-form button[type=submit]').click(); pg.wait_for_function("location.hash.indexOf('#/person/')===0", timeout=5000)
    ok(pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).hometown") == 'Mariveles', 'save works')
    # photo in the tab
    m2 = dict(me, photo=PH); seed(pg, m2, others)
    ok(pg.locator('.tabbar .tab-me__pic img').count() == 1, 'tab shows my photo')
    # partner card owner
    seed(pg, partner, others)
    ok(pg.locator('.nv-me').count() == 1 and 'Hubby Tester' in pg.inner_text('.nv-me'), 'partner: Your card strip')
    go('#/person/q9')
    ok(pg.locator('.nv-edit, .nv-empty .nv-chip').count() >= 1 and 'is-active' in pg.get_attribute('.tabbar [data-tab="me"]', 'class'), 'partner: edit/add links on own page')
    # Tagalog
    pg.evaluate("localStorage.setItem('bt:v1:lang',JSON.stringify('tl'))"); pg.reload(); pg.wait_for_timeout(400); go('#/')
    ok('Card ko' in pg.inner_text('.tabbar [data-tab="me"]') and 'card mo' in pg.inner_text('.nv-me').lower(), 'Tagalog labels')
    pg.evaluate("localStorage.setItem('bt:v1:lang',JSON.stringify('en'))")
    # desktop + dark
    c2 = b.new_context(viewport={'width': 1280, 'height': 800}, color_scheme='dark'); d = c2.new_page()
    d.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort()); d.on('pageerror', lambda e: errs.append(str(e)))
    seed(d, me, others)
    ok(not d.locator('.tabbar').is_visible() and d.locator('.nv-me').is_visible(), 'desktop: no tab bar, strip shown')
    ok(d.locator('#sidenav a.nav-item').nth(1).get_attribute('href') == '#/chat' and d.locator('#sidenav a.nav-item').nth(2).get_attribute('href') == '#/me', 'desktop sidebar: Chat then My card')
    d.evaluate("location.hash='#/me'"); d.wait_for_timeout(400)
    ok(d.evaluate("document.documentElement.scrollWidth<=window.innerWidth"), 'desktop: no sideways scroll')
    d.screenshot(path=os.path.join(out, 'desk-me-dark.png'))
    ok(pg.evaluate("document.documentElement.scrollWidth<=window.innerWidth"), 'phone: no sideways scroll')
    # 1.24.0 look: one-row top bar on phones, search behind a button
    seed(pg, me, others)
    hgt = pg.evaluate("document.querySelector('.topbar').offsetHeight")
    ok(hgt <= 60, 'phone top bar is one row (%dpx)' % hgt)
    ok(pg.locator('#lk-search-btn').is_visible() and not pg.locator('#q').is_visible(), 'search folded into a button')
    bb = pg.locator('#lk-search-btn').bounding_box(); pg.mouse.click(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2); pg.wait_for_timeout(250)
    ok(pg.locator('#q').is_visible() and pg.evaluate("document.activeElement.id") == 'q', 'tap opens and focuses search')
    pg.keyboard.type('Ana', delay=30); pg.wait_for_timeout(500)
    ok(pg.locator('#suggest').is_visible() and 'Ana Reyes' in pg.inner_text('#suggest'), 'suggestions still work')
    pg.keyboard.press('Enter'); pg.wait_for_timeout(400)
    ok(pg.evaluate('location.hash').startswith('#/search') and pg.locator('#q').is_visible(), 'search page opens, box stays while it has text')
    btns = pg.locator('.topbar .icon-btn:visible, .topbar .hist-btn:visible').evaluate_all("l=>l.map(e=>{var r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.right),Math.round(r.height)]})")
    ok(all(b[0] >= 0 and b[1] <= 390 for b in btns) and all(b[2] >= 36 for b in btns), 'top bar buttons on screen and tappable %s' % len(btns))
    ok(d.evaluate("getComputedStyle(document.getElementById('lk-search-btn')).display") == 'none' and d.locator('#q').is_visible(), 'desktop keeps the full search box')
    ok(not errs, 'no page errors %s' % errs[:2])
print('%d/%d PASS' % (sum(res), len(res)))
sys.exit(0 if all(res) else 1)
