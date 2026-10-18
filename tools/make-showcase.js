// Builds the README images from the library: docs/images/library.png (every category, a few gradients each)
// and docs/images/category-<id>.png (one whole category). Run after tools/build-library.js.
//   node tools/make-showcase.js [categoryId …]
const fs = require("fs"), path = require("path");
const { encodePNG } = require("./png.js");
const C = require("../gradients/color.js");
const LIB = require("../gradients/library.js");
const OUT = path.join(__dirname, "..", "docs", "images");
fs.mkdirSync(OUT, { recursive: true });

const BG = [7, 10, 18];
function canvas(w, h) { const px = new Uint8Array(w * h * 3); for (let i = 0; i < w * h; i++) px.set(BG, i * 3); return { w, h, px }; }
// rounded swatch with the gradient (alpha over a checkerboard)
function swatch(cv, x0, y0, w, h, stops, r) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = Math.max(0, r - x, x - (w - 1 - r)), dy = Math.max(0, r - y, y - (h - 1 - r));
    const cover = Math.max(0, Math.min(1, r + 0.5 - Math.hypot(dx, dy)));
    if (cover <= 0) continue;
    const c = C.sampleRGB(stops, x / (w - 1)), chk = ((x >> 3) + (y >> 3)) & 1 ? 0xd8 : 0xf2;
    const i = ((y0 + y) * cv.w + x0 + x) * 3;
    for (let k = 0; k < 3; k++) {
      const v = c[k] * c[3] + chk * (1 - c[3]);
      cv.px[i + k] = Math.round(cv.px[i + k] * (1 - cover) + v * cover);
    }
  }
}
const byCat = {};
for (const g of LIB.gradients) (byCat[g[1]] = byCat[g[1]] || []).push(g);

// overview: one row per category, 8 gradients
{
  const COLS = 8, SW = 118, SH = 34, GAP = 8, LABEL = 0, ROWH = SH + GAP;
  const cats = LIB.categories, W = COLS * (SW + GAP) + GAP, H = cats.length * ROWH + GAP;
  const cv = canvas(W + LABEL, H);
  cats.forEach((c, r) => {
    const list = byCat[c.id], pick = [];
    for (let k = 0; k < COLS && k < list.length; k++) pick.push(list[Math.floor(k * list.length / Math.min(COLS, list.length))]);
    pick.forEach((g, k) => swatch(cv, LABEL + GAP + k * (SW + GAP), GAP + r * ROWH, SW, SH, C.parseStops(g[3]), 7));
  });
  fs.writeFileSync(path.join(OUT, "library.png"), encodePNG(cv.w, cv.h, cv.px, 3));
  console.log("library.png", cv.w + "x" + cv.h, cats.map((c) => c.name).join(" | "));
}
// single categories
for (const id of process.argv.slice(2)) {
  const list = byCat[id], COLS = 6, SW = 150, SH = 40, GAP = 8;
  const rows = Math.ceil(list.length / COLS), cv = canvas(COLS * (SW + GAP) + GAP, rows * (SH + GAP) + GAP);
  list.forEach((g, k) => swatch(cv, GAP + (k % COLS) * (SW + GAP), GAP + Math.floor(k / COLS) * (SH + GAP), SW, SH, C.parseStops(g[3]), 7));
  fs.writeFileSync(path.join(OUT, "category-" + id + ".png"), encodePNG(cv.w, cv.h, cv.px, 3));
  console.log("category-" + id + ".png", list.length);
}
