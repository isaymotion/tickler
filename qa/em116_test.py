"""1.16.0: Emergency info screen, Home strip, tab bar, person-page section, My card group.
Usage: python3 qa/em116_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, os
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
def card(i, name, **k):
    c = {'id': 'p%d' % i, 'name': name, 'bmonth': 3, 'bday': 3 + i, 'byear': 1995, 'updated': '2026-11-01T00:00:00.000Z'}
    c.update(k); return c
me = card(0, 'Me Tester')   # no emergency info yet
others = [
    card(1, 'Ana Reyes', bloodType='O+', allergies='Penicillin', dutyConditions='Asthma — inhaler in bag', phone='0917 123 4567',
         emergencyContact='Rosa Reyes', emergencyRelation='Mother', emergencyNumber='0918 222 3333',
         emergencyContact2='Leo Reyes', emergencyRelation2='Brother', emergencyNumber2='0919 444 5555'),
    card(2, 'Ben Santos', bloodType='A-', emergencyContact='Mia', emergencyNumber='0920 111 2222'),
    card(3, 'Carla Lim', allergies='<img src=x onerror=alert(1)>'),
    card(4, 'Dan Cruz', bloodType='B+'),
    card(5, 'Ella Go', hometown='Cebu')]   # no emergency info
res = []; errs = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    b = p.chromium.launch()
    for theme, w, h in (('light', 390, 844), ('dark', 390, 844), ('light', 1280, 900)):
        ctx = b.new_context(viewport={'width': w, 'height': h}, color_scheme=theme)
        pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: (errs.append('dialog ' + d.message), d.dismiss()))
        pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", [me, others]); pg.reload(); pg.wait_for_timeout(400)
        tag = '%s-%d' % (theme, w)
        def go(hh): pg.evaluate("h=>location.hash=h", hh); pg.wait_for_timeout(300)
        def noov(m): ok(not pg.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no overflow ' + m + ' ' + tag)
        # Home strip
        strip = pg.locator('.em-strip')
        ok(strip.count() == 1 and '4 batchmates' in strip.inner_text(), 'home strip counts 4 with info ' + tag)
        ok('Add yours' in strip.inner_text(), 'home strip nudges me ' + tag)
        ok(pg.evaluate("document.querySelector('.em-strip').compareDocumentPosition(document.querySelector('.home__stats'))&4") > 0, 'strip above stats ' + tag)
        if w < 1100:
            tab = pg.locator('.tabbar [data-tab="emergency"]')
            ok(tab.is_visible(), 'tab bar Emergency visible ' + tag)
            ok(pg.evaluate("getComputedStyle(document.querySelector('.tabbar')).gridTemplateColumns.split(' ').length") == 5, 'tab bar has 5 columns ' + tag)
            bb = tab.bounding_box(); pg.mouse.click(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2); pg.wait_for_timeout(300)
            ok(pg.evaluate('location.hash') == '#/emergency', 'tab opens #/emergency ' + tag)
            ok(tab.get_attribute('aria-current') == 'page', 'tab active ' + tag)
        else:
            ok(pg.locator('.sidenav a[href="#/emergency"]').count() >= 1, 'sidebar has Emergency ' + tag)
            go('#/emergency')
        # Emergency screen
        tx = pg.inner_text('main')
        ok(pg.locator('.em-card').count() == 4, '4 emergency cards (Ella excluded) ' + tag)
        ok('Penicillin' in tx and 'Asthma' in tx and 'Rosa Reyes' in tx and 'Mother' in tx and 'Leo Reyes' in tx and 'Brother' in tx, 'Ana details ' + tag)
        ok(pg.locator('a[href="tel:09181223333"], a[href="tel:09182223333"]').count() >= 1, 'call button for emergency contact ' + tag)
        ok(pg.locator('a[href="tel:09171234567"]').count() == 1 and pg.locator('a[href="sms:09171234567"]').count() == 1, 'own number call + text ' + tag)
        ok(pg.locator('a[href="tel:911"]').count() == 1, 'Call 911 button ' + tag)
        ok('<img' in tx and pg.locator('main img[src="x"]').count() == 0, 'allergy text escaped ' + tag)
        ok('No emergency info yet' in tx and 'Ella Go' in tx, 'missing list names Ella ' + tag)
        ok('Add your emergency info' in tx, 'add-yours callout ' + tag)
        ok(pg.locator('.em-blood').first.inner_text().replace('\n', ' ').strip().endswith('O+'), 'first card is Ana with O+ ' + tag)
        ok(pg.locator('.em-alert').count() == 2, 'allergy alerts styled ' + tag)
        pg.fill('#em-q', 'ben'); pg.wait_for_timeout(100)
        ok(pg.evaluate("[...document.querySelectorAll('.em-card')].filter(c=>!c.hidden).length") == 1, 'filter to Ben ' + tag)
        pg.fill('#em-q', 'zzz'); pg.wait_for_timeout(100)
        ok(pg.locator('#em-nomatch').is_visible(), 'no-match message ' + tag)
        pg.fill('#em-q', ''); pg.wait_for_timeout(100)
        noov('emergency'); pg.screenshot(path='%s/emergency-%s.png' % (out, tag), full_page=True)
        # One person
        go('#/emergency/p2'); ok(pg.locator('.em-card').count() == 1 and 'Ben Santos' in pg.inner_text('main'), 'single-person emergency view ' + tag)
        # Person page
        go('#/person/p1'); tx = pg.inner_text('main')
        ok(pg.locator('.person__acts a[href="#/emergency/p1"]').count() == 1, 'person Emergency button ' + tag)
        ok('EMERGENCY & MEDICAL' in tx.upper() and 'Penicillin' in tx, 'person emergency section ' + tag)
        ok(tx.upper().count('PENICILLIN') == 1, 'allergy not duplicated in Contact ' + tag)
        go('#/person/p5'); ok(pg.locator('.person__acts a[href^="#/emergency"]').count() == 0, 'no Emergency button without info ' + tag)
        noov('person')
        # My card: open the group, save, and the strip updates
        if theme == 'light' and w < 1100:
            go('#/me/emergency'); pg.wait_for_timeout(300)
            opened = pg.evaluate("(()=>{var n=document.querySelector('.fgroup__n[data-group=\"emergency\"]');return n&&n.closest('details').open})()")
            ok(opened, '#/me/emergency opens the group')
            ok(pg.evaluate("document.querySelectorAll('details.fgroup')[1].querySelector('.fgroup__n').getAttribute('data-group')") == 'emergency', 'emergency is the 2nd group on My card')
            ok(pg.locator('[name="emergencyRelation2"]').count() == 1, 'new relation2 field on My card')
            pg.fill('[name="bloodType"]', 'AB+'); pg.fill('[name="allergies"]', 'Shrimp'); pg.fill('[name="emergencyContact"]', 'Pat'); pg.fill('[name="emergencyNumber"]', '0917 000 0000')
            pg.locator('form#me-form, form.me-form, main form').first.evaluate('f=>f.requestSubmit()'); pg.wait_for_timeout(1500)
            mc = pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me'))")
            ok(mc.get('bloodType') == 'AB+' and mc.get('allergies') == 'Shrimp' and mc.get('emergencyNumber') == '0917 000 0000', 'my emergency info saved')
            go('#/'); ok('5 batchmates' in pg.locator('.em-strip').inner_text() and 'Add yours' not in pg.locator('.em-strip').inner_text(), 'strip updates after saving')
            go('#/emergency'); ok(pg.locator('.em-card').first.inner_text().find('Me Tester') >= 0 and 'Add your emergency info' not in pg.inner_text('main'), 'me first, no nudge')
            # Tagalog
            pg.evaluate("localStorage.setItem('bt:v1:lang',JSON.stringify('tl'))"); pg.reload(); pg.wait_for_timeout(400); go('#/emergency')
            ok('Tumawag sa 911' in pg.inner_text('main'), 'Tagalog strings')
            pg.screenshot(path='%s/emergency-tl.png' % out, full_page=True)
        ctx.close()
    b.close()
ok(not errs, 'no page errors %s' % errs[:3])
print('%d/%d passed' % (sum(res), len(res)))
sys.exit(0 if all(res) else 1)
