"""Generate theme-aware system diagrams for the portfolio site.

Styling comes from the page (classes dg-*), so the SVGs are inlined, not <img>.
"""
import sys
from html import escape

OUT = sys.argv[1]


class D:
    def __init__(self, ident, w, h, label):
        self.id, self.w, self.h, self.label = ident, w, h, label
        self.parts = []

    def box(self, x, y, w, h, title, subs=(), hi=False):
        cls = "dg-box dg-hi" if hi else "dg-box"
        self.parts.append(f'<rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="6"/>')
        ty = y + (28 if len(subs) > 1 else (h / 2 - 3 if subs else h / 2 + 5))
        self.parts.append(f'<text class="dg-t" x="{x + 12}" y="{ty:g}">{escape(title)}</text>')
        for i, s in enumerate(subs):
            self.parts.append(f'<text class="dg-s" x="{x + 12}" y="{ty + 18 + i * 18:g}">{escape(s)}</text>')

    def frame(self, x, y, w, h, label, lx=None, ly=None, anchor="start"):
        self.parts.append(f'<rect class="dg-frame" x="{x}" y="{y}" width="{w}" height="{h}" rx="8"/>')
        lx = x + 14 if lx is None else lx
        ly = y + 20 if ly is None else ly
        self.parts.append(f'<text class="dg-k" x="{lx}" y="{ly}" text-anchor="{anchor}">{escape(label)}</text>')

    def head(self, x, y, text):
        self.parts.append(f'<text class="dg-k" x="{x}" y="{y}">{escape(text)}</text>')

    def edge(self, pts, label=None, lx=None, ly=None, anchor="middle"):
        d = "M" + " L".join(f"{px} {py}" for px, py in pts)
        self.parts.append(f'<path class="dg-e" d="{d}" marker-end="url(#{self.id}-arr)"/>')
        if label:
            self.parts.append(f'<text class="dg-l" x="{lx}" y="{ly}" text-anchor="{anchor}">{escape(label)}</text>')

    def line(self, pts):
        d = "M" + " L".join(f"{px} {py}" for px, py in pts)
        self.parts.append(f'<path class="dg-e" d="{d}"/>')

    def svg(self):
        defs = (f'<defs><marker id="{self.id}-arr" viewBox="0 0 10 10" refX="9" refY="5" '
                f'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                f'<path class="dg-arrow" d="M0 1 L9 5 L0 9 z"/></marker></defs>')
        body = "\n".join(self.parts)
        return (f'<svg class="dg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" '
                f'role="img" aria-label="{escape(self.label)}">\n{defs}\n{body}\n</svg>\n')


# ---------- Job Application Tracker ----------
j = D("jat", 1000, 594, "System diagram of the Job Application Tracker: a React app and two auto-apply "
      "clients (an n8n workflow and Claude Code skills) talk to a Laravel API, which uses SQLite, a local "
      "Ollama model, a queue worker, and the Proteus PDF renderer.")
j.head(20, 30, "OUTSIDE")
j.head(230, 30, "CLIENTS")
j.head(560, 30, "BACKEND")
j.head(800, 30, "LOCAL SERVICES")

j.frame(214, 196, 222, 386, "AUTO-APPLY, V2", lx=424, ly=216, anchor="end")

j.box(20, 60, 150, 64, "You", ["in a browser"])
j.box(20, 230, 150, 64, "JSearch API", ["job listings"])
j.box(20, 380, 150, 64, "Indeed", ["Easy Apply"])

j.box(230, 60, 190, 64, "React 19 SPA", ["Vite, Tailwind"])
j.box(230, 230, 190, 64, "n8n workflow", ["always-on container"])
j.box(230, 380, 190, 64, "Claude Code skills", ["drives Chrome"])
j.box(230, 500, 190, 64, "Eru vault", ["application log"])

j.box(560, 60, 170, 384, "Laravel 13 API",
      ["PHP 8.4", "Sanctum session auth", "posting extraction", "red-flag scoring", "fit matching",
       "review queue", "daily submit cap"], hi=True)

j.box(800, 60, 180, 64, "SQLite", ["all app data"])
j.box(800, 170, 180, 64, "Ollama, mistral", ["runs locally"])
j.box(800, 280, 180, 64, "Queue worker", ["tailors each resume"])
j.box(800, 390, 180, 64, "Proteus CLI", ["Markdown to PDF"])

j.edge([(170, 92), (228, 92)])
j.edge([(420, 92), (558, 92)], "JSON, session", 490, 84)
j.edge([(230, 262), (172, 262)])
j.edge([(420, 262), (558, 262)], "POST ingest, token", 490, 254)
j.edge([(230, 412), (172, 412)])
j.edge([(420, 412), (558, 412)], "review API", 490, 404)
j.edge([(325, 444), (325, 498)], "logs submits", 335, 476, "start")
j.edge([(730, 92), (798, 92)])
j.edge([(730, 202), (798, 202)])
j.edge([(730, 312), (798, 312)], "dispatch", 765, 304)
j.edge([(890, 280), (890, 236)], "tailor", 900, 262, "start")
j.edge([(890, 344), (890, 388)], "render", 900, 371, "start")

# ---------- TMWA ----------
t = D("tmwa", 1000, 624, "System diagram of TMWA: GitHub Actions builds images, ArgoCD syncs a Helm chart into "
      "Kubernetes, where an NGINX ingress fronts a Next.js app that calls eight microservices, Redis, MinIO "
      "and Meilisearch, with PostgreSQL on Supabase outside the cluster.")

t.box(40, 20, 210, 60, "GitHub Actions", ["test, scan, 9 images"])
t.box(320, 20, 180, 60, "ArgoCD", ["syncs the Helm chart"])
t.box(540, 20, 190, 60, "Prometheus, Grafana", ["Loki logs, 5 alerts"])
t.edge([(250, 50), (318, 50)], "image tag", 285, 42)
t.edge([(410, 80), (410, 108)])

t.frame(20, 110, 720, 504, "KUBERNETES, HELM", ly=132)

# column 1
t.box(40, 148, 170, 50, "NGINX Ingress", ["task-manager.local"])
t.box(40, 240, 170, 130, "Next.js 16 app",
      ["22 API routes", "canary rollouts", "HPA on req/s"], hi=True)
t.box(40, 540, 170, 56, "Redis", ["cache, BullMQ"])
# column 2
t.box(280, 148, 170, 50, "realtime", ["Socket.io"])
t.box(280, 240, 170, 44, "team-service", [])
t.box(280, 298, 170, 44, "file-service", [])
t.box(280, 356, 170, 44, "analytics", [])
t.box(280, 414, 170, 44, "webhook", [])
t.box(280, 540, 170, 56, "worker", ["BullMQ jobs"])
# column 3
t.box(520, 148, 200, 50, "notification", ["email, in-app"])
t.box(520, 218, 200, 50, "scheduler, CronJob", ["recurring tasks"])
t.box(520, 298, 200, 44, "MinIO", [])
t.box(520, 470, 200, 50, "Meilisearch", ["full-text search"])
t.box(520, 546, 200, 50, "search-sync", ["Postgres to index"])
# outside
t.box(790, 148, 190, 50, "SMTP", ["email delivery"])
t.box(790, 240, 190, 130, "PostgreSQL", ["on Supabase", "shared schema", "used by the app", "and most services"])
t.box(790, 414, 190, 44, "Webhook endpoints", [])

t.edge([(125, 198), (125, 238)])
t.edge([(210, 163), (278, 163)])
# bus from the app to the request-path services
t.line([(210, 260), (245, 260)])
t.line([(245, 183), (245, 436)])
for y in (183, 262, 320, 378, 436):
    t.edge([(245, y), (278, y)])
t.edge([(125, 370), (125, 538)], "cache, enqueue", 135, 460, "start")
t.edge([(210, 568), (278, 568)])
t.edge([(450, 568), (518, 568)])
t.edge([(620, 546), (620, 522)])
t.edge([(450, 320), (518, 320)])
t.edge([(720, 173), (788, 173)])
t.edge([(450, 436), (788, 436)], "HMAC-signed, retried", 620, 428)
t.edge([(740, 305), (788, 305)])

# ---------- EruVoice ----------
v = D("eruvoice", 1000, 470, "System diagram of EruVoice: push-to-talk or a wake word starts recording, "
      "faster-whisper transcribes it, a keyword router handles cancel and local commands itself and sends "
      "everything else to Claude Code in print mode, which reaches the notes vault only through the eru MCP "
      "server; replies are spoken by Piper or Kokoro.")
v.box(20, 40, 170, 56, "Push-to-talk", ["hold F9"])
v.box(20, 144, 170, 56, "Wake word", ["\"Hey Eru\""])
v.box(215, 88, 175, 64, "Microphone", ["VAD trims silence"])
v.box(410, 88, 175, 64, "faster-whisper", ["speech to text, CPU"])
v.box(605, 60, 175, 120, "Keyword router", ["1. cancel phrase", "2. \"Command, <name>\"", "3. anything else"])
v.box(800, 60, 180, 120, "Claude Code, -p",
      ["one resumed session", "input may be misheard", "only the eru MCP tool"], hi=True)
v.box(800, 290, 180, 64, "eru MCP server", ["Erudition"])
v.box(800, 390, 180, 56, "Eru vault", ["read, create, edit"])
v.box(500, 290, 200, 64, "Text to speech", ["Piper or Kokoro-82M"])
v.box(215, 290, 175, 64, "Speaker", ["a key press cuts it off"])

v.line([(190, 68), (202, 68), (202, 172), (190, 172)])
v.edge([(202, 120), (213, 120)])
v.edge([(390, 120), (408, 120)])
v.edge([(585, 120), (603, 120)])
v.edge([(780, 120), (798, 120)])
v.edge([(890, 180), (890, 288)], "vault tools", 900, 240, "start")
v.edge([(890, 354), (890, 388)])
v.line([(800, 160), (790, 160), (790, 322)])
v.edge([(790, 322), (702, 322)], "reply", 745, 314)
v.edge([(650, 180), (650, 288)], "cancel ack, local commands", 640, 240, "end")
v.edge([(500, 322), (392, 322)])

# ---------- Lyra ----------
l = D("lyra", 1000, 512, "System diagram of Lyra: Claude Code calls five MCP tools on the Lyra server, which go "
      "through one typed stage core; separate adapters for WiQAS and Orion run each project's own Python "
      "environment as a subprocess, speaking JSON over stdin and stdout.")
l.box(20, 60, 170, 64, "Claude Code", ["the agent"])
l.box(250, 40, 230, 150, "Lyra MCP server",
      ["list_stages", "get_stage_config", "set_stage_config", "run_stage", "run_pipeline"], hi=True)
l.box(540, 40, 230, 150, "Typed stage core",
      ["pydantic schemas", "stage registry", "pipeline executor", "subprocess runner"])
l.box(830, 40, 150, 64, "Pipeline graph", ["JSON file"])
l.frame(180, 245, 640, 125, "ADAPTERS: NEW FILES ONLY", lx=500, ly=265, anchor="middle")
l.box(200, 285, 280, 64, "WiQAS adapter", ["retrieve, rerank, eval"])
l.box(520, 285, 280, 64, "Orion adapter", ["retrieve, rerank"])
l.box(200, 430, 280, 64, "WiQAS", ["scripts, in its own venv"])
l.box(520, 430, 280, 64, "Orion", ["FastAPI service, in its own venv"])

l.edge([(190, 92), (248, 92)], "MCP", 219, 84)
l.edge([(480, 115), (538, 115)])
l.edge([(830, 72), (772, 72)])
l.line([(655, 190), (655, 220)])
l.line([(340, 220), (660, 220)])
l.edge([(340, 220), (340, 283)])
l.edge([(660, 220), (660, 283)])
l.edge([(340, 349), (340, 428)], "subprocess, JSON over stdio", 350, 394, "start")
l.edge([(660, 349), (660, 428)], "same runner, unchanged", 670, 394, "start")

with open(f"{OUT}/lyra.svg", "w", encoding="utf-8") as f:
    f.write(l.svg())
with open(f"{OUT}/eruvoice.svg", "w", encoding="utf-8") as f:
    f.write(v.svg())
with open(f"{OUT}/job-tracker.svg", "w", encoding="utf-8") as f:
    f.write(j.svg())
with open(f"{OUT}/tmwa.svg", "w", encoding="utf-8") as f:
    f.write(t.svg())
print("ok")
