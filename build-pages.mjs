// Generates kwoter.ai solution/use-case pages from data below, in a consistent
// on-brand dark theme with a lightweight CSS "orb glow" (no heavy JS).
// Run: node build-pages.mjs  (or: bun build-pages.mjs)
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const ORIGIN = "https://www.kwoter.ai";
const LOGO = ORIGIN + "/media/kwoter-mark.png";
const HOLD = new Set(["ai-claims","ai-compliance","ai-finance-admin"]); // not live yet — don't publish
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const pages = [
  { slug: "ai-for-insurance-brokers", h1: "AI for Insurance Brokers",
    title: "AI for Insurance Brokers | Kwoter AI",
    meta: "Kwoter AI gives insurance brokerages a full AI workforce — receptionist, outbound calling, renewals, claims, compliance and finance — working around the clock.",
    sub: "Kwoter AI gives your brokerage a full AI workforce — answering calls, chasing renewals, progressing claims and handling admin around the clock — so your people can focus on advice and relationships.",
    body: `<h2>An AI team built for brokerages</h2><p>Instead of one general chatbot, Kwoter AI provides specialist AI agents for the roles a brokerage runs on: reception, outbound calling, renewals, claims, compliance and finance — each working 24/7 alongside your human team.</p>`,
    benefits: ["Add capacity without adding headcount","Calls answered and tasks progressed 24/7","Consistent, auditable processes every time","Built for insurance, including non-standard lines"],
    faqs: [["What is an AI workforce for a brokerage?","A set of AI agents that handle specific roles — calls, renewals, claims, compliance and admin — 24/7 alongside your team."],["Will it replace my staff?","It takes repetitive, high-volume work off your team so they focus on advice and complex cases. Most brokerages use it to add capacity, not cut staff."],["Is it suitable for non-standard insurance?","Yes — it's built for insurance, including non-standard and specialist lines where volume and admin are high."]] },

  { slug: "ai-for-mgas", h1: "AI for MGAs",
    title: "AI for MGAs | Kwoter AI",
    meta: "Kwoter AI gives MGAs an AI workforce to handle high-volume calls, renewals, claims and admin at scale — built for insurance operations.",
    sub: "Scale your MGA's operations without scaling headcount. Kwoter AI handles high-volume calls, renewals, claims progression and back-office admin around the clock.",
    body: `<h2>Operational scale for MGAs</h2><p>MGAs live and die by efficiency. Kwoter AI's specialist agents absorb the repetitive, high-volume work — inbound and outbound calling, renewals, claims updates and finance admin — so your team can focus on underwriting, distribution and growth.</p>`,
    benefits: ["Handle volume spikes without hiring","24/7 inbound and outbound calling","Faster renewals and claims throughput","Consistent, auditable workflows for compliance"],
    faqs: [["How is this different from a chatbot?","It's a set of role-specific agents (reception, outbound, renewals, claims, finance), not a single chatbot — each built around real insurance workflows."],["Can it handle our volumes?","Yes — it's designed for high-volume insurance operations and works around the clock."],["Does it support compliance needs?","It supports consistent, repeatable, auditable processes; book a demo to see how it maps to your controls."]] },

  { slug: "ai-receptionist", h1: "AI Receptionist for Insurance Brokers",
    title: "AI Receptionist for Insurance Brokers | Kwoter AI",
    meta: "Never miss a call. Kwoter AI's AI receptionist answers every inbound call for your brokerage 24/7, handles enquiries and routes the rest.",
    sub: "Every missed call is a missed customer. Kwoter AI's receptionist answers every inbound call, 24/7, handles routine enquiries and routes the rest to the right person.",
    body: `<h2>Answer every call, day or night</h2><p>Phones ring when your team is busy, at lunch, or after hours. The AI receptionist picks up every time — greeting callers, answering common questions, taking details and routing or actioning the enquiry — so no opportunity slips away.</p>`,
    benefits: ["Answers 100% of inbound calls, 24/7","Handles routine enquiries end to end","Captures caller details accurately every time","Routes complex calls to the right person"],
    faqs: [["Does it sound robotic?","It's built for natural, professional phone conversations and handles real enquiries, not just menus."],["What happens with complex calls?","It captures the details and routes them to the right team member, so nothing is lost."],["Does it work out of hours?","Yes — it answers around the clock, including evenings and weekends."]] },

  { slug: "ai-outbound-caller", h1: "AI Outbound Caller for Insurance",
    title: "AI Outbound Caller for Insurance | Kwoter AI",
    meta: "Kwoter AI's outbound caller works your leads and follow-ups automatically, so no quote or opportunity goes cold. Built for insurance brokers.",
    sub: "Leads go cold without fast follow-up. Kwoter AI's outbound caller works your quotes and prospects automatically, so every opportunity gets chased.",
    body: `<h2>Follow up on every lead, fast</h2><p>Speed-to-lead wins business. The AI outbound caller follows up on new quotes and prospects, re-engages aged leads, and keeps working the list — consistently, at volume, without your team spending hours on the phone.</p>`,
    benefits: ["Fast, consistent follow-up on every lead","Re-engages aged and unconverted quotes","Works at volume without extra headcount","Hands warm prospects to your advisers"],
    faqs: [["What does it call about?","New quotes, follow-ups and re-engaging aged leads — configured to your funnel."],["Will it improve conversion?","Faster, consistent follow-up typically lifts conversion versus leads that wait. Book a demo to discuss your numbers."],["Does it pass leads to humans?","Yes — warm, interested prospects are handed to your advisers to close."]] },

  { slug: "ai-renewals", h1: "AI Renewals Agent for Insurance Brokers",
    title: "AI Renewals Agent for Brokers | Kwoter AI",
    meta: "Stop renewals lapsing. Kwoter AI chases and progresses renewals automatically, keeping retention high without tying up your team.",
    sub: "Retention is your cheapest growth. Kwoter AI's renewals agent chases and progresses renewals before they lapse — automatically and consistently.",
    body: `<h2>Protect your retention</h2><p>Renewals slip through the cracks when teams are stretched. The AI renewals agent reaches out ahead of expiry, progresses the renewal, answers questions and flags anything that needs a human — keeping more clients on the books.</p>`,
    benefits: ["Proactive outreach before every expiry","Fewer lapsed policies, higher retention","Consistent renewal process at scale","Escalates complex cases to your team"],
    faqs: [["When does it contact clients?","Ahead of renewal dates, on a schedule you set, so nothing lapses unnoticed."],["Does it handle the whole renewal?","It progresses routine renewals and escalates anything complex to your team."],["Will it help retention?","Consistent, timely renewal chasing typically improves retention versus manual, ad-hoc follow-up."]] },

  { slug: "ai-claims", h1: "AI Claims Assistant for Insurance",
    title: "AI Claims Assistant for Insurance | Kwoter AI",
    meta: "Keep claims moving and customers informed. Kwoter AI's claims assistant progresses claims and provides updates 24/7 for insurance brokers.",
    sub: "Claims are where service is won or lost. Kwoter AI's claims assistant keeps claims progressing and customers updated, around the clock.",
    body: `<h2>Keep every claim moving</h2><p>Slow claims updates frustrate customers and tie up staff. The AI claims assistant chases the next step, keeps claimants informed, captures information and flags issues for your team — for a smoother claims experience.</p>`,
    benefits: ["Proactive claim updates for customers","Keeps claims progressing 24/7","Captures information accurately","Escalates issues to your handlers"],
    faqs: [["Does it settle claims?","No — it progresses and supports claims and keeps customers informed; decisions stay with your handlers/insurers."],["How does it help customers?","Faster, proactive updates and a single point of contact reduce chasing and frustration."],["Does it work with our process?","It's built around brokerage claims workflows; book a demo to map it to yours."]] },

  { slug: "ai-compliance", h1: "AI Compliance Assistant for Insurance",
    title: "AI Compliance Assistant for Insurance | Kwoter AI",
    meta: "Support consistent, auditable processes. Kwoter AI's compliance assistant helps insurance brokerages keep workflows repeatable and recorded.",
    sub: "Compliance thrives on consistency. Kwoter AI helps your brokerage run repeatable, recorded processes so the right steps happen every time.",
    body: `<h2>Consistency you can evidence</h2><p>Human processes drift; AI processes don't. By handling routine steps the same way every time and keeping records, Kwoter AI supports a consistent, auditable approach across calls, renewals and claims.</p>`,
    benefits: ["Repeatable processes followed every time","Records to support audit trails","Consistent customer communications","Frees compliance staff from routine checks"],
    faqs: [["Does this replace our compliance function?","No — it supports it by making routine processes consistent and recorded. Oversight stays with you."],["Does it keep records?","It supports consistent, auditable workflows; book a demo to see what's captured."],["Is it built for insurance?","Yes — it's designed around insurance brokerage processes."]] },

  { slug: "ai-finance-admin", h1: "AI Finance & Admin for Brokerages",
    title: "AI Finance & Admin for Brokerages | Kwoter AI",
    meta: "Automate the repetitive back-office. Kwoter AI's finance & admin agent handles routine brokerage admin so your team can focus on clients.",
    sub: "Back-office admin eats hours. Kwoter AI handles the repetitive finance and admin tasks so your team can spend their time on customers.",
    body: `<h2>Take the admin off your team</h2><p>Routine finance and admin — chasing, reconciling, updating records, sending standard communications — is essential but draining. The AI finance & admin agent handles the repetitive work consistently, freeing your people for higher-value tasks.</p>`,
    benefits: ["Automates repetitive finance/admin tasks","Consistent, accurate record-keeping","Frees staff for client-facing work","Works around the clock"],
    faqs: [["What admin can it handle?","Routine, repeatable finance and admin tasks; book a demo to scope your specific processes."],["Does it integrate with our systems?","It's built around brokerage workflows — we'll show how it fits your setup in a demo."],["Will it reduce errors?","Consistent automation reduces the manual slips that come with repetitive work."]] },
];

const STYLE = `:root{--bg:#0b0e14;--panel:#121723;--line:#222b3a;--ink:#e8edf5;--muted:#9aa7bd;--accent:#5b8cff;--accent2:#7a5bff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Arial,sans-serif;line-height:1.65;position:relative;overflow-x:hidden}
/* lightweight CSS "orb" glow — no JS */
body::before{content:"";position:fixed;top:-220px;left:50%;transform:translateX(-50%);width:760px;height:760px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(122,91,255,.22),rgba(91,140,255,.10) 45%,transparent 70%);filter:blur(20px);pointer-events:none;z-index:0}
.wrap{max-width:820px;margin:0 auto;padding:0 22px;position:relative;z-index:1}
a{color:var(--accent)}
header.site{border-bottom:1px solid var(--line)}header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:68px}
header.site img{height:30px}.cta-btn{background:linear-gradient(90deg,var(--accent),var(--accent2));color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:10px}
.crumbs{font-size:13px;color:var(--muted);padding:18px 0 0}.crumbs a{color:var(--muted);text-decoration:none}
h1{font-size:34px;line-height:1.2;margin:14px 0 10px;background:linear-gradient(90deg,#fff,#b9c6e8);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{color:var(--muted);font-size:18px;margin:0 0 26px;max-width:680px}
h2{font-size:23px;margin:34px 0 12px}p{margin:0 0 14px}
ul.check{list-style:none;padding:0;margin:14px 0}ul.check li{padding:6px 0 6px 28px;position:relative}ul.check li::before{content:"\\2713";color:var(--accent);font-weight:700;position:absolute;left:0}
.cta{background:linear-gradient(120deg,rgba(91,140,255,.15),rgba(122,91,255,.15));border:1px solid var(--line);border-radius:16px;padding:28px 24px;text-align:center;margin:34px 0}
.cta h2{margin:0 0 8px}.cta p{color:var(--muted);margin:0 0 18px}
.cta a{display:inline-block;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#fff;font-weight:700;text-decoration:none;padding:14px 30px;border-radius:12px}
details{border:1px solid var(--line);border-radius:12px;padding:0 18px;margin:10px 0;background:var(--panel)}
details summary{cursor:pointer;font-weight:600;padding:15px 0;list-style:none}details[open] summary{border-bottom:1px solid var(--line)}details p{padding:14px 0;margin:0;color:var(--muted)}
.related{border:1px solid var(--line);border-radius:14px;padding:6px 20px 16px;margin:34px 0;background:var(--panel)}.related h2{font-size:18px}.related a{display:block;padding:9px 0;text-decoration:none;color:var(--ink);border-top:1px solid var(--line);font-weight:600}
footer.site{border-top:1px solid var(--line);margin-top:44px;padding:26px 0;color:var(--muted);font-size:13px}
@media(max-width:600px){h1{font-size:27px}}`;

const header = `<header class="site"><div class="wrap"><a href="${ORIGIN}/"><img src="${LOGO}" alt="Kwoter AI" /></a><a class="cta-btn" href="${ORIGIN}/">Book a demo</a></div></header>`;
const footer = `<footer class="site"><div class="wrap">Kwoter AI — your AI workforce for insurance. &copy; 2026 Kwoter.</div></footer>`;

function related(cur){
  const others = pages.filter(p=>!HOLD.has(p.slug)&&p.slug!==cur).slice(0,5);
  return `<nav class="related"><h2>More Kwoter AI capabilities</h2>${others.map(p=>`<a href="${ORIGIN}/${p.slug}/">${esc(p.h1)} &rsaquo;</a>`).join("")}</nav>`;
}
function schema(p){
  const url=`${ORIGIN}/${p.slug}/`;
  return JSON.stringify({"@context":"https://schema.org","@graph":[
    {"@type":"Organization","@id":ORIGIN+"/#org","name":"Kwoter AI","url":ORIGIN+"/","logo":LOGO},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":ORIGIN+"/"},{"@type":"ListItem","position":2,"name":p.h1,"item":url}]},
    {"@type":"Service","name":p.h1,"provider":{"@id":ORIGIN+"/#org"},"areaServed":{"@type":"Country","name":"United Kingdom"},"description":p.meta},
    {"@type":"FAQPage","mainEntity":p.faqs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))}
  ]});
}
function page(p){
  const url=`${ORIGIN}/${p.slug}/`;
  const faqs=p.faqs.map(([q,a],i)=>`<details${i===0?" open":""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en-GB"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.meta)}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta property="og:type" content="website" /><meta property="og:title" content="${esc(p.title)}" />
<meta property="og:description" content="${esc(p.meta)}" /><meta property="og:url" content="${url}" />
<meta property="og:image" content="${LOGO}" /><meta property="og:site_name" content="Kwoter AI" />
<meta name="twitter:card" content="summary_large_image" />
<script type="application/ld+json">${schema(p)}</script>
<style>${STYLE}</style></head><body>
${header}
<main class="wrap">
<nav class="crumbs"><a href="${ORIGIN}/">Home</a> &rsaquo; ${esc(p.h1)}</nav>
<h1>${esc(p.h1)}</h1>
<p class="sub">${esc(p.sub)}</p>
${p.body}
<h2>Why brokerages choose this</h2>
<ul class="check">${p.benefits.map(b=>`<li>${esc(b)}</li>`).join("")}</ul>
<div class="cta"><h2>See it in action</h2><p>Book a demo and we'll show how it maps to your brokerage.</p><a href="${ORIGIN}/">Book a demo &rarr;</a></div>
<h2>Frequently asked questions</h2>
${faqs}
${related(p.slug)}
</main>
${footer}
</body></html>`;
}

// hub page
function hub(){
  const items=pages.filter(p=>!HOLD.has(p.slug)).map(p=>`<a href="${ORIGIN}/${p.slug}/"><b>${esc(p.h1)}</b></a>`).join("");
  return `<!DOCTYPE html>
<html lang="en-GB"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Solutions | Kwoter AI</title>
<meta name="description" content="Explore Kwoter AI's AI workforce for insurance — receptionist, outbound caller, renewals, claims, compliance and finance for brokers and MGAs." />
<link rel="canonical" href="${ORIGIN}/solutions/" /><meta name="robots" content="index, follow" />
<style>${STYLE}.grid a{display:block;border:1px solid var(--line);border-radius:12px;padding:15px 18px;margin:10px 0;text-decoration:none;color:var(--ink);background:var(--panel)}.grid a:hover{border-color:var(--accent)}</style></head><body>
${header}
<main class="wrap"><nav class="crumbs"><a href="${ORIGIN}/">Home</a> &rsaquo; Solutions</nav>
<h1>Kwoter AI Solutions</h1>
<p class="sub">A specialist AI agent for every part of your brokerage — explore what each one does.</p>
<div class="grid">${items}</div></main>
${footer}
</body></html>`;
}

let urls=[`${ORIGIN}/`];
const live=pages.filter(p=>!HOLD.has(p.slug));
for(const p of live){
  const out=join(DIR,p.slug,"index.html");
  mkdirSync(dirname(out),{recursive:true});
  writeFileSync(out,page(p));
  urls.push(`${ORIGIN}/${p.slug}/`);
}
mkdirSync(join(DIR,"solutions"),{recursive:true});
writeFileSync(join(DIR,"solutions","index.html"),hub());
urls.push(`${ORIGIN}/solutions/`);
const sm=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+urls.map(u=>`  <url><loc>${u}</loc></url>`).join("\n")+`\n</urlset>\n`;
writeFileSync(join(DIR,"sitemap.xml"),sm);
writeFileSync(join(DIR,"pages-urls.txt"),urls.join("\n")+"\n");
console.log(`Built ${live.length} live pages + hub + sitemap (${urls.length} urls). HELD (not published): ${[...HOLD].join(", ")}`);
