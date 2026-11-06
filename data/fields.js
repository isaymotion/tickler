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
  { key: 'cantLiveWithout', group: 'favourites',  type: 'text',     print: true,  icon: 'heart' },
  { key: 'karaoke',         group: 'favourites',  type: 'text',     print: true,  icon: 'music' },

  /* Life */
  { key: 'hobbies',         group: 'life',        type: 'textarea', print: true,  icon: 'heart' },
  { key: 'studyStyle',      group: 'life',        type: 'text',     print: true,  icon: 'book' },
  { key: 'pets',            group: 'life',        type: 'text',     print: true,  icon: 'heart' },
  { key: 'hiddenTalent',    group: 'life',        type: 'text',     print: true,  icon: 'spark' },
  { key: 'destress',        group: 'life',        type: 'text',     print: true,  icon: 'heart' },
  { key: 'giftHints',       group: 'life',        type: 'textarea', print: true,  icon: 'cake' },
  { key: 'funFact',         group: 'life',        type: 'textarea', print: true,  icon: 'spark' },

  /* Contact and practical (in-app only) */
  { key: 'phone',           group: 'contact',     type: 'tel',      print: false, icon: 'phone' },
  { key: 'email',           group: 'contact',     type: 'email',    print: false, icon: 'mail' },
  { key: 'social',          group: 'contact',     type: 'text',     print: false, icon: 'chat' },
  { key: 'allergies',       group: 'contact',     type: 'text',     print: false, icon: 'food' },
  { key: 'emergencyContact',group: 'contact',     type: 'text',     print: false, icon: 'phone' }
];

/* Fields the "Guess who" clue game can ask about (needs at least 4 cards with that field filled in). */
window.GUESS_FIELDS = ['hometown', 'medSchool', 'hobbies', 'shows', 'kdrama', 'movies', 'cartoons', 'anime', 'games', 'music', 'books', 'food', 'snack', 'dessert', 'colour', 'pokemon', 'karaoke', 'hiddenTalent', 'funFact', 'pets', 'whyPsych'];

/* Fields compared for "Things in common" on a person's page: exact match (whole value) or shared items (comma / newline separated). */
window.COMMON_FIELDS = {
  exact: ['hometown', 'livesNow', 'medSchool', 'internship', 'gradYear', 'coffeeTea', 'studyStyle'],
  items: ['languages', 'interests', 'shows', 'kdrama', 'movies', 'cartoons', 'anime', 'games', 'music', 'books', 'authors', 'podcasts', 'sports', 'food', 'snack', 'dessert', 'colour', 'pokemon', 'comfortFood', 'hobbies', 'pets', 'destress']
};
