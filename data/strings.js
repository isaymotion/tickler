/* UI strings for the app shell only (menu, search, theme, text size, What's new, About, backup, Explore).
   Screen content stays in the screens' own data. t(key) looks up STRINGS[lang][key], then STRINGS.en[key], then the key.
   Placeholders like {name} are filled in by the code. In text, **bold** and [[key]] give bold and a keyboard key. */
window.STRINGS = {
  en: {
    /* ---- Batch Tickler screens ---- */
    'nav.batch': 'The batch',
    'nav.me': 'My card',
    'nav.birthdays': 'Birthdays',
    'nav.share': 'Share cards',
    'nav.print': 'Print sheet',
    'nav.guess': 'Guess who',
    'bt.hero.cta': 'Fill in my card',
    'bt.hero.ctaDone': 'See the batch',
    'nav.play': 'Play',
    'nav.map': 'Hometown map',
    'nav.whosaid': 'Who said it?',
    'nav.bingo': 'Batch Bingo',
    'nav.icebreakers': 'Icebreakers',
    'nav.wrapped': 'Batch Wrapped',
    'bt.day.title': 'Residency',
    'bt.day.set': 'Set your start date in About to count the days.',
    'bt.day.tomorrow': 'Starts tomorrow!',
    'bt.day.inN': 'Starts in {n} days',
    'bt.day.dayN': 'Day {n}',
    'bt.day.year': 'Year {n} of residency',
    'bt.day.m1': 'Day one. Welcome to residency!',
    'bt.day.mN': 'Day {n}: a milestone!',
    'bt.day.mYear': '{n} year(s) of residency today!',
    'bt.day.setting': 'Residency start date',
    'bt.day.hint': 'The batch starts on 1 January 2027. Change this only if your own start date is different; clear it to go back to 1 January 2027.',
    'bt.bdt.kicker': 'Birthday today',
    'bt.bdt.title': 'Happy birthday, {names}!',
    'bt.bdt.you': 'Happy birthday to you!',
    'bt.bdt.youToo': 'And happy birthday to you too!',
    'bt.bdt.greet': 'Greet them',
    'bt.bdt.copied': 'Greeting copied. Paste it in your chat.',
    'bt.bdt.msg': 'Happy birthday, {name}! 🎂 Wishing you a great year ahead. From your batchmates.',
    'bt.bdt.msgBatch': 'Happy birthday, {name}! 🎂 Wishing you a great year ahead. From your {batch} batchmates.',
    'bt.spot.h': 'Spotlight of the week',
    'bt.spot.open': 'Read their card',
    'bt.ws.intro': 'One question, everyone’s answers: read an answer and guess who gave it.',
    'bt.ws.notEnough': 'Needs at least two cards that answer the same question.',
    'bt.ws.topic': 'Question',
    'bt.ws.other': 'Another question',
    'bt.ws.ask': 'Who gave this as their {field}?',
    'bt.bingo.intro': 'Find batchmates who match each square. Tap a square when you find someone. Five in a row (or column, or diagonal) wins.',
    'bt.bingo.notEnough': 'Not enough details on the cards yet. Import a few more cards first.',
    'bt.bingo.win': 'BINGO! 🎉',
    'bt.bingo.winN': 'BINGO × {n}! 🎉',
    'bt.bingo.free': 'Free',
    'bt.bingo.new': 'New card',
    'bt.bingo.newConfirm': 'Start a new bingo card? Your marks on this one will be cleared.',
    'bt.bingo.how': 'Squares come from the batch’s cards. Ask around instead of peeking; Show who matches is for checking.',
    'bt.bingo.reveal': 'Show who matches',
    'bt.bingo.hide': 'Hide names',
    'bt.twins.h': 'Batch twins',
    'bt.twins.intro': 'The pairs with the most things in common.',
    'bt.twins.n1': '1 thing in common',
    'bt.twins.nN': '{n} things in common',
    'bt.twins.top': 'closest match',
    'bt.twins.more': 'and {n} more',
    'bt.twins.none': 'No two cards share anything yet.',
    'bt.ice.intro': 'Conversation starters for duty breaks, lunch and batch nights.',
    'bt.ice.modeQ': 'Questions',
    'bt.ice.modeCard': 'From the cards',
    'bt.ice.ask': 'Ask this',
    'bt.ice.askWho': 'Try asking {name}.',
    'bt.ice.next': 'Next',
    'bt.ice.otherWho': 'Someone else',
    'bt.ice.noCards': 'Import some batchmates’ cards first.',
    'bt.ice.cardQ': 'Ask {name} about their {field}.',
    'bt.ice.theirCard': 'Their card says',
    'bt.ice.reveal': 'Peek at their card',
    'bt.map.intro': 'Where everyone is from, based on the Hometown on each card.',
    'bt.map.noData': 'The map data did not load.',
    'bt.map.aria': 'Map of the Philippines with the batch’s hometowns',
    'bt.map.hosp': 'the hospital',
    'bt.map.tap': 'Tap a dot to see who is from there.',
    'bt.map.places': '{n} places',
    'bt.map.empty': 'No hometowns found on the map yet.',
    'bt.map.off': 'Not on the map',
    'bt.map.offHint': 'Hometowns the map did not recognise (abroad, or spelled differently). Writing “city, province” helps.',
    'bt.map.none': '{n} without a hometown on their card.',
    'bt.map.src': 'Map outline: Natural Earth (public domain). Dots are approximate.',
    'bt.wrap.intro': 'The batch in a few slides. Tap Next or swipe.',
    'bt.wrap.notEnough': 'Needs at least two cards.',
    'bt.wrap.prev': 'Back',
    'bt.wrap.next': 'Next',
    'bt.wrap.again': 'Start over',
    'bt.wrap.note': 'Made from the cards on this device.',
    'bt.wrap.theBatch': 'The batch',
    'bt.wrap.k0': 'Batch Wrapped {year}',
    'bt.wrap.s0': 'Let’s look back at who we are.',
    'bt.wrap.k1': 'In numbers',
    'bt.wrap.s1': 'residents on this device',
    'bt.wrap.towns': 'hometowns',
    'bt.wrap.schools': 'medical schools',
    'bt.wrap.langs': 'languages',
    'bt.wrap.k2': 'Birthday season',
    'bt.wrap.s2': '{n} birthdays that month',
    'bt.wrap.s2one': 'the first birthday on the list',
    'bt.wrap.zodiac': 'Most common sign: {sign} ({n})',
    'bt.wrap.k3': 'Born between',
    'bt.wrap.s3': '{n} birth years in one batch',
    'bt.wrap.k4': 'Batch favourites',
    'bt.wrap.b4': 'What we love',
    'bt.wrap.food': 'Food: {v} ({n})',
    'bt.wrap.shows': 'Show: {v} ({n})',
    'bt.wrap.music': 'Music: {v} ({n})',
    'bt.wrap.movies': 'Movie: {v} ({n})',
    'bt.wrap.games': 'Game: {v} ({n})',
    'bt.wrap.hobbies': 'Hobby: {v} ({n})',
    'bt.wrap.k5': 'Most common hometown',
    'bt.wrap.s5': 'home to {n} of us',
    'bt.wrap.k6': 'Playlists shared',
    'bt.wrap.s6': 'Spotify playlists on the batch’s cards',
    'bt.wrap.s6one': 'Spotify playlist on the batch’s cards',
    'bt.wrap.k7': 'Here’s to residency',
    'bt.wrap.s7': 'Glad you’re in this batch.',
    'bt.today.h': 'Today in the batch',
    'bt.today.pl': 'Featured Spotify playlist today',
    'bt.today.fact': 'Featured fact of the day',
    'bt.today.by': 'Shared by {name}',
    'bt.today.another': 'Show another',
    'bt.home.count1': '{n} resident in your batch so far.',
    'bt.home.countN': '{n} residents in your batch so far.',
    'bt.home.nextBirthday': 'Next birthday',
    'bt.home.today': 'Today!',
    'bt.home.inDays1': 'tomorrow',
    'bt.home.inDaysN': 'in {n} days',
    'bt.home.noMe': 'Start with your own card, then share it with the batch.',
    'bt.batch.intro': 'Everyone whose card is on this device. Tap a card to read more.',
    'bt.batch.filter': 'Filter by name, hometown, school…',
    'bt.batch.sortName': 'By name',
    'bt.batch.sortBirthday': 'By birthday',
    'bt.batch.sortHometown': 'By hometown',
    'bt.batch.emptyTitle': 'No cards yet',
    'bt.batch.emptyText': 'Fill in your own card first, then import the cards your batchmates share with you.',
    'bt.batch.noMatch': 'Nobody matches that.',
    'bt.batch.you': 'You',
    'bt.person.notFound': 'That card is not on this device.',
    'bt.person.edit': 'Edit my card',
    'bt.person.remove': 'Remove this card',
    'bt.person.confirmRemove': 'Remove {name} from this device? You can import their card again later.',
    'bt.person.updated': 'Card updated {date}',
    'bt.person.birthday': 'Birthday',
    'bt.person.turns': 'turns {n}',
    'bt.person.contact': 'Contact',
    'bt.person.call': 'Call',
    'bt.person.text': 'Message',
    'bt.person.mail': 'Email',
    'bt.me.title': 'My card',
    'bt.me.intro': 'Only you can edit this card; it is saved on this device. Share it with the batch from Share cards.',
    'bt.me.name': 'Full name',
    'bt.me.nameHint': 'As you would like the batch to see it.',
    'bt.me.photo': 'Photo',
    'bt.me.photoHint': 'Optional. Square photos look best; it is shrunk to keep the card small.',
    'bt.me.choosePhoto': 'Choose photo',
    'bt.me.removePhoto': 'Remove photo',
    'bt.me.birthday': 'Birthday',
    'bt.me.month': 'Month',
    'bt.me.day': 'Day',
    'bt.me.year': 'Year',
    'bt.me.none': '—',
    'bt.me.save': 'Save my card',
    'bt.me.saved': 'Saved. Your card is up to date on this device.',
    'bt.me.needName': 'Please enter your name first.',
    'bt.me.badBirthday': 'That birthday is not a real date.',
    'bt.me.photoTooBig': 'That photo could not be read. Try a smaller image.',
    'bt.me.clear': 'Clear my card',
    'bt.me.confirmClear': 'Clear everything on your card? Your batchmates’ cards stay.',
    'bt.f.nickname': 'Nickname',
    'bt.f.hometown': 'Hometown',
    'bt.f.medSchool': 'Med school',
    'bt.f.hobbies': 'Hobbies',
    'bt.f.shows': 'Favourite TV shows',
    'bt.f.movies': 'Favourite movies',
    'bt.f.cartoons': 'Favourite cartoons',
    'bt.f.anime': 'Favourite anime',
    'bt.f.games': 'Favourite video games',
    'bt.f.music': 'Music & artists',
    'bt.f.food': 'Favourite food',
    'bt.f.funFact': 'Fun fact',
    'bt.f.phone': 'Mobile number',
    'bt.f.email': 'Email',
    'bt.g.basics': 'Basics',
    'bt.g.background': 'Background',
    'bt.g.favourites': 'Favourites',
    'bt.g.life': 'Life',
    'bt.g.contact': 'Contact & practical',
    'bt.g.custom': 'More about me',
    'bt.f.preferredName': 'How to address you',
    'bt.f.pronouns': 'Pronouns',
    'bt.f.livesNow': 'Where you live now',
    'bt.f.commute': 'How you get to Mariveles',
    'bt.f.languages': 'Languages & dialects',
    'bt.f.internship': 'Internship hospital',
    'bt.f.gradYear': 'Year graduated',
    'bt.f.pastJobs': 'Past jobs / pre-residency life',
    'bt.f.whyPsych': 'Why psychiatry',
    'bt.f.interests': 'Interest areas',
    'bt.f.kdrama': 'Favourite K-dramas',
    'bt.f.books': 'Favourite books',
    'bt.f.authors': 'Favourite authors',
    'bt.f.podcasts': 'Podcasts',
    'bt.f.sports': 'Sports & teams',
    'bt.f.snack': 'Favourite snack',
    'bt.f.comfortFood': 'Comfort food',
    'bt.f.localEats': 'Go-to Mariveles / Balanga eats',
    'bt.f.dessert': 'Favourite dessert',
    'bt.f.coffeeTea': 'Coffee or tea order',
    'bt.f.colour': 'Favourite colour',
    'bt.f.pokemon': 'Favourite Pokémon',
    'bt.f.cantLiveWithout': 'Can’t live without',
    'bt.f.karaoke': 'Karaoke song',
    'bt.f.studyStyle': 'Night owl or early bird',
    'bt.f.pets': 'Pets',
    'bt.f.hiddenTalent': 'Hidden talent',
    'bt.f.destress': 'Go-to de-stress activity',
    'bt.f.giftHints': 'Gift hints / wish list',
    'bt.f.social': 'Social handles',
    'bt.f.allergies': 'Allergies or diet',
    'bt.f.emergencyContact': 'Emergency contact name',
    'bt.f.inAppOnly': 'in-app only',
    'bt.custom.title': 'Your own fields',
    'bt.custom.hint': 'Anything the list missed — give it a label and an answer.',
    'bt.custom.label': 'Label',
    'bt.custom.value': 'Answer',
    'bt.custom.add': 'Add a field',
    'bt.custom.remove': 'Remove',
    'bt.me.complete': '{n} of {total} filled in',
    'bt.me.completeHint': 'The more you fill in, the better the batch gets to know you.',
    'bt.me.expandAll': 'Open all sections',
    'bt.me.collapseAll': 'Close all sections',
    'bt.common.title': 'Things in common',
    'bt.common.none': 'Nothing in common yet — fill in more of your card and theirs.',
    'bt.common.same': 'Same {field}: {value}',
    'bt.common.shared': 'You both like: {value} ({field})',
    'bt.batchName': 'Batch name',
    'bt.batchNameHint': 'Shown on the home screen and the printed sheet, e.g. “Batch 2027”.',
    'nav.scan': 'Scan a card',
    'nav.stats': 'Batch stats',
    'bt.qr.title': 'Show my QR',
    'bt.qr.text': 'A batchmate opens Scan a card and points their camera here. The QR carries your card’s text, not the photo — share the file for the full card.',
    'bt.qr.btn': 'Show my QR',
    'bt.qr.hide': 'Hide QR',
    'bt.qr.trimmed': 'Your card is long, so the QR carries the first {n} of {total} fields. Share the file for everything.',
    'bt.qr.linkText': 'Open Batch Tickler',
    'bt.scan.intro': 'Point the camera at a batchmate’s QR, or pick a screenshot of one. The card is added to your batch.',
    'bt.scan.start': 'Start camera',
    'bt.scan.stop': 'Stop camera',
    'bt.scan.photo': 'Scan a screenshot or photo',
    'bt.scan.noCamera': 'No camera available here — use a screenshot instead.',
    'bt.scan.denied': 'Camera permission was not given. You can still scan a screenshot.',
    'bt.scan.looking': 'Looking for a QR…',
    'bt.scan.notFound': 'No QR code found in that image.',
    'bt.scan.notCard': 'That QR is not a Batch Tickler card.',
    'bt.scan.added': 'Added {name} to your batch.',
    'bt.scan.updated': 'Updated {name}’s card.',
    'bt.scan.same': '{name} is already up to date.',
    'bt.scan.me': 'That is your own card.',
    'bt.scan.again': 'Scan another',
    'bt.cal.one': 'Add to calendar',
    'bt.cal.all': 'Batch birthday calendar',
    'bt.cal.allText': 'One calendar file with every birthday, repeating yearly. Open it on your phone and it offers to add the events.',
    'bt.cal.summary': '{name}’s birthday',
    'bt.cal.saved': 'Calendar file ready: {name}.',
    'bt.stats.intro': 'What the batch looks like, from the cards on this device.',
    'bt.stats.residents': 'residents',
    'bt.stats.withPhoto': 'with a photo',
    'bt.stats.avgComplete': 'average card filled in',
    'bt.stats.hometowns': 'Hometowns',
    'bt.stats.schools': 'Med schools',
    'bt.stats.languages': 'Languages & dialects',
    'bt.stats.months': 'Birthdays by month',
    'bt.stats.ages': 'Oldest to youngest',
    'bt.stats.thisMonth': 'This month in the batch',
    'bt.stats.thisMonthNone': 'No birthdays this month.',
    'bt.stats.shared': 'Most shared favourites',
    'bt.stats.sharedNone': 'No favourite is shared by two or more people yet.',
    'bt.stats.n1': '{n} person',
    'bt.stats.nN': '{n} people',
    'bt.stats.empty': 'Nothing to count yet.',
    'bt.print.modeSheet': 'Batch sheet',
    'bt.print.modeTags': 'Name tags',
    'bt.print.tagsHint': 'Eight tags per A4 page. Cut along the borders.',
    'bt.guess.modeClue': 'Clue → name',
    'bt.guess.modePhoto': 'Photo → name',
    'bt.guess.modeMonth': 'Name → birth month',
    'bt.guess.whosePhoto': 'Who is this?',
    'bt.guess.whichMonth': 'Which month is {name}’s birthday?',
    'bt.guess.roundOf': 'Question {i} of {n}',
    'bt.guess.roundDone': 'Round over: {right} of {n}.',
    'bt.guess.playAgain': 'Play again',
    'bt.guess.board': 'Leaderboard (this phone)',
    'bt.guess.boardEmpty': 'No rounds finished yet.',
    'bt.guess.boardRow': '{right}/{n} · {mode} · {date}',
    'bt.guess.needPhotos': 'Needs four cards with photos.',
    'bt.guess.needDates': 'Needs four cards with birthdays.',
    'bt.guess.player': 'Player',
    'bt.banner.title': 'Batch photo',
    'bt.banner.hint': 'Optional. Replaces the home-screen picture on this device — a wide group photo works best. It is included in backups but not in shared cards.',
    'bt.banner.choose': 'Choose photo',
    'bt.banner.remove': 'Use the default picture',
    'bt.banner.saved': 'Batch photo saved.',
    'bt.f.season': 'Favourite season or weather',
    'bt.f.flower': 'Favourite flower or plant',
    'bt.f.animal': 'Favourite animal',
    'bt.f.boardGames': 'Favourite board or card games',
    'bt.f.youtubers': 'Favourite YouTubers / streamers',
    'bt.f.canCook': 'Filipino dish you can cook',
    'bt.f.milkTea': 'Milk tea order',
    'bt.f.fastFood': 'Favourite fast food',
    'bt.f.fruit': 'Favourite fruit',
    'bt.f.app': 'Favourite app',
    'bt.f.holiday': 'Favourite holiday or fiesta',
    'bt.f.disney': 'Favourite Disney / Pixar films',
    'bt.f.superhero': 'Favourite superhero',
    'bt.f.fandom': 'Fandom / house (Hogwarts house, etc.)',
    'bt.f.emoji': 'Favourite emoji',
    'bt.f.quote': 'Favourite quote or motto',
    'bt.f.bibleVerse': 'Favourite Bible verse',
    'bt.f.prayer': 'Favourite prayer',
    'bt.f.subject': 'Favourite (and least favourite) med school subject',
    'bt.f.rotation': 'Favourite rotation so far',
    'bt.f.studyMusic': 'Go-to study music',
    'bt.f.introExtro': 'Introvert, extrovert or ambivert',
    'bt.f.mbti': 'MBTI or Enneagram',
    'bt.f.loveLanguage': 'Love language',
    'bt.f.morningEssential': 'Morning routine essential',
    'bt.f.dreamTrip': 'Dream travel destination',
    'bt.f.travelled': 'Places travelled',
    'bt.f.bucketList': 'Bucket-list item',
    'bt.f.superpower': 'Superpower you’d pick',
    'bt.f.threeWords': 'Three words friends use for you',
    'bt.f.learningNow': 'Something you’re learning right now',
    'bt.f.facebook': 'Facebook',
    'bt.f.instagram': 'Instagram',
    'bt.f.spotify': 'Spotify profile',
    'bt.f.steam': 'Steam',
    'bt.f.shirtSize': 'Shirt size (batch shirts)',
    'bt.f.bloodType': 'Blood type',
    'bt.f.urlHint': 'Paste the link, or just the username.',
    'bt.f.playlists': 'Spotify playlists',
    'bt.nf.find': 'Find on Netflix',
    'bt.today.nfBy': '#{n} on {name}’s top 10',
    'bt.today.nfAlso': 'Also on the top 10 of {names}',
    'bt.wrap.k8': 'Most-loved Netflix show',
    'bt.wrap.s8': 'on {n} top-10 lists',
    'bt.l.intro': 'Link lists — ranked, best first. Use Move up to reorder.',
    'bt.l.up': 'Move up',
    'bt.l.search': '(opens a search)',
    'bt.l.seeAll': 'See all {n}',
    'bt.l.needTitle': '{list}: add a title next to each link.',
    'bt.l.badUrl': '{list}: links must be from {hosts}.',
    'nav.picks': 'Batch picks',
    'bt.picks.intro': 'Everyone’s lists in one place — shows, films, food spots, wishlists and more. Most-listed first.',
    'bt.picks.none': 'No lists yet. Add some to your card, then share it.',
    'bt.picks.wishIntro': 'Sorted by whose birthday is next.',
    'bt.picks.onMap': 'See the bucket list on the map',
    'bt.map.offHintTravel': 'Places outside the Philippines, or names the map did not recognise.',
    'bt.map.tapTravel': 'Tap a dot to see who wants to go there.',
    'bt.map.introTravel': 'Where the batch wants to go, from everyone’s travel bucket lists.',
    'bt.map.modeHome': 'Hometowns',
    'bt.nf.watchOn': 'Watch on {s}',
    'bt.today.nf': 'Show recommendation of the day',
    'bt.l.netflix': 'Top 10 shows (Netflix & streaming)',
    'bt.l.netflix.short': 'Shows',
    'bt.l.netflix.hint': 'Your top {n} series, best first. Type the title; the link is optional (Netflix, Disney+, Prime Video, Max, Viu, Apple TV or iWant — Share › Copy link). Without a link the title opens a Netflix search.',
    'bt.l.netflix.item': 'Show title',
    'bt.l.netflix.url': 'Streaming link (optional)',
    'bt.l.netflix.add': 'Add a show',
    'bt.l.netflix.hosts': 'Netflix, Disney+, Prime Video, Max, Viu, Apple TV or iWant',
    'bt.l.wishlist': 'Birthday wishlist',
    'bt.l.wishlist.short': 'Wishlists',
    'bt.l.wishlist.hint': 'Up to {n} things you’d love to get, top wish first. Paste a Shopee or Lazada link (Share › Copy link). It shows on your birthday banner so batchmates know what to give.',
    'bt.l.wishlist.item': 'Item',
    'bt.l.wishlist.url': 'Shopee or Lazada link (optional)',
    'bt.l.wishlist.add': 'Add a wish',
    'bt.l.wishlist.hosts': 'Shopee or Lazada',
    'bt.l.films': 'Top films',
    'bt.l.films.short': 'Films',
    'bt.l.films.hint': 'Your top {n} films. Add a Letterboxd link if you use it; without one the title opens a Letterboxd search.',
    'bt.l.films.item': 'Film title',
    'bt.l.films.url': 'Letterboxd link (optional)',
    'bt.l.films.add': 'Add a film',
    'bt.l.films.hosts': 'Letterboxd',
    'bt.l.youtube': 'YouTube favourites',
    'bt.l.youtube.short': 'YouTube',
    'bt.l.youtube.hint': 'Up to {n} channels or videos you love. Paste the YouTube link (Share › Copy link).',
    'bt.l.youtube.item': 'Channel or video',
    'bt.l.youtube.url': 'YouTube link (optional)',
    'bt.l.youtube.add': 'Add a YouTube favourite',
    'bt.l.youtube.hosts': 'YouTube',
    'bt.l.podcasts': 'Podcasts',
    'bt.l.podcasts.short': 'Podcasts',
    'bt.l.podcasts.hint': 'Up to {n} podcasts you listen to. Paste a Spotify or Apple Podcasts link.',
    'bt.l.podcasts.item': 'Podcast name',
    'bt.l.podcasts.url': 'Spotify or Apple Podcasts link (optional)',
    'bt.l.podcasts.add': 'Add a podcast',
    'bt.l.podcasts.hosts': 'Spotify or Apple Podcasts',
    'bt.l.books': 'Books',
    'bt.l.books.short': 'Books',
    'bt.l.books.hint': 'Up to {n} books you recommend. Add a Goodreads link if you have one; without one the title opens a Goodreads search.',
    'bt.l.books.item': 'Book title',
    'bt.l.books.url': 'Goodreads link (optional)',
    'bt.l.books.add': 'Add a book',
    'bt.l.books.hosts': 'Goodreads',
    'bt.l.foodSpots': 'Favourite food spots',
    'bt.l.foodSpots.short': 'Food spots',
    'bt.l.foodSpots.hint': 'Up to {n} places to eat — near the hospital, in your hometown, anywhere. Paste the Google Maps link (Share › Copy link).',
    'bt.l.foodSpots.item': 'Place name',
    'bt.l.foodSpots.url': 'Google Maps link (optional)',
    'bt.l.foodSpots.add': 'Add a food spot',
    'bt.l.foodSpots.hosts': 'Google Maps',
    'bt.l.travel': 'Travel bucket list',
    'bt.l.travel.short': 'Bucket list',
    'bt.l.travel.hint': 'Up to {n} places you want to go. Write the place name (e.g. Siargao, Batanes, Kyoto) — Philippine places also show on the Hometown map. Google Maps link optional.',
    'bt.l.travel.item': 'Place',
    'bt.l.travel.url': 'Google Maps link (optional)',
    'bt.l.travel.add': 'Add a place',
    'bt.l.travel.hosts': 'Google Maps',
    'bt.l.study': 'Study stash',
    'bt.l.study.short': 'Study stash',
    'bt.l.study.hint': 'Up to {n} study resources you swear by — a lecture channel, an app, a book, a website.',
    'bt.l.study.item': 'Resource',
    'bt.l.study.url': 'Link (optional)',
    'bt.l.study.add': 'Add a resource',
    'bt.l.study.hosts': 'https links',
    'nav.events': 'Batch events',
    'nav.monito': 'Kris Kringle',
    'nav.badges': 'Badges',
    'bt.f.askMe': 'Ask me about',
    'bt.h.askMe': 'Up to 3 topics, separated by commas — e.g. K-dramas, running, cats. They show on your card in the batch list.',
    'bt.f.teachWords': 'Words to teach the batch',
    'bt.h.teachWords': 'One per line: word or phrase — meaning (language). e.g. Mayap a abak — good morning (Kapampangan). One shows on Home as the Word of the day.',
    'bt.ask.k': 'Ask me about',
    'bt.word.h': 'Word of the day',
    'bt.word.by': 'Taught by {name}',
    'bt.badge.earned': 'Badge earned: {name} 🎉',
    'bt.badge.intro': '{n} of {total} badges earned on this phone.',
    'bt.badge.on': 'Earned {date}',
    'bt.badge.note': 'Badges are earned on this phone and show on your card when you share it.',
    'bt.shout.h': 'Shoutouts',
    'bt.shout.forYou': 'Shoutouts for you',
    'bt.shout.none': 'No shoutouts yet. Be the first!',
    'bt.shout.noneYou': 'None yet. When batchmates send you a shoutout and share their card, it shows here.',
    'bt.shout.you': 'you',
    'bt.shout.label': 'A shoutout for {name}',
    'bt.shout.ph': 'Thanks for covering my rounds! 🙏',
    'bt.shout.hint': 'Up to 280 characters. It travels with your card — share your card so they see it.',
    'bt.shout.send': 'Send shoutout',
    'bt.shout.sent': 'Shoutout added to your card. Share your card so it reaches them.',
    'bt.shout.needCard': 'Make your card first to send shoutouts',
    'bt.shout.homeH': 'A shoutout for you',
    'bt.shout.all': 'See all {n}',
    'bt.ev.intro': 'Welcome dinners, first days, exams, outings — with a countdown and add-to-calendar.',
    'bt.ev.firstDay': 'First day of residency',
    'bt.ev.tomorrow': 'Tomorrow',
    'bt.ev.yesterday': 'Yesterday',
    'bt.ev.ago': '{n} days ago',
    'bt.ev.next': 'Next event',
    'bt.ev.none': 'No upcoming events yet. Add one below.',
    'bt.ev.allCal': 'Add all upcoming to calendar',
    'bt.ev.past': 'Past events',
    'bt.ev.shareHint': 'Events travel with the batch file: Share cards › Share the whole batch.',
    'bt.ev.add': 'Add an event',
    'bt.ev.edit': 'Edit event',
    'bt.ev.title': 'What',
    'bt.ev.titlePh': 'Welcome dinner',
    'bt.ev.date': 'Date',
    'bt.ev.time': 'Time (optional)',
    'bt.ev.place': 'Where (optional)',
    'bt.ev.note': 'Notes (optional)',
    'bt.ev.save': 'Save event',
    'bt.ev.cancel': 'Cancel',
    'bt.ev.editBtn': 'Edit',
    'bt.ev.need': 'Add a title and a date.',
    'bt.ev.saved': 'Event saved.',
    'bt.ev.confirmDel': 'Remove “{title}”?',
    'bt.ev.imported': '{n} event(s) added or updated.',
    'bt.mm.intro': 'Draw names for the gift exchange. Each person gets one batchmate to give to — never themselves — and you send each one their match privately.',
    'bt.mm.notEnough': 'Needs at least 3 cards on this phone.',
    'bt.mm.who': 'Who’s joining?',
    'bt.mm.budget': 'Budget (optional)',
    'bt.mm.date': 'Exchange date (optional)',
    'bt.mm.addEvent': 'Add the exchange date to Batch events',
    'bt.mm.warn': 'Joining the exchange yourself? Don’t peek — just tap Send for each person. Or let someone who isn’t joining run the draw.',
    'bt.mm.draw': 'Draw names',
    'bt.mm.need3': 'Pick at least 3 people.',
    'bt.mm.drawn': '{n} people drawn on {date}',
    'bt.mm.budgetIs': 'Budget: {budget}',
    'bt.mm.howSend': 'Tap Send to open your share sheet with that person’s match (and their wishlist), then send it to them only.',
    'bt.mm.hidden': 'match hidden',
    'bt.mm.sent': 'sent ✓',
    'bt.mm.send': 'Send',
    'bt.mm.peek': 'Peek',
    'bt.mm.hide': 'Hide',
    'bt.mm.redraw': 'Draw again',
    'bt.mm.clear': 'Clear the draw',
    'bt.mm.redrawConfirm': 'Start over with a new draw? The current matches will be lost.',
    'bt.mm.clearConfirm': 'Clear the draw? The matches will be lost.',
    'bt.mm.sentTo': 'Sent to {name}.',
    'bt.mm.copied': 'Copied {name}’s match — paste it in a private chat with them.',
    'bt.mm.evTitle': 'Kris Kringle exchange',
    'bt.mm.msg': 'Hi {giver}! 🎁 Your Kris Kringle for {batch} is {receiver}.',
    'bt.mm.msgBudget': 'Budget: {budget}',
    'bt.mm.msgDate': 'Exchange: {date}',
    'bt.mm.msgWish': 'Their wishlist:',
    'bt.mm.msgSecret': 'Keep it a secret! 🤫',
    'bt.badge.started': 'Getting started',
    'bt.badge.started.how': 'Save your own card.',
    'bt.badge.openbook': 'Open book',
    'bt.badge.openbook.how': 'Fill in half of your card.',
    'bt.badge.wholestory': 'Whole story',
    'bt.badge.wholestory.how': 'Fill in 80% of your card.',
    'bt.badge.curator': 'Curator',
    'bt.badge.curator.how': 'Fill in 3 link lists on your card.',
    'bt.badge.polyglot': 'Polyglot',
    'bt.badge.polyglot.how': 'Add words to teach the batch.',
    'bt.badge.collector5': 'Collector',
    'bt.badge.collector5.how': 'Have 5 batchmates’ cards.',
    'bt.badge.collector10': 'Big collector',
    'bt.badge.collector10.how': 'Have 10 batchmates’ cards.',
    'bt.badge.collector20': 'Whole batch',
    'bt.badge.collector20.how': 'Have 20 batchmates’ cards.',
    'bt.badge.meteveryone': 'Met everyone',
    'bt.badge.meteveryone.how': 'Open every batchmate’s card (at least 5).',
    'bt.badge.perfectguess': 'Perfect round',
    'bt.badge.perfectguess.how': 'Get 10 out of 10 in Guess who.',
    'bt.badge.streak10': 'On a roll',
    'bt.badge.streak10.how': 'Guess 10 right in a row in Guess who.',
    'bt.badge.whosaid': 'Mind reader',
    'bt.badge.whosaid.how': 'Get every answer right in a Who said it? round (4 or more).',
    'bt.badge.bingo': 'Bingo!',
    'bt.badge.bingo.how': 'Get a line in Batch Bingo.',
    'bt.badge.wrapped': 'Wrapped up',
    'bt.badge.wrapped.how': 'Watch Batch Wrapped to the last slide.',
    'bt.badge.icebreaker': 'Icebreaker',
    'bt.badge.icebreaker.how': 'Go through 10 icebreakers.',
    'bt.badge.greeter': 'Birthday greeter',
    'bt.badge.greeter.how': 'Greet a batchmate on their birthday.',
    'bt.badge.shoutout': 'Cheerleader',
    'bt.badge.shoutout.how': 'Send a shoutout.',
    'bt.badge.planner': 'Planner',
    'bt.badge.planner.how': 'Add a batch event.',
    'bt.badge.monito': 'Santa’s helper',
    'bt.badge.monito.how': 'Run a Kris Kringle draw.',
    'bt.pl.hint': 'Up to {n} playlists. Paste the Spotify share link and give it a name.',
    'bt.pl.label': 'Playlist name',
    'bt.pl.url': 'Spotify link',
    'bt.pl.add': 'Add a playlist',
    'bt.pl.badUrl': 'A playlist link must start with https://open.spotify.com/ or https://spotify.link/',
    'bt.pl.open': 'Open in Spotify',
    'bt.zodiac': 'Zodiac',
    'bt.zodiac.cn': 'Chinese zodiac',
    'bt.link.open': 'Open',
    'bt.f.weekend': 'Typical weekend',
    'bt.f.guiltyPleasure': 'Guilty pleasure',
    'bt.f.petPeeve': 'Pet peeve',
    'bt.f.comfortShow': 'Comfort show for a bad day',
    'bt.f.lastBinge': 'Last thing you binge-watched',
    'bt.f.currentlyReading': 'Currently reading / listening to',
    'bt.f.nonNegotiable': 'Daily non-negotiable',
    'bt.f.alwaysInBag': 'Always in your bag',
    'bt.f.childhoodDream': 'Childhood dream job',
    'bt.f.childhoodNickname': 'Childhood nickname',
    'bt.f.firstConcert': 'First concert / first fandom',
    'bt.f.childhoodGame': 'Favourite childhood game',
    'bt.f.undergrad': 'Undergrad school and course',
    'bt.f.siblings': 'Siblings (how many, where you fall)',
    'bt.f.hometownTradition': 'Hometown fiesta or tradition you love',
    'bt.f.roleModel': 'Role model / person you look up to',
    'bt.f.motto': 'Life motto in one line',
    'bt.f.advocacy': 'Charity or advocacy you care about',
    'bt.f.recharge': 'What recharges you after a hard duty',
    'bt.f.proudest': 'Proudest moment so far',
    'bt.f.grateful': 'Something you’re grateful for this year',
    'bt.f.whyProgram': 'Why this program / why Mariveles',
    'bt.f.tenYears': 'Where you hope to be in 10 years',
    'bt.f.subspecialty': 'Subspecialty you’re curious about',
    'bt.f.studyTip': 'Best study tip you swear by',
    'bt.f.skillToLearn': 'Skill you want to learn during residency',
    'bt.f.askMeFor': 'Batchmates can always ask you for help with…',
    'bt.f.hotTake': 'Hot take (food or pop culture)',
    'bt.f.ifNotDoctor': 'If you weren’t a doctor, you’d be…',
    'bt.f.lastPhoto': 'Last photo on your camera roll (describe it)',
    'bt.f.lookalike': 'Celebrity lookalike people mention',
    'bt.f.duetSong': 'Karaoke duet partner wanted for…',
    'bt.f.viber': 'Viber number (if different)',
    'bt.f.telegram': 'Telegram / WhatsApp',
    'bt.f.email2': 'Second email (school / personal)',
    'bt.f.youtube': 'YouTube channel',
    'bt.f.discord': 'Discord',
    'bt.f.gcash': 'GCash / Maya number (for splitting batch expenses)',
    'bt.f.staying': 'Staying at a boarding house / dorm, or commuting from home',
    'bt.f.landmark': 'Nearest landmark to where you stay (for pick-ups)',
    'bt.f.birthdayPref': 'Birthday celebration preference (surprise OK? cake flavour?)',
    'bt.f.scrubSize': 'Scrub size',
    'bt.f.shoeSize': 'Shoe size',
    'bt.f.dutyConditions': 'Conditions to be aware of on duty (optional)',
    'bt.f.emergencyNumber': 'Emergency contact number',
    'bt.f.emergencyRelation': 'Emergency contact relationship',
    'nav.emergency': "Emergency info",
    'nav.emergencyShort': "Emergency",
    'nav.partners': "Partners",
    'bt.pt.intro': "The jowas and asawas of the batch. They have full cards, but stay out of the games, stats and batch grid.",
    'bt.pt.how': "How to add a partner",
    'bt.pt.howText': "Your partner installs Batch Tickler on their own phone and imports your card. Then they fill in My card, choose “I’m a partner” and pick you. They share their card like anyone else — or send it to you and you share it with the batch.",
    'bt.pt.none': "No partner cards yet.",
    'bt.pt.of': "Partner of {name}",
    'bt.pt.ofLead': "Partner of",
    'bt.pt.section': "Jowa / Asawa",
    'bt.pt.role': "Whose card is this?",
    'bt.pt.roleRes': "I’m a resident in the batch",
    'bt.pt.rolePt': "I’m the partner (jowa/asawa) of a resident",
    'bt.pt.pick': "My partner is",
    'bt.pt.pickNone': "— not on this phone yet —",
    'bt.pt.name': "Or type their full name",
    'bt.pt.nameOnly': "Your partner’s full name",
    'bt.pt.hint': "Partner cards show on their resident’s page, in Birthdays and on the Partners screen — not in the games, stats or batch grid.",
    'bt.pt.needWho': "Pick your partner, or type their name.",
    'bt.pt.count1': "1 partner card",
    'bt.pt.countN': "{n} partner cards",
    'bt.pt.tag': "Partner",
    'bt.g.emergency': "Emergency & medical",
    'bt.f.emergencyRelation2': "Second emergency contact relationship",
    'bt.f.emergencyNote': "Shown on the Emergency info screen of everyone you share your card with. Never on the printed sheet or name tags, and conditions never go in QR codes.",
    'bt.em.intro': "Blood types, allergies, conditions and emergency contacts for the whole batch in one place. Works offline.",
    'bt.em.note': "From the cards people chose to share with this phone. In a real emergency, call for help first.",
    'bt.em.call911': "Call 911",
    'bt.em.filter': "Find a batchmate",
    'bt.em.yours': "You",
    'bt.em.add': "Add your emergency info",
    'bt.em.addText': "Your card has no blood type, allergies or emergency contact yet. It takes a minute, and it helps the batch help you.",
    'bt.em.edit': "Edit my emergency info",
    'bt.em.blood': "Blood type",
    'bt.em.allergies': "Allergies",
    'bt.em.noAllergy': "None listed",
    'bt.em.conditions': "Conditions",
    'bt.em.own': "Own number",
    'bt.em.contact': "Emergency contact",
    'bt.em.missing': "No emergency info yet",
    'bt.em.missingText': "Ask them to fill in Emergency & medical on their card and share it again.",
    'bt.em.none': "No cards yet. Add yours, then import your batchmates’ cards.",
    'bt.em.noMatch': "No one matches.",
    'bt.em.homeS1': "1 batchmate · blood types, allergies, emergency contacts",
    'bt.em.homeSN': "{n} batchmates · blood types, allergies, emergency contacts",
    'bt.em.homeAdd': "Add yours",
    'bt.em.all': "Whole batch",
    'bt.f.emergencyContact2': 'Second emergency contact',
    'bt.f.emergencyNumber2': 'Second emergency contact number',
    'bt.f.prcExpiry': 'PRC licence expiry (month)',
    'bt.f.licenceExpiry': 'Driver’s licence expiry (month)',
    'bt.f.passportExpiry': 'Passport valid until (month)',
    'bt.h.prcExpiry': 'Just the month — to remind us when to renew. No numbers, please.',
    'bt.h.licenceExpiry': 'Just the month — to remind us when to renew. No numbers, please.',
    'bt.h.passportExpiry': 'Just the month — to remind us when to renew (and when to plan the batch trip). No numbers, please.',
    'bt.h.dutyConditions': 'Shared only with people you give your card to; never in QR codes or prints.',
    'bt.h.gcash': 'Never in QR codes or prints.',
    'bt.s.screen': 'On screen',
    'bt.s.play': 'Games & fandoms',
    'bt.s.words': 'Music & words',
    'bt.s.food': 'Food & drink',
    'bt.s.little': 'Little things',
    'bt.s.medschool': 'Med school',
    'bt.s.everyday': 'Everyday',
    'bt.s.growingup': 'Growing up',
    'bt.s.you': 'About you',
    'bt.s.horizons': 'Horizons',
    'bt.s.residency': 'Residency',
    'bt.s.fun': 'Just for fun',
    'bt.me.yearRequired': 'Please add your birth year too.',
    'bt.print.modeFull': 'Full directory',
    'bt.print.fullHint': 'Everything on every card, contact and practical details included, over as many pages as needed. Treat the printout as personal.',
    'bt.print.fullTitle': 'Batch directory (full)',
    'bt.print.custom': 'More',
    'bt.print.photoNone': 'no photo',
    'bt.f.contactNote': 'Fields marked “in-app only” (contact, allergies, emergency contact, socials) never appear on the printed sheet or name tags.',
    'bt.bd.intro': 'Birthdays by month, starting from today, with the age each person turns.',
    'bt.bd.today': 'Today',
    'bt.bd.thisMonth': 'This month',
    'bt.bd.upcoming': 'Coming up',
    'bt.bd.none': 'No birthdays entered yet. Each resident adds theirs on My card.',
    'bt.bd.noDate': 'Birthday not given',
    'bt.share.intro': 'Cards move between phones as small files. Share yours, import the ones you receive, or send the whole batch to someone who is just starting.',
    'bt.share.mine': 'Share my card',
    'bt.share.mineText': 'Sends a file with your card only. Batchmates import it on their phone.',
    'bt.share.mineBtn': 'Share my card',
    'bt.share.needMe': 'Fill in My card first.',
    'bt.share.import': 'Import cards',
    'bt.share.importText': 'Accepts a single card, a whole batch, or a Batch Tickler backup. Newer cards replace older copies; your own card is never overwritten.',
    'bt.share.importBtn': 'Import cards',
    'bt.share.all': 'Share the whole batch',
    'bt.share.allText': 'Sends every card on this device in one file. Handy for a batchmate who is starting from nothing.',
    'bt.share.allBtn': 'Share the batch',
    'bt.share.allEmpty': 'There are no cards to share yet.',
    'bt.share.shared': 'Ready to send — pick a chat or save it to Files.',
    'bt.share.saved': 'Saved {name}. Send it to your batchmates.',
    'bt.share.cancelled': 'Sharing cancelled.',
    'bt.share.notCards': 'That file does not contain Batch Tickler cards.',
    'bt.share.result': 'Imported: {added} new, {updated} updated, {skipped} skipped.',
    'bt.share.skippedMe': 'Your own card is not replaced by imports.',
    'bt.share.ownAll': 'Cards on this device: {n}.',
    'bt.print.intro': 'Batch sheet: a compact “meet the batch” page without contact details. Name tags: eight per page. Full directory: everything, over as many pages as needed. Use your browser’s Print (or Share → Print on iPhone) to print or save as PDF.',
    'bt.print.btn': 'Print',
    'bt.print.title': 'Meet the batch',
    'bt.print.subtitle': '{program} · {hospital}',
    'bt.print.empty': 'Nothing to print yet.',
    'bt.guess.intro': 'A quick game: read the clue, pick the batchmate. Needs at least four cards with that detail filled in.',
    'bt.guess.notEnough': 'Not enough cards yet. Once four batchmates have filled in their hometowns, hobbies or favourites, the game opens.',
    'bt.guess.whose': 'Whose {field} is this?',
    'bt.guess.right': 'Right!',
    'bt.guess.wrong': 'Not quite — it was {name}.',
    'bt.guess.next': 'Next clue',
    'bt.guess.score': 'Score {right} of {total}',
    'bt.guess.open': 'Open their card',
    'skip': 'Skip to content',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',
    'menu.title': 'Menu',
    'menu.main': 'Main menu',
    'sidebar.hide': 'Hide the sidebar',
    'sidebar.show': 'Show the sidebar',
    'hist.group': 'Page history',
    'hist.back': 'Back',
    'hist.backTitle': 'Back (Alt+Left)',
    'hist.fwd': 'Forward',
    'hist.fwdTitle': 'Forward (Alt+Right)',
    'brand.home': '{name}, home',
    'search.label': 'Search the whole app',
    'search.placeholder': 'Search this app',
    'search.title': 'Search',
    'search.noMatches': 'No matches for “{q}”',
    'search.seeAll1': 'See all {n} result',
    'search.seeAllN': 'See all {n} results',
    'search.count1': '{n} result for “{q}”',
    'search.countN': '{n} results for “{q}”',
    'search.prompt': 'Type in the search box above.',
    'search.filterBy': 'Filter by type',
    'search.all': 'All',
    'search.noneTitle': 'No matches',
    'search.noneText': 'Try a different word, or check the spelling.',
    'search.newsText': 'New features, content and corrections, newest first.',
    'search.aboutText': 'About this app, keyboard shortcuts, language, text size, theme and backup.',
    'textsize.title': 'Text size',
    'textsize.smaller': 'Smaller',
    'textsize.default': 'Default',
    'textsize.larger': 'Larger',
    'textsize.largest': 'Largest',
    'theme.title': 'Theme',
    'theme.label': 'Theme: {name}',
    'theme.auto': 'Match device',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'nav.start': 'Start',
    'nav.screens': 'Screens',
    'nav.app': 'App',
    'nav.otherApps': 'Other apps',
    'nav.newTab': '(opens in a new tab)',
    'nav.home': 'Home',
    'nav.whatsNew': 'What’s new',
    'nav.about': 'About',
    'nav.quick': 'Quick navigation',
    'home.explore': 'Explore',
    'home.emptyTitle': 'Nothing here yet',
    'home.emptyText': 'Nothing to show yet.',
    'home.latest': '{title} · version {version}',
    'news.intro1': 'New features, content and corrections, newest first. Entries marked ',
    'news.new': 'New',
    'news.intro2': ' were added since your last visit.',
    'news.version': 'Version {v}',
    'news.open': 'Open',
    'news.type.feature': 'Feature',
    'news.type.update': 'Update',
    'news.type.correction': 'Correction',
    'news.type.content': 'Content',
    'news.note': 'Suggestions or corrections? Email ',
    'about.title': 'About',
    'about.version': 'version',
    'about.settings': 'Settings',
    'about.language': 'Language',
    'about.langEn': 'English',
    'about.langTl': 'Tagalog',
    'about.tips': 'Tips',
    'about.tip1': 'Press [[/]] to search from anywhere.',
    'about.tip2': 'Back and forward: the arrow buttons in the top bar, or [[Alt]]+[[Left]] and [[Alt]]+[[Right]].',
    'about.tip3': 'Make text smaller or larger with the **Aa** button. The sun/moon button switches between match device, light and dark.',
    'about.tip4': 'Use **Export backup** in the footer to save what this app stores on this device, and **Import backup** to restore it elsewhere.',
    'about.tip5': 'Install it: use **Add to Home Screen** (iPhone Safari) or **Install app** (Android Chrome).',
    'notfound.title': 'Page not found',
    'notfound.text': 'That page does not exist in this app.',
    'notfound.home': 'Go home',
    'backup.title': 'Back up your data',
    'backup.text': 'Anything this app saves lives only in this browser. Export a backup file to keep it safe, then import it on another phone, tablet or computer to pick up where you left off.',
    'backup.export': 'Export backup',
    'backup.import': 'Import backup',
    'backup.undo': 'Undo last import',
    'backup.item1': '{n} saved item',
    'backup.itemN': '{n} saved items',
    'backup.nothing': 'nothing saved yet',
    'backup.onDevice': 'On this device: {summary}.',
    'backup.lastExported': 'Last exported {date}.',
    'backup.notExported': 'Not exported yet.',
    'backup.shareTitle': '{app} backup',
    'backup.shared': 'Backup ready: save it somewhere you can reach from your other device.',
    'backup.exportCancelled': 'Export cancelled.',
    'backup.saved': 'Saved {name}. Move it to your other device and choose Import backup there.',
    'backup.notBackup': 'That is not a {app} backup file.',
    'backup.unreadable': 'That file could not be read.',
    'backup.unknownDate': 'an unknown date',
    'backup.confirmImport': 'Import the backup from {date}?\n\nBackup: {backup}.\nThis device now: {device}.\n\nData on this device will be replaced. You can undo this from the footer.',
    'backup.importCancelled': 'Import cancelled.',
    'backup.importFailed': 'Import failed: this browser would not save the data.',
    'backup.imported': 'Backup imported. Reloading…',
    'backup.confirmUndo': 'Restore the data this device had before the last import ({summary})?',
    'backup.undoFailed': 'Undo failed.',
    'backup.restored': 'Previous data restored. Reloading…',
    // 1.15.0
    'nav.truths': 'Two truths and a lie',
    'nav.quiz': 'How well do you know…?',
    'nav.baby': 'Baby photo guess',
    'nav.tot': 'This or that',
    'nav.sup': 'Batch superlatives',
    'nav.qotw': 'Question of the week',
    'nav.capsule': 'Time capsule',
    'nav.eat': 'Where should we eat?',
    'nav.anthem': 'Batch anthem',
    'bt.fun.needCard': 'Make your card first so your answers can travel with it.',
    'bt.fun.more': 'More on your card',
    'bt.fun.moreHint': 'These live on their own screens and travel with your card file.',
    'bt.common.tot': 'Same This-or-that picks: {value}',
    'bt.res.text': '{game} — {right}/{n} · {batch}',
    'bt.res.bingo': 'Batch Bingo! · {batch} · {n} squares',
    'bt.res.share': 'Share result',
    'bt.res.copied': 'Result copied — paste it in the group chat.',
    'bt.tt.intro': 'Everyone writes two true things and one lie. Can you spot the lie?',
    'bt.tt.mine': 'Your two truths and a lie',
    'bt.tt.mineHint': 'Write three short statements about yourself — two true, one false — then mark the lie. They travel with your card.',
    'bt.tt.stmt': 'Statement {n}',
    'bt.tt.isLie': 'This is the lie',
    'bt.tt.need3': 'Fill in all three statements.',
    'bt.tt.needLie': 'Mark which one is the lie.',
    'bt.tt.saved': 'Saved. Share your card so the batch can play.',
    'bt.tt.none': 'Nobody else has added theirs yet. Once batchmates add theirs and share their cards, you can play here.',
    'bt.tt.ask': 'Which one is the lie?',
    'bt.quiz.intro': 'A quick quiz made from one batchmate’s card. Then send them your score.',
    'bt.quiz.title': 'How well do you know {name}?',
    'bt.quiz.none': 'Needs batchmates with fuller cards — import a few cards first.',
    'bt.quiz.few': 'Their card doesn’t have enough answers for a quiz yet.',
    'bt.quiz.nq': '{n} questions',
    'bt.quiz.best': 'your best: {right}/{n}',
    'bt.quiz.qField': '{field} — which is {name}’s answer?',
    'bt.quiz.qMonth': 'Which month is {name}’s birthday?',
    'bt.quiz.qTot': 'This or that: what did {name} pick?',
    'bt.quiz.qLie': 'Which one is {name}’s lie?',
    'bt.quiz.v0': 'Time for a kwentuhan session!',
    'bt.quiz.v1': 'Not bad — you’re getting there.',
    'bt.quiz.v2': 'You know them well!',
    'bt.quiz.v3': 'Perfect! Certified best friend.',
    'bt.quiz.other': 'Another batchmate',
    'bt.baby.intro': 'Match each baby photo to the batchmate.',
    'bt.baby.mine': 'Your baby photo',
    'bt.baby.hint': 'Optional. A childhood photo of you. It travels with your card file (not the QR code).',
    'bt.baby.saved': 'Baby photo saved.',
    'bt.baby.none': 'Needs at least 2 batchmates with baby photos (and 4 cards). Ask the batch to add theirs!',
    'bt.baby.ask': 'Who is this baby?',
    'bt.tot.intro': 'Quick picks — then see how the batch splits.',
    'bt.tot.mine': 'My picks',
    'bt.tot.split': 'Batch split',
    'bt.tot.or': 'or',
    'bt.tot.progress': '{n} of {total} answered. Tap again to clear a pick.',
    'bt.tot.twins': 'Most like you',
    'bt.tot.same': 'same pick on {same} of {both}',
    'bt.tot.none': 'No picks yet. Answer yours and share your card.',
    'bt.sup.intro': 'Yearbook-style awards. Vote for a batchmate in each; results count the votes on every card on this phone.',
    'bt.sup.vote': 'My votes',
    'bt.sup.results': 'Results',
    'bt.sup.pick': '— choose —',
    'bt.sup.progress': '{n} of {total} voted.',
    'bt.sup.noOthers': 'Import your batchmates’ cards first so you have someone to vote for.',
    'bt.sup.note': 'Your votes travel with your card file, so batchmates see the totals after they import it.',
    'bt.sup.votes1': '1 vote',
    'bt.sup.votesN': '{n} votes',
    'bt.sup.also': 'Also voted:',
    'bt.sup.none': 'No votes yet.',
    'bt.qotw.intro': 'One new question every Monday. Answer it, share your card, and read everyone’s answers.',
    'bt.qotw.thisWeek': 'This week',
    'bt.qotw.yours': 'You:',
    'bt.qotw.ph': 'Your answer',
    'bt.qotw.post': 'Post',
    'bt.qotw.posted': 'Answer saved. It travels with your card.',
    'bt.qotw.first': 'No answers from the batch yet — be the first.',
    'bt.qotw.noneYet': 'No answers yet.',
    'bt.qotw.more': '+{n} more',
    'bt.qotw.all': 'All weeks',
    'bt.qotw.past': 'Past weeks',
    'bt.bw.h': 'Birthday wall',
    'bt.bw.about': 'Messages for {name}’s birthday ({date}). They see them on the day.',
    'bt.bw.none': 'No messages yet — write the first one.',
    'bt.bw.noneYou': 'No birthday messages yet.',
    'bt.bw.wait1': '1 message is waiting for your birthday.',
    'bt.bw.waitN': '{n} messages are waiting for your birthday.',
    'bt.bw.label': 'A birthday message for {name}',
    'bt.bw.ph': 'Happy birthday! …',
    'bt.bw.hint': 'It travels with your card. {name} sees it on their birthday after importing your card.',
    'bt.bw.post': 'Add to the wall',
    'bt.bw.posted': 'Added to the birthday wall.',
    'bt.bw.home1': '1 message on the birthday wall',
    'bt.bw.homeN': '{n} messages on the birthday wall',
    'bt.bw.read': 'Read the wall',
    'bt.cap.intro': 'Write a letter that stays sealed until a date you pick — to future you, or to the whole batch.',
    'bt.cap.write': 'Write a letter',
    'bt.cap.to': 'To',
    'bt.cap.toSelfL': 'Future me (stays on this phone)',
    'bt.cap.toBatchL': 'The batch (travels with your card, up to 5)',
    'bt.cap.letter': 'Letter',
    'bt.cap.ph': 'Dear future me…',
    'bt.cap.openOn': 'Open on',
    'bt.cap.seal': 'Seal it',
    'bt.cap.sealed': 'Sealed. 🔒',
    'bt.cap.note': 'Sealed means hidden in this app, not encrypted — anyone who opens your card file could still read a letter to the batch.',
    'bt.cap.needText': 'Write something first.',
    'bt.cap.needDate': 'Pick an opening date after today.',
    'bt.cap.max': 'Up to 5 letters to the batch. Remove one first.',
    'bt.cap.none': 'No letters yet.',
    'bt.cap.toSelf': 'To future you',
    'bt.cap.fromYou': 'From you to the batch',
    'bt.cap.from': 'From {name}',
    'bt.cap.opens': 'opens {date}',
    'bt.cap.opened': 'opened {date}',
    'bt.cap.peek': 'Peek early',
    'bt.cap.peekConfirm': 'Open this letter before its date?',
    'bt.cap.delConfirm': 'Remove this letter?',
    'bt.cap.homeH': 'A time capsule just opened',
    'bt.tc.title': 'Trading card',
    'bt.tc.intro': 'Your card as a picture — post it in the group chat or your story.',
    'bt.tc.alt': 'Trading card for {name}',
    'bt.tc.share': 'Share or save image',
    'bt.tc.saved': 'Image saved: {name}',
    'bt.eat.intro': 'Can’t decide? Spin through everyone’s favourite food spots.',
    'bt.eat.none': 'Nobody has added favourite food spots yet (My card › Favourite food spots).',
    'bt.eat.spin': 'Spin!',
    'bt.eat.again': 'Spin again',
    'bt.eat.count': '{n} places in the pool',
    'bt.eat.from': 'From the favourites of {names}',
    'bt.eat.maps': 'Open in Maps',
    'bt.eat.share': 'Send to the group',
    'bt.eat.msg': 'Tara, kain tayo sa {place}! 🍽️',
    'bt.eat.who': 'Who’s coming?',
    'bt.eat.list': 'All the spots',
    'bt.an.intro': 'Everyone picks one song that sums them up. Together they’re the batch anthem.',
    'bt.an.mine': 'Your song',
    'bt.an.song': 'Song (title — artist)',
    'bt.an.songPh': 'e.g. Tadhana — Up Dharma Down',
    'bt.an.url': 'Link (optional)',
    'bt.an.hint': 'A Spotify, YouTube or Apple Music link.',
    'bt.an.needTitle': 'Add the song title.',
    'bt.an.badUrl': 'That link isn’t from Spotify, YouTube or Apple Music.',
    'bt.an.saved': 'Song saved.',
    'bt.an.none': 'No songs yet.',
    'bt.an.play': 'Play',
    'bt.an.find': 'Find it',
    'bt.an.k': 'Anthem',
    'bt.an.homeH': 'Batch anthem of the week',
    'bt.badge.liedetector': 'Lie detector',
    'bt.badge.liedetector.how': 'Spot 5 lies in Two truths and a lie.',
    'bt.badge.quizmaster': 'Best friend material',
    'bt.badge.quizmaster.how': 'Get every question right in a How well do you know…? quiz.',
    'bt.badge.babyface': 'Baby whisperer',
    'bt.badge.babyface.how': 'Match every baby photo in a round (3 or more).',
    'bt.badge.pollster': 'Decisive',
    'bt.badge.pollster.how': 'Answer every This or that.',
    'bt.badge.voter': 'Ballot caster',
    'bt.badge.voter.how': 'Vote in every batch superlative.',
    'bt.badge.qotw': 'Weekly regular',
    'bt.badge.qotw.how': 'Answer a Question of the week.',
    'bt.badge.timekeeper': 'Time traveller',
    'bt.badge.timekeeper.how': 'Seal a time-capsule letter.',
    'bt.badge.dj': 'Batch DJ',
    'bt.badge.dj.how': 'Add your song to the batch anthem.',
    'bt.badge.foodie': 'Food tripper',
    'bt.badge.foodie.how': 'Spin Where should we eat?'
  },

  // Tagalog draft — Dr. Navarro reviews before release
  tl: {
    /* ---- Batch Tickler screens (Tagalog draft — Dr. Navarro reviews before release) ---- */
    'nav.batch': 'Ang batch',
    'nav.me': 'Card ko',
    'nav.birthdays': 'Mga kaarawan',
    'nav.share': 'Ibahagi ang mga card',
    'nav.print': 'Print sheet',
    'nav.guess': 'Hulaan kung sino',
    'bt.hero.cta': 'Punan ang card ko',
    'bt.hero.ctaDone': 'Tingnan ang batch',
    'nav.play': 'Laro',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.map': 'Mapa ng probinsya',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.whosaid': 'Sino ang nagsabi?',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.bingo': 'Batch Bingo',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.icebreakers': 'Icebreakers',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.wrapped': 'Batch Wrapped',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.title': 'Residency',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.set': 'Ilagay ang start date sa About para mabilang ang araw.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.tomorrow': 'Magsisimula bukas!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.inN': 'Magsisimula sa loob ng {n} araw',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.dayN': 'Araw {n}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.year': 'Taon {n} ng residency',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.m1': 'Unang araw. Welcome sa residency!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.mN': 'Araw {n}: isang milestone!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.mYear': '{n} taon na ng residency ngayon!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.setting': 'Petsa ng simula ng residency',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.day.hint': 'Magsisimula ang batch sa 1 Enero 2027. Palitan lang kung iba ang petsa mo; burahin para bumalik sa 1 Enero 2027.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bdt.kicker': 'Kaarawan ngayon',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bdt.title': 'Maligayang kaarawan, {names}!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bdt.you': 'Maligayang kaarawan sa iyo!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bdt.youToo': 'At maligayang kaarawan din sa iyo!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bdt.greet': 'Batiin',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bdt.copied': 'Nakopya ang bati. I-paste sa chat mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bdt.msg': 'Happy birthday, {name}! 🎂 Masayang taon sa iyo. Mula sa mga kabatch mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bdt.msgBatch': 'Happy birthday, {name}! 🎂 Masayang taon sa iyo. Mula sa mga kabatch mo sa {batch}.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.spot.h': 'Spotlight ngayong linggo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.spot.open': 'Basahin ang card niya',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ws.intro': 'Isang tanong, sagot ng lahat: basahin ang sagot at hulaan kung kanino.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ws.notEnough': 'Kailangan ng dalawang card man lang na sumagot sa parehong tanong.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ws.topic': 'Tanong',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ws.other': 'Ibang tanong',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ws.ask': 'Kanino ang sagot na ito sa {field}?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.intro': 'Hanapin ang mga kabatch na tugma sa bawat kahon. I-tap ang kahon kapag may nahanap ka. Lima nang sunod-sunod (pahalang, pababa o pahilis) ang panalo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.notEnough': 'Kulang pa ang detalye sa mga card. Mag-import muna ng ilan pang card.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.win': 'BINGO! 🎉',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.winN': 'BINGO × {n}! 🎉',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.free': 'Libre',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.new': 'Bagong card',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.newConfirm': 'Magsimula ng bagong bingo card? Mabubura ang mga marka sa card na ito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.how': 'Galing sa mga card ng batch ang mga kahon. Magtanong-tanong sa halip na sumilip; pang-check ang Ipakita kung sino.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.reveal': 'Ipakita kung sino',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bingo.hide': 'Itago ang pangalan',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.twins.h': 'Batch twins',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.twins.intro': 'Ang mga pares na pinakamaraming pagkakapareho.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.twins.n1': '1 pagkakapareho',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.twins.nN': '{n} pagkakapareho',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.twins.top': 'pinakamalapit',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.twins.more': 'at {n} pa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.twins.none': 'Wala pang dalawang card na may pagkakapareho.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.intro': 'Pambukas ng usapan sa break sa duty, tanghalian at batch night.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.modeQ': 'Mga tanong',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.modeCard': 'Mula sa mga card',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.ask': 'Itanong ito',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.askWho': 'Subukang tanungin si {name}.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.next': 'Susunod',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.otherWho': 'Iba naman',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.noCards': 'Mag-import muna ng mga card ng kabatch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.cardQ': 'Tanungin si {name} tungkol sa {field} niya.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.theirCard': 'Sabi ng card niya',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ice.reveal': 'Silipin ang card niya',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.intro': 'Kung taga-saan ang lahat, batay sa Hometown sa bawat card.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.noData': 'Hindi nag-load ang datos ng mapa.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.aria': 'Mapa ng Pilipinas na may mga hometown ng batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.hosp': 'ang ospital',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.tap': 'I-tap ang tuldok para makita kung sino ang taga-roon.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.places': '{n} lugar',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.empty': 'Wala pang hometown na nasa mapa.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.off': 'Wala sa mapa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.offHint': 'Mga hometown na hindi nakilala ng mapa (abroad, o iba ang baybay). Makakatulong ang “siyudad, probinsya”.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.none': '{n} na walang hometown sa card.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.src': 'Balangkas ng mapa: Natural Earth (public domain). Tantiya lang ang mga tuldok.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.intro': 'Ang batch sa ilang slide. I-tap ang Susunod o mag-swipe.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.notEnough': 'Kailangan ng dalawang card man lang.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.prev': 'Bumalik',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.next': 'Susunod',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.again': 'Ulitin',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.note': 'Ginawa mula sa mga card sa device na ito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.theBatch': 'Ang batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k0': 'Batch Wrapped {year}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s0': 'Balikan natin kung sino tayo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k1': 'Sa bilang',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s1': 'residente sa device na ito',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.towns': 'hometown',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.schools': 'medical school',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.langs': 'wika',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k2': 'Panahon ng kaarawan',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s2': '{n} kaarawan sa buwang iyon',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s2one': 'ang unang kaarawan sa listahan',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.zodiac': 'Pinakakaraniwang sign: {sign} ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k3': 'Ipinanganak mula',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s3': '{n} taon ng kapanganakan sa iisang batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k4': 'Paborito ng batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.b4': 'Ang mga gusto natin',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.food': 'Pagkain: {v} ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.shows': 'Show: {v} ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.music': 'Musika: {v} ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.movies': 'Pelikula: {v} ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.games': 'Laro: {v} ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.hobbies': 'Hobby: {v} ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k5': 'Pinakakaraniwang hometown',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s5': 'tahanan ng {n} sa atin',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k6': 'Mga playlist na ibinahagi',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s6': 'Spotify playlist sa mga card ng batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s6one': 'Spotify playlist sa mga card ng batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k7': 'Para sa residency',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s7': 'Masaya kaming kasama ka sa batch na ito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.today.h': 'Ngayong araw sa batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.today.pl': 'Tampok na Spotify playlist ngayon',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.today.fact': 'Tampok na kaalaman ngayong araw',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.today.by': 'Ibinahagi ni {name}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.today.another': 'Iba pa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.home.count1': '{n} residente na sa batch mo.',
    'bt.home.countN': '{n} residente na sa batch mo.',
    'bt.home.nextBirthday': 'Susunod na kaarawan',
    'bt.home.today': 'Ngayon!',
    'bt.home.inDays1': 'bukas',
    'bt.home.inDaysN': 'sa loob ng {n} araw',
    'bt.home.noMe': 'Magsimula sa sarili mong card, tapos ibahagi ito sa batch.',
    'bt.batch.intro': 'Lahat ng may card sa device na ito. I-tap ang card para magbasa pa.',
    'bt.batch.filter': 'I-filter ayon sa pangalan, bayan, paaralan…',
    'bt.batch.sortName': 'Ayon sa pangalan',
    'bt.batch.sortBirthday': 'Ayon sa kaarawan',
    'bt.batch.sortHometown': 'Ayon sa bayan',
    'bt.batch.emptyTitle': 'Wala pang card',
    'bt.batch.emptyText': 'Punan muna ang sarili mong card, tapos i-import ang mga card na ibabahagi ng mga kabatch mo.',
    'bt.batch.noMatch': 'Walang tumutugma.',
    'bt.batch.you': 'Ikaw',
    'bt.person.notFound': 'Wala ang card na iyan sa device na ito.',
    'bt.person.edit': 'I-edit ang card ko',
    'bt.person.remove': 'Alisin ang card na ito',
    'bt.person.confirmRemove': 'Alisin si {name} sa device na ito? Maaari mong i-import muli ang card niya mamaya.',
    'bt.person.updated': 'Na-update ang card noong {date}',
    'bt.person.birthday': 'Kaarawan',
    'bt.person.turns': 'magiging {n}',
    'bt.person.contact': 'Kontak',
    'bt.person.call': 'Tawagan',
    'bt.person.text': 'I-message',
    'bt.person.mail': 'I-email',
    'bt.me.title': 'Card ko',
    'bt.me.intro': 'Ikaw lang ang makakapag-edit ng card na ito; naka-save ito sa device na ito. Ibahagi ito sa batch mula sa Ibahagi ang mga card.',
    'bt.me.name': 'Buong pangalan',
    'bt.me.nameHint': 'Kung paano mo gustong makita ito ng batch.',
    'bt.me.photo': 'Larawan',
    'bt.me.photoHint': 'Opsyonal. Pinakamaganda ang parisukat na larawan; pinaliliit ito para manatiling maliit ang card.',
    'bt.me.choosePhoto': 'Pumili ng larawan',
    'bt.me.removePhoto': 'Alisin ang larawan',
    'bt.me.birthday': 'Kaarawan',
    'bt.me.month': 'Buwan',
    'bt.me.day': 'Araw',
    'bt.me.year': 'Taon',
    'bt.me.none': '—',
    'bt.me.save': 'I-save ang card ko',
    'bt.me.saved': 'Na-save. Napapanahon na ang card mo sa device na ito.',
    'bt.me.needName': 'Ilagay muna ang pangalan mo.',
    'bt.me.badBirthday': 'Hindi totoong petsa ang kaarawang iyan.',
    'bt.me.photoTooBig': 'Hindi mabasa ang larawang iyan. Sumubok ng mas maliit na larawan.',
    'bt.me.clear': 'Burahin ang card ko',
    'bt.me.confirmClear': 'Burahin ang lahat sa card mo? Mananatili ang mga card ng mga kabatch mo.',
    'bt.f.nickname': 'Palayaw',
    'bt.f.hometown': 'Bayan',
    'bt.f.medSchool': 'Med school',
    'bt.f.hobbies': 'Mga libangan',
    'bt.f.shows': 'Paboritong TV show',
    'bt.f.movies': 'Paboritong pelikula',
    'bt.f.cartoons': 'Paboritong cartoon',
    'bt.f.anime': 'Paboritong anime',
    'bt.f.games': 'Paboritong video game',
    'bt.f.music': 'Musika at artist',
    'bt.f.food': 'Paboritong pagkain',
    'bt.f.funFact': 'Fun fact',
    'bt.f.phone': 'Numero ng cellphone',
    'bt.f.email': 'Email',
    'bt.g.basics': 'Pangunahin',
    'bt.g.background': 'Pinagmulan',
    'bt.g.favourites': 'Mga paborito',
    'bt.g.life': 'Buhay',
    'bt.g.contact': 'Kontak at praktikal',
    'bt.g.custom': 'Higit pa tungkol sa akin',
    'bt.f.preferredName': 'Paano ka tatawagin',
    'bt.f.pronouns': 'Panghalip',
    'bt.f.livesNow': 'Saan ka nakatira ngayon',
    'bt.f.commute': 'Paano ka pumupunta sa Mariveles',
    'bt.f.languages': 'Mga wika at diyalekto',
    'bt.f.internship': 'Ospital ng internship',
    'bt.f.gradYear': 'Taon ng pagtatapos',
    'bt.f.pastJobs': 'Dating trabaho / buhay bago mag-residency',
    'bt.f.whyPsych': 'Bakit psychiatry',
    'bt.f.interests': 'Mga larangan ng interes',
    'bt.f.kdrama': 'Paboritong K-drama',
    'bt.f.books': 'Paboritong libro',
    'bt.f.authors': 'Paboritong may-akda',
    'bt.f.podcasts': 'Mga podcast',
    'bt.f.sports': 'Sports at koponan',
    'bt.f.snack': 'Paboritong meryenda',
    'bt.f.comfortFood': 'Comfort food',
    'bt.f.localEats': 'Paboritong kainan sa Mariveles / Balanga',
    'bt.f.dessert': 'Paboritong panghimagas',
    'bt.f.coffeeTea': 'Order na kape o tsaa',
    'bt.f.colour': 'Paboritong kulay',
    'bt.f.pokemon': 'Paboritong Pokémon',
    'bt.f.cantLiveWithout': 'Hindi mabubuhay nang wala',
    'bt.f.karaoke': 'Kantang pang-karaoke',
    'bt.f.studyStyle': 'Night owl o early bird',
    'bt.f.pets': 'Mga alaga',
    'bt.f.hiddenTalent': 'Tagong talento',
    'bt.f.destress': 'Pampawala ng stress',
    'bt.f.giftHints': 'Mga gustong regalo / wish list',
    'bt.f.social': 'Mga social media handle',
    'bt.f.allergies': 'Allergy o diyeta',
    'bt.f.emergencyContact': 'Emergency contact name',
    'bt.f.inAppOnly': 'sa app lang',
    'bt.custom.title': 'Sarili mong mga field',
    'bt.custom.hint': 'Kung may nakaligtaan ang listahan — lagyan ng label at sagot.',
    'bt.custom.label': 'Label',
    'bt.custom.value': 'Sagot',
    'bt.custom.add': 'Magdagdag ng field',
    'bt.custom.remove': 'Alisin',
    'bt.me.complete': '{n} sa {total} ang napunan',
    'bt.me.completeHint': 'Kapag mas marami kang pinunan, mas makikilala ka ng batch.',
    'bt.me.expandAll': 'Buksan ang lahat ng seksyon',
    'bt.me.collapseAll': 'Isara ang lahat ng seksyon',
    'bt.common.title': 'Mga pagkakatulad',
    'bt.common.none': 'Wala pang pagkakatulad — punan pa ang card mo at ang kanila.',
    'bt.common.same': 'Parehong {field}: {value}',
    'bt.common.shared': 'Pareho kayong mahilig sa: {value} ({field})',
    'bt.batchName': 'Pangalan ng batch',
    'bt.batchNameHint': 'Lalabas sa home screen at sa printed sheet, hal. “Batch 2027”.',
    'nav.scan': 'I-scan ang card',
    'nav.stats': 'Batch stats',
    'bt.qr.title': 'Ipakita ang QR ko',
    'bt.qr.text': 'Bubuksan ng kabatch ang I-scan ang card at itututok ang camera dito. Dala ng QR ang teksto ng card mo, hindi ang larawan — ibahagi ang file para sa buong card.',
    'bt.qr.btn': 'Ipakita ang QR ko',
    'bt.qr.hide': 'Itago ang QR',
    'bt.qr.trimmed': 'Mahaba ang card mo, kaya dala ng QR ang unang {n} sa {total} field. Ibahagi ang file para sa lahat.',
    'bt.qr.linkText': 'Buksan ang Batch Tickler',
    'bt.scan.intro': 'Itutok ang camera sa QR ng kabatch, o pumili ng screenshot nito. Idadagdag ang card sa batch mo.',
    'bt.scan.start': 'Buksan ang camera',
    'bt.scan.stop': 'Isara ang camera',
    'bt.scan.photo': 'I-scan ang screenshot o larawan',
    'bt.scan.noCamera': 'Walang camera dito — gumamit na lang ng screenshot.',
    'bt.scan.denied': 'Hindi ibinigay ang pahintulot sa camera. Puwede ka pa ring mag-scan ng screenshot.',
    'bt.scan.looking': 'Naghahanap ng QR…',
    'bt.scan.notFound': 'Walang nakitang QR code sa larawang iyan.',
    'bt.scan.notCard': 'Hindi Batch Tickler card ang QR na iyan.',
    'bt.scan.added': 'Naidagdag si {name} sa batch mo.',
    'bt.scan.updated': 'Na-update ang card ni {name}.',
    'bt.scan.same': 'Napapanahon na ang card ni {name}.',
    'bt.scan.me': 'Sarili mong card iyan.',
    'bt.scan.again': 'Mag-scan ulit',
    'bt.cal.one': 'Idagdag sa kalendaryo',
    'bt.cal.all': 'Kalendaryo ng mga kaarawan ng batch',
    'bt.cal.allText': 'Isang calendar file na may lahat ng kaarawan, taun-taon. Buksan ito sa telepono mo at iaalok nitong idagdag ang mga event.',
    'bt.cal.summary': 'Kaarawan ni {name}',
    'bt.cal.saved': 'Handa na ang calendar file: {name}.',
    'bt.stats.intro': 'Ang hitsura ng batch, mula sa mga card sa device na ito.',
    'bt.stats.residents': 'residente',
    'bt.stats.withPhoto': 'may larawan',
    'bt.stats.avgComplete': 'average na napunan sa card',
    'bt.stats.hometowns': 'Mga bayan',
    'bt.stats.schools': 'Mga med school',
    'bt.stats.languages': 'Mga wika at diyalekto',
    'bt.stats.months': 'Mga kaarawan ayon sa buwan',
    'bt.stats.ages': 'Pinakamatanda hanggang pinakabata',
    'bt.stats.thisMonth': 'Ngayong buwan sa batch',
    'bt.stats.thisMonthNone': 'Walang kaarawan ngayong buwan.',
    'bt.stats.shared': 'Pinakamaraming nagkakatulad na paborito',
    'bt.stats.sharedNone': 'Wala pang paboritong pareho ng dalawa o higit pang tao.',
    'bt.stats.n1': '{n} tao',
    'bt.stats.nN': '{n} tao',
    'bt.stats.empty': 'Wala pang mabibilang.',
    'bt.print.modeSheet': 'Batch sheet',
    'bt.print.modeTags': 'Mga name tag',
    'bt.print.tagsHint': 'Walong tag bawat A4 na pahina. Gupitin sa mga gilid.',
    'bt.guess.modeClue': 'Clue → pangalan',
    'bt.guess.modePhoto': 'Larawan → pangalan',
    'bt.guess.modeMonth': 'Pangalan → buwan ng kaarawan',
    'bt.guess.whosePhoto': 'Sino ito?',
    'bt.guess.whichMonth': 'Anong buwan ang kaarawan ni {name}?',
    'bt.guess.roundOf': 'Tanong {i} sa {n}',
    'bt.guess.roundDone': 'Tapos ang round: {right} sa {n}.',
    'bt.guess.playAgain': 'Maglaro ulit',
    'bt.guess.board': 'Leaderboard (sa teleponong ito)',
    'bt.guess.boardEmpty': 'Wala pang natapos na round.',
    'bt.guess.boardRow': '{right}/{n} · {mode} · {date}',
    'bt.guess.needPhotos': 'Kailangan ng apat na card na may larawan.',
    'bt.guess.needDates': 'Kailangan ng apat na card na may kaarawan.',
    'bt.guess.player': 'Manlalaro',
    'bt.banner.title': 'Larawan ng batch',
    'bt.banner.hint': 'Opsyonal. Pinapalitan nito ang larawan sa home screen sa device na ito — pinakamaganda ang malapad na group photo. Kasama ito sa backup pero hindi sa mga ibinahaging card.',
    'bt.banner.choose': 'Pumili ng larawan',
    'bt.banner.remove': 'Gamitin ang default na larawan',
    'bt.banner.saved': 'Na-save ang larawan ng batch.',
    'bt.f.season': 'Paboritong panahon',
    'bt.f.flower': 'Paboritong bulaklak o halaman',
    'bt.f.animal': 'Paboritong hayop',
    'bt.f.boardGames': 'Paboritong board o card game',
    'bt.f.youtubers': 'Paboritong YouTuber / streamer',
    'bt.f.canCook': 'Pagkaing Pilipino na kaya mong lutuin',
    'bt.f.milkTea': 'Order na milk tea',
    'bt.f.fastFood': 'Paboritong fast food',
    'bt.f.fruit': 'Paboritong prutas',
    'bt.f.app': 'Paboritong app',
    'bt.f.holiday': 'Paboritong holiday o pista',
    'bt.f.disney': 'Paboritong Disney / Pixar na pelikula',
    'bt.f.superhero': 'Paboritong superhero',
    'bt.f.fandom': 'Fandom / house (Hogwarts house, atbp.)',
    'bt.f.emoji': 'Paboritong emoji',
    'bt.f.quote': 'Paboritong kasabihan o motto',
    'bt.f.bibleVerse': 'Paboritong talata sa Bibliya',
    'bt.f.prayer': 'Paboritong panalangin',
    'bt.f.subject': 'Paborito (at pinakaayaw) na subject sa med school',
    'bt.f.rotation': 'Paboritong rotation sa ngayon',
    'bt.f.studyMusic': 'Musika habang nag-aaral',
    'bt.f.introExtro': 'Introvert, extrovert o ambivert',
    'bt.f.mbti': 'MBTI o Enneagram',
    'bt.f.loveLanguage': 'Love language',
    'bt.f.morningEssential': 'Hindi puwedeng mawala sa umaga',
    'bt.f.dreamTrip': 'Pangarap na puntahan',
    'bt.f.travelled': 'Mga napuntahan',
    'bt.f.bucketList': 'Bucket list',
    'bt.f.superpower': 'Superpower na pipiliin mo',
    'bt.f.threeWords': 'Tatlong salitang panglarawan sa iyo ng mga kaibigan',
    'bt.f.learningNow': 'Pinag-aaralan mo ngayon',
    'bt.f.facebook': 'Facebook',
    'bt.f.instagram': 'Instagram',
    'bt.f.spotify': 'Spotify profile',
    'bt.f.steam': 'Steam',
    'bt.f.shirtSize': 'Sukat ng damit (batch shirt)',
    'bt.f.bloodType': 'Blood type',
    'bt.f.urlHint': 'I-paste ang link, o ang username lang.',
    'bt.f.playlists': 'Mga Spotify playlist',
    'bt.nf.find': 'Hanapin sa Netflix',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.today.nfBy': '#{n} sa top 10 ni {name}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.today.nfAlso': 'Nasa top 10 din nina {names}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.k8': 'Pinakamamahal na Netflix show',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.wrap.s8': 'nasa {n} top-10 list',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.intro': 'Mga link list — naka-ranggo, pinakapaborito muna. Gamitin ang Itaas para ayusin.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.up': 'Itaas',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.search': '(magbubukas ng search)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.seeAll': 'Tingnan lahat ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.needTitle': '{list}: maglagay ng pamagat sa tabi ng bawat link.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.badUrl': '{list}: dapat galing sa {hosts} ang mga link.',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.picks': 'Batch picks',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.picks.intro': 'Lahat ng list ng batch sa iisang lugar — show, pelikula, kainan, wishlist at iba pa. Pinakamaraming naglista muna.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.picks.none': 'Wala pang list. Magdagdag sa card mo, saka i-share.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.picks.wishIntro': 'Ayon sa kung kaninong kaarawan ang susunod.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.picks.onMap': 'Tingnan ang bucket list sa mapa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.offHintTravel': 'Mga lugar sa labas ng Pilipinas, o pangalang hindi nakilala ng mapa.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.tapTravel': 'I-tap ang tuldok para makita kung sino ang gustong pumunta roon.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.introTravel': 'Kung saan gustong pumunta ng batch, mula sa travel bucket list ng lahat.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.map.modeHome': 'Mga hometown',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.nf.watchOn': 'Panoorin sa {s}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.today.nf': 'Show na rekomendasyon ngayong araw',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.netflix': 'Top 10 shows (Netflix at streaming)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.netflix.short': 'Mga show',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.netflix.hint': 'Ang top {n} na serye mo, pinakapaborito muna. I-type ang pamagat; opsyonal ang link (Netflix, Disney+, Prime Video, Max, Viu, Apple TV o iWant — Share › Copy link). Kung walang link, magbubukas ng Netflix search ang pamagat.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.netflix.item': 'Pamagat ng show',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.netflix.url': 'Streaming link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.netflix.add': 'Magdagdag ng show',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.netflix.hosts': 'Netflix, Disney+, Prime Video, Max, Viu, Apple TV o iWant',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.wishlist': 'Birthday wishlist',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.wishlist.short': 'Mga wishlist',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.wishlist.hint': 'Hanggang {n} bagay na gusto mong matanggap, pinakagusto muna. I-paste ang Shopee o Lazada link (Share › Copy link). Lalabas ito sa birthday banner mo para alam ng kabatch kung ano ang ireregalo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.wishlist.item': 'Item',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.wishlist.url': 'Shopee o Lazada link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.wishlist.add': 'Magdagdag ng wish',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.wishlist.hosts': 'Shopee o Lazada',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.films': 'Top films',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.films.short': 'Mga pelikula',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.films.hint': 'Ang top {n} na pelikula mo. Maglagay ng Letterboxd link kung gamit mo ito; kung wala, magbubukas ng Letterboxd search ang pamagat.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.films.item': 'Pamagat ng pelikula',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.films.url': 'Letterboxd link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.films.add': 'Magdagdag ng pelikula',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.films.hosts': 'Letterboxd',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.youtube': 'Paborito sa YouTube',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.youtube.short': 'YouTube',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.youtube.hint': 'Hanggang {n} channel o video na gusto mo. I-paste ang YouTube link (Share › Copy link).',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.youtube.item': 'Channel o video',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.youtube.url': 'YouTube link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.youtube.add': 'Magdagdag ng YouTube',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.youtube.hosts': 'YouTube',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.podcasts': 'Mga podcast',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.podcasts.short': 'Mga podcast',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.podcasts.hint': 'Hanggang {n} podcast na pinapakinggan mo. I-paste ang Spotify o Apple Podcasts link.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.podcasts.item': 'Pangalan ng podcast',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.podcasts.url': 'Spotify o Apple Podcasts link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.podcasts.add': 'Magdagdag ng podcast',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.podcasts.hosts': 'Spotify o Apple Podcasts',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.books': 'Mga libro',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.books.short': 'Mga libro',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.books.hint': 'Hanggang {n} librong nirerekomenda mo. Maglagay ng Goodreads link kung mayroon; kung wala, magbubukas ng Goodreads search ang pamagat.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.books.item': 'Pamagat ng libro',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.books.url': 'Goodreads link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.books.add': 'Magdagdag ng libro',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.books.hosts': 'Goodreads',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.foodSpots': 'Paboritong kainan',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.foodSpots.short': 'Mga kainan',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.foodSpots.hint': 'Hanggang {n} kainan — malapit sa ospital, sa probinsya mo, kahit saan. I-paste ang Google Maps link (Share › Copy link).',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.foodSpots.item': 'Pangalan ng lugar',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.foodSpots.url': 'Google Maps link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.foodSpots.add': 'Magdagdag ng kainan',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.foodSpots.hosts': 'Google Maps',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.travel': 'Travel bucket list',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.travel.short': 'Bucket list',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.travel.hint': 'Hanggang {n} lugar na gusto mong puntahan. Isulat ang pangalan ng lugar (hal. Siargao, Batanes, Kyoto) — lalabas din sa Hometown map ang mga lugar sa Pilipinas. Opsyonal ang Google Maps link.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.travel.item': 'Lugar',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.travel.url': 'Google Maps link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.travel.add': 'Magdagdag ng lugar',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.travel.hosts': 'Google Maps',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.study': 'Study stash',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.study.short': 'Study stash',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.study.hint': 'Hanggang {n} study resource na maaasahan — lecture channel, app, libro, website.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.study.item': 'Resource',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.study.url': 'Link (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.study.add': 'Magdagdag ng resource',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.l.study.hosts': 'mga https link',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.events': 'Mga batch event',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.monito': 'Kris Kringle',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.badges': 'Mga badge',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.f.askMe': 'Tanungin mo ako tungkol sa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.h.askMe': 'Hanggang 3 paksa, hiwalay sa kuwit — hal. K-drama, running, pusa. Lalabas ito sa card mo sa batch list.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.f.teachWords': 'Mga salitang ituturo sa batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.h.teachWords': 'Isa bawat linya: salita o parirala — kahulugan (wika). hal. Mayap a abak — good morning (Kapampangan). Isa ang lalabas sa Home bilang Salita ng araw.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ask.k': 'Tanungin mo ako',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.word.h': 'Salita ng araw',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.word.by': 'Itinuro ni {name}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.earned': 'Nakakuha ng badge: {name} 🎉',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.intro': '{n} sa {total} badge ang nakuha sa phone na ito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.on': 'Nakuha {date}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.note': 'Nakukuha ang mga badge sa phone na ito at lumalabas sa card mo kapag ibinahagi mo ito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.h': 'Mga shoutout',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.forYou': 'Mga shoutout para sa iyo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.none': 'Wala pang shoutout. Ikaw na ang mauna!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.noneYou': 'Wala pa. Kapag nagpadala ng shoutout ang kabatch at ibinahagi ang card nila, lalabas ito rito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.you': 'ikaw',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.label': 'Shoutout para kay {name}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.ph': 'Salamat sa pag-cover ng rounds ko! 🙏',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.hint': 'Hanggang 280 character. Kasama ito ng card mo — i-share ang card mo para makita nila.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.send': 'Ipadala ang shoutout',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.sent': 'Naidagdag ang shoutout sa card mo. I-share ang card mo para makarating sa kanila.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.needCard': 'Gumawa muna ng card para makapag-shoutout',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.homeH': 'Shoutout para sa iyo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.shout.all': 'Tingnan lahat ({n})',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.intro': 'Welcome dinner, unang araw, exam, lakad — may countdown at add-to-calendar.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.firstDay': 'Unang araw ng residency',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.tomorrow': 'Bukas',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.yesterday': 'Kahapon',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.ago': '{n} araw na ang nakalipas',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.next': 'Susunod na event',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.none': 'Wala pang paparating na event. Magdagdag sa ibaba.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.allCal': 'Idagdag lahat ng paparating sa calendar',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.past': 'Mga nakaraang event',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.shareHint': 'Kasama ang mga event sa batch file: Share cards › Share the whole batch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.add': 'Magdagdag ng event',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.edit': 'I-edit ang event',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.title': 'Ano',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.titlePh': 'Welcome dinner',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.date': 'Petsa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.time': 'Oras (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.place': 'Saan (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.note': 'Tala (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.save': 'I-save ang event',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.cancel': 'Kanselahin',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.editBtn': 'I-edit',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.need': 'Maglagay ng pamagat at petsa.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.saved': 'Na-save ang event.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.confirmDel': 'Alisin ang “{title}”?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.ev.imported': '{n} event ang naidagdag o na-update.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.intro': 'Bumunot ng pangalan para sa exchange gift. Bawat isa ay may isang kabatch na reregaluhan — hindi ang sarili — at ipapadala mo nang pribado ang match ng bawat isa.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.notEnough': 'Kailangan ng 3 card man lang sa phone na ito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.who': 'Sino ang sasali?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.budget': 'Budget (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.date': 'Petsa ng exchange (opsyonal)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.addEvent': 'Idagdag ang petsa ng exchange sa Batch events',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.warn': 'Kasali ka rin? Huwag sumilip — i-tap lang ang Send para sa bawat isa. O ipaubaya ang draw sa hindi kasali.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.draw': 'Bumunot',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.need3': 'Pumili ng 3 tao man lang.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.drawn': '{n} tao ang nabunot noong {date}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.budgetIs': 'Budget: {budget}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.howSend': 'I-tap ang Send para buksan ang share sheet na may match ng taong iyon (at wishlist), saka ipadala sa kanya lang.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.hidden': 'nakatago ang match',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.sent': 'naipadala ✓',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.send': 'Ipadala',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.peek': 'Silipin',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.hide': 'Itago',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.redraw': 'Bumunot ulit',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.clear': 'Burahin ang draw',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.redrawConfirm': 'Magsimula ulit sa bagong draw? Mawawala ang kasalukuyang mga match.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.clearConfirm': 'Burahin ang draw? Mawawala ang mga match.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.sentTo': 'Naipadala kay {name}.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.copied': 'Nakopya ang match ni {name} — i-paste sa pribadong chat ninyo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.evTitle': 'Kris Kringle exchange',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.msg': 'Hi {giver}! 🎁 Ang Kris Kringle mo para sa {batch} ay si {receiver}.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.msgBudget': 'Budget: {budget}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.msgDate': 'Exchange: {date}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.msgWish': 'Wishlist niya:',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.mm.msgSecret': 'Sikreto lang! 🤫',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.started': 'Nagsimula na',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.started.how': 'I-save ang sarili mong card.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.openbook': 'Bukas na libro',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.openbook.how': 'Punan ang kalahati ng card mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.wholestory': 'Buong kuwento',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.wholestory.how': 'Punan ang 80% ng card mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.curator': 'Curator',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.curator.how': 'Punan ang 3 link list sa card mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.polyglot': 'Polyglot',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.polyglot.how': 'Magdagdag ng mga salitang ituturo sa batch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.collector5': 'Kolektor',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.collector5.how': 'Magkaroon ng 5 card ng kabatch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.collector10': 'Malaking kolektor',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.collector10.how': 'Magkaroon ng 10 card ng kabatch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.collector20': 'Buong batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.collector20.how': 'Magkaroon ng 20 card ng kabatch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.meteveryone': 'Nakilala lahat',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.meteveryone.how': 'Buksan ang card ng bawat kabatch (5 man lang).',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.perfectguess': 'Perpektong round',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.perfectguess.how': 'Makakuha ng 10 sa 10 sa Guess who.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.streak10': 'Tuloy-tuloy',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.streak10.how': 'Makahula ng 10 nang sunod-sunod sa Guess who.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.whosaid': 'Mind reader',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.whosaid.how': 'Tamaan lahat sa isang round ng Sino ang nagsabi? (4 pataas).',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.bingo': 'Bingo!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.bingo.how': 'Makabuo ng linya sa Batch Bingo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.wrapped': 'Wrapped up',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.wrapped.how': 'Panoorin ang Batch Wrapped hanggang huling slide.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.icebreaker': 'Icebreaker',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.icebreaker.how': 'Dumaan sa 10 icebreaker.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.greeter': 'Tagabati',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.greeter.how': 'Batiin ang kabatch sa kaarawan niya.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.shoutout': 'Cheerleader',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.shoutout.how': 'Magpadala ng shoutout.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.planner': 'Planner',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.planner.how': 'Magdagdag ng batch event.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.monito': 'Katulong ni Santa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.monito.how': 'Magpatakbo ng Kris Kringle draw.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pl.hint': 'Hanggang {n} playlist. I-paste ang Spotify share link at pangalanan ito.',
    'bt.pl.label': 'Pangalan ng playlist',
    'bt.pl.url': 'Spotify link',
    'bt.pl.add': 'Magdagdag ng playlist',
    'bt.pl.badUrl': 'Dapat magsimula ang playlist link sa https://open.spotify.com/ o https://spotify.link/',
    'bt.pl.open': 'Buksan sa Spotify',
    'bt.zodiac': 'Zodiac',
    'bt.zodiac.cn': 'Chinese zodiac',
    'bt.link.open': 'Buksan',
    'bt.f.weekend': 'Karaniwang weekend',
    'bt.f.guiltyPleasure': 'Guilty pleasure',
    'bt.f.petPeeve': 'Pet peeve',
    'bt.f.comfortShow': 'Comfort show kapag malungkot',
    'bt.f.lastBinge': 'Huling binge-watch',
    'bt.f.currentlyReading': 'Binabasa / pinakikinggan ngayon',
    'bt.f.nonNegotiable': 'Araw-araw na hindi puwedeng laktawan',
    'bt.f.alwaysInBag': 'Laging nasa bag mo',
    'bt.f.childhoodDream': 'Pangarap na trabaho noong bata',
    'bt.f.childhoodNickname': 'Palayaw noong bata',
    'bt.f.firstConcert': 'Unang concert / unang fandom',
    'bt.f.childhoodGame': 'Paboritong laro noong bata',
    'bt.f.undergrad': 'Paaralan at kurso sa undergrad',
    'bt.f.siblings': 'Mga kapatid (ilan, pang-ilan ka)',
    'bt.f.hometownTradition': 'Paboritong pista o tradisyon sa bayan',
    'bt.f.roleModel': 'Huwaran / taong hinahangaan',
    'bt.f.motto': 'Motto sa buhay sa isang linya',
    'bt.f.advocacy': 'Charity o adbokasiyang mahalaga sa iyo',
    'bt.f.recharge': 'Pampabalik ng lakas pagkatapos ng mahirap na duty',
    'bt.f.proudest': 'Pinakaipinagmamalaking sandali',
    'bt.f.grateful': 'Pinasasalamatan mo ngayong taon',
    'bt.f.whyProgram': 'Bakit ang programang ito / bakit Mariveles',
    'bt.f.tenYears': 'Saan mo gustong makarating sa loob ng 10 taon',
    'bt.f.subspecialty': 'Subspecialty na kinaiinteresan',
    'bt.f.studyTip': 'Pinakamagandang study tip mo',
    'bt.f.skillToLearn': 'Kasanayang gustong matutunan sa residency',
    'bt.f.askMeFor': 'Laging puwedeng humingi ng tulong sa iyo sa…',
    'bt.f.hotTake': 'Hot take (pagkain o pop culture)',
    'bt.f.ifNotDoctor': 'Kung hindi ka doktor, ikaw ay…',
    'bt.f.lastPhoto': 'Huling litrato sa camera roll (ilarawan)',
    'bt.f.lookalike': 'Celebrity na sinasabing kamukha mo',
    'bt.f.duetSong': 'Naghahanap ng karaoke duet partner para sa…',
    'bt.f.viber': 'Numero sa Viber (kung iba)',
    'bt.f.telegram': 'Telegram / WhatsApp',
    'bt.f.email2': 'Pangalawang email (school / personal)',
    'bt.f.youtube': 'YouTube channel',
    'bt.f.discord': 'Discord',
    'bt.f.gcash': 'Numero sa GCash / Maya (para sa hatian ng gastos ng batch)',
    'bt.f.staying': 'Nakatira sa boarding house / dorm, o galing sa bahay',
    'bt.f.landmark': 'Pinakamalapit na landmark sa tinutuluyan mo (para sa sundo)',
    'bt.f.birthdayPref': 'Gusto sa pagdiriwang ng kaarawan (puwede ang surprise? anong cake?)',
    'bt.f.scrubSize': 'Sukat ng scrub',
    'bt.f.shoeSize': 'Sukat ng sapatos',
    'bt.f.dutyConditions': 'Mga kondisyong dapat malaman habang naka-duty (opsyonal)',
    'bt.f.emergencyNumber': 'Numero ng emergency contact',
    'bt.f.emergencyRelation': 'Relasyon sa emergency contact',
    'nav.emergency': "Emergency info",  // Tagalog draft — Dr. Navarro reviews before release
    'nav.emergencyShort': "Emergency",  // Tagalog draft — Dr. Navarro reviews before release
    'nav.partners': "Mga jowa/asawa",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.intro': "Ang mga jowa at asawa ng batch. May buong card sila, pero wala sa mga laro, stats at batch grid.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.how': "Paano magdagdag ng jowa/asawa",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.howText': "I-install ng partner mo ang Batch Tickler sa sarili niyang phone at i-import ang card mo. Saka niya punan ang My card, piliin ang “Partner ako” at piliin ka. Ibabahagi niya ang card niya gaya ng iba — o ipadala sa iyo at ikaw ang magbahagi sa batch.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.none': "Wala pang card ng partner.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.of': "Partner ni {name}",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.ofLead': "Partner ni",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.section': "Jowa / Asawa",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.role': "Kanino ang card na ito?",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.roleRes': "Residente ako sa batch",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.rolePt': "Partner (jowa/asawa) ako ng isang residente",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.pick': "Ang partner ko ay si",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.pickNone': "— wala pa sa phone na ito —",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.name': "O i-type ang buong pangalan niya",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.nameOnly': "Buong pangalan ng partner mo",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.hint': "Lumalabas ang card ng partner sa page ng residente niya, sa Birthdays at sa screen na Mga jowa/asawa — hindi sa mga laro, stats o batch grid.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.needWho': "Piliin ang partner mo, o i-type ang pangalan niya.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.count1': "1 card ng partner",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.countN': "{n} card ng partner",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.pt.tag': "Partner",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.g.emergency': "Emergency at medikal",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.f.emergencyRelation2': "Relasyon sa pangalawang emergency contact",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.f.emergencyNote': "Makikita sa Emergency info ng lahat ng binigyan mo ng card mo. Hindi kailanman sa printed sheet o name tag, at ang mga kondisyon ay hindi kailanman sa QR code.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.intro': "Blood type, allergy, kondisyon at emergency contact ng buong batch sa iisang lugar. Gumagana kahit offline.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.note': "Mula sa mga card na piniling ibahagi sa phone na ito. Sa tunay na emergency, tumawag muna ng tulong.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.call911': "Tumawag sa 911",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.filter': "Hanapin ang ka-batch",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.yours': "Ikaw",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.add': "Ilagay ang emergency info mo",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.addText': "Wala pang blood type, allergy o emergency contact sa card mo. Isang minuto lang, at makakatulong ito para matulungan ka ng batch.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.edit': "I-edit ang emergency info ko",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.blood': "Blood type",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.allergies': "Allergy",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.noAllergy': "Walang nakalista",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.conditions': "Mga kondisyon",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.own': "Sariling numero",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.contact': "Emergency contact",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.missing': "Wala pang emergency info",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.missingText': "Pakiusapan silang punan ang Emergency at medikal sa card nila at ibahagi ulit.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.none': "Wala pang card. Ilagay ang sa iyo, saka i-import ang mga card ng ka-batch mo.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.noMatch': "Walang tumugma.",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.homeS1': "1 ka-batch · blood type, allergy, emergency contact",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.homeSN': "{n} ka-batch · blood type, allergy, emergency contact",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.homeAdd': "Ilagay ang sa iyo",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.em.all': "Buong batch",  // Tagalog draft — Dr. Navarro reviews before release
    'bt.f.emergencyContact2': 'Pangalawang emergency contact',
    'bt.f.emergencyNumber2': 'Numero ng pangalawang emergency contact',
    'bt.f.prcExpiry': 'Pag-expire ng PRC license (buwan)',
    'bt.f.licenceExpiry': 'Pag-expire ng driver’s license (buwan)',
    'bt.f.passportExpiry': 'Bisa ng pasaporte hanggang (buwan)',
    'bt.h.prcExpiry': 'Buwan lang — para maalala natin kung kailan mag-renew. Walang numero, please.',
    'bt.h.licenceExpiry': 'Buwan lang — para maalala natin kung kailan mag-renew. Walang numero, please.',
    'bt.h.passportExpiry': 'Buwan lang — para maalala natin kung kailan mag-renew (at kung kailan magplano ng batch trip). Walang numero, please.',
    'bt.h.dutyConditions': 'Ibinabahagi lang sa mga binigyan mo ng card mo; hindi kailanman sa QR code o print.',
    'bt.h.gcash': 'Hindi kailanman sa QR code o print.',
    'bt.s.screen': 'Sa screen',
    'bt.s.play': 'Mga laro at fandom',
    'bt.s.words': 'Musika at salita',
    'bt.s.food': 'Pagkain at inumin',
    'bt.s.little': 'Maliliit na bagay',
    'bt.s.medschool': 'Med school',
    'bt.s.everyday': 'Araw-araw',
    'bt.s.growingup': 'Paglaki',
    'bt.s.you': 'Tungkol sa iyo',
    'bt.s.horizons': 'Mga pangarap',
    'bt.s.residency': 'Residency',
    'bt.s.fun': 'Para sa saya',
    'bt.me.yearRequired': 'Ilagay rin ang taon ng kapanganakan mo.',
    'bt.print.modeFull': 'Buong direktoryo',
    'bt.print.fullHint': 'Lahat ng nasa bawat card, kasama ang kontak at praktikal na detalye, sa kahit ilang pahina. Ituring na personal ang printout.',
    'bt.print.fullTitle': 'Direktoryo ng batch (buo)',
    'bt.print.custom': 'Iba pa',
    'bt.print.photoNone': 'walang larawan',
    'bt.f.contactNote': 'Ang mga field na may markang “sa app lang” (kontak, allergy, emergency contact, socials) ay hindi kailanman lumalabas sa printed sheet o name tag.',
    'bt.bd.intro': 'Mga kaarawan ayon sa buwan, simula ngayon. Maglagay ng taon sa card at ipapakita rin ang edad.',
    'bt.bd.today': 'Ngayon',
    'bt.bd.thisMonth': 'Ngayong buwan',
    'bt.bd.upcoming': 'Paparating',
    'bt.bd.none': 'Wala pang nakalagay na kaarawan. Idinadagdag ito ng bawat residente sa Card ko.',
    'bt.bd.noDate': 'Walang ibinigay na kaarawan',
    'bt.share.intro': 'Lumilipat ang mga card sa pagitan ng mga telepono bilang maliliit na file. Ibahagi ang sa iyo, i-import ang mga natanggap mo, o ipadala ang buong batch sa kabatch na nagsisimula pa lang.',
    'bt.share.mine': 'Ibahagi ang card ko',
    'bt.share.mineText': 'Nagpapadala ng file na card mo lang ang laman. Ini-import ito ng mga kabatch sa telepono nila.',
    'bt.share.mineBtn': 'Ibahagi ang card ko',
    'bt.share.needMe': 'Punan muna ang Card ko.',
    'bt.share.import': 'I-import ang mga card',
    'bt.share.importText': 'Tumatanggap ng isang card, buong batch, o backup ng Batch Tickler. Pinapalitan ng mas bagong card ang mas luma; hindi kailanman napapalitan ang sarili mong card.',
    'bt.share.importBtn': 'I-import ang mga card',
    'bt.share.all': 'Ibahagi ang buong batch',
    'bt.share.allText': 'Nagpapadala ng bawat card sa device na ito sa isang file. Madaling gamitin para sa kabatch na nagsisimula sa wala.',
    'bt.share.allBtn': 'Ibahagi ang batch',
    'bt.share.allEmpty': 'Wala pang card na maibabahagi.',
    'bt.share.shared': 'Handa nang ipadala — pumili ng chat o i-save sa Files.',
    'bt.share.saved': 'Na-save ang {name}. Ipadala ito sa mga kabatch mo.',
    'bt.share.cancelled': 'Kinansela ang pagbabahagi.',
    'bt.share.notCards': 'Walang Batch Tickler card ang file na iyan.',
    'bt.share.result': 'Na-import: {added} bago, {updated} na-update, {skipped} nilaktawan.',
    'bt.share.skippedMe': 'Hindi pinapalitan ng import ang sarili mong card.',
    'bt.share.ownAll': 'Mga card sa device na ito: {n}.',
    'bt.print.intro': 'Batch sheet: compact na “meet the batch” na pahina na walang contact details. Mga name tag: walo bawat pahina. Buong direktoryo: lahat, sa kahit ilang pahina. Gamitin ang Print ng browser (o Share → Print sa iPhone) para i-print o i-save bilang PDF.',
    'bt.print.btn': 'I-print',
    'bt.print.title': 'Kilalanin ang batch',
    'bt.print.subtitle': '{program} · {hospital}',
    'bt.print.empty': 'Wala pang maipi-print.',
    'bt.guess.intro': 'Mabilis na laro: basahin ang clue, piliin ang kabatch. Kailangan ng apat na card man lang na may ganoong detalye.',
    'bt.guess.notEnough': 'Kulang pa ang mga card. Kapag apat na kabatch na ang nagpuno ng bayan, libangan o paborito nila, bubukas ang laro.',
    'bt.guess.whose': 'Kanino ang {field} na ito?',
    'bt.guess.right': 'Tama!',
    'bt.guess.wrong': 'Hindi — si {name} iyon.',
    'bt.guess.next': 'Susunod na clue',
    'bt.guess.score': 'Iskor {right} sa {total}',
    'bt.guess.open': 'Buksan ang card niya',
    'skip': 'Lumaktaw sa nilalaman',
    'menu.open': 'Buksan ang menu',
    'menu.close': 'Isara ang menu',
    'menu.title': 'Menu',
    'menu.main': 'Pangunahing menu',
    'sidebar.hide': 'Itago ang sidebar',
    'sidebar.show': 'Ipakita ang sidebar',
    'hist.group': 'Kasaysayan ng mga pahina',
    'hist.back': 'Bumalik',
    'hist.backTitle': 'Bumalik (Alt+Left)',
    'hist.fwd': 'Susunod',
    'hist.fwdTitle': 'Susunod (Alt+Right)',
    'brand.home': '{name}, pangunahing pahina',
    'search.label': 'Maghanap sa buong app',
    'search.placeholder': 'Maghanap sa app na ito',
    'search.title': 'Paghahanap',
    'search.noMatches': 'Walang nakita para sa “{q}”',
    'search.seeAll1': 'Tingnan ang lahat ng {n} resulta',
    'search.seeAllN': 'Tingnan ang lahat ng {n} resulta',
    'search.count1': '{n} resulta para sa “{q}”',
    'search.countN': '{n} resulta para sa “{q}”',
    'search.prompt': 'Mag-type sa search box sa itaas.',
    'search.filterBy': 'I-filter ayon sa uri',
    'search.all': 'Lahat',
    'search.noneTitle': 'Walang nakita',
    'search.noneText': 'Subukan ang ibang salita, o suriin ang baybay.',
    'search.newsText': 'Mga bagong feature, nilalaman at pagwawasto, mula sa pinakabago.',
    'search.aboutText': 'Tungkol sa app na ito, mga keyboard shortcut, wika, laki ng teksto, tema at backup.',
    'textsize.title': 'Laki ng teksto',
    'textsize.smaller': 'Mas maliit',
    'textsize.default': 'Karaniwan',
    'textsize.larger': 'Mas malaki',
    'textsize.largest': 'Pinakamalaki',
    'theme.title': 'Tema',
    'theme.label': 'Tema: {name}',
    'theme.auto': 'Ayon sa device',
    'theme.light': 'Maliwanag',
    'theme.dark': 'Madilim',
    'nav.start': 'Simula',
    'nav.screens': 'Mga screen',
    'nav.app': 'App',
    'nav.otherApps': 'Iba pang app',
    'nav.newTab': '(bubukas sa bagong tab)',
    'nav.home': 'Home',
    'nav.whatsNew': 'Ano ang bago',
    'nav.about': 'Tungkol dito',
    'nav.quick': 'Mabilis na nabigasyon',
    'home.explore': 'Galugarin',
    'home.emptyTitle': 'Wala pa rito',
    'home.emptyText': 'Magdagdag ng screen sa NAV at VIEWS sa js/app.js at lalabas ito rito.',
    'home.latest': '{title} · bersyon {version}',
    'news.intro1': 'Mga bagong feature, nilalaman at pagwawasto, mula sa pinakabago. Ang mga may markang ',
    'news.new': 'Bago',
    'news.intro2': ' ay idinagdag mula noong huli mong bisita.',
    'news.version': 'Bersyon {v}',
    'news.open': 'Buksan',
    'news.type.feature': 'Bagong feature',
    'news.type.update': 'Update',
    'news.type.correction': 'Pagwawasto',
    'news.type.content': 'Nilalaman',
    'news.note': 'May mungkahi o pagwawasto? Mag-email sa ',
    'about.title': 'Tungkol dito',
    'about.version': 'bersyon',
    'about.settings': 'Mga setting',
    'about.language': 'Wika',
    'about.langEn': 'English',
    'about.langTl': 'Tagalog',
    'about.tips': 'Mga tip',
    'about.tip1': 'Pindutin ang [[/]] para maghanap mula saanman.',
    'about.tip2': 'Pabalik at pasulong: gamitin ang mga arrow button sa itaas, o [[Alt]]+[[Left]] at [[Alt]]+[[Right]].',
    'about.tip3': 'Paliitin o palakihin ang teksto gamit ang **Aa** button. Ang button na araw/buwan ay nagpapalit sa pagitan ng ayon sa device, maliwanag at madilim.',
    'about.tip4': 'Gamitin ang **I-export ang backup** sa ibaba para i-save ang laman ng app na ito sa device mo, at ang **I-import ang backup** para ibalik ito sa iba.',
    'about.tip5': 'I-install ito: piliin ang **Add to Home Screen** (iPhone Safari) o **Install app** (Android Chrome).',
    'notfound.title': 'Hindi mahanap ang pahina',
    'notfound.text': 'Walang ganyang pahina sa app na ito.',
    'notfound.home': 'Bumalik sa simula',
    'backup.title': 'I-back up ang iyong data',
    'backup.text': 'Ang lahat ng sine-save ng app na ito ay nasa browser na ito lang. Mag-export ng backup file para ligtas ito, tapos i-import ito sa ibang telepono, tablet o computer para magpatuloy kung saan ka tumigil.',
    'backup.export': 'I-export ang backup',
    'backup.import': 'I-import ang backup',
    'backup.undo': 'I-undo ang huling import',
    'backup.item1': '{n} na-save na item',
    'backup.itemN': '{n} na-save na item',
    'backup.nothing': 'wala pang na-save',
    'backup.onDevice': 'Sa device na ito: {summary}.',
    'backup.lastExported': 'Huling na-export noong {date}.',
    'backup.notExported': 'Hindi pa na-export.',
    'backup.shareTitle': 'Backup ng {app}',
    'backup.shared': 'Handa na ang backup: i-save ito sa lugar na maaabot mo mula sa ibang device.',
    'backup.exportCancelled': 'Kinansela ang pag-export.',
    'backup.saved': 'Na-save ang {name}. Ilipat ito sa ibang device at piliin doon ang I-import ang backup.',
    'backup.notBackup': 'Hindi ito backup file ng {app}.',
    'backup.unreadable': 'Hindi mabasa ang file na iyon.',
    'backup.unknownDate': 'hindi alam na petsa',
    'backup.confirmImport': 'I-import ang backup mula {date}?\n\nBackup: {backup}.\nSa device na ito ngayon: {device}.\n\nMapapalitan ang data sa device na ito. Maaari mo itong i-undo mula sa ibaba ng pahina.',
    'backup.importCancelled': 'Kinansela ang pag-import.',
    'backup.importFailed': 'Hindi nagtagumpay ang pag-import: hindi na-save ng browser na ito ang data.',
    'backup.imported': 'Na-import na ang backup. Nagre-reload…',
    'backup.confirmUndo': 'Ibalik ang data na nasa device na ito bago ang huling import ({summary})?',
    'backup.undoFailed': 'Hindi nagtagumpay ang pag-undo.',
    'backup.restored': 'Naibalik na ang dating data. Nagre-reload…',
    // 1.15.0
    'nav.truths': 'Two truths and a lie',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.quiz': 'How well do you know…?',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.baby': 'Hulaan ang baby photo',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.tot': 'This or that',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.sup': 'Batch superlatives',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.qotw': 'Tanong ng linggo',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.capsule': 'Time capsule',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.eat': 'Saan tayo kakain?',  // Tagalog draft — Dr. Navarro reviews before release
    'nav.anthem': 'Batch anthem',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.fun.needCard': 'Gawin muna ang card mo para sumama ang mga sagot mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.fun.more': 'Higit pa sa card mo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.fun.moreHint': 'May sarili silang screen at sumasama sa card file mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.common.tot': 'Parehong pick sa This or that: {value}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.res.text': '{game} — {right}/{n} · {batch}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.res.bingo': 'Batch Bingo! · {batch} · {n} squares',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.res.share': 'I-share ang result',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.res.copied': 'Na-copy ang result — i-paste sa group chat.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.intro': 'Bawat isa ay magsusulat ng dalawang totoo at isang kasinungalingan. Kaya mo bang hulaan ang lie?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.mine': 'Ang two truths and a lie mo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.mineHint': 'Sumulat ng tatlong maikling statement tungkol sa sarili mo — dalawang totoo, isang hindi — tapos markahan ang lie. Sasama ito sa card mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.stmt': 'Statement {n}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.isLie': 'Ito ang lie',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.need3': 'Punan ang lahat ng tatlong statement.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.needLie': 'Markahan kung alin ang lie.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.saved': 'Na-save na. I-share ang card mo para makapaglaro ang batch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.none': 'Wala pang nagdagdag ng sa kanila. Kapag nagdagdag na ang batchmates mo at nag-share ng cards, makakapaglaro ka na dito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tt.ask': 'Alin ang lie?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.intro': 'Mabilis na quiz mula sa card ng isang batchmate. Tapos ipadala sa kanila ang score mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.title': 'Gaano mo kakilala si {name}?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.none': 'Kailangan ng batchmates na mas kumpleto ang card — mag-import muna ng ilang cards.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.few': 'Kulang pa ang sagot sa card nila para sa quiz.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.nq': '{n} tanong',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.best': 'best mo: {right}/{n}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.qField': '{field} — alin ang sagot ni {name}?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.qMonth': 'Anong buwan ang birthday ni {name}?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.qTot': 'This or that: ano ang pinili ni {name}?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.qLie': 'Alin ang lie ni {name}?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.v0': 'Oras na para sa kwentuhan!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.v1': 'Not bad — malapit ka na.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.v2': 'Kilalang-kilala mo sila!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.v3': 'Perfect! Certified best friend.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.quiz.other': 'Ibang batchmate',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.baby.intro': 'Ipares ang bawat baby photo sa batchmate.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.baby.mine': 'Baby photo mo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.baby.hint': 'Optional. Childhood photo mo. Sumasama ito sa card file mo (hindi sa QR code).',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.baby.saved': 'Na-save ang baby photo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.baby.none': 'Kailangan ng hindi bababa sa 2 batchmates na may baby photo (at 4 na cards). Sabihan ang batch na magdagdag!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.baby.ask': 'Sino ang baby na ito?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tot.intro': 'Mabilis na picks — tapos tingnan kung paano nahati ang batch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tot.mine': 'Mga pick ko',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tot.split': 'Hati ng batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tot.or': 'o',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tot.progress': '{n} sa {total} ang nasagot. I-tap ulit para burahin ang pick.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tot.twins': 'Pinakakapareho mo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tot.same': 'parehong pick sa {same} sa {both}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tot.none': 'Wala pang picks. Sagutan ang sa iyo at i-share ang card mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.intro': 'Awards na parang yearbook. Bumoto ng batchmate sa bawat isa; bibilangin ng results ang votes sa lahat ng cards sa phone na ito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.vote': 'Mga boto ko',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.results': 'Results',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.pick': '— pumili —',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.progress': '{n} sa {total} ang nabotohan.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.noOthers': 'I-import muna ang cards ng batchmates mo para may mabotohan ka.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.note': 'Sumasama ang votes mo sa card file mo, kaya makikita ng batchmates ang totals pagkatapos nilang i-import ito.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.votes1': '1 boto',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.votesN': '{n} boto',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.also': 'Binoto rin:',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.sup.none': 'Wala pang boto.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.intro': 'Isang bagong tanong tuwing Lunes. Sagutin ito, i-share ang card mo, at basahin ang sagot ng lahat.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.thisWeek': 'Ngayong linggo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.yours': 'Ikaw:',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.ph': 'Sagot mo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.post': 'I-post',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.posted': 'Na-save ang sagot. Sasama ito sa card mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.first': 'Wala pang sagot mula sa batch — ikaw na ang mauna.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.noneYet': 'Wala pang sagot.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.more': '+{n} pa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.all': 'Lahat ng linggo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.qotw.past': 'Mga nakaraang linggo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.h': 'Birthday wall',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.about': 'Mga mensahe para sa birthday ni {name} ({date}). Makikita niya ito sa mismong araw.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.none': 'Wala pang mensahe — ikaw ang mauna.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.noneYou': 'Wala pang birthday messages.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.wait1': 'May 1 mensaheng naghihintay sa birthday mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.waitN': 'May {n} mensaheng naghihintay sa birthday mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.label': 'Birthday message para kay {name}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.ph': 'Happy birthday! …',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.hint': 'Sasama ito sa card mo. Makikita ito ni {name} sa birthday niya pagkatapos i-import ang card mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.post': 'Idagdag sa wall',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.posted': 'Naidagdag sa birthday wall.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.home1': '1 mensahe sa birthday wall',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.homeN': '{n} mensahe sa birthday wall',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.bw.read': 'Basahin ang wall',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.intro': 'Sumulat ng sulat na mananatiling sealed hanggang sa petsang pipiliin mo — para sa future you, o sa buong batch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.write': 'Sumulat ng sulat',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.to': 'Para kay',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.toSelfL': 'Future me (mananatili sa phone na ito)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.toBatchL': 'Sa batch (sasama sa card mo, hanggang 5)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.letter': 'Sulat',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.ph': 'Dear future me…',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.openOn': 'Bubuksan sa',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.seal': 'I-seal',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.sealed': 'Naka-seal na. 🔒',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.note': 'Ang sealed ay nakatago lang sa app na ito, hindi encrypted — mababasa pa rin ng sinumang magbukas ng card file mo ang sulat para sa batch.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.needText': 'Sumulat muna ng kahit ano.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.needDate': 'Pumili ng petsa ng pagbubukas pagkatapos ng ngayon.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.max': 'Hanggang 5 sulat lang para sa batch. Magtanggal muna ng isa.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.none': 'Wala pang sulat.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.toSelf': 'Para sa future you',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.fromYou': 'Mula sa iyo para sa batch',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.from': 'Mula kay {name}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.opens': 'bubukas sa {date}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.opened': 'nabuksan noong {date}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.peek': 'Silip muna',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.peekConfirm': 'Buksan ang sulat na ito bago ang petsa nito?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.delConfirm': 'Tanggalin ang sulat na ito?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.cap.homeH': 'May time capsule na kakabukas lang',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tc.title': 'Trading card',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tc.intro': 'Ang card mo bilang picture — i-post sa group chat o sa story mo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tc.alt': 'Trading card ni {name}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tc.share': 'I-share o i-save ang image',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.tc.saved': 'Na-save ang larawan: {name}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.intro': 'Hindi makapagdesisyon? I-spin ang mga paboritong kainan ng lahat.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.none': 'Wala pang nagdagdag ng paboritong kainan (My card › Favourite food spots).',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.spin': 'Spin!',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.again': 'Spin ulit',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.count': '{n} lugar sa pool',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.from': 'Mula sa mga paborito nina {names}',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.maps': 'Buksan sa Maps',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.share': 'Ipadala sa group',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.msg': 'Tara, kain tayo sa {place}! 🍽️',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.who': 'Sinong sasama?',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.eat.list': 'Lahat ng kainan',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.intro': 'Bawat isa ay pipili ng isang kantang nagpapakita kung sino sila. Pagsama-samahin, ito na ang batch anthem.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.mine': 'Kanta mo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.song': 'Kanta (title — artist)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.songPh': 'hal. Tadhana — Up Dharma Down',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.url': 'Link (optional)',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.hint': 'Link mula sa Spotify, YouTube o Apple Music.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.needTitle': 'Ilagay ang title ng kanta.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.badUrl': 'Hindi galing sa Spotify, YouTube o Apple Music ang link na iyan.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.saved': 'Na-save ang kanta.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.none': 'Wala pang kanta.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.play': 'Play',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.find': 'Hanapin',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.k': 'Anthem',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.an.homeH': 'Batch anthem ng linggo',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.liedetector': 'Lie detector',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.liedetector.how': 'Makahuli ng 5 lies sa Two truths and a lie.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.quizmaster': 'Best friend material',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.quizmaster.how': 'Tamang lahat ng sagot sa isang How well do you know…? quiz.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.babyface': 'Baby whisperer',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.babyface.how': 'Mahulaan lahat ng baby photo sa isang round (3 o higit pa).',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.pollster': 'Decisive',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.pollster.how': 'Sagutin lahat ng This or that.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.voter': 'Botante',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.voter.how': 'Bumoto sa bawat batch superlative.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.qotw': 'Weekly regular',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.qotw.how': 'Sumagot sa isang Tanong ng linggo.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.timekeeper': 'Time traveller',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.timekeeper.how': 'Mag-seal ng time capsule letter.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.dj': 'Batch DJ',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.dj.how': 'Idagdag ang kanta mo sa batch anthem.',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.foodie': 'Food tripper',  // Tagalog draft — Dr. Navarro reviews before release
    'bt.badge.foodie.how': 'Mag-spin sa Saan tayo kakain?'  // Tagalog draft — Dr. Navarro reviews before release
  }
};
