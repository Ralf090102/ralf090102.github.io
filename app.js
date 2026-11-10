(function () {
  const projects = window.PROJECTS || [];
  const papers = window.PAPERS || [];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (i) => String(i + 1).padStart(2, "0");
  const href = (p) => `project.html?id=${encodeURIComponent(p.id)}`;

  // Media files are optional. Probe once so a missing clip never shows a broken frame.
  const probes = {};
  function exists(url) {
    if (!url) return Promise.resolve(false);
    if (!probes[url]) {
      probes[url] = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    }
    return probes[url];
  }

  function chartHTML(fig) {
    const max = Math.max(100, ...fig.bars.map((b) => b.value));
    return `<div class="chart">${fig.bars.map((b) => `
      <div class="chart-row${b.highlight ? " is-hi" : ""}">
        <span class="chart-label">${esc(b.label)}</span>
        <span class="chart-track"><span class="chart-bar" style="--w:${(b.value / max) * 100}%"></span></span>
        <span class="chart-val">${esc(b.value)}${esc(fig.unit || "")}</span>
      </div>`).join("")}</div>`;
  }

  /* ---------- Index page ---------- */
  function renderIndex() {
    const list = document.getElementById("index");
    list.innerHTML = projects.map((p, i) => `
      <li>
        <a class="row" href="${href(p)}" data-id="${esc(p.id)}">
          <span class="row-n">${num(i)}</span>
          <span class="row-t">${esc(p.title)}</span>
          <span class="row-k">${esc(p.kind)}</span>
          <span class="row-y">${p.year ? esc(p.year) : ""}</span>
        </a>
      </li>`).join("");

    const paperList = document.getElementById("papers-list");
    paperList.innerHTML = papers.map((p) => {
      const proj = projects.find((x) => x.id === p.project);
      return `
      <li class="paper">
        <span class="paper-venue">${esc(p.venue)}</span>
        <p class="paper-title">${esc(p.title)}</p>
        <p class="paper-meta">${esc(p.authors)} ${esc(p.note)}</p>
        <p class="paper-links">
          ${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">DOI</a>` : ""}
          ${proj ? `<a href="${href(proj)}">Project: ${esc(proj.title)}</a>` : ""}
        </p>
      </li>`;
    }).join("");

    if (finePointer) setupPreview(list);
  }

  function setupPreview(list) {
    const box = document.getElementById("preview");
    let current = null;
    let x = 0, y = 0, raf = 0;

    const place = () => {
      raf = 0;
      const w = box.offsetWidth, h = box.offsetHeight;
      let left = x + 28, top = y - h / 2;
      if (left + w > innerWidth - 16) left = x - w - 28;
      top = Math.max(16, Math.min(top, innerHeight - h - 16));
      box.style.transform = `translate(${left}px, ${top}px)`;
    };

    async function show(id) {
      current = id;
      const p = projects.find((q) => q.id === id);
      const f = p && p.figure;
      if (!f) return hide();
      let html = "";
      if (f.type === "chart") {
        html = chartHTML(f);
      } else if (await exists(f.poster || f.src)) {
        if (current !== id) return;
        html = f.type === "video"
          ? `<video src="${esc(f.src)}" poster="${esc(f.poster || "")}" muted loop playsinline ${reduceMotion ? "" : "autoplay"}></video>`
          : `<img src="${esc(f.src)}" alt="">`;
      }
      if (current !== id) return;
      if (!html) return hide();
      box.innerHTML = html;
      box.dataset.type = f.type;
      box.style.aspectRatio = f.ratio || "";
      box.classList.add("on");
      place();
    }
    function hide() { box.classList.remove("on"); box.innerHTML = ""; }

    list.addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(place);
    });
    list.querySelectorAll(".row").forEach((row) => {
      row.addEventListener("pointerenter", () => show(row.dataset.id));
    });
    list.addEventListener("pointerleave", () => { current = null; hide(); });
  }

  /* ---------- Case page ---------- */
  function renderCase() {
    const main = document.getElementById("main");
    const id = new URLSearchParams(location.search).get("id");
    const i = projects.findIndex((p) => p.id === id);

    if (i < 0) {
      document.title = "Not found | Ralf Hernandez";
      main.innerHTML = `
        <div class="case-head">
          <a class="back" href="./#work">Back to all work</a>
          <h1 class="case-title">Project not found</h1>
          <p class="case-lead">There is no project with that address. It may have been renamed.</p>
        </div>`;
      return;
    }

    const p = projects[i];
    const prev = projects[(i - 1 + projects.length) % projects.length];
    const next = projects[(i + 1) % projects.length];
    document.title = `${p.title} | Ralf Hernandez`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = p.oneLiner;

    const meta = [
      p.context && ["Context", esc(p.context)],
      p.year && ["Year", esc(p.year)],
      p.stack && p.stack.length && ["Stack", p.stack.map(esc).join(", ")],
      ["Source", p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener">${esc(p.repo.replace("https://github.com/", ""))}</a>` : "Private repository"]
    ].filter(Boolean);

    const list = (items) => `<ul class="points">${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    const blocks = [
      p.problem && ["Problem", `<p>${esc(p.problem)}</p>`],
      p.built && p.built.length && ["What I built", list(p.built)],
      p.results && p.results.length && ["Results", list(p.results)]
    ].filter(Boolean);

    let figure = "";
    const f = p.figure;
    if (f) {
      const cap = f.caption ? `<figcaption>${esc(f.caption)}</figcaption>` : "";
      if (f.type === "chart") figure = `<figure class="case-fig is-chart">${chartHTML(f)}${cap}</figure>`;
      if (f.type === "image") figure = `<figure class="case-fig"><img src="${esc(f.src)}" alt="${esc(f.alt || f.caption || p.title)}">${cap}</figure>`;
      if (f.type === "video") {
        const auto = !f.sound && !reduceMotion;
        figure = `<figure class="case-fig"><video src="${esc(f.src)}" poster="${esc(f.poster || "")}"${f.ratio ? ` style="aspect-ratio:${esc(f.ratio)}"` : ""} playsinline preload="metadata" ${auto ? "muted loop autoplay" : "controls"}></video>${cap}</figure>`;
      }
    }

    main.innerHTML = `
      <div class="case-head">
        <a class="back" href="./#work">Back to all work</a>
        <p class="case-n">${num(i)}</p>
        <h1 class="case-title">${esc(p.title)}</h1>
        <p class="case-lead">${esc(p.oneLiner)}</p>
      </div>
      <dl class="case-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      ${figure}
      ${blocks.map(([h, body]) => `<section class="block"><h2>${h}</h2><div>${body}</div></section>`).join("")}
      <nav class="case-nav" aria-label="More projects">
        <a href="${href(prev)}"><span>Previous</span>${esc(prev.title)}</a>
        <a href="${href(next)}"><span>Next</span>${esc(next.title)}</a>
      </nav>`;

    // Drop the figure if its media file is missing, so the page reads as text only.
    const media = main.querySelector(".case-fig video, .case-fig img");
    if (media) media.addEventListener("error", () => media.closest("figure").remove());
  }

  if (document.body.dataset.page === "project") renderCase();
  else renderIndex();

  // Reveal on scroll.
  if (!reduceMotion && "IntersectionObserver" in window) {
    const els = document.querySelectorAll(".index li, .paper, .block, .case-fig");
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.1 });
    els.forEach((el, k) => { el.style.setProperty("--d", k % 8); io.observe(el); });
  }
})();
