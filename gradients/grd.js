"use strict";
// Writes Photoshop gradient files (.grd, version 5): the format Photoshop's Gradients panel imports.
// A version 5 file is "8BGR", version 5, the number 16, then one Photoshop descriptor: a list "GrdL" whose
// entries are objects of class "Grdn" (named "Gradient") that hold the gradient under the key "Grad".
// Names inside the file end with a 0 character, like Photoshop writes them.
// gradients: [{ name, stops: [{ hex, a, pos }] }]  ->  Uint8Array

function writer() {
  const bytes = [];
  const u8 = (v) => bytes.push(v & 255);
  const u16 = (v) => { u8(v >> 8); u8(v); };
  const u32 = (v) => { u8(v >>> 24); u8(v >>> 16); u8(v >>> 8); u8(v); };
  const ascii = (s) => { for (let i = 0; i < s.length; i++) u8(s.charCodeAt(i)); };
  const f64 = (v) => { const b = new DataView(new ArrayBuffer(8)); b.setFloat64(0, v); for (let i = 0; i < 8; i++) u8(b.getUint8(i)); };
  // Unicode string: length in UTF-16 units, then UTF-16BE (callers add the closing 0 where Photoshop has one)
  const ustr = (s) => { u32(s.length); for (let i = 0; i < s.length; i++) u16(s.charCodeAt(i)); };
  // key / class ID: 4-letter code (length 0) or a longer string id
  const id = (s) => { if (s.length === 4) { u32(0); ascii(s); } else { u32(s.length); ascii(s); } };
  return { bytes, u8, u16, u32, ascii, f64, ustr, id };
}

// value writers: [type, writeFn]
function descriptor(w, className, classId, items) {
  w.ustr(className); w.id(classId); w.u32(items.length);
  for (const [key, type, val] of items) { w.id(key); w.ascii(type); value(w, type, val); }
}
function value(w, type, v) {
  switch (type) {
    case "Objc": descriptor(w, v.className || "", v.classId, v.items); break;
    case "VlLs": w.u32(v.length); for (const [t, x] of v) { w.ascii(t); value(w, t, x); } break;
    case "TEXT": w.ustr(v + "\u0000"); break;
    case "doub": w.f64(v); break;
    case "long": w.u32(v | 0); break;
    case "enum": w.id(v[0]); w.id(v[1]); break;
    case "UntF": w.ascii(v[0]); w.f64(v[1]); break;
    case "bool": w.u8(v ? 1 : 0); break;
    default: throw new Error("grd: unknown type " + type);
  }
}

const loc = (pos) => Math.round(Math.max(0, Math.min(100, pos)) / 100 * 4096);
function gradientItems(g, hexRgb) {
  const colors = g.stops.map((s) => {
    const c = hexRgb(s.hex);
    return ["Objc", { className: "\u0000", classId: "Clrt", items: [
      ["Clr ", "Objc", { className: "\u0000", classId: "RGBC", items: [["Rd  ", "doub", c[0]], ["Grn ", "doub", c[1]], ["Bl  ", "doub", c[2]]] }],
      ["Type", "enum", ["Clry", "UsrS"]],
      ["Lctn", "long", loc(s.pos)],
      ["Mdpn", "long", 50],
    ] }];
  });
  const trans = g.stops.map((s) => ["Objc", { className: "\u0000", classId: "TrnS", items: [
    ["Opct", "UntF", ["#Prc", s.a]],
    ["Lctn", "long", loc(s.pos)],
    ["Mdpn", "long", 50],
  ] }]);
  return [
    ["Nm  ", "TEXT", g.name],
    ["GrdF", "enum", ["GrdF", "CstS"]],
    ["Intr", "doub", 4096],
    ["Clrs", "VlLs", colors],
    ["Trns", "VlLs", trans],
  ];
}

function encodeGrd(gradients, hexRgb) {
  const w = writer();
  w.ascii("8BGR"); w.u16(5); w.u32(16);
  const list = gradients.map((g) => ["Objc", { className: "Gradient\u0000", classId: "Grdn", items: [
    ["Grad", "Objc", { className: g.name + "\u0000", classId: "Grdn", items: gradientItems(g, hexRgb) }],
  ] }]);
  descriptor(w, "", "null", [["GrdL", "VlLs", list]]);
  return Uint8Array.from(w.bytes);
}

// Reader for the same structure (used by the checks to read a written file back)
function decodeGrd(buf) {
  let o = 0;
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const u32 = () => { const v = dv.getUint32(o); o += 4; return v; };
  const u16 = () => { const v = dv.getUint16(o); o += 2; return v; };
  const ascii = (n) => { let s = ""; for (let i = 0; i < n; i++) s += String.fromCharCode(buf[o + i]); o += n; return s; };
  const ustr = () => { const n = u32(); let s = ""; for (let i = 0; i < n; i++) { const c = u16(); if (c) s += String.fromCharCode(c); } return s; };
  const id = () => { const n = u32(); return ascii(n || 4); };
  const val = (t) => {
    if (t === "Objc") return desc();
    if (t === "VlLs") { const n = u32(), a = []; for (let i = 0; i < n; i++) a.push(val(ascii(4))); return a; }
    if (t === "TEXT") return ustr();
    if (t === "doub") { const v = dv.getFloat64(o); o += 8; return v; }
    if (t === "long") return u32() | 0;
    if (t === "enum") return [id(), id()];
    if (t === "UntF") { const u = ascii(4), v = dv.getFloat64(o); o += 8; return [u, v]; }
    if (t === "bool") return !!buf[o++];
    throw new Error("grd: unknown type " + t + " at " + o);
  };
  const desc = () => { const name = ustr(), cls = id(), n = u32(), items = {}; for (let i = 0; i < n; i++) { const k = id(); items[k] = val(ascii(4)); } return { name, cls, items }; };
  if (ascii(4) !== "8BGR") throw new Error("not a .grd file");
  const version = u16(); u32();
  const root = desc();
  if (o !== buf.length) throw new Error("grd: " + (buf.length - o) + " bytes left over");
  return { version, gradients: root.items.GrdL.map((e) => e.items.Grad.items) };
}

module.exports = { encodeGrd, decodeGrd };
