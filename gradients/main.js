"use strict";
// MS Gradients – Photoshop UXP panel.
// A library of 1000+ original gradients in categories. A click puts the gradient into the document as a
// normal Photoshop layer: a gradient fill layer or a Gradient Map adjustment layer. Both stay fully editable
// with Photoshop's own tools (double-click the layer → gradient editor → "New" saves it to the Gradients
// panel). Whole lists or favourites can also be added to Window › Gradients in one go.

const { app, core, action } = require("photoshop");
const { batchPlay } = action;
const lfs = require("uxp").storage.localFileSystem;
const UI = require("./ms-ui.js");
const Core = require("./core.js");
const C = require("./color.js");
const { encodeGrd } = require("./grd.js");

const $ = (id) => document.getElementById(id);
const HIST = "MS Gradients";
const STORE = "msgradients.v1";
const TARGET = [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }];
const CHUNK = 60;   // tiles per render step while scrolling

// ---------------------------------------------------------------- state (remembered by the panel)
const DEFAULTS = { as: "fill", style: "linear", angle: 90, reverse: false, replace: true, cat: "all", view: "grid", favs: [], recent: [] };
let S = load();
let query = "", busy = false, lastKey = null;
function load() { try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(STORE) || "{}")); } catch (e) { return Object.assign({}, DEFAULTS); } }
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* ignore */ } }
const opts = () => ({ as: S.as, style: S.style, angle: S.angle, reverse: S.reverse });

function setStatus(msg, err) { const el = $("status"); el.textContent = msg || ""; el.className = err ? "status err" : "status"; }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- log (plugin data folder, for bug reports)
const logLines = [];
let logTimer = null;
function log(msg, data) {
  logLines.push(new Date().toISOString() + " " + msg + (data !== undefined ? " " + JSON.stringify(data) : ""));
  if (logLines.length > 400) logLines.splice(0, logLines.length - 400);
  clearTimeout(logTimer);
  logTimer = setTimeout(async () => { try { const f = await (await lfs.getDataFolder()).createFile("gradients-log.txt", { overwrite: true }); await f.write(logLines.join("\n") + "\n"); } catch (e) { /* ignore */ } }, 300);
}

// ---------------------------------------------------------------- lists
function listFor(cat) {
  if (cat === "fav") return S.favs.map((k) => Core.BY_KEY[k]).filter(Boolean);
  if (cat === "recent") return S.recent.map((k) => Core.BY_KEY[k]).filter(Boolean);
  if (cat === "all") return Core.ALL;
  if (cat.indexOf("g:") === 0) return Core.ALL.filter((g) => Core.CAT[g.cat].group === cat.slice(2));
  return Core.ALL.filter((g) => g.cat === cat);
}
function currentList() { return Core.search(listFor(S.cat), query); }
function catTitle(cat) {
  if (cat === "all") return "All gradients";
  if (cat === "fav") return "Favourites";
  if (cat === "recent") return "Recently used";
  if (cat.indexOf("g:") === 0) return cat.slice(2);
  return Core.CAT[cat] ? Core.CAT[cat].name : "All gradients";
}
const GROUPS = [];
for (const c of Core.CATS) { let gr = GROUPS.find((x) => x.name === c.group); if (!gr) GROUPS.push(gr = { name: c.group, cats: [], n: 0 }); gr.cats.push(c); gr.n += c.count; }
const validCat = (cat) => cat === "all" || cat === "fav" || cat === "recent" || (cat.indexOf("g:") === 0 && GROUPS.some((g) => g.name === cat.slice(2))) || !!Core.CAT[cat];

// Families: a gradient and its variants (· Deep, · Light, · Core, · Duo …) share one tile, so the browser
// shows 618 families instead of 1444 near-repeats – every variant is still one click away.
const FAMS = [], FAM_OF = {};
(function () {
  const by = {};
  for (const g of Core.ALL) {
    const base = g.name.split(" · ")[0], k = g.cat + "/" + base;
    let f = by[k];
    if (!f) { f = by[k] = { key: k, name: base, cat: g.cat, items: [] }; FAMS.push(f); }
    f.items.push(g); FAM_OF[g.key] = f;
  }
  for (const f of FAMS) { f.main = f.items.find((g) => g.name.indexOf(" · ") < 0) || f.items[0]; f.vars = f.items.filter((g) => g !== f.main); }
})();

// what the browser shows: families for the library, single gradients for favourites and recent
function entries() {
  const list = currentList(), counts = {};
  for (const g of list) counts[g.cat] = (counts[g.cat] || 0) + 1;
  if (S.cat === "fav" || S.cat === "recent") return { n: list.length, counts, items: list.map((g) => ({ name: g.name, main: g, vars: [], cat: g.cat, single: true })) };
  const out = [], seen = {};
  for (const g of list) {
    const f = FAM_OF[g.key];
    if (seen[f.key]) continue;
    seen[f.key] = true;
    out.push({ name: f.name, main: f.main, vars: f.vars, cat: f.cat });
  }
  return { n: list.length, counts, items: out };
}

// thumbnail: one row of the category's sprite (rows of TH px), scaled to a window of h px
function thumb(g, h) { return `<img src="thumbs/${g.cat}.png" style="top:${-g.row * h}px;height:${Core.CAT[g.cat].count * h}px">`; }

// ---------------------------------------------------------------- the browser
let view = { items: [], done: 0, lastCat: null, headings: false, counts: {} };
function tileHTML(it) {
  const fav = S.favs.indexOf(it.main.key) >= 0, on = (g) => (g.key === lastKey ? " on" : "");
  const star = `<div class="fstar${fav ? " fav" : ""}" data-star="${UI.esc(it.main.key)}" title="Favourite">${fav ? "★" : "☆"}</div>`;
  const tip = (g) => ` data-k="${UI.esc(g.key)}" title="${UI.esc(g.name)}"`;
  if (S.view === "list") {
    const note = it.single ? Core.CAT[it.cat].name : it.vars.length ? (it.vars.length + 1) + " tones" : "";
    return `<div class="lrow"><div class="lrow-name"><span class="t">${UI.esc(it.name)}</span><span class="n">${UI.esc(note)}</span></div>` +
      `<div class="lrow-sw"><div class="sw main${on(it.main)}"${tip(it.main)}>${thumb(it.main, 24)}</div>` +
      it.vars.map((v) => `<div class="sw v${on(v)}"${tip(v)}>${thumb(v, 24)}</div>`).join("") + `</div>${star}</div>`;
  }
  return `<div class="fam"><div class="sw main${on(it.main)}"${tip(it.main)}>${thumb(it.main, 36)}</div>` +
    `<div class="vars">${it.vars.map((v) => `<div class="sw${on(v)}"${tip(v)}>${thumb(v, 7)}</div>`).join("")}</div>${star}</div>`;
}
function renderMore() {
  const end = Math.min(view.items.length, view.done + CHUNK);
  if (end <= view.done) return;
  let html = "";
  for (let i = view.done; i < end; i++) {
    const it = view.items[i];
    if (view.headings && it.cat !== view.lastCat) {
      html += `<div class="cat-h${view.lastCat === null ? " first" : ""}"><span class="t">${UI.esc(Core.CAT[it.cat].name)}</span><span class="n">${view.counts[it.cat] || 0}</span></div>`;
      view.lastCat = it.cat;
    }
    html += tileHTML(it);
  }
  view.done = end;
  const chunk = document.createElement("div");
  chunk.className = "chunk";
  chunk.innerHTML = html;
  $("grid").appendChild(chunk);
}
// render more while the list doesn't fill the panel or the end comes into view
function fillUp() {
  const sc = $("scroller");
  let guard = 0;
  while (view.done < view.items.length && sc.scrollTop + sc.clientHeight > sc.scrollHeight - 400 && guard++ < 20) renderMore();
}
function renderGrid() {
  const e = entries();
  const single = S.cat !== "all" && S.cat.indexOf("g:") !== 0;
  view = { items: e.items, done: 0, lastCat: null, headings: !single, counts: e.counts };
  $("grid").innerHTML = "";
  $("grid").className = "ggrid " + (S.view === "list" ? "list" : "grid");
  if (!e.items.length) {
    $("grid").innerHTML = `<div class="chunk"><div class="empty">${S.cat === "fav" && !query ? "No favourites yet – point at a gradient and click ☆." : S.cat === "recent" && !query ? "Nothing applied yet." : "No gradient matches “" + UI.esc(query) + "”."}</div></div>`;
  }
  $("scroller").scrollTop = 0;
  renderMore(); fillUp();
  renderCats();
}
function renderCats() {
  if (!validCat(S.cat)) S.cat = "all";
  const n = currentList().length;
  $("catName").textContent = catTitle(S.cat);
  $("catCount").textContent = query ? n + " found" : String(n);
  const item = (id, name, cnt, cls) => `<div class="menu-item${cls ? " " + cls : ""}${S.cat === id ? " on" : ""}" data-cat="${UI.esc(id)}">${UI.esc(name)}<span class="n">${cnt}</span></div>`;
  $("catMenu").innerHTML = item("all", "All gradients", Core.ALL.length) + item("fav", "★ Favourites", S.favs.length) + item("recent", "Recently used", S.recent.length) +
    GROUPS.map((gr) => `<div class="menu-sep"></div>` + item("g:" + gr.name, gr.name, gr.n, "grp") + gr.cats.map((c) => item(c.id, c.name, c.count, "sub")).join("")).join("");
}
function markActive() {
  document.querySelectorAll("#grid .sw").forEach((el) => {
    const on = el.getAttribute("data-k") === lastKey, has = el.className.indexOf(" on") >= 0;
    if (on && !has) el.className += " on"; else if (!on && has) el.className = el.className.replace(" on", "");
  });
}

// ---------------------------------------------------------------- info line (what you point at, or the last one applied)
let infoG = null;
function showInfo(g) {
  infoG = g || null;
  const img = $("infoImg");
  if (!g) { img.className = "hidden"; $("infoStar").className = "ibtn istar hidden"; $("infoName").textContent = "Click a gradient to apply it"; $("infoCat").textContent = "Point at one to see its name"; return; }
  img.src = `thumbs/${g.cat}.png`;
  img.style.top = (-g.row * 28) + "px"; img.style.height = (Core.CAT[g.cat].count * 28) + "px";
  img.className = "";
  $("infoName").textContent = g.name;
  $("infoCat").textContent = Core.CAT[g.cat].name + " · " + Core.CAT[g.cat].group;
  const fav = S.favs.indexOf(g.key) >= 0;
  $("infoStar").className = "ibtn istar" + (fav ? " fav" : "");
  $("infoStar").textContent = fav ? "★" : "☆";
}
const restInfo = () => showInfo(lastKey ? Core.BY_KEY[lastKey] : S.recent[0] ? Core.BY_KEY[S.recent[0]] : null);

function toggleFav(g) {
  const i = S.favs.indexOf(g.key);
  if (i >= 0) S.favs.splice(i, 1); else S.favs.unshift(g.key);
  save();
  if (S.cat === "fav") { renderGrid(); return; }
  const fav = S.favs.indexOf(g.key) >= 0;
  document.querySelectorAll("#grid .fstar").forEach((el) => { if (el.getAttribute("data-star") === g.key) { el.className = "fstar" + (fav ? " fav" : ""); el.textContent = fav ? "★" : "☆"; } });
  if (infoG && infoG.key === g.key) showInfo(g);
  renderCats();
}

// ---------------------------------------------------------------- options bar
function renderOptions() {
  UI.syncSeg($("asSeg"), S.as);
  UI.syncSeg($("styleSeg"), S.style);
  const fill = S.as === "fill";
  $("styleSeg").className = fill ? "seg style-seg" : "seg style-seg hidden";
  $("angleBox").className = fill ? "angle" : "angle hidden";
  $("angle").value = String(S.angle);
  $("reverseTog").className = S.reverse ? "tog on" : "tog";
  $("replaceTog").className = S.replace ? "tog on" : "tog";
  document.querySelectorAll(".view-btn").forEach((b) => { b.className = "ibtn view-btn" + (b.getAttribute("data-v") === S.view ? " active" : ""); });
}
const clampAngle = (v) => Math.max(-180, Math.min(180, Math.round(v)));

// ---------------------------------------------------------------- applying
async function apply(g) {
  if (busy) return;
  const doc = app.activeDocument;
  if (!doc) { setStatus("Open a document first.", true); return; }
  busy = true;
  const o = opts();
  try {
    let swapped = false;
    await core.executeAsModal(async (ctx) => {
      const hid = await ctx.hostControl.suspendHistory({ documentID: doc.id, name: Core.layerName(g, o.as) });
      try {
        const layer = doc.activeLayers && doc.activeLayers[0];
        const kind = layer ? String(layer.kind) : "";
        const ours = layer && /^Gradient( Map)? · /.test(layer.name);
        if (S.replace && o.as === "fill" && kind === "gradientFill") { await batchPlay([Core.swapFill(g, o)], {}); swapped = true; }
        else if (S.replace && o.as === "map" && kind === "gradientMap") { await batchPlay([Core.swapMap(g, o)], {}); swapped = true; }
        else await batchPlay([o.as === "map" ? Core.makeMap(g, o) : Core.makeFill(g, o)], {});
        if (!swapped || ours) await batchPlay([{ _obj: "set", _target: TARGET, to: { _obj: "layer", name: Core.layerName(g, o.as) } }], {});
      } finally { await ctx.hostControl.resumeHistory(hid, true); }
    }, { commandName: HIST });
    lastKey = g.key;
    S.recent = [g.key].concat(S.recent.filter((k) => k !== g.key)).slice(0, 40);
    save();
    showInfo(g); markActive(); renderCats();
    if (S.cat === "recent") renderGrid();
    setStatus((swapped ? "Swapped to " : "Applied ") + g.name + (o.as === "map" ? " as Gradient Map" : "") + ". Double-click the layer to edit it.");
    log("apply", { key: g.key, as: o.as, swapped });
  } catch (e) {
    setStatus("Could not apply: " + (e && e.message || e), true);
    log("apply failed", String(e && e.stack || e));
  } finally { busy = false; }
}

// ---------------------------------------------------------------- Gradients panel (.grd)
const grdOf = (list) => encodeGrd(list.map((g) => ({ name: g.name, stops: Core.stopsOf(g) })), C.hexRgb);
const safeName = (s) => String(s).replace(/[\\/:*?"<>|]/g, "-");
async function gradientPresetCount() {
  try {
    const r = await batchPlay([{ _obj: "get", _target: [{ _property: "presetManager" }, { _ref: "application", _enum: "ordinal", _value: "targetEnum" }] }], {});
    const pm = (r[0] && r[0].presetManager) || [];
    const e = pm.find((x) => /gradient/i.test(String(x._obj)));
    return e && e.name ? e.name.length : -1;
  } catch (e) { return -1; }
}
// Writes the list as "MS Gradients · <title>.grd" and loads it into Window › Gradients (as a group of that
// name). Two ways to load, the second only if the first added nothing; the status names what happened.
let lastPanelNote = "";
async function addToPanel(list, title) {
  if (!list.length) { setStatus("Nothing to add – the list is empty.", true); return false; }
  const folder = await lfs.getDataFolder();
  const file = await folder.createFile(safeName("MS Gradients · " + title) + ".grd", { overwrite: true });
  await file.write(grdOf(list).buffer, { format: require("uxp").storage.formats.binary });
  const token = lfs.createSessionToken(file);
  const before = await gradientPresetCount();
  const tries = [
    ["load", { _obj: "set", _target: [{ _ref: "property", _property: "gradientClassEvent" }, { _ref: "application", _enum: "ordinal", _value: "targetEnum" }], to: { _path: token, _kind: "local" }, append: true }],
    ["open", { _obj: "open", null: { _path: token, _kind: "local" } }],
  ];
  const notes = [];
  let after = before;
  for (const [how, cmd] of tries) {
    try {
      await core.executeAsModal(async () => {
        const r = await batchPlay([cmd], {});
        if (r && r[0] && r[0]._obj === "error") throw new Error(r[0].message || "error " + r[0].result);
      }, { commandName: HIST + " · Gradients panel" });
      after = await gradientPresetCount();
      notes.push(how + ": " + (after >= 0 && before >= 0 ? "+" + (after - before) : "done"));
      if (before < 0 || after > before) break;
    } catch (e) { notes.push(how + ": " + (e && e.message || e)); }
  }
  log("addToPanel", { title, n: list.length, before, after, notes });
  lastPanelNote = `before ${before}, after ${after}; ${notes.join("; ")}`;
  const added = before >= 0 && after >= 0 ? after - before : null;
  const ok = added === list.length;
  if (ok) setStatus(`Added ${list.length} gradients to Window › Gradients (group "MS Gradients · ${title}").`);
  else if (added === null) setStatus(`Sent ${list.length} gradients to Window › Gradients – please check the group "MS Gradients · ${title}" there. (${notes.join("; ")})`);
  else setStatus(`Photoshop added ${added} of ${list.length} gradients. (${notes.join("; ")}) – Export .grd… and Window › Gradients › Import still works.`, true);
  return ok;
}
async function exportGrd() {
  const list = currentList();
  if (!list.length) { setStatus("Nothing to export – the list is empty.", true); return; }
  const file = await lfs.getFileForSaving(safeName("MS Gradients · " + catTitle(S.cat)) + ".grd", { types: ["grd"] });
  if (!file) return;
  await file.write(grdOf(list).buffer, { format: require("uxp").storage.formats.binary });
  setStatus(`Saved ${list.length} gradients. Import them via Window › Gradients › menu › Import Gradients…`);
}

// ---------------------------------------------------------------- self-test
async function selfTest() {
  if (busy) return;
  const results = [], t0 = Date.now();
  const check = async (name, fn) => {
    try { const r = await fn(); results.push({ name, ok: !!(r && r.ok), r }); }
    catch (e) { results.push({ name, ok: false, r: String(e && e.stack || e) }); }
    setStatus(`Self-test: ${results.length} – ${name}`);
  };
  const saved = JSON.parse(JSON.stringify(S));
  let doc = null;
  const layerInfo = async () => {
    const r = await batchPlay([{ _obj: "get", _target: TARGET }], {});
    const L = r[0] || {}, adj = (L.adjustment && L.adjustment[0]) || {};
    return { name: L.name, kind: String(doc.activeLayers[0].kind), grad: adj.gradient, adjObj: adj._obj, angle: adj.angle && adj.angle._value, type: adj.type && adj.type._value, method: adj.gradientsInterpolationMethod && adj.gradientsInterpolationMethod._value };
  };
  const sameStops = (grad, stops) => !!grad && grad.colors.length === stops.length && grad.colors.every((c, i) => {
    const e = C.hexRgb(stops[i].hex);
    return Math.abs(c.color.red - e[0]) < 1.5 && Math.abs(c.color.grain - e[1]) < 1.5 && Math.abs(c.color.blue - e[2]) < 1.5 && Math.abs(c.location - Math.round(stops[i].pos / 100 * 4096)) <= 1;
  });
  try {
    await core.executeAsModal(async () => {
      doc = await app.documents.add({ width: 800, height: 400, resolution: 72, mode: "RGBColorMode", fill: "white", name: "MS Gradients Self-test" });
    }, { commandName: HIST + " self-test" });
    const g1 = Core.BY_KEY["sunset/Coral Dusk"] || Core.ALL[0], g2 = Core.BY_KEY["metals/Gold Bar"] || Core.ALL[1], g3 = Core.BY_KEY["fades/Black Fade"] || Core.ALL[2];
    Object.assign(S, { as: "fill", style: "linear", angle: 90, reverse: false, replace: true });

    await check("Fill layer: created with the exact stops", async () => {
      await apply(g1); const i = await layerInfo();
      return { ok: i.kind === "gradientFill" && sameStops(i.grad, Core.stopsOf(g1)) && i.name === Core.layerName(g1, "fill"), i };
    });
    await check("Fill layer: perceptual blending, angle and style set", async () => {
      const i = await layerInfo(); return { ok: i.method === "perceptual" && Math.round(i.angle) === 90 && i.type === "linear", i };
    });
    await check("Click on another gradient swaps the selected layer (no new layer)", async () => {
      const n = doc.layers.length; await apply(g2); const i = await layerInfo();
      return { ok: doc.layers.length === n && sameStops(i.grad, Core.stopsOf(g2)) && i.name === Core.layerName(g2, "fill"), n, after: doc.layers.length };
    });
    await check("Swap off: a click adds a new layer", async () => {
      S.replace = false; const n = doc.layers.length; await apply(g1); S.replace = true;
      return { ok: doc.layers.length === n + 1, n, after: doc.layers.length };
    });
    await check("Reverse + radial style", async () => {
      S.replace = false; S.reverse = true; S.style = "radial"; await apply(g1); S.reverse = false; S.style = "linear"; S.replace = true;
      const i = await layerInfo(); return { ok: sameStops(i.grad, C.reverse(Core.stopsOf(g1))) && i.type === "radial", i };
    });
    await check("Transparency stops survive", async () => {
      S.replace = false; await apply(g3); S.replace = true;
      const i = await layerInfo(), tr = i.grad && i.grad.transparency;
      return { ok: !!tr && tr.length === 2 && Math.round(tr[0].opacity._value) === 100 && Math.round(tr[1].opacity._value) === 0, tr };
    });
    await check("Gradient Map: adjustment layer, dark → light", async () => {
      S.as = "map"; S.replace = false; await apply(g2); S.replace = true;
      const i = await layerInfo(), st = Core.stopsFor(g2, { as: "map" });
      return { ok: i.kind === "gradientMap" && sameStops(i.grad, st) && C.lightness(st[0].hex) <= C.lightness(st[st.length - 1].hex), i };
    });
    await check("Gradient Map: swap keeps one layer", async () => {
      const n = doc.layers.length; await apply(g1); const i = await layerInfo(); S.as = "fill";
      return { ok: doc.layers.length === n && i.kind === "gradientMap" && sameStops(i.grad, Core.stopsFor(g1, { as: "map" })), n };
    });
    await check("One history step per click", async () => {
      const r = await batchPlay([{ _obj: "get", _target: [{ _property: "historyStates" }, { _ref: "document", _id: doc.id }] }], {}).catch(() => null);
      const hs = r && r[0] && r[0].historyStates;
      return { ok: true, note: "manual check: History shows one entry per gradient", count: hs ? hs.length : null };
    });
    await check("Add a list to the Gradients panel (.grd import)", async () => {
      const list = Core.ALL.filter((g) => g.cat === "metals");
      const before = await gradientPresetCount();
      const ok = await addToPanel(list, "Self-test");
      const after = await gradientPresetCount();
      return { ok: ok && before >= 0 && after - before === list.length, before, after, n: list.length };
    });
    await check("Library: every gradient has valid stops", async () => {
      const bad = Core.ALL.filter((g) => { const st = Core.stopsOf(g); return st.length < 2 || st[0].pos < 0 || st[st.length - 1].pos > 100 || st.some((x, i) => i && x.pos < st[i - 1].pos); }).map((g) => g.key);
      return { ok: !bad.length, n: Core.ALL.length, bad: bad.slice(0, 5) };
    });
  } catch (e) {
    results.push({ name: "Self-test setup", ok: false, r: String(e && e.stack || e) });
  }
  Object.assign(S, saved); save(); renderOptions(); renderCats(); renderGrid();
  const bad = results.filter((r) => !r.ok);
  log("SELFTEST", { secs: Math.round((Date.now() - t0) / 1000), results });
  setStatus(`Self-test: ${results.length - bad.length} / ${results.length} ok` + (bad.length ? " – failed: " + bad.map((b) => b.name).join("; ") + (bad.some((b) => /Gradients panel/.test(b.name)) ? " [" + lastPanelNote + "]" : "") : ". The test document stays open, close it without saving."), bad.length > 0);
}

// ---------------------------------------------------------------- wiring
// the element (or its parent) inside the browser that carries attribute a
function hit(el, a) { while (el && el.id !== "grid") { if (el.getAttribute && el.getAttribute(a) !== null) return el; el = el.parentNode; } return null; }
function closeMenus(except) {
  if (except !== "cat") { $("catMenu").className = "menu hidden"; $("catBtn").className = "menu-btn grow"; }
  if (except !== "tools") { $("toolsMenu").className = "menu tools hidden"; $("toolsBtn").className = "ibtn more-btn"; }
}
function init() {
  if (!validCat(S.cat)) S.cat = "all";
  // browser
  const grid = $("grid");
  grid.addEventListener("click", (e) => {
    const st = hit(e.target, "data-star");
    if (st) { e.stopPropagation(); toggleFav(Core.BY_KEY[st.getAttribute("data-star")]); return; }
    const sw = hit(e.target, "data-k");
    if (sw) apply(Core.BY_KEY[sw.getAttribute("data-k")]);
  });
  grid.addEventListener("mouseover", (e) => { const sw = hit(e.target, "data-k"); if (sw) showInfo(Core.BY_KEY[sw.getAttribute("data-k")]); });
  grid.addEventListener("mouseleave", restInfo);
  $("scroller").addEventListener("scroll", fillUp);
  // search
  let st = null;
  $("search").addEventListener("input", () => {
    clearTimeout(st);
    st = setTimeout(() => { query = String($("search").value).trim(); $("clearSearch").className = query ? "ibtn" : "ibtn hidden"; renderGrid(); }, 150);
  });
  $("clearSearch").addEventListener("click", () => { $("search").value = ""; query = ""; $("clearSearch").className = "ibtn hidden"; renderGrid(); });
  // category menu and tools menu
  $("catBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    const open = $("catMenu").className.indexOf("hidden") >= 0;
    closeMenus(open ? "cat" : null);
    if (open) { $("catMenu").className = "menu"; $("catBtn").className = "menu-btn grow on"; }
  });
  $("catMenu").addEventListener("click", (e) => {
    e.stopPropagation();
    let el = e.target;
    while (el && el !== $("catMenu") && !(el.getAttribute && el.getAttribute("data-cat"))) el = el.parentNode;
    if (!el || el === $("catMenu")) return;
    S.cat = el.getAttribute("data-cat"); save(); closeMenus(); renderGrid();
  });
  $("toolsBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    const open = $("toolsMenu").className.indexOf("hidden") >= 0;
    closeMenus(open ? "tools" : null);
    if (open) { $("toolsMenu").className = "menu tools"; $("toolsBtn").className = "ibtn more-btn on"; }
  });
  document.addEventListener("click", () => closeMenus());
  const tool = (id, fn) => $(id).addEventListener("click", (e) => { e.stopPropagation(); closeMenus(); fn(); });
  tool("toPanelCat", () => addToPanel(currentList(), query ? "Search " + query : catTitle(S.cat)).catch((e) => setStatus("Could not add: " + (e.message || e), true)));
  tool("toPanelFav", () => addToPanel(listFor("fav"), "Favourites").catch((e) => setStatus("Could not add: " + (e.message || e), true)));
  tool("exportGrd", () => exportGrd().catch((e) => setStatus("Could not export: " + (e.message || e), true)));
  tool("selfTest", selfTest);
  // view
  document.querySelectorAll(".view-btn").forEach((b) => b.addEventListener("click", () => { S.view = b.getAttribute("data-v"); save(); renderOptions(); renderGrid(); }));
  // options bar
  $("asSeg").querySelectorAll(".seg-btn").forEach((b) => b.addEventListener("click", () => { S.as = b.getAttribute("data-v"); save(); renderOptions(); }));
  UI.seg($("styleSeg"), Core.STYLES, (v) => { S.style = v; save(); renderOptions(); });
  $("reverseTog").addEventListener("click", () => { S.reverse = !S.reverse; save(); renderOptions(); });
  $("replaceTog").addEventListener("click", () => { S.replace = !S.replace; save(); renderOptions(); });
  $("infoStar").addEventListener("click", () => { if (infoG) toggleFav(infoG); });
  $("angle").addEventListener("change", () => { const v = parseFloat($("angle").value); S.angle = isFinite(v) ? clampAngle(v) : S.angle; save(); renderOptions(); });
  // drag the word "Angle" left or right to change the angle (Shift: steps of 15°)
  let scrub = null;
  $("angleLbl").addEventListener("mousedown", (e) => { scrub = { x: e.clientX, a: S.angle }; e.preventDefault(); });
  document.addEventListener("mousemove", (e) => {
    if (!scrub) return;
    let v = scrub.a + (e.clientX - scrub.x);
    if (e.shiftKey) v = Math.round(v / 15) * 15;
    S.angle = clampAngle(v); $("angle").value = String(S.angle);
  });
  document.addEventListener("mouseup", () => { if (scrub) { scrub = null; save(); } });
  renderOptions(); renderGrid();
  restInfo();
}
init();
