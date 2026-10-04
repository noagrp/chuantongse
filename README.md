# 传统颜色

Traditional Chinese color knowledge and color-testing app.

## Source

The core palette stores typical chromaticity coordinates from **GB/T 31430-2015 中国传统色色名及色度特性**. The national standard remains the source of truth for the recorded colorimetric data.

The browser UI converts the stored Y/x/y values into an approximate sRGB display color. HEX/RGB values are therefore **screen references**, not replacements for physical standard samples.

## Reusable files

- `data/colors.json` — structured traditional-color records and source coordinates
- `src/color-engine.js` — lookup/filter and screen conversion
- `index.html` — gallery, knowledge view and local canvas

Other projects may reuse the JSON or engine directly.

## Scope

V1 includes the currently verified standard-table entries in the 褐、红、橙、黄 families. More verified standard entries can be added without changing the engine or UI.
