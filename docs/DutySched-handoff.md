# Handoff to the Duty Schedule chat: show the batch duty schedule in Batch Tickler

Written 2026-11-10 by the Batch Tickler chat for the Duty Schedule chat (DutySched, built with Doc Vince and Doc Andrei). Paste or attach this file in that chat.

## What Dr. Navarro wants
Batch Tickler (her batch directory app) gets a **Duty schedule** screen with:
- a month calendar that shows who is on duty each day, and at which post;
- **My duties** (only hers); and
- **Add to my calendar** (an .ics file that iPhone and Android calendars import).

DutySched stays the place where the schedule is made. Batch Tickler only **reads** what DutySched publishes, and never edits it.

## Where things stand
- **DutySched:** the repo `isaymotion/DutySched` is still **empty** on GitHub (checked 10 Nov, 13:50). Nothing is published yet, so this file sets the contract both apps follow.
- **Batch Tickler** (`isaymotion/tickler`, version 1.19.1, live at `https://isaymotion.github.io/tickler/`):
  - plain HTML/CSS/JS on GitHub Pages, on the same origin as DutySched;
  - cards sync through Firebase (project `batch-tickler`, Firestore on the free Spark plan) with Google sign-in, a batch join code and admin approval;
  - admin is `isaymotion@gmail.com`;
  - cards are stored at `batches/{code}/cards/{cardId}`, and members at `batches/{code}/members/{uid}`, with fields name and email.
- **Shared constants:** both apps use `data/hospital.js` (`window.HOSPITAL`). Its posts are MW, FW, GND, ACIU1, ACIU2, ER and OPU, with year levels 1, 2 and 3 (her hospital says "first years / second years / third years", never PGY). Keep post codes identical in both apps.

## Decision needed first (Dr. Navarro and Doc Andrei)
How does the schedule travel from DutySched to Batch Tickler?

**A. Cloud (recommended).** DutySched gets a **Publish to Batch Tickler** button for the chief resident.
- It signs in with Google and writes the month into Batch Tickler's Firebase project, under the batch.
- Only approved batch members can read it, and every phone gets updates at its next sync, with no files to pass around.
- Cost: DutySched loads a small Firebase bundle (Batch Tickler vendors one at `js/vendor/firebase.js`, about 276 KB: app, auth and firestore/lite), and two Firestore rules are added.
- The publishers' Google emails (Doc Andrei, Doc Vince) go in a list in the rules.

**B. Public file.** DutySched commits `schedule/<YYYY-MM>.json` to its repo, and Batch Tickler fetches `https://isaymotion.github.io/DutySched/schedule/<YYYY-MM>.json`.
- Simplest, with no sign-in.
- **But it is public:** anyone on the internet could see which resident is on duty where and when. It is not recommended for a hospital roster.

The rest of this file assumes **A**. Under B, the JSON shape is the same.

## The data contract (both options)
One document per month. Under A it lives at Firestore `batches/{code}/duty/{YYYY-MM}`. Under B it is the file `schedule/<YYYY-MM>.json`.

```json
{
  "v": 1,
  "month": "2027-01",
  "published": "2027-01-01T08:00:00.000Z",
  "by": "andrei@example.com",
  "note": "Optional message for the batch, max 300 chars",
  "people": [
    { "key": "r1", "name": "Ma. Isabella P. Navarro", "email": "isaymotion@gmail.com", "year": 1 }
  ],
  "shifts": [
    { "date": "2027-01-03", "post": "ER", "type": "24h", "start": "08:00", "end": "08:00", "who": ["r1", "r4"] },
    { "date": "2027-01-03", "post": "MW", "type": "day", "start": "08:00", "end": "17:00", "who": ["r2"] }
  ]
}
```

**Rules for the data**
- `date` is local Philippine time (YYYY-MM-DD).
- `start` and `end` are HH:MM. If `end` is not later than `start`, the shift ends the next day.
- `type` is one of `24h | day | night | oncall | off`. `off` means a day off or post-duty, and is optional.
- `post` is a code from `HOSPITAL.posts`, or a short free label of 12 characters or fewer.
- `who` lists `people[].key` values. `people[].email` is the **Google email the resident uses for Batch Tickler**. That is how Batch Tickler finds "my duties" and links each name to the person's card. If the email is missing, it falls back to matching the name exactly (ignoring case).
- One document is 1 MiB at most. A 31-day month for about 30 residents is roughly 15–30 KB.
- A month is replaced whole on every publish (overwrite, no merge). `published` changes every time, and Batch Tickler shows "Updated <date>".
- Keep `v: 1`. Any breaking change bumps it, and Batch Tickler ignores versions it doesn't know.

## Firestore rules to add (option A)
These go inside `match /batches/{b} { … }` in Batch Tickler's rules. The Batch Tickler chat will hand Dr. Navarro the full updated rules to paste.

```
function isPublisher() {
  return signedIn() && request.auth.token.email_verified == true
    && request.auth.token.email in ['isaymotion@gmail.com' /* + chief residents' emails */];
}
match /duty/{month} {
  allow read: if isMember(b) || isAdmin() || isPublisher();
  allow write: if isPublisher()
    && month.matches('^20[0-9]{2}-(0[1-9]|1[0-2])$')
    && request.resource.data.v == 1
    && request.resource.data.month == month;
}
```

## What DutySched builds (option A)
1. A **Publish to Batch Tickler** panel for the chief:
   - sign in with Google;
   - enter the batch join code once (saved on that device);
   - pick a month, then **Publish**.
   It writes `batches/{code}/duty/{YYYY-MM}` with `setDoc` (overwrite) and shows "Published <time>".
2. Use the **same Firebase web config** as Batch Tickler, from `data/cloud.js` in the tickler repo:
   - projectId `batch-tickler`
   - authDomain `batch-tickler.firebaseapp.com`
   - apiKey `AIzaSyCPGCe84bMyj3aZnLRfrLwSFKy3AI1QtgY`
   - appId `1:356707405669:web:cbc941c3629bdf0444db8c`
   This config is not secret; the rules guard the data.
3. Fill `people[].email` from DutySched's resident list. Add an email field per resident if there isn't one.
4. Keep everything else in DutySched as it is: its own storage prefix and its own service worker prefix (never `bt:v1:` or `batchtickler-`), and the `check_sw.py` rule from the design skill.

## What Batch Tickler builds once the above exists (its own chat does this)
- A **Duty schedule** screen (`#/duty`):
  - a month grid with a coloured chip per post, and tapping a day lists who is where;
  - previous and next month;
  - **My duties** list;
  - **Add my duties to calendar** (.ics with timed events, Asia/Manila);
  - **Add the whole month** (.ics).
- The month is pulled during sync, about one read per month per sync, which suits the free plan's quota.
- A Home card shows **Your next duty** and **On duty today**.
- A calendar subscription that updates by itself (webcal) needs a server, so for now updates mean re-adding the month's .ics. The screen says when a newer version was published.

## Hand back to the Batch Tickler chat
- Option A or B.
- The publishers' Google emails.
- Whether DutySched keeps an email per resident.
- The month the first real schedule will cover.

Batch Tickler then adds the rules and the screen as its next release.
