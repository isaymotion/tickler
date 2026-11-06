/* What's new. Newest entry FIRST. version = semver string (also the key for the unseen badge),
   date = ISO YYYY-MM-DD. Item type: feature | update | correction | content.
   Optional per item: href (an in-app '#/...' link) shown as "Open". Add an entry for every release,
   then bump APP_META.version, VERSION in sw.js, and "Latest version" in the footer / README. */
window.APP_CHANGELOG = [
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
