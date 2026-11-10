# Hometown map data generator (data/places.js)

Run inside this folder (`tools/map`). Network: npm only.

    npm install                      # world-atlas + topojson
    node build.js                    # Natural Earth 10m Philippines outline -> path.json (projection lon0 116.8, lat1 21.3, k 61.5, kx cos 12.5°)
    node gen.js                      # path.json + places_src.js -> places.js
    pip install --break-system-packages cairosvg && python3 render.py   # check.png: outline + a red dot per place; look at it
    cp places.js ../../../tickler/data/places.js                       # path to the app repo clone

To add a place: append `[name, province, lon, lat, [aka…], kind?]` to `places_src.js`, re-run `gen.js`, check, copy.
Small edits can also be made directly in the app's `data/places.js` with x = (lon-116.8)*0.97630*61.5, y = (21.3-lat)*61.5.
