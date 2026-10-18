"use strict";
// Morgenstern Gradients – logic without Photoshop: the library, search, and the Photoshop commands
// (batchPlay descriptors) that create or change gradient layers. Runs in the panel and in Node (checks).

const LIB = require("./library.js");
const C = require("./color.js");

const CATS = LIB.categories;
const CAT = {};
for (const c of CATS) CAT[c.id] = c;
// [name, category, sprite row, stops] -> entry
const ALL = LIB.gradients.map((g, i) => ({ i, key: g[1] + "/" + g[0], name: g[0], cat: g[1], row: g[2], raw: g[3], _stops: null }));
const BY_KEY = {};
for (const g of ALL) BY_KEY[g.key] = g;
function stopsOf(g) { return g._stops || (g._stops = C.parseStops(g.raw)); }

const STYLES = [{ id: "linear", name: "Linear" }, { id: "radial", name: "Radial" }, { id: "angle", name: "Angle" }, { id: "reflected", name: "Reflected" }, { id: "diamond", name: "Diamond" }];

// Search: every word must appear in the name, category or group ("gold metal", "teal film")
function search(list, q) {
  const words = String(q || "").toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  return list.filter((g) => {
    const c = CAT[g.cat], hay = (g.name + " " + c.name + " " + c.group).toLowerCase();
    return words.every((w) => hay.indexOf(w) >= 0);
  });
}

// The stops as they go into Photoshop: reversed on request; for a Gradient Map dark → light unless reversed
function stopsFor(g, opts) {
  let st = stopsOf(g);
  if (opts.as === "map" && C.lightness(st[0].hex) > C.lightness(st[st.length - 1].hex)) st = C.reverse(st);
  if (opts.reverse) st = C.reverse(st);
  return st;
}

// ---------------------------------------------------------------- Photoshop descriptors
const loc = (pos) => Math.round(Math.max(0, Math.min(100, pos)) / 100 * 4096);
function gradientDesc(name, stops) {
  return {
    _obj: "gradientClassEvent",
    name,
    gradientForm: { _enum: "gradientForm", _value: "customStops" },
    interfaceIconFrameDimmed: 4096,
    colors: stops.map((s) => {
      const c = C.hexRgb(s.hex);
      return { _obj: "colorStop", color: { _obj: "RGBColor", red: c[0], grain: c[1], blue: c[2] }, type: { _enum: "colorStopType", _value: "userStop" }, location: loc(s.pos), midpoint: 50 };
    }),
    transparency: stops.map((s) => ({ _obj: "transferSpec", opacity: { _unit: "percentUnit", _value: s.a }, location: loc(s.pos), midpoint: 50 })),
  };
}
const PERCEPTUAL = { _enum: "gradientInterpolationMethodType", _value: "perceptual" };
const TARGET_LAYER = (ref) => [{ _ref: ref, _enum: "ordinal", _value: "targetEnum" }];

// New gradient fill layer
function makeFill(g, opts) {
  return {
    _obj: "make", _target: [{ _ref: "contentLayer" }],
    using: { _obj: "contentLayer", type: {
      _obj: "gradientLayer",
      gradientsInterpolationMethod: PERCEPTUAL,
      angle: { _unit: "angleUnit", _value: opts.angle },
      type: { _enum: "gradientType", _value: opts.style },
      scale: { _unit: "percentUnit", _value: 100 },
      align: true,
      gradient: gradientDesc(g.name, stopsFor(g, opts)),
    } },
  };
}
// New Gradient Map adjustment layer
function makeMap(g, opts) {
  return {
    _obj: "make", _target: [{ _ref: "adjustmentLayer" }],
    using: { _obj: "adjustmentLayer", type: { _obj: "gradientMapClass", gradientsInterpolationMethod: PERCEPTUAL, gradient: gradientDesc(g.name, stopsFor(g, { as: "map", reverse: opts.reverse })) } },
  };
}
// Swap the gradient of the selected layer (keeps its angle, style, scale, mask …)
function swapFill(g, opts) {
  return { _obj: "set", _target: TARGET_LAYER("contentLayer"), to: { _obj: "gradientLayer", gradientsInterpolationMethod: PERCEPTUAL, gradient: gradientDesc(g.name, stopsFor(g, opts)) } };
}
function swapMap(g, opts) {
  return { _obj: "set", _target: TARGET_LAYER("adjustmentLayer"), to: { _obj: "gradientMapClass", gradientsInterpolationMethod: PERCEPTUAL, gradient: gradientDesc(g.name, stopsFor(g, { as: "map", reverse: opts.reverse })) } };
}
function layerName(g, as) { return (as === "map" ? "Gradient Map · " : "Gradient · ") + g.name; }

module.exports = { LIB, CATS, CAT, ALL, BY_KEY, STYLES, stopsOf, stopsFor, search, gradientDesc, makeFill, makeMap, swapFill, swapMap, layerName };
