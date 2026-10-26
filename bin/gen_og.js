#!/usr/bin/env node
/* Social preview cards (1200x630) for Open Graph / Twitter.
 * Usage (from the repository root):  node bin/gen_og.js
 * Requires Playwright (npm i -D playwright && npx playwright install chromium).
 * Output: assets/img/og/<name>.png — referenced by `og_image` in _config.yml and in page front matter.
 */
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "..");
const f = (p) => "file://" + path.join(ROOT, p);

// ---- data from the repository ------------------------------------------------
const bib = fs.readFileSync(path.join(ROOT, "_bibliography/papers.bib"), "utf8");
const nPubs = (bib.match(/^\s*@(\w+)\s*\{/gm) || []).filter(s => !/@(string|comment|preamble)/i.test(s)).length;
const team = fs.readdirSync(path.join(ROOT, "_team")).map(n => fs.readFileSync(path.join(ROOT, "_team", n), "utf8"));
const cat = t => (t.match(/^category:\s*(.*)$/m) || [])[1] || "";
const nTeam = team.filter(t => cat(t) !== "Alumni").length;
const nAlumni = team.filter(t => cat(t) === "Alumni").length;
const order = ["Senior Researchers", "Assistant Professors", "Postdoctoral Researchers", "PhD Students"];
const imp = t => parseFloat((t.match(/^importance:\s*(.*)$/m) || [])[1] || 99);
const photos = order.flatMap(c => team.filter(t => cat(t) === c && /^img:/m.test(t)).sort((a, b) => imp(a) - imp(b)))
  .map(t => t.match(/^img:\s*(.*)$/m)[1].trim());
const net = fs.readFileSync(path.join(ROOT, "_includes/net.html"), "utf8").replace("{{ include.class }}", "");

// ---- shared template -----------------------------------------------------------
const css = `
@font-face{font-family:Fraunces;src:url(${f("assets/fonts/fraunces-latin-full-normal.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Fraunces;font-style:italic;src:url(${f("assets/fonts/fraunces-latin-full-italic.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Inter;src:url(${f("assets/fonts/inter-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:JBM;src:url(${f("assets/fonts/jetbrains-mono-latin-500-normal.woff2")}) format("woff2")}
*{box-sizing:border-box}html,body{margin:0}
body{width:1200px;height:630px;overflow:hidden;position:relative;font-family:Inter,sans-serif;color:#eef1f6;
 background:radial-gradient(60% 80% at 100% 0%,rgba(31,79,209,.32),transparent 60%),radial-gradient(50% 70% at 85% 100%,rgba(166,36,166,.22),transparent 60%),radial-gradient(40% 60% at 0% 100%,rgba(47,133,134,.18),transparent 60%),#0e1a2b}
.bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#1f4fd1,#2f8586,#a624a6,#9a7a1e)}
.net{position:absolute;right:-90px;top:-60px;width:620px;color:rgba(255,255,255,.13);opacity:.8}
.net .net-edge{stroke:currentColor;stroke-width:1.1;fill:none}.net .net-node{fill:#0e1a2b;stroke:currentColor;stroke-width:1.3}
.net .net-node--a{fill:#6f9bff;stroke:none}.net .net-node--b{fill:#5cc2c3;stroke:none}.net .net-node--c{fill:#e27be2;stroke:none}.net .net-node--d{fill:#d9b452;stroke:none}.net .net-hyper{fill:rgba(111,155,255,.12)}
.copy{position:absolute;left:80px;top:72px;width:640px}
.eyebrow{font-family:JBM,monospace;font-size:19px;letter-spacing:.16em;text-transform:uppercase;color:#8d9ab0;display:flex;align-items:center;gap:14px}
.eyebrow:before{content:"";width:28px;height:1.5px;background:currentColor}
h1{font-family:Fraunces,serif;font-weight:400;letter-spacing:-.02em;color:#fff;margin:24px 0 20px;font-size:84px;line-height:1.02}
h1 em{font-style:italic}.b{color:#7aa2ff}.t{color:#5cc2c3}.m{color:#e27be2}
p{font-size:28px;line-height:1.38;color:#b9c4d6;margin:0}
.chips{position:absolute;left:80px;bottom:62px;display:flex;gap:12px;flex-wrap:wrap;width:700px}
.chip{border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:9px 18px;font-size:19px;color:#d6deeb;display:flex;align-items:center;gap:9px}
.chip i{width:10px;height:10px;border-radius:50%;display:inline-block}
.url{position:absolute;right:80px;bottom:66px;font-family:JBM,monospace;font-size:19px;color:#8d9ab0}
.brand{position:absolute;left:80px;top:64px;display:flex;align-items:center;gap:14px;font-family:Fraunces,serif;font-size:26px;color:#fff}
.mark{width:46px;height:46px;border-radius:12px;background:#fff;color:#0e1a2b;display:grid;place-items:center;font-weight:600;font-size:21px}
.photo{position:absolute;right:110px;top:150px;width:300px;height:315px;border-radius:26px;object-fit:cover;object-position:50% 20%;box-shadow:0 30px 70px rgba(0,0,0,.55)}
.big{position:absolute;right:90px;top:170px;text-align:right}
.big b{display:block;font-family:Fraunces,serif;font-weight:400;font-size:150px;line-height:1;color:#fff;letter-spacing:-.03em}
.big span{font-size:24px;color:#b9c4d6}
.logos{position:absolute;right:70px;top:150px;display:grid;grid-template-columns:repeat(2,140px);gap:10px 18px}.logos img{height:180px;justify-self:center}
.thumbs{position:absolute;right:70px;top:120px;display:grid;grid-template-columns:repeat(2,200px);gap:14px}.thumbs img{width:200px;height:88px;object-fit:cover;border-radius:12px;box-shadow:0 14px 30px rgba(0,0,0,.4)}
.avatars{position:absolute;right:80px;top:120px;display:grid;grid-template-columns:repeat(4,80px);gap:10px}.avatars img{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.18);box-shadow:0 10px 24px rgba(0,0,0,.35)}
.section .copy{top:150px}.team .copy{width:560px}.section h1{font-size:96px}
`;
const pillars = `<div class="chips"><span class="chip"><i style="background:#7aa2ff"></i>Computational Social Science</span><span class="chip"><i style="background:#5cc2c3"></i>Network Science</span><span class="chip"><i style="background:#e27be2"></i>Generative AI</span><span class="chip"><i style="background:#d9b452"></i>Social Twins</span></div>`;
const brand = `<div class="brand"><span class="mark">GR</span>Giulio Rossetti</div>`;
const page = (cls, inner) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body class="${cls}"><div class="net">${net}</div>${inner}<div class="bar"></div></body></html>`;
const section = (title, text, right, chips, extra) => page("section " + (extra || ""), `${brand}<div class="copy"><div class="eyebrow">CNR-ISTI · SNA@KDD</div><h1>${title}</h1><p>${text}</p></div>${right || ""}${chips || pillars}<div class="url">giuliorossetti.github.io</div>`);

const CARDS = {
  home: page("", `<div class="copy"><div class="eyebrow">CNR-ISTI · SNA@KDD · Pisa</div>
    <h1>Giulio Rossetti</h1><p>How <em class="b">people</em>, <em class="t">information</em> and <em class="m">AI agents</em> shape each other in networked societies.</p></div>
    <img class="photo" src="${f("assets/img/prof_pic.jpg")}">${pillars}<div class="url">giuliorossetti.github.io</div>`),
  research: section("Research", "From the structure of social networks to LLM agents inhabiting digital twins of online platforms.",
    `<div class="thumbs">${["genai", "netmod", "dynamics", "debates", "wellbeing", "cognitive"].map(n => `<img src="${f(`assets/img/research/${n}.svg`)}">`).join("")}</div>`),
  publications: section("Publications", "Journal articles, conference papers, book chapters and preprints.",
    `<div class="big"><b>${nPubs}</b><span>papers, chapters &amp; preprints</span></div>`),
  software: section("Software", "Open-source libraries for network science and LLM-powered social simulation.",
    `<div class="logos">${["ysocial", "cdlib", "ndlib", "dynetx"].map(n => `<img src="${f(`assets/img/software/${n}.png`)}">`).join("")}</div>`,
    `<div class="chips"><span class="chip">YSocial</span><span class="chip">ySights</span><span class="chip">CDlib</span><span class="chip">NDlib</span><span class="chip">DyNetX</span></div>`),
  team: section("Team", `The Social Network Analysis team at the KDD Lab: ${nTeam} researchers, ${nAlumni} alumni.`,
    `<div class="avatars">${photos.map(p => `<img src="${f(p)}">`).join("")}</div>`, null, "team"),
  teaching: section("Teaching", "Network science and programming courses at the University of Pisa, PhD schools and outreach.",
    `<div class="thumbs">${["alns", "sna", "epidemics", "cna", "pds", "intro-programming"].map(n => `<img src="${f(`assets/img/teaching/${n}.svg`)}">`).join("")}</div>`,
    `<div class="chips"><span class="chip"><i style="background:#7aa2ff"></i>MSc</span><span class="chip"><i style="background:#e27be2"></i>PhD</span><span class="chip"><i style="background:#5cc2c3"></i>BSc</span><span class="chip"><i style="background:#d9b452"></i>Outreach</span></div>`),
  cv: section("Curriculum Vitae", "Senior Researcher at CNR-ISTI, External Professor of Network Science at the University of Pisa.",
    `<img class="photo" src="${f("assets/img/prof_pic.jpg")}">`),
};

(async () => {
  const out = path.join(ROOT, "assets/img/og");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const [name, html] of Object.entries(CARDS)) {
    // load from a file:// URL so that local fonts and images resolve
    const tmp = path.join(ROOT, `.og-${name}.html`);
    fs.writeFileSync(tmp, html);
    await pg.goto("file://" + tmp, { waitUntil: "load" });
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(2600); // let the SVG illustrations reach a populated frame
    fs.unlinkSync(tmp);
    await pg.screenshot({ path: path.join(out, name + ".png") });
    console.log("assets/img/og/" + name + ".png");
  }
  await browser.close();
})();
