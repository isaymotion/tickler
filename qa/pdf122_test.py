"""1.22.0: Make PDF (4 layouts) + print backup. Usage: python3 qa/pdf122_test.py ./tickler <outdir>"""
import sys, os, io, base64, json, threading, http.server, functools, socketserver
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
import pypdfium2 as pdfium
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
def photo(col):
    im = Image.new('RGB', (320, 320), col); d = ImageDraw.Draw(im); d.ellipse((90, 60, 230, 200), fill=(250, 220, 190)); b = io.BytesIO(); im.save(b, 'JPEG', quality=80)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
U = '2026-11-01T00:00:00.000Z'
def card(i, name, m, d, **kw):
    c = {'id': 'p%d' % i, 'name': name, 'bmonth': m, 'bday': d, 'byear': 1994 + i % 5, 'updated': U, 'custom': [], 'playlists': []}; c.update(kw); return c
long = 'Reading thrillers, hiking around Bataan, baking ube cheesecake for the ward, karaoke every Friday night, and collecting vintage film cameras from Cubao Expo'
batch = [
    card(1, 'Ana Reyes', 11, 11, nickname='Ani', hometown='Balanga, Bataan', medSchool='UP College of Medicine', askMe='K-dramas, sourdough', hobbies=long, food='Sinigang na baboy', shows='Grey\'s Anatomy', music='OPM, Ben&Ben', funFact='Climbed Pulag twice 🏔️', photo=photo((60, 110, 180)), bloodType='O+', allergies='Penicillin', emergencyContact='Mama Reyes', emergencyNumber='09171234567', phone='09170000001'),
    card(2, 'Ben Santos', 2, 29, hometown='Cebu City', medSchool='CIM', hobbies='Guitar', food='Lechon', shows='The Good Doctor', photo=photo((180, 80, 60))),
    card(3, 'Carla Lim', 11, 3, hometown='Davao', hobbies='Painting', food='Durian', music='K-pop'),
    card(4, 'Dan Cruz', 12, 25, preferredName='Danny', hometown='Iloilo', hobbies='Running', food='Batchoy', shows='House', movies='Up'),
    card(5, 'Juan Dela Cruz', 11, 11, hometown='Mariveles, Bataan', hobbies='Chess'),
    card(6, 'Ñora Peña-Ibañez', 1, 15, hometown='Parañaque', hobbies='Crochet 🧶 and plants', food='Kare-kare'),
    card(7, 'Pia Gomez', 11, 20, partnerOf='p2', partnerName='Ben Santos', hometown='Cebu City'),
]
for i in range(8, 14): batch.append(card(i, 'Resident %d Long-Surname' % i, (i % 12) + 1, i, hometown='Town %d' % i, hobbies='Hobby %d' % i, food='Food %d' % i))
me = card(0, 'Isa Navarro', 3, 3, hometown='Manila', medSchool='UST', hobbies='Making apps', photo=photo((40, 150, 140)))
res = []; errs = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
def pdftext(path):
    d = pdfium.PdfDocument(path); return len(d), [d[i].get_textpage().get_text_range() for i in range(len(d))], d
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 1200, 'height': 900}, accept_downloads=True)
    pg = ctx.new_page()
    pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE)
    pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'));localStorage.setItem('bt:v1:batchName',JSON.stringify('Batch Daldal'))}", [me, batch])
    pg.reload(); pg.wait_for_timeout(500)
    def go(h, w=400): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(w)
    go('#/print')
    ok(pg.locator('#do-pdf').count() == 1 and 'btn--solid' in pg.get_attribute('#do-pdf', 'class'), 'Make PDF is the main button')
    ok(pg.locator('#do-print').count() == 1 and 'btn--solid' not in pg.get_attribute('#do-print', 'class'), 'Print kept as a secondary button')
    ok(pg.locator('[data-pmode]').count() == 4, '4 layouts incl. Birthday calendar')
    ok(pg.locator('[data-pfact]:checked').count() == 8, 'batch sheet: 8 suggested facts ticked')
    ok(pg.locator('[data-pfact]:disabled').count() > 50, 'others disabled at the limit of 8')
    # html sheet shows only chosen facts
    ok('Penicillin' not in pg.inner_text('.sheet') and 'UP College of Medicine' in pg.inner_text('.sheet'), 'print sheet: chosen facts only, no emergency info')
    pg.evaluate("document.querySelector('.pr-opts').open=true")
    pg.locator('[data-pfact=funFact]').uncheck(); pg.wait_for_timeout(300)
    ok(pg.locator('[data-pfact]:checked').count() == 7 and pg.locator('[data-pfact]:disabled').count() == 0, 'untick frees a slot')
    pg.locator('[data-pfact=livesNow]').check(); pg.wait_for_timeout(300)
    ok(json.loads(pg.evaluate("localStorage.getItem('bt:v1:printFacts')")).count('livesNow') == 1, 'choice saved on the phone')
    pg.click('#pr-reset'); pg.wait_for_timeout(300)
    ok(pg.evaluate("localStorage.getItem('bt:v1:printFacts')") is None and pg.locator('[data-pfact=funFact]').is_checked(), 'reset to suggested')
    pg.click('[data-psort=bday]'); pg.wait_for_timeout(300)
    names = pg.locator('.sheet__card h3').evaluate_all("l=>l.map(e=>e.firstChild.textContent.trim())")
    ok(names[:2] == ['Resident 12 Long-Surname', 'Ñora Peña-Ibañez'], 'sort by birthday (Jan 12, Jan 15 first): %s' % names[:2])
    pg.click('[data-psort=name]'); pg.wait_for_timeout(300)
    files = {}
    for mode in ['sheet', 'tags', 'full', 'cal']:
        pg.click('[data-pmode=%s]' % mode); pg.wait_for_timeout(300)
        with pg.expect_download(timeout=20000) as dl: pg.click('#do-pdf')
        d = dl.value; path = os.path.join(out, mode + '.pdf'); d.save_as(path); files[mode] = path
        ok(d.suggested_filename.startswith('Batch-Tickler-') and d.suggested_filename.endswith('.pdf'), '%s: file name %s' % (mode, d.suggested_filename))
        pg.wait_for_timeout(200); ok('PDF ready' in pg.inner_text('#pdf-status'), '%s: status says ready' % mode)
        n, texts, doc = pdftext(path)
        for i in range(min(n, 3)): doc[i].render(scale=1.4).to_pil().save(os.path.join(out, '%s-%d.png' % (mode, i + 1)))
        alltxt = '\n'.join(texts)
        if mode == 'sheet':
            ok(n == 2, 'sheet: 14 residents on 2 pages (%d)' % n)
            ok('Page 1 of 2' in texts[0] and 'Batch Daldal' in texts[0], 'sheet: footer with batch name + page numbers')
            ok('Ñora Peña-Ibañez' in alltxt and 'Parañaque' in alltxt, 'sheet: ñ survives')
            ok('Penicillin' not in alltxt and 'Pia Gomez' not in alltxt, 'sheet: no emergency info, partners not listed')
            ok('Climbed Pulag twice' in alltxt and '🏔' not in alltxt, 'sheet: emoji dropped, text kept')
            ok('Isabella Navarro, MD' in alltxt, 'sheet: attribution')
        if mode == 'tags':
            ok(n == 2 and 'Danny' in alltxt, 'tags: 8 per page (2 pages), preferred name used (%d)' % n)
        if mode == 'full':
            ok('Penicillin' not in alltxt and 'Mama Reyes' not in alltxt and 'O+' not in alltxt, 'full: Emergency & medical left out')
            ok('09170000001' in alltxt, 'full: contact kept')
            ok(long.split()[0] in alltxt and 'UP College of Medicine' in alltxt, 'full: details present')
            ok(n <= 6, 'full: compact, %d pages for 14 people' % n)
        if mode == 'cal':
            ok(n == 12 and 'November 2026' in texts[0], 'calendar: 12 months from this month (%d)' % n)
            ok('Ani' in texts[0] and 'Juan' in texts[0] and 'Pia' in texts[0] and 'Partner' in texts[0], 'calendar: November names incl. partner tag')
    # print backup still renders each layout
    pg.click('[data-pmode=cal]'); pg.wait_for_timeout(300)
    ok(pg.locator('.cal__month').count() == 12 and pg.locator('.cal__grid td.has-bd').count() >= 10, 'print calendar: 12 month tables with birthday cells')
    pg.emulate_media(media='print'); pg.pdf(path=os.path.join(out, 'print-cal.pdf'), format='A4'); pg.emulate_media(media='screen')
    ok(len(pdfium.PdfDocument(os.path.join(out, 'print-cal.pdf'))) in (12, 13), 'print calendar: one page per month')
    pg.click('[data-pmode=sheet]'); pg.wait_for_timeout(300)
    pg.evaluate("()=>{var t=document.createElement('div');t.className='toast is-on';t.textContent='Badge earned';document.body.appendChild(t)}")
    pg.emulate_media(media='print'); pg.pdf(path=os.path.join(out, 'print-sheet.pdf'), format='A4')
    ok(not pg.locator('.toast').first.is_visible() and not pg.locator('.pr-acts').is_visible(), 'print: toast and buttons hidden')
    pg.emulate_media(media='screen')
    # Tagalog
    pg.evaluate("localStorage.setItem('bt:v1:lang',JSON.stringify('tl'))"); pg.reload(); pg.wait_for_timeout(400); go('#/print')
    ok('Gumawa ng PDF' in pg.inner_text('#do-pdf'), 'Tagalog button')
    # phone: share sheet path
    ph = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
    p2 = ph.new_page(); p2.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort()); p2.on('pageerror', lambda e: errs.append('phone: ' + str(e)))
    p2.add_init_script("navigator.canShare=()=>true;navigator.share=(d)=>{window.__shared=d.files.map(f=>[f.name,f.type,f.size]);return Promise.resolve()}")
    p2.goto(BASE); p2.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:batch',JSON.stringify(a[1]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", [me, batch]); p2.reload(); p2.wait_for_timeout(400)
    p2.evaluate("location.hash='#/print'"); p2.wait_for_timeout(400); p2.click('#do-pdf'); p2.wait_for_timeout(2500)
    sh = p2.evaluate('window.__shared||null')
    ok(sh and sh[0][1] == 'application/pdf' and sh[0][2] > 5000, 'phone: PDF handed to the share sheet (%s)' % sh)
    ok(not p2.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'phone: no overflow')
    p2.screenshot(path=os.path.join(out, 'phone-print.png'))
    b.close()
print('ERRORS:', errs)
print('%d/%d PASS' % (sum(res), len(res)))
sys.exit(0 if all(res) and not errs else 1)
