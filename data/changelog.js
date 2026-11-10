/* What's new. Newest entry FIRST. version = semver string (also the key for the unseen badge),
   date = ISO YYYY-MM-DD. Item type: feature | update | correction | content.
   Optional per item: href (an in-app '#/...' link) shown as "Open". Add an entry for every release,
   then bump APP_META.version, VERSION in sw.js, and "Latest version" in the footer / README. */
window.APP_CHANGELOG = [
  {
    version: '1.16.0', date: '2026-11-10', title: 'Emergency info, one tap away',
    items: [
      { type: 'feature', text: 'New Emergency info screen: everyone’s blood type, allergies, conditions, own number and emergency contacts in one place, with Call and Text buttons and a Call 911 button. Works offline.', href: '#/emergency' },
      { type: 'feature', text: 'Emergency is on the bottom bar on phones, first in the menu, and a red strip on Home shows how many batchmates have filled it in.' },
      { type: 'update', text: 'My card has a new “Emergency & medical” section near the top (moved out of Contact & practical), plus a relationship field for the second emergency contact.', href: '#/me/emergency' },
      { type: 'update', text: 'Each person’s page has an Emergency info button and its own Emergency & medical section. Still never on the printed sheet or name tags.' }
    ]
  },
  {
    version: '1.15.1',
    date: '2026-11-10',
    title: 'Home-screen name is now Batch Tickler',
    items: [
      { type: 'update', text: 'When you add the app to your home screen (iPhone or Android), its name now shows as “Batch Tickler” instead of “Batch”. Already installed on iPhone? First tap Export backup (bottom of any page), then remove the icon, add the app again from Safari, and Import backup — removing a home-screen app on iPhone also removes its saved data. On Android the name updates by itself within a day or two.' }
    ]
  },
  {
    version: '1.15.0',
    date: '2026-11-10',
    title: 'Twelve new ways to play with the batch',
    items: [
      { type: 'feature', text: 'Two truths and a lie: write yours, then spot your batchmates’ lies.', href: '#/truths' },
      { type: 'feature', text: 'How well do you know…?: a quiz made from one batchmate’s card — send them your score.', href: '#/quiz' },
      { type: 'feature', text: 'Baby photo guess: add a childhood photo and match the babies to the batch.', href: '#/baby' },
      { type: 'feature', text: 'Share result: Guess who, Who said it?, Bingo and the new games give you an emoji line for the group chat.' },
      { type: 'feature', text: 'This or that: quick picks (coffee or milk tea…) and a Batch split showing how everyone answered.', href: '#/thisorthat' },
      { type: 'feature', text: 'Batch superlatives: yearbook-style awards. Your votes travel with your card.', href: '#/superlatives' },
      { type: 'feature', text: 'Question of the week on Home — a new one every Monday.', href: '#/qotw' },
      { type: 'feature', text: 'Birthday wall: leave a message on a batchmate’s card; they see it on their birthday.' },
      { type: 'feature', text: 'Time capsule: letters to future you or to the batch, sealed until a date you pick.', href: '#/capsule' },
      { type: 'feature', text: 'Trading card: your card as a picture to post. Open it from any person’s page.', href: '#/tcard' },
      { type: 'feature', text: 'Where should we eat?: spin through everyone’s favourite food spots.', href: '#/eat' },
      { type: 'feature', text: 'Batch anthem: one song per person, with a song of the week on Home.', href: '#/anthem' },
      { type: 'update', text: '9 new badges.', href: '#/badges' }
    ]
  },
  {
    version: '1.14.1',
    date: '2026-11-10',
    title: 'Monito-monita is now Kris Kringle',
    items: [
      { type: 'update', text: 'The gift-exchange draw is now called Kris Kringle (menu, page, messages, badge). An exchange date already added to Batch events is renamed too.', href: '#/monito' }
    ]
  },
  {
    version: '1.14.0',
    date: '2026-11-10',
    title: 'Monito-monita, badges, events and shoutouts',
    items: [
      { type: 'feature', text: 'Monito-monita: draw names for the gift exchange (no one draws themselves), set a budget and date, then send each person their match privately — with their wishlist.', href: '#/monito' },
      { type: 'feature', text: 'Badges: 19 badges to earn — Collector, Met everyone, Perfect round, Bingo!, Cheerleader and more. Earned badges show on your card.', href: '#/badges' },
      { type: 'feature', text: 'Batch events: add welcome dinners, outings and exams with a countdown and add-to-calendar. The first day of residency is already there. Events travel with Share the whole batch; Home shows the next one.', href: '#/events' },
      { type: 'feature', text: 'Shoutouts: send a thank-you to a batchmate from their card. It travels with your card and shows on theirs; shoutouts for you show on Home.' },
      { type: 'feature', text: 'Ask me about: up to 3 topics on your card (Basics), shown on your card in the batch list.', href: '#/me' },
      { type: 'feature', text: 'Word of the day on Home, from each batchmate\'s Words to teach the batch (My card › Life › You).', href: '#/' }
    ]
  },
  {
    version: '1.13.0',
    date: '2026-11-10',
    title: 'More lists: wishlists, food spots, films and more',
    items: [
      { type: 'feature', text: 'My card has new ranked link lists: Birthday wishlist (Shopee/Lazada), Top films (Letterboxd), YouTube favourites, Podcasts (Spotify/Apple), Books (Goodreads), Favourite food spots and Travel bucket list (Google Maps), and a Study stash.', href: '#/me' },
      { type: 'feature', text: 'Top 10 shows now takes Disney+, Prime Video, Max, Viu, Apple TV and iWant links as well as Netflix; Home\'s pick is now the Show recommendation of the day.', href: '#/' },
      { type: 'feature', text: 'Batch picks: everyone\'s lists in one place, most-listed first; wishlists sorted by whose birthday is next.', href: '#/picks' },
      { type: 'feature', text: 'Birthday banner shows the birthday batchmate\'s top wishes.', href: '#/' },
      { type: 'feature', text: 'Hometown map › Travel bucket list: Philippine places on everyone\'s bucket lists as dots.', href: '#/map/travel' },
      { type: 'update', text: 'Shared films, books, podcasts, YouTube channels, food spots and bucket-list places count in Things in common and Batch twins.' }
    ]
  },
  {
    version: '1.12.0',
    date: '2026-11-10',
    title: 'Top 10 Netflix shows',
    items: [
      { type: 'feature', text: 'My card › Top 10 Netflix shows: list up to ten shows in order, each with an optional Netflix link (Share › Copy link). Use Move up to reorder.', href: '#/me' },
      { type: 'feature', text: 'Each batchmate\'s card shows their numbered top 10 as links — the Netflix link if they added one, otherwise a Netflix search for the title.' },
      { type: 'feature', text: 'Home: Netflix recommendation of the day — one show from the batch\'s top-10 lists each day, with whose list it is on and a Watch on Netflix button.', href: '#/' },
      { type: 'update', text: 'Shared Netflix shows now count in Things in common and Batch twins; Batch stats lists the most-listed shows; Batch Wrapped gets a Most-loved Netflix show slide; the Full directory print includes the lists.' }
    ]
  },
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
