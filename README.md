# dev-tools branch — Batch Tickler

Not published to GitHub Pages (Pages deploys `main` only). Holds the QA harness and the handoff doc.

## Layout
```
qa/flow_test.py   Playwright regression: 14 flows (card save, import/merge/dedupe, batch sort, birthdays,
                  remove, search, Guess who, print, share downloads, footer backup round-trip, Tagalog, dark, desktop)
qa/batch.json     fixture: a batch file with 5 cards (one duplicate of "Juan Dela Cruz")
qa/*_test.py      one suite per release (today, fun, nf, lists, f114, f115, em116, pt117, sync118, f119, chat121,
                  draft1212, pdf122, nav123): python3 qa/<name>_test.py ./tickler <outdir>
HANDOFF.md        the handoff doc (same text as claude/handoff.md in the claude.ai Project)
```

## Run
```
git clone --depth 1 https://github.com/isaymotion/tickler tickler                 # main
git clone --depth 1 -b dev-tools https://github.com/isaymotion/tickler tickler-devtools
pip install --break-system-packages playwright pillow && python3 -m playwright install chromium   # if missing
python3 tickler-devtools/qa/flow_test.py ./tickler       # or TICKLER_DIR=./tickler
```
Prints `PASS`/`FAIL` per flow and an `ERRORS:` list. A clean run has every line PASS except possibly
`8c` (it asserts the next random clue differs, which can legitimately repeat) and console errors containing
`ERR_FAILED` (Google Fonts blocked in the sandbox). Screenshots land in `qa/*.png` (gitignored).
The script serves the app on 127.0.0.1:8765 and blocks every other host.

## tools/map
Generator for the app's `data/places.js` (offline Philippines outline + place coordinates). See tools/map/README.md.
