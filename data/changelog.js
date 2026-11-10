/* What's new. Newest entry FIRST. version = semver string (also the key for the unseen badge),
   date = ISO YYYY-MM-DD. Item type: feature | update | correction | content.
   Optional per item: href (an in-app '#/...' link) shown as "Open". Add an entry for every release,
   then bump APP_META.version, VERSION in sw.js, and "Latest version" in the footer / README. */
window.APP_CHANGELOG = [
  {
    version: '1.11.1',
    date: '2026-11-10',
    title: 'Residency starts 1 January 2027',
    items: [
      { type: 'update', text: 'The residency day counter on Home now counts down to 1 January 2027 on every phone, with no setup. You can still change the date in About › Settings if yours is different.', href: '#/' }
    ]
  },
  {
    version: '1.11.0',
    date: '2026-11-10',
    title: 'Fun pack: bingo, map, Wrapped and more',
    items: [
      { type: 'feature', text: 'Birthday banner: on someone\'s birthday, Home shows a banner with confetti and a Greet them button that opens your share sheet with a ready greeting.', href: '#/' },
      { type: 'feature', text: 'Who said it?: read one batchmate\'s answer and guess whose it is. Start it from the fact of the day or pick any question.', href: '#/whosaid' },
      { type: 'feature', text: 'Batch Bingo: a bingo card made from the batch\'s cards (hometowns, foods, shows, languages…). Find someone who matches, tap the square, get five in a row.', href: '#/bingo' },
      { type: 'feature', text: 'Batch twins: the pairs with the most things in common, on Batch stats.', href: '#/stats' },
      { type: 'feature', text: 'Spotlight of the week on Home: one batchmate each week, with a few things from their card.', href: '#/' },
      { type: 'feature', text: 'Icebreakers: 36 conversation starters for duty breaks, or questions drawn from batchmates\' cards with a peek at their answer.', href: '#/icebreakers' },
      { type: 'feature', text: 'Hometown map: everyone\'s hometown as dots on a map of the Philippines, works offline. Writing "city, province" on your card helps it find the place.', href: '#/map' },
      { type: 'feature', text: 'Batch Wrapped: the batch in a few swipeable slides — numbers, birthday season, favourites, most common hometown, batch twins.', href: '#/wrapped' },
      { type: 'feature', text: 'Residency day counter on Home. Set the start date in About › Settings.', href: '#/about' },
      { type: 'update', text: 'The menu has a new Play group for the games.' }
    ]
  },
  {
    version: '1.10.0',
    date: '2026-11-09',
    title: 'Today in the batch',
    items: [
      { type: 'feature', text: 'Home: Featured Spotify playlist today — one playlist from the batch\'s cards each day, with who shared it and an Open in Spotify button.', href: '#/' },
      { type: 'feature', text: 'Home: Featured fact of the day — one question a day (favourite cartoons, comfort food, hidden talent…) with every batchmate\'s answer. Tap a name to open their card.', href: '#/' },
      { type: 'update', text: 'Both picks change at midnight and are the same on every phone that has the same cards. Show another browses more without changing tomorrow\'s pick.' }
    ]
  },
  {
    version: '1.9.0',
    date: '2026-11-07',
    title: 'Tidier card, full-directory print',
    items: [
      { type: 'feature', text: 'Print sheet: a Full directory mode — every card in full, contact and practical details included, one person per page, as many pages as needed. Treat that printout as personal.', href: '#/print' },
      { type: 'update', text: 'My card: Favourites and Life are now organised into sub-sections (On screen, Games & fandoms, Music & words, Food & drink, Little things, Med school; Everyday, Growing up, About you, Horizons, Residency, Just for fun) on both the form and the card.', href: '#/me' },
      { type: 'update', text: 'Birth year is now required with the birthday, so ages and the oldest-to-youngest list are complete.' }
    ]
  },
  {
    version: '1.8.0',
    date: '2026-11-07',
    title: 'Contact & practical, expanded',
    items: [
      { type: 'feature', text: 'My card: Viber, Telegram/WhatsApp, second email, Discord, YouTube channel; GCash/Maya number; where you stay and nearest landmark; birthday celebration preference; scrub and shoe sizes; emergency contact split into name, number and relationship, plus a second contact; optional conditions to be aware of on duty; PRC, driver’s licence and passport expiry months — to remind us when to renew. All in-app only.', href: '#/me' },
      { type: 'update', text: 'QR codes never carry the GCash number or duty conditions; those travel only in card files you choose to share.' },
      { type: 'update', text: 'Show my QR scrolls the code to the middle of the screen so a screenshot catches all of it.' }
    ]
  },
  {
    version: '1.7.1',
    date: '2026-11-07',
    title: 'Ten playlists',
    items: [{ type: 'update', text: 'My card: up to ten Spotify playlists per card (was five).', href: '#/me' }]
  },
  {
    version: '1.7.0',
    date: '2026-11-07',
    title: 'A fuller Life section',
    items: [{ type: 'feature', text: 'My card: 32 more Life fields — everyday habits, growing up, faith and values, residency hopes, and a few fun ones (hot take, celebrity lookalike, karaoke duet wanted…).', href: '#/me' }]
  },
  {
    version: '1.6.1',
    date: '2026-11-07',
    title: 'Bible verse and prayer',
    items: [{ type: 'feature', text: 'My card: favourite Bible verse and favourite prayer added to Favourites.', href: '#/me' }]
  },
  {
    version: '1.6.0',
    date: '2026-11-07',
    title: 'Links, playlists and zodiac',
    items: [
      { type: 'feature', text: 'My card: 32 more fields — favourite season, flower, animal, board games, YouTubers, dish you can cook, milk tea, fast food, fruit, app, holiday, Disney/Pixar, superhero, fandom, emoji, quote, med school subject, rotation, study music; introvert/extrovert, MBTI, love language, morning essential, dream trip, places travelled, bucket list, superpower, three words, learning now; shirt size and blood type (in-app only).', href: '#/me' },
      { type: 'feature', text: 'Account links: Facebook, Instagram, Spotify and Steam — paste the link or just the username; they open from the card. In-app only.', href: '#/me' },
      { type: 'feature', text: 'Spotify playlists: up to five playlist links per card with names.', href: '#/me' },
      { type: 'feature', text: 'Zodiac: Western sign and Chinese zodiac shown on the card, worked out from the birthday.' }
    ]
  },
  {
    version: '1.5.0',
    date: '2026-11-07',
    title: 'More favourites',
    items: [
      { type: 'feature', text: 'My card: favourite dessert, favourite colour and favourite Pokémon added to Favourites.', href: '#/me' }
    ]
  },
  {
    version: '1.4.0',
    date: '2026-11-07',
    title: 'Name tags, more games, batch photo',
    items: [
      { type: 'feature', text: 'Print sheet: a Name tags mode — eight tags per A4 page with photo, preferred name, full name and hometown.', href: '#/print' },
      { type: 'feature', text: 'Guess who: three modes (clue → name, photo → name, name → birth month), rounds of ten, and a leaderboard kept on this phone.', href: '#/guess' },
      { type: 'feature', text: 'Batch photo: About › Settings lets each device replace the home-screen picture with a group photo, so a later batch can reuse the app.', href: '#/about' }
    ]
  },
  {
    version: '1.3.0',
    date: '2026-11-07',
    title: 'QR, calendar and stats',
    items: [
      { type: 'feature', text: 'Show my QR / Scan a card: pass your card phone-to-phone with a QR code — camera or a screenshot. The QR carries the card’s text; share the file for the photo.', href: '#/share' },
      { type: 'feature', text: 'Birthday calendar: add one birthday or the whole batch to your phone calendar as yearly events.', href: '#/birthdays' },
      { type: 'feature', text: 'Batch stats: hometowns, med schools, languages, birthdays by month, oldest to youngest, this month’s birthdays and the most shared favourites.', href: '#/stats' }
    ]
  },
  {
    version: '1.2.0',
    date: '2026-11-07',
    title: 'A much fuller card',
    items: [
      { type: 'feature', text: 'My card: 46 fields in five groups (Basics, Background, Favourites, Life, Contact & practical) — pronouns, where you live, languages, internship, why psychiatry, K-dramas, books, authors, podcasts, snacks, karaoke song, pets, hidden talent, gift hints and more. Sections open and close; each shows how much is filled in.', href: '#/me' },
      { type: 'feature', text: 'Your own fields: add any label and answer the list missed.', href: '#/me' },
      { type: 'feature', text: 'Things in common: a batchmate’s page shows what you share — same hometown or school, the same shows, books, food.', href: '#/batch' },
      { type: 'feature', text: 'Batch name: set it in About › Settings; it appears on the home screen and the printed sheet.', href: '#/about' },
      { type: 'update', text: 'Allergies, emergency contact and social handles are in-app only and never printed.' }
    ]
  },
  {
    version: '1.1.0',
    date: '2026-11-06',
    title: 'Separate favourites',
    items: [
      { type: 'update', text: 'My card: favourite movies, cartoons, anime and video games are now four separate fields instead of one.', href: '#/me' }
    ]
  },
  {
    version: '1.0.0',
    date: '2026-11-06',
    title: 'First release',
    items: [
      { type: 'feature', text: 'My card: your own resident card with photo, birthday, hometown, med school, hobbies, favourite shows, movies, cartoons, anime and games (one field in 1.0), music, food, a fun fact and contact details.', href: '#/me' },
      { type: 'feature', text: 'The batch: everyone’s cards in one grid, with a quick filter and sorting by name, birthday or hometown.', href: '#/batch' },
      { type: 'feature', text: 'Birthdays: upcoming birthdays by month, with ages when a year is given.', href: '#/birthdays' },
      { type: 'feature', text: 'Share cards: send your card as a small file, import cards from batchmates, or pass on the whole batch.', href: '#/share' },
      { type: 'feature', text: 'Print sheet: a compact “meet the batch” page without contact details.', href: '#/print' },
      { type: 'feature', text: 'Guess who: a small game built from the batch’s own cards.', href: '#/guess' },
      { type: 'feature', text: 'Shared shell: search, light and dark theme, text size, English/Tagalog, and backup of everything on this device.' }
    ]
  }
];
