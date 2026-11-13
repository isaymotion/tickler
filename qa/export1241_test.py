"""1.24.1: Export backup. Android installed app downloads (no share sheet); iPhone installed app shares, falls back to a
download if sharing fails, and says cancelled only when the person closes the sheet. Works for both apps:
python3 qa/export1241_test.py ./tickler <outdir> [storage-prefix, default bt:v1:]"""
import sys, json, threading, http.server, functools, socketserver, os
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; PRE = sys.argv[3] if len(sys.argv) > 3 else 'bt:v1:'; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % srv.server_address[1]
AND = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
res = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
def mock(share):   # installed app + a share() that behaves as told
    return """(()=>{ window.__shares=0; var mm=window.matchMedia.bind(window);
      window.matchMedia=function(q){ if(/display-mode:\\s*standalone/.test(q)) return {matches:true,media:q,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}; return mm(q); };
      navigator.canShare=function(){return true};
      navigator.share=function(){ window.__shares++; var m='%s'; if(m==='ok') return Promise.resolve(); var e=new Error(m); e.name=m; return Promise.reject(e); }; })()""" % share
with sync_playwright() as p:
    b = p.chromium.launch()
    def page(ua, share):
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, user_agent=ua, accept_downloads=True)
        ctx.add_init_script(mock(share)); pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.goto(BASE); pg.evaluate("p=>{localStorage.setItem(p+'me',JSON.stringify({id:'p0',name:'Me Tester',bmonth:3,bday:3,byear:1995,hometown:'Cebu',updated:'2026-11-01T00:00:00.000Z'}))}", PRE); pg.reload(); pg.wait_for_timeout(500)
        return pg
    def last(pg): return pg.evaluate("p=>localStorage.getItem(p+'lastBackup')", PRE)
    def status(pg): return pg.evaluate("(document.querySelector('#bk-status')||document.querySelector('.backup [role=status]')||{}).textContent||''")
    # Android installed app: download, share sheet never opened
    pg = page(AND, 'NotAllowedError')
    with pg.expect_download(timeout=5000) as dl: pg.evaluate("document.getElementById('bk-export').click()")
    f = os.path.join(out, 'android.json'); dl.value.save_as(f); d = json.load(open(f))
    ok(dl.value.suggested_filename.endswith('.json') and 'me' in d['data'] and json.loads(d['data']['me'])['name'] == 'Me Tester', 'Android: backup file downloaded with my card (%s)' % dl.value.suggested_filename)
    ok(pg.evaluate('window.__shares') == 0, 'Android: share sheet not used')
    pg.wait_for_timeout(200); ok(last(pg) and 'cancel' not in status(pg).lower(), 'Android: last exported recorded, no "cancelled" (%s)' % status(pg)[:50])
    # iPhone installed app, share works
    pg = page(IOS, 'ok'); pg.evaluate("document.getElementById('bk-export').click()"); pg.wait_for_timeout(400)
    ok(pg.evaluate('window.__shares') == 1 and last(pg), 'iPhone: shared through the share sheet, last exported recorded')
    # iPhone, sheet closed by the person
    pg = page(IOS, 'AbortError'); pg.evaluate("document.getElementById('bk-export').click()"); pg.wait_for_timeout(400)
    ok(pg.evaluate('window.__shares') == 1 and 'cancel' in status(pg).lower(), 'iPhone: closing the sheet says cancelled (%s)' % status(pg)[:40])
    ok(not last(pg), 'iPhone: a cancelled export does not change "Last exported"')
    # iPhone, share fails for another reason -> download
    pg = page(IOS, 'NotAllowedError')
    with pg.expect_download(timeout=5000) as dl: pg.evaluate("document.getElementById('bk-export').click()")
    ok(dl.value.suggested_filename.endswith('.json') and pg.evaluate('window.__shares') == 1, 'iPhone: failed share falls back to a download')
    pg.wait_for_timeout(200); ok(last(pg), 'iPhone fallback: last exported recorded')
print('%d/%d PASS' % (sum(res), len(res))); sys.exit(0 if all(res) else 1)
