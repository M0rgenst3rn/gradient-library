// Checks without Photoshop: library, search, Photoshop commands and the .grd file. Run: node tools/check.js
const Core = require("../gradients/core.js");
const C = require("../gradients/color.js");
const { encodeGrd, decodeGrd } = require("../gradients/grd.js");
const fs = require("fs"), path = require("path");

let bad = 0;
const check = (name, ok, extra) => { if (!ok) bad++; console.log((ok ? "ok   " : "FAIL ") + name + (extra !== undefined ? "  " + extra : "")); };

// library
check("1000–2000 gradients", Core.ALL.length >= 1000 && Core.ALL.length <= 2000, Core.ALL.length);
check("unique keys", new Set(Core.ALL.map((g) => g.key)).size === Core.ALL.length);
const broken = Core.ALL.filter((g) => { const s = Core.stopsOf(g); return s.length < 2 || s[0].pos < 0 || s[s.length - 1].pos > 100 || s.some((x, i) => i && x.pos < s[i - 1].pos); });
check("at least 2 stops, within 0–100 %, in order", !broken.length, broken.slice(0, 3).map((g) => g.key).join());
check("every category has gradients and a thumbnail sprite", Core.CATS.every((c) => c.count > 0 && fs.existsSync(path.join(__dirname, "..", "gradients", "thumbs", c.id + ".png"))));
const counts = {};
for (const g of Core.ALL) counts[g.cat] = Math.max(counts[g.cat] || 0, g.row + 1);
check("sprite rows match the category counts", Core.CATS.every((c) => counts[c.id] === c.count));

// search
check("search 'gold' finds gold gradients", Core.search(Core.ALL, "gold").length >= 5, Core.search(Core.ALL, "gold").length);
check("search 'teal film' narrows by category", Core.search(Core.ALL, "teal film").every((g) => /teal/i.test(g.name + Core.CAT[g.cat].name)));
check("empty search returns everything", Core.search(Core.ALL, "  ").length === Core.ALL.length);

// Photoshop commands
const g = Core.BY_KEY["sunset/Coral Dusk"];
const fill = Core.makeFill(g, { as: "fill", style: "radial", angle: 45, reverse: false });
const gd = fill.using.type.gradient;
check("fill layer command: gradient layer with all stops", fill.using.type._obj === "gradientLayer" && gd.colors.length === Core.stopsOf(g).length && gd.colors[0].location === 0 && gd.colors[gd.colors.length - 1].location === 4096);
check("fill layer command: style, angle, perceptual", fill.using.type.type._value === "radial" && fill.using.type.angle._value === 45 && fill.using.type.gradientsInterpolationMethod._value === "perceptual");
const rev = Core.makeFill(g, { as: "fill", style: "linear", angle: 90, reverse: true }).using.type.gradient;
check("reverse flips the stops", rev.colors[0].color.red === gd.colors[gd.colors.length - 1].color.red && rev.colors[0].location === 0);
const light = Core.ALL.find((x) => { const s = Core.stopsOf(x); return C.lightness(s[0].hex) > C.lightness(s[s.length - 1].hex) + 0.2; });
const map = Core.makeMap(light, { reverse: false }).using.type.gradient;
const L = (c) => C.lightness(C.rgbHex(c.color.red, c.color.grain, c.color.blue));
check("gradient map runs dark → light", L(map.colors[0]) <= L(map.colors[map.colors.length - 1]), light.key);
const fade = Core.BY_KEY["fades/Black Fade"];
const tr = Core.makeFill(fade, { as: "fill", style: "linear", angle: 90 }).using.type.gradient.transparency;
check("transparency stops", tr[0].opacity._value === 100 && tr[tr.length - 1].opacity._value === 0);
check("swap commands target the selected layer", Core.swapFill(g, {}).to._obj === "gradientLayer" && Core.swapMap(g, {}).to._obj === "gradientMapClass");

// .grd
const list = Core.ALL.filter((x) => x.cat === "metals" || x.cat === "fades");
const buf = encodeGrd(list.map((x) => ({ name: x.name, stops: Core.stopsOf(x) })), C.hexRgb);
const back = decodeGrd(buf);
check(".grd: version 5, all gradients read back", back.version === 5 && back.gradients.length === list.length, buf.length + " bytes");
check(".grd: names, colours, locations and opacity intact", back.gradients.every((it, k) => {
  const st = Core.stopsOf(list[k]);
  return it["Nm  "] === list[k].name && it.Clrs.length === st.length && it.Clrs.every((c, i) => {
    const e = C.hexRgb(st[i].hex), rgb = c.items["Clr "].items;
    return rgb["Rd  "] === e[0] && rgb["Grn "] === e[1] && rgb["Bl  "] === e[2] && c.items.Lctn === Math.round(st[i].pos / 100 * 4096);
  }) && it.Trns.every((t, i) => t.items.Opct[1] === st[i].a);
}));
check(".grd: unicode names", decodeGrd(encodeGrd([{ name: "Navy × Lemon – ä", stops: Core.stopsOf(g) }], C.hexRgb)).gradients[0]["Nm  "] === "Navy × Lemon – ä");

console.log(bad ? bad + " FAILED" : "all ok");
process.exit(bad ? 1 : 0);
