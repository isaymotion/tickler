/* Batch Tickler cloud adapter (1.18.0). Loaded on demand after js/vendor/firebase.js (window.BTFB).
   The app only talks to window.BT_CLOUD(config) -> an object of promise-returning methods, so tests can
   swap in a mock with the same shape. All data lives under batches/{code}/… (see firestore.rules).
   Kept generic so Psych Tickler can reuse it: admins come from the config, every path is scoped per batch. */
(function () {
  'use strict';
  if (window.BT_CLOUD) return;   // a test mock is already in place
  window.BT_CLOUD = function (cfg) {
    var F = window.BTFB;
    if (!F) throw new Error('firebase-missing');
    var app = F.initializeApp(cfg.firebase), auth = F.getAuth(app), db = F.getFirestore(app);
    var admins = (cfg.admins || []).map(function (e) { return String(e).toLowerCase(); });
    var readyP = null;

    function d() { return F.doc.apply(null, [db].concat([].slice.call(arguments))); }
    function col() { return F.collection.apply(null, [db].concat([].slice.call(arguments))); }
    function me() { var u = auth.currentUser; if (!u) throw new Error('signed-out'); return u; }
    function rows(snap) { var out = []; snap.forEach(function (s) { var x = s.data() || {}; x._id = s.id; out.push(x); }); return out; }
    function user() {
      var u = auth.currentUser; if (!u) return null;
      var email = String(u.email || '').toLowerCase();
      return { uid: u.uid, email: email, name: u.displayName || '', verified: !!u.emailVerified, admin: !!(u.emailVerified && admins.indexOf(email) >= 0) };
    }

    return {
      user: user,
      ready: function () {   // resolves once the saved sign-in (if any) has been restored
        if (readyP) return readyP;
        readyP = F.setPersistence(auth, F.indexedDBLocalPersistence).catch(function () { return F.setPersistence(auth, F.browserLocalPersistence).catch(function () {}); })
          .then(function () { return F.getRedirectResult(auth).catch(function () { return null; }); })
          .then(function () { return new Promise(function (res) { var off = F.onAuthStateChanged(auth, function () { off(); res(user()); }); }); });
        return readyP;
      },
      signIn: function () {
        var p = new F.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
        return F.signInWithPopup(auth, p).then(user).catch(function (e) {
          var c = e && e.code || '';
          // Installed iPhone apps can refuse popups: fall back to a full-page redirect (the page reloads afterwards).
          if (/popup-blocked|operation-not-supported|web-storage-unsupported/.test(c)) return F.signInWithRedirect(auth, p).then(function () { return new Promise(function () {}); });
          throw e;
        });
      },
      signOut: function () { return F.signOut(auth); },

      getBatch: function (code) { return F.getDoc(d('batches', code)).then(function (s) { return s.exists() ? Object.assign({ code: code }, s.data()) : null; }); },
      setBatchInfo: function (code, info) { return F.setDoc(d('batches', code), info, { merge: true }); },   // admin only (rules)
      myBatches: function () { return F.getDocs(col('batches')).then(function (s) { return rows(s).map(function (x) { return { code: x._id, name: x.name || '' }; }); }); },
      createBatch: function (code, name, who) {
        var u = me(), b = F.writeBatch(db), now = Date.now();
        b.set(d('batches', code), { name: name, created: now, by: u.uid });
        b.set(d('batches', code, 'members', u.uid), { name: who.name || '', email: user().email, joined: now });
        return b.commit();
      },
      status: function (code) {   // 'member' | 'pending' | 'none'
        var u = me();
        return F.getDoc(d('batches', code, 'members', u.uid)).then(function (s) {
          if (s.exists()) return 'member';
          return F.getDoc(d('batches', code, 'requests', u.uid)).then(function (r) { return r.exists() ? 'pending' : 'none'; });
        });
      },
      request: function (code, who) { var u = me(); return F.setDoc(d('batches', code, 'requests', u.uid), { name: who.name || '', email: u.email || '', created: Date.now() }); },   // email exactly as in the sign-in token (the rules compare them)
      cancelRequest: function (code) { return F.deleteDoc(d('batches', code, 'requests', me().uid)); },
      requests: function (code) { return F.getDocs(col('batches', code, 'requests')).then(function (s) { return rows(s).map(function (x) { return { uid: x._id, name: x.name || '', email: x.email || '', created: x.created || 0 }; }); }); },
      approve: function (code, r) {
        var b = F.writeBatch(db);
        b.set(d('batches', code, 'members', r.uid), { name: r.name || '', email: r.email || '', joined: Date.now() });
        b.delete(d('batches', code, 'requests', r.uid));
        return b.commit();
      },
      decline: function (code, uid) { return F.deleteDoc(d('batches', code, 'requests', uid)); },
      members: function (code) { return F.getDocs(col('batches', code, 'members')).then(function (s) { return rows(s).map(function (x) { return { uid: x._id, name: x.name || '', email: x.email || '', joined: x.joined || 0 }; }); }); },
      removeMember: function (code, uid) {   // admin: the member and every card they uploaded
        return F.getDocs(F.query(col('batches', code, 'cards'), F.where('owner', '==', uid))).then(function (s) {
          var b = F.writeBatch(db); s.forEach(function (x) { b.delete(x.ref); }); b.delete(d('batches', code, 'members', uid)); return b.commit();
        });
      },
      leave: function (code) {   // delete my cards first (owner rule), then my membership
        var u = me();
        return F.getDocs(F.query(col('batches', code, 'cards'), F.where('owner', '==', u.uid))).then(function (s) {
          var b = F.writeBatch(db); s.forEach(function (x) { b.delete(x.ref); }); return b.commit();
        }).then(function () { return F.deleteDoc(d('batches', code, 'members', u.uid)); });
      },

      putCard: function (code, card, shared) {
        var u = me();
        return F.setDoc(d('batches', code, 'cards', card.id), { owner: u.uid, updated: Date.parse(card.updated) || Date.now(), shared: { emergency: !!shared.emergency, contact: !!shared.contact }, card: card });
      },
      cardsSince: function (code, since) {   // since < 0 = every card (daily full pull)
        var q = since >= 0 ? F.query(col('batches', code, 'cards'), F.where('updated', '>', since)) : col('batches', code, 'cards');
        return F.getDocs(q).then(function (s) { return rows(s).map(function (x) { return { id: x._id, owner: x.owner, updated: x.updated || 0, shared: x.shared || {}, card: x.card }; }); });
      },
      putEvent: function (code, ev) {
        var x = { title: ev.title || '', date: ev.date || '', time: ev.time || '', place: ev.place || '', note: ev.note || '', updated: Date.parse(ev.updated) || Date.now(), by: me().uid };
        if (ev.deleted) x.deleted = true;
        return F.setDoc(d('batches', code, 'events', ev.id), x);
      },
      eventsSince: function (code, since) {
        return F.getDocs(F.query(col('batches', code, 'events'), F.where('updated', '>', since))).then(function (s) { return rows(s).map(function (x) { x.id = x._id; delete x._id; return x; }); });
      }
    };
  };
})();
