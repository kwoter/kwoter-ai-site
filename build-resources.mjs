// Kwoter AI content engine — generates /resources/ articles + hub, on-brand,
// SEO-complete, and rebuilds the combined sitemap. Add an article to `articles`
// and run `bun build-resources.mjs` to publish.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const ORIGIN = "https://www.kwoter.ai";
const LOGO = ORIGIN + "/media/kwoter-mark.png";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---- ARTICLES (the content queue — newest first) ----
const articles = [
  {
    slug: "how-ai-is-changing-insurance-broking",
    title: "How AI Is Changing Insurance Broking in 2026",
    date: "2026-06-24",
    meta: "AI is reshaping how insurance brokerages handle calls, renewals and admin in 2026. Here's what's changing — and how brokers are using it to grow without growing headcount.",
    intro: "Insurance broking has always been a people business — but in 2026 the brokerages pulling ahead are the ones letting AI handle the repetitive work, so their people can do more of what actually wins and keeps clients.",
    body: `<h2>The pressure brokers are under</h2><p>Margins are tight, customer expectations are higher, and good staff are hard to find and expensive to keep. Most brokerages can't simply hire their way to more capacity. That's the gap AI is filling.</p>
<h2>Where AI is actually being used</h2><p>The practical wins aren't science fiction — they're the everyday tasks that eat your team's time:</p>
<ul class="check"><li><b>Answering calls</b> — every inbound call picked up, 24/7, instead of going to voicemail.</li><li><b>Following up leads</b> — fast, consistent contact so quotes don't go cold.</li><li><b>Chasing renewals</b> — proactive outreach before policies lapse.</li><li><b>Back-office admin</b> — the repetitive finance and record-keeping work.</li></ul>
<h2>Why it's a capacity play, not a cost-cut</h2><p>The brokerages getting the most from AI aren't replacing their teams — they're freeing them. When the AI handles the high-volume, repetitive tasks, advisers spend their time on advice, relationships and complex cases, which is where brokerages actually differentiate and grow.</p>
<h2>The takeaway</h2><p>In 2026, AI in broking isn't about cutting people — it's about giving a brokerage the capacity of a much larger team without the headcount. The firms treating it that way are the ones widening the gap.</p>`,
  },
  {
    slug: "brokerage-tasks-you-can-automate-with-ai",
    title: "5 Brokerage Tasks You Can Automate with AI Today",
    date: "2026-06-24",
    meta: "Not sure where AI fits in your brokerage? Here are five high-volume, repetitive tasks brokers are automating right now — and the time and revenue it frees up.",
    intro: "If you're wondering where AI realistically fits in a brokerage, start with the jobs that are high-volume, repetitive, and rules-based. Here are five your team is probably spending too long on.",
    body: `<h2>1. Answering inbound calls</h2><p>Every missed call is a potential client lost. An AI receptionist answers every call, day or night, handles routine enquiries and routes the rest — so nothing goes to voicemail.</p>
<h2>2. Following up new quotes</h2><p>Speed-to-lead wins business. Automated outbound follow-up contacts new and aged leads consistently, so opportunities don't slip while your team is busy.</p>
<h2>3. Chasing renewals</h2><p>Retention is your cheapest growth. AI reaches out ahead of every expiry and progresses the renewal, keeping more clients on the books.</p>
<h2>4. Keeping customers updated on claims</h2><p>Most claims complaints are about communication, not outcomes. AI keeps claimants proactively updated and flags issues to your handlers.</p>
<h2>5. Repetitive finance and admin</h2><p>The reconciling, chasing and record-keeping that's essential but draining can run consistently in the background, freeing staff for client work.</p>
<h2>Where to start</h2><p>Pick the task costing your team the most hours right now. Automating even one frees real capacity — and makes the case for the next.</p>`,
  },
  {
    slug: "speed-to-lead-insurance",
    title: "Speed-to-Lead: Why Fast Follow-Up Wins More Insurance Business",
    date: "2026-06-24",
    meta: "In insurance, the broker who follows up first usually wins. Here's why speed-to-lead matters so much — and how AI makes fast, consistent follow-up effortless.",
    intro: "When a prospect requests a quote, they're rarely asking just you. The broker who responds first — while interest is hot — has a big advantage. That's speed-to-lead, and most brokerages lose business on it without realising.",
    body: `<h2>Why the first responder usually wins</h2><p>Interest fades fast. A lead that's contacted within minutes is far more likely to engage than one chased hours or days later. By then they've often spoken to a competitor or moved on.</p>
<h2>Why brokerages struggle with it</h2><p>It's not for lack of effort — it's volume. When your team is on calls, in meetings or out of hours, new leads wait. Consistent, instant follow-up on every single enquiry is almost impossible to do manually at scale.</p>
<h2>How AI closes the gap</h2><p>An AI outbound caller follows up the moment a lead lands, re-engages aged quotes, and keeps working the list consistently — then hands warm, interested prospects to your advisers to close. No lead waits, and no opportunity goes cold.</p>
<h2>The takeaway</h2><p>You don't necessarily need more leads — you need to convert more of the ones you already get. Faster, more consistent follow-up is one of the highest-ROI changes a brokerage can make.</p>`,
  },
];

const STYLE = `:root{--bg:#0b0e14;--panel:#121723;--line:#222b3a;--ink:#e8edf5;--muted:#9aa7bd;--accent:#5b8cff;--accent2:#7a5bff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Arial,sans-serif;line-height:1.7;position:relative;overflow-x:hidden}
body::before{content:"";position:fixed;top:-220px;left:50%;transform:translateX(-50%);width:760px;height:760px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(122,91,255,.20),rgba(91,140,255,.09) 45%,transparent 70%);filter:blur(20px);pointer-events:none;z-index:0}
.wrap{max-width:760px;margin:0 auto;padding:0 22px;position:relative;z-index:1}a{color:var(--accent)}
header.site{border-bottom:1px solid var(--line)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:68px}
header.site img{height:30px}.cta-btn{background:linear-gradient(90deg,var(--accent),var(--accent2));color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:10px}
.crumbs{font-size:13px;color:var(--muted);padding:18px 0 0}.crumbs a{color:var(--muted);text-decoration:none}
h1{font-size:32px;line-height:1.22;margin:12px 0 8px;background:linear-gradient(90deg,#fff,#b9c6e8);-webkit-background-clip:text;background-clip:text;color:transparent}
.date{color:var(--muted);font-size:13px;margin-bottom:18px}.lead{color:var(--muted);font-size:18px;margin:0 0 24px}
h2{font-size:21px;margin:30px 0 10px}p{margin:0 0 14px}
ul.check{list-style:none;padding:0;margin:14px 0}ul.check li{padding:6px 0 6px 28px;position:relative}ul.check li::before{content:"\\2713";color:var(--accent);font-weight:700;position:absolute;left:0}
.cta{background:linear-gradient(120deg,rgba(91,140,255,.15),rgba(122,91,255,.15));border:1px solid var(--line);border-radius:16px;padding:26px 24px;text-align:center;margin:32px 0}.cta a{display:inline-block;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#fff;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:12px}
.related{border:1px solid var(--line);border-radius:14px;padding:6px 20px 16px;margin:30px 0;background:var(--panel)}.related h2{font-size:18px}.related a{display:block;padding:9px 0;text-decoration:none;color:var(--ink);border-top:1px solid var(--line);font-weight:600}
.list a{display:block;border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin:12px 0;text-decoration:none;background:var(--panel)}.list a:hover{border-color:var(--accent)}.list h3{margin:0 0 5px;color:var(--ink)}.list p{margin:0;color:var(--muted);font-size:14px}
footer.site{border-top:1px solid var(--line);margin-top:44px;padding:26px 0;color:var(--muted);font-size:13px}
@media(max-width:600px){h1{font-size:26px}}`;
const header = `<header class="site"><div class="wrap"><a href="${ORIGIN}/"><img src="${LOGO}" alt="Kwoter AI" /></a><a class="cta-btn" href="${ORIGIN}/">Book a demo</a></div></header>`;
const footer = `<footer class="site"><div class="wrap">Kwoter AI — your AI workforce for insurance. &copy; 2026 Kwoter.</div></footer>`;

function related(cur){
  const o=articles.filter(a=>a.slug!==cur).slice(0,3);
  if(!o.length) return "";
  return `<nav class="related"><h2>More from Kwoter</h2>${o.map(a=>`<a href="${ORIGIN}/resources/${a.slug}/">${esc(a.title)} &rsaquo;</a>`).join("")}</nav>`;
}
function articleHtml(a){
  const url=`${ORIGIN}/resources/${a.slug}/`;
  const schema=JSON.stringify({"@context":"https://schema.org","@graph":[
    {"@type":"Organization","@id":ORIGIN+"/#org","name":"Kwoter AI","url":ORIGIN+"/","logo":LOGO},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":ORIGIN+"/"},{"@type":"ListItem","position":2,"name":"Resources","item":ORIGIN+"/resources/"},{"@type":"ListItem","position":3,"name":a.title,"item":url}]},
    {"@type":"Article","headline":a.title,"description":a.meta,"image":LOGO,"datePublished":a.date,"dateModified":a.date,"author":{"@type":"Organization","name":"Kwoter AI"},"publisher":{"@id":ORIGIN+"/#org"},"mainEntityOfPage":url}
  ]});
  return `<!DOCTYPE html>
<html lang="en-GB"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(a.title)} | Kwoter AI</title>
<meta name="description" content="${esc(a.meta)}" />
<link rel="canonical" href="${url}" /><meta name="robots" content="index, follow, max-image-preview:large" />
<meta property="og:type" content="article" /><meta property="og:title" content="${esc(a.title)}" />
<meta property="og:description" content="${esc(a.meta)}" /><meta property="og:url" content="${url}" />
<meta property="og:image" content="${LOGO}" /><meta property="og:site_name" content="Kwoter AI" />
<meta name="twitter:card" content="summary_large_image" />
<script type="application/ld+json">${schema}</script><style>${STYLE}</style></head><body>
${header}
<main class="wrap">
<nav class="crumbs"><a href="${ORIGIN}/">Home</a> &rsaquo; <a href="${ORIGIN}/resources/">Resources</a> &rsaquo; Article</nav>
<h1>${esc(a.title)}</h1>
<div class="date">Published ${new Date(a.date+"T00:00:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
<p class="lead">${esc(a.intro)}</p>
${a.body}
<div class="cta"><p>See how Kwoter AI's workforce fits your brokerage.</p><a href="${ORIGIN}/">Book a demo &rarr;</a></div>
${related(a.slug)}
</main>${footer}</body></html>`;
}
function hub(){
  const items=articles.map(a=>`<a href="${ORIGIN}/resources/${a.slug}/"><h3>${esc(a.title)}</h3><p>${esc(a.meta)}</p></a>`).join("");
  return `<!DOCTYPE html>
<html lang="en-GB"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Resources | Kwoter AI</title><meta name="description" content="Insights on AI in insurance broking — automation, efficiency and growth for brokers and MGAs, from Kwoter AI." />
<link rel="canonical" href="${ORIGIN}/resources/" /><meta name="robots" content="index, follow" /><style>${STYLE}</style></head><body>
${header}<main class="wrap"><nav class="crumbs"><a href="${ORIGIN}/">Home</a> &rsaquo; Resources</nav>
<h1>Resources</h1><p class="lead">Insights on AI in insurance broking — automation, efficiency and growth for brokers and MGAs.</p>
<div class="list">${items}</div></main>${footer}</body></html>`;
}

// write articles + hub
const resUrls=[];
for(const a of articles){
  const out=join(DIR,"resources",a.slug,"index.html");
  mkdirSync(dirname(out),{recursive:true});
  writeFileSync(out,articleHtml(a));
  resUrls.push(`${ORIGIN}/resources/${a.slug}/`);
}
writeFileSync(join(DIR,"resources","index.html"),hub());
resUrls.unshift(`${ORIGIN}/resources/`);

// rebuild combined sitemap (pages + resources)
let pageUrls=[];
if(existsSync(join(DIR,"pages-urls.txt"))) pageUrls=readFileSync(join(DIR,"pages-urls.txt"),"utf8").split("\n").filter(Boolean);
const all=[...new Set([...pageUrls, ...resUrls])];
const sm=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+all.map(u=>`  <url><loc>${u}</loc></url>`).join("\n")+`\n</urlset>\n`;
writeFileSync(join(DIR,"sitemap.xml"),sm);
console.log(`Published ${articles.length} articles + resources hub. Combined sitemap: ${all.length} urls.`);
