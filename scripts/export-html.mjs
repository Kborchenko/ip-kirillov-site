import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse, serialize } from "parse5";
import { documents } from "../src/components/legalDocuments.js";

const build = path.resolve("dist");
const routes = ["/", "/about/", "/employers/", ...documents.map(doc => "/" + doc.slug + "/")];
const origin = "https://offline.invalid";
const name = "ИП Кириллов Сергей Евгеньевич — картотека.html";
const stylesheets = new Set();
const assignedIds = new Set();
const dataUrls = new Map();
const types = { ".woff2": "font/woff2", ".svg": "image/svg+xml", ".webp": "image/webp" };

function elements(root) {
  return [root, ...(root.childNodes ?? []).flatMap(elements)].filter(node => node.tagName);
}
function attr(node, key) {
  return node.attrs.find(attribute => attribute.name === key);
}
function encodeAsset(url) {
  if (dataUrls.has(url)) return dataUrls.get(url);
  const type = types[path.extname(url)];
  if (!type || !url.startsWith("/") || url.includes("..")) throw Error("Unknown asset " + url);
  const value = "data:" + type + ";base64," + readFileSync(build + url).toString("base64");
  dataUrls.set(url, value);
  return value;
}
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

const pages = new Map();
for (const route of routes) {
  const document = parse(readFileSync(path.join(build, route, "index.html"), "utf8"));
  const nodes = elements(document);
  const title = nodes.find(node => node.tagName === "title").childNodes[0].value;
  const body = nodes.find(node => node.tagName === "body");
  const pageId = "page-" + (route.split("/")[1] || "home");
  const ids = new Map();
  for (const node of elements(body)) {
    const id = attr(node, "id");
    if (!id) continue;
    if (ids.has(id.value)) throw Error("Duplicate id in " + route + ": " + id.value);
    const unique = assignedIds.has(id.value) ? pageId + "-" + id.value : id.value;
    ids.set(id.value, unique);
    assignedIds.add(unique);
    id.value = unique;
  }
  for (const node of nodes.filter(node => node.tagName === "link" && attr(node, "rel")?.value === "stylesheet")) {
    stylesheets.add(attr(node, "href").value);
  }
  pages.set(route, { route, pageId, title, body, ids });
}

for (const page of pages.values()) {
  for (const node of elements(page.body)) {
    // The public pages use native links and disclosures. The file's shared script handles menu focus.
    if (node.tagName === "script") {
      node.parentNode.childNodes = node.parentNode.childNodes.filter(child => child !== node);
      continue;
    }
    if (node.tagName === "img") attr(node, "src").value = encodeAsset(attr(node, "src").value);
    for (const key of ["aria-labelledby", "aria-describedby", "aria-controls", "for"]) {
      const ref = attr(node, key);
      if (ref) ref.value = ref.value.split(/\s+/).map(id => page.ids.get(id) ?? id).join(" ");
    }
    const href = node.tagName === "a" && attr(node, "href");
    if (!href) continue;
    const url = new URL(href.value, origin + page.route);
    if (url.origin !== origin) continue;
    const target = pages.get(url.pathname);
    const id = url.hash ? target?.ids.get(decodeURIComponent(url.hash.slice(1))) : target?.pageId;
    if (!id) throw Error("Unresolved internal link " + href.value + " in " + page.route);
    href.value = "#" + id;
  }
}

const css = [...stylesheets].map(url => readFileSync(build + url, "utf8")
  .replace(/url\((["']?)(\/[^)"']+)\1\)/g, (_, quote, asset) => "url(" + encodeAsset(asset) + ")")).join("\n");
const sections = [...pages.values()].map(page =>
  '<div class="file-page" id="' + page.pageId + '" data-title="' + escapeHtml(page.title) + '">' +
  serialize(page.body) + '</div>').join("\n");
const licenses = ["brygada1918", "onest"].map(font =>
  readFileSync(path.join(build, "fonts", "LICENSE-" + font + ".txt"), "utf8")).join("\n\n");
const mailScript = readFileSync(new URL("../src/scripts/mail-enquiry.js", import.meta.url), "utf8");
const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(pages.get("/").title)}</title><style>${css}
@supports selector(:has(:target)) {
  .file-page { display: none; }
  #page-home, .file-page:target, .file-page:has(:target) { display: block; }
  body:has(.file-page:not(#page-home):target,.file-page:not(#page-home) :target) #page-home { display: none; }
  .file-page:target { scroll-margin: 0; }
}
</style></head><body>${sections}
<script>
${mailScript}
function updateTitle() {
  const page = document.querySelector(":target")?.closest(".file-page") ?? document.getElementById("page-home");
  document.title = page.dataset.title;
}
updateTitle();
window.addEventListener("hashchange", updateTitle);
document.addEventListener("click", event => {
  const menu = event.target.closest(".mobile-nav");
  if (menu && event.target.closest("a")) menu.open = false;
});
document.addEventListener("keydown", event => {
  const menu = event.target.closest(".mobile-nav[open]");
  if (menu && event.key === "Escape") { menu.open = false; menu.querySelector("summary").focus(); }
});
</script><script type="text/plain" id="font-licenses">${licenses}</script></body></html>`;
writeFileSync(name, html);
console.log(name + " · " + pages.size + " pages · " + dataUrls.size + " embedded assets");
