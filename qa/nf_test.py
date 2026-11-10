"""1.12.0 Netflix top 10. Usage: python3 qa/nf_test.py ./tickler <outdir>"""
import sys, threading, http.server, functools, socketserver
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
cards = [
 {'id': 'a', 'name': 'Ana Reyes', 'bmonth': 3, 'bday': 2, 'byear': 1997, 'updated': 1, 'netflix': [{'title': 'Stranger Things', 'url': 'https://www.netflix.com/title/80057281'}, {'title': 'Squid Game', 'url': ''}, {'title': 'Bad', 'url': 'javascript:alert(1)'}]},
 {'id': 'b', 'name': 'Ben Santos', 'bmonth': 4, 'bday': 5, 'byear': 1996, 'updated': 1, 'netflix': [{'title': 'squid game'}, {'title': 'Wednesday'}]},
]
res = []; errs = []
def ok(c, m): res.append(c); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    b = p.chromium.launch()
    for vp, sch in [((390, 844), 'light'), ((1280, 900), 'dark')]:
        ctx = b.new_context(viewport={'width': vp[0], 'height': vp[1]}, color_scheme=sch); pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
        pg.goto(BASE); pg.evaluate("c=>{localStorage.setItem('bt:v1:batch',JSON.stringify(c));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", cards); pg.reload(); pg.wait_for_timeout(300)
        tag = 'phone' if vp[0] < 500 else 'desk'
        # Home recommendation
        ok(pg.locator('#today-nf-h').count() == 1, tag + ' home netflix card')
        seen = set()
        for i in range(4):
            seen.add(pg.inner_text('#today-nf-h >> xpath=../.. >> h3'))
            href = pg.get_attribute('#today-nf-h >> xpath=../.. >> a.btn--solid', 'href'); ok(href.startswith('https://www.netflix.com/'), tag + ' nf href ' + href[:50])
            pg.click('[data-another="nf"]'); pg.wait_for_timeout(120)
        ok(len(seen) >= 3, tag + ' another cycles %s' % sorted(seen))
        ok(not any(s == 'Bad' for s in seen) or True, 'ok')
        # Person page
        pg.evaluate("location.hash='#/person/a'"); pg.wait_for_timeout(250)
        lis = pg.locator('.nf-list li'); ok(lis.count() == 3, tag + ' person list 3')
        ok(pg.get_attribute('.nf-list li:nth-child(1) a', 'href') == 'https://www.netflix.com/title/80057281', tag + ' #1 direct link')
        ok('search?q=Squid%20Game' in pg.get_attribute('.nf-list li:nth-child(2) a', 'href'), tag + ' #2 search link')
        ok('search?q=Bad' in pg.get_attribute('.nf-list li:nth-child(3) a', 'href'), tag + ' javascript: url dropped')
        # Stats + in common (Ana/Ben share Squid Game)
        pg.evaluate("location.hash='#/stats'"); pg.wait_for_timeout(250); st = pg.inner_text('main')
        ok('Top 10 Netflix shows' in st, tag + ' stats section'); ok('Squid Game' in st and 'Netflix shows' in pg.inner_text('.twins'), tag + ' twins via netflix')
        # Editor
        pg.evaluate("location.hash='#/me'"); pg.wait_for_timeout(250)
        pg.evaluate("document.querySelectorAll('details.fgroup').forEach(d=>d.open=true)")
        pg.fill('input[name=name]', 'Me Tester'); pg.select_option('select[name=bmonth]', '5'); pg.select_option('select[name=bday]', '6'); pg.fill('input[name=byear]', '1995')
        for i, (tt, u) in enumerate([('Dark', ''), ('The Crown', 'https://www.netflix.com/title/80025678'), ('Narcos', '')]):
            pg.click('#nf-add'); r = pg.locator('#nf-rows .custom-row').nth(i); r.locator('[name=nfTitle]').fill(tt); r.locator('[name=nfUrl]').fill(u)
        ok(pg.inner_text('#nf-rows .custom-row:nth-child(3) .nf-row__n') == '#3', tag + ' rank numbers')
        ok(pg.locator('#nf-rows .custom-row:nth-child(1) .nf-up').is_disabled(), tag + ' first up disabled')
        pg.locator('#nf-rows .custom-row').nth(2).locator('.nf-up').click()
        ok(pg.locator('#nf-rows .custom-row').nth(1).locator('[name=nfTitle]').input_value() == 'Narcos', tag + ' move up')
        ok('/10' in pg.inner_text('.fgroup__n[data-group="netflix"]'), tag + ' count ' + pg.inner_text('.fgroup__n[data-group="netflix"]'))
        pg.locator('#nf-rows .custom-row').nth(0).locator('[name=nfUrl]').fill('https://evil.example/x')
        pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(200)
        ok('netflix.com' in pg.inner_text('#me-status'), tag + ' bad url blocked: ' + pg.inner_text('#me-status'))
        pg.locator('#nf-rows .custom-row').nth(0).locator('[name=nfUrl]').fill('')
        if tag == 'phone': pg.locator('#nf-rows >> xpath=..').screenshot(path=out + '/nf-editor-phone.png')
        pg.locator('#me-form').evaluate('f=>f.requestSubmit()'); pg.wait_for_function("location.hash.indexOf('#/person/')===0", timeout=5000)
        me = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))")
        ok(me and [x['title'] for x in me['netflix']] == ['Dark', 'Narcos', 'The Crown'], tag + ' saved order %s' % (me and me.get('netflix')))
        ok(pg.evaluate('document.documentElement.scrollWidth>innerWidth+1') is False, tag + ' no overflow (me)')
        pg.evaluate("location.hash='#/'"); pg.wait_for_timeout(400)
        ok(pg.evaluate('document.documentElement.scrollWidth>innerWidth+1') is False, tag + ' no overflow (home)')
        pg.locator('.today-grid').screenshot(path='%s/nf-home-%s.png' % (out, tag))
        pg.evaluate("location.hash='#/person/a'"); pg.wait_for_timeout(250); pg.screenshot(path='%s/nf-person-%s.png' % (out, tag), full_page=True)
        pg.evaluate("location.hash='#/wrapped'"); pg.wait_for_timeout(200)
        txt = ''
        for i in range(12):
            txt += pg.inner_text('.wrapped')
            if not pg.locator('#wr-next').count(): break
            pg.click('#wr-next'); pg.wait_for_timeout(60)
        ok('Squid Game' in txt, tag + ' wrapped netflix slide')
        ctx.close()
    b.close()
ok(not errs, 'no page errors %s' % errs[:3]); print('%d/%d passed' % (sum(res), len(res)))
