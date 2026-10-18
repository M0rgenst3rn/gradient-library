// Creates the plugin icons: three stacked gradient bars fading out to the right.
const fs = require("fs"), path = require("path");
const { encodePNG } = require("./png.js");
const dir = path.join(__dirname, "..", "gradients", "icons");
fs.mkdirSync(dir, { recursive: true });
function icon(size, file) {
  const rgba = new Uint8Array(size * size * 4), pad = size * 0.12, bar = (size - 2 * pad) / 3.4, gap = bar * 0.2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    rgba[i] = rgba[i + 1] = rgba[i + 2] = 225;
    let a = 0;
    for (let k = 0; k < 3; k++) {
      const y0 = pad + k * (bar + gap), inY = Math.max(0, Math.min(1, Math.min(y + 1 - y0, y0 + bar - y)));
      const inX = Math.max(0, Math.min(1, Math.min(x + 1 - pad, size - pad - x)));
      const t = (x - pad) / (size - 2 * pad);
      a = Math.max(a, inY * inX * (1 - t * (0.55 + 0.15 * k)));
    }
    rgba[i + 3] = Math.round(Math.max(0, a) * 255);
  }
  fs.writeFileSync(path.join(dir, file), encodePNG(size, size, rgba, 4));
}
icon(23, "icon@1x.png"); icon(46, "icon@2x.png"); icon(48, "plugin@1x.png"); icon(96, "plugin@2x.png");
console.log("icons written:", fs.readdirSync(dir).join(", "));
