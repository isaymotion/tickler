/* Resident-card fields, in display order. Each: key, strings key for the label (bt.f.<key>), input type, and where it shows.
   type: 'text' | 'textarea' | 'tel' | 'email'. print:false keeps a field off the printable batch sheet (contact details).
   Name, birthday and photo are handled separately in the edit form; the list below is the free-text part of the card. */
window.CARD_FIELDS = [
  { key: 'nickname',  type: 'text',     print: true,  icon: 'tag' },
  { key: 'hometown',  type: 'text',     print: true,  icon: 'pin' },
  { key: 'medSchool', type: 'text',     print: true,  icon: 'school' },
  { key: 'hobbies',   type: 'textarea', print: true,  icon: 'heart' },
  { key: 'shows',     type: 'textarea', print: true,  icon: 'tv' },
  { key: 'movies',    type: 'textarea', print: true,  icon: 'film' },
  { key: 'music',     type: 'textarea', print: true,  icon: 'music' },
  { key: 'food',      type: 'textarea', print: true,  icon: 'food' },
  { key: 'funFact',   type: 'textarea', print: true,  icon: 'spark' },
  { key: 'phone',     type: 'tel',      print: false, icon: 'phone' },
  { key: 'email',     type: 'email',    print: false, icon: 'mail' }
];

/* Fields the "Guess who" game can ask about (needs at least 4 cards with that field filled in). */
window.GUESS_FIELDS = ['hometown', 'hobbies', 'shows', 'movies', 'music', 'food', 'funFact', 'medSchool'];
