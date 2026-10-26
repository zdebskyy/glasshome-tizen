"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const app = path.join(root, "app");
const required = [
  "app/index.html",
  "app/style.css",
  "app/app.js",
  "README.md",
  "THIRD_PARTY_NOTICES.md",
  "docs/RECOVERY.md",
  "docs/STATUS.md",
  "docs/DESIGN-REFERENCES.md",
  "docs/images/home.png",
  "docs/images/apps.png",
  "docs/images/settings.png",
];
for (const name of required) {
  if (!fs.statSync(path.join(root, name)).isFile())
    throw new Error("Missing file: " + name);
}
const js = fs.readFileSync(path.join(app, "app.js"), "utf8");
new vm.Script(js, { filename: "app/app.js" });
const refs = new Set();
const html = fs.readFileSync(path.join(app, "index.html"), "utf8");
for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
  if (!/^(?:https?:|data:|#)/.test(match[1]))
    refs.add(match[1].split(/[?#]/)[0]);
}
const css = fs.readFileSync(path.join(app, "style.css"), "utf8");
for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g))
  refs.add(match[1]);
for (const match of js.matchAll(/assets\/[a-zA-Z0-9_./-]+/g))
  refs.add(match[0]);
for (const name of refs) {
  const file = path.resolve(app, name);
  if (!file.startsWith(app + path.sep) || !fs.statSync(file).isFile())
    throw new Error("Invalid or missing asset: " + name);
}
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
for (const match of readme.matchAll(/\]\(([^)]+)\)/g)) {
  if (/^(?:https?:|#)/.test(match[1])) continue;
  if (!fs.existsSync(path.resolve(root, match[1].split("#")[0])))
    throw new Error("Broken README link: " + match[1]);
}
console.log(
  "Runtime syntax, required files, README links and " +
    refs.size +
    " local asset references verified.",
);
console.log(
  "This is a source check, not an ES5 conformance or TV compatibility test.",
);
