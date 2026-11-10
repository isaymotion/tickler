"""1.18.0: Cloud sync with a mock cloud (the sandbox cannot reach Firebase). The mock replaces window.BT_CLOUD and
forwards every call to a Python in-memory Firestore that applies the same access rules as firestore.rules.
Two browser contexts = two phones (admin + resident). Usage: python3 qa/sync118_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, os, time
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
ADMINS = ['isaymotion@gmail.com']

DB = {'batches': {}}   # code -> {name, requests:{uid:{}}, members:{uid:{}}, cards:{id:{}}, events:{id:{}}}
calls = []
class Denied(Exception): pass
def handle(op, payload):
    p = json.loads(payload); u = p.get('user'); a = p.get('args') or []
    calls.append(op)
    def need_user():
        if not u: raise Denied()
    def is_admin(): return bool(u) and u['email'].lower() in ADMINS
    def B(code):
        if code not in DB['batches']: raise Denied()
        return DB['batches'][code]
    def member(code): return bool(u) and code in DB['batches'] and u['uid'] in DB['batches'][code]['members']
    def need_member(code):
        if not (member(code) or is_admin()): raise Denied()
    try:
        if op == 'getBatch':
            need_user(); b = DB['batches'].get(a[0]); return {'code': a[0], 'name': b['name'], 'tmdbKey': b.get('tmdbKey', '')} if b else None
        if op == 'setBatchInfo':
            if not is_admin(): raise Denied()
            B(a[0]).update(a[1]); return True
        if op == 'myBatches':
            if not is_admin(): raise Denied()
            return [{'code': k, 'name': v['name']} for k, v in DB['batches'].items()]
        if op == 'createBatch':
            if not is_admin(): raise Denied()
            DB['batches'][a[0]] = {'name': a[1], 'requests': {}, 'members': {u['uid']: {'name': a[2].get('name', ''), 'email': u['email']}}, 'cards': {}, 'events': {}}; return True
        if op == 'status':
            need_user(); b = B(a[0]); return 'member' if u['uid'] in b['members'] else 'pending' if u['uid'] in b['requests'] else 'none'
        if op == 'request':
            need_user(); B(a[0])['requests'][u['uid']] = {'name': a[1].get('name', ''), 'email': u['email'], 'created': time.time()}; return True
        if op == 'cancelRequest':
            need_user(); B(a[0])['requests'].pop(u['uid'], None); return True
        if op == 'requests':
            if not is_admin(): raise Denied()
            return [dict(v, uid=k) for k, v in B(a[0])['requests'].items()]
        if op == 'approve':
            if not is_admin(): raise Denied()
            b = B(a[0]); r = a[1]; b['members'][r['uid']] = {'name': r.get('name', ''), 'email': r.get('email', '')}; b['requests'].pop(r['uid'], None); return True
        if op == 'decline':
            if not is_admin(): raise Denied()
            B(a[0])['requests'].pop(a[1], None); return True
        if op == 'members':
            need_member(a[0]); return [dict(v, uid=k) for k, v in B(a[0])['members'].items()]
        if op == 'removeMember':
            if not is_admin(): raise Denied()
            b = B(a[0]); b['members'].pop(a[1], None)
            for k in [k for k, v in b['cards'].items() if v['owner'] == a[1]]: del b['cards'][k]
            return True
        if op == 'leave':
            need_user(); b = B(a[0])
            for k in [k for k, v in b['cards'].items() if v['owner'] == u['uid']]: del b['cards'][k]
            b['members'].pop(u['uid'], None); return True
        if op == 'putCard':
            code, card, shared = a; b = B(code)
            if not member(code): raise Denied()
            ex = b['cards'].get(card['id'])
            if ex and ex['owner'] != u['uid']: raise Denied()
            import datetime
            upd = int(datetime.datetime.fromisoformat(card['updated'].replace('Z', '+00:00')).timestamp() * 1000)
            b['cards'][card['id']] = {'owner': u['uid'], 'updated': upd, 'shared': shared, 'card': card}; return True
        if op == 'deleteCard':
            need_user(); b = B(a[0]); ex = b['cards'].get(a[1])
            if ex and ex['owner'] != u['uid'] and not is_admin(): raise Denied()
            b['cards'].pop(a[1], None); return True
        if op == 'cardsSince':
            need_member(a[0]); return [dict(v, id=k) for k, v in B(a[0])['cards'].items() if a[1] < 0 or v['updated'] > a[1]]
        if op == 'putEvent':
            need_member(a[0]); e = a[1]; import datetime
            x = {k: e.get(k, '') for k in ('title', 'date', 'time', 'place', 'note')}
            x['updated'] = int(datetime.datetime.fromisoformat(e['updated'].replace('Z', '+00:00')).timestamp() * 1000); x['by'] = u['uid']
            if e.get('deleted'): x['deleted'] = True
            B(a[0])['events'][e['id']] = x; return True
        if op == 'eventsSince':
            need_member(a[0]); return [dict(v, id=k) for k, v in B(a[0])['events'].items() if v['updated'] > a[1]]
        return {'__err': 'unknown-op'}
    except Denied:
        return {'__err': 'permission-denied'}

MOCK = r"""
window.__mockSigned = sessionStorage.getItem('mockSigned') === '1';
window.BT_CLOUD = function (cfg) {
  var U = window.__mockUser;
  function user() { if (!window.__mockSigned) return null; var e = U.email.toLowerCase(); return { uid: U.uid, email: e, name: U.name, verified: true, admin: cfg.admins.indexOf(e) >= 0 }; }
  function call(op) { var args = [].slice.call(arguments, 1); return window.cloudDB(op, JSON.stringify({ user: user(), args: args })).then(function (r) { r = JSON.parse(r); if (r && r.__err) throw { code: r.__err }; return r; }); }
  var api = { user: user, ready: function () { return Promise.resolve(user()); },
    signIn: function () { window.__mockSigned = true; sessionStorage.setItem('mockSigned', '1'); return Promise.resolve(user()); },
    signOut: function () { window.__mockSigned = false; sessionStorage.removeItem('mockSigned'); return Promise.resolve(); } };
  ['getBatch','setBatchInfo','myBatches','createBatch','status','request','cancelRequest','requests','approve','decline','members','removeMember','leave','putCard','deleteCard','cardsSince','putEvent','eventsSince'].forEach(function (op) { api[op] = function () { return call.apply(null, [op].concat([].slice.call(arguments))); }; });
  return api;
};
"""
def card(i, name, **k):
    c = {'id': i, 'name': name, 'bmonth': 5, 'bday': 10, 'byear': 1995, 'updated': '2026-11-01T00:00:00.000Z', 'hometown': 'Balanga', 'food': 'Sisig'}
    c.update(k); return c
res = []; errs = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
with sync_playwright() as p:
    br = p.chromium.launch()
    def phone(email, uid, name, me, theme='light'):
        ctx = br.new_context(viewport={'width': 390, 'height': 844}, color_scheme=theme)
        ctx.expose_function('cloudDB', lambda op, payload: json.dumps(handle(op, payload)))
        ctx.add_init_script('window.__mockUser=' + json.dumps({'email': email, 'uid': uid, 'name': name}) + ';' + MOCK)
        pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.on('response', lambda r: errs.append('HTTP %d %s' % (r.status, r.url)) if r.status >= 400 else None); pg.on('pageerror', lambda e: errs.append(email + ': ' + str(e))); pg.on('dialog', lambda d: d.accept())
        pg.on('console', lambda m: errs.append(email + ' console: ' + m.text) if m.type == 'error' and 'ERR_FAILED' not in m.text else None)
        pg.goto(BASE); pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'))}", me); pg.reload(); pg.wait_for_timeout(400)
        return pg
    def go(pg, h): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(350)
    def txt(pg): return pg.inner_text('main')
    def st(pg): return pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:cloud')||'{}')")
    def batch(pg): return pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:batch')||'[]')")
    def pg_ev(pg): return len(pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:events')||'[]')"))
    def click(pg, sel): pg.locator(sel).first.click(); pg.wait_for_timeout(450)

    A = phone('isaymotion@gmail.com', 'uA', 'Isa N', card('pA', 'Isa Navarro', bloodType='A+', phone='0917 111 1111', allergies='Penicillin'))
    Bp = phone('bea@example.com', 'uB', 'Bea Cruz', card('pB', 'Bea Cruz', bloodType='O+', phone='0918 222 2222', hometown='Cebu City'), theme='dark')

    # --- nothing to share any more
    navs = A.locator('#sidenav a').all_inner_texts() if A.locator('#sidenav a').count() else A.locator('nav a').all_inner_texts()
    ok(not any('Share cards' in n or 'Scan a card' in n for n in navs) and any('Cloud sync' in n for n in navs), 'menu: Cloud sync in, Share/Scan out')
    go(A, '#/share'); ok(A.locator('main').inner_text().lower().find('not found') >= 0 or 'notfound' in A.content() or A.locator('.empty, .missing').count() > 0, '#/share is gone')
    go(A, '#/'); ok(A.locator('.sync-strip').count() == 1, 'Home nudges to join the cloud')

    # --- admin creates the batch
    go(A, '#/sync'); A.wait_for_timeout(300)
    ok(A.locator('#sy-in').count() == 1, 'signed out: Sign in button')
    click(A, '#sy-in'); ok(A.locator('#sy-join').count() == 1 and A.locator('#sy-create').count() == 1, 'admin signed in: join + create forms')
    A.fill('#sy-create [name=bname]', 'Batch 2027'); click(A, '#sy-create button[type=submit]'); A.wait_for_timeout(600)
    sA = st(A); code = sA.get('code', '')
    ok(sA.get('state') == 'member' and len(code) == 8 and code in DB['batches'], 'batch created, admin is a member (code %s)' % code)
    cA = DB['batches'].get(code, {}).get('cards', {}).get('pA')
    ok(cA and cA['owner'] == 'uA', "admin's card uploaded")
    ok(cA and cA['card'].get('bloodType', '') == '' and cA['card'].get('phone', '') == '' and cA['card'].get('hometown') == 'Balanga', 'private groups stripped without consent; others kept')
    ok('Join requests (0)' in txt(A) and 'Members (1)' in txt(A), 'admin panel: 0 requests, 1 member')
    ok(A.evaluate("localStorage.getItem('bt:v1:batchName')") == '"Batch 2027"', 'batch name set from the cloud batch')
    go(A, '#/'); ok(A.locator('.sync-strip').count() == 0, 'Home nudge gone once synced')

    # --- resident asks to join
    go(Bp, '#/sync'); click(Bp, '#sy-in')
    ok(Bp.locator('#sy-create').count() == 0, 'non-admin: no create form')
    Bp.fill('#sy-join [name=code]', 'zzzz-9999'); click(Bp, '#sy-join button[type=submit]')
    ok('No batch has that code' in txt(Bp), 'wrong code message')
    Bp.fill('#sy-join [name=code]', (code[:4] + ' ' + code[4:]).lower()); click(Bp, '#sy-join button[type=submit]')
    ok(st(Bp).get('state') == 'pending' and 'uB' in DB['batches'][code]['requests'], 'request sent, lower-case code with space accepted')
    ok('Waiting for approval' in txt(Bp), 'pending screen')
    click(Bp, '#sy-check'); ok('Not approved yet' in txt(Bp), 'check again while pending')
    go(Bp, '#/'); ok('Waiting for approval' in Bp.inner_text('.sync-strip'), 'Home shows pending')
    r = handle('putCard', json.dumps({'user': {'uid': 'uB', 'email': 'bea@example.com'}, 'args': [code, {'id': 'pB', 'updated': '2026-11-02T00:00:00Z'}, {}]}))
    ok(r == {'__err': 'permission-denied'}, 'mock rules: non-member cannot upload')

    # --- admin approves
    go(A, '#/about'); go(A, '#/sync'); A.wait_for_timeout(400)
    A.evaluate("()=>{}"); click(A, '#sy-adm-reload'); A.wait_for_timeout(300)
    ok('Bea Cruz' in txt(A) and 'Join requests (1)' in txt(A), 'admin sees the request')
    click(A, '[data-approve="uB"]'); A.wait_for_timeout(300)
    ok('uB' in DB['batches'][code]['members'] and not DB['batches'][code]['requests'], 'approved: member created, request removed')
    A.screenshot(path=out + '/sync-admin-light.png', full_page=True)

    # --- resident gets in and syncs
    go(Bp, '#/sync'); click(Bp, '#sy-check'); Bp.wait_for_timeout(700)
    ok(st(Bp).get('state') == 'member', 'resident is a member after Check again')
    ok(any(c['id'] == 'pA' for c in batch(Bp)), "resident received the admin's card")
    ok('pB' in DB['batches'][code]['cards'], "resident's card uploaded")
    ok(Bp.locator('#sy-admin').count() == 0, 'resident: no admin panel')
    Bp.screenshot(path=out + '/sync-member-dark.png', full_page=True)
    ok(not Bp.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no overflow on sync (phone dark)')
    go(A, '#/sync'); click(A, '#sy-now'); A.wait_for_timeout(500)
    ok(any(c['id'] == 'pB' for c in batch(A)), "admin received the resident's card")
    ok('1 new' in txt(A), 'Sync now result message')
    go(A, '#/batch'); ok('Bea Cruz' in txt(A), 'resident on the admin batch grid')

    # --- TMDB key saved by the admin reaches the resident (1.19.1)
    go(A, '#/sync'); A.fill('#sy-tmdb [name=key]', 'not a key'); click(A, '#sy-tmdb button[type=submit]')
    ok('look like a TMDB' in txt(A), 'bad TMDB key refused')
    A.fill('#sy-tmdb [name=key]', 'abcdefabcdefabcdefabcdefabcdef12'); click(A, '#sy-tmdb button[type=submit]'); A.wait_for_timeout(300)
    ok(DB['batches'][code].get('tmdbKey') == 'abcdefabcdefabcdefabcdefabcdef12' and st(A).get('tmdbKey'), 'admin saves TMDB key to the batch')
    go(Bp, '#/sync'); click(Bp, '#sy-now'); Bp.wait_for_timeout(500)
    ok(st(Bp).get('tmdbKey') == 'abcdefabcdefabcdefabcdefabcdef12', 'resident phone receives the key on Sync now')
    ok(Bp.locator('#sy-tmdb').count() == 0, 'resident: no key form')
    # --- consent for Emergency & medical
    go(Bp, '#/sync'); Bp.locator('input[name=consent][value=emergency]').check(); Bp.wait_for_timeout(800)
    cB = DB['batches'][code]['cards']['pB']
    ok(cB['card'].get('bloodType') == 'O+' and cB['shared'].get('emergency') and cB['card'].get('phone', '') == '', 'emergency consent: blood type sent, phone still private')
    go(A, '#/sync'); click(A, '#sy-now'); A.wait_for_timeout(400)
    go(A, '#/emergency/pB'); ok('O+' in txt(A), 'admin sees resident blood type on Emergency info')
    # local copy of a private group survives: admin had a phone number for Bea from before
    A.evaluate("()=>{var b=JSON.parse(localStorage.getItem('bt:v1:batch'));b.forEach(function(c){if(c.id==='pB')c.phone='0918 OLD';});localStorage.setItem('bt:v1:batch',JSON.stringify(b));}")
    go(Bp, '#/me'); Bp.evaluate("()=>{var m=JSON.parse(localStorage.getItem('bt:v1:me'));m.nickname='Beabea';m.updated=new Date().toISOString();localStorage.setItem('bt:v1:me',JSON.stringify(m));}")
    go(Bp, '#/batch'); Bp.wait_for_timeout(3600)
    ok(DB['batches'][code]['cards']['pB']['card'].get('nickname') == 'Beabea', 'card change pushed a few seconds after it is saved')
    go(A, '#/sync'); click(A, '#sy-now'); A.wait_for_timeout(400)
    bB = [c for c in batch(A) if c['id'] == 'pB'][0]
    ok(bB.get('nickname') == 'Beabea' and bB.get('phone') == '0918 OLD', 'update pulled; unshared Contact group kept from the local copy')

    # --- events, including a deletion
    A.evaluate("()=>{localStorage.setItem('bt:v1:events',JSON.stringify([{id:'e1',title:'Welcome dinner',date:'2026-12-20',time:'19:00',place:'Balanga',note:'',updated:new Date().toISOString()}]));}")
    go(A, '#/sync'); click(A, '#sy-now'); A.wait_for_timeout(400)
    ok('e1' in DB['batches'][code]['events'], 'event pushed')
    go(Bp, '#/sync'); click(Bp, '#sy-now'); Bp.wait_for_timeout(400)
    go(Bp, '#/events'); ok(pg_ev(Bp) == 1, 'event arrived on the resident phone')
    go(A, '#/events'); A.locator('[data-evdel="e1"]').first.click(); A.wait_for_timeout(3600)
    ok(DB['batches'][code]['events']['e1'].get('deleted'), 'deleted event sent as a tombstone')
    go(Bp, '#/sync'); click(Bp, '#sy-now'); Bp.wait_for_timeout(1200)
    go(Bp, '#/events'); ok('Welcome dinner\n' not in txt(Bp) and pg_ev(Bp) == 0, 'event removed on the resident phone')
    pushes = calls.count('putEvent'); go(Bp, '#/sync'); click(Bp, '#sy-now'); Bp.wait_for_timeout(400)
    ok(calls.count('putEvent') == pushes, 'pulled events are not sent back')

    # --- 1.19.2: same Google account on a second device (laptop) gets its own card + sharing ticks
    def me_of(pg): return pg.evaluate("JSON.parse(localStorage.getItem('bt:v1:me')||'null')")
    DB['batches'][code]['cards']['pA']['shared'] = {'emergency': True, 'contact': False}
    def second(me):
        L = phone('isaymotion@gmail.com', 'uA', 'Isa N', me, 'dark')
        L.evaluate("c=>{sessionStorage.setItem('mockSigned','1');localStorage.setItem('bt:v1:cloud',JSON.stringify({code:c,name:'B',state:'member'}))}", code)
        L.reload(); L.wait_for_timeout(1800); return L
    L = second(None)
    m = me_of(L); ok(m and m['id'] == 'pA', 'laptop without My card adopts own cloud card (%s)' % (m and m['id']))
    ok(st(L).get('consent') == {'emergency': True, 'contact': False}, 'laptop copies the sharing ticks (%s)' % st(L).get('consent'))
    ok(not any(c['id'] == 'pA' for c in batch(L)), 'own card not listed as a batchmate')
    go(L, '#/sync'); ok(L.locator('input[name=consent][value=emergency]').is_checked() and not L.locator('input[name=consent][value=contact]').is_checked(), 'ticks shown on the laptop sync screen')
    go(L, '#/me'); ok(L.locator('input[name=name]').first.input_value() == m['name'], 'My card form filled on the laptop')
    nput = calls.count('putCard'); L.wait_for_timeout(3500); ok(calls.count('putCard') == nput, 'adopted card is not pushed straight back')
    L.evaluate("()=>{var m=JSON.parse(localStorage.getItem('bt:v1:me'));m.hometown='Orion, Bataan';m.updated=new Date().toISOString();localStorage.setItem('bt:v1:me',JSON.stringify(m));}")
    go(L, '#/sync'); click(L, '#sy-now'); L.wait_for_timeout(500)
    go(A, '#/sync'); click(A, '#sy-now'); A.wait_for_timeout(600)
    ok(me_of(A)['hometown'] == 'Orion, Bataan', 'edit on the laptop reaches My card on the first device')
    DB['batches'][code]['cards']['pX'] = {'owner': 'uA', 'updated': 1, 'shared': {}, 'card': card('pX', 'Isa N', updated='2026-10-01T00:00:00.000Z')}
    DB['batches'][code]['cards']['pA']['updated'] = int(time.time() * 1000) + 86400000   # main card edited later on the other device
    L2 = second(card('pX', 'Isa N', updated='2026-10-01T00:00:00.000Z'))
    ok(me_of(L2)['id'] == 'pA' and 'pX' not in DB['batches'][code]['cards'], 'older duplicate card replaced by the newer one and removed from the cloud')
    L.context.close(); L2.context.close()

    # --- throttle: a normal open does not sync again within 5 minutes
    n0 = len(calls); Bp.reload(); Bp.wait_for_timeout(1500)
    ok(len(calls) == n0, 'reopening within 5 min makes no cloud calls (%d)' % (len(calls) - n0))

    # --- admin removes the resident
    go(A, '#/sync'); click(A, '#sy-adm-reload'); click(A, '[data-unmember="uB"]'); A.wait_for_timeout(400)
    ok('uB' not in DB['batches'][code]['members'] and 'pB' not in DB['batches'][code]['cards'], 'remove member deletes membership + card')
    A.evaluate("()=>{var c=JSON.parse(localStorage.getItem('bt:v1:cloud'));c.lastFull=-1;localStorage.setItem('bt:v1:cloud',JSON.stringify(c));}")
    go(A, '#/sync'); click(A, '#sy-now'); A.wait_for_timeout(400)
    ok(not any(c['id'] == 'pB' for c in batch(A)), 'daily full pull drops the removed card')
    go(Bp, '#/sync'); click(Bp, '#sy-now'); Bp.wait_for_timeout(600)
    ok(st(Bp).get('state') == 'removed' and 'no longer a member' in txt(Bp), 'removed resident sees the message')
    ok(any(c['id'] == 'pA' for c in batch(Bp)), 'removed resident keeps cards already on the phone')

    # --- Tagalog renders
    go(Bp, '#/about'); Bp.locator('input[name=lang][value=tl]').check(force=True); Bp.wait_for_timeout(300); go(Bp, '#/sync')
    ok('bt.sync.' not in txt(Bp), 'Tagalog: no raw keys on sync screen')

    # --- admin leaves (deletes own card)
    go(A, '#/sync'); click(A, '#sy-leave'); A.wait_for_timeout(400)
    ok('pA' not in DB['batches'][code]['cards'] and 'uA' not in DB['batches'][code]['members'] and not st(A).get('code'), 'leave deletes own card and membership')
    ok(A.locator('#sy-join').count() == 1, 'after leaving: join form again')
    # sign out
    click(A, '#sy-out'); ok(A.locator('#sy-in').count() == 1, 'signed out')

    # desktop look
    D = phone('isaymotion@gmail.com', 'uA', 'Isa N', card('pA', 'Isa Navarro'))
    D.set_viewport_size({'width': 1280, 'height': 900}); go(D, '#/sync'); D.wait_for_timeout(300); D.screenshot(path=out + '/sync-desktop.png', full_page=True)
    br.close()
print('ERRORS:', errs)
print('%d/%d PASS' % (sum(res), len(res)))
