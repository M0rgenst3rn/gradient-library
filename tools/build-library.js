// Builds the gradient library: tools/palettes.js -> gradients/library.js + gradients/thumbs/<category>.png
// Run: node tools/build-library.js
//
// Every palette becomes one gradient; in "windows" categories also a few parts of it (deep, light, core,
// duo). Duotone and Monochrome are generated from colour rules. Gradients that are too flat or almost the
// same as one already in the category are dropped. The colours blend in OKLab (perceptual), like Photoshop's
// "Perceptual" gradient method.
const fs = require("fs"), path = require("path");
const { encodePNG } = require("./png.js");
const C = require("../gradients/color.js");
const CATS = require("./palettes.js");

const ROOT = path.join(__dirname, "..");
const THUMB_W = 192, THUMB_H = 28;

// ---------------------------------------------------------------- parsing
// "#rrggbb", "#rrggbbaa", optional "@pos" -> { hex, a (0..100), pos (0..100 or null) }
function parseStop(tok) {
  const m = /^#([0-9a-f]{6})([0-9a-f]{2})?(?:@(\d+(?:\.\d+)?))?$/i.exec(tok);
  if (!m) throw new Error("bad colour " + tok);
  return { hex: m[1].toLowerCase(), a: m[2] ? Math.round(parseInt(m[2], 16) / 255 * 100) : 100, pos: m[3] !== undefined ? +m[3] : null };
}
function spread(stops) {
  const n = stops.length;
  return stops.map((s, i) => ({ hex: s.hex, a: s.a, pos: s.pos !== null ? s.pos : Math.round(i / (n - 1) * 1000) / 10 }));
}
function parsePalettes(text) {
  return text.trim() ? text.trim().split("\n").map((line) => {
    const i = line.indexOf(":");
    return { name: line.slice(0, i).trim(), stops: line.slice(i + 1).trim().split(/\s+/).map(parseStop) };
  }) : [];
}

// ---------------------------------------------------------------- generated categories
const DUO_DARK = [["Navy", "0c1b3d"], ["Plum", "2c0d40"], ["Forest", "0b2c20"], ["Wine", "3b0b1c"], ["Espresso", "26150d"], ["Charcoal", "1b1b21"],
  ["Petrol", "06303a"], ["Indigo", "1d175e"], ["Oxblood", "330808"], ["Aubergine", "241033"], ["Teal", "053a3a"], ["Crimson", "5e0b22"]];
const DUO_LIGHT = [["Lemon", "fbef7e"], ["Peach", "fbcba6"], ["Mint", "bdf2d3"], ["Sky", "aad8fb"], ["Blush", "fbc4d6"], ["Lilac", "dac8fb"],
  ["Cream", "fbf2de"], ["Coral", "f99c7e"], ["Aqua", "93f0e8"], ["Gold", "f9d06f"], ["Lime", "d9f97e"], ["Rose", "f792b3"]];
function duotones() {
  const out = [];
  for (const [dn, d] of DUO_DARK) for (const [ln, l] of DUO_LIGHT) out.push({ name: `${dn} × ${ln}`, stops: spread([{ hex: d, a: 100, pos: null }, { hex: l, a: 100, pos: null }]) });
  return out;
}
const HUES = [["Red", 25], ["Vermilion", 40], ["Orange", 58], ["Amber", 75], ["Yellow", 98], ["Lime", 125], ["Green", 145], ["Emerald", 160],
  ["Teal", 185], ["Cyan", 205], ["Azure", 235], ["Blue", 260], ["Indigo", 280], ["Violet", 300], ["Purple", 318], ["Magenta", 340], ["Pink", 355], ["Rose", 10]];
function monochrome() {
  const out = [];
  for (const [n, h] of HUES) {
    const mid = C.oklchHex(0.62, 0.16, h), dark = C.oklchHex(0.22, 0.07, h), light = C.oklchHex(0.95, 0.04, h), deep = C.oklchHex(0.42, 0.13, h);
    const mk = (name, hexes) => ({ name, stops: spread(hexes.map((x) => ({ hex: x, a: 100, pos: null }))) });
    out.push(mk(`${n} · Full`, [dark, mid, light]), mk(`${n} · Deep`, [dark, deep, mid]), mk(`${n} · Light`, [mid, light]));
  }
  return out;
}

// ---------------------------------------------------------------- variants of a palette
const SUFFIX = { deep: "Deep", light: "Light", core: "Core", duo: "Duo" };
function variants(p, mode) {
  const st = spread(p.stops), out = [{ name: p.name, stops: st }];
  const n = p.stops.length;
  if (mode !== "windows" || n < 3) return out;
  const part = (from, to) => spread(p.stops.slice(from, to + 1).map((s) => ({ hex: s.hex, a: s.a, pos: null })));
  const half = Math.ceil(n / 2);
  out.push({ name: `${p.name} · ${SUFFIX.deep}`, stops: part(0, half - 1 + (n > 3 ? 1 : 0)) });
  out.push({ name: `${p.name} · ${SUFFIX.light}`, stops: part(n - half - (n > 3 ? 1 : 0), n - 1) });
  if (n >= 5) out.push({ name: `${p.name} · ${SUFFIX.core}`, stops: part(1, n - 2) });
  if (n >= 4) out.push({ name: `${p.name} · ${SUFFIX.duo}`, stops: spread([p.stops[0], p.stops[n - 1]].map((s) => ({ hex: s.hex, a: s.a, pos: null }))) });
  return out;
}

// ---------------------------------------------------------------- quality
const SAMPLES = 16;
function samples(stops) { const o = []; for (let i = 0; i < SAMPLES; i++) o.push(C.sampleLab(stops, i / (SAMPLES - 1))); return o; }
// how much the gradient changes from end to end (OKLab, plus alpha)
function range(stops) {
  let r = 0;
  for (let i = 1; i < stops.length; i++) {
    const a = C.hexLab(stops[i - 1].hex), b = C.hexLab(stops[i].hex);
    r += Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) + Math.abs(stops[i].a - stops[i - 1].a) / 100;
  }
  return r;
}
function distance(sa, sb) {
  let d = 0;
  for (let i = 0; i < SAMPLES; i++) d += Math.hypot(sa[i][0] - sb[i][0], sa[i][1] - sb[i][1], sa[i][2] - sb[i][2], (sa[i][3] - sb[i][3]) * 0.5);
  return d / SAMPLES;
}

// ---------------------------------------------------------------- build
const cats = [], gradients = [], dropped = { flat: 0, twin: 0 };
for (const cat of CATS) {
  let list = cat.id === "duotone" ? duotones() : cat.id === "mono" ? monochrome() : parsePalettes(cat.palettes);
  const kept = [];
  const names = new Set();
  for (const p of list) {
    for (const v of cat.id === "duotone" || cat.id === "mono" ? [{ name: p.name, stops: p.stops }] : variants(p, cat.mode)) {
      if (range(v.stops) < 0.06) { dropped.flat++; continue; }
      const s = samples(v.stops);
      if (kept.some((k) => distance(k.s, s) < 0.022)) { dropped.twin++; continue; }
      if (names.has(v.name)) throw new Error("duplicate name " + v.name + " in " + cat.id);
      names.add(v.name);
      kept.push({ name: v.name, stops: v.stops, s });
    }
  }
  // thumbnail sprite: one row per gradient, transparency over a light checkerboard
  const W = THUMB_W, H = THUMB_H * kept.length, px = new Uint8Array(W * H * 3);
  kept.forEach((g, row) => {
    for (let x = 0; x < W; x++) {
      const c = C.sampleRGB(g.stops, x / (W - 1));
      for (let y = 0; y < THUMB_H; y++) {
        const chk = ((x >> 3) + (y >> 3)) & 1 ? 0xd8 : 0xf2, a = c[3];
        const i = ((row * THUMB_H + y) * W + x) * 3;
        px[i] = Math.round(c[0] * a + chk * (1 - a)); px[i + 1] = Math.round(c[1] * a + chk * (1 - a)); px[i + 2] = Math.round(c[2] * a + chk * (1 - a));
      }
    }
  });
  fs.writeFileSync(path.join(ROOT, "gradients", "thumbs", cat.id + ".png"), encodePNG(W, H, px, 3));
  cats.push({ id: cat.id, name: cat.name, group: cat.group, map: !!cat.map, count: kept.length });
  kept.forEach((g, row) => gradients.push([g.name, cat.id, row, g.stops.map((s) => s.hex + "@" + s.pos + (s.a < 100 ? "/" + s.a : "")).join(" ")]));
}

const out = `// GENERATED by tools/build-library.js from tools/palettes.js – do not edit by hand.
// gradients: [name, category, row in the category's thumbnail sprite, "rrggbb@position[/opacity] …"]
module.exports = {
  THUMB_H: ${THUMB_H},
  categories: ${JSON.stringify(cats)},
  gradients: [
${gradients.map((g) => "    " + JSON.stringify(g)).join(",\n")},
  ],
};
`;
fs.writeFileSync(path.join(ROOT, "gradients", "library.js"), out);
console.log(`${gradients.length} gradients in ${cats.length} categories (dropped: ${dropped.flat} too flat, ${dropped.twin} near-duplicates)`);
for (const c of cats) console.log(`  ${c.name.padEnd(26)} ${c.count}`);
