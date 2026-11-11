(function () {
  const AREAS = window.AREAS || [];
  const papers = window.PAPERS || [];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Projects are listed area by area (in AREAS order), keeping file order within an area,
  // so a new project lands in its group without anyone re-sorting the file.
  const areaRank = (p) => { const k = AREAS.findIndex((a) => a.id === p.area); return k < 0 ? AREAS.length : k; };
  const projects = (window.PROJECTS || [])
    .map((p, k) => ({ p, k }))
    .sort((a, b) => areaRank(a.p) - areaRank(b.p) || a.k - b.k)
    .map(({ p }) => p);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const href = (p) => `project.html?id=${encodeURIComponent(p.id)}`;
  const area = (p) => AREAS.find((a) => a.id === p.area) || { name: "", short: "" };
  const RINGS = `<svg class="rings" aria-hidden="true" viewBox="0 0 480 480" fill="none"><g>${[80, 160, 320, 400, 479].map((r) => `<circle cx="480" cy="0" r="${r}"></circle>`).join("")}</g><circle class="ring-hi" cx="480" cy="0" r="240"></circle></svg>`;
  const FOOT = `<footer class="foot"><span><span class="sq" aria-hidden="true"></span>Ralf Hernandez, ${new Date().getFullYear()}</span></footer>`;

  // Diagrams are inlined, not <img>, so they pick up the page's colour tokens and fonts.
  const svgs = {};
  function loadSVG(url) {
    if (!svgs[url]) {
      svgs[url] = fetch(url)
        .then((r) => (r.ok ? r.text() : ""))
        .then((t) => (t.trim().startsWith("<svg") ? t : ""))
        .catch(() => "");
    }
    return svgs[url];
  }
  function fillDiagrams(root) {
    root.querySelectorAll("[data-svg]").forEach((slot) => {
      loadSVG(slot.dataset.svg).then((svg) => {
        if (svg) slot.innerHTML = svg;
        else (slot.closest("[data-fig]") || slot).remove();
      });
    });
  }
  const isPortrait = (f) => {
    if (!f || f.type !== "video" || !f.ratio) return false;
    const [w, h] = f.ratio.split("/").map(Number);
    return h > w;
  };

  function chartHTML(c) {
    const max = c.max || Math.max(100, ...c.bars.map((b) => b.value));
    return `<div class="chart">${c.bars.map((b) => `
      <div class="chart-row${b.highlight ? " is-hi" : ""}">
        <span>${esc(b.label)}</span>
        <span class="chart-track"><span class="chart-bar" style="--w:${(b.value / max) * 100}%"></span></span>
        <span class="chart-val">${esc(b.value)}${esc(c.unit || "")}</span>
      </div>`).join("")}</div>`;
  }

  // Areas that have at least one project: the filter buttons and the "Areas" count both come from this.
  const present = AREAS.filter((a) => projects.some((p) => p.area === a.id));

  function statsHTML() {
    return [["Projects", projects.length], ["Papers", papers.length], ["Areas", present.length]]
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  }

  /* ---------- Index page ---------- */
  function renderIndex() {
    const numbered = projects.map((p, i) => ({ p, n: pad(i + 1) }));

    const years = projects.map((p) => p.year).filter(Boolean);
    if (years.length) {
      const lo = Math.min(...years), hi = Math.max(...years);
      document.getElementById("kicker").textContent = lo === hi ? `Selected work, ${hi}` : `Selected work, ${lo} to ${hi}`;
    }
    document.querySelectorAll("[data-stats]").forEach((el) => (el.innerHTML = statsHTML()));
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    // Featured cards
    const feat = numbered.filter(({ p }) => p.featured);
    const featGrid = document.getElementById("featured");
    if (!feat.length) document.getElementById("featured-section").remove();
    featGrid.innerHTML = feat.map(({ p, n }) => {
      const f = p.figure;
      let media = `<span class="card-media-note">${esc(p.kind)}</span>`;
      if (f && f.type === "video") media = `<video src="${esc(f.src)}" poster="${esc(f.poster || "")}" muted loop playsinline preload="${f.poster ? "none" : "metadata"}" aria-hidden="true"></video>`;
      if (f && f.type === "image") media = `<img src="${esc(f.src)}" alt="">`;
      if (f && f.type === "chart") media = chartHTML(f);
      if (f && f.type === "diagram") media = `<div data-svg="${esc(f.src)}" aria-hidden="true"></div>`;
      return `
        <a class="card" href="${href(p)}">
          <span class="card-media" data-kind="${esc(p.kind)}">${media}</span>
          <span class="card-body">
            <span class="card-meta"><span>${n} / ${esc(p.kind)}</span><span>${esc(p.year || "")}</span></span>
            <span class="card-title">${esc(p.title)}</span>
            <span class="card-line">${esc(p.oneLiner)}</span>
          </span>
        </a>`;
    }).join("");
    fillDiagrams(featGrid);
    // A missing clip or image falls back to the text-only media note instead of a blank or broken frame.
    featGrid.querySelectorAll(".card-media video, .card-media img").forEach((m) => {
      m.addEventListener("error", () => {
        const box = m.closest(".card-media");
        box.innerHTML = `<span class="card-media-note">${esc(box.dataset.kind)}</span>`;
      });
    });
    if (!reduceMotion) {
      featGrid.querySelectorAll(".card").forEach((card) => {
        const v = card.querySelector("video");
        if (!v) return;
        const play = () => v.play().catch(() => {});
        const stop = () => v.pause();
        card.addEventListener("pointerenter", play);
        card.addEventListener("pointerleave", stop);
        card.addEventListener("focus", play);
        card.addEventListener("blur", stop);
      });
    }

    // All other projects, filterable by area
    const rest = numbered.filter(({ p }) => !p.featured);
    const rows = document.getElementById("rows");
    rows.innerHTML = rest.map(({ p, n }) => `
      <li data-area="${esc(p.area || "")}">
        <a class="t-row" href="${href(p)}">
          <span class="t-n">${n}</span>
          <span class="t-title">${esc(p.title)}</span>
          <span class="t-area">${esc(area(p).name)}</span>
          <span class="t-kind">${esc(p.kind)}</span>
          <span class="t-year">${esc(p.year || "")}</span>
          <span class="t-sub">${esc(p.kind)}${p.year ? ` / ${esc(p.year)}` : ""}</span>
        </a>
      </li>`).join("");

    const filters = document.getElementById("filters");
    filters.innerHTML = [{ id: "", short: "All" }, ...present]
      .map((a, k) => `<button type="button" class="filter" data-area="${esc(a.id)}" aria-pressed="${k === 0}">${esc(a.short || a.name)}</button>`)
      .join("");
    const empty = document.getElementById("empty");
    const EASE = "cubic-bezier(.16, 1, .3, 1)";
    const canAnimate = !reduceMotion && typeof Element.prototype.animate === "function";
    let run = 0; // bumped on every click, so a fast second click cancels the first one's unfinished steps

    // Filtering animates in three overlapping steps: rows leaving fade out, rows that stay glide to their
    // new positions (FLIP), and rows arriving fade up one after another while the list eases to its new height.
    function applyFilter(id) {
      const mine = ++run;
      const items = [...rows.children];
      const match = (li) => !id || li.dataset.area === id;
      const show = () => {
        let shown = 0;
        items.forEach((li) => { li.hidden = !match(li); if (!li.hidden) shown++; });
        empty.hidden = shown > 0;
      };
      if (!canAnimate) return show();

      items.forEach((li) => li.getAnimations().forEach((a) => a.cancel()));
      rows.getAnimations().forEach((a) => a.cancel());
      const leaving = items.filter((li) => !li.hidden && !match(li));
      const staying = items.filter((li) => !li.hidden && match(li));
      leaving.forEach((li) => li.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: "ease-out", fill: "forwards" }));

      // A timer, not the animations' `finished` promise: the swap must happen even if the browser stalls them.
      setTimeout(() => {
        if (mine !== run) return;
        const startH = rows.offsetHeight;
        const before = new Map(staying.map((li) => [li, li.getBoundingClientRect().top]));
        show();
        leaving.forEach((li) => li.getAnimations().forEach((a) => a.cancel()));
        const endH = rows.offsetHeight;

        staying.forEach((li) => {
          const dy = before.get(li) - li.getBoundingClientRect().top;
          if (dy) li.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 420, easing: EASE });
        });
        const arriving = items.filter((li) => !li.hidden && !staying.includes(li));
        arriving.forEach((li, k) => {
          li.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
            { duration: 420, delay: 40 + k * 35, easing: EASE, fill: "backwards" });
        });
        // Safety net: once everything should have finished, clear any animation the browser stalled,
        // so a row can never be left invisible.
        setTimeout(() => {
          if (mine !== run) return;
          items.forEach((li) => li.getAnimations().forEach((a) => a.cancel()));
          rows.getAnimations().forEach((a) => a.cancel());
        }, 40 + arriving.length * 35 + 420 + 120);
        if (startH !== endH) {
          rows.animate([{ height: `${startH}px`, overflow: "hidden" }, { height: `${endH}px`, overflow: "hidden" }], { duration: 420, easing: EASE });
        }
      }, leaving.length ? 160 : 0);
    }

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn || btn.getAttribute("aria-pressed") === "true") return;
      filters.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      applyFilter(btn.dataset.area);
    });

    // Papers
    document.getElementById("papers-list").innerHTML = papers.map((pp) => {
      const proj = projects.find((x) => x.id === pp.project);
      return `
        <article class="paper">
          <p class="paper-venue">${esc(pp.venue)}</p>
          <div class="paper-body">
            <h3 class="paper-title">${esc(pp.title)}</h3>
            <p class="paper-meta">${esc(pp.authors)} ${esc(pp.note || "")}</p>
            <p class="paper-links">
              ${pp.url ? `<a href="${esc(pp.url)}" target="_blank" rel="noopener">DOI</a>` : ""}
              ${proj ? `<a href="${href(proj)}">Project: ${esc(proj.title)}</a>` : ""}
            </p>
          </div>
        </article>`;
    }).join("");

    // On phones the sidebar contact is hidden, so the Contact link targets the card instead.
    // On desktop the contact block sits inside the sticky sidebar: following the anchor would scroll the
    // window by the block's offset and move the content column for nothing, so just focus the address.
    const contactLink = document.querySelector('.side-nav a[href="#contact"]');
    const phone = matchMedia("(max-width: 900px)");
    const syncContact = () => contactLink.setAttribute("href", phone.matches ? "#contact-card" : "#contact");
    syncContact();
    phone.addEventListener("change", syncContact);
    contactLink.addEventListener("click", (e) => {
      if (phone.matches) return;
      e.preventDefault();
      const email = document.querySelector("#contact .email");
      email.focus({ preventScroll: true });
      email.scrollIntoView({ block: "nearest" });
    });
  }

  /* ---------- Case page ---------- */
  function renderCase() {
    const side = document.getElementById("side");
    const main = document.getElementById("main");
    const id = new URLSearchParams(location.search).get("id");
    const i = projects.findIndex((p) => p.id === id);
    const backLink = `<a class="back" href="./#work"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3L5 8l5 5"></path></svg>All work</a>`;

    if (i < 0) {
      document.title = "Not found | Ralf Hernandez";
      side.innerHTML = `<div class="side-top">${backLink}<a class="case-name" href="./">Ralf Hernandez</a></div>`;
      main.innerHTML = `
        <header class="case-head">
          <h1 class="case-title">Not found</h1>
          <p class="case-lead">There is no project with that address. It may have been renamed.</p>
        </header>`;
      return;
    }

    const p = projects[i];
    const total = projects.length;
    const prevI = (i - 1 + total) % total, nextI = (i + 1) % total;
    document.title = `${p.title} | Ralf Hernandez`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = p.oneLiner;

    const paper = papers.find((pp) => pp.project === p.id);

    // Sections present on this page, numbered in order.
    const blocks = [
      p.problem && { id: "problem", title: "Problem" },
      p.built && p.built.length && { id: "built", title: "What I built" },
      p.results && p.results.length && { id: "results", title: "Results" }
    ].filter(Boolean).map((b, k) => ({ ...b, n: pad(k + 1) }));

    // A portrait demo is tall enough to push the sections off screen, so it gets its own "00" link.
    const toc = (isPortrait(p.figure) ? [{ id: "demo", title: "Demo", n: "00" }] : []).concat(blocks);

    const details = [
      ["Case", `${pad(i + 1)} of ${total}`, "num"],
      p.context && ["Context", esc(p.context)],
      p.year && ["Year", esc(p.year), "num"],
      p.stack && p.stack.length && ["Stack", p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join(""), "tags"],
      ["Source", p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener">${esc(p.repo.replace("https://github.com/", ""))}</a>` : "Private repository"],
      paper && ["Paper", paper.url ? `<a href="${esc(paper.url)}" target="_blank" rel="noopener">${esc(paper.venue)}</a>` : esc(paper.venue)]
    ].filter(Boolean);

    side.innerHTML = `
      <div class="side-top">${backLink}<a class="case-name" href="./">Ralf Hernandez</a></div>
      <dl class="details">${details.map(([k, v, cls]) => `<div><dt>${k}</dt><dd${cls ? ` class="${cls}"` : ""}>${v}</dd></div>`).join("")}</dl>
      ${toc.length > 1 ? `<nav class="side-nav" aria-label="On this page">${toc.map((b) => `<a href="#${b.id}"><span>${b.n}</span>${b.title}</a>`).join("")}</nav>` : ""}`;

    // Figures are numbered in reading order: the main figure first, then any charts in the text.
    let figN = 0;
    const cap = (text) => `<b>Fig. ${++figN}</b>${esc(text || "")}`;

    let figure = "";
    const f = p.figure;
    if (f) {
      if (isPortrait(f)) {
        figure = `<figure class="fig is-portrait" id="demo" data-fig>
          <div class="fig-frame"><video src="${esc(f.src)}" poster="${esc(f.poster || "")}" playsinline preload="metadata" ${!f.sound && !reduceMotion ? "muted loop autoplay" : "controls"}></video></div>
          ${f.caption ? `<figcaption class="fig-cap"><b>Fig. ${++figN}</b><span>${esc(f.caption)}</span></figcaption>` : ""}</figure>`;
      } else {
        let inner = "", cls = "";
        if (f.type === "video") inner = `<video src="${esc(f.src)}" poster="${esc(f.poster || "")}"${f.ratio ? ` style="aspect-ratio:${esc(f.ratio)}"` : ""} playsinline preload="metadata" ${!f.sound && !reduceMotion ? "muted loop autoplay" : "controls"}></video>`;
        if (f.type === "image") inner = `<img src="${esc(f.src)}" alt="${esc(f.alt || f.caption || p.title)}">`;
        if (f.type === "chart") { inner = chartHTML(f); cls = " is-chart"; }
        if (f.type === "diagram") { inner = `<div data-svg="${esc(f.src)}"></div>`; cls = " is-diagram"; }
        figure = `<figure class="fig" data-fig><div class="fig-frame${cls}">${inner}</div>${f.caption ? `<figcaption class="fig-cap">${cap(f.caption)}</figcaption>` : ""}</figure>`;
      }
    }

    const stats = p.stats && p.stats.length
      ? `<dl class="stats">${p.stats.map((s) => `<div${s.highlight ? ' class="is-hi"' : ""}><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join("")}</dl>`
      : "";

    const chartBox = (c) => `<figure class="chart-box">${chartHTML(c)}${c.caption ? `<figcaption class="chart-cap">${cap(c.caption)}</figcaption>` : ""}</figure>`;
    const text = (t) => (typeof t === "string" ? t : t.text);

    const body = {
      problem: () => `<p>${esc(p.problem)}</p>`,
      built: (b) => `<ol class="cards">${p.built.map((t, k) => `
        <li><span class="card-n">${b.n}.${k + 1}</span><span>${esc(text(t))}</span>${t.chart ? chartBox(t.chart) : ""}</li>`).join("")}</ol>`,
      results: () => `<div class="results">${p.results.map((t) => `<p>${esc(text(t))}</p>${t.chart ? chartBox(t.chart) : ""}`).join("")}</div>`
    };

    const kind = p.kind ? p.kind.replace(/\s*\/\s*/g, ", ") : "";
    main.innerHTML = `
      <header class="case-head">
        ${RINGS}
        <p class="case-kicker">${[area(p).name, kind].filter(Boolean).map(esc).join(" / ")}${p.featured ? ' <span class="feat-tag">Featured</span>' : ""}</p>
        <h1 class="case-title">${esc(p.title)}</h1>
        <p class="case-lead">${esc(p.oneLiner)}</p>
      </header>
      ${figure}
      ${stats}
      ${blocks.map((b) => `
        <section class="sec" id="${b.id}">
          <h2 class="sec-h"><span>${b.n}</span>${b.title}</h2>
          <div class="sec-body">${body[b.id](b)}</div>
        </section>`).join("")}
      <nav class="pager" aria-label="More projects">
        <a href="${href(projects[prevI])}"><span>Previous / ${pad(prevI + 1)}</span><strong>${esc(projects[prevI].title)}</strong></a>
        <a href="${href(projects[nextI])}"><span>Next / ${pad(nextI + 1)}</span><strong>${esc(projects[nextI].title)}</strong></a>
      </nav>
      ${FOOT}`;

    // Drop the figure if its media file is missing, so the page reads as text only.
    const media = main.querySelector(".fig video, .fig img");
    // A removed portrait demo also takes its "00 Demo" sidebar link with it.
    if (media) media.addEventListener("error", () => {
      const fig = media.closest("figure");
      const link = fig.id && side.querySelector(`.side-nav a[href="#${fig.id}"]`);
      if (link) link.remove();
      fig.remove();
    });
    fillDiagrams(main);

    // Mark the section currently being read in the sidebar.
    const links = side.querySelectorAll('.side-nav a');
    // The current section is the last one whose top has passed 35% of the viewport; above the first one, none is.
    if (links.length) {
      const byId = {};
      links.forEach((a) => (byId[a.getAttribute("href").slice(1)] = a));
      const targets = [...main.querySelectorAll(".sec, #demo")];
      let raf = 0;
      const update = () => {
        raf = 0;
        const line = innerHeight * 0.35;
        let cur = null;
        targets.forEach((t) => { if (t.isConnected && t.getBoundingClientRect().top <= line) cur = t; });
        links.forEach((a) => a.classList.toggle("is-active", !!cur && a === byId[cur.id]));
      };
      addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
      addEventListener("resize", update);
      update();
    }
  }

  if (document.body.dataset.page === "project") renderCase();
  else renderIndex();
})();
