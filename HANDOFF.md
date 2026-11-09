# Handoff — isaymotion apps: Batch Tickler 1.6.0 shipped; design rollout done

Written 2026-11-07 (00:05). Previous chats: built the `isaymotion-app-design` skill, restyled all six live apps, fixed the service-worker bug in all eight repos; this chat built Batch Tickler from scratch and shipped 1.0.0 → 1.6.0 in one evening.

## 1. Project and audience
- Owner: Dr. Ma. Isabella P. Navarro, incoming psychiatry resident, Mariveles Mental Wellness and General Hospital. Works from iPhone/iPad; short step-by-step replies; one question at a time.
- Apps: plain HTML/CSS/JS on GitHub Pages, all under **one origin** `https://isaymotion.github.io/`. Repos (org `isaymotion`): `sheatrainer`, `KaplanStudy`, `Stahl`, `DSMVapp`, `MSEtrainer`, `Tagalog` (Usap Tayo), `case-psychinterview` (PsychInterview), `102526` (Case Rehearsal), **`tickler` (Batch Tickler)**. Default branch `main`; pushing to `main` publishes.
- **This Project is "Batch Tickler"**: a directory for incoming residents to get to know each other. Repo **isaymotion/tickler**, live at `https://isaymotion.github.io/tickler/` once she switches Pages on (Settings → Pages → Deploy from a branch → main / root). Pages could not be enabled from the session (API path blocked).
- Skills in her account (always load both for app work): `isaymotion-app-design` (shell, tokens, starter, scripts) and `isaymotion-study-app` (features, content rules, delivery). Others defer to those two.

## 2. Fixed rules (never change)
- Attribution, exact, in every app footer: `App created by Isabella Navarro, MD. Latest version <Month YYYY>. isaymotion@gmail.com` (email as mailto link). Only the month changes.
- `window.SHOW_OTHER_APPS = false` in every app — she does **not** want the apps interlinked yet. The APP_LINKS list stays in `data/app-meta.js`, hidden. (Batch Tickler is not yet in the other apps' APP_LINKS lists — add `{ name: 'Batch Tickler', href: 'https://isaymotion.github.io/tickler/' }` when she flips the switch.)
- Service worker: deletes only caches starting with its own PREFIX; cache name changes every publish. `check_sw.py` is a blocker. Prefixes in use: `stahl-companion-`, `dsm-companion-`, `kaplan-study-`, `sheatrainer-`, `mse-trainer-`, `usaptayo-` (+ kept `usaptayo-audio`), `case-mse-`, `rehearse-`, **`batchtickler-`**.
- Storage prefixes in use (never reuse): `sp:v1:` Stahl, `dsm:v1:` DSM, `ks:v1:` Kaplan, `sheatrainer:v1:` + `pit.progress.v1` Shea, `mse:v1:` + `mse-trainer-v1`/`-session` MSE, `usaptayo.v1` Usap Tayo, **`bt:v1:` Batch Tickler**. Progress keys are never migrated away; use `migrateKeys()` only when a prefix must change.
- Hues: Stahl green 155, DSM maroon 350, Kaplan indigo 235, MSE plum 325, Shea forest 150, Usap Tayo navy 222 with gold, **Batch Tickler teal 185** (generator's accent came out blue #1D4EAF / dark #3E77EA — kept, it reads fine with teal). New apps pick a free hue (`scripts/palette.py` warns on clashes).
- Tagalog interface strings in every `data/strings.js` are **drafts** marked `// Tagalog draft — Dr. Navarro reviews before release`. Batch Tickler added ~230 `bt.*` and `nav.*` keys in both languages; unreviewed.
- Study content only from the source book; hospital forms carry hospital name + form number; no accounts, servers or tracking.
- Her stated preference: use subagents (Sonnet/Opus) for simpler tasks; Claude keeps design, clinical content decisions and final review.
- Commits: author `Isabella Navarro <isaymotion@gmail.com>`, plain descriptive message, plus the Claude co-author lines the session provides.

## 3. Architecture and formats
Standard repo layout (all apps):
```
index.html  css/app.css (Usap Tayo keeps css/style.css)  js/app.js (+ app-specific js)
data/app-meta.js   window.APP_META {name, short, tagline, version, repo, attribution}; SHOW_OTHER_APPS; APP_LINKS; (MIGRATE_KEYS example)
data/changelog.js  window.APP_CHANGELOG = [{version, date, title, items:[{type, text, href?}]}]  newest first
data/hospital.js   window.HOSPITAL {name, shortName, program, province, posts, yearLevels, formPrefix}
data/strings.js    window.STRINGS {en:{...}, tl:{...}}  UI strings for t()
data/*.js          app content, one global per file
sw.js  manifest.webmanifest  icons/  README.md  .nojekyll
```
Shell conventions: Companion token names; dark tokens in BOTH `:root[data-theme="dark"]` and the `prefers-color-scheme` block; 3-state theme; index-stamped back/forward + Alt+←/→; hash routes; `VIEWS` + `NAV` + `AFTER` pattern; topbar order ☰, sidebar toggle, back, forward, brand, search, Aa, theme; unseen What's New badge; backup panel with confirm + undo + share-sheet fallback.

**Batch Tickler specifics** (`js/app.js`, section "BATCH TICKLER SCREENS" + "1.3.0" block; `data/fields.js` = `CARD_GROUPS`, `CARD_FIELDS` (78 fields, each `{key, group, type, print, icon, base?}`), `GUESS_FIELDS`, `COMMON_FIELDS`, `PLAYLIST_MAX`):
- Data: owner's card under store key `me`; imported cards under `batch` (array); `batchName` (string), `banner` (data URL, home hero override), `guessBoard` (leaderboard). Card = `{id, name, bmonth, bday, byear, photo (data:image/jpeg ≤320px square), updated, <every CARD_FIELDS key as string>, custom:[{label,value}] ≤12, playlists:[{label,url}] ≤5}`. `sanitizeCard()` whitelists everything on every read and import; field types: `text | textarea | tel | email | year | url` (`url` = full http(s) URL or bare handle; `base` builds the link; `javascript:` etc. dropped). Playlist URLs must be `https://open.spotify.com/…` or `https://spotify.link/…`. Zodiac (Western + Chinese) is computed from the birthday, not stored.
- Adding a field = one line in `CARD_FIELDS` + `bt.f.<key>` in both languages in `data/strings.js` (a node one-liner checks parity; see §5). Groups: basics, background, favourites, life, contact (contact = `print:false`, in-app only).
- Screens: `#/batch` (grid, filter, sort name/birthday/hometown), `#/person/<id>` (grouped facts, Things in common vs. my card, playlists, account links, zodiac, add-to-calendar, remove), `#/me` (collapsible groups with counts, completeness meter, custom fields, playlists, photo centre-cropped via canvas), `#/birthdays` (+ whole-batch .ics), `#/share` (share my card file / Show my QR / import / share whole batch), `#/scan` (camera via getUserMedia + jsQR loaded on demand, or scan a screenshot), `#/stats`, `#/print` (batch sheet or name tags, 8 per A4), `#/guess` (clue→name, photo→name, name→birth month; rounds of 10; leaderboard on the phone), `#/about` (settings incl. batch name + batch photo).
- Card files: `{app:'batchtickler', kind:'card', card}` / `{kind:'batch', cards:[…]}` / footer backup payload / compact QR `{a:'bt',k:'card',c}` (text only, fields trimmed to 160 chars, dropped from the end past ~2.2 KB). Merge matches id, then exact name; newer `updated` wins; own card never overwritten.
- Vendored libs in `js/vendor/`: `qrcode.js` (qrcode-generator 2.0.4 + UTF-8 patch, MIT) loaded in index.html; `jsQR.js` (1.4.0, Apache-2.0, LICENSE file alongside) loaded only on Scan. Both precached by sw.js.
- Home hero uses her pixel banner `img/banner.jpg` (+ `banner-small.jpg`) unless a batch photo is set; app icons generated from her pixel brain icon (`icons/icon-source.png`, white corners made transparent; maskable bg `#3E5BB8`).
- New shared components introduced (worth folding into the design skill's `components.md` / starter CSS): `.field` family (inputs, selects, textareas, `--sm`, `--inline`, `__tag`), `.fgroup` (collapsible `<details>` section with counts), `.custom-row`, `.avatar` sizes, `.pcard`, `.fact`, `.stat`, `.bars/.bar` (horizontal count bars), `.sheet` + `.tags/.tag` print layouts, `.qr`, `.hero--banner`.
- Tagalog: ~230 `bt.*`/`nav.*` draft strings, unreviewed.

## 4. Recipes
**New app:** `python scripts/new_app.py --name … --repo … --hue … --tagline … --purpose … --out ./X` → screens as `VIEWS`/`NAV`/`AFTER` → icon (`make_icons.py`; needs `pip install cairosvg` for SVG sources) → `check_design.py ./X --browser` PASS → create repo / `add_repo` with push → push `main` → she enables Pages.

**Change to an existing app (incl. Batch Tickler):** clone `main` fresh; edit; bump `APP_META.version`, `changelog.js` top entry, `sw.js` VERSION (all three agree); update "Latest version <Month YYYY>" if the month changed (index.html footer, app-meta.js, README); `check_sw.py` + `check_design.py --browser`; commit; push `main`.

## 5. Commands
```
SKILL=<path of isaymotion-app-design>   # synced under /root/.claude/skills/synced/…; if missing, ask her to re-save the skill
python3 $SKILL/scripts/check_sw.py <repo> [<repo>…]
python3 $SKILL/scripts/check_design.py <repo> --browser     # screenshots in <repo>/_qa — delete before commit
python3 $SKILL/scripts/palette.py <hue|name>
python3 $SKILL/scripts/make_icons.py icons/<src.svg|png> --out icons --bg "<night>"
node --check js/app.js
```
Playwright is preinstalled; block non-127.0.0.1 requests in tests. Press sticky-topbar buttons with `page.mouse.click(x,y)`. A full flow-test script for Batch Tickler exists at `/home/claude/qa/flow_test.py` in this session only (14 flows, all PASS on 1.6.0) — rewrite from §3 if needed. String parity check: `node -e "global.window={};require('./data/strings.js');require('./data/fields.js');var e=Object.keys(window.STRINGS.en),t=Object.keys(window.STRINGS.tl);console.log(e.filter(k=>!t.includes(k)),window.CARD_FIELDS.filter(f=>!e.includes('bt.f.'+f.key)).map(f=>f.key))"` must print two empty arrays.

## 6. Status
| App | Version pushed | Shell | Commit |
|---|---|---|---|
| Shea Trainer | 11.0.0 | full | 9830fe1 |
| Kaplan Study | 60.0.0 | full | c0f7fbd |
| Stahl | 22.0.0 | full | c388821 |
| DSM-5-TR | 55.0.0 | full | fa1f826 |
| MSE Trainer | 6.0.0 | full | 08b936e |
| Usap Tayo | 3.0.0 | middle path | 23718e8 |
| PsychInterview | cache v23 | sw fix only | 04dbaa1 |
| Case Rehearsal | rehearse-2026-11-06-1 | sw fix only | c74373d |
| **Batch Tickler** | **1.6.0** | full | f5eebcb (repo `tickler`; she enables Pages) |

## 7. Next steps
1. She enables GitHub Pages on `isaymotion/tickler` (Settings → Pages → main / root) if not yet done, installs it on her phone, fills in her card, shares it. First feedback expected on: the 78-field list (she asked for breadth; may prune), Tagalog drafts, QR scanning on real iPhones (camera needs HTTPS — fine on Pages; Safari asks permission once).
2. Done this chat (all her requests): split favourites; +dessert/colour/Pokémon; 28 more suggested fields (she declined duty buddy and dietary notes); zodiac computed; Spotify playlists ×5; Facebook/Instagram/Spotify/Steam links; QR share/scan; .ics calendar; stats; collapsible groups; custom fields; completeness; things in common; batch name + batch photo; name tags; Guess who modes + leaderboard.
3. Ideas not yet built: import from a Google Form CSV; "Things in common" as a batch-wide matrix; export the batch sheet as PDF directly (currently via browser print); Spotify embed previews (would need an external iframe — against the no-CDN rule, so left as links).
4. Pending her review across all apps: Tagalog draft strings; decide later whether to flip `SHOW_OTHER_APPS` (then add Batch Tickler to every APP_LINKS list).
5. Open question she may raise: iPads (768–1099 px) in Usap Tayo now get tab bar + drawer instead of the docked rail.

## 8. Pitfalls learned
- Generic from earlier chats: `check_design.py` prefix→owner map (keep `repo:` in `app-meta.js` accurate — it is `'tickler'` here); old-style service workers wiped sibling caches; brand-tagline media rule must come after `.brand__sub`; guard `classList` changes inside the body MutationObserver; alias tokens rather than importing starter component CSS into older apps; Companion apps now default to match-device.
- Batch Tickler: buttons rendered by a view need their listeners wired in `AFTER.<view>` (the sort buttons were missed once); the starter's `main` click handler only covers the search-page filters. A view that re-renders on every keystroke must restore focus/caret (see `AFTER.batch`). The home hero gradient over a photo banner must start transparent for the top third or it tints the picture. In Playwright, fields inside closed `<details>` can't be filled — open them first (`document.querySelectorAll('details.fgroup').forEach(d=>d.open=true)`); the regression script `/home/claude/qa/flow_test.py` (session-only) does this. `.guess__ask` is uppercase via CSS, so text assertions must be case-insensitive. Text-only QR: ~2.2 KB JSON scans reliably from a phone screenshot; photos never go in the QR.
- Repo push access is granted per repo per session via `add_repo` (worked first time for `tickler`); enabling Pages via `gh api …/pages` is blocked by the proxy — she does it in Settings.
- `make_icons.py` needs `cairosvg` for SVG sources (`pip install --break-system-packages cairosvg`); PNG sources work without it. For a photo/pixel icon with white corners, flood-fill the corners to transparent first.

## 9. Files to re-attach
None. If the design skill is missing from the session, ask her to re-save `isaymotion-app-design.skill` and `isaymotion-study-app.skill`. Batch Tickler source is in the `tickler` repo; her banner and icon originals are committed there (`img/banner.jpg`, `icons/icon-source.png`).
