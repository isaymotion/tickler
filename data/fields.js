/* Resident-card fields, in display order, grouped. Labels come from data/strings.js (bt.f.<key>, bt.g.<group>).
   type: 'text' | 'textarea' | 'tel' | 'email' | 'year'. print:false keeps a field off the printable sheet and name tags
   (contact, allergies, emergency contact, social handles stay in-app only).
   Name, birthday and photo are handled separately in the edit form; the list below is the free-text part of the card.
   Adding a field: one line here + 'bt.f.<key>' in both languages in data/strings.js. Old cards simply have it empty. */
window.CARD_GROUPS = ['basics', 'background', 'favourites', 'life', 'contact'];

window.CARD_FIELDS = [
  /* Basics */
  { key: 'nickname',        group: 'basics',      type: 'text',     print: true,  icon: 'tag' },
  { key: 'preferredName',   group: 'basics',      type: 'text',     print: true,  icon: 'tag' },
  { key: 'pronouns',        group: 'basics',      type: 'text',     print: true,  icon: 'tag' },
  { key: 'hometown',        group: 'basics',      type: 'text',     print: true,  icon: 'pin' },
  { key: 'livesNow',        group: 'basics',      type: 'text',     print: true,  icon: 'pin' },
  { key: 'commute',         group: 'basics',      type: 'text',     print: false, icon: 'pin' },
  { key: 'languages',       group: 'basics',      type: 'text',     print: true,  icon: 'chat' },

  /* Background */
  { key: 'medSchool',       group: 'background',  type: 'text',     print: true,  icon: 'school' },
  { key: 'internship',      group: 'background',  type: 'text',     print: true,  icon: 'school' },
  { key: 'gradYear',        group: 'background',  type: 'year',     print: true,  icon: 'school' },
  { key: 'pastJobs',        group: 'background',  type: 'textarea', print: true,  icon: 'school' },
  { key: 'whyPsych',        group: 'background',  type: 'textarea', print: true,  icon: 'spark' },
  { key: 'interests',       group: 'background',  type: 'textarea', print: true,  icon: 'spark' },

  /* Favourites */
  { key: 'shows',           group: 'favourites',  type: 'textarea', print: true,  icon: 'tv' },
  { key: 'kdrama',          group: 'favourites',  type: 'textarea', print: true,  icon: 'tv' },
  { key: 'movies',          group: 'favourites',  type: 'textarea', print: true,  icon: 'film' },
  { key: 'cartoons',        group: 'favourites',  type: 'textarea', print: true,  icon: 'tv' },
  { key: 'anime',           group: 'favourites',  type: 'textarea', print: true,  icon: 'spark' },
  { key: 'games',           group: 'favourites',  type: 'textarea', print: true,  icon: 'game' },
  { key: 'music',           group: 'favourites',  type: 'textarea', print: true,  icon: 'music' },
  { key: 'books',           group: 'favourites',  type: 'textarea', print: true,  icon: 'book' },
  { key: 'authors',         group: 'favourites',  type: 'textarea', print: true,  icon: 'book' },
  { key: 'podcasts',        group: 'favourites',  type: 'textarea', print: true,  icon: 'music' },
  { key: 'sports',          group: 'favourites',  type: 'textarea', print: true,  icon: 'heart' },
  { key: 'food',            group: 'favourites',  type: 'textarea', print: true,  icon: 'food' },
  { key: 'snack',           group: 'favourites',  type: 'textarea', print: true,  icon: 'food' },
  { key: 'comfortFood',     group: 'favourites',  type: 'textarea', print: true,  icon: 'food' },
  { key: 'localEats',       group: 'favourites',  type: 'textarea', print: true,  icon: 'food' },
  { key: 'dessert',         group: 'favourites',  type: 'textarea', print: true,  icon: 'food' },
  { key: 'coffeeTea',       group: 'favourites',  type: 'text',     print: true,  icon: 'food' },
  { key: 'colour',          group: 'favourites',  type: 'text',     print: true,  icon: 'spark' },
  { key: 'pokemon',         group: 'favourites',  type: 'text',     print: true,  icon: 'game' },
  { key: 'season',          group: 'favourites',  type: 'text',     print: true,  icon: 'spark' },
  { key: 'flower',          group: 'favourites',  type: 'text',     print: true,  icon: 'spark' },
  { key: 'animal',          group: 'favourites',  type: 'text',     print: true,  icon: 'heart' },
  { key: 'boardGames',      group: 'favourites',  type: 'textarea', print: true,  icon: 'game' },
  { key: 'youtubers',       group: 'favourites',  type: 'textarea', print: true,  icon: 'tv' },
  { key: 'canCook',         group: 'favourites',  type: 'textarea', print: true,  icon: 'food' },
  { key: 'milkTea',         group: 'favourites',  type: 'text',     print: true,  icon: 'food' },
  { key: 'fastFood',        group: 'favourites',  type: 'text',     print: true,  icon: 'food' },
  { key: 'fruit',           group: 'favourites',  type: 'text',     print: true,  icon: 'food' },
  { key: 'app',             group: 'favourites',  type: 'text',     print: true,  icon: 'phone' },
  { key: 'holiday',         group: 'favourites',  type: 'text',     print: true,  icon: 'cake' },
  { key: 'disney',          group: 'favourites',  type: 'textarea', print: true,  icon: 'film' },
  { key: 'superhero',       group: 'favourites',  type: 'text',     print: true,  icon: 'spark' },
  { key: 'fandom',          group: 'favourites',  type: 'text',     print: true,  icon: 'spark' },
  { key: 'emoji',           group: 'favourites',  type: 'text',     print: true,  icon: 'spark' },
  { key: 'quote',           group: 'favourites',  type: 'textarea', print: true,  icon: 'book' },
  { key: 'subject',         group: 'favourites',  type: 'text',     print: true,  icon: 'school' },
  { key: 'rotation',        group: 'favourites',  type: 'text',     print: true,  icon: 'school' },
  { key: 'studyMusic',      group: 'favourites',  type: 'text',     print: true,  icon: 'music' },
  { key: 'cantLiveWithout', group: 'favourites',  type: 'text',     print: true,  icon: 'heart' },
  { key: 'karaoke',         group: 'favourites',  type: 'text',     print: true,  icon: 'music' },

  /* Life */
  { key: 'hobbies',         group: 'life',        type: 'textarea', print: true,  icon: 'heart' },
  { key: 'studyStyle',      group: 'life',        type: 'text',     print: true,  icon: 'book' },
  { key: 'pets',            group: 'life',        type: 'text',     print: true,  icon: 'heart' },
  { key: 'hiddenTalent',    group: 'life',        type: 'text',     print: true,  icon: 'spark' },
  { key: 'destress',        group: 'life',        type: 'text',     print: true,  icon: 'heart' },
  { key: 'introExtro',      group: 'life',        type: 'text',     print: true,  icon: 'users' },
  { key: 'mbti',            group: 'life',        type: 'text',     print: true,  icon: 'spark' },
  { key: 'loveLanguage',    group: 'life',        type: 'text',     print: true,  icon: 'heart' },
  { key: 'morningEssential',group: 'life',        type: 'text',     print: true,  icon: 'food' },
  { key: 'dreamTrip',       group: 'life',        type: 'text',     print: true,  icon: 'pin' },
  { key: 'travelled',       group: 'life',        type: 'textarea', print: true,  icon: 'pin' },
  { key: 'bucketList',      group: 'life',        type: 'textarea', print: true,  icon: 'spark' },
  { key: 'superpower',      group: 'life',        type: 'text',     print: true,  icon: 'spark' },
  { key: 'threeWords',      group: 'life',        type: 'text',     print: true,  icon: 'chat' },
  { key: 'learningNow',     group: 'life',        type: 'text',     print: true,  icon: 'book' },
  { key: 'giftHints',       group: 'life',        type: 'textarea', print: true,  icon: 'cake' },
  { key: 'funFact',         group: 'life',        type: 'textarea', print: true,  icon: 'spark' },

  /* Contact and practical (in-app only) */
  { key: 'phone',           group: 'contact',     type: 'tel',      print: false, icon: 'phone' },
  { key: 'email',           group: 'contact',     type: 'email',    print: false, icon: 'mail' },
  { key: 'facebook',        group: 'contact',     type: 'url',      print: false, icon: 'chat',  base: 'https://www.facebook.com/' },
  { key: 'instagram',       group: 'contact',     type: 'url',      print: false, icon: 'camera', base: 'https://www.instagram.com/' },
  { key: 'spotify',         group: 'contact',     type: 'url',      print: false, icon: 'music', base: 'https://open.spotify.com/user/' },
  { key: 'steam',           group: 'contact',     type: 'url',      print: false, icon: 'game',  base: 'https://steamcommunity.com/id/' },
  { key: 'social',          group: 'contact',     type: 'text',     print: false, icon: 'chat' },
  { key: 'shirtSize',       group: 'contact',     type: 'text',     print: false, icon: 'tag' },
  { key: 'bloodType',       group: 'contact',     type: 'text',     print: false, icon: 'heart' },
  { key: 'allergies',       group: 'contact',     type: 'text',     print: false, icon: 'food' },
  { key: 'emergencyContact',group: 'contact',     type: 'text',     print: false, icon: 'phone' }
];

/* Fields the "Guess who" clue game can ask about (needs at least 4 cards with that field filled in). */
window.GUESS_FIELDS = ['hometown', 'medSchool', 'hobbies', 'shows', 'kdrama', 'movies', 'cartoons', 'anime', 'games', 'music', 'books', 'food', 'snack', 'dessert', 'colour', 'pokemon', 'karaoke', 'hiddenTalent', 'funFact', 'pets', 'whyPsych', 'animal', 'superhero', 'quote', 'dreamTrip', 'superpower', 'milkTea', 'emoji'];

/* Fields compared for "Things in common" on a person's page: exact match (whole value) or shared items (comma / newline separated). */
window.COMMON_FIELDS = {
  exact: ['hometown', 'livesNow', 'medSchool', 'internship', 'gradYear', 'coffeeTea', 'studyStyle', 'colour', 'pokemon', 'season', 'animal', 'superhero', 'fandom', 'introExtro', 'mbti', 'loveLanguage', 'milkTea', 'fastFood', 'fruit', 'emoji'],
  items: ['languages', 'interests', 'shows', 'kdrama', 'movies', 'cartoons', 'anime', 'games', 'music', 'books', 'authors', 'podcasts', 'sports', 'food', 'snack', 'dessert', 'comfortFood', 'hobbies', 'pets', 'destress', 'boardGames', 'youtubers', 'disney', 'travelled', 'bucketList', 'canCook']
};

/* Spotify playlists: a list of up to PLAYLIST_MAX {label, url} links on the card (card.playlists). In-app only. */
window.PLAYLIST_MAX = 5;
