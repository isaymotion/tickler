/* Batch Tickler - app shell: router, menu, search, theme, text size, language, backup, What's new.
   Plain ES5 in one IIFE, no build step. To add a screen: add one entry to VIEWS and one to NAV
   (see "APP VIEWS" below). Patterns come from the isaymotion Companion apps (Stahl / DSMVapp),
   MSEtrainer and sheatrainer. */
(function () {
  'use strict';

  /* ===== Storage (try/catch so the app works with storage blocked) ===== */
  var PREFIX = 'bt:v1:';
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(PREFIX + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ }
    },
    del: function (k) { try { localStorage.removeItem(PREFIX + k); } catch (e) {} }
  };

  /* ===== Key migration (for restyled apps whose storage PREFIX changed, so saved progress survives).
     map = { 'old:prefix:': 'sub-prefix' | function (rest, oldKey) { return 'new-suffix'; } }.
     Every localStorage key starting with an old prefix is copied under PREFIX, then the old key is removed.
     A string value is put in front of the rest of the key ('' just swaps the prefix); a function returns the new
     suffix (a falsy result skips that key). An existing key under PREFIX is never overwritten. ===== */
  function migrateKeys(map) {
    try {
      if (!map || typeof map !== 'object') return;
      var keys = [], i;
      for (i = 0; i < localStorage.length; i++) { var k0 = localStorage.key(i); if (k0) keys.push(k0); }
      Object.keys(map).forEach(function (oldP) {
        if (!oldP) return;
        var to = map[oldP], growing = PREFIX.indexOf(oldP) === 0;   // new prefix extends the old one: do not re-migrate
        keys.forEach(function (k) {
          if (k.indexOf(oldP) !== 0) return;
          if (growing && k.indexOf(PREFIX) === 0) return;
          var rest = k.slice(oldP.length), suffix = typeof to === 'function' ? to(rest, k) : (typeof to === 'string' ? to + rest : null);
          if (typeof suffix !== 'string' || !suffix) return;
          var nk = PREFIX + suffix;
          if (nk === k) return;
          try {
            if (localStorage.getItem(nk) == null) localStorage.setItem(nk, localStorage.getItem(k));
            localStorage.removeItem(k);
          } catch (e) { /* leave the old key in place */ }
        });
      });
    } catch (e) { /* storage unavailable */ }
  }
  if (window.MIGRATE_KEYS) migrateKeys(window.MIGRATE_KEYS);

  var META = window.APP_META || {};
  var CHANGELOG = window.APP_CHANGELOG || [];
  var ATTRIBUTION = META.attribution || '';
  var APP_NAME = META.name || document.title;
  var APP_LINKS = window.APP_LINKS || [];

  /* ===== Language: 'en' (default) or 'tl' (Tagalog). Shell UI strings live in data/strings.js. ===== */
  var STRINGS = window.STRINGS || {};
  var lang = store.get('lang', 'en') === 'tl' ? 'tl' : 'en';
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function t(key) {
    var s = STRINGS[lang] && has(STRINGS[lang], key) ? STRINGS[lang][key] : null;
    if (typeof s !== 'string' || !s) s = STRINGS.en && has(STRINGS.en, key) ? STRINGS.en[key] : null;
    return typeof s === 'string' && s ? s : key;
  }
  function tf(key, vars) { return t(key).replace(/\{(\w+)\}/g, function (m, k) { return vars && has(vars, k) ? String(vars[k]) : m; }); }
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[\[(.+?)\]\]/g, '<kbd>$1</kbd>'); }   // **bold** and [[key]] in strings
  function locale() { return lang === 'tl' ? 'fil' : undefined; }

  /* ===== Helpers ===== */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
    if (!m) return String(iso);
    return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString(locale(), { month: 'long', day: 'numeric', year: 'numeric' });
  }

  var main = document.getElementById('main');
  var sidenav = document.getElementById('sidenav');
  var backdrop = document.getElementById('nav-backdrop');
  var menuBtn = document.getElementById('menu-btn');
  var tabMenu = document.getElementById('tab-menu');
  var qInput = document.getElementById('q');
  var suggestBox = document.getElementById('suggest');

  /* ===== Icons (inline SVG, 24x24, stroke = currentColor). NAV items refer to these by key. ===== */
  var ICONS = {
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
    news: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h6M9 16h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || 'nav-ico') + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.star) + '</svg>';
  }

  /* ===== NAV: one entry per screen. Builds the sidenav (grouped by `group`) and the home tiles.
     {label, href, icon, group}  Optional: tile:false (keep off the home grid), badge:'news' (unseen What's new count),
     tkey:'nav.x' (label comes from data/strings.js). The "Other apps" group is added after these from window.APP_LINKS. ===== */
  var NAV = [
    { label: 'Home', tkey: 'nav.home', href: '#/', icon: 'home', group: 'Start', tile: false },
    { label: 'The batch', tkey: 'nav.batch', href: '#/batch', icon: 'users', group: 'Screens' },
    { label: 'My card', tkey: 'nav.me', href: '#/me', icon: 'card', group: 'Screens' },
    { label: 'Birthdays', tkey: 'nav.birthdays', href: '#/birthdays', icon: 'cake', group: 'Screens' },
    { label: 'Hometown map', tkey: 'nav.map', href: '#/map', icon: 'pin', group: 'Screens' },
    { label: 'Guess who', tkey: 'nav.guess', href: '#/guess', icon: 'quiz', group: 'Play' },
    { label: 'Who said it?', tkey: 'nav.whosaid', href: '#/whosaid', icon: 'chat', group: 'Play' },
    { label: 'Batch Bingo', tkey: 'nav.bingo', href: '#/bingo', icon: 'game', group: 'Play' },
    { label: 'Icebreakers', tkey: 'nav.icebreakers', href: '#/icebreakers', icon: 'spark', group: 'Play' },
    { label: 'Batch Wrapped', tkey: 'nav.wrapped', href: '#/wrapped', icon: 'star', group: 'Play' },
    { label: 'Share cards', tkey: 'nav.share', href: '#/share', icon: 'share', group: 'Screens' },
    { label: 'Scan a card', tkey: 'nav.scan', href: '#/scan', icon: 'qr', group: 'Screens' },
    { label: 'Batch stats', tkey: 'nav.stats', href: '#/stats', icon: 'chart', group: 'Screens' },
    { label: 'Print sheet', tkey: 'nav.print', href: '#/print', icon: 'print', group: 'Screens' },
    { label: 'What’s new', tkey: 'nav.whatsNew', href: '#/whats-new', icon: 'news', group: 'App', tile: false, badge: 'news' },
    { label: 'About', tkey: 'nav.about', href: '#/about', icon: 'info', group: 'App', tile: false }
  ];
  var NAV_GROUPS = { Start: 'nav.start', Screens: 'nav.screens', Play: 'nav.play', App: 'nav.app' };   // group name -> strings key
  function navLabel(n) { return n.tkey ? t(n.tkey) : n.label; }

  /* ===== Search index: fill with {title, text, href, kind}. Rebuild it from your own data if you like.
     The shell's own entries (What's new, About) are added by shellIndex() so they follow the language. ===== */
  var SEARCH_INDEX = [
    /* { title: 'Example', text: 'Words people might search for.', href: '#/example', kind: 'Screen' } */
  ];
  function shellIndex() {
    return [
      { title: t('nav.whatsNew'), text: t('search.newsText'), href: '#/whats-new', kind: t('nav.app') },
      { title: t('nav.about'), text: t('search.aboutText'), href: '#/about', kind: t('nav.app') }
    ];
  }

  /* ===== Theme: auto (match device) / light / dark. No data-theme attribute = match device. ===== */
  var THEME_ICONS = {
    auto: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
    dark: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    light: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  var darkMQ = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function getTheme() {
    var cur = store.get('theme', 'auto');
    return cur === 'light' || cur === 'dark' ? cur : 'auto';
  }
  function applyTheme(mode) {
    var root = document.documentElement;
    if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode); else root.removeAttribute('data-theme');
    var dark = mode === 'dark' || (mode !== 'light' && darkMQ && darkMQ.matches);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0E1F20' : '#1C676E');
    var btn = document.getElementById('theme-btn');
    if (btn) {
      var label = tf('theme.label', { name: t('theme.' + mode) });
      btn.innerHTML = THEME_ICONS[mode];
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    }
    var opts = document.querySelectorAll('[data-theme-opt]');
    for (var i = 0; i < opts.length; i++) opts[i].setAttribute('aria-pressed', opts[i].getAttribute('data-theme-opt') === mode ? 'true' : 'false');
    var radios = document.querySelectorAll('input[name="theme"]');   // the Theme segment on the About page
    for (var j = 0; j < radios.length; j++) radios[j].checked = radios[j].value === mode;
  }
  function setTheme(mode) {
    if (mode !== 'light' && mode !== 'dark') mode = 'auto';
    if (mode === 'auto') store.del('theme'); else store.set('theme', mode);
    applyTheme(mode);
  }
  applyTheme(getTheme());
  (function () {
    var btn = document.getElementById('theme-btn');
    if (btn) btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'auto';
      setTheme({ auto: 'light', light: 'dark', dark: 'auto' }[cur]);
    });
    function onDeviceChange() { applyTheme(document.documentElement.getAttribute('data-theme') || 'auto'); }
    if (darkMQ) { if (darkMQ.addEventListener) darkMQ.addEventListener('change', onDeviceChange); else if (darkMQ.addListener) darkMQ.addListener(onDeviceChange); }
  })();

  /* ===== Header height -> --top ===== */
  function headerH() { var t = document.querySelector('.topbar'); return t ? t.offsetHeight : 64; }
  function setTopVar() { document.documentElement.style.setProperty('--top', headerH() + 'px'); }
  window.addEventListener('resize', setTopVar);
  setTopVar();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setTopVar);

  /* ===== Text size (Aa panel) ===== */
  var TEXT_SIZES = [['90', 'textsize.smaller'], ['100', 'textsize.default'], ['112.5', 'textsize.larger'], ['125', 'textsize.largest']];   // [value, strings key]
  function syncSizeRadios(v) {   // the text-size segment on the About page
    var radios = document.querySelectorAll('input[name="aboutTextSize"]');
    for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === v;
  }
  function applyTextSize(v) {
    var ok = TEXT_SIZES.some(function (z) { return z[0] === v; });
    document.documentElement.style.fontSize = ok && v !== '100' ? v + '%' : '';
    setTopVar();
  }
  (function () {
    var btn = document.getElementById('textSizeBtn');
    if (!btn) return;
    var panel = document.createElement('div');
    panel.className = 'text-size-panel'; panel.id = 'textSizePanel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', t('textsize.title'));
    document.body.appendChild(panel);
    function build() {
      var cur = String(store.get('textSize', '100'));
      panel.setAttribute('aria-label', t('textsize.title'));
      panel.innerHTML = '<p class="text-size-panel__title">' + esc(t('textsize.title')) + '</p><div class="seg">' + TEXT_SIZES.map(function (z, i) {
        return '<label><input type="radio" name="textSize" value="' + z[0] + '"' + (cur === z[0] ? ' checked' : '') + '><span style="font-size:' + (0.82 + i * 0.1).toFixed(2) + 'rem">' + esc(t(z[1])) + '</span></label>';
      }).join('') + '</div>';
    }
    function open() { build(); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); var f = panel.querySelector('input:checked'); if (f) f.focus(); }
    function close() { if (panel.hidden) return; panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); if (panel.hidden) open(); else close(); });
    panel.addEventListener('change', function (e) {
      if (e.target.name === 'textSize') { store.set('textSize', e.target.value); applyTextSize(e.target.value); syncSizeRadios(e.target.value); }
    });
    document.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
    window.addEventListener('hashchange', close);
  })();

  /* ===== In-app back/forward buttons (index-stamped history) ===== */
  var HIST_KEY = PREFIX + 'hist';
  var hist = (function () { try { return JSON.parse(sessionStorage.getItem(HIST_KEY)) || { cur: 0, max: 0 }; } catch (e) { return { cur: 0, max: 0 }; } })();
  function saveHist() { try { sessionStorage.setItem(HIST_KEY, JSON.stringify(hist)); } catch (e) {} }
  function stamp(i) { try { history.replaceState({ spIdx: i }, ''); } catch (e) {} }
  function syncHist() {
    var st = history.state;
    if (st && typeof st.spIdx === 'number') {
      hist.cur = st.spIdx;
      if (hist.cur > hist.max) hist.max = hist.cur;
    } else {
      hist.cur = hist.cur + 1;     // a new page: anything that was ahead is discarded
      hist.max = hist.cur;
      stamp(hist.cur);
    }
    saveHist(); paintHist();
  }
  function paintHist() {
    var b = document.getElementById('nav-back'), f = document.getElementById('nav-fwd');
    if (b) b.disabled = hist.cur <= 0;
    if (f) f.disabled = hist.cur >= hist.max;
  }
  (function initHist() {
    var st = history.state;
    if (st && typeof st.spIdx === 'number') { hist.cur = st.spIdx; if (hist.max < hist.cur) hist.max = hist.cur; }
    else { hist = { cur: 0, max: 0 }; stamp(0); }
    saveHist(); paintHist();
    var b = document.getElementById('nav-back'), f = document.getElementById('nav-fwd');
    if (b) b.addEventListener('click', function () { if (!b.disabled) history.back(); });
    if (f) f.addEventListener('click', function () { if (!f.disabled) history.forward(); });
  })();

  /* Alt+Left / Alt+Right (ignores typing in fields and other modifiers) */
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if (e.altKey && !typing && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      if (e.key === 'ArrowLeft') history.back(); else history.forward();
    }
  });

  /* ===== Scroll restoration (only on back/forward, not on ordinary link clicks) ===== */
  var scrollMemo = {}, scrollKey = location.hash || '#/', fromHistory = false, scrollPending = false;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('scroll', function () {
    if (scrollPending) return;
    scrollPending = true;
    setTimeout(function () { scrollPending = false; scrollMemo[scrollKey] = window.scrollY; }, 120);
  }, { passive: true });
  window.addEventListener('popstate', function (e) { fromHistory = !!(e.state && typeof e.state.spIdx === 'number'); });

  /* ===== Menu: docked sidebar on desktop, drawer on phones/tablets ===== */
  function isDrawerMode() { return window.matchMedia('(max-width: 1099px)').matches; }
  function setMenuExpanded(v) { [menuBtn, tabMenu].forEach(function (b) { if (b) b.setAttribute('aria-expanded', v ? 'true' : 'false'); }); }
  function openDrawer() {
    if (!isDrawerMode()) return;
    document.body.classList.add('drawer-open');
    backdrop.hidden = false;
    setMenuExpanded(true);
    var target = sidenav.querySelector('.sidenav__close');
    setTimeout(function () { if (target) target.focus(); }, 60);
  }
  function closeDrawer() {
    if (!document.body.classList.contains('drawer-open')) return;
    document.body.classList.remove('drawer-open');
    backdrop.hidden = true;
    setMenuExpanded(false);
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { openDrawer(); });
  if (tabMenu) tabMenu.addEventListener('click', function () { if (document.body.classList.contains('drawer-open')) closeDrawer(); else openDrawer(); });
  document.getElementById('nav-close').addEventListener('click', function () { closeDrawer(); if (menuBtn) menuBtn.focus(); });
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) { closeDrawer(); if (menuBtn) menuBtn.focus(); } });
  sidenav.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a && a.getAttribute('href') === location.hash) closeDrawer(); });
  var collapseBtn = document.getElementById('collapse-btn');   // desktop: hide/show the docked sidebar
  function labelCollapse() {
    var c = document.documentElement.classList.contains('nav-collapsed');
    collapseBtn.setAttribute('aria-label', t(c ? 'sidebar.show' : 'sidebar.hide'));
    collapseBtn.setAttribute('title', t(c ? 'sidebar.show' : 'sidebar.hide'));
  }
  collapseBtn.addEventListener('click', function () {
    var c = !document.documentElement.classList.contains('nav-collapsed');
    document.documentElement.classList.toggle('nav-collapsed', c);
    store.set('navCollapsed', c); labelCollapse(); setTopVar();
  });
  labelCollapse();

  /* APP_LINKS minus this app's own entry (matched on the repo slug at the end of the URL). Menu only: never tiles, search or tabs. */
  function otherApps() {
    if (!window.SHOW_OTHER_APPS) return [];   // off until she is ready to interlink the apps (data/app-meta.js)
    var me = String(META.repo || '').toLowerCase();
    return APP_LINKS.filter(function (a) {
      if (!a || !a.name || !/^https?:\/\//i.test(String(a.href || ''))) return false;
      var slug = String(a.href).replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop().toLowerCase();
      return !me || slug !== me;
    });
  }
  function currentKey() { var p = parts(); return p.length ? p[0] : 'home'; }
  function buildNav() {
    var cur = location.hash || '#/';
    if (cur === '#') cur = '#/';
    var groups = [], byName = {};
    NAV.forEach(function (n) {
      var g = n.group || 'Menu';
      if (!byName[g]) { byName[g] = { label: g, items: [] }; groups.push(byName[g]); }
      byName[g].items.push(n);
    });
    var html = groups.map(function (g) {
      return '<div class="nav-group"><div class="nav-label">' + esc(NAV_GROUPS[g.label] ? t(NAV_GROUPS[g.label]) : g.label) + '</div><ul>' + g.items.map(function (n) {
        var active = n.href === cur;
        return '<li><a class="nav-item' + (active ? ' is-active' : '') + '" href="' + esc(n.href) + '"' + (active ? ' aria-current="page"' : '') + '>' + icon(n.icon) + '<span>' + esc(navLabel(n)) + '</span>' +
          (n.badge ? '<span class="badge" data-badge="' + esc(n.badge) + '" hidden></span>' : '') + '</a></li>';
      }).join('') + '</ul></div>';
    }).join('');
    var others = otherApps();
    if (others.length) {
      html += '<div class="nav-group"><div class="nav-label">' + esc(t('nav.otherApps')) + '</div><ul>' + others.map(function (a) {
        return '<li><a class="nav-item" href="' + esc(a.href) + '" target="_blank" rel="noopener">' + icon('external') + '<span>' + esc(a.name) + '</span><span class="sr-only"> ' + esc(t('nav.newTab')) + '</span></a></li>';
      }).join('') + '</ul></div>';
    }
    document.getElementById('sidenav-body').innerHTML = html;
    var tabs = document.querySelectorAll('.tabbar [data-tab]');
    var key = currentKey();
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute('data-tab') === key;
      if (tabs[i].tagName === 'A') { tabs[i].classList.toggle('is-active', on); if (on) tabs[i].setAttribute('aria-current', 'page'); else tabs[i].removeAttribute('aria-current'); }
    }
  }

  /* ===== What's new: unseen badge keyed on the version string ===== */
  function latestNewsVersion() { return CHANGELOG.length ? String(CHANGELOG[0].version) : ''; }
  function seenNewsVersion() {
    var s = store.get('seenNews', null);
    if (s == null) { s = latestNewsVersion(); store.set('seenNews', s); }   // brand-new visitors start up to date
    return s;
  }
  function unseenNews() {
    var seen = seenNewsVersion(), out = [];
    for (var i = 0; i < CHANGELOG.length; i++) {
      if (String(CHANGELOG[i].version) === seen) return out;
      out.push(CHANGELOG[i]);
    }
    return out;
  }
  function updateNavBadges() {
    var n = unseenNews().length;
    var els = document.querySelectorAll('[data-badge="news"]');
    for (var i = 0; i < els.length; i++) { els[i].textContent = n; els[i].hidden = !n; }
  }

  /* ===== Search ===== */
  var sugIndex = -1, sugTimer = null, searchKind = '';
  function terms(q) { return String(q).toLowerCase().replace(/[^\p{L}\p{N}\-\s.]/gu, ' ').split(/\s+/).filter(function (t) { return t.length > 0; }); }
  function runSearch(q) {
    var ts = terms(q);
    if (!ts.length) return [];
    var out = [];
    shellIndex().concat(SEARCH_INDEX).forEach(function (e) {
      var t = String(e.title || '').toLowerCase(), x = String(e.text || '').toLowerCase(), score = 0, ok = true;
      ts.forEach(function (w) {
        var iT = t.indexOf(w), iX = x.indexOf(w);
        if (iT < 0 && iX < 0) { ok = false; return; }
        if (iT >= 0) score += iT === 0 ? 6 : 4;
        if (iX >= 0) score += 1;
      });
      if (ok) out.push({ e: e, score: score });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out.map(function (r) { return r.e; });
  }
  function highlight(text, ts) {
    text = String(text == null ? '' : text);
    if (!ts.length) return esc(text);
    var re = new RegExp('(' + ts.map(escRe).join('|') + ')', 'gi');
    return text.split(re).map(function (seg, i) { return i % 2 ? '<mark>' + esc(seg) + '</mark>' : esc(seg); }).join('');
  }
  function snippet(text, ts, len) {
    text = String(text || '');
    if (text.length <= len) return text;
    var low = text.toLowerCase(), at = -1;
    for (var i = 0; i < ts.length && at < 0; i++) at = low.indexOf(ts[i]);
    var start = Math.max(0, (at < 0 ? 0 : at) - 40);
    return (start > 0 ? '…' : '') + text.slice(start, start + len) + (start + len < text.length ? '…' : '');
  }
  function openSuggest(q) {
    q = String(q || '').trim();
    if (!q) { closeSuggest(); return; }
    var ts = terms(q), res = runSearch(q), shown = res.slice(0, 6);
    sugIndex = -1;
    qInput.removeAttribute('aria-activedescendant');
    if (!shown.length) {
      suggestBox.innerHTML = '<div class="suggest__empty">' + esc(tf('search.noMatches', { q: q })) + '</div>';
    } else {
      suggestBox.innerHTML = shown.map(function (e, i) {
        return '<a class="suggest__item" role="option" id="sug-' + i + '" href="' + esc(e.href) + '" aria-selected="false"><span class="suggest__meta"><span class="kind">' + esc(e.kind || '') + '</span><span>' + highlight(e.title, ts) + '</span></span><span class="suggest__text">' + highlight(snippet(e.text, ts, 140), ts) + '</span></a>';
      }).join('') + '<a class="suggest__item suggest__all" role="option" id="sug-all" href="#/search/' + encodeURIComponent(q) + '" aria-selected="false">' + esc(tf(res.length === 1 ? 'search.seeAll1' : 'search.seeAllN', { n: res.length })) + '</a>';
    }
    suggestBox.hidden = false;
    qInput.setAttribute('aria-expanded', 'true');
  }
  function closeSuggest() {
    if (!suggestBox) return;
    suggestBox.hidden = true; sugIndex = -1;
    qInput.setAttribute('aria-expanded', 'false');
    qInput.removeAttribute('aria-activedescendant');
  }
  function moveSug(d) {
    var items = suggestBox.querySelectorAll('.suggest__item');
    if (!items.length) return;
    sugIndex = (sugIndex + d + items.length) % items.length;
    items.forEach(function (it, i) { it.setAttribute('aria-selected', String(i === sugIndex)); });
    qInput.setAttribute('aria-activedescendant', items[sugIndex].id);
    items[sugIndex].scrollIntoView({ block: 'nearest' });
  }
  qInput.addEventListener('input', function () {
    clearTimeout(sugTimer);
    sugTimer = setTimeout(function () { openSuggest(qInput.value); }, 110);
  });
  qInput.addEventListener('focus', function () { if (qInput.value.trim()) openSuggest(qInput.value); });
  qInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (suggestBox.hidden) openSuggest(qInput.value); moveSug(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSug(-1); }
    else if (e.key === 'Escape') { closeSuggest(); qInput.blur(); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      var items = suggestBox.querySelectorAll('.suggest__item');
      var target = sugIndex > -1 && items[sugIndex] ? items[sugIndex].getAttribute('href') : (qInput.value.trim() ? '#/search/' + encodeURIComponent(qInput.value.trim()) : null);
      closeSuggest();
      if (target) { if (location.hash === target) route(); else location.hash = target; qInput.blur(); }
    }
  });
  suggestBox.addEventListener('mousedown', function (e) { e.preventDefault(); });
  qInput.addEventListener('blur', function () { setTimeout(closeSuggest, 120); });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !(e.target.matches && e.target.matches('input, textarea, select'))) { e.preventDefault(); qInput.focus(); qInput.select(); }
  });

  /* ===== Views ===== */
  var VIEWS = {};
  var AFTER = {};      // optional: AFTER.myScreen = function (arg) { ...wire events after render... }
  var TITLES = { home: '' };   // key -> page title (the shell's own titles come from SHELL_TITLES)
  var SHELL_TITLES = { 'whats-new': 'nav.whatsNew', about: 'nav.about', search: 'search.title' };

  VIEWS['whats-new'] = function () {
    var unseen = {};
    unseenNews().forEach(function (e) { unseen[String(e.version)] = true; });
    var html = '<div class="wrap page news"><header class="page__head"><h1>' + esc(t('nav.whatsNew')) + '</h1><p>' + esc(t('news.intro1')) + '<span class="news__new">' + esc(t('news.new')) + '</span>' + esc(t('news.intro2')) + '</p></header>' +
      CHANGELOG.map(function (e) {
        var isNew = !!unseen[String(e.version)];
        return '<article class="news__entry' + (isNew ? ' is-new' : '') + '"><div class="news__date"><time datetime="' + esc(e.date) + '">' + esc(fmtDate(e.date)) + '</time><span class="news__ver">' + esc(tf('news.version', { v: e.version })) + '</span>' + (isNew ? '<span class="news__new">' + esc(t('news.new')) + '</span>' : '') + '</div>' +
          '<div class="news__body"><h2>' + esc(e.title) + '</h2>' + (e.summary ? '<p>' + esc(e.summary) + '</p>' : '') + '<ul>' +
          (e.items || []).map(function (it) {
            var ty = String(it.type || 'feature'), tyLabel = t('news.type.' + ty);
            if (tyLabel === 'news.type.' + ty) tyLabel = ty.charAt(0).toUpperCase() + ty.slice(1);
            return '<li><span class="news__type news__type--' + esc(ty) + '">' + esc(tyLabel) + '</span><span class="news__text">' + esc(it.text) + (it.href ? ' <a href="' + esc(it.href) + '">' + esc(t('news.open')) + '</a>' : '') + '</span></li>';
          }).join('') + '</ul></div></article>';
      }).join('') +
      '<p class="news__note">' + esc(t('news.note')) + '<a href="mailto:isaymotion@gmail.com">isaymotion@gmail.com</a>.</p></div>';
    store.set('seenNews', latestNewsVersion());   // opening the page marks everything as seen
    return html;
  };

  function segGroup(name, label, opts, cur) {   // opts: [[value, label], ...]; radios inside the shared .seg control
    return '<fieldset class="setting"><legend>' + esc(label) + '</legend><div class="seg">' + opts.map(function (o) {
      return '<label><input type="radio" name="' + esc(name) + '" value="' + esc(o[0]) + '"' + (cur === o[0] ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>';
    }).join('') + '</div></fieldset>';
  }
  VIEWS.about = function () {
    var sizes = TEXT_SIZES.map(function (z) { return [z[0], t(z[1])]; });
    return '<div class="wrap page"><header class="page__head"><h1>' + esc(t('nav.about')) + '</h1><p>' + esc(META.tagline || '') + '</p></header>' +
      '<div class="prose"><p><strong>' + esc(APP_NAME) + '</strong> · ' + esc(t('about.version')) + ' ' + esc(META.version || '') + '</p><p>' + esc(ATTRIBUTION) + '</p></div>' +
      '<h2>' + esc(t('about.settings')) + '</h2><div class="card">' +
        segGroup('lang', t('about.language'), [['en', t('about.langEn')], ['tl', t('about.langTl')]], lang) +
        segGroup('theme', t('theme.title'), [['auto', t('theme.auto')], ['light', t('theme.light')], ['dark', t('theme.dark')]], getTheme()) +
        segGroup('aboutTextSize', t('textsize.title'), sizes, String(store.get('textSize', '100'))) +
        '<div class="setting"><span class="field__l">' + esc(t('bt.banner.title')) + '</span><p class="field__h">' + esc(t('bt.banner.hint')) + '</p><p class="form__acts"><input type="file" id="banner-file" class="sr-only" accept="image/*"><label class="btn" for="banner-file" id="banner-label">' + esc(t('bt.banner.choose')) + '</label>' + (bannerSrc() ? '<button type="button" class="link-btn" id="banner-rm">' + esc(t('bt.banner.remove')) + '</button>' : '') + '</p><p class="form__status" id="banner-status" role="status"></p></div>' +
        '<label class="field setting"><span class="field__l">' + esc(t('bt.batchName')) + '</span><input type="text" name="batchName" maxlength="60" value="' + esc(batchName()) + '" placeholder="Batch 2027"><span class="field__h">' + esc(t('bt.batchNameHint')) + '</span></label>' +
        '<label class="field setting"><span class="field__l">' + esc(t('bt.day.setting')) + '</span><input type="date" name="startDate" value="' + esc(startDate()) + '"><span class="field__h">' + esc(t('bt.day.hint')) + '</span></label>' +
      '</div>' +
      '<h2>' + esc(t('about.tips')) + '</h2><div class="card"><ul class="prose" style="margin:0;padding-left:1.2em">' +
        [1, 2, 3, 4, 5].map(function (i) { return '<li>' + rich(t('about.tip' + i)) + '</li>'; }).join('') +
      '</ul></div></div>';
  };

  VIEWS.search = function (q) {
    q = String(q || '');
    var ts = terms(q), res = runSearch(q);
    var kinds = [];
    res.forEach(function (e) { var k = e.kind || ''; if (k && kinds.indexOf(k) < 0) kinds.push(k); });
    if (searchKind && kinds.indexOf(searchKind) < 0) searchKind = '';
    var shown = searchKind ? res.filter(function (e) { return e.kind === searchKind; }) : res;
    return '<div class="wrap page search-page"><header class="page__head"><h1>' + esc(t('search.title')) + '</h1><p>' +
        esc(q ? tf(shown.length === 1 ? 'search.count1' : 'search.countN', { n: shown.length, q: q }) : t('search.prompt')) + '</p></header>' +
      (kinds.length > 1 ? '<div class="filters" role="group" aria-label="' + esc(t('search.filterBy')) + '"><button type="button" class="filter" data-kind="" aria-pressed="' + (!searchKind) + '">' + esc(t('search.all')) + '</button>' +
        kinds.map(function (k) { return '<button type="button" class="filter" data-kind="' + esc(k) + '" aria-pressed="' + (searchKind === k) + '">' + esc(k) + '</button>'; }).join('') + '</div>' : '') +
      (shown.length
        ? '<div class="results">' + shown.map(function (e) {
            return '<div class="result"><a href="' + esc(e.href) + '"><span class="result__meta"><span class="kind">' + esc(e.kind || '') + '</span></span><span class="result__title">' + highlight(e.title, ts) + '</span><span class="result__text">' + highlight(snippet(e.text, ts, 220), ts) + '</span></a></div>';
          }).join('') + '</div>'
        : (q ? '<div class="empty"><h2>' + esc(t('search.noneTitle')) + '</h2><p>' + esc(t('search.noneText')) + '</p></div>' : ''))
      + '</div>';
  };
  AFTER.about = function () {
    var fi = document.getElementById('banner-file'), rm = document.getElementById('banner-rm'), st = document.getElementById('banner-status');
    if (fi) fi.addEventListener('change', function () {
      var f = fi.files && fi.files[0]; fi.value = ''; if (!f) return;
      shrinkBanner(f, function (data) { if (!data) { st.textContent = t('bt.me.photoTooBig'); return; } store.set('banner', data); route({ keepScroll: true }); var st2 = document.getElementById('banner-status'); if (st2) st2.textContent = t('bt.banner.saved'); });
    });
    if (rm) rm.addEventListener('click', function () { store.del('banner'); route({ keepScroll: true }); });
  };
  AFTER.search = function (q) { if (qInput && document.activeElement !== qInput) qInput.value = q || ''; };

  function missingView() {
    return '<div class="wrap page"><div class="empty"><h2>' + esc(t('notfound.title')) + '</h2><p>' + esc(t('notfound.text')) + '</p><p><a class="btn btn--solid" href="#/">' + esc(t('notfound.home')) + '</a></p></div></div>';
  }

  /* ===================================================================================================
     BATCH TICKLER SCREENS
     Data: one card per resident. The owner's own card lives under store 'me'; everyone else's under
     store 'batch' (an array). Cards travel between phones as small JSON files (Share cards screen).
     Card = { id, name, nickname, hometown, medSchool, hobbies, shows, movies, cartoons, anime, games, music, food, funFact,
              phone, email, bmonth (1-12|0), bday (1-31|0), byear (number|0), photo (data:image/jpeg… | ''), updated (ISO) }
     =================================================================================================== */
  var FIELDS = window.CARD_FIELDS || [];
  var GROUPS = window.CARD_GROUPS || ['basics'];
  var SUBS = window.CARD_SUBS || {};
  var COMMON = window.COMMON_FIELDS || { exact: [], items: [] };
  var MAX_CUSTOM = 12, PLAYLIST_MAX = window.PLAYLIST_MAX || 5;
  var GUESS_FIELDS = window.GUESS_FIELDS || [];
  var HOSP = window.HOSPITAL || {};
  var CARD_APP = 'batchtickler', MAX_PHOTO = 320, MAX_TEXT = 600;
  var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  ICONS.tag = '<path d="M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5l8 8-9 9z"/><circle cx="8" cy="8" r="1.2"/>';
  ICONS.pin = '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>';
  ICONS.school = '<path d="M2.5 9.5L12 5l9.5 4.5L12 14zM6 11.5v5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-5M21 10v5"/>';
  ICONS.heart = '<path d="M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z"/>';
  ICONS.tv = '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M8 21h8M9 3l3 3 3-3"/>';
  ICONS.film = '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M7.5 4v16M16.5 4v16M3.5 9h4M3.5 15h4M16.5 9h4M16.5 15h4"/>';
  ICONS.music = '<path d="M9 18.5V6l11-2v12.5"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="16.5" r="2.5"/>';
  ICONS.food = '<path d="M5 3v8a3 3 0 0 0 3 3v7M8 3v6M11 3v6M11 11a3 3 0 0 1-3 3M17 21v-7c2 0 3-2.5 3-6s-1-5-3-5z"/>';
  ICONS.chat = '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 10.5h8"/>';
  ICONS.game = '<rect x="2.5" y="7" width="19" height="11" rx="4"/><path d="M7 10.5v4M5 12.5h4M15.5 11.5h.01M18 13.5h.01"/>';
  ICONS.spark = '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>';
  ICONS.phone = '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>';
  ICONS.mail = '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>';
  ICONS.cake = '<path d="M4 20h16M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 16c1.5 1.5 3 1.5 4.5 0s3 1.5 4.5 0 3 1.5 4.5 0M12 12V9M12 5.5a1.5 1.5 0 0 0 0 3 1.5 1.5 0 0 0 0-3z"/>';
  ICONS.share = '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/>';
  ICONS.print = '<path d="M7 8V3.5h10V8M7 17H4.5a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H17"/><rect x="7" y="14" width="10" height="6.5" rx="1"/>';
  ICONS.card = '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2.2"/><path d="M5.5 16.5a3.5 3.5 0 0 1 7 0M14.5 10h4M14.5 13.5h4"/>';
  ICONS.quiz = '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17v.3"/>';

  /* ---- Card store ---- */
  function newId() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function cleanText(v, max) { return String(v == null ? '' : v).replace(/\s+\n/g, '\n').trim().slice(0, max || MAX_TEXT); }
  function toInt(v, lo, hi) { var n = parseInt(v, 10); return isFinite(n) && n >= lo && n <= hi ? n : 0; }
  function okPhoto(p) { return typeof p === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p) && p.length < 400000; }
  function sanitizeCard(c) {   // accept only known fields with safe values; returns null if unusable
    if (!c || typeof c !== 'object') return null;
    var out = { id: String(c.id || '').replace(/[^\w-]/g, '').slice(0, 40), name: cleanText(c.name, 80) };
    if (!out.id || !out.name) return null;
    FIELDS.forEach(function (f) {
      if (f.type === 'year') { var y = toInt(c[f.key], 1950, 2100); out[f.key] = y ? String(y) : ''; }
      else if (f.type === 'url') out[f.key] = cleanLink(c[f.key]);
      else if (f.type === 'month') { var mm = /^(\d{4})-(\d{2})$/.exec(cleanText(c[f.key], 7)); out[f.key] = mm && +mm[2] >= 1 && +mm[2] <= 12 && +mm[1] >= 1990 && +mm[1] <= 2100 ? mm[0] : ''; }
      else out[f.key] = cleanText(c[f.key], f.type === 'textarea' ? MAX_TEXT : 120);
    });
    out.playlists = (Array.isArray(c.playlists) ? c.playlists : []).map(function (x) {
      return x && typeof x === 'object' ? { label: cleanText(x.label, 60), url: spotifyUrl(x.url) } : null;
    }).filter(function (x) { return x && x.url; }).slice(0, PLAYLIST_MAX);
    out.custom = (Array.isArray(c.custom) ? c.custom : []).map(function (x) {
      return x && typeof x === 'object' ? { label: cleanText(x.label, 60), value: cleanText(x.value, MAX_TEXT) } : null;
    }).filter(function (x) { return x && x.label && x.value; }).slice(0, MAX_CUSTOM);
    out.bmonth = toInt(c.bmonth, 1, 12); out.bday = toInt(c.bday, 1, 31); out.byear = toInt(c.byear, 1900, 2100);
    if (!out.bmonth || !out.bday || !validDay(out.bmonth, out.bday, out.byear)) { out.bmonth = 0; out.bday = 0; out.byear = 0; }
    out.photo = okPhoto(c.photo) ? c.photo : '';
    out.updated = typeof c.updated === 'string' && !isNaN(new Date(c.updated).getTime()) ? c.updated : new Date(0).toISOString();
    return out;
  }
  function cleanLink(v) {   // a full http(s) URL, or a bare handle (letters, digits, . _ -); anything else is dropped
    v = cleanText(v, 200);
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return /^https?:\/\/[\w.-]+(\/[^\s<>"']*)?$/i.test(v) ? v : '';
    v = v.replace(/^@/, '');
    return /^[\w.-]{1,60}$/.test(v) ? v : '';
  }
  function linkHref(f, v) { return /^https?:\/\//i.test(v) ? v : (f.base || '') + encodeURIComponent(v); }
  function linkText(v) { return /^https?:\/\//i.test(v) ? v.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '') : '@' + v; }
  function spotifyUrl(v) { v = cleanText(v, 300); return /^https:\/\/(open\.spotify\.com|spotify\.link)\/[^\s<>"']+$/i.test(v) ? v : ''; }
  /* Zodiac from the birthday: Western sign by month/day, Chinese animal by year (year boundary approximated at 1 Jan) */
  var SIGNS = [[1, 20, 'Capricorn'], [2, 19, 'Aquarius'], [3, 21, 'Pisces'], [4, 20, 'Aries'], [5, 21, 'Taurus'], [6, 21, 'Gemini'], [7, 23, 'Cancer'], [8, 23, 'Leo'], [9, 23, 'Virgo'], [10, 23, 'Libra'], [11, 22, 'Scorpio'], [12, 22, 'Sagittarius'], [12, 32, 'Capricorn']];
  var ANIMALS = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
  function zodiac(c) { if (!c.bmonth) return ''; for (var i = 0; i < SIGNS.length; i++) if (c.bmonth < SIGNS[i][0] || (c.bmonth === SIGNS[i][0] && c.bday < SIGNS[i][1])) return SIGNS[i][2]; return ''; }
  function chineseZodiac(c) { return c.byear ? ANIMALS[((c.byear % 12) + 12) % 12] : ''; }
  function validDay(m, d, y) { var dim = [31, y && isLeap(y) || !y ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; return d >= 1 && d <= dim[m - 1]; }
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function getMe() { return sanitizeCard(store.get('me', null)); }
  function getOthers() { var a = store.get('batch', []); return (Array.isArray(a) ? a : []).map(sanitizeCard).filter(Boolean); }
  function saveOthers(list) { store.set('batch', list); rebuildIndex(); }
  function people() {   // everyone, me included, sorted by name
    var me = getMe(), list = getOthers().filter(function (o) { return !me || o.id !== me.id; });
    if (me) list.push(me);
    return list.sort(byName);
  }
  function byName(a, b) { return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }); }
  function findPerson(id) { var l = people(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function isMe(c) { var me = getMe(); return !!(me && c && me.id === c.id); }
  function initials(name) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(''); }
  function monthName(m) { if (lang === 'tl') { var d = new Date(2000, m - 1, 1); try { return d.toLocaleDateString('fil', { month: 'long' }); } catch (e) {} } return MONTHS_EN[m - 1] || ''; }
  function bdayText(c, withYear) { if (!c.bmonth) return ''; return monthName(c.bmonth) + ' ' + c.bday + (withYear && c.byear ? ', ' + c.byear : ''); }
  function daysUntil(c, today) {   // days from today to the next occurrence of the birthday (0 = today)
    if (!c.bmonth) return null;
    var t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var next = new Date(today.getFullYear(), c.bmonth - 1, Math.min(c.bday, c.bmonth === 2 && c.bday === 29 && !isLeap(today.getFullYear()) ? 28 : c.bday));
    if (next < t0) next = new Date(today.getFullYear() + 1, c.bmonth - 1, c.bmonth === 2 && c.bday === 29 && !isLeap(today.getFullYear() + 1) ? 28 : c.bday);
    return Math.round((next - t0) / 86400000);
  }
  function ageOn(c, year) { return c.byear ? year - c.byear : 0; }
  function rebuildIndex() {
    SEARCH_INDEX.length = 0;
    people().forEach(function (c) {
      var text = FIELDS.filter(function (f) { return f.print; }).map(function (f) { return c[f.key]; }).concat(c.custom.map(function (x) { return x.label + ' ' + x.value; }), c.playlists.map(function (x) { return x.label; })).filter(Boolean).join(' · ');
      SEARCH_INDEX.push({ title: c.name + (c.nickname ? ' (' + c.nickname + ')' : ''), text: text || bdayText(c), href: '#/person/' + encodeURIComponent(c.id), kind: t('nav.batch') });
    });
    [['nav.me', '#/me', 'bt.me.intro'], ['nav.birthdays', '#/birthdays', 'bt.bd.intro'], ['nav.share', '#/share', 'bt.share.intro'], ['nav.print', '#/print', 'bt.print.intro'], ['nav.guess', '#/guess', 'bt.guess.intro'], ['nav.scan', '#/scan', 'bt.scan.intro'], ['nav.stats', '#/stats', 'bt.stats.intro'], ['nav.map', '#/map', 'bt.map.intro'], ['nav.whosaid', '#/whosaid', 'bt.ws.intro'], ['nav.bingo', '#/bingo', 'bt.bingo.intro'], ['nav.icebreakers', '#/icebreakers', 'bt.ice.intro'], ['nav.wrapped', '#/wrapped', 'bt.wrap.intro']].forEach(function (s) {
      SEARCH_INDEX.push({ title: t(s[0]), text: t(s[2]), href: s[1], kind: t('nav.screens') });
    });
  }

  /* ---- Shared bits of markup ---- */
  function avatar(c, cls) {
    return c.photo ? '<img class="avatar ' + (cls || '') + '" src="' + esc(c.photo) + '" alt="" loading="lazy">'
                   : '<span class="avatar avatar--txt ' + (cls || '') + '" aria-hidden="true">' + esc(initials(c.name)) + '</span>';
  }
  function fieldLabel(key) { return t('bt.f.' + key); }
  function groupLabel(g) { return t('bt.g.' + g); }
  function subLabel(sb) { return t('bt.s.' + sb); }
  function subChunks(g) {   // [{sub, fields}] in display order; a group without subs is one chunk with sub null
    var fs = FIELDS.filter(function (f) { return f.group === g; }), subs = SUBS[g];
    if (!subs) return [{ sub: null, fields: fs }];
    return subs.map(function (sb) { return { sub: sb, fields: fs.filter(function (f) { return f.sub === sb; }) }; }).concat([{ sub: null, fields: fs.filter(function (f) { return !f.sub || subs.indexOf(f.sub) < 0; }) }]).filter(function (ch) { return ch.fields.length; });
  }
  function batchName() { return cleanText(store.get('batchName', ''), 60); }
  function completeness(c) {   // filled / total over the standard fields + photo + birthday
    var fs = FIELDS.filter(function (f) { return f.print; }), n = 0;
    fs.forEach(function (f) { if (c[f.key]) n++; });
    if (c.photo) n++; if (c.bmonth) n++; if (c.playlists.length) n++;
    return { n: n, total: fs.length + 3 };
  }
  function items(v) {   // "a, b\nc · d" -> ['a','b','c','d'] (original casing), short tokens dropped
    return String(v || '').split(/[,\n;·\/|]+/).map(function (x) { return x.replace(/\s+/g, ' ').trim(); }).filter(function (x) { return x.length > 2; });
  }
  function inCommon(a, b) {
    var out = [];
    COMMON.exact.forEach(function (k) { if (a[k] && b[k] && a[k].toLowerCase() === b[k].toLowerCase()) out.push(tf('bt.common.same', { field: fieldLabel(k).toLowerCase(), value: a[k] })); });
    COMMON.items.forEach(function (k) {
      var ia = items(a[k]), ib = items(b[k]).map(function (x) { return x.toLowerCase(); }), hit = ia.filter(function (x) { return ib.indexOf(x.toLowerCase()) >= 0; });
      if (hit.length) out.push(tf('bt.common.shared', { field: fieldLabel(k).toLowerCase(), value: hit.join(', ') }));
    });
    return out;
  }
  function fmtMonth(v) { var m = /^(\d{4})-(\d{2})$/.exec(String(v)); return m ? monthName(+m[2]) + ' ' + m[1] : String(v); }
  function factRow(ico, k, v, extra) { return '<div class="fact">' + icon(ico, 'fact__ico') + '<div><div class="fact__k">' + esc(k) + (extra || '') + '</div><div class="fact__v">' + esc(v).replace(/\n/g, '<br>') + '</div></div></div>'; }
  function personCard(c, today) {
    var d = daysUntil(c, today), soon = d !== null && d <= 14;
    return '<a class="card pcard" href="#/person/' + encodeURIComponent(c.id) + '">' + avatar(c) +
      '<span class="pcard__body"><span class="pcard__name">' + esc(c.name) + (isMe(c) ? ' <span class="badge">' + esc(t('bt.batch.you')) + '</span>' : '') + '</span>' +
      (c.nickname ? '<span class="pcard__nick">“' + esc(c.nickname) + '”</span>' : '') +
      (c.hometown ? '<span class="pcard__meta">' + icon('pin', 'pcard__ico') + esc(c.hometown) + '</span>' : '') +
      (c.bmonth ? '<span class="pcard__meta' + (soon ? ' is-soon' : '') + '">' + icon('cake', 'pcard__ico') + esc(bdayText(c)) + (d === 0 ? ' · ' + esc(t('bt.home.today')) : '') + '</span>' : '') +
      '</span></a>';
  }
  function crumb(label) { return '<p class="crumb"><a href="#/">' + esc(t('nav.home')) + '</a> / ' + esc(label) + '</p>'; }

  /* ---- Today's picks (1.10.0): same pick on every phone with the same batch, changes at local midnight ---- */
  var pickOff = { pl: 0, fact: 0 };   // "Another" taps; session only, reset on a new day
  var pickDay = 0;
  function dayNum(d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  function dayHash(n, salt) { var h = (n * 2654435761 + salt * 40503) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return h >>> 0; }
  function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; }
  function todaysPicks(all, today) {
    var dn = dayNum(today);
    if (dn !== pickDay) { pickDay = dn; pickOff.pl = 0; pickOff.fact = 0; }
    var pls = [];
    all.forEach(function (c) { c.playlists.forEach(function (pl) { pls.push({ c: c, pl: pl }); }); });
    pls.sort(function (a, b) { return byName(a.c, b.c) || (a.pl.url < b.pl.url ? -1 : a.pl.url > b.pl.url ? 1 : 0); });
    var need = all.length > 1 ? 2 : 1;
    var facts = (window.GUESS_FIELDS || []).filter(function (k) { return all.filter(function (c) { return c[k] && String(c[k]).trim(); }).length >= need; });
    var pl = pls.length ? pls[(dayHash(dn, 1) + pickOff.pl) % pls.length] : null;
    var fk = facts.length ? facts[(dayHash(dn, 2) + pickOff.fact) % facts.length] : null;
    return { pl: pl, plN: pls.length, fk: fk, factN: facts.length };
  }
  function todayHTML(all, today) {
    var tp = todaysPicks(all, today), out = '';
    if (tp.pl) {
      var c = tp.pl.c;
      out += '<section class="card today" aria-labelledby="today-pl-h"><p class="today__k">' + icon('music', 'today__ico') + '<span id="today-pl-h">' + esc(t('bt.today.pl')) + '</span></p>' +
        '<div class="today__pl"><a href="#/person/' + encodeURIComponent(c.id) + '">' + avatar(c, 'avatar--sm') + '</a><div><h3>' + esc(tp.pl.pl.label || t('bt.f.playlists')) + '</h3><p class="muted">' + esc(tf('bt.today.by', { name: c.preferredName || c.nickname || c.name })) + '</p></div></div>' +
        '<p class="today__acts"><a class="btn btn--solid" href="' + esc(tp.pl.pl.url) + '" target="_blank" rel="noopener">' + esc(t('bt.pl.open')) + '</a>' +
        (tp.plN > 1 ? '<button type="button" class="btn" data-another="pl">' + esc(t('bt.today.another')) + '</button>' : '') + '</p></section>';
    }
    if (tp.fk) {
      var f = FIELDS.filter(function (x) { return x.key === tp.fk; })[0] || { icon: 'star' };
      var who = all.filter(function (c) { return c[tp.fk] && String(c[tp.fk]).trim(); });
      out += '<section class="card today" aria-labelledby="today-fact-h"><p class="today__k">' + icon('star', 'today__ico') + '<span id="today-fact-h">' + esc(t('bt.today.fact')) + '</span></p>' +
        '<h3 class="today__q">' + icon(f.icon, 'fact__ico') + esc(fieldLabel(tp.fk)) + '</h3><ul class="today__list">' +
        who.map(function (c) { return '<li><a href="#/person/' + encodeURIComponent(c.id) + '">' + avatar(c, 'avatar--sm') + '<span><strong>' + esc(c.preferredName || c.nickname || c.name) + '</strong><span class="today__a">' + esc(clip(c[tp.fk], 140)) + '</span></span></a></li>'; }).join('') +
        '</ul><p class="today__acts">' + (all.length > 1 ? '<a class="btn btn--solid" href="#/whosaid/' + encodeURIComponent(tp.fk) + '">' + esc(t('nav.whosaid')) + '</a>' : '') + (tp.factN > 1 ? '<button type="button" class="btn" data-another="fact">' + esc(t('bt.today.another')) + '</button>' : '') + '</p></section>';
    }
    out += spotlightHTML(all, today);
    return out ? '<h2 class="home__h">' + esc(t('bt.today.h')) + '</h2><div class="today-grid">' + out + '</div>' : '';
  }
  AFTER.home = function () {
    main.querySelectorAll('[data-greet]').forEach(function (b) { b.addEventListener('click', function () { var c = findPerson(b.getAttribute('data-greet')); if (c) greet(c, document.getElementById('greet-status')); }); });
    main.querySelectorAll('[data-another]').forEach(function (b) {
      b.addEventListener('click', function () { var k = b.getAttribute('data-another'); pickOff[k]++; route({ keepScroll: true }); var nb = main.querySelector('[data-another="' + k + '"]'); if (nb) nb.focus({ preventScroll: true }); });
    });
  };

  /* ---- Home (overrides the starter hero with the batch banner) ---- */
  VIEWS.home = function () {
    var me = getMe(), all = people(), today = new Date(), latest = CHANGELOG[0];
    var tiles = NAV.filter(function (n) { return n.tile !== false && n.href !== '#/'; });
    var next = all.filter(function (c) { return c.bmonth; }).map(function (c) { return { c: c, d: daysUntil(c, today) }; }).sort(function (a, b) { return a.d - b.d; })[0];
    return '<section class="hero hero--banner">' + (bannerSrc() ? '<img class="hero__img hero__img--custom" src="' + esc(bannerSrc()) + '" alt="">' : '<img class="hero__img" src="img/banner.jpg" srcset="img/banner-small.jpg 704w, img/banner.jpg 1408w" sizes="100vw" alt="" width="1408" height="768">') +
      '<div class="wrap hero__inner">' + (batchName() ? '<p class="hero__kicker">' + esc(batchName()) + '</p>' : '') + '<h1>' + esc(APP_NAME) + '</h1>' +
        '<p class="hero__lead">' + esc(META.tagline || '') + ' · ' + esc(HOSP.program || '') + '</p>' +
        '<p><a class="btn btn--solid" href="' + (me ? '#/batch' : '#/me') + '">' + esc(t(me ? 'bt.hero.ctaDone' : 'bt.hero.cta')) + '</a></p>' +
      '</div></section>' +
      '<div class="wrap home">' + birthdayBanner(all, today) +
        '<div class="home__stats">' +
          '<div class="card stat"><span class="stat__n">' + all.length + '</span><span class="stat__t">' + esc(tf(all.length === 1 ? 'bt.home.count1' : 'bt.home.countN', { n: all.length }).replace(/^\d+\s*/, '')) + '</span>' + (!me ? '<a class="link-btn" href="#/me">' + esc(t('bt.home.noMe')) + '</a>' : '') + '</div>' +
          (next ? '<a class="card stat stat--link" href="#/person/' + encodeURIComponent(next.c.id) + '">' + icon('cake', 'stat__ico') + '<span class="stat__t">' + esc(t('bt.home.nextBirthday')) + '</span><span class="stat__name">' + esc(next.c.name) + '</span><span class="stat__sub">' + esc(bdayText(next.c)) + ' · ' + esc(next.d === 0 ? t('bt.home.today') : next.d === 1 ? t('bt.home.inDays1') : tf('bt.home.inDaysN', { n: next.d })) + '</span></a>' : '') + residencyStat(today) +
        '</div>' + todayHTML(all, today) +
        '<h2 class="home__h">' + esc(t('home.explore')) + '</h2><div class="cards">' + tiles.map(function (n) {
          return '<a class="card tile" href="' + esc(n.href) + '">' + icon(n.icon, 'tile__ico') + '<h3>' + esc(navLabel(n)) + '</h3></a>';
        }).join('') + '</div>' +
        '<a class="card news-strip" href="#/whats-new"><span class="badge" data-badge="news" hidden></span><strong>' + esc(t('nav.whatsNew')) + '</strong>' +
          (latest ? '<span class="muted">' + esc(tf('home.latest', { title: latest.title, version: latest.version })) + '</span>' : '') + '</a>' +
      '</div>';
  };

  /* ---- The batch (grid) ---- */
  var batchQ = '', batchSort = 'name';
  VIEWS.batch = function () {
    var all = people(), today = new Date(), q = batchQ.trim().toLowerCase();
    var shown = q ? all.filter(function (c) { return FIELDS.map(function (f) { return c[f.key]; }).concat([c.name]).join(' ').toLowerCase().indexOf(q) >= 0; }) : all.slice();
    if (batchSort === 'birthday') shown.sort(function (a, b) { var da = daysUntil(a, today), db = daysUntil(b, today); return (da === null ? 9e9 : da) - (db === null ? 9e9 : db) || byName(a, b); });
    else if (batchSort === 'hometown') shown.sort(function (a, b) { return (a.hometown || '￿').localeCompare(b.hometown || '￿', undefined, { sensitivity: 'base' }) || byName(a, b); });
    var sorts = [['name', 'bt.batch.sortName'], ['birthday', 'bt.batch.sortBirthday'], ['hometown', 'bt.batch.sortHometown']];
    return '<div class="wrap page">' + crumb(t('nav.batch')) +
      '<header class="page__head"><h1>' + esc(t('nav.batch')) + '</h1><p>' + esc(t('bt.batch.intro')) + '</p></header>' +
      (all.length ? '<div class="toolbar"><label class="field field--inline"><span class="sr-only">' + esc(t('bt.batch.filter')) + '</span><input type="search" id="batch-q" placeholder="' + esc(t('bt.batch.filter')) + '" value="' + esc(batchQ) + '" autocomplete="off"></label>' +
        '<div class="filters" role="group">' + sorts.map(function (s) { return '<button type="button" class="filter" data-sort="' + s[0] + '" aria-pressed="' + (batchSort === s[0]) + '">' + esc(t(s[1])) + '</button>'; }).join('') + '</div></div>' : '') +
      (!all.length ? '<div class="empty"><h2>' + esc(t('bt.batch.emptyTitle')) + '</h2><p>' + esc(t('bt.batch.emptyText')) + '</p><p><a class="btn btn--solid" href="#/me">' + esc(t('nav.me')) + '</a> <a class="btn" href="#/share">' + esc(t('bt.share.importBtn')) + '</a></p></div>'
        : shown.length ? '<div class="pgrid">' + shown.map(function (c) { return personCard(c, today); }).join('') + '</div>' : '<div class="empty"><p>' + esc(t('bt.batch.noMatch')) + '</p></div>') +
      '</div>';
  };
  AFTER.batch = function () {
    var sorts = document.querySelectorAll('.toolbar .filter[data-sort]');
    for (var i = 0; i < sorts.length; i++) sorts[i].addEventListener('click', function (e) { batchSort = e.currentTarget.getAttribute('data-sort'); route({ keepScroll: true }); });
    var q = document.getElementById('batch-q'); if (!q) return;
    var timer;
    q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { batchQ = q.value; var pos = q.selectionStart; route({ keepScroll: true }); var nq = document.getElementById('batch-q'); if (nq) { nq.focus(); try { nq.setSelectionRange(pos, pos); } catch (e) {} } }, 160); });
  };

  /* ---- One person ---- */
  VIEWS.person = function (id) {
    var c = findPerson(String(id || ''));
    if (!c) return '<div class="wrap page">' + crumb(t('nav.batch')) + '<div class="empty"><h2>' + esc(t('notfound.title')) + '</h2><p>' + esc(t('bt.person.notFound')) + '</p><p><a class="btn btn--solid" href="#/batch">' + esc(t('nav.batch')) + '</a></p></div></div>';
    var today = new Date(), d = daysUntil(c, today), me = isMe(c);
    var me0 = getMe();
    var sections = GROUPS.filter(function (g) { return g !== 'contact'; }).map(function (g) {
      var rows = subChunks(g).map(function (ch) {
        var r = ch.fields.filter(function (f) { return f.print && c[f.key] && f.key !== 'nickname'; }).map(function (f) { return factRow(f.icon, fieldLabel(f.key), f.type === 'month' ? fmtMonth(c[f.key]) : c[f.key]); }).join('');
        return r ? (ch.sub ? '<h3 class="facts__sub">' + esc(subLabel(ch.sub)) + '</h3>' : '') + r : '';
      }).join('');
      return rows ? '<h2>' + esc(groupLabel(g)) + '</h2><div class="card facts">' + rows + '</div>' : '';
    }).join('');
    if (c.custom.length) sections += '<h2>' + esc(groupLabel('custom')) + '</h2><div class="card facts">' + c.custom.map(function (x) { return factRow('spark', x.label, x.value); }).join('') + '</div>';
    var common = '';
    if (me0 && !me) {
      var hits = inCommon(me0, c);
      common = '<h2>' + esc(t('bt.common.title')) + '</h2><div class="card common">' + (hits.length ? '<ul>' + hits.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '<p class="muted">' + esc(t('bt.common.none')) + '</p>') + '</div>';
    }
    var contact = '';
    var cfields = FIELDS.filter(function (f) { return f.group === 'contact' && c[f.key]; });
    if (cfields.length) {
      var tel = c.phone.replace(/[^\d+]/g, '');
      contact = '<h2>' + esc(groupLabel('contact')) + '</h2><div class="card facts">' + cfields.map(function (f) {
        var num = String(c[f.key]).replace(/[^\d+]/g, '');
        var acts = f.type === 'tel' && f.key !== 'gcash' && num ? '<p class="contact__acts"><a class="btn" href="tel:' + esc(num) + '">' + esc(t('bt.person.call')) + '</a> <a class="btn" href="sms:' + esc(num) + '">' + esc(t('bt.person.text')) + '</a></p>'
                 : f.type === 'email' ? '<p class="contact__acts"><a class="btn" href="mailto:' + esc(c[f.key]) + '">' + esc(t('bt.person.mail')) + '</a></p>' : '';
        var val = f.type === 'url' ? '<a href="' + esc(linkHref(f, c[f.key])) + '" target="_blank" rel="noopener">' + esc(linkText(c[f.key])) + '</a>' : f.type === 'month' ? esc(fmtMonth(c[f.key])) : esc(c[f.key]).replace(/\n/g, '<br>');
        return '<div class="fact">' + icon(f.icon, 'fact__ico') + '<div><div class="fact__k">' + esc(fieldLabel(f.key)) + '</div><div class="fact__v">' + val + '</div>' + acts + '</div></div>';
      }).join('') + '</div>';
    }
    if (c.playlists.length) {
      contact = '<h2>' + esc(t('bt.f.playlists')) + '</h2><div class="card facts">' + c.playlists.map(function (pl) {
        return '<div class="fact">' + icon('music', 'fact__ico') + '<div><div class="fact__v"><strong>' + esc(pl.label || t('bt.f.playlists')) + '</strong></div><p class="contact__acts"><a class="btn" href="' + esc(pl.url) + '" target="_blank" rel="noopener">' + esc(t('bt.pl.open')) + '</a></p></div></div>';
      }).join('') + '</div>' + contact;
    }
    var comp = completeness(c);
    return '<div class="wrap page person">' + crumb(t('nav.batch')) +
      '<header class="person__head">' + avatar(c, 'avatar--lg') + '<div><h1>' + esc(c.name) + '</h1>' +
        (c.nickname ? '<p class="person__nick">“' + esc(c.nickname) + '”</p>' : '') +
        (c.bmonth ? '<p class="person__bday">' + icon('cake', 'fact__ico') + esc(t('bt.person.birthday')) + ': ' + esc(bdayText(c, true)) + (d === 0 ? ' · <strong>' + esc(t('bt.home.today')) + '</strong>' : d !== null && d <= 30 ? ' · ' + esc(d === 1 ? t('bt.home.inDays1') : tf('bt.home.inDaysN', { n: d })) : '') + (c.byear && d !== null && d <= 30 ? ' (' + esc(tf('bt.person.turns', { n: ageOn(c, today.getFullYear() + (d && today.getMonth() + 1 > c.bmonth ? 1 : 0)) })) + ')' : '') + ' <button type="button" class="link-btn" id="cal-one">' + esc(t('bt.cal.one')) + '</button></p><p class="muted person__zodiac">' + esc(t('bt.zodiac')) + ': ' + esc(zodiac(c)) + (chineseZodiac(c) ? ' · ' + esc(t('bt.zodiac.cn')) + ': ' + esc(chineseZodiac(c)) : '') + '</p><p class="form__status" id="cal-status" role="status"></p>' : '') +
        (c.preferredName ? '<p class="muted">' + esc(fieldLabel('preferredName')) + ': ' + esc(c.preferredName) + (c.pronouns ? ' · ' + esc(c.pronouns) : '') + '</p>' : (c.pronouns ? '<p class="muted">' + esc(c.pronouns) + '</p>' : '')) +
        (me ? '<p><a class="btn btn--solid" href="#/me">' + esc(t('bt.person.edit')) + '</a> <span class="muted">' + esc(tf('bt.me.complete', comp)) + '</span></p>' : '') +
      '</div></header>' + common + sections + contact +
      '<p class="person__foot muted">' + esc(tf('bt.person.updated', { date: bkDate(c.updated) || '—' })) + (me ? '' : ' · <button type="button" class="link-btn" id="rm-person" data-id="' + esc(c.id) + '">' + esc(t('bt.person.remove')) + '</button>') + '</p></div>';
  };
  AFTER.person = function (id) {
    var cal = document.getElementById('cal-one');
    if (cal) cal.addEventListener('click', function () { var c = findPerson(String(id || '')); if (!c) return; icsOut([c], 'birthday-' + slug(c.name) + '.ics', function (m) { var st = document.getElementById('cal-status'); if (st) st.textContent = m; }); });
    var b = document.getElementById('rm-person'); if (!b) return;
    b.addEventListener('click', function () {
      var c = findPerson(b.getAttribute('data-id')); if (!c) return;
      if (!window.confirm(tf('bt.person.confirmRemove', { name: c.name }))) return;
      saveOthers(getOthers().filter(function (o) { return o.id !== c.id; }));
      location.hash = '#/batch';
    });
  };

  /* ---- My card (edit) ---- */
  var pendingPhoto = null;   // data URL chosen but not yet saved; null = unchanged, '' = removed
  function sel(name, label, opts, cur) {
    return '<label class="field field--sm"><span class="field__l">' + esc(label) + '</span><select name="' + name + '"><option value="0">' + esc(t('bt.me.none')) + '</option>' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(cur) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>';
  }
  function customRow(label, value) {
    return '<div class="custom-row"><label class="field field--sm"><span class="field__l">' + esc(t('bt.custom.label')) + '</span><input type="text" name="customLabel" maxlength="60" value="' + esc(label || '') + '"></label><label class="field"><span class="field__l">' + esc(t('bt.custom.value')) + '</span><input type="text" name="customValue" maxlength="300" value="' + esc(value || '') + '"></label><button type="button" class="link-btn custom-rm">' + esc(t('bt.custom.remove')) + '</button></div>';
  }
  function playlistRow(label, url) {
    return '<div class="custom-row"><label class="field field--sm"><span class="field__l">' + esc(t('bt.pl.label')) + '</span><input type="text" name="plLabel" maxlength="60" value="' + esc(label || '') + '"></label><label class="field"><span class="field__l">' + esc(t('bt.pl.url')) + '</span><input type="text" name="plUrl" inputmode="url" autocapitalize="off" autocomplete="off" spellcheck="false" maxlength="300" placeholder="https://open.spotify.com/playlist/…" value="' + esc(url || '') + '"></label><button type="button" class="link-btn custom-rm">' + esc(t('bt.custom.remove')) + '</button></div>';
  }
  VIEWS.me = function () {
    var me = getMe() || { id: '', name: '', bmonth: 0, bday: 0, byear: 0, photo: '', custom: [], playlists: [] };
    var comp = completeness(me);
    pendingPhoto = null;
    var months = MONTHS_EN.map(function (m, i) { return [i + 1, monthName(i + 1)]; });
    var days = []; for (var i = 1; i <= 31; i++) days.push([i, String(i)]);
    var photoSrc = me.photo;
    return '<div class="wrap page me">' + crumb(t('nav.me')) +
      '<header class="page__head"><h1>' + esc(t('bt.me.title')) + '</h1><p>' + esc(t('bt.me.intro')) + '</p></header>' +
      '<form id="me-form" class="card form" novalidate>' +
        '<div class="form__photo"><div id="me-avatar">' + (photoSrc ? '<img class="avatar avatar--lg" src="' + esc(photoSrc) + '" alt="">' : '<span class="avatar avatar--lg avatar--txt" aria-hidden="true">' + esc(initials(me.name || '?')) + '</span>') + '</div>' +
          '<div><span class="field__l">' + esc(t('bt.me.photo')) + '</span><p class="field__h">' + esc(t('bt.me.photoHint')) + '</p>' +
          '<input type="file" id="me-photo" class="sr-only" accept="image/*"><label class="btn" for="me-photo" id="me-photo-label">' + esc(t('bt.me.choosePhoto')) + '</label> ' +
          '<button type="button" class="link-btn" id="me-photo-rm"' + (photoSrc ? '' : ' hidden') + '>' + esc(t('bt.me.removePhoto')) + '</button></div></div>' +
        '<label class="field"><span class="field__l">' + esc(t('bt.me.name')) + ' *</span><input name="name" type="text" required maxlength="80" autocomplete="name" value="' + esc(me.name) + '"><span class="field__h">' + esc(t('bt.me.nameHint')) + '</span></label>' +
        '<fieldset class="field fieldset"><legend class="field__l">' + esc(t('bt.me.birthday')) + ' *</legend><div class="field__row">' +
          sel('bmonth', t('bt.me.month'), months, me.bmonth) + sel('bday', t('bt.me.day'), days, me.bday) +
          '<label class="field field--sm"><span class="field__l">' + esc(t('bt.me.year')) + ' *</span><input name="byear" type="number" inputmode="numeric" min="1900" max="2100" placeholder="1998" value="' + (me.byear || '') + '"></label>' +
        '</div></fieldset>' +
        '<p class="form__note"><span class="meter__bar" style="display:block;margin-bottom:6px"><span style="width:' + Math.round(100 * comp.n / comp.total) + '%"></span></span>' + esc(tf('bt.me.complete', comp)) + ' · ' + esc(t('bt.me.completeHint')) + ' <button type="button" class="link-btn" id="me-toggle-all" data-open="1">' + esc(t('bt.me.collapseAll')) + '</button></p>' +
        GROUPS.map(function (g, gi) {
          return '<details class="fgroup"' + (gi === 0 ? ' open' : '') + '><summary><span>' + esc(groupLabel(g)) + '</span><span class="muted fgroup__n" data-group="' + g + '"></span></summary><div class="fgroup__body">' +
            (g === 'contact' ? '<p class="field__h">' + esc(t('bt.f.contactNote')) + '</p>' : '') +
            subChunks(g).map(function (ch) { return (ch.sub ? '<h3 class="fgroup__sub">' + esc(subLabel(ch.sub)) + '</h3>' : '') + ch.fields.map(function (f) {
              var v = me[f.key] || '';
              var ctl = f.type === 'textarea' ? '<textarea name="' + f.key + '" rows="2" maxlength="' + MAX_TEXT + '">' + esc(v) + '</textarea>'
                      : f.type === 'year' ? '<input name="' + f.key + '" type="number" inputmode="numeric" min="1950" max="2100" value="' + esc(v) + '">'
                      : f.type === 'month' ? '<input name="' + f.key + '" type="month" min="1990-01" max="2100-12" value="' + esc(v) + '">'
                      : f.type === 'url' ? '<input name="' + f.key + '" type="text" inputmode="url" autocapitalize="off" autocomplete="off" spellcheck="false" maxlength="200" placeholder="' + esc(t('bt.f.urlHint')) + '" value="' + esc(v) + '">'
                      : '<input name="' + f.key + '" type="' + f.type + '" maxlength="120"' + (f.type === 'tel' ? ' inputmode="tel" autocomplete="tel"' : f.type === 'email' ? ' autocomplete="email"' : '') + ' value="' + esc(v) + '">';
              return '<label class="field"><span class="field__l">' + esc(fieldLabel(f.key)) + (f.print ? '' : ' <em class="field__tag">' + esc(t('bt.f.inAppOnly')) + '</em>') + '</span>' + ctl + (t('bt.h.' + f.key) !== 'bt.h.' + f.key ? '<span class="field__h">' + esc(t('bt.h.' + f.key)) + '</span>' : '') + '</label>';
            }).join(''); }).join('') + '</div></details>';
        }).join('') +
        '<details class="fgroup"><summary><span>' + esc(t('bt.f.playlists')) + '</span><span class="muted fgroup__n" data-group="playlists"></span></summary><div class="fgroup__body"><p class="field__h">' + esc(tf('bt.pl.hint', { n: PLAYLIST_MAX })) + '</p><div id="pl-rows">' +
          (me.playlists || []).map(function (x) { return playlistRow(x.label, x.url); }).join('') +
        '</div><p><button type="button" class="btn" id="pl-add">' + esc(t('bt.pl.add')) + '</button></p></div></details>' +
        '<details class="fgroup"><summary><span>' + esc(t('bt.custom.title')) + '</span><span class="muted fgroup__n" data-group="custom"></span></summary><div class="fgroup__body"><p class="field__h">' + esc(t('bt.custom.hint')) + '</p><div id="custom-rows">' +
          (me.custom || []).map(function (x) { return customRow(x.label, x.value); }).join('') +
        '</div><p><button type="button" class="btn" id="custom-add">' + esc(t('bt.custom.add')) + '</button></p></div></details>' +
        '<p class="form__status" id="me-status" role="status" aria-live="polite"></p>' +
        '<div class="form__acts"><button type="submit" class="btn btn--solid">' + esc(t('bt.me.save')) + '</button>' + (me.id ? '<a class="btn" href="#/person/' + encodeURIComponent(me.id) + '">' + esc(t('nav.me')) + ' →</a><button type="button" class="link-btn" id="me-clear">' + esc(t('bt.me.clear')) + '</button>' : '') + '</div>' +
      '</form></div>';
  };
  function shrinkPhoto(file, cb) {
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      try {
        var s = Math.min(img.width, img.height), k = Math.min(1, MAX_PHOTO / s), w = Math.round(s * k);
        var cv = document.createElement('canvas'); cv.width = w; cv.height = w;
        var cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, w, w);
        cx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, w, w);   // centre-square crop
        var out = cv.toDataURL('image/jpeg', 0.82);
        URL.revokeObjectURL(url); cb(okPhoto(out) ? out : null);
      } catch (e) { URL.revokeObjectURL(url); cb(null); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); cb(null); };
    img.src = url;
  }
  AFTER.me = function () {
    var form = document.getElementById('me-form'), status = document.getElementById('me-status');
    var fi = document.getElementById('me-photo'), rm = document.getElementById('me-photo-rm'), av = document.getElementById('me-avatar');
    function say(m, err) { status.textContent = m; status.classList.toggle('is-error', !!err); }
    fi.addEventListener('change', function () {
      var f = fi.files && fi.files[0]; fi.value = ''; if (!f) return;
      shrinkPhoto(f, function (data) {
        if (!data) { say(t('bt.me.photoTooBig'), true); return; }
        pendingPhoto = data; av.innerHTML = '<img class="avatar avatar--lg" src="' + esc(data) + '" alt="">'; rm.hidden = false; say('');
      });
    });
    rm.addEventListener('click', function () { pendingPhoto = ''; av.innerHTML = '<span class="avatar avatar--lg avatar--txt" aria-hidden="true">' + esc(initials(form.name.value || '?')) + '</span>'; rm.hidden = true; });
    function paintCounts() {
      GROUPS.forEach(function (g) {
        var fs = FIELDS.filter(function (f) { return f.group === g; }), n = fs.filter(function (f) { return form.elements[f.key] && form.elements[f.key].value.trim(); }).length;
        var el = form.querySelector('.fgroup__n[data-group="' + g + '"]'); if (el) el.textContent = n + '/' + fs.length;
      });
      var cel = form.querySelector('.fgroup__n[data-group="custom"]'); if (cel) cel.textContent = String(form.querySelectorAll('#custom-rows .custom-row').length);
      var pel = form.querySelector('.fgroup__n[data-group="playlists"]'); if (pel) pel.textContent = form.querySelectorAll('#pl-rows .custom-row').length + '/' + PLAYLIST_MAX;
      var addBtn = document.getElementById('pl-add'); if (addBtn) addBtn.disabled = form.querySelectorAll('#pl-rows .custom-row').length >= PLAYLIST_MAX;
    }
    paintCounts();
    form.addEventListener('input', function () { clearTimeout(form._ct); form._ct = setTimeout(paintCounts, 200); });
    var rows = document.getElementById('custom-rows');
    document.getElementById('custom-add').addEventListener('click', function () { rows.insertAdjacentHTML('beforeend', customRow('', '')); var last = rows.lastElementChild.querySelector('input'); if (last) last.focus(); paintCounts(); });
    rows.addEventListener('click', function (e) { var b = e.target.closest('.custom-rm'); if (b) { b.closest('.custom-row').remove(); paintCounts(); } });
    var plRows = document.getElementById('pl-rows');
    document.getElementById('pl-add').addEventListener('click', function () { if (plRows.querySelectorAll('.custom-row').length >= PLAYLIST_MAX) return; plRows.insertAdjacentHTML('beforeend', playlistRow('', '')); var last = plRows.lastElementChild.querySelector('input'); if (last) last.focus(); paintCounts(); });
    plRows.addEventListener('click', function (e) { var b = e.target.closest('.custom-rm'); if (b) { b.closest('.custom-row').remove(); paintCounts(); } });
    var tog = document.getElementById('me-toggle-all');
    tog.addEventListener('click', function () {
      var open = tog.getAttribute('data-open') !== '1';
      form.querySelectorAll('details.fgroup').forEach(function (d) { d.open = open; });
      tog.setAttribute('data-open', open ? '1' : '0'); tog.textContent = t(open ? 'bt.me.collapseAll' : 'bt.me.expandAll');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var old = getMe() || {}, c = { id: old.id || newId(), name: form.name.value };
      FIELDS.forEach(function (f) { c[f.key] = form.elements[f.key].value; });
      c.custom = []; c.playlists = [];
      form.querySelectorAll('#custom-rows .custom-row').forEach(function (r) { c.custom.push({ label: r.querySelector('[name=customLabel]').value, value: r.querySelector('[name=customValue]').value }); });
      var badPl = false;
      form.querySelectorAll('#pl-rows .custom-row').forEach(function (r) { var u = r.querySelector('[name=plUrl]').value.trim(); if (u && !spotifyUrl(u)) badPl = true; if (u) c.playlists.push({ label: r.querySelector('[name=plLabel]').value, url: u }); });
      if (badPl) { say(t('bt.pl.badUrl'), true); return; }
      var m = toInt(form.bmonth.value, 1, 12), d = toInt(form.bday.value, 1, 31), y = toInt(form.byear.value, 1900, 2100);
      if (!cleanText(c.name, 80)) { say(t('bt.me.needName'), true); form.name.focus(); return; }
      if (!(m && d) || !validDay(m, d, y)) { say(t('bt.me.badBirthday'), true); form.bmonth.focus(); return; }
      if (!y) { say(t('bt.me.yearRequired'), true); form.byear.focus(); return; }
      c.bmonth = m; c.bday = d; c.byear = m && d ? y : 0;
      c.photo = pendingPhoto === null ? (old.photo || '') : pendingPhoto;
      c.updated = new Date().toISOString();
      var clean = sanitizeCard(c);
      if (!clean) { say(t('bt.me.needName'), true); return; }
      store.set('me', clean); pendingPhoto = null; rebuildIndex();
      say(t('bt.me.saved'));
      setTimeout(function () { location.hash = '#/person/' + encodeURIComponent(clean.id); }, 500);
    });
    var cl = document.getElementById('me-clear');
    if (cl) cl.addEventListener('click', function () { if (!window.confirm(t('bt.me.confirmClear'))) return; store.del('me'); rebuildIndex(); route({ keepScroll: false }); });
  };

  /* ---- Birthdays ---- */
  VIEWS.birthdays = function () {
    var today = new Date(), all = people();
    var dated = all.filter(function (c) { return c.bmonth; }).map(function (c) { return { c: c, d: daysUntil(c, today) }; }).sort(function (a, b) { return a.d - b.d || byName(a.c, b.c); });
    var undated = all.filter(function (c) { return !c.bmonth; });
    var groups = [], seen = {};
    dated.forEach(function (x) {
      var key = x.d === 0 ? 'today' : x.c.bmonth === today.getMonth() + 1 && x.d < 32 ? 'month' : 'm' + x.c.bmonth;
      if (!seen[key]) { seen[key] = { key: key, label: key === 'today' ? t('bt.bd.today') : key === 'month' ? t('bt.bd.thisMonth') : monthName(x.c.bmonth), items: [] }; groups.push(seen[key]); }
      seen[key].items.push(x);
    });
    return '<div class="wrap page">' + crumb(t('nav.birthdays')) +
      '<header class="page__head"><h1>' + esc(t('nav.birthdays')) + '</h1><p>' + esc(t('bt.bd.intro')) + '</p></header>' +
      (dated.length ? '<div class="callout"><p class="callout__title">' + esc(t('bt.cal.all')) + '</p><p style="margin:0 0 10px">' + esc(t('bt.cal.allText')) + '</p><button type="button" class="btn" id="cal-all">' + icon('calendar', 'btn__ico') + esc(t('bt.cal.all')) + '</button><p class="form__status" id="cal-status" role="status"></p></div>' : '') +
      (!dated.length ? '<div class="empty"><p>' + esc(t('bt.bd.none')) + '</p><p><a class="btn btn--solid" href="#/me">' + esc(t('nav.me')) + '</a></p></div>' :
        groups.map(function (g) {
          return '<h2>' + esc(g.label) + '</h2><div class="bdlist">' + g.items.map(function (x) {
            var c = x.c, yr = today.getFullYear() + (x.d > 0 && (c.bmonth < today.getMonth() + 1 || (c.bmonth === today.getMonth() + 1 && c.bday < today.getDate())) ? 1 : 0);
            return '<a class="row bdrow' + (x.d === 0 ? ' is-today' : '') + '" href="#/person/' + encodeURIComponent(c.id) + '"><span class="bdrow__date"><span class="bdrow__d">' + c.bday + '</span><span class="bdrow__m">' + esc(monthName(c.bmonth).slice(0, 3)) + '</span></span>' +
              '<span><h3>' + esc(c.name) + '</h3><p>' + esc(x.d === 0 ? t('bt.home.today') : x.d === 1 ? t('bt.home.inDays1') : tf('bt.home.inDaysN', { n: x.d })) + (c.byear ? ' · ' + esc(tf('bt.person.turns', { n: ageOn(c, yr) })) : '') + '</p></span>' + avatar(c, 'avatar--sm') + '</a>';
          }).join('') + '</div>';
        }).join('')) +
      (undated.length ? '<h2>' + esc(t('bt.bd.noDate')) + '</h2><p class="muted">' + undated.map(function (c) { return esc(c.name); }).join(', ') + '</p>' : '') +
      '</div>';
  };

  AFTER.birthdays = function () {
    var b = document.getElementById('cal-all'); if (!b) return;
    b.addEventListener('click', function () { icsOut(people(), 'batch-birthdays.ics', function (m) { var st = document.getElementById('cal-status'); if (st) st.textContent = m; }); });
  };

  /* ---- Share cards: card files in and out ---- */
  function fileOut(payload, name, titleKey, cb) {   // share sheet on installed phone apps, download elsewhere
    var json = JSON.stringify(payload, null, 1), file = null;
    try { file = new File([json], name, { type: 'application/json' }); } catch (e) {}
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: t(titleKey) }).then(function () { cb(t('bt.share.shared')); }).catch(function () { cb(t('bt.share.cancelled')); });
      return;
    }
    var url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    var a = document.createElement('a'); a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    cb(tf('bt.share.saved', { name: name }));
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'card'; }
  function cardsFrom(p) {   // cards inside a card file, a batch file or a Batch Tickler backup
    if (p && p.a === 'bt' && p.k === 'card' && p.c) return [p.c];   // compact QR form
    if (!p || p.app !== CARD_APP) return null;
    if (p.kind === 'card' && p.card) return [p.card];
    if (p.kind === 'batch' && Array.isArray(p.cards)) return p.cards;
    if (p.data && typeof p.data === 'object') {   // footer backup format
      var out = [];
      try { var me = JSON.parse(p.data.me || 'null'); if (me) out.push(me); } catch (e) {}
      try { var b = JSON.parse(p.data.batch || '[]'); if (Array.isArray(b)) out = out.concat(b); } catch (e2) {}
      return out;
    }
    return null;
  }
  function mergeCards(incoming) {
    var me = getMe(), list = getOthers(), res = { added: 0, updated: 0, skipped: 0 };
    incoming.map(sanitizeCard).forEach(function (c) {
      if (!c) { res.skipped++; return; }
      if (me && (c.id === me.id || c.name.toLowerCase() === me.name.toLowerCase())) { res.skipped++; return; }
      var i = -1;
      for (var k = 0; k < list.length; k++) if (list[k].id === c.id || list[k].name.toLowerCase() === c.name.toLowerCase()) { i = k; break; }
      if (i < 0) { list.push(c); res.added++; }
      else if (new Date(c.updated) > new Date(list[i].updated)) { list[i] = c; res.updated++; }
      else res.skipped++;
    });
    saveOthers(list);
    return res;
  }
  VIEWS.share = function () {
    var me = getMe(), n = people().length;
    function block(title, text, action) { return '<section class="card share__blk"><h2>' + esc(t(title)) + '</h2><p>' + esc(t(text)) + '</p>' + action + '</section>'; }
    return '<div class="wrap page share">' + crumb(t('nav.share')) +
      '<header class="page__head"><h1>' + esc(t('nav.share')) + '</h1><p>' + esc(t('bt.share.intro')) + '</p></header>' +
      block('bt.share.mine', 'bt.share.mineText', me ? '<button type="button" class="btn btn--solid" id="sh-mine">' + icon('share', 'btn__ico') + esc(t('bt.share.mineBtn')) + '</button>' : '<a class="btn btn--solid" href="#/me">' + esc(t('bt.share.needMe')) + '</a>') +
      block('bt.share.import', 'bt.share.importText', '<input type="file" id="sh-file" class="sr-only" accept=".json,application/json"><label class="btn btn--solid" for="sh-file" id="sh-file-label">' + esc(t('bt.share.importBtn')) + '</label>') +
      block('bt.qr.title', 'bt.qr.text', me ? '<button type="button" class="btn btn--solid" id="sh-qr" aria-expanded="false">' + icon('qr', 'btn__ico') + esc(t('bt.qr.btn')) + '</button> <a class="btn" href="#/scan">' + esc(t('nav.scan')) + '</a><div id="sh-qr-box" class="qr" hidden></div>' : '<a class="btn btn--solid" href="#/me">' + esc(t('bt.share.needMe')) + '</a>') +
      block('bt.share.all', 'bt.share.allText', '<button type="button" class="btn" id="sh-all"' + (n ? '' : ' disabled') + '>' + esc(t('bt.share.allBtn')) + '</button> <span class="muted">' + esc(tf('bt.share.ownAll', { n: n })) + '</span>') +
      '<p class="form__status" id="sh-status" role="status" aria-live="polite"></p></div>';
  };
  AFTER.share = function () {
    var st = document.getElementById('sh-status');
    function say(m, err) { st.textContent = m; st.classList.toggle('is-error', !!err); }
    var mine = document.getElementById('sh-mine'), all = document.getElementById('sh-all'), fi = document.getElementById('sh-file');
    var qrBtn = document.getElementById('sh-qr'), qrBox = document.getElementById('sh-qr-box');
    if (qrBtn) qrBtn.addEventListener('click', function () {
      var me = getMe(); if (!me) return;
      if (!qrBox.hidden) { qrBox.hidden = true; qrBox.innerHTML = ''; qrBtn.setAttribute('aria-expanded', 'false'); qrBtn.innerHTML = icon('qr', 'btn__ico') + esc(t('bt.qr.btn')); return; }
      var pl = qrPayload(me), svg = qrSvg(pl.text);
      qrBox.innerHTML = (svg ? '<div class="qr__img">' + svg + '</div>' : '') + '<p class="qr__name">' + esc(me.name) + '</p>' + (pl.kept < pl.total ? '<p class="muted">' + esc(tf('bt.qr.trimmed', { n: pl.kept, total: pl.total })) + '</p>' : '');
      qrBox.hidden = false; qrBtn.setAttribute('aria-expanded', 'true'); qrBtn.innerHTML = esc(t('bt.qr.hide'));
      setTimeout(function () { qrBox.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 50);
    });
    if (mine) mine.addEventListener('click', function () {
      var me = getMe(); if (!me) { say(t('bt.share.needMe'), true); return; }
      fileOut({ app: CARD_APP, kind: 'card', format: 1, exported: new Date().toISOString(), card: me }, 'batch-card-' + slug(me.name) + '.json', 'bt.share.mine', say);
    });
    if (all) all.addEventListener('click', function () {
      var l = people(); if (!l.length) { say(t('bt.share.allEmpty'), true); return; }
      var d = new Date();
      fileOut({ app: CARD_APP, kind: 'batch', format: 1, exported: d.toISOString(), cards: l }, 'batch-cards-' + d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + '.json', 'bt.share.all', say);
    });
    fi.addEventListener('change', function () {
      var f = fi.files && fi.files[0]; fi.value = ''; if (!f) return;
      var r = new FileReader();
      r.onerror = function () { say(t('backup.unreadable'), true); };
      r.onload = function () {
        var p; try { p = JSON.parse(r.result); } catch (e) { say(t('bt.share.notCards'), true); return; }
        var cards = cardsFrom(p);
        if (!cards || !cards.length) { say(t('bt.share.notCards'), true); return; }
        var res = mergeCards(cards);
        say(tf('bt.share.result', res) + (res.skipped && getMe() ? ' ' + t('bt.share.skippedMe') : ''));
        var n = document.querySelector('#sh-all + .muted'); if (n) n.textContent = tf('bt.share.ownAll', { n: people().length });
        var ab = document.getElementById('sh-all'); if (ab) ab.disabled = !people().length;
      };
      r.readAsText(f);
    });
  };

  /* ---- Print: batch sheet or name tags ---- */
  var printMode = 'sheet';
  VIEWS.print = function () {
    var all = people(), today = new Date(), bn = batchName();
    var head = '<header class="page__head no-print"><h1>' + esc(t('nav.print')) + '</h1><p>' + esc(t('bt.print.intro')) + '</p>' +
      (all.length ? '<div class="filters" role="group"><button type="button" class="filter" data-pmode="sheet" aria-pressed="' + (printMode === 'sheet') + '">' + esc(t('bt.print.modeSheet')) + '</button><button type="button" class="filter" data-pmode="tags" aria-pressed="' + (printMode === 'tags') + '">' + esc(t('bt.print.modeTags')) + '</button><button type="button" class="filter" data-pmode="full" aria-pressed="' + (printMode === 'full') + '">' + esc(t('bt.print.modeFull')) + '</button></div>' +
        '<p><button type="button" class="btn btn--solid" id="do-print">' + icon('print', 'btn__ico') + esc(t('bt.print.btn')) + '</button>' + (printMode === 'tags' ? ' <span class="muted">' + esc(t('bt.print.tagsHint')) + '</span>' : printMode === 'full' ? ' <span class="muted">' + esc(t('bt.print.fullHint')) + '</span>' : '') + '</p>' : '') + '</header>';
    if (!all.length) return '<div class="wrap page print">' + crumb(t('nav.print')) + head + '<div class="empty"><p>' + esc(t('bt.print.empty')) + '</p></div></div>';
    var body;
    if (printMode === 'full') {
      body = '<div class="sheet full"><header class="sheet__head"><h2>' + esc(bn ? bn + ' · ' + t('bt.print.fullTitle') : t('bt.print.fullTitle')) + '</h2><p>' + esc(tf('bt.print.subtitle', { program: HOSP.program || '', hospital: HOSP.name || '' })) + ' · ' + esc(today.toLocaleDateString(locale(), { year: 'numeric', month: 'long', day: 'numeric' })) + ' · ' + esc(tf(all.length === 1 ? 'bt.home.count1' : 'bt.home.countN', { n: all.length })) + '</p></header>' +
        all.map(function (c) {
          var head = '<header class="full__head">' + avatar(c, 'avatar--print') + '<div><h3>' + esc(c.name) + (c.nickname ? ' <small>“' + esc(c.nickname) + '”</small>' : '') + '</h3>' +
            (c.bmonth ? '<p>' + esc(t('bt.person.birthday')) + ': ' + esc(bdayText(c, true)) + (c.byear ? ' · ' + esc(tf('bt.person.turns', { n: ageOn(c, today.getFullYear()) })) : '') + ' · ' + esc(zodiac(c)) + (chineseZodiac(c) ? ' / ' + esc(chineseZodiac(c)) : '') + '</p>' : '') + '</div></header>';
          var groups = GROUPS.map(function (g) {
            var rows = subChunks(g).map(function (ch) {
              var r = ch.fields.filter(function (f) { return c[f.key] && f.key !== 'nickname'; }).map(function (f) {
                var v = f.type === 'month' ? fmtMonth(c[f.key]) : f.type === 'url' ? linkHref(f, c[f.key]) : c[f.key];
                return '<p class="sheet__line"><strong>' + esc(fieldLabel(f.key)) + ':</strong> ' + esc(v).replace(/\n/g, ' · ') + '</p>';
              }).join('');
              return r ? (ch.sub ? '<p class="full__sub">' + esc(subLabel(ch.sub)) + '</p>' : '') + r : '';
            }).join('');
            return rows ? '<section class="full__group"><h4>' + esc(groupLabel(g)) + '</h4>' + rows + '</section>' : '';
          }).join('');
          if (c.playlists.length) groups += '<section class="full__group"><h4>' + esc(t('bt.f.playlists')) + '</h4>' + c.playlists.map(function (pl) { return '<p class="sheet__line"><strong>' + esc(pl.label || '—') + ':</strong> ' + esc(pl.url) + '</p>'; }).join('') + '</section>';
          if (c.custom.length) groups += '<section class="full__group"><h4>' + esc(t('bt.print.custom')) + '</h4>' + c.custom.map(function (x) { return '<p class="sheet__line"><strong>' + esc(x.label) + ':</strong> ' + esc(x.value).replace(/\n/g, ' · ') + '</p>'; }).join('') + '</section>';
          return '<article class="full__person">' + head + '<div class="full__cols">' + groups + '</div></article>';
        }).join('') + '<p class="sheet__foot">' + esc(ATTRIBUTION) + '</p></div>';
    } else if (printMode === 'tags') {
      body = '<div class="sheet tags"><div class="tags__grid">' + all.map(function (c) {
        return '<article class="tag">' + (bn ? '<p class="tag__batch">' + esc(bn) + '</p>' : '') + avatar(c, 'avatar--tag') + '<h3>' + esc(c.preferredName || c.nickname || c.name.split(/\s+/)[0]) + '</h3><p class="tag__name">' + esc(c.name) + '</p>' + (c.hometown ? '<p class="tag__sub">' + esc(c.hometown) + '</p>' : '') + '<p class="tag__foot">' + esc(HOSP.shortName || '') + ' · ' + esc(HOSP.program || '') + '</p></article>';
      }).join('') + '</div></div>';
    } else {
      body = '<div class="sheet"><header class="sheet__head"><h2>' + esc(bn ? bn + ' · ' + t('bt.print.title') : t('bt.print.title')) + '</h2><p>' + esc(tf('bt.print.subtitle', { program: HOSP.program || '', hospital: HOSP.name || '' })) + ' · ' + esc(today.toLocaleDateString(locale(), { year: 'numeric', month: 'long' })) + '</p></header>' +
        '<div class="sheet__grid">' + all.map(function (c) {
          return '<article class="sheet__card">' + avatar(c, 'avatar--print') + '<div class="sheet__body"><h3>' + esc(c.name) + (c.nickname ? ' <small>“' + esc(c.nickname) + '”</small>' : '') + '</h3>' +
            (c.bmonth ? '<p class="sheet__line"><strong>' + esc(t('bt.person.birthday')) + ':</strong> ' + esc(bdayText(c)) + '</p>' : '') +
            FIELDS.filter(function (f) { return f.print && f.key !== 'nickname' && c[f.key]; }).map(function (f) { return '<p class="sheet__line"><strong>' + esc(fieldLabel(f.key)) + ':</strong> ' + esc(c[f.key]).replace(/\n/g, ' · ') + '</p>'; }).join('') +
            c.custom.map(function (x) { return '<p class="sheet__line"><strong>' + esc(x.label) + ':</strong> ' + esc(x.value) + '</p>'; }).join('') +
            '</div></article>';
        }).join('') + '</div><p class="sheet__foot">' + esc(ATTRIBUTION) + '</p></div>';
    }
    return '<div class="wrap page print">' + crumb(t('nav.print')) + head + body + '</div>';
  };
  AFTER.print = function () {
    var b = document.getElementById('do-print'); if (b) b.addEventListener('click', function () { window.print(); });
    var ms = document.querySelectorAll('.filter[data-pmode]');
    for (var i = 0; i < ms.length; i++) ms[i].addEventListener('click', function (e) { printMode = e.currentTarget.getAttribute('data-pmode'); route({ keepScroll: true }); });
  };

  /* ---- Guess who: three modes, rounds of 10, leaderboard on this phone ---- */
  var ROUND = 10, GUESS_MODES = ['clue', 'photo', 'month'];
  var guess = { mode: 'clue', right: 0, total: 0, q: null, done: false };
  function modeLabel(m) { return t('bt.guess.mode' + m.charAt(0).toUpperCase() + m.slice(1)); }
  function makeQuestion(mode) {
    var all = people(), pick, others, opts;
    if (mode === 'photo') {
      var withPhoto = all.filter(function (c) { return c.photo; });
      if (withPhoto.length < 4) return null;
      pick = withPhoto[Math.floor(Math.random() * withPhoto.length)];
      others = shuffle(all.filter(function (c) { return c.id !== pick.id; })).slice(0, 3);
      return { mode: mode, c: pick, opts: shuffle(others.concat([pick])).map(function (c) { return { id: c.id, label: c.name }; }), answer: pick.id, answered: false };
    }
    if (mode === 'month') {
      var dated = all.filter(function (c) { return c.bmonth; });
      if (dated.length < 4) return null;
      pick = dated[Math.floor(Math.random() * dated.length)];
      var months = [pick.bmonth]; while (months.length < 4) { var m = 1 + Math.floor(Math.random() * 12); if (months.indexOf(m) < 0) months.push(m); }
      return { mode: mode, c: pick, opts: shuffle(months).map(function (m) { return { id: String(m), label: monthName(m) }; }), answer: String(pick.bmonth), answered: false };
    }
    var pool = [];
    GUESS_FIELDS.forEach(function (k) { var have = all.filter(function (c) { return c[k]; }); if (have.length >= 4) have.forEach(function (c) { pool.push({ c: c, k: k }); }); });
    if (!pool.length) return null;
    var p = pool[Math.floor(Math.random() * pool.length)];
    others = shuffle(all.filter(function (c) { return c.id !== p.c.id; })).slice(0, 3);
    return { mode: mode, c: p.c, k: p.k, clue: p.c[p.k], opts: shuffle(others.concat([p.c])).map(function (c) { return { id: c.id, label: c.name }; }), answer: p.c.id, answered: false };
  }
  function board() { var b = store.get('guessBoard', []); return Array.isArray(b) ? b : []; }
  function saveRound() {
    var me = getMe(), b = board();
    b.push({ who: me ? me.name : t('bt.guess.player'), mode: guess.mode, right: guess.right, n: guess.total, date: new Date().toISOString() });
    b.sort(function (x, y) { return (y.right / y.n) - (x.right / x.n) || new Date(y.date) - new Date(x.date); });
    store.set('guessBoard', b.slice(0, 10));
  }
  function resetRound(mode) { guess = { mode: mode || guess.mode, right: 0, total: 0, q: null, done: false }; }
  VIEWS.guess = function () {
    if (!guess.q && !guess.done) guess.q = makeQuestion(guess.mode);
    var q = guess.q, b = board();
    var modes = '<div class="filters" role="group">' + GUESS_MODES.map(function (m) { return '<button type="button" class="filter" data-gmode="' + m + '" aria-pressed="' + (guess.mode === m) + '">' + esc(modeLabel(m)) + '</button>'; }).join('') + '</div>';
    var boardHtml = '<h2>' + esc(t('bt.guess.board')) + '</h2><div class="card">' + (b.length ? '<ol class="plain plain--num">' + b.map(function (r) { return '<li><strong>' + esc(r.who) + '</strong> <span class="muted">' + esc(tf('bt.guess.boardRow', { right: r.right, n: r.n, mode: modeLabel(r.mode), date: bkDate(r.date) })) + '</span></li>'; }).join('') + '</ol>' : '<p class="muted">' + esc(t('bt.guess.boardEmpty')) + '</p>') + '</div>';
    var body;
    if (guess.done) body = '<div class="card guess__card"><h2 style="margin-top:0">' + esc(tf('bt.guess.roundDone', { right: guess.right, n: guess.total })) + '</h2><p><button type="button" class="btn btn--solid" id="g-again">' + esc(t('bt.guess.playAgain')) + '</button></p></div>';
    else if (!q) body = '<div class="empty"><p>' + esc(t(guess.mode === 'photo' ? 'bt.guess.needPhotos' : guess.mode === 'month' ? 'bt.guess.needDates' : 'bt.guess.notEnough')) + '</p></div>';
    else {
      var ask = q.mode === 'photo' ? '<p class="guess__ask">' + esc(t('bt.guess.whosePhoto')) + '</p><div class="guess__photo">' + avatar(q.c, 'avatar--xl') + '</div>'
              : q.mode === 'month' ? '<p class="guess__ask">' + esc(tf('bt.guess.whichMonth', { name: q.c.name })) + '</p><div class="guess__photo">' + avatar(q.c, 'avatar--lg') + '</div>'
              : '<p class="guess__ask">' + esc(tf('bt.guess.whose', { field: fieldLabel(q.k).toLowerCase() })) + '</p><blockquote class="guess__clue">' + esc(q.clue).replace(/\n/g, '<br>') + '</blockquote>';
      body = '<div class="card guess__card"><p class="muted guess__score">' + esc(tf('bt.guess.roundOf', { i: guess.total + 1, n: ROUND })) + ' · ' + esc(tf('bt.guess.score', { right: guess.right, total: guess.total })) + '</p>' + ask +
        '<div class="guess__opts">' + q.opts.map(function (o) { return '<button type="button" class="btn guess__opt" data-id="' + esc(o.id) + '">' + esc(o.label) + '</button>'; }).join('') + '</div>' +
        '<p class="form__status" id="g-status" role="status" aria-live="polite"></p><p class="guess__acts" id="g-acts" hidden><button type="button" class="btn btn--solid" id="g-next">' + esc(t('bt.guess.next')) + '</button> <a class="btn" href="#/person/' + encodeURIComponent(q.c.id) + '">' + esc(t('bt.guess.open')) + '</a></p></div>';
    }
    return '<div class="wrap page guess">' + crumb(t('nav.guess')) + '<header class="page__head"><h1>' + esc(t('nav.guess')) + '</h1><p>' + esc(t('bt.guess.intro')) + '</p></header>' + modes + body + boardHtml + '</div>';
  };
  AFTER.guess = function () {
    var ms = document.querySelectorAll('.filter[data-gmode]');
    for (var k = 0; k < ms.length; k++) ms[k].addEventListener('click', function (e) { resetRound(e.currentTarget.getAttribute('data-gmode')); route({ keepScroll: true }); });
    var again = document.getElementById('g-again'); if (again) again.addEventListener('click', function () { resetRound(); route({ keepScroll: true }); });
    var q = guess.q; if (!q || guess.done) return;
    var opts = document.querySelectorAll('.guess__opt'), st = document.getElementById('g-status'), acts = document.getElementById('g-acts');
    for (var i = 0; i < opts.length; i++) opts[i].addEventListener('click', function (e) {
      if (q.answered) return; q.answered = true; guess.total++;
      var ok = e.currentTarget.getAttribute('data-id') === q.answer; if (ok) guess.right++;
      for (var j = 0; j < opts.length; j++) { opts[j].disabled = true; if (opts[j].getAttribute('data-id') === q.answer) opts[j].classList.add('is-right'); }
      if (!ok) e.currentTarget.classList.add('is-wrong');
      var answerLabel = q.mode === 'month' ? monthName(q.c.bmonth) : q.c.name;
      st.textContent = ok ? t('bt.guess.right') : tf('bt.guess.wrong', { name: answerLabel });
      acts.hidden = false;
      if (guess.total >= ROUND) { document.getElementById('g-next').textContent = tf('bt.guess.roundDone', { right: guess.right, n: guess.total }); }
    });
    document.getElementById('g-next').addEventListener('click', function () {
      if (guess.total >= ROUND) { saveRound(); guess.done = true; guess.q = null; } else guess.q = makeQuestion(guess.mode);
      route({ keepScroll: true });
    });
  };

  /* ---- Batch photo (home banner override, this device) ---- */
  function bannerSrc() { var b = store.get('banner', ''); return okPhoto(b) || (typeof b === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(b) && b.length < 900000) ? b : ''; }
  function shrinkBanner(file, cb) {
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      try {
        var k = Math.min(1, 1400 / img.width), w = Math.round(img.width * k), h = Math.round(img.height * k);
        var cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').drawImage(img, 0, 0, w, h);
        var out = cv.toDataURL('image/jpeg', 0.8); URL.revokeObjectURL(url); cb(out.length < 900000 ? out : null);
      } catch (e) { URL.revokeObjectURL(url); cb(null); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); cb(null); };
    img.src = url;
  }
  /* ---- 1.3.0: QR share, scan, calendar export, batch stats ---- */
  ICONS.qr = '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M13.5 13.5h3v3h-3zM18.5 13.5h2M20.5 16.5v4h-4M13.5 20.5h2"/>';
  ICONS.camera = '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.5-2.5h5L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>';
  ICONS.chart = '<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>';

  /* QR payload: the card without its photo, each field trimmed, fields dropped from the end until it fits a scannable size */
  var QR_LIMIT = 2200, QR_FIELD_MAX = 160;
  function qrPayload(c) {
    var keys = ['id', 'name', 'bmonth', 'bday', 'byear', 'updated'], total = 0, kept = 0;
    var base = {}; keys.forEach(function (k) { base[k] = c[k]; });
    var fs = FIELDS.filter(function (f) { return c[f.key] && f.qr !== false; }); total = fs.length + (c.custom.length ? 1 : 0);
    var out = JSON.parse(JSON.stringify(base));
    for (var i = 0; i < fs.length; i++) {
      var trial = JSON.parse(JSON.stringify(out)); trial[fs[i].key] = String(c[fs[i].key]).slice(0, QR_FIELD_MAX);
      if (JSON.stringify({ a: 'bt', k: 'card', c: trial }).length > QR_LIMIT) break;
      out = trial; kept++;
    }
    if (c.custom.length) { var t2 = JSON.parse(JSON.stringify(out)); t2.custom = c.custom.map(function (x) { return { label: x.label, value: x.value.slice(0, QR_FIELD_MAX) }; }); if (JSON.stringify({ a: 'bt', k: 'card', c: t2 }).length <= QR_LIMIT) { out = t2; kept++; } }
    return { text: JSON.stringify({ a: 'bt', k: 'card', c: out }), kept: kept, total: total };
  }
  function qrSvg(text) {
    if (typeof window.qrcode !== 'function') return '';
    try { var q = window.qrcode(0, 'L'); q.addData(text, 'Byte'); q.make(); return q.createSvgTag({ cellSize: 4, margin: 3, scalable: true }); } catch (e) { return ''; }
  }

  /* ICS (calendar) export: yearly all-day events */
  function icsDate(y, m, d) { return String(y) + pad2(m) + pad2(d); }
  function icsEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function icsFor(list) {
    var now = new Date(), stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//isaymotion//Batch Tickler//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:' + icsEscape((batchName() ? batchName() + ' · ' : '') + t('nav.birthdays'))];
    list.forEach(function (c) {
      if (!c.bmonth) return;
      var y = c.byear || now.getFullYear(), d = c.bday;
      if (c.bmonth === 2 && d === 29 && !isLeap(y)) d = 28;
      lines.push('BEGIN:VEVENT', 'UID:' + c.id + '@isaymotion.github.io', 'DTSTAMP:' + stamp,
        'DTSTART;VALUE=DATE:' + icsDate(y, c.bmonth, d),
        'RRULE:FREQ=YEARLY', 'SUMMARY:' + icsEscape('🎂 ' + tf('bt.cal.summary', { name: c.name })),
        'DESCRIPTION:' + icsEscape((c.hometown ? c.hometown + '. ' : '') + (c.giftHints ? fieldLabel('giftHints') + ': ' + c.giftHints : '')),
        'TRANSP:TRANSPARENT', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n') + '\r\n';
  }
  function icsOut(list, name, cb) {
    var ics = icsFor(list), file = null;
    try { file = new File([ics], name, { type: 'text/calendar' }); } catch (e) {}
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: t('nav.birthdays') }).then(function () { cb(tf('bt.cal.saved', { name: name })); }).catch(function () { cb(t('bt.share.cancelled')); });
      return;
    }
    var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    var a = document.createElement('a'); a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    cb(tf('bt.cal.saved', { name: name }));
  }

  /* Scan: camera via getUserMedia + jsQR (loaded on demand), or a picked image */
  var scanStream = null, scanTimer = null, jsqrLoading = null;
  function loadJsQR() {
    if (typeof window.jsQR === 'function') return Promise.resolve();
    if (jsqrLoading) return jsqrLoading;
    jsqrLoading = new Promise(function (res, rej) { var sc = document.createElement('script'); sc.src = 'js/vendor/jsQR.js'; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
    return jsqrLoading;
  }
  function stopScan() {
    clearTimeout(scanTimer); scanTimer = null;
    if (scanStream) { scanStream.getTracks().forEach(function (tr) { tr.stop(); }); scanStream = null; }
    var v = document.getElementById('scan-video'); if (v) { v.srcObject = null; v.hidden = true; }
    var b = document.getElementById('scan-start'); if (b) { b.textContent = t('bt.scan.start'); b.setAttribute('data-on', '0'); }
  }
  window.addEventListener('hashchange', stopScan);
  function decodeImageData(img) {
    if (typeof window.jsQR !== 'function') return null;
    var r = window.jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' });
    return r && r.data ? r.data : null;
  }
  function handleScanned(text, say) {
    var p; try { p = JSON.parse(text); } catch (e) { say(t('bt.scan.notCard'), true); return false; }
    var cards = cardsFrom(p);
    if (!cards || !cards.length) { say(t('bt.scan.notCard'), true); return false; }
    var c = sanitizeCard(cards[0]); if (!c) { say(t('bt.scan.notCard'), true); return false; }
    if (isMe(c)) { say(t('bt.scan.me'), true); return true; }
    var before = findPerson(c.id), res = mergeCards([c]);
    var msg = res.added ? tf('bt.scan.added', { name: c.name }) : res.updated ? tf('bt.scan.updated', { name: c.name }) : tf('bt.scan.same', { name: (before || c).name });
    say(msg + ' ', false, '#/person/' + encodeURIComponent(c.id));
    return true;
  }
  VIEWS.scan = function () {
    return '<div class="wrap page scan">' + crumb(t('nav.scan')) +
      '<header class="page__head"><h1>' + esc(t('nav.scan')) + '</h1><p>' + esc(t('bt.scan.intro')) + '</p></header>' +
      '<div class="card scan__card"><video id="scan-video" class="scan__video" playsinline muted hidden></video><canvas id="scan-canvas" hidden></canvas>' +
        '<div class="form__acts"><button type="button" class="btn btn--solid" id="scan-start" data-on="0">' + icon('camera', 'btn__ico') + esc(t('bt.scan.start')) + '</button>' +
        '<input type="file" id="scan-file" class="sr-only" accept="image/*"><label class="btn" for="scan-file" id="scan-file-label">' + esc(t('bt.scan.photo')) + '</label></div>' +
        '<p class="form__status" id="scan-status" role="status" aria-live="polite"></p><p id="scan-link" hidden><a class="btn" id="scan-open" href="#/batch">' + esc(t('bt.guess.open')) + '</a> <button type="button" class="btn" id="scan-again">' + esc(t('bt.scan.again')) + '</button></p></div></div>';
  };
  AFTER.scan = function () {
    var st = document.getElementById('scan-status'), link = document.getElementById('scan-link'), open = document.getElementById('scan-open');
    var video = document.getElementById('scan-video'), canvas = document.getElementById('scan-canvas'), startBtn = document.getElementById('scan-start'), fi = document.getElementById('scan-file');
    function say(m, err, href) { st.textContent = m; st.classList.toggle('is-error', !!err); link.hidden = !href; if (href) open.setAttribute('href', href); }
    function tick() {
      if (!scanStream || !video.videoWidth) { scanTimer = setTimeout(tick, 250); return; }
      var w = Math.min(640, video.videoWidth), h = Math.round(video.videoHeight * w / video.videoWidth);
      canvas.width = w; canvas.height = h;
      var cx = canvas.getContext('2d', { willReadFrequently: true }); cx.drawImage(video, 0, 0, w, h);
      var text = decodeImageData(cx.getImageData(0, 0, w, h));
      if (text) { stopScan(); handleScanned(text, say); return; }
      scanTimer = setTimeout(tick, 220);
    }
    startBtn.addEventListener('click', function () {
      if (startBtn.getAttribute('data-on') === '1') { stopScan(); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { say(t('bt.scan.noCamera'), true); return; }
      say(t('bt.scan.looking'));
      loadJsQR().then(function () { return navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }); }).then(function (stream) {
        scanStream = stream; video.srcObject = stream; video.hidden = false; video.play().catch(function () {});
        startBtn.textContent = t('bt.scan.stop'); startBtn.setAttribute('data-on', '1'); tick();
      }).catch(function () { say(t('bt.scan.denied'), true); });
    });
    fi.addEventListener('change', function () {
      var f = fi.files && fi.files[0]; fi.value = ''; if (!f) return;
      say(t('bt.scan.looking'));
      loadJsQR().then(function () {
        var url = URL.createObjectURL(f), img = new Image();
        img.onload = function () {
          var text = null;
          [1000, 600, 1600].some(function (max) {   // try a few sizes; jsQR likes modules of a few pixels
            var k = Math.min(1, max / Math.max(img.width, img.height)), w = Math.round(img.width * k), h = Math.round(img.height * k);
            canvas.width = w; canvas.height = h;
            var cx = canvas.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0, w, h);
            text = decodeImageData(cx.getImageData(0, 0, w, h)); return !!text;
          });
          URL.revokeObjectURL(url);
          if (!text) { say(t('bt.scan.notFound'), true); return; }
          handleScanned(text, say);
        };
        img.onerror = function () { URL.revokeObjectURL(url); say(t('bt.scan.notFound'), true); };
        img.src = url;
      }).catch(function () { say(t('bt.scan.notFound'), true); });
    });
    document.getElementById('scan-again').addEventListener('click', function () { say(''); startBtn.click(); });
  };

  /* Batch stats */
  function countBy(list, fn) {
    var m = {}, out = [];
    list.forEach(function (c) { (fn(c) || []).forEach(function (v) { var k = v.toLowerCase(); if (!m[k]) { m[k] = { label: v, n: 0, who: [] }; out.push(m[k]); } m[k].n++; m[k].who.push(c.name); }); });
    return out.sort(function (a, b) { return b.n - a.n || a.label.localeCompare(b.label); });
  }
  function nPeople(n) { return tf(n === 1 ? 'bt.stats.n1' : 'bt.stats.nN', { n: n }); }
  function countList(rows, max) {
    if (!rows.length) return '<p class="muted">' + esc(t('bt.stats.empty')) + '</p>';
    var top = rows[0].n;
    return '<div class="bars">' + rows.slice(0, max || 12).map(function (r) {
      return '<div class="bar"><span class="bar__l">' + esc(r.label) + '</span><span class="bar__track"><span style="width:' + Math.max(6, Math.round(100 * r.n / top)) + '%"></span></span><span class="bar__n" title="' + esc(r.who.join(', ')) + '">' + r.n + '</span></div>';
    }).join('') + '</div>';
  }
  VIEWS.stats = function () {
    var all = people(), today = new Date(), n = all.length;
    if (!n) return '<div class="wrap page">' + crumb(t('nav.stats')) + '<header class="page__head"><h1>' + esc(t('nav.stats')) + '</h1></header><div class="empty"><p>' + esc(t('bt.stats.empty')) + '</p></div></div>';
    var withPhoto = all.filter(function (c) { return c.photo; }).length;
    var avg = Math.round(all.reduce(function (s, c) { var k = completeness(c); return s + 100 * k.n / k.total; }, 0) / n);
    var months = []; for (var i = 1; i <= 12; i++) months.push({ label: monthName(i), n: 0, who: [] });
    all.forEach(function (c) { if (c.bmonth) { months[c.bmonth - 1].n++; months[c.bmonth - 1].who.push(c.name); } });
    var top = Math.max.apply(null, months.map(function (m) { return m.n; }).concat([1]));
    var aged = all.filter(function (c) { return c.byear; }).sort(function (a, b) { return (a.byear - b.byear) || (a.bmonth - b.bmonth) || (a.bday - b.bday); });
    var thisMonth = all.filter(function (c) { return c.bmonth === today.getMonth() + 1; }).sort(function (a, b) { return a.bday - b.bday; });
    var sharedKeys = ['shows', 'kdrama', 'movies', 'anime', 'games', 'music', 'books', 'authors', 'food', 'snack', 'dessert', 'colour', 'pokemon', 'hobbies', 'sports'];
    var shared = sharedKeys.map(function (k) { return { k: k, rows: countBy(all, function (c) { return items(c[k]); }).filter(function (r) { return r.n >= 2; }) }; }).filter(function (x) { return x.rows.length; });
    return '<div class="wrap page stats">' + crumb(t('nav.stats')) +
      '<header class="page__head"><h1>' + esc(t('nav.stats')) + '</h1><p>' + esc(t('bt.stats.intro')) + '</p></header>' +
      '<div class="home__stats"><div class="card stat"><span class="stat__n">' + n + '</span><span class="stat__t">' + esc(t('bt.stats.residents')) + '</span></div>' +
        '<div class="card stat"><span class="stat__n">' + withPhoto + '</span><span class="stat__t">' + esc(t('bt.stats.withPhoto')) + '</span></div>' +
        '<div class="card stat"><span class="stat__n">' + avg + '%</span><span class="stat__t">' + esc(t('bt.stats.avgComplete')) + '</span></div></div>' +
      '<h2>' + esc(t('bt.stats.thisMonth')) + '</h2><div class="card">' + (thisMonth.length ? '<ul class="plain">' + thisMonth.map(function (c) { return '<li><a href="#/person/' + encodeURIComponent(c.id) + '">' + esc(c.name) + '</a> · ' + esc(bdayText(c)) + '</li>'; }).join('') + '</ul>' : '<p class="muted">' + esc(t('bt.stats.thisMonthNone')) + '</p>') + '</div>' +
      '<h2>' + esc(t('bt.stats.months')) + '</h2><div class="card"><div class="bars bars--months">' + months.map(function (m) { return '<div class="bar"><span class="bar__l">' + esc(m.label.slice(0, 3)) + '</span><span class="bar__track"><span style="width:' + (m.n ? Math.max(6, Math.round(100 * m.n / top)) : 0) + '%"></span></span><span class="bar__n" title="' + esc(m.who.join(', ')) + '">' + (m.n || '') + '</span></div>'; }).join('') + '</div></div>' +
      '<h2>' + esc(t('bt.stats.hometowns')) + '</h2><div class="card">' + countList(countBy(all, function (c) { return c.hometown ? [c.hometown] : []; })) + '</div>' +
      '<h2>' + esc(t('bt.stats.schools')) + '</h2><div class="card">' + countList(countBy(all, function (c) { return c.medSchool ? [c.medSchool] : []; })) + '</div>' +
      '<h2>' + esc(t('bt.stats.languages')) + '</h2><div class="card">' + countList(countBy(all, function (c) { return items(c.languages); })) + '</div>' +
      (n > 1 ? twinsHTML(all) : '') +
      (aged.length ? '<h2>' + esc(t('bt.stats.ages')) + '</h2><div class="card"><ol class="plain plain--num">' + aged.map(function (c) { return '<li><a href="#/person/' + encodeURIComponent(c.id) + '">' + esc(c.name) + '</a> <span class="muted">· ' + esc(bdayText(c, true)) + '</span></li>'; }).join('') + '</ol></div>' : '') +
      '<h2>' + esc(t('bt.stats.shared')) + '</h2>' + (shared.length ? shared.map(function (x) { return '<div class="card stats__shared"><h3>' + esc(fieldLabel(x.k)) + '</h3>' + countList(x.rows, 6) + '</div>'; }).join('') : '<div class="card"><p class="muted">' + esc(t('bt.stats.sharedNone')) + '</p></div>') +
      '</div>';
  };

  /* ===================== 1.11.0: FUN FEATURES =====================
     Birthday banner, Who said it?, Batch Bingo, Batch twins, Weekly spotlight, Icebreakers,
     Hometown map, Batch Wrapped, Residency day counter. Everything is computed from the cards on
     this device; the only new stored keys are `startDate` (YYYY-MM-DD) and `bingo` (current board). */
  function mulberry(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
  function shuffled(list, rnd) { var a = list.slice(); rnd = rnd || Math.random; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function short(c) { return c.preferredName || c.nickname || c.name; }
  function filled(c, k) { return !!(c[k] && String(c[k]).trim()); }
  function others() { var me = getMe(); return people().filter(function (c) { return !me || c.id !== me.id; }); }
  function weekNum(d) { return Math.floor((dayNum(d) + 3) / 7); }   // Monday-based week count since 1970
  function personLink(c) { return '<a href="#/person/' + encodeURIComponent(c.id) + '">' + esc(c.name) + '</a>'; }

  /* ---- 9. Residency day counter ---- */
  function startDate() { var v = String(store.get('startDate', '') || ''); return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ''; }
  function residencyDay(today) {
    var s = startDate(); if (!s) return null;
    var p = s.split('-'), start = new Date(+p[0], +p[1] - 1, +p[2]);
    var diff = dayNum(today) - dayNum(start);
    return { before: diff < 0, days: diff < 0 ? -diff : diff + 1, start: start };
  }
  function milestone(n) {
    if (n === 1) return t('bt.day.m1');
    if (n === 100 || n === 200 || n === 500 || n === 1000) return tf('bt.day.mN', { n: n });
    if (n > 1 && (n - 1) % 365 === 0) return tf('bt.day.mYear', { n: (n - 1) / 365 });
    return '';
  }
  function residencyStat(today) {
    var r = residencyDay(today);
    if (!r) return getMe() ? '<a class="card stat stat--link" href="#/about">' + icon('calendar', 'stat__ico') + '<span class="stat__t">' + esc(t('bt.day.title')) + '</span><span class="stat__sub">' + esc(t('bt.day.set')) + '</span></a>' : '';
    if (r.before) return '<div class="card stat">' + icon('calendar', 'stat__ico') + '<span class="stat__t">' + esc(t('bt.day.title')) + '</span><span class="stat__name">' + esc(r.days === 1 ? t('bt.day.tomorrow') : tf('bt.day.inN', { n: r.days })) + '</span><span class="stat__sub">' + esc(r.start.toLocaleDateString(locale(), { year: 'numeric', month: 'long', day: 'numeric' })) + '</span></div>';
    var yr = Math.min(Math.floor((r.days - 1) / 365) + 1, (HOSP.yearLevels || [1, 2, 3]).length);
    var m = milestone(r.days);
    return '<div class="card stat' + (m ? ' stat--party' : '') + '">' + icon('calendar', 'stat__ico') + '<span class="stat__t">' + esc(t('bt.day.title')) + '</span><span class="stat__name">' + esc(tf('bt.day.dayN', { n: r.days.toLocaleString() })) + '</span><span class="stat__sub">' + esc(m || tf('bt.day.year', { n: yr })) + '</span></div>';
  }

  /* ---- 1. Birthday-today banner ---- */
  function birthdayBanner(all, today) {
    var bd = all.filter(function (c) { return c.bmonth && daysUntil(c, today) === 0; });
    if (!bd.length) return '';
    var meToday = bd.filter(isMe)[0], rest = bd.filter(function (c) { return !isMe(c); });
    var bits = ''; for (var i = 0; i < 18; i++) bits += '<span style="--i:' + i + '"></span>';
    return '<section class="card bday-today" aria-labelledby="bdt-h"><div class="confetti" aria-hidden="true">' + bits + '</div>' +
      '<p class="today__k">' + icon('cake', 'today__ico') + esc(t('bt.bdt.kicker')) + '</p>' +
      '<h2 id="bdt-h">' + esc(meToday && !rest.length ? t('bt.bdt.you') : tf('bt.bdt.title', { names: rest.map(short).join(' & ') })) + '</h2>' +
      (meToday && rest.length ? '<p>' + esc(t('bt.bdt.youToo')) + '</p>' : '') +
      '<div class="bday-today__people">' + rest.map(function (c) {
        return '<div class="bday-today__p"><a href="#/person/' + encodeURIComponent(c.id) + '">' + avatar(c) + '</a><div><strong>' + esc(c.name) + '</strong>' + (c.byear ? '<span class="muted">' + esc(tf('bt.person.turns', { n: ageOn(c, today.getFullYear()) })) + '</span>' : '') +
          '<p class="today__acts"><button type="button" class="btn btn--solid" data-greet="' + esc(c.id) + '">' + esc(t('bt.bdt.greet')) + '</button></p></div></div>';
      }).join('') + '</div><p class="form__status" id="greet-status" role="status"></p></section>';
  }
  function greetText(c) { var bn = batchName(); return tf(bn ? 'bt.bdt.msgBatch' : 'bt.bdt.msg', { name: short(c), batch: bn }); }
  function greet(c, st) {
    var text = greetText(c);
    if (navigator.share) { navigator.share({ text: text }).then(function () { st.textContent = t('bt.share.shared'); }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { st.textContent = t('bt.bdt.copied'); }, function () { st.textContent = text; });
    else st.textContent = text;
  }

  /* ---- 5. Weekly spotlight ---- */
  function spotlightHTML(all, today) {
    if (all.length < 2) return '';
    var wk = weekNum(today), c = all[dayHash(wk, 3) % all.length];
    var keys = shuffled((window.GUESS_FIELDS || []).filter(function (k) { return filled(c, k) && k !== 'hometown'; }), mulberry(dayHash(wk, 4))).slice(0, 3);
    return '<section class="card today" aria-labelledby="today-sp-h"><p class="today__k">' + icon('spark', 'today__ico') + '<span id="today-sp-h">' + esc(t('bt.spot.h')) + '</span></p>' +
      '<div class="today__pl"><a href="#/person/' + encodeURIComponent(c.id) + '">' + avatar(c) + '</a><div><h3>' + esc(c.name) + '</h3>' + (c.hometown ? '<p class="muted">' + esc(c.hometown) + '</p>' : '') + '</div></div>' +
      (keys.length ? '<ul class="today__facts">' + keys.map(function (k) { return '<li><span class="today__fk">' + esc(fieldLabel(k)) + '</span><span class="today__a">' + esc(clip(c[k], 120)) + '</span></li>'; }).join('') + '</ul>' : '') +
      '<p class="today__acts"><a class="btn" href="#/person/' + encodeURIComponent(c.id) + '">' + esc(t('bt.spot.open')) + '</a></p></section>';
  }

  /* ---- 2. Who said it? ---- */
  var ws = { k: '', order: [], i: 0, right: 0, answered: false, pick: '' };
  function wsFields(all) { var need = Math.min(2, all.length); return (window.GUESS_FIELDS || []).filter(function (k) { return all.filter(function (c) { return filled(c, k); }).length >= need; }); }
  function wsStart(k) {
    var all = people();
    ws = { k: k, order: shuffled(all.filter(function (c) { return filled(c, k); })).map(function (c) { return c.id; }), i: 0, right: 0, answered: false, pick: '', opts: null };
  }
  function wsOpts(c, all) { return shuffled([c].concat(shuffled(all.filter(function (x) { return x.id !== c.id; })).slice(0, 3))); }
  VIEWS.whosaid = function (k) {
    var all = people(), fields = wsFields(all);
    var head = '<div class="wrap page guess">' + crumb(t('nav.whosaid')) + '<header class="page__head"><h1>' + esc(t('nav.whosaid')) + '</h1><p>' + esc(t('bt.ws.intro')) + '</p></header>';
    if (all.length < 2 || !fields.length) return head + '<div class="empty"><p>' + esc(t('bt.ws.notEnough')) + '</p></div></div>';
    if (!k || fields.indexOf(k) < 0) k = (todaysPicks(all, new Date()).fk && fields.indexOf(todaysPicks(all, new Date()).fk) >= 0) ? todaysPicks(all, new Date()).fk : fields[0];
    if (ws.k !== k || !ws.order.length) wsStart(k);
    var sel = '<label class="field field--inline"><span class="field__l">' + esc(t('bt.ws.topic')) + '</span><select id="ws-k">' + fields.map(function (f) { return '<option value="' + esc(f) + '"' + (f === k ? ' selected' : '') + '>' + esc(fieldLabel(f)) + '</option>'; }).join('') + '</select></label>';
    var body;
    if (ws.i >= ws.order.length) {
      body = '<div class="card guess__card"><h2 style="margin-top:0">' + esc(tf('bt.guess.roundDone', { right: ws.right, n: ws.order.length })) + '</h2><p class="guess__acts"><button type="button" class="btn btn--solid" id="ws-again">' + esc(t('bt.guess.playAgain')) + '</button><button type="button" class="btn" id="ws-other">' + esc(t('bt.ws.other')) + '</button></p></div>';
    } else {
      var c = findPerson(ws.order[ws.i]);
      if (!c) { ws.i++; return VIEWS.whosaid(k); }
      if (!ws.opts || ws.opts.id !== c.id) ws.opts = { id: c.id, list: wsOpts(c, all).map(function (x) { return { id: x.id, label: x.name }; }) };
      body = '<div class="card guess__card"><p class="muted guess__score">' + esc(tf('bt.guess.roundOf', { i: ws.i + 1, n: ws.order.length })) + ' · ' + esc(tf('bt.guess.score', { right: ws.right, total: ws.i })) + '</p>' +
        '<p class="guess__ask">' + esc(tf('bt.ws.ask', { field: fieldLabel(k).toLowerCase() })) + '</p><blockquote class="guess__clue">' + esc(c[k]).replace(/\n/g, '<br>') + '</blockquote>' +
        '<div class="guess__opts">' + ws.opts.list.map(function (o) { return '<button type="button" class="btn guess__opt" data-wsid="' + esc(o.id) + '">' + esc(o.label) + '</button>'; }).join('') + '</div>' +
        '<p class="form__status" id="ws-status" role="status" aria-live="polite"></p><p class="guess__acts" id="ws-acts" hidden><button type="button" class="btn btn--solid" id="ws-next">' + esc(t('bt.guess.next')) + '</button> <a class="btn" href="#/person/' + encodeURIComponent(c.id) + '">' + esc(t('bt.guess.open')) + '</a></p></div>';
    }
    return head + sel + body + '</div>';
  };
  AFTER.whosaid = function () {
    var s = document.getElementById('ws-k');
    if (s) s.addEventListener('change', function () { ws.k = ''; location.hash = '#/whosaid/' + encodeURIComponent(s.value); });
    var again = document.getElementById('ws-again'); if (again) again.addEventListener('click', function () { wsStart(ws.k); route({ keepScroll: true }); });
    var other = document.getElementById('ws-other'); if (other) other.addEventListener('click', function () {
      var f = wsFields(people()).filter(function (x) { return x !== ws.k; }); if (!f.length) return;
      ws.k = ''; location.hash = '#/whosaid/' + encodeURIComponent(f[Math.floor(Math.random() * f.length)]);
    });
    var opts = document.querySelectorAll('[data-wsid]'), answer = ws.order[ws.i];
    for (var i = 0; i < opts.length; i++) opts[i].addEventListener('click', function (e) {
      if (ws.answered) return; ws.answered = true;
      var ok = e.currentTarget.getAttribute('data-wsid') === answer; if (ok) ws.right++;
      for (var j = 0; j < opts.length; j++) { opts[j].disabled = true; if (opts[j].getAttribute('data-wsid') === answer) opts[j].classList.add('is-right'); }
      if (!ok) e.currentTarget.classList.add('is-wrong');
      var c = findPerson(answer);
      document.getElementById('ws-status').textContent = ok ? t('bt.guess.right') : tf('bt.guess.wrong', { name: c ? c.name : '' });
      document.getElementById('ws-acts').hidden = false;
      document.getElementById('ws-next').focus({ preventScroll: true });
    });
    var nx = document.getElementById('ws-next'); if (nx) nx.addEventListener('click', function () { ws.i++; ws.answered = false; route({ keepScroll: true }); });
  };

  /* ---- 3. Batch Bingo ---- */
  var BINGO_FIELDS = ['hometown', 'medSchool', 'languages', 'hobbies', 'shows', 'kdrama', 'movies', 'cartoons', 'anime', 'games', 'music', 'books', 'food', 'snack', 'dessert', 'comfortFood', 'sports', 'pets', 'travelled', 'bucketList', 'boardGames', 'karaoke', 'hiddenTalent', 'colour', 'pokemon', 'milkTea', 'superhero', 'dreamTrip', 'canCook', 'destress', 'animal'];
  function bingoPool(list) {
    var seen = {}, pool = [];
    list.forEach(function (c) {
      BINGO_FIELDS.forEach(function (k) {
        if (!filled(c, k)) return;
        var vals = (COMMON.exact.indexOf(k) >= 0 || k === 'hometown' || k === 'medSchool') ? [String(c[k]).trim()] : items(c[k]);
        vals.forEach(function (v) {
          if (v.length > 34) return;
          var id = k + '|' + v.toLowerCase(); if (seen[id]) return; seen[id] = 1;
          pool.push({ k: k, v: v });
        });
      });
    });
    return pool;
  }
  function bingoWho(sq, list) {
    var v = sq.v.toLowerCase();
    return list.filter(function (c) { return filled(c, sq.k) && (String(c[sq.k]).trim().toLowerCase() === v || items(c[sq.k]).some(function (x) { return x.toLowerCase() === v; })); });
  }
  function newBingo() {
    var list = others().length >= 2 ? others() : people(), pool = bingoPool(list), size = pool.length >= 24 ? 5 : pool.length >= 15 ? 4 : pool.length >= 8 ? 3 : 0;
    if (!size) { store.del('bingo'); return null; }
    var seed = Math.floor(Math.random() * 4294967296), rnd = mulberry(seed);
    // spread squares across people: round-robin over each person's own shuffled squares
    var byField = {}; shuffled(pool, rnd).forEach(function (s) { (byField[s.k] = byField[s.k] || []).push(s); });
    var keys = shuffled(Object.keys(byField), rnd), pick = [], need = size * size - (size % 2 ? 1 : 0);
    while (pick.length < need) { var any = false; keys.forEach(function (k) { if (pick.length < need && byField[k].length) { pick.push(byField[k].shift()); any = true; } }); if (!any) break; }
    pick = shuffled(pick, rnd);
    if (size % 2) pick.splice(Math.floor(size * size / 2), 0, { free: true });
    var b = { size: size, squares: pick, marks: size % 2 ? [Math.floor(size * size / 2)] : [], made: todayISO() };
    store.set('bingo', b); return b;
  }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function getBingo() {
    var b = store.get('bingo', null);
    if (!b || !Array.isArray(b.squares) || [3, 4, 5].indexOf(b.size) < 0 || b.squares.length !== b.size * b.size) return null;
    b.squares = b.squares.map(function (s) { return s && s.free ? { free: true } : { k: cleanText(s && s.k, 40), v: cleanText(s && s.v, 60) }; });
    b.marks = (Array.isArray(b.marks) ? b.marks : []).filter(function (i) { return i === +i && i >= 0 && i < b.size * b.size; });
    return b;
  }
  function bingoLines(b) {
    var n = b.size, lines = [], i, j, m = {}; b.marks.forEach(function (x) { m[x] = 1; });
    for (i = 0; i < n; i++) { var r = [], c = []; for (j = 0; j < n; j++) { r.push(i * n + j); c.push(j * n + i); } lines.push(r, c); }
    var d1 = [], d2 = []; for (i = 0; i < n; i++) { d1.push(i * n + i); d2.push(i * n + n - 1 - i); } lines.push(d1, d2);
    return lines.filter(function (l) { return l.every(function (x) { return m[x]; }); });
  }
  function bingoLabel(k) { var l = fieldLabel(k).replace(/^(favourite|favorite|paboritong|paborito)\s+/i, ''); return l.charAt(0).toUpperCase() + l.slice(1); }
  var bingoReveal = false;
  VIEWS.bingo = function () {
    var b = getBingo() || newBingo();
    var head = '<div class="wrap page bingo">' + crumb(t('nav.bingo')) + '<header class="page__head"><h1>' + esc(t('nav.bingo')) + '</h1><p>' + esc(t('bt.bingo.intro')) + '</p></header>';
    if (!b) return head + '<div class="empty"><p>' + esc(t('bt.bingo.notEnough')) + '</p></div></div>';
    var list = people(), won = bingoLines(b), inWin = {}; won.forEach(function (l) { l.forEach(function (x) { inWin[x] = 1; }); });
    return head + (won.length ? '<p class="bingo__win" role="status">' + esc(won.length === 1 ? t('bt.bingo.win') : tf('bt.bingo.winN', { n: won.length })) + '</p>' : '') +
      '<div class="bingo__grid bingo__grid--' + b.size + '" role="grid">' + b.squares.map(function (s, i) {
        var on = b.marks.indexOf(i) >= 0;
        if (s.free) return '<div class="bingo__sq is-free is-on' + (inWin[i] ? ' is-win' : '') + '" role="gridcell"><span class="bingo__v">' + esc(t('bt.bingo.free')) + '</span></div>';
        var wl = bingoReveal ? bingoWho(s, list).map(short) : [], who = wl.length > 2 ? wl.slice(0, 2).join(', ') + ' +' + (wl.length - 2) : wl.join(', ');
        return '<button type="button" class="bingo__sq' + (on ? ' is-on' : '') + (inWin[i] ? ' is-win' : '') + '" role="gridcell" aria-pressed="' + on + '" data-sq="' + i + '"><span class="bingo__k">' + esc(bingoLabel(s.k)) + '</span><span class="bingo__v">' + esc(s.v) + '</span>' + (who ? '<span class="bingo__who">' + esc(who) + '</span>' : '') + '</button>';
      }).join('') + '</div>' +
      '<p class="guess__acts"><button type="button" class="btn" id="bingo-reveal" aria-pressed="' + bingoReveal + '">' + esc(t(bingoReveal ? 'bt.bingo.hide' : 'bt.bingo.reveal')) + '</button><button type="button" class="btn" id="bingo-new">' + esc(t('bt.bingo.new')) + '</button></p>' +
      '<p class="muted">' + esc(t('bt.bingo.how')) + '</p></div>';
  };
  AFTER.bingo = function () {
    main.querySelectorAll('[data-sq]').forEach(function (el) {
      el.addEventListener('click', function () {
        var b = getBingo(); if (!b) return; var i = +el.getAttribute('data-sq'), at = b.marks.indexOf(i);
        if (at >= 0) b.marks.splice(at, 1); else b.marks.push(i);
        store.set('bingo', b); route({ keepScroll: true });
        var again = main.querySelector('[data-sq="' + i + '"]'); if (again) again.focus({ preventScroll: true });
      });
    });
    var r = document.getElementById('bingo-reveal'); if (r) r.addEventListener('click', function () { bingoReveal = !bingoReveal; route({ keepScroll: true }); });
    var n = document.getElementById('bingo-new'); if (n) n.addEventListener('click', function () { if (!window.confirm(t('bt.bingo.newConfirm'))) return; newBingo(); route({ keepScroll: true }); });
  };

  /* ---- 4. Batch twins ---- */
  function twins(all, max) {
    var pairs = [];
    for (var i = 0; i < all.length; i++) for (var j = i + 1; j < all.length; j++) {
      var hits = inCommon(all[i], all[j]); if (hits.length) pairs.push({ a: all[i], b: all[j], hits: hits });
    }
    return pairs.sort(function (x, y) { return y.hits.length - x.hits.length || byName(x.a, y.a); }).slice(0, max || 5);
  }
  function twinsHTML(all) {
    var tw = twins(all, 5);
    return '<h2>' + esc(t('bt.twins.h')) + '</h2><p class="muted">' + esc(t('bt.twins.intro')) + '</p>' + (tw.length ? '<div class="twins">' + tw.map(function (p, i) {
      return '<div class="card twin"><div class="twin__pair">' + avatar(p.a, 'avatar--sm') + avatar(p.b, 'avatar--sm') + '<div><strong>' + personLink(p.a) + ' &amp; ' + personLink(p.b) + '</strong><span class="muted">' + esc(tf(p.hits.length === 1 ? 'bt.twins.n1' : 'bt.twins.nN', { n: p.hits.length })) + (i === 0 ? ' · ' + esc(t('bt.twins.top')) : '') + '</span></div></div>' +
        '<ul class="twin__hits">' + p.hits.slice(0, 4).map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + (p.hits.length > 4 ? '<li class="muted">' + esc(tf('bt.twins.more', { n: p.hits.length - 4 })) + '</li>' : '') + '</ul></div>';
    }).join('') + '</div>' : '<div class="card"><p class="muted">' + esc(t('bt.twins.none')) + '</p></div>');
  }

  /* ---- 6. Icebreakers ---- */
  var ice = { mode: 'q', i: -1, deck: [], who: '', cardQ: null, revealed: false };
  function iceList() { var L = window.ICEBREAKERS || { en: [] }; return (L[lang] && L[lang].length === L.en.length) ? L[lang] : L.en; }
  function iceNext() {
    ice.revealed = false;
    var o = others();
    if (ice.mode === 'q') {
      if (!ice.deck.length) ice.deck = shuffled(iceList().map(function (x, i) { return i; }));
      ice.i = ice.deck.shift();
      ice.who = o.length ? o[Math.floor(Math.random() * o.length)].id : '';
    } else {
      var pool = [];
      o.forEach(function (c) { (window.GUESS_FIELDS || []).forEach(function (k) { if (filled(c, k)) pool.push({ id: c.id, k: k }); }); });
      ice.cardQ = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    }
  }
  VIEWS.icebreakers = function () {
    if (ice.mode === 'q' ? ice.i < 0 : !ice.cardQ) iceNext();
    var modes = '<div class="filters" role="group">' + [['q', 'bt.ice.modeQ'], ['card', 'bt.ice.modeCard']].map(function (m) { return '<button type="button" class="filter" data-ice="' + m[0] + '" aria-pressed="' + (ice.mode === m[0]) + '">' + esc(t(m[1])) + '</button>'; }).join('') + '</div>';
    var body;
    if (ice.mode === 'q') {
      var who = ice.who && findPerson(ice.who);
      body = '<div class="card guess__card ice"><p class="guess__ask">' + esc(t('bt.ice.ask')) + '</p><blockquote class="guess__clue ice__q">' + esc(iceList()[ice.i] || '') + '</blockquote>' +
        (who ? '<div class="today__pl">' + avatar(who, 'avatar--sm') + '<p>' + esc(tf('bt.ice.askWho', { name: short(who) })) + '</p></div>' : '') +
        '<p class="guess__acts"><button type="button" class="btn btn--solid" id="ice-next">' + esc(t('bt.ice.next')) + '</button>' + (who ? '<button type="button" class="btn" id="ice-who">' + esc(t('bt.ice.otherWho')) + '</button>' : '') + '</p></div>';
    } else if (!ice.cardQ) body = '<div class="empty"><p>' + esc(t('bt.ice.noCards')) + '</p></div>';
    else {
      var c = findPerson(ice.cardQ.id), k = ice.cardQ.k;
      body = '<div class="card guess__card ice"><p class="guess__ask">' + esc(t('bt.ice.ask')) + '</p><div class="today__pl">' + avatar(c) + '<blockquote class="guess__clue ice__q">' + esc(tf('bt.ice.cardQ', { name: short(c), field: fieldLabel(k).toLowerCase() })) + '</blockquote></div>' +
        (ice.revealed ? '<p class="ice__a"><span class="today__fk">' + esc(t('bt.ice.theirCard')) + '</span>' + esc(c[k]).replace(/\n/g, '<br>') + '</p>' : '') +
        '<p class="guess__acts"><button type="button" class="btn btn--solid" id="ice-next">' + esc(t('bt.ice.next')) + '</button>' + (!ice.revealed ? '<button type="button" class="btn" id="ice-reveal">' + esc(t('bt.ice.reveal')) + '</button>' : '') + '<a class="btn" href="#/person/' + encodeURIComponent(c.id) + '">' + esc(t('bt.guess.open')) + '</a></p></div>';
    }
    return '<div class="wrap page guess">' + crumb(t('nav.icebreakers')) + '<header class="page__head"><h1>' + esc(t('nav.icebreakers')) + '</h1><p>' + esc(t('bt.ice.intro')) + '</p></header>' + modes + body + '</div>';
  };
  AFTER.icebreakers = function () {
    main.querySelectorAll('[data-ice]').forEach(function (b) { b.addEventListener('click', function () { ice.mode = b.getAttribute('data-ice'); iceNext(); route({ keepScroll: true }); }); });
    var nx = document.getElementById('ice-next'); if (nx) nx.addEventListener('click', function () { iceNext(); route({ keepScroll: true }); var a = document.getElementById('ice-next'); if (a) a.focus({ preventScroll: true }); });
    var w = document.getElementById('ice-who'); if (w) w.addEventListener('click', function () { var o = others().filter(function (c) { return c.id !== ice.who; }); if (o.length) ice.who = o[Math.floor(Math.random() * o.length)].id; route({ keepScroll: true }); });
    var rv = document.getElementById('ice-reveal'); if (rv) rv.addEventListener('click', function () { ice.revealed = true; route({ keepScroll: true }); });
  };

  /* ---- 7. Hometown map (offline outline + place table in data/places.js) ---- */
  function normPlace(s) { return ' ' + String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\bsta\.?\s/g, 'santa ').replace(/\bsto\.?\s/g, 'santo ').replace(/\bmt\.?\s/g, 'mountain ').replace(/\bgen\.?\s/g, 'general ').replace(/[^a-z0-9ñ]+/g, ' ').replace(/\s+/g, ' ') + ' '; }
  var placeIdx = null;
  function placeIndex() {
    if (placeIdx) return placeIdx;
    placeIdx = (window.PH_PLACES || []).map(function (p) { return { p: p, names: [p.n].concat(p.aka || []).map(normPlace).map(function (s) { return s.trim(); }).filter(Boolean), prov: normPlace(p.p).trim() }; });
    return placeIdx;
  }
  function locate(hometown) {
    var h = normPlace(hometown); if (h.trim().length < 2) return null;
    var best = null, bestScore = -1;
    placeIndex().forEach(function (e) {
      e.names.forEach(function (n) {
        if (h.indexOf(' ' + n + ' ') < 0) return;
        var score = n.length + (e.p.kind === 'province' ? 0 : 100) + (e.prov && e.p.kind !== 'province' && h.indexOf(' ' + e.prov + ' ') >= 0 ? 200 : 0);
        if (score > bestScore) { bestScore = score; best = e.p; }
      });
    });
    return best;
  }
  var mapSel = '';
  VIEWS.map = function () {
    var all = people(), M = window.PH_MAP;
    var head = '<div class="wrap page map">' + crumb(t('nav.map')) + '<header class="page__head"><h1>' + esc(t('nav.map')) + '</h1><p>' + esc(t('bt.map.intro')) + '</p></header>';
    if (!M) return head + '<div class="empty"><p>' + esc(t('bt.map.noData')) + '</p></div></div>';
    var spots = {}, off = [], none = [];
    all.forEach(function (c) {
      if (!filled(c, 'hometown')) { none.push(c); return; }
      var p = locate(c.hometown); if (!p) { off.push(c); return; }
      var key = p.n + '|' + p.p; (spots[key] = spots[key] || { p: p, who: [] }).who.push(c);
    });
    var list = Object.keys(spots).map(function (k) { return spots[k]; }).sort(function (a, b) { return b.who.length - a.who.length || a.p.n.localeCompare(b.p.n); });
    if (mapSel && !spots[mapSel]) mapSel = '';
    var hosp = (window.PH_PLACES || []).filter(function (p) { return p.n === 'Mariveles'; })[0];
    var svg = '<svg class="map__svg" viewBox="0 0 ' + M.w + ' ' + M.h + '" role="img" aria-label="' + esc(t('bt.map.aria')) + '"><path class="map__land" d="' + M.path + '"/>' +
      (hosp ? '<g class="map__hosp" transform="translate(' + hosp.x + ' ' + hosp.y + ')"><path d="M0-9l2.6 5.6 6.1.7-4.5 4.2 1.2 6L0 4.5-5.4 7.5l1.2-6-4.5-4.2 6.1-.7z"/></g>' : '') +
      list.slice().reverse().map(function (s) {
        var key = s.p.n + '|' + s.p.p, r = 7 + Math.sqrt(s.who.length) * 5;
        return '<g class="map__spot' + (mapSel === key ? ' is-sel' : '') + '" tabindex="0" role="button" data-spot="' + esc(key) + '" aria-label="' + esc(s.p.n + ': ' + s.who.length) + '"><circle cx="' + s.p.x + '" cy="' + s.p.y + '" r="' + r.toFixed(1) + '"/>' + (s.who.length > 1 ? '<text x="' + s.p.x + '" y="' + s.p.y + '" dy=".35em">' + s.who.length + '</text>' : '') + '</g>';
      }).join('') + '</svg>';
    var listHTML = list.map(function (s) {
      var key = s.p.n + '|' + s.p.p;
      return '<li' + (mapSel === key ? ' class="is-sel"' : '') + ' id="spot-' + esc(key.replace(/[^A-Za-z0-9]/g, '-')) + '"><button type="button" class="link-btn" data-spot="' + esc(key) + '"><strong>' + esc(s.p.n) + '</strong>' + (s.p.kind !== 'province' && s.p.p !== s.p.n ? ' <span class="muted">' + esc(s.p.p) + '</span>' : '') + ' · ' + s.who.length + '</button><span class="map__who">' + s.who.map(personLink).join(', ') + '</span></li>';
    }).join('');
    return head + '<div class="map__wrap"><div class="card map__card">' + svg + '<p class="muted map__legend">' + (hosp ? icon('star', 'map__star') + esc(t('bt.map.hosp')) + ' · ' : '') + esc(t('bt.map.tap')) + '</p></div>' +
      '<div><h2 style="margin-top:0">' + esc(tf('bt.map.places', { n: list.length })) + '</h2><div class="card"><ul class="plain map__list">' + (listHTML || '<li class="muted">' + esc(t('bt.map.empty')) + '</li>') + '</ul></div>' +
      (off.length ? '<h2>' + esc(t('bt.map.off')) + '</h2><div class="card"><p class="muted">' + esc(t('bt.map.offHint')) + '</p><ul class="plain">' + off.map(function (c) { return '<li>' + personLink(c) + ' <span class="muted">· ' + esc(c.hometown) + '</span></li>'; }).join('') + '</ul></div>' : '') +
      (none.length ? '<p class="muted">' + esc(tf('bt.map.none', { n: none.length })) + '</p>' : '') + '</div></div>' +
      '<p class="muted map__src">' + esc(t('bt.map.src')) + '</p></div>';
  };
  AFTER.map = function () {
    main.querySelectorAll('[data-spot]').forEach(function (el) {
      function pick() { var k = el.getAttribute('data-spot'); mapSel = mapSel === k ? '' : k; route({ keepScroll: true }); var li = mapSel && document.getElementById('spot-' + mapSel.replace(/[^A-Za-z0-9]/g, '-')); if (li && el.tagName.toLowerCase() === 'g') li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      el.addEventListener('click', pick);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
  };

  /* ---- 8. Batch Wrapped ---- */
  var wrapI = 0;
  function topOf(all, fn) { var r = countBy(all, fn); return r.length && r[0].n >= 2 ? r[0] : null; }
  function wrappedSlides(all, today) {
    var S = [], bn = batchName() || t('bt.wrap.theBatch'), yr = today.getFullYear();
    var towns = countBy(all, function (c) { return c.hometown ? [c.hometown] : []; }), schools = countBy(all, function (c) { return c.medSchool ? [c.medSchool] : []; }), langs = countBy(all, function (c) { return items(c.languages); });
    S.push({ k: tf('bt.wrap.k0', { year: yr }), big: bn, sub: t('bt.wrap.s0') });
    S.push({ k: t('bt.wrap.k1'), big: String(all.length), sub: t('bt.wrap.s1'), rows: [[towns.length, t('bt.wrap.towns')], [schools.length, t('bt.wrap.schools')], [langs.length, t('bt.wrap.langs')]].filter(function (r) { return r[0]; }).map(function (r) { return r[0] + ' ' + r[1]; }) });
    var mon = countBy(all, function (c) { return c.bmonth ? [monthName(c.bmonth)] : []; });
    if (mon.length) {
      var zs = topOf(all, function (c) { return zodiac(c) ? [zodiac(c)] : []; });
      S.push({ k: t('bt.wrap.k2'), big: mon[0].label, sub: tf(mon[0].n === 1 ? 'bt.wrap.s2one' : 'bt.wrap.s2', { n: mon[0].n }), rows: zs ? [tf('bt.wrap.zodiac', { sign: zs.label, n: zs.n })] : [] });
    }
    var yrs = all.filter(function (c) { return c.byear; }).map(function (c) { return c.byear; });
    if (yrs.length > 1) { var lo = Math.min.apply(null, yrs), hi = Math.max.apply(null, yrs); if (hi > lo) S.push({ k: t('bt.wrap.k3'), big: lo + '–' + hi, sub: tf('bt.wrap.s3', { n: hi - lo + 1 }) }); }
    var favs = [['food', 'bt.wrap.food'], ['shows', 'bt.wrap.shows'], ['music', 'bt.wrap.music'], ['movies', 'bt.wrap.movies'], ['games', 'bt.wrap.games'], ['hobbies', 'bt.wrap.hobbies']].map(function (f) { var top = topOf(all, function (c) { return items(c[f[0]]); }); return top ? tf(f[1], { v: top.label, n: top.n }) : ''; }).filter(Boolean);
    if (favs.length) S.push({ k: t('bt.wrap.k4'), big: t('bt.wrap.b4'), rows: favs });
    if (towns.length && towns[0].n >= 2) S.push({ k: t('bt.wrap.k5'), big: towns[0].label, sub: tf('bt.wrap.s5', { n: towns[0].n }) });
    var tw = twins(all, 1)[0];
    if (tw) S.push({ k: t('bt.twins.h'), big: short(tw.a) + ' & ' + short(tw.b), sub: tf(tw.hits.length === 1 ? 'bt.twins.n1' : 'bt.twins.nN', { n: tw.hits.length }), rows: tw.hits.slice(0, 3), pair: [tw.a, tw.b] });
    var pls = 0; all.forEach(function (c) { pls += c.playlists.length; });
    if (pls) S.push({ k: t('bt.wrap.k6'), big: String(pls), sub: t(pls === 1 ? 'bt.wrap.s6one' : 'bt.wrap.s6') });
    var r = residencyDay(today);
    S.push({ k: t('bt.wrap.k7'), big: r && !r.before ? tf('bt.day.dayN', { n: r.days.toLocaleString() }) : bn, sub: t('bt.wrap.s7') });
    return S;
  }
  VIEWS.wrapped = function () {
    var all = people(), today = new Date();
    var head = '<div class="wrap page wrapped-page">' + crumb(t('nav.wrapped')) + '<header class="page__head"><h1>' + esc(t('nav.wrapped')) + '</h1><p>' + esc(t('bt.wrap.intro')) + '</p></header>';
    if (all.length < 2) return head + '<div class="empty"><p>' + esc(t('bt.wrap.notEnough')) + '</p></div></div>';
    var S = wrappedSlides(all, today); if (wrapI >= S.length) wrapI = S.length - 1; if (wrapI < 0) wrapI = 0;
    var s = S[wrapI];
    return head + '<section class="wrapped wrapped--' + (wrapI % 4) + '" aria-roledescription="slide" aria-label="' + esc((wrapI + 1) + ' / ' + S.length) + '">' +
      '<div class="wrapped__dots" aria-hidden="true">' + S.map(function (x, i) { return '<span' + (i === wrapI ? ' class="is-on"' : '') + '></span>'; }).join('') + '</div>' +
      '<p class="wrapped__k">' + esc(s.k) + '</p>' + (s.pair ? '<div class="wrapped__pair">' + avatar(s.pair[0], 'avatar--lg') + avatar(s.pair[1], 'avatar--lg') + '</div>' : '') +
      '<p class="wrapped__big">' + esc(s.big) + '</p>' + (s.sub ? '<p class="wrapped__sub">' + esc(s.sub) + '</p>' : '') +
      (s.rows && s.rows.length ? '<ul class="wrapped__rows">' + s.rows.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      '</section><p class="guess__acts wrapped__nav"><button type="button" class="btn" id="wr-prev"' + (wrapI === 0 ? ' disabled' : '') + '>' + esc(t('bt.wrap.prev')) + '</button><span class="muted">' + (wrapI + 1) + ' / ' + S.length + '</span>' +
      (wrapI < S.length - 1 ? '<button type="button" class="btn btn--solid" id="wr-next">' + esc(t('bt.wrap.next')) + '</button>' : '<button type="button" class="btn btn--solid" id="wr-again">' + esc(t('bt.wrap.again')) + '</button>') + '</p>' +
      '<p class="muted">' + esc(t('bt.wrap.note')) + '</p></div>';
  };
  function wrapGo(d) { wrapI += d; route({ keepScroll: true }); var b = document.getElementById(d < 0 ? 'wr-prev' : 'wr-next') || document.getElementById('wr-again') || document.getElementById('wr-prev'); if (b && !b.disabled) b.focus({ preventScroll: true }); }
  AFTER.wrapped = function () {
    var p = document.getElementById('wr-prev'), n = document.getElementById('wr-next'), a = document.getElementById('wr-again'), sec = main.querySelector('.wrapped');
    if (p) p.addEventListener('click', function () { wrapGo(-1); });
    if (n) n.addEventListener('click', function () { wrapGo(1); });
    if (a) a.addEventListener('click', function () { wrapI = 0; route({ keepScroll: true }); });
    if (sec) {   // swipe left / right on the slide
      var x0 = null;
      sec.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      sec.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) { if (dx < 0 && n) wrapGo(1); else if (dx > 0 && p && !p.disabled) wrapGo(-1); } });
    }
  };
  document.addEventListener('keydown', function (e) {
    if (currentKey() !== 'wrapped' || e.altKey || e.metaKey || e.ctrlKey || /input|textarea|select/i.test((e.target && e.target.tagName) || '')) return;
    if (e.key === 'ArrowRight' && document.getElementById('wr-next')) wrapGo(1);
    else if (e.key === 'ArrowLeft' && document.getElementById('wr-prev') && !document.getElementById('wr-prev').disabled) wrapGo(-1);
  });

  TITLES.person = function () { return t('nav.batch'); };
  rebuildIndex();

  /* ===== Router ===== */
  function parts() {
    var h = location.hash.replace(/^#\/?/, '');
    return h.split('/').filter(Boolean).map(function (p) { try { return decodeURIComponent(p); } catch (e) { return p; } });
  }
  function titleFor(key) {
    if (has(TITLES, key)) return typeof TITLES[key] === 'function' ? TITLES[key]() : TITLES[key];
    if (has(SHELL_TITLES, key)) return t(SHELL_TITLES[key]);
    for (var i = 0; i < NAV.length; i++) if (NAV[i].href === '#/' + key) return navLabel(NAV[i]);
    return key;
  }
  function setView(key, html, title) {
    main.innerHTML = html;
    document.title = title ? title + ' — ' + APP_NAME : APP_NAME;
    buildNav();
    updateNavBadges();
  }
  function route(opts) {
    opts = opts || {};
    closeSuggest(); closeDrawer();
    var p = parts(), key = p.length ? p[0] : 'home', restoreY = null;
    if (!opts.keepScroll) {
      scrollMemo[scrollKey] = window.scrollY;                 // the page we are leaving
      scrollKey = location.hash || '#/';
      restoreY = fromHistory && scrollMemo.hasOwnProperty(scrollKey) ? scrollMemo[scrollKey] : null;
      fromHistory = false;
    }
    var html, title, args = p.slice(1);
    if (key !== 'missing' && Object.prototype.hasOwnProperty.call(VIEWS, key) && typeof VIEWS[key] === 'function') {
      html = VIEWS[key].apply(null, args); title = titleFor(key);
    } else {
      key = 'missing'; html = missingView(); title = t('notfound.title');
    }
    setView(key, html, title);
    if (AFTER[key]) AFTER[key].apply(null, args);
    if (opts.focus) main.focus({ preventScroll: true });
    if (opts.keepScroll) return;
    if (restoreY !== null) { window.requestAnimationFrame(function () { window.scrollTo(0, restoreY); }); return; }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () { syncHist(); route({ focus: true }); });
  main.addEventListener('change', function (e) {   // About > Settings
    var n = e.target && e.target.name, v = e.target && e.target.value;
    if (n === 'lang') { setLang(v); var again = main.querySelector('input[name="lang"]:checked'); if (again) again.focus(); }
    else if (n === 'theme') setTheme(v);
    else if (n === 'aboutTextSize') { store.set('textSize', v); applyTextSize(v); }
    else if (n === 'batchName') store.set('batchName', cleanText(v, 60));
    else if (n === 'startDate') { if (/^\d{4}-\d{2}-\d{2}$/.test(v)) store.set('startDate', v); else store.del('startDate'); }
  });
  main.addEventListener('click', function (e) {
    var f = e.target.closest ? e.target.closest('.search-page .filter[data-kind]') : null;
    if (f) { searchKind = f.getAttribute('data-kind'); route({ keepScroll: true }); }
  });

  /* ===== Mobile tab bar: hides on scroll down, shows on scroll up ===== */
  (function initTabbar() {
    var lastY = window.scrollY, hold = 0, ticking = false;
    // Guard both: classList.add/remove rewrite the attribute even when nothing changes,
    // which would re-fire the MutationObserver below forever.
    function show() { if (document.body.classList.contains('tabbar-hidden')) document.body.classList.remove('tabbar-hidden'); }
    function hide() { if (!document.body.classList.contains('tabbar-hidden')) document.body.classList.add('tabbar-hidden'); }
    function update() {
      ticking = false;
      var y = window.scrollY, dy = y - lastY, max = document.documentElement.scrollHeight - window.innerHeight;
      var a = document.activeElement;
      var typing = !!(a && a.matches && a.matches('input, textarea, select'));
      if (Date.now() < hold || document.body.classList.contains('drawer-open') || typing || y < 80 || y > max - 80) { show(); lastY = y; }
      else if (dy > 10) { hide(); lastY = y; }
      else if (dy < -6) { show(); lastY = y; }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('hashchange', function () { hold = Date.now() + 700; show(); });
    document.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches('input, textarea, select')) show(); });
    new MutationObserver(function () { if (document.body.classList.contains('drawer-open')) show(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ===== Backup: export / import / undo (everything stored under PREFIX) ===== */
  var BK_APP = 'batchtickler', BK_UNDO = BK_APP + ':undo-import';
  function bkCollect() {
    var data = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) data[k.slice(PREFIX.length)] = localStorage.getItem(k);
      }
    } catch (e) {}
    return data;
  }
  function bkReplace(data) {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(PREFIX) === 0) keys.push(k); }
    keys.forEach(function (k) { localStorage.removeItem(k); });
    Object.keys(data).forEach(function (k) { localStorage.setItem(PREFIX + k, data[k]); });
  }
  function bkSummary(data) {
    var n = Object.keys(data || {}).filter(function (k) { return k !== 'lastBackup'; }).length;
    return n ? tf(n === 1 ? 'backup.item1' : 'backup.itemN', { n: n }) : t('backup.nothing');
  }
  function bkDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(locale(), { year: 'numeric', month: 'short', day: 'numeric' }) + ', ' + d.toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' });
  }
  function bkStatus(msg, isErr) {
    var el = document.getElementById('bk-status');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('is-error', !!isErr);
  }
  function bkPaint() {
    var meta = document.getElementById('bk-meta'), un = document.getElementById('bk-undo');
    var last = store.get('lastBackup', null);
    if (meta) meta.textContent = tf('backup.onDevice', { summary: bkSummary(bkCollect()) }) + ' ' + (last && bkDate(last) ? tf('backup.lastExported', { date: bkDate(last) }) : t('backup.notExported'));
    var has = false;
    try { has = !!localStorage.getItem(BK_UNDO); } catch (e) {}
    if (un) un.hidden = !has;
  }
  function bkExport() {
    var now = new Date();
    store.set('lastBackup', now.toISOString());
    var data = bkCollect();
    var payload = { app: BK_APP, format: 1, exported: now.toISOString(), attribution: ATTRIBUTION, summary: bkSummary(data), data: data };
    var name = BK_APP + '-backup-' + now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate()) + '.json';
    var json = JSON.stringify(payload, null, 1);
    var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
    var file = null;
    try { file = new File([json], name, { type: 'application/json' }); } catch (e) {}
    if (standalone && file && navigator.canShare && navigator.canShare({ files: [file] })) {
      // Installed apps on phones cannot always download files; the share sheet can save to Files or send it on.
      navigator.share({ files: [file], title: tf('backup.shareTitle', { app: APP_NAME }) }).then(function () {
        bkStatus(t('backup.shared')); bkPaint();
      }).catch(function () { bkStatus(t('backup.exportCancelled')); });
      return;
    }
    var url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    var a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    bkStatus(tf('backup.saved', { name: name }));
    bkPaint();
  }
  function bkImport(file) {
    if (!file) return;
    var reader = new FileReader();
    var bad = tf('backup.notBackup', { app: APP_NAME });
    reader.onerror = function () { bkStatus(t('backup.unreadable'), true); };
    reader.onload = function () {
      var p;
      try { p = JSON.parse(reader.result); } catch (e) { bkStatus(bad, true); return; }
      var ok = p && p.app === BK_APP && p.data && typeof p.data === 'object' &&
        Object.keys(p.data).every(function (k) { return typeof p.data[k] === 'string' && k.length < 80; });
      if (ok) Object.keys(p.data).forEach(function (k) { try { JSON.parse(p.data[k]); } catch (e) { ok = false; } });
      if (!ok) { bkStatus(bad, true); return; }
      var msg = tf('backup.confirmImport', { date: bkDate(p.exported) || t('backup.unknownDate'), backup: bkSummary(p.data), device: bkSummary(bkCollect()) });
      if (!window.confirm(msg)) { bkStatus(t('backup.importCancelled')); return; }
      try {
        localStorage.setItem(BK_UNDO, JSON.stringify({ saved: new Date().toISOString(), data: bkCollect() }));
        bkReplace(p.data);
      } catch (e) { bkStatus(t('backup.importFailed'), true); return; }
      bkStatus(t('backup.imported'));
      setTimeout(function () { location.reload(); }, 700);
    };
    reader.readAsText(file);
  }
  function bkUndo() {
    var snap; try { snap = JSON.parse(localStorage.getItem(BK_UNDO)); } catch (e) {}
    if (!snap || !snap.data) { bkPaint(); return; }
    if (!window.confirm(tf('backup.confirmUndo', { summary: bkSummary(snap.data) }))) return;
    try { bkReplace(snap.data); localStorage.removeItem(BK_UNDO); } catch (e) { bkStatus(t('backup.undoFailed'), true); return; }
    bkStatus(t('backup.restored'));
    setTimeout(function () { location.reload(); }, 700);
  }
  (function initBackup() {
    var ex = document.getElementById('bk-export'), fi = document.getElementById('bk-file'), un = document.getElementById('bk-undo');
    if (!ex || !fi) return;
    ex.addEventListener('click', bkExport);
    fi.addEventListener('change', function () { bkImport(fi.files && fi.files[0]); fi.value = ''; });
    if (un) un.addEventListener('click', bkUndo);
    bkPaint();
  })();

  /* ===== Language switching: static markup (data-i18n / data-i18n-attr in index.html), then re-render ===== */
  function applyStatic() {
    document.documentElement.setAttribute('lang', lang);
    var els = document.querySelectorAll('[data-i18n]'), i, v;
    for (i = 0; i < els.length; i++) { v = t(els[i].getAttribute('data-i18n')); if (v !== els[i].getAttribute('data-i18n')) els[i].textContent = v; }
    els = document.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < els.length; i++) {
      var pairs = els[i].getAttribute('data-i18n-attr').split(';');
      for (var j = 0; j < pairs.length; j++) {
        var at = pairs[j].indexOf(':'), key = pairs[j].slice(at + 1);
        if (at > 0 && t(key) !== key) els[i].setAttribute(pairs[j].slice(0, at), t(key));
      }
    }
    var brand = document.querySelector('.brand');
    if (brand) brand.setAttribute('aria-label', tf('brand.home', { name: APP_NAME }));
    var panel = document.getElementById('textSizePanel');
    if (panel) panel.setAttribute('aria-label', t('textsize.title'));
    labelCollapse();
    applyTheme(getTheme());
  }
  function setLang(l) {
    lang = l === 'tl' ? 'tl' : 'en';
    store.set('lang', lang);
    applyStatic();
    bkPaint();
    rebuildIndex();
    var panel = document.getElementById('textSizePanel');
    if (panel && !panel.hidden) { panel.hidden = true; var tb = document.getElementById('textSizeBtn'); if (tb) tb.setAttribute('aria-expanded', 'false'); }
    route({ keepScroll: true });   // re-render the current view and the menu in the new language
  }

  /* ===== Start ===== */
  applyStatic();
  route();

  /* ===== Service worker (https or localhost only) ===== */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
