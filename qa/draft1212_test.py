"""1.21.2: My card keeps unsaved changes as a draft (store bt:v1:meDraft).
Usage: python3 qa/draft1212_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, os
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
me = {'id': 'p0', 'name': 'Me Tester', 'bmonth': 3, 'bday': 3, 'byear': 1995, 'hometown': 'Cebu', 'updated': '2026-11-01T00:00:00.000Z'}
others = [{'id': 'p1', 'name': 'Ana Reyes', 'bmonth': 4, 'bday': 4, 'byear': 1996, 'updated': '2026-11-01T00:00:00.000Z'}]
res = []; errs = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    pg = ctx.new_page()
    pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
    pg.on('pageerror', lambda e: errs.append(str(e)))
    confirm = {'v': True}
    pg.on('dialog', lambda d: d.accept() if confirm['v'] else d.dismiss())
    def go(h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(350)
    def openall(): pg.evaluate("document.querySelectorAll('details.fgroup').forEach(d=>d.open=true)")
    def draft(): return pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:meDraft')||'null')")
    pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", [me, others]); pg.reload(); pg.wait_for_timeout(400)
    # 1. open without typing: no draft, no banner
    go('#/me')
    ok(pg.locator('#me-draft').count() == 0, 'no banner on a clean open')
    go('#/'); ok(draft() is None, 'no draft written without edits')
    # 2. type, leave right away (before debounce) -> flushed by route
    go('#/me'); openall()
    pg.fill('input[name=hometown]', 'Mariveles, Bataan')
    pg.fill('input[name=nickname]', 'Mei') if pg.locator('input[name=nickname]').count() else None
    pg.locator('#custom-add').click(); pg.fill('#custom-rows .custom-row:last-child [name=customLabel]', 'Fave snack'); pg.fill('#custom-rows .custom-row:last-child [name=customValue]', 'Turon')
    pg.evaluate("location.hash='#/batch'"); pg.wait_for_timeout(350)
    d = draft()
    ok(d and d.get('hometown') == 'Mariveles, Bataan', 'leaving flushes the draft')
    ok(d and d.get('base') == pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).updated"), 'draft remembers its base')
    ok(pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')).hometown") == 'Cebu', 'saved card untouched')
    # 3. come back: values restored, banner shown, note shown
    go('#/me'); openall()
    ok(pg.input_value('input[name=hometown]') == 'Mariveles, Bataan', 'hometown restored')
    ok(pg.locator('#custom-rows [name=customValue]').last.input_value() == 'Turon', 'custom row restored')
    ok(pg.locator('#me-draft').is_visible() and 'Unsaved changes' in pg.inner_text('#me-draft'), 'banner shown')
    ok(pg.locator('#me-draft-note').is_visible(), 'draft note by Save')
    pg.screenshot(path=os.path.join(out, 'draft-banner.png'))
    # 4. reload (iOS killed the app) keeps it
    pg.reload(); pg.wait_for_timeout(400); go('#/me')
    ok(pg.input_value('input[name=hometown]') == 'Mariveles, Bataan', 'draft survives reload')
    # 5. debounce write while staying on the screen
    openall(); pg.fill('input[name=hometown]', 'Balanga'); pg.wait_for_timeout(700)
    ok((draft() or {}).get('hometown') == 'Balanga', 'debounced write after typing')
    # 6. failed save (no name) keeps the draft
    pg.fill('input[name=name]', ''); pg.click('#me-form button[type=submit]'); pg.wait_for_timeout(300)
    ok('is-error' in (pg.get_attribute('#me-status', 'class') or ''), 'empty name blocks save')
    ok(draft() is not None, 'draft kept after a failed save')
    go('#/'); go('#/me')
    ok(pg.input_value('input[name=name]') == '' and pg.input_value('input[name=hometown]') == 'Balanga', 'empty name kept in draft')
    # 7. successful save clears it
    pg.fill('input[name=name]', 'Me Tester'); pg.click('#me-form button[type=submit]'); pg.wait_for_timeout(900)
    ok(pg.evaluate('location.hash').startswith('#/person/'), 'save redirects to my page')
    ok(draft() is None, 'save clears the draft')
    sv = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))")
    ok(sv['hometown'] == 'Balanga' and any(c['value'] == 'Turon' for c in sv['custom']), 'saved card has the drafted values')
    go('#/me'); ok(pg.locator('#me-draft').count() == 0, 'no banner after save')
    # 8. discard
    openall(); pg.fill('input[name=hometown]', 'Olongapo'); go('#/'); go('#/me')
    ok(pg.input_value('input[name=hometown]') == 'Olongapo', 'second draft restored')
    pg.click('#me-draft-discard'); pg.wait_for_timeout(400)
    ok(draft() is None and pg.input_value('input[name=hometown]') == 'Balanga', 'discard returns to saved card')
    # 9. a newer saved card (from another device) retires the draft
    openall(); pg.fill('input[name=hometown]', 'Stale'); go('#/')
    pg.evaluate("()=>{var m=JSON.parse(localStorage.getItem('bt:v1:me'));m.updated='2030-01-01T00:00:00.000Z';m.hometown='Fresh';localStorage.setItem('bt:v1:me',JSON.stringify(m))}")
    go('#/me')
    ok(pg.input_value('input[name=hometown]') == 'Fresh' and draft() is None, 'newer saved card wins over an old draft')
    # 10. partner role + list row + photo removal survive
    openall()
    pg.check('input[name=cardRole][value=partner]'); pg.wait_for_timeout(100)
    pg.select_option('select[name=partnerOf]', 'p1') if pg.locator('select[name=partnerOf]').count() else pg.fill('input[name=partnerName]', 'Ana Reyes')
    pg.locator('[data-ladd=books]').click(); pg.fill('#rows-books .custom-row:last-child [name=lTitle]', 'Norwegian Wood')
    go('#/'); go('#/me'); openall()
    ok(pg.is_checked('input[name=cardRole][value=partner]') and pg.locator('.pt-who').is_visible(), 'partner role restored')
    ok(pg.locator('#rows-books [name=lTitle]').last.input_value() == 'Norwegian Wood', 'list row restored')
    # 11. Tagalog banner
    pg.evaluate("localStorage.setItem('bt:v1:lang',JSON.stringify('tl'))"); pg.reload(); pg.wait_for_timeout(400); go('#/me')
    ok('Naibalik' in pg.inner_text('#me-draft'), 'Tagalog banner')
    ok(not pg.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no overflow')
    b.close()
print('ERRORS:', errs)
print('%d/%d PASS' % (sum(res), len(res)))
sys.exit(0 if all(res) and not errs else 1)
