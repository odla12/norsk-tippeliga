/* =====================================================================
   Norsk Tippeliga – lokal server
   - Serverer spillet (index.html, game.js)
   - /chat : proxy til Claude API så spillerne kan svare med ekte AI
   Slik slår du på AI-chat (gjør det ÉN gang):
     1) npm install            (installerer @anthropic-ai/sdk)
     2) lim API-nøkkelen din inn i en fil som heter  apikey.txt
        (i samme mappe som denne fila) – ELLER sett miljøvariabel ANTHROPIC_API_KEY
     3) node server.js   (eller bruk preview)
   Uten nøkkel/SDK kjører spillet helt fint – chatten faller tilbake
   til enkle innebygde svar.
   ===================================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");

let SDK = null;
try { SDK = require("@anthropic-ai/sdk"); } catch (_) { /* ikke installert ennå */ }

const PORT = process.env.PORT || 5176;
const ROOT = __dirname;
// nøkkel fra miljøvariabel, ellers fra apikey.txt i prosjektmappa
let KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { try { KEY = fs.readFileSync(path.join(ROOT, "apikey.txt"), "utf8").trim(); } catch (_) {} }
const Client = SDK ? (SDK.default || SDK) : null;
const client = (Client && KEY) ? new Client({ apiKey: KEY }) : null;
// Bytt til "claude-haiku-4-5" hvis du vil ha raskere/billigere svar.
const MODEL = "claude-opus-4-8";

const TYPES = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json" };
const posName = p => ({MV:"keeper", FOR:"forsvarsspiller", MID:"midtbanespiller", ANG:"spiss"}[p] || "spiller");

function serveStatic(req, res){
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end("Not found"); return; }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
}

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/chat") {
    let body = "";
    req.on("data", c => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on("end", async () => {
      res.setHeader("Content-Type", "application/json");
      if (!client) { res.writeHead(503); res.end(JSON.stringify({ error: "no_ai" })); return; }
      try {
        const { player = {}, history = [], message = "" } = JSON.parse(body || "{}");
        const sys = `Du er ${player.name || "en fotballspiller"}, `
          + `${player.age ? player.age + " år gammel, " : ""}`
          + `${player.pos ? posName(player.pos) + " " : "spiller "}`
          + `for ${player.team || "klubben"} i et norsk fotball-manager-spill. `
          + `Manageren (treneren din) chatter med deg. Svar kort (1-3 setninger) på norsk, `
          + `i rolle som en vennlig, litt uformell fotballspiller som snakker med treneren sin. `
          + `Svar på det treneren faktisk spør om. Ikke bryt rollen.`;
        const messages = [];
        for (const m of history.slice(-12)) { if (m && m.t) messages.push({ role: m.me ? "user" : "assistant", content: String(m.t) }); }
        messages.push({ role: "user", content: String(message || "") });
        while (messages.length && messages[0].role !== "user") messages.shift();
        const r = await client.messages.create({ model: MODEL, max_tokens: 300, system: sys, messages });
        const reply = (r.content || []).filter(b => b.type === "text").map(b => b.text).join(" ").trim() || "…";
        res.writeHead(200); res.end(JSON.stringify({ reply }));
      } catch (e) {
        res.writeHead(500); res.end(JSON.stringify({ error: String((e && e.message) || e) }));
      }
    });
    return;
  }
  serveStatic(req, res);
}).listen(PORT, () => console.log(
  `Norsk Tippeliga på http://localhost:${PORT}  ` + (client ? "(AI-chat PÅ ✅)" : (SDK ? "(AI-chat av – lim nøkkel i apikey.txt)" : "(AI-chat av – kjør 'npm install', så lim nøkkel i apikey.txt)"))
));
