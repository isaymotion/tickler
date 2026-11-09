# Batch Tickler

A shared batch directory for incoming psychiatry residents: fill in your own card on your phone, share it with the batch, and get to know everyone's hometowns, hobbies, birthdays and favourites. It runs entirely in the browser, works offline after the first visit, and can be installed on phones and desktops.

**Live site:** https://isaymotion.github.io/tickler/ (after GitHub Pages is switched on; see below)

## Features

- **My card** — each resident fills in their own card on their phone: name, photo (shrunk to a small square), birthday (with year, required) and 134 fields in five collapsible groups — Basics (nickname, how to address you, pronouns, hometown, where you live, commute, languages), Background (med school, internship, year graduated, past jobs, why psychiatry, interests), Favourites — in sub-sections On screen / Games & fandoms / Music & words / Food & drink / Little things / Med school — (TV, K-drama, movies, cartoons, anime, games, music, books, authors, podcasts, sports, food, snack, dessert, comfort food, local eats, coffee/tea, colour, Pokémon, can't-live-without, karaoke song), Life — in sub-sections Everyday / Growing up / About you / Horizons / Residency / Just for fun — (hobbies, study style, pets, hidden talent, de-stress, gift hints, fun fact) and Contact & practical (phone, Viber, Telegram/WhatsApp, two emails, Facebook/Instagram/Spotify/Steam/YouTube links, Discord, other socials, GCash/Maya, where you stay, landmark, birthday preference, shirt/scrub/shoe sizes, blood type, allergies/diet, duty conditions, two emergency contacts, PRC/licence/passport expiry months — in-app only; GCash and duty conditions also stay out of QR codes). Plus up to ten Spotify playlist links, free-form custom fields, zodiac worked out from the birthday, and a completeness meter. Only the owner edits it.
- **Things in common** — a batchmate's page lists what you share (same hometown/school/year, shared shows, books, food…).
- **Batch name and batch photo** — set in About › Settings; the name shows on the home screen and prints, the photo replaces the home banner on that device.
- **The batch** — everyone's cards in one grid, with a quick filter and sorting by name, next birthday or hometown. Tap a card for the full page (contact buttons: call, message, email).
- **Today in the batch** (Home) — a featured Spotify playlist and a featured fact of the day (one question, everyone's answers). Picks change at midnight and match on every phone with the same cards; *Show another* browses more.
- **Birthdays** — grouped Today / This month / by month, days to go, and the age when a year was given.
- **Share cards** — cards travel as small JSON files: share your own card, import cards from batchmates (newer copies replace older ones; your own card is never overwritten), or send the whole batch to someone starting from nothing. Uses the phone share sheet when installed.
- **Scan a card / Show my QR** — pass a card phone-to-phone with a QR code (camera, or a screenshot of the QR). Text only; the photo travels with the file.
- **Birthday calendar** — add one birthday or the whole batch to the phone calendar (.ics, yearly).
- **Batch stats** — hometowns, med schools, languages, birthdays by month, oldest to youngest, most shared favourites.
- **Print sheet** — three modes: a compact "meet the batch" page without contact details; Name tags (8 per A4 page); and a Full directory with every field including contact details, one person per page. Print or save as PDF from the browser.
- **Guess who** — three modes (clue → name, photo → name, name → birth month), rounds of ten, leaderboard on this phone.
- Shared isaymotion shell: search from the top bar (press `/`), back/forward buttons and `Alt+Left/Right`, light/dark/match-device theme, text size (Aa), English / Tagalog, What's new with an unseen badge, footer backup (export / import / undo), installable, offline after the first visit.
- No accounts, servers or tracking. Everything stays in the browser until a resident exports or shares it.

## Files to upload

Upload everything in this folder to the root of the repository, keeping the folder structure:

```
.nojekyll               (empty file; tells GitHub Pages not to run Jekyll)
README.md
index.html              App shell (top bar, sidebar menu, footer, bottom tabs)
css/app.css             Styles (light and dark themes)
js/app.js               Router, menu, views (VIEWS), navigation (NAV), search, theme, backup
js/vendor/qrcode.js     QR encoder (qrcode-generator, MIT, Kazuhiko Arase)
js/vendor/jsQR.js       QR decoder (jsQR, Apache-2.0; loaded only on the Scan screen)
data/app-meta.js        App name, version, attribution (window.APP_META), menu links (window.APP_LINKS)
                        and the commented MIGRATE_KEYS example
data/changelog.js       What's new entries (window.APP_CHANGELOG)
data/hospital.js        Hospital, program, posts and year levels (window.HOSPITAL), shared across apps
data/strings.js         UI strings in English and Tagalog (window.STRINGS)
data/fields.js          Resident-card field list (window.CARD_FIELDS) and the Guess-who fields
img/banner.jpg          Home banner (plus banner-small.jpg for phones)
icons/                  icon-192.png, icon-512.png, icon-maskable-512.png, favicon-32.png, favicon-64.png,
                        favicon.ico, apple-touch-icon.png, icon-source.png (the original artwork)
manifest.webmanifest    Install metadata
sw.js                   Offline cache
```

Replace `index.html` whenever icon or manifest links change. The header logo uses `icons/icon-192.png`.

## Publish on GitHub Pages

1. Create a new repository named `tickler` on GitHub and upload all files in this folder, keeping the folder structure.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. After a minute the site is live at `https://isaymotion.github.io/tickler/`.
5. On a phone, open that link, then use **Add to Home Screen** (iPhone Safari) or **Install app** (Android Chrome).

There is no build step and no dependencies. To preview locally, run `python3 -m http.server` in this folder and visit `http://localhost:8000`.

## How cards move between phones

Each phone holds one editable card (`bt:v1:me`) and a list of imported cards (`bt:v1:batch`). A card file is `{app:'batchtickler', kind:'card', card:{…}}`; a batch file is `{kind:'batch', cards:[…]}`; the footer backup is also accepted. Imports match on card id, then on the exact name; the copy with the newer `updated` time wins. Removing a card on one phone does not remove it elsewhere.

## Adding a screen

1. In `js/app.js`, inside the `APP VIEWS` section, add `VIEWS.myscreen = function (arg) { return '<div class="wrap page">...</div>'; };` (use `esc()` on any data).
2. Add one entry to the `NAV` array: `{ label: 'My screen', href: '#/myscreen', icon: 'star', group: 'Screens' }`. That adds it to the sidebar, the drawer and the home tiles.
3. Optional: add rows to `SEARCH_INDEX` (`{title, text, href, kind}`) so the screen shows up in search.
4. Add an entry to the top of `data/changelog.js` and bump the version (below).

Reusable CSS classes are in `css/app.css`: `btn`, `btn--solid`, `link-btn`, `filters`/`filter`, `seg`, `card`, `row`, `callout`, `table-wrap`, `page`/`page__head`, `crumb`, `empty`, `badge`, `meter`. New in this app: `.field` (form inputs), `.avatar`, `.pcard`, `.fact`, `.sheet` (print). Flashcards, quizzes and spaced repetition are not included; copy them from the Stahl or DSMVapp repos if a study app needs them.

## Shared data, languages and other apps

- `data/hospital.js` defines `window.HOSPITAL` (hospital name, program, province, posts, year levels, form prefix). It is shared across the apps: edit it in one place and copy the file to the others instead of hardcoding these values.
- `data/strings.js` defines `window.STRINGS = { en, tl }` for the shell's own UI text. Use `t('key')` in `js/app.js`; it falls back to English, then to the key. The Tagalog values are a draft until Dr. Navarro reviews them. Add the same key to both languages when you add shell text.
- `window.APP_LINKS` (in `data/app-meta.js`) feeds the "Other apps" menu group. The entry matching this app's own repo slug is skipped, so the same list works in every app. These links never appear in the home tiles, search or tab bar.
- `window.MIGRATE_KEYS` (optional; a commented example is in `data/app-meta.js`) is for a restyled app whose storage prefix changed: at startup each saved key under an old prefix is copied under the new prefix and the old key removed, so saved progress survives.

## Version and What's new

- The app version is a semantic version string (for example `1.0.0`). It lives in `data/app-meta.js` (`version`), in the first entry of `data/changelog.js`, and in `sw.js` (`VERSION`).
- `data/changelog.js` is newest first. Each entry is `{version, date, title, items:[{type, text}]}` where `date` is ISO `YYYY-MM-DD` and `type` is `feature`, `update`, `correction` or `content`. Write plain sentences, sentence-case titles, no emoji, and start an item with the feature name and a colon.
- For every release: add the changelog entry at the top, update `version` in `data/app-meta.js`, set `VERSION` in `sw.js` to the same version (this makes returning users get the new files), and update "Latest version November 2026" in `index.html`, `data/app-meta.js` and this README.
- The unseen badge is keyed on the version string: visitors see a count of entries newer than the last version they opened on the What's new page.
- Storage keys start with `bt:v1:`, and cache names start with `batchtickler-`. All isaymotion apps share one origin (`isaymotion.github.io`), so keep both unique per app. Do not change them after release, or saved data will be lost.

## Attribution

App created by Isabella Navarro, MD. Latest version November 2026. isaymotion@gmail.com

A tool for the Psychiatry and Public Mental Health Residency Training Program, Mariveles Mental Wellness and General Hospital. Everything you enter stays on this device unless you export it; nothing is sent to a server.
