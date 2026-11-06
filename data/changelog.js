/* What's new. Newest entry FIRST. version = semver string (also the key for the unseen badge),
   date = ISO YYYY-MM-DD. Item type: feature | update | correction | content.
   Optional per item: href (an in-app '#/...' link) shown as "Open". Add an entry for every release,
   then bump APP_META.version, VERSION in sw.js, and "Latest version" in the footer / README. */
window.APP_CHANGELOG = [
  {
    version: '1.0.0',
    date: '2026-11-06',
    title: 'First release',
    items: [
      { type: 'feature', text: 'My card: your own resident card with photo, birthday, hometown, med school, hobbies, favourite shows, movies, cartoons, anime and games, music, food, a fun fact and contact details.', href: '#/me' },
      { type: 'feature', text: 'The batch: everyone’s cards in one grid, with a quick filter and sorting by name, birthday or hometown.', href: '#/batch' },
      { type: 'feature', text: 'Birthdays: upcoming birthdays by month, with ages when a year is given.', href: '#/birthdays' },
      { type: 'feature', text: 'Share cards: send your card as a small file, import cards from batchmates, or pass on the whole batch.', href: '#/share' },
      { type: 'feature', text: 'Print sheet: a compact “meet the batch” page without contact details.', href: '#/print' },
      { type: 'feature', text: 'Guess who: a small game built from the batch’s own cards.', href: '#/guess' },
      { type: 'feature', text: 'Shared shell: search, light and dark theme, text size, English/Tagalog, and backup of everything on this device.' }
    ]
  }
];
