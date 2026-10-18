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
const TILE_H = 30, PAGE = 60;

// ---------------------------------------------------------------- state (remembered by the panel)
const DEFAULTS = { as: "fill", style: "linear", angle: 90, reverse: false, replace: true, cat: "all", favs: [], recent: [] };
let S = load();
let query = "", shown = PAGE, busy = false, lastKey = null;
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
// the group the current choice belongs to (a group itself or one of its categories)
function activeGroup() { return S.cat.indexOf("g:") === 0 ? S.cat.slice(2) : Core.CAT[S.cat] ? Core.CAT[S.cat].group : null; }

// thumbnail: one row of the category's sprite, shown through a 30 px window
function thumb(g) {
  const c = Core.CAT[g.cat];
  return `<img src="thumbs/${g.cat}.png" style="top:${-g.row * TILE_H}px;height:${c.count * TILE_H}px">`;
}

// ---------------------------------------------------------------- rendering
// two levels: All / Favourites / Recent / the six groups – then the categories of the chosen group
function renderCats() {
  if (S.cat !== "all" && S.cat !== "fav" && S.cat !== "recent" && !activeGroup()) S.cat = "all";
  const grp = activeGroup();
  const chip = (id, name, n, on) => `<div class="chip${on ? " active" : ""}" data-cat="${UI.esc(id)}">${UI.esc(name)}<span class="n">${n}</span></div>`;
  let html = `<div class="chips">${chip("all", "All", Core.ALL.length, S.cat === "all")}${chip("fav", "★ Favourites", S.favs.length, S.cat === "fav")}${chip("recent", "Recent", S.recent.length, S.cat === "recent")}` +
    GROUPS.map((gr) => chip("g:" + gr.name, gr.name, gr.n, grp === gr.name)).join("") + `</div>`;
  if (grp) {
    const gr = GROUPS.find((x) => x.name === grp);
    html += `<div class="sub-chips">${chip("g:" + grp, "All " + grp, gr.n, S.cat === "g:" + grp)}${gr.cats.map((c) => chip(c.id, c.name, c.count, S.cat === c.id)).join("")}</div>`;
  }
  $("catList").innerHTML = html;
  $("catList").querySelectorAll(".chip").forEach((el) => el.addEventListener("click", () => { S.cat = el.getAttribute("data-cat"); shown = PAGE; save(); renderCats(); renderGrid(); }));
  $("catMeta").textContent = GROUPS.length + " groups · " + Core.CATS.length + " categories";
}
function renderGrid() {
  const list = currentList(), favs = new Set(S.favs);
  $("gridTitle").textContent = query ? `Search: ${query}` : catTitle(S.cat);
  $("gridMeta").textContent = list.length + (list.length === 1 ? " gradient" : " gradients") + (query && S.cat !== "all" ? " in " + catTitle(S.cat) : "");
  const page = list.slice(0, shown);
  $("grid").innerHTML = page.length ? page.map((g) =>
    `<div class="gtile${g.key === lastKey ? " active" : ""}" data-k="${UI.esc(g.key)}" title="${UI.esc(g.name + " · " + Core.CAT[g.cat].name)}">` +
    `<div class="gthumb">${thumb(g)}</div>` +
    `<div class="gname"><span class="lbl">${UI.esc(g.name)}</span><span class="star${favs.has(g.key) ? " on" : ""}" title="Favourite">${favs.has(g.key) ? "★" : "☆"}</span></div></div>`).join("")
    : `<div class="empty">${S.cat === "fav" && !query ? "No favourites yet – star a gradient with ☆." : S.cat === "recent" && !query ? "Nothing applied yet." : "No gradient matches."}</div>`;
  $("grid").querySelectorAll(".gtile").forEach((el) => {
    const g = Core.BY_KEY[el.getAttribute("data-k")];
    el.addEventListener("click", () => apply(g));
    el.querySelector(".star").addEventListener("click", (e) => { e.stopPropagation(); toggleFav(g); });
  });
  $("more").className = list.length > shown ? "btn small ghost more" : "btn small ghost more hidden";
  $("more").textContent = `Show more (${list.length - shown} left)`;
  $("countInfo").textContent = Core.ALL.length + " gradients";
}
function renderCurrent(g) {
  const img = $("currentImg");
  if (!g) { img.className = "hidden"; return; }
  img.src = `thumbs/${g.cat}.png`;
  img.style.top = (-g.row * TILE_H) + "px"; img.style.height = (Core.CAT[g.cat].count * TILE_H) + "px"; img.style.width = "112px";
  img.className = "";
  $("currentName").textContent = g.name;
  $("currentCat").textContent = Core.CAT[g.cat].name;
}
function renderOptions() {
  UI.syncSeg($("asSeg"), S.as);
  UI.syncSeg($("styleSeg"), S.style);
  UI.setSwitch("reverse", S.reverse);
  UI.setSwitch("replace", S.replace);
  const fill = S.as === "fill";
  $("styleRow").className = fill ? "field" : "field hidden";
  $("angleBox").className = fill ? "" : "hidden";
}
function toggleFav(g) {
  const i = S.favs.indexOf(g.key);
  if (i >= 0) S.favs.splice(i, 1); else S.favs.unshift(g.key);
  save(); renderCats(); renderGrid();
}

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
    renderCurrent(g); renderCats(); renderGrid();
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
function init() {
  UI.seg($("styleSeg"), Core.STYLES, (v) => { S.style = v; save(); renderOptions(); });
  $("asSeg").querySelectorAll(".seg-btn").forEach((b) => b.addEventListener("click", () => { S.as = b.getAttribute("data-v"); save(); renderOptions(); }));
  UI.slider($("angleBox"), { label: "Angle", min: -180, max: 180, step: 1, unit: "°", def: 90 }, { get: () => S.angle, set: (v) => { S.angle = v; }, done: save });
  UI.bindSwitch("reverse", (on) => { S.reverse = on; save(); });
  UI.bindSwitch("replace", (on) => { S.replace = on; save(); });
  let st = null;
  $("search").addEventListener("input", () => {
    clearTimeout(st);
    st = setTimeout(() => { query = String($("search").value).trim(); shown = PAGE; $("clearSearch").className = query ? "btn small ghost" : "btn small ghost hidden"; renderGrid(); }, 150);
  });
  $("clearSearch").addEventListener("click", () => { $("search").value = ""; query = ""; shown = PAGE; $("clearSearch").className = "btn small ghost hidden"; renderGrid(); });
  $("more").addEventListener("click", () => { shown += PAGE; renderGrid(); });
  $("toPanelCat").addEventListener("click", () => addToPanel(currentList(), query ? "Search " + query : catTitle(S.cat)).catch((e) => setStatus("Could not add: " + (e.message || e), true)));
  $("toPanelFav").addEventListener("click", () => addToPanel(listFor("fav"), "Favourites").catch((e) => setStatus("Could not add: " + (e.message || e), true)));
  $("exportGrd").addEventListener("click", () => exportGrd().catch((e) => setStatus("Could not export: " + (e.message || e), true)));
  $("selfTest").addEventListener("click", selfTest);
  UI.sections("msgradients.sections", { cats: true, grid: true, panel: false });
  renderOptions(); renderCats(); renderGrid();
  const last = S.recent[0] && Core.BY_KEY[S.recent[0]];
  if (last) renderCurrent(last);
}
init();
