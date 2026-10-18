"use strict";
// Colour maths shared by the panel and the build tools: sRGB <-> OKLab, and sampling a gradient.
// A gradient is a list of stops { hex: "rrggbb", a: opacity 0..100, pos: 0..100 }.

const toLin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const toSrgb = (c) => { c = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, c * 255)); };

function hexRgb(hex) { const n = parseInt(hex, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgbHex(r, g, b) { return [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join(""); }

function rgbLab(r, g, b) {
  const R = toLin(r), G = toLin(g), B = toLin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
// OKLab -> linear sRGB (may be out of gamut)
function labLin(L, a, b) {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3), m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3), s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
function labRgb(L, a, b) { const c = labLin(L, a, b); return [toSrgb(c[0]), toSrgb(c[1]), toSrgb(c[2])]; }
function hexLab(hex) { const c = hexRgb(hex); return rgbLab(c[0], c[1], c[2]); }

// OKLCH colour as hex, chroma reduced until it fits into sRGB
function oklchHex(L, C, hDeg) {
  const h = hDeg * Math.PI / 180;
  for (let c = C; c >= 0; c -= 0.005) {
    const lin = labLin(L, c * Math.cos(h), c * Math.sin(h));
    if (lin.every((v) => v >= -0.0005 && v <= 1.0005)) return rgbHex(toSrgb(lin[0]), toSrgb(lin[1]), toSrgb(lin[2]));
  }
  const g = toSrgb(labLin(L, 0, 0)[0]);
  return rgbHex(g, g, g);
}

// Gradient at t (0..1): [L, a, b, alpha 0..1], blended in OKLab
function sampleLab(stops, t) {
  const p = t * 100;
  let i = 0;
  while (i < stops.length - 2 && p > stops[i + 1].pos) i++;
  const s0 = stops[i], s1 = stops[Math.min(i + 1, stops.length - 1)];
  const span = s1.pos - s0.pos, f = span > 0 ? Math.max(0, Math.min(1, (p - s0.pos) / span)) : (p >= s1.pos ? 1 : 0);
  const a = hexLab(s0.hex), b = hexLab(s1.hex);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, (s0.a + (s1.a - s0.a) * f) / 100];
}
// Gradient at t: [r, g, b (0..255), alpha 0..1]
function sampleRGB(stops, t) { const l = sampleLab(stops, t), c = labRgb(l[0], l[1], l[2]); return [c[0], c[1], c[2], l[3]]; }
// Relative brightness of a stop (OKLab L, 0..1)
function lightness(hex) { return hexLab(hex)[0]; }

// "rrggbb@pos[/opacity] …" -> stops
function parseStops(str) {
  return String(str).trim().split(/\s+/).map((t) => {
    const m = /^([0-9a-f]{6})@([\d.]+)(?:\/(\d+))?$/i.exec(t);
    return { hex: m[1].toLowerCase(), pos: +m[2], a: m[3] !== undefined ? +m[3] : 100 };
  });
}
// The same gradient mirrored (for "Reverse")
function reverse(stops) { return stops.slice().reverse().map((s) => ({ hex: s.hex, a: s.a, pos: Math.round((100 - s.pos) * 10) / 10 })); }
// CSS for a preview strip (used where the panel draws gradients itself)
function css(stops) { return "linear-gradient(90deg, " + stops.map((s) => { const c = hexRgb(s.hex); return `rgba(${c[0]},${c[1]},${c[2]},${s.a / 100}) ${s.pos}%`; }).join(", ") + ")"; }

module.exports = { hexRgb, rgbHex, rgbLab, labRgb, hexLab, oklchHex, sampleLab, sampleRGB, lightness, parseStops, reverse, css };
