"""1.21.0: batch chat with a mock cloud (the sandbox cannot reach Firebase). Like sync118_test.py: window.BT_CLOUD is replaced
by a mock that forwards every call to a Python in-memory Firestore applying the same access rules as firestore.rules;
the realtime listener (chatListen) is emulated by polling every 250 ms. Two phones = admin (Isa) + resident (Bea).
Usage: python3 qa/chat121_test.py ./tickler <outdir>"""
import sys, json, threading, http.server, functools, socketserver, os, time, itertools
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=root)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % port
ADMINS = ['isaymotion@gmail.com']
CODE = 'ABCD2345'
DB = {'batches': {CODE: {'name': 'Batch 2027', 'requests': {}, 'members': {'uA': {'name': 'Isa'}, 'uB': {'name': 'Bea'}}, 'cards': {}, 'events': {}, 'channels': {}, 'reports': {}}}}
calls = []; ids = itertools.count(1)
MSG_KEYS = {'uid', 'cardId', 'name', 'text', 'links', 'img', 'sticker', 'replyTo', 'created'}
class Denied(Exception): pass
def now_ms(): return int(time.time() * 1000)
def handle(op, payload):
    p = json.loads(payload); u = p.get('user'); a = p.get('args') or []
    calls.append(op)
    def is_admin(): return bool(u) and u['email'].lower() in ADMINS
    def B(code):
        if code not in DB['batches']: raise Denied()
        return DB['batches'][code]
    def member(code): return bool(u) and code in DB['batches'] and u['uid'] in DB['batches'][code]['members']
    def need_member(code):
        if not (member(code) or is_admin()): raise Denied()
    def CH(code, ch):
        c = B(code)['channels'].get(ch)
        if c is None: raise Denied()
        return c
    def pub(c, k): return dict({kk: vv for kk, vv in c.items() if kk != 'messages'}, id=k)
    try:
        if op == 'getBatch':
            b = DB['batches'].get(a[0]); return {'code': a[0], 'name': b['name']} if b else None
        if op == 'status': return 'member' if member(a[0]) else 'none'
        if op in ('cardsSince', 'eventsSince'): need_member(a[0]); return []
        if op in ('putCard', 'putEvent'):
            if not member(a[0]): raise Denied()
            return True
        if op == 'chatChannels':
            need_member(a[0]); return [pub(c, k) for k, c in B(a[0])['channels'].items()]
        if op == 'chatChannelExists':
            need_member(a[0]); return a[1] in B(a[0])['channels']
        if op == 'chatCreateChannels':
            need_member(a[0]); b = B(a[0])
            for c in a[1]:
                if c['id'] in b['channels'] or len(c['name']) > 30 or len(c.get('emoji', '')) > 16: raise Denied()
            for c in a[1]:
                b['channels'][c['id']] = {'name': c['name'], 'emoji': c.get('emoji', ''), 'order': c.get('order', 0), 'by': u['uid'], 'created': now_ms(), 'last': 0, 'lastName': '', 'messages': {}}
            return True
        if op == 'chatRenameChannel':
            need_member(a[0]); c = CH(a[0], a[1])
            if not (c['by'] == u['uid'] or is_admin()) or len(a[2]) > 30: raise Denied()
            c['name'] = a[2]; c['emoji'] = a[3] or ''; return True
        if op == 'chatDeleteChannel':
            c = CH(a[0], a[1])
            if not (c['by'] == u['uid'] or is_admin()): raise Denied()
            del B(a[0])['channels'][a[1]]; return True
        if op == 'chatList':   # what the realtime listener sees: newest n
            need_member(a[0]); c = CH(a[0], a[1])
            ms = sorted(c['messages'].items(), key=lambda kv: -kv[1]['created'])[:a[2]]
            return [dict(v, id=k) for k, v in ms]
        if op == 'chatOlder':
            need_member(a[0]); c = CH(a[0], a[1])
            ms = sorted([kv for kv in c['messages'].items() if kv[1]['created'] < a[2]], key=lambda kv: -kv[1]['created'])[:a[3]]
            return [dict(v, id=k) for k, v in ms]
        if op == 'chatSend':
            need_member(a[0]); c = CH(a[0], a[1]); m = dict(a[2], uid=u['uid'])
            if not set(m) <= MSG_KEYS: raise Denied()
            if len(m.get('name', '')) > 80 or len(m.get('text', '')) > 2000 or len(m.get('sticker', '')) > 60: raise Denied()
            if not isinstance(m.get('created'), (int, float)) or abs(m['created'] - now_ms()) > 600000: raise Denied()
            if 'links' in m and (not isinstance(m['links'], list) or len(m['links']) > 5): raise Denied()
            if 'img' in m and (not isinstance(m['img'], dict) or not isinstance(m['img'].get('data'), str) or len(m['img']['data']) >= 960000): raise Denied()
            mid = 'm%04d' % next(ids); c['messages'][mid] = m; c['last'] = m['created']; c['lastName'] = m['name']; return mid
        if op == 'chatReact':
            need_member(a[0]); m = CH(a[0], a[1])['messages'].get(a[2])
            if m is None: raise Denied()
            r = m.setdefault('react', {}); l = r.setdefault(a[3], [])
            if a[4] and u['uid'] not in l: l.append(u['uid'])
            if not a[4] and u['uid'] in l: l.remove(u['uid'])
            if len(r) > 8: raise Denied()
            return True
        if op == 'chatDelete':
            c = CH(a[0], a[1]); m = c['messages'].get(a[2])
            if m is None: return True
            if not (is_admin() or m['uid'] == u['uid'] or c['by'] == u['uid']): raise Denied()
            del c['messages'][a[2]]; return True
        if op == 'chatReport':
            if not member(a[0]): raise Denied()
            r = dict(a[1], by=u['uid'], created=now_ms())
            if not set(r) <= {'ch', 'mid', 'author', 'text', 'reporter', 'by', 'created'} or len(r.get('text', '')) > 300: raise Denied()
            rid = 'r%d' % next(ids); B(a[0])['reports'][rid] = r; return rid
        if op == 'chatReports':
            if not is_admin(): raise Denied()
            return [dict(v, id=k) for k, v in B(a[0])['reports'].items()]
        if op == 'chatDismiss':
            if not is_admin(): raise Denied()
            B(a[0])['reports'].pop(a[1], None); return True
        return {'__err': 'unknown-op'}
    except Denied:
        return {'__err': 'permission-denied'}

MOCK = r"""
window.__mockSigned = sessionStorage.getItem('mockSigned') === '1';
window.__listeners = 0;
window.BT_CLOUD = function (cfg) {
  var U = window.__mockUser;
  function user() { if (!window.__mockSigned) return null; var e = U.email.toLowerCase(); return { uid: U.uid, email: e, name: U.name, verified: true, admin: cfg.admins.indexOf(e) >= 0 }; }
  function call(op) { var args = [].slice.call(arguments, 1); return window.cloudDB(op, JSON.stringify({ user: user(), args: args })).then(function (r) { r = JSON.parse(r); if (r && r.__err) throw { code: r.__err }; return r; }); }
  var api = { user: user, ready: function () { return Promise.resolve(user()); },
    signIn: function () { window.__mockSigned = true; sessionStorage.setItem('mockSigned', '1'); return Promise.resolve(user()); },
    signOut: function () { window.__mockSigned = false; sessionStorage.removeItem('mockSigned'); return Promise.resolve(); },
    chatListen: function (code, ch, n, onList, onErr) {
      var last = null, live = true; window.__listeners++;
      function tick() { if (!live) return; call('chatList', code, ch, n).then(function (l) { var s = JSON.stringify(l); if (live && s !== last) { last = s; onList(l); } }, function (e) { if (live && onErr) onErr(e); }).then(function () { if (live) setTimeout(tick, 250); }); }
      tick();
      return function () { if (live) { live = false; window.__listeners--; } };
    } };
  ['getBatch','status','cardsSince','eventsSince','putCard','putEvent','chatChannels','chatChannelExists','chatCreateChannels','chatRenameChannel','chatDeleteChannel','chatOlder','chatSend','chatReact','chatDelete','chatReport','chatReports','chatDismiss'].forEach(function (op) { api[op] = function () { return call.apply(null, [op].concat([].slice.call(arguments))); }; });
  return api;
};
"""
def card(i, name, **k):
    c = {'id': i, 'name': name, 'bmonth': 5, 'bday': 10, 'byear': 1995, 'updated': '2026-11-01T00:00:00.000Z', 'hometown': 'Balanga'}
    c.update(k); return c
res = []; errs = []
def ok(c, m): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + m)
def rule(user, op, *args):
    return handle(op, json.dumps({'user': user, 'args': list(args)}))
UA = {'uid': 'uA', 'email': 'isaymotion@gmail.com'}; UB = {'uid': 'uB', 'email': 'bea@example.com'}; UX = {'uid': 'uX', 'email': 'x@example.com'}
with sync_playwright() as p:
    br = p.chromium.launch()
    def phone(email, uid, name, me, theme='light', member=True, vw=390, vh=844):
        ctx = br.new_context(viewport={'width': vw, 'height': vh}, color_scheme=theme)
        ctx.expose_function('cloudDB', lambda op, payload: json.dumps(handle(op, payload)))
        ctx.add_init_script('window.__mockUser=' + json.dumps({'email': email, 'uid': uid, 'name': name}) + ';' + MOCK)
        pg = ctx.new_page()
        pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
        pg.on('response', lambda r: errs.append('HTTP %d %s' % (r.status, r.url)) if r.status >= 400 else None); pg.on('pageerror', lambda e: errs.append(email + ': ' + str(e))); pg.on('dialog', lambda d: d.accept())
        pg.on('console', lambda m: errs.append(email + ' console: ' + m.text) if m.type == 'error' and 'ERR_FAILED' not in m.text else None)
        pg.goto(BASE)
        pg.evaluate("a=>{localStorage.setItem('bt:v1:me',JSON.stringify(a[0]));localStorage.setItem('bt:v1:seenNews',JSON.stringify('9'));localStorage.setItem('bt:v1:batch',JSON.stringify(a[2]));if(a[1]){sessionStorage.setItem('mockSigned','1');localStorage.setItem('bt:v1:cloud',JSON.stringify({code:a[1],name:'Batch 2027',state:'member',lastSync:new Date().toISOString(),lastFull:99999999}));}}",
                    [me, CODE if member else '', [card('pA', 'Isa Navarro', photo=''), card('pB', 'Bea Cruz')]])
        pg.reload(); pg.wait_for_timeout(500)
        return pg
    def go(pg, h, w=450): pg.evaluate("h=>location.hash=h", h); pg.wait_for_timeout(w)
    def txt(pg): return pg.inner_text('main')
    def click(pg, sel, w=450): pg.locator(sel).first.click(); pg.wait_for_timeout(w)
    def msgs(ch): return DB['batches'][CODE]['channels'][ch]['messages']
    def newest(ch): return sorted(msgs(ch).items(), key=lambda kv: kv[1]['created'])[-1]

    A = phone('isaymotion@gmail.com', 'uA', 'Isa N', card('pA', 'Isa Navarro'))
    Bp = phone('bea@example.com', 'uB', 'Bea Cruz', card('pB', 'Bea Cruz'), theme='dark')
    C = phone('cid@example.com', 'uC', 'Cid', card('pC', 'Cid Reyes'), member=False)

    # --- tab bar + menu
    tabs = A.locator('.tabbar [data-tab]').evaluate_all("l=>l.map(e=>e.getAttribute('data-tab'))")
    ok(tabs == ['home', 'emergency', 'menu', 'chat', 'about'], 'tab bar: Home, Emergency, Menu, Chat, About (%s)' % tabs)
    hrefs = A.locator('#sidenav a').evaluate_all("l=>l.map(e=>e.getAttribute('href'))")
    ok('#/chat' in hrefs and '#/whats-new' in hrefs, "menu has Chat and still has What's new")

    # --- not a member
    go(C, '#/chat'); ok(C.locator('.chat-join a[href="#/sync"]').count() == 1, 'not in a batch: join callout links to Cloud sync')
    go(C, '#/chat/general'); ok(C.locator('.chat-join').count() == 1 and C.locator('#chat-form').count() == 0, 'not in a batch: no composer in a channel')

    # --- admin opens chat: starting channels made once
    go(A, '#/chat', 1200)
    chs = DB['batches'][CODE]['channels']
    names = [c['name'] for k, c in sorted(chs.items(), key=lambda kv: kv[1]['order'])]
    ok(names == ['general', 'memes', 'kain', 'Mariveles', 'psych', 'nerd', 'daldal', 'boardgames', 'TV', 'anime', 'movie', 'music', 'news', 'duty', 'help'], 'admin phone created the 15 starting channels in order (%d)' % len(names))
    ok('duty-talk' not in chs and all(c['by'] == 'uA' for c in chs.values()), 'no #duty-talk; admin owns the starting channels')
    ok(A.locator('.ch-row').count() == 15 and A.locator('.ch-row').first.inner_text().startswith('💬') and '#general' in A.locator('.ch-row').first.inner_text(), 'channel list shows 15 rows, #general first')
    n0 = calls.count('chatCreateChannels'); go(A, '#/', 200); go(A, '#/chat', 900)
    ok(calls.count('chatCreateChannels') == n0, 'starting channels are not created twice')

    # --- resident writes in #general
    go(Bp, '#/chat', 900); ok(Bp.locator('.ch-row').count() == 15, 'resident sees the 15 channels')
    go(Bp, '#/chat/general', 900)
    ok(Bp.evaluate("document.body.classList.contains('is-chat-room')") and not Bp.locator('.tabbar').is_visible(), 'inside a channel the tab bar steps aside')
    ok('No messages yet' in txt(Bp), 'empty channel: say hi')
    Bp.fill('#chat-text', 'Hi batch! Watch this https://youtu.be/dQw4w9WgXcQ and https://maps.app.goo.gl/abc123'); click(Bp, '#chat-send', 900)
    mid1, m1 = newest('general')
    ok(m1['uid'] == 'uB' and m1['name'] == 'Bea Cruz' and m1['cardId'] == 'pB' and len(m1['links']) == 2, 'message saved with name, card id and 2 links')
    ok(Bp.locator('#chat-text').input_value() == '', 'composer cleared after sending')
    ok(Bp.locator('.chat-msg.is-me').count() == 1 and Bp.locator('.lcard--youtube').count() == 1 and Bp.locator('.lcard--maps').count() == 1, 'own message shown with YouTube + Maps preview cards')
    ok(Bp.locator('.lcard--youtube img').get_attribute('src') == 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 'YouTube card uses the video thumbnail')
    ok(DB['batches'][CODE]['channels']['general']['last'] == m1['created'], "channel 'last' updated with the message")

    # --- admin: unread dot + tab badge, then reads
    go(A, '#/', 200); A.evaluate("()=>{var c=JSON.parse(localStorage.getItem('bt:v1:cloud'));c.lastSync='';localStorage.setItem('bt:v1:cloud',JSON.stringify(c));}")
    A.reload(); A.wait_for_timeout(1800)
    ok(A.locator('.tabbar [data-badge="chat"]').inner_text() == '1' and A.locator('.tabbar [data-badge="chat"]').is_visible(), 'admin: Chat tab badge shows 1 unread channel after sync')
    go(A, '#/chat', 900); ok(A.locator('.ch-row.is-unread').count() == 1 and 'Bea Cruz' in A.locator('.ch-row.is-unread').inner_text(), 'unread dot on #general with last sender')
    go(A, '#/chat/general', 1000)
    ok('Hi batch!' in txt(A) and A.locator('.chat-msg.is-me').count() == 0 and A.locator('.chat-msg__h').first.inner_text().startswith('Bea Cruz'), "admin sees Bea's message with her name")
    ok(A.locator('.chat-msg a[href="#/person/pB"]').count() >= 1, 'name/avatar link to her card')
    ok(A.locator('.tabbar [data-badge="chat"]').is_hidden(), 'badge cleared after reading')

    # --- reply via the sheet (admin), seen live by the resident
    A.locator('.chat-more').first.click(); A.wait_for_timeout(250)
    ok(A.locator('#chat-sheet').is_visible() and A.locator('[data-sact=delete]').count() == 1, 'admin: message sheet with Delete (admin may delete any)')
    ok(A.locator('[data-sact=report]').count() == 1, 'sheet offers Report on someone else\'s message')
    click(A, '[data-sact=close]', 250); ok(A.locator('#chat-sheet').is_hidden(), 'Close hides the sheet')
    A.locator('.chat-more').first.click(); A.wait_for_timeout(250)
    click(A, '[data-sact=reply]', 250)
    ok('Replying to Bea Cruz' in A.inner_text('#chat-extra'), 'reply preview above the composer')
    A.fill('#chat-text', 'Welcome, Bea! 🎉'); click(A, '#chat-send', 900)
    mid2, m2 = newest('general')
    ok(m2.get('replyTo', {}).get('id') == mid1 and m2['replyTo']['name'] == 'Bea Cruz', 'reply stored with the quoted message')
    Bp.wait_for_timeout(700)
    ok('Welcome, Bea!' in txt(Bp) and Bp.locator('.chat-quote').count() >= 1, 'resident sees the reply live, with the quote (no reload)')

    # --- reaction
    Bp.locator('.chat-msg:not(.is-me) .chat-more').last.click(); Bp.wait_for_timeout(250)
    ok(Bp.locator('[data-sact=delete]').count() == 0, "resident: no Delete on the admin's message")
    click(Bp, '[data-sreact=love]', 700)
    ok(msgs('general')[mid2].get('react', {}).get('love') == ['uB'], 'heart reaction saved')
    A.wait_for_timeout(700); ok(A.locator('.chat-react').count() == 1 and '❤️ 1' in A.locator('.chat-react').inner_text(), 'admin sees ❤️ 1 live')
    click(Bp, '.chat-react', 700); ok(msgs('general')[mid2].get('react', {}).get('love') == [], 'tap the chip again removes the reaction')

    # --- sticker
    click(A, '#chat-stkbtn', 300)
    ok(A.locator('.chat-stk__b').count() == 16 and A.locator('[data-stkset]').count() == 3, 'sticker sheet: 3 packs, 16 each')
    click(A, '[data-stkset=cat]', 200); ok(A.locator('[data-stk="cat/15-daldal"]').count() == 1, 'cat pack has DALDAL!')
    click(A, '[data-stk="cat/15-daldal"]', 900)
    mid3, m3 = newest('general')
    ok(m3.get('sticker') == 'cat/15-daldal' and 'text' not in m3, 'sticker message stored by id only')
    Bp.wait_for_timeout(700)
    src = Bp.locator('.chat-stk').last.get_attribute('src')
    ok(src == 'img/stickers/cat/cat-15-daldal.webp' and Bp.evaluate("s=>fetch(s).then(r=>r.ok)", src), 'resident sees the sticker image (file served)')
    nat = Bp.evaluate("()=>[...document.querySelectorAll('.chat-stk')].every(i=>i.complete&&i.naturalWidth===512)")
    ok(nat, 'sticker images load at 512×512')

    # --- photo
    Bp.set_input_files('#chat-file', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'photo.jpg')); Bp.wait_for_timeout(900)
    ok(Bp.locator('.chat-extra__img').count() == 1 and 'Photo ready' in Bp.inner_text('#chat-extra'), 'photo preview before sending')
    Bp.fill('#chat-text', 'Duty view 🌅'); click(Bp, '#chat-send', 1200)
    mid4, m4 = newest('general')
    ok(m4.get('img', {}).get('data', '').startswith('data:image/') and len(m4['img']['data']) < 900000 and max(m4['img']['w'], m4['img']['h']) <= 1280 and m4['text'] == 'Duty view 🌅', 'photo shrunk (≤1280 px, <900 KB) and stored with its caption (%s, %d chars)' % (m4.get('img', {}).get('data', '')[:15], len(m4.get('img', {}).get('data', ''))))
    A.wait_for_timeout(700); ok(A.locator('.chat-img').count() == 1, 'admin sees the photo')
    click(A, '.chat-imgbtn', 300); ok(A.locator('#chat-zoom').is_visible(), 'tap a photo to see it big'); click(A, '#chat-zoom', 200); ok(A.locator('#chat-zoom').is_hidden(), 'tap again to close')
    big = 'data:image/jpeg;base64,' + 'A' * 970000
    ok(rule(UB, 'chatSend', CODE, 'general', {'cardId': 'pB', 'name': 'B', 'created': now_ms(), 'img': {'data': big, 'w': 1, 'h': 1}}) == {'__err': 'permission-denied'}, 'rules: oversized photo refused')

    # --- report + admin review
    Bp.locator('.chat-msg:not(.is-me) .chat-more').first.click(); Bp.wait_for_timeout(250); click(Bp, '[data-sact=report]', 700)
    reps = DB['batches'][CODE]['reports']
    ok(len(reps) == 1 and list(reps.values())[0]['mid'] == mid2 and list(reps.values())[0]['by'] == 'uB', 'report sent to the admin list')
    go(A, '#/chat', 1000); ok('Welcome, Bea!' in A.inner_text('#ch-reports') and 'reported by Bea Cruz' in A.inner_text('#ch-reports'), 'admin sees the report on the channel list')
    go(Bp, '#/chat', 700); ok(Bp.locator('#ch-reports').count() == 0, 'resident: no reports section')
    click(A, '[data-rok]', 500); ok(not reps and 'Nothing reported' in A.inner_text('#ch-reports'), 'admin dismisses the report')

    # --- delete own message
    go(Bp, '#/chat/general', 900)
    Bp.locator('.chat-msg.is-me .chat-more').first.click(); Bp.wait_for_timeout(250); click(Bp, '[data-sact=delete]', 800)
    ok(mid1 not in msgs('general') and Bp.locator('.chat-text', has_text='Hi batch!').count() == 0, 'resident deletes own message (gone from cloud and screen)')
    go(A, '#/chat/general', 1000); ok(A.locator('.chat-text', has_text='Hi batch!').count() == 0, "deleted message gone on the admin's phone")
    ok(rule(UB, 'chatDelete', CODE, 'general', mid2) == {'__err': 'permission-denied'}, "rules: resident cannot delete the admin's message")

    # --- member-made channel
    go(Bp, '#/chat', 700); Bp.locator('.ch-new summary').click(); Bp.fill('#ch-new [name=emoji]', '👗'); Bp.fill('#ch-new [name=name]', 'OOTD'); click(Bp, '#ch-new button[type=submit]', 1200)
    ok('ootd' in chs and chs['ootd']['by'] == 'uB' and chs['ootd']['name'] == 'OOTD', 'resident creates #OOTD (owner = her)')
    ok(Bp.evaluate('location.hash') == '#/chat/ootd' and Bp.locator('#ch-rename').count() == 1, 'opens the new channel; creator may rename/delete')
    go(Bp, '#/chat', 700); Bp.locator('.ch-new summary').click(); Bp.fill('#ch-new [name=name]', 'ootd'); click(Bp, '#ch-new button[type=submit]', 900)
    ok('already exists' in Bp.inner_text('#ch-new-st'), 'duplicate name refused')
    go(Bp, '#/chat/general', 800); ok(Bp.locator('#ch-rename').count() == 0, "resident cannot rename the admin's #general")
    ok(rule(UB, 'chatDeleteChannel', CODE, 'general') == {'__err': 'permission-denied'}, "rules: resident cannot delete #general")
    ok(rule(UB, 'chatRenameChannel', CODE, 'ootd', 'fits', '👗') is True and chs['ootd']['name'] == 'fits', 'creator renames own channel')
    A.on('dialog', lambda d: None)
    go(A, '#/chat/ootd', 900); click(A, '#ch-del', 1200)
    ok('ootd' not in chs and A.evaluate('location.hash') == '#/chat', 'admin deletes a member channel')

    # --- paging: 45 messages
    base = now_ms() - 3600000
    for i in range(45):
        msgs('memes')['p%02d' % i] = {'uid': 'uA', 'cardId': 'pA', 'name': 'Isa Navarro', 'text': 'meme %d' % i, 'created': base + i * 1000}
    chs['memes']['last'] = base + 44000
    go(Bp, '#/chat/memes', 1200)
    ok(Bp.locator('.chat-bubble').count() == 30 and 'meme 44' in txt(Bp) and 'meme 14\n' not in txt(Bp), 'newest 30 shown first')
    ok(Bp.locator('#chat-older').is_visible(), 'Load older button shown')
    click(Bp, '#chat-older', 900)
    ok(Bp.locator('.chat-bubble').count() == 45 and 'meme 0' in txt(Bp), 'Load older brings the rest (45)')
    ok(Bp.locator('#chat-older').is_hidden(), 'no more to load')
    ok(Bp.locator('#chat-newpill').is_hidden(), 'New messages pill hidden when at the bottom')
    ok(Bp.evaluate('window.__listeners') == 1, 'exactly one live listener while a channel is open')
    go(Bp, '#/batch', 600); ok(Bp.evaluate('window.__listeners') == 0, 'leaving the channel stops the listener')
    ok(not Bp.evaluate("document.body.classList.contains('is-chat-room')"), 'tab bar back outside the channel')

    # --- rules spot checks
    ok(rule(UX, 'chatSend', CODE, 'general', {'cardId': '', 'name': 'X', 'created': now_ms(), 'text': 'hi'}) == {'__err': 'permission-denied'}, 'rules: non-member cannot post')
    ok(rule(UX, 'chatChannels', CODE) == {'__err': 'permission-denied'}, 'rules: non-member cannot read channels')
    ok(rule(UB, 'chatSend', CODE, 'general', {'cardId': 'pB', 'name': 'B', 'created': now_ms() - 3600000, 'text': 'old'}) == {'__err': 'permission-denied'}, 'rules: backdated message refused')
    ok(rule(UB, 'chatSend', CODE, 'general', {'cardId': 'pB', 'name': 'B', 'created': now_ms(), 'text': 'x' * 2001}) == {'__err': 'permission-denied'}, 'rules: text over 2000 characters refused')
    ok(rule(UB, 'chatSend', CODE, 'general', {'cardId': 'pB', 'name': 'B', 'created': now_ms(), 'text': 'x', 'admin': True}) == {'__err': 'permission-denied'}, 'rules: unknown message fields refused')
    ok(rule(UB, 'chatReports', CODE) == {'__err': 'permission-denied'}, 'rules: only the admin reads reports')

    # --- long text and odd input stay safe
    Bp.goto(BASE + '#/chat/general'); Bp.wait_for_timeout(1200)
    Bp.fill('#chat-text', '<img src=x onerror=alert(1)> **bold** javascript:alert(1)'); click(Bp, '#chat-send', 900)
    ok(Bp.locator('.chat-text img').count() == 0 and '<img src=x' in txt(Bp), 'HTML in a message is shown as text')
    ok(Bp.locator('.chat-text a[href^="javascript"]').count() == 0, 'no javascript: links')
    ok(not Bp.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no sideways scroll in a channel (phone, dark)')
    Bp.screenshot(path=out + '/chat-room-dark.png', full_page=False)
    click(Bp, '#chat-stkbtn', 400); Bp.screenshot(path=out + '/chat-stickers-dark.png', full_page=False); click(Bp, '#chat-stkbtn', 200)
    go(A, '#/chat/general', 1000); A.screenshot(path=out + '/chat-room-light.png', full_page=False)
    go(A, '#/chat', 600); A.screenshot(path=out + '/chat-list-light.png', full_page=True)
    ok(not A.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'no sideways scroll on the channel list (phone, light)')

    # --- badge for the first message
    ok('chatter' in json.loads(Bp.evaluate("localStorage.getItem('bt:v1:badges')") or '{}'), 'Chatterbox badge after the first message')

    # --- Tagalog
    go(Bp, '#/about', 300); Bp.locator('input[name=lang][value=tl]').check(force=True); Bp.wait_for_timeout(300)
    go(Bp, '#/chat', 700); ok('bt.chat.' not in txt(Bp) and 'nav.chat' not in Bp.inner_text('body'), 'Tagalog: no raw keys on the channel list')
    go(Bp, '#/chat/general', 900); ok('bt.chat.' not in Bp.inner_text('body'), 'Tagalog: no raw keys in a channel')

    # --- desktop
    D = phone('isaymotion@gmail.com', 'uA', 'Isa N', card('pA', 'Isa Navarro'), vw=1280, vh=900)
    go(D, '#/chat/general', 1200); D.screenshot(path=out + '/chat-desktop.png', full_page=False)
    ok(D.locator('#sidenav a[href="#/chat"]').count() == 1 and not D.evaluate('document.documentElement.scrollWidth>innerWidth+1'), 'desktop: Chat in the sidebar, no overflow')
    br.close()
errs = [e for e in errs if 'ytimg' not in e and 'favicon' not in e and 'fonts.g' not in e and '403 (Forbidden)' not in e]
print('ERRORS:', errs)
print('%d/%d PASS' % (sum(res), len(res)))
