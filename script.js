/* ============================================================
   KOMAL RAJPUT — portfolio interactions
   Progressive enhancement: everything is visible/usable without
   JS or GSAP. Motion is added on top and disabled for
   prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- year ---------- */
  const yr = $("#yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ============================================================
     NAV — shrink on scroll, active section, mobile toggle
     ============================================================ */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const navlinks = $(".navlinks");

  const onScrollNav = () => {
    if (window.scrollY > 40) nav.classList.add("shrunk");
    else nav.classList.remove("shrunk");
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = navlinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".navlinks a").forEach(a =>
      a.addEventListener("click", () => {
        navlinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // active section indicator
  const navMap = {};
  $$("[data-nav]").forEach(s => (navMap[s.dataset.nav] = s.closest("a")));
  const sections = ["work", "playground", "think", "about"]
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          $$(".navlinks a").forEach(a => a.classList.remove("active"));
          const link = navMap[e.target.id];
          if (link) link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ============================================================
     SCROLL PROGRESS
     ============================================================ */
  const progress = $(".scroll-progress i");
  const updateProgress = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const w = h > 0 ? (window.scrollY / h) : 0;
    progress.style.transform = `scaleX(${w})`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ============================================================
     CUSTOM CURSOR (desktop, fine pointer, motion allowed)
     ============================================================ */
  const cursor = $(".cursor");
  if (cursor && finePointer && !reduce) {
    document.body.classList.add("cursor-on");
    cursor.style.display = "block";
    const label = $(".cursor-label");
    let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;

    window.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; });
    const render = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      cursor.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      requestAnimationFrame(render);
    };
    render();

    // link / button hover -> small state
    $$("a, button, input, [role=button]").forEach(el => {
      el.addEventListener("pointerenter", () => {
        if (el.closest("[data-cursor]")) return;
        cursor.classList.add("is-hover");
      });
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-hover"));
    });
    // project cards -> expand into "EXPLORE"
    $$("[data-cursor]").forEach(el => {
      el.addEventListener("pointerenter", () => {
        cursor.classList.add("is-view");
        cursor.classList.remove("is-hover");
        label.textContent = el.dataset.cursor;
      });
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-view"));
    });
    document.addEventListener("pointerdown", () => cursor.classList.add("is-hover"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-hover"));
  }

  /* ============================================================
     MAGNETIC BUTTONS (subtle)
     ============================================================ */
  if (finePointer && !reduce) {
    $$(".magnetic").forEach(btn => {
      const strength = 14;
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const my = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

  /* ============================================================
     HERO TITLE + SCROLL REVEALS (GSAP if available)
     ============================================================ */
  const heroTitle = $(".hero-title");

  function drawUnderline() {
    if (heroTitle) heroTitle.classList.add("drawn");
  }

  if (hasGSAP && !reduce) {
    gsap.registerPlugin(window.ScrollTrigger);

    // page-load timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".nav", { y: -30, opacity: 0, duration: 0.7 });
    if (heroTitle) {
      tl.from(".hero-title .w", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.3");
    }
    tl.from(".hero-copy .eyebrow", { y: 16, opacity: 0, duration: 0.6 }, "-=0.9")
      .from(".hero-lede", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".hero-actions", { y: 16, opacity: 0, duration: 0.6 }, "-=0.45")
      .from(".hero-aside", { y: 12, opacity: 0, duration: 0.5 }, "-=0.4")
      .from(".workspace", { y: 40, opacity: 0, duration: 0.9 }, "-=0.9")
      .add(drawUnderline, "-=0.3");

    // scroll reveals
    const revealTargets = [
      ".manifesto-text", ".work .section-head > *", ".proj",
      ".playground .section-head > *", ".terminal", ".scenario",
      ".think .section-head > *", ".belief",
      ".services .section-head > *", ".svc-picker", ".svc-card",
      ".skills .section-head > *", ".skill-col",
      ".about-head > *", ".about-copy > *", ".timeline li",
      ".contact > *"
    ];
    revealTargets.forEach(sel => {
      $$(sel).forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          y: 34, opacity: 0, duration: 0.8, ease: "power3.out",
          delay: (i % 4) * 0.06
        });
      });
    });

    // scroll-linked: project numbers drift, manifesto tint
    $$(".proj-num").forEach(n => {
      gsap.to(n, { yPercent: -18, ease: "none",
        scrollTrigger: { trigger: n.closest(".proj"), start: "top bottom", end: "bottom top", scrub: true } });
    });
    // hero workspace subtle parallax
    gsap.to(".workspace", { yPercent: -6, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  } else {
    // no GSAP or reduced motion -> ensure everything shows
    drawUnderline();
  }

  /* ============================================================
     HERO WORKSPACE (signature) — tabs
     ============================================================ */
  const wsTabs = $$(".ws-tab");
  const wsPanels = $$(".ws-panel");
  const wsScreen = $("#wsScreen");

  function activatePanel(mode) {
    wsTabs.forEach(t => {
      const on = t.dataset.mode === mode;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    wsPanels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === mode));
    // retrigger inner animation
    wsScreen.classList.remove("ws-active");
    void wsScreen.offsetWidth; // reflow
    requestAnimationFrame(() => wsScreen.classList.add("ws-active"));
  }
  wsTabs.forEach(t => t.addEventListener("click", () => activatePanel(t.dataset.mode)));
  // kick off first panel animation when workspace enters view
  const wsIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { wsScreen.classList.add("ws-active"); obs.disconnect(); } });
  }, { threshold: 0.3 });
  if (wsScreen) wsIO.observe(wsScreen);

  /* ---------- scroll cue ---------- */
  $$("[data-scroll]").forEach(el =>
    el.addEventListener("click", () => {
      const t = $(el.dataset.scroll);
      if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    })
  );

  /* ============================================================
     CASE STUDY DATA + MODAL (4-step click-through)
     ============================================================ */
  const CASES = {
    novamart: {
      num: "01", kicker: "Portfolio case · Excel analytics",
      title: "E-commerce Performance Dashboard",
      sub: "NovaMart had transaction-level sales data but no concise view of where revenue, profit and growth actually came from.",
      steps: {
        Problem: { type: "p", body: "Thousands of order records, but leadership couldn't quickly answer the basics — which categories drive profit, how margin moves month to month, and whether growth is real or seasonal noise." },
        Approach: { type: "ul", body: [
          "Structured 2,424 synthetic orders into a clean, analysis-ready model.",
          "Built KPI logic for revenue, gross profit, margin, orders and average order value.",
          "Added category, product, regional and customer-segment breakdowns.",
          "Translated the numbers into plain-language insights, not just charts."
        ]},
        Output: { type: "p", body: "A single executive dashboard: $1,125,138 revenue, 24.3% gross margin, 2,424 orders — with the drill-downs that explain each headline number in one screen." },
        Impact: { type: "p", body: "Leadership can go from “how are we doing?” to a specific, defensible answer in seconds — and the workbook stays inspectable underneath." }
      },
      tools: "Excel · Data analysis · Data visualization · Dashboarding"
    },
    automation: {
      num: "02", kicker: "Portfolio case · Reporting automation",
      title: "Automated Sales Reporting & Data Quality",
      sub: "Five regional teams sent differently-formatted feeds every week, and someone rebuilt the report by hand each time.",
      steps: {
        Problem: { type: "p", body: "Six manual steps, five mismatched files, ~3–4 hours a week — and every step was a chance to mis-key a number or miss a duplicate." },
        Approach: { type: "ul", body: [
          "Standardised dates, categories, regions and quantities across all feeds.",
          "Built data-quality checks for duplicates, missing fields and invalid records.",
          "Used Power Query to append and normalise on refresh, so it repeats identically.",
          "Kept a transparent KPI layer (Tables + SUMIFS) so the maths stays auditable."
        ]},
        Output: { type: "p", body: "One report that rebuilds itself: refresh the query and cleaning, checks, KPIs and charts all update. ~5–10 minutes a week instead of 3–4 hours." },
        Impact: { type: "p", body: "Fewer errors, a clear audit trail, and a pipeline that absorbs a new region by dropping a file in a folder — instead of reworking the whole thing." }
      },
      tools: "Excel · Power Query · Data cleaning · Data quality · Automation"
    },
    pricing: {
      num: "03", kicker: "Portfolio case · Commercial analytics",
      title: "Pricing & Profitability Scenario Model",
      sub: "Management needed to see how price and cost assumptions ripple through volume, revenue, gross profit and margin — before committing.",
      steps: {
        Problem: { type: "p", body: "Pricing decisions were being argued in the abstract. There was no shared, quantified view of the trade-off between a price move and the volume it costs you." },
        Approach: { type: "ul", body: [
          "Modelled 100 synthetic SKUs across five categories.",
          "Built base, price-up, price-down, cost-inflation, mixed and custom scenarios.",
          "Linked price assumptions to expected volume through simple elasticity logic.",
          "Surfaced product-level risks and opportunities, not just a portfolio total."
        ]},
        Output: { type: "p", body: "An interactive model: an 8% price rise turns 34.9% margin into 39.9% and +$831,770 gross profit — while a price cut quietly costs over $1.1M. (Try the live version in the Playground.)" },
        Impact: { type: "p", body: "Pricing conversations start from a shared, quantified picture — so the debate is about judgement, not about whose spreadsheet is right." }
      },
      tools: "Excel · Commercial analytics · Scenario modeling · Financial analysis"
    },
    sql: {
      num: "04", kicker: "Portfolio case · SQL analytics",
      title: "SQL Customer & Sales Analytics",
      sub: "A fictional retailer needs repeatable answers to revenue, profitability and customer questions — straight from relational data.",
      steps: {
        Problem: { type: "p", body: "Some questions shouldn't live in a spreadsheet at all. Repeat-purchase behaviour, category ranking and margin trade-offs are cleaner as queries you can re-run." },
        Approach: { type: "ul", body: [
          "Designed a normalised schema: customers, orders, order items, products.",
          "Wrote business-focused queries with joins, CTEs, CASE and aggregates.",
          "Used a window function to rank categories within each month.",
          "Analysed repeat customers and the discount-versus-margin trade-off."
        ]},
        Output: { type: "p", body: "A compact, reusable SQL project — the kind of query set that answers the same business questions every month without a rebuild." },
        Impact: { type: "p", body: "Shows the analysis can move beyond the spreadsheet: structured, versionable, and repeatable by anyone who can run the query." }
      },
      tools: "SQL · SQLite · CTEs · Joins · Window functions"
    }
  };

  const modal = $("#modal");
  const modalBody = $("#modalBody");
  let lastFocused = null;

  function buildStage(caseData) {
    const stepNames = Object.keys(caseData.steps);
    let current = 0;

    const slides = stepNames.map((name, i) => {
      const s = caseData.steps[name];
      const inner = s.type === "ul"
        ? `<ul>${s.body.map(x => `<li>${x}</li>`).join("")}</ul>`
        : `<p>${s.body}</p>`;
      return `<div class="cs-slide${i === 0 ? " is-active" : ""}" data-slide="${i}"><h4>${name}</h4>${inner}</div>`;
    }).join("");

    const chips = stepNames.map((name, i) =>
      `<button class="cs-step${i === 0 ? " is-active" : ""}" data-step="${i}">${String(i + 1).padStart(2, "0")} · ${name}</button>`
    ).join("");

    modalBody.innerHTML = `
      <div class="cs-head">
        <div class="cs-num">${caseData.num}</div>
        <p class="cs-kicker" id="modalTitle">${caseData.kicker}</p>
        <h3 class="cs-title">${caseData.title}</h3>
        <p class="cs-sub">${caseData.sub}</p>
      </div>
      <div class="cs-steps">${chips}</div>
      <div class="cs-stage">${slides}</div>
      <div class="cs-tools">Tools · ${caseData.tools}</div>
      <div class="cs-nav">
        <button data-dir="-1" disabled>← Back</button>
        <button data-dir="1">Next →</button>
      </div>`;

    const stepBtns = $$(".cs-step", modalBody);
    const slideEls = $$(".cs-slide", modalBody);
    const back = modalBody.querySelector('[data-dir="-1"]');
    const next = modalBody.querySelector('[data-dir="1"]');

    function go(i) {
      current = Math.max(0, Math.min(stepNames.length - 1, i));
      stepBtns.forEach((b, k) => b.classList.toggle("is-active", k === current));
      slideEls.forEach((sl, k) => sl.classList.toggle("is-active", k === current));
      back.disabled = current === 0;
      next.disabled = current === stepNames.length - 1;
    }
    stepBtns.forEach((b, i) => b.addEventListener("click", () => go(i)));
    back.addEventListener("click", () => go(current - 1));
    next.addEventListener("click", () => go(current + 1));
  }

  function openCase(key) {
    const data = CASES[key];
    if (!data) return;
    lastFocused = document.activeElement;
    buildStage(data);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    const closeBtn = $(".modal-close", modal);
    if (closeBtn) closeBtn.focus();
  }
  function closeCase() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  $$(".proj").forEach(card => {
    const open = () => openCase(card.dataset.project);
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
  $$("[data-close]", modal).forEach(el => el.addEventListener("click", closeCase));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeCase();
  });
  // simple focus containment
  modal.addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    const f = $$('button, a, input, [tabindex]:not([tabindex="-1"])', modal).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ============================================================
     SQL TERMINAL — run + easter egg
     ============================================================ */
  const sqlInput = $("#sqlInput");
  const sqlOut = $("#sqlOut");
  const runSql = $("#runSql");
  const tryEgg = $("#tryEgg");

  const DEFAULT_RESULT =
    `<span class="t-ok">✓ query complete — 3 rows (synthetic)</span>\n\n` +
    `customer_segment   avg_order_value\n` +
    `----------------   ---------------\n` +
    `Premium            $612.40\n` +
    `Small Business     $438.10\n` +
    `Consumer           $301.75\n\n` +
    `<span class="t-head">// note: portfolio demo — not a live database</span>`;

  const EGG_RESULT =
    `<span class="t-egg">SELECT * FROM komal;</span>\n\n` +
    `attribute            value\n` +
    `------------------   ------------------------------\n` +
    `experience           4+ years analytics\n` +
    `curiosity            ∞\n` +
    `spreadsheets_open    suspiciously many\n` +
    `automation_urge      1 (slightly unreasonable)\n` +
    `status               probably building something\n\n` +
    `<span class="t-ok">✓ 1 row — and yes, she built this site too.</span>`;

  function typeOut(html) {
    if (reduce) { sqlOut.innerHTML = html; return; }
    sqlOut.innerHTML = `<span class="t-muted">running query…</span>`;
    // progress ticks then reveal
    let dots = 0;
    const bar = setInterval(() => {
      dots++;
      sqlOut.innerHTML = `running query ${"█".repeat(dots)}${"░".repeat(Math.max(0, 10 - dots))}`;
      if (dots >= 10) { clearInterval(bar); sqlOut.innerHTML = html; }
    }, 55);
  }

  function runQuery() {
    const q = (sqlInput.value || "").toLowerCase();
    if (q.includes("from komal") || q.includes("* from komal")) typeOut(EGG_RESULT);
    else typeOut(DEFAULT_RESULT);
  }
  if (runSql) runSql.addEventListener("click", runQuery);
  if (sqlInput) sqlInput.addEventListener("keydown", e => { if (e.key === "Enter") runQuery(); });
  if (tryEgg) tryEgg.addEventListener("click", () => {
    sqlInput.value = "SELECT * FROM komal;";
    runQuery();
  });

  /* ============================================================
     SCENARIO EXPLORER (exact synthetic figures from project 03)
     ============================================================ */
  const SCN = {
    base:   { rev: 19393974, gp: 6763084, m: 34.9, d: 0 },
    up:     { rev: 19024786, gp: 7594854, m: 39.9, d: 831770 },
    down:   { rev: 19478614, gp: 5646765, m: 29.0, d: -1116319 },
    cost:   { rev: 19393974, gp: 5499995, m: 28.4, d: -1263089 },
    mix:    { rev: 18073547, gp: 7215111, m: 39.9, d: 452027 },
    custom: { rev: 18812646, gp: 6820679, m: 36.3, d: 57596 }
  };
  const REV_MAX = 19478614, GP_MAX = 7594854;
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const signed = n => (n >= 0 ? "+" : "−") + "$" + Math.abs(n).toLocaleString("en-US");

  const scnRev = $("#scnRev"), scnGp = $("#scnGp"), scnMargin = $("#scnMargin"),
        scnVsBase = $("#scnVsBase"), scnRevBar = $("#scnRevBar"),
        scnGpBar = $("#scnGpBar"), scnRing = $("#scnRing");

  function countTo(el, target, fmt) {
    if (reduce) { el.textContent = fmt(target); return; }
    const from = parseFloat((el.dataset.v || "0")); const start = performance.now(); const dur = 650;
    const step = now => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (target - from) * eased;
      el.textContent = fmt(val);
      if (t < 1) requestAnimationFrame(step); else { el.dataset.v = target; el.textContent = fmt(target); }
    };
    el.dataset.v = from; requestAnimationFrame(step);
  }

  function setScenario(key) {
    const s = SCN[key]; if (!s) return;
    countTo(scnRev, s.rev, money);
    countTo(scnGp, s.gp, money);
    countTo(scnMargin, s.m, v => v.toFixed(1) + "%");
    scnRevBar.style.setProperty("--w", (s.rev / REV_MAX * 100).toFixed(1) + "%");
    scnGpBar.style.setProperty("--w", (s.gp / GP_MAX * 100).toFixed(1) + "%");
    scnRing.style.setProperty("--pct", s.m);
    scnVsBase.textContent = s.d === 0 ? "+$0" : signed(s.d);
    scnVsBase.className = "scn-d-v " + (s.d > 0 ? "pos" : s.d < 0 ? "neg" : "");
  }
  $$(".scn-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".scn-chip").forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-selected", "false"); });
      chip.classList.add("is-active"); chip.setAttribute("aria-selected", "true");
      setScenario(chip.dataset.scn);
    });
  });
  // initialise data-v so first switch animates smoothly
  if (scnRev) { scnRev.dataset.v = SCN.base.rev; scnGp.dataset.v = SCN.base.gp; scnMargin.dataset.v = SCN.base.m; }

  /* ============================================================
     SERVICES PICKER
     ============================================================ */
  const SERVICES = {
    spreadsheet: {
      kicker: "Data cleaning · Excel",
      h: "Tame the messy spreadsheet.",
      p: "Inconsistent formats, mystery duplicates, a total that never quite ties out. I'll get it clean, structured and trustworthy — and set it up so it stays that way.",
      link: "See: Automated Sales Reporting →", proj: "automation",
      tags: ["Data cleaning", "Validation", "Power Query", "Excel"]
    },
    dashboard: {
      kicker: "Dashboards · Data viz",
      h: "Build a dashboard that answers a question.",
      p: "Not seventeen charts and a shrug — a focused view that tells leadership what's happening and where to look next.",
      link: "See: E-commerce Performance Dashboard →", proj: "novamart",
      tags: ["Excel", "Power BI", "Tableau", "KPI design"]
    },
    report: {
      kicker: "Automation",
      h: "Kill the weekly rebuild.",
      p: "If you're recreating the same report by hand every week, that's a workflow, not a fate. I'll turn it into something that refreshes itself.",
      link: "See: Automated Sales Reporting →", proj: "automation",
      tags: ["Power Query", "Automation", "Auditability"]
    },
    commercial: {
      kicker: "Commercial analytics",
      h: "Make the commercial trade-off visible.",
      p: "Pricing, margin, mix, scenarios — quantified so the decision is about judgement, not about whose model to trust.",
      link: "See: Pricing & Profitability Model →", proj: "pricing",
      tags: ["Scenario modeling", "Financial analysis", "Elasticity"]
    },
    automation: {
      kicker: "Process automation",
      h: "Turn the repetitive bit into a button.",
      p: "The three-times-a-week task, the copy-paste ritual, the thing everyone dreads. If it repeats, it's a candidate for automation.",
      link: "See: Automated Sales Reporting →", proj: "automation",
      tags: ["Python", "VBA", "Power Query", "AI-assisted"]
    },
    ai: {
      kicker: "AI & prototyping",
      h: "Prototype an AI-assisted workflow.",
      p: "From a vague “could AI do this?” to a small, testable prototype — using LLMs where they genuinely help, and staying honest about where they don't.",
      link: "See: SQL & analytics thinking →", proj: "sql",
      tags: ["LLMs (GPT, Claude)", "Prompt engineering", "Workflow design"]
    }
  };
  const svcCard = $("#svcCard");
  function renderService(key) {
    const s = SERVICES[key]; if (!s) return;
    svcCard.innerHTML = `
      <p class="svc-kicker">${s.kicker}</p>
      <h3>${s.h}</h3>
      <p>${s.p}</p>
      <button class="svc-link" data-open="${s.proj}">${s.link}</button>
      <ul class="svc-tags">${s.tags.map(t => `<li>${t}</li>`).join("")}</ul>`;
    svcCard.classList.remove("swap"); void svcCard.offsetWidth; svcCard.classList.add("swap");
    const link = $(".svc-link", svcCard);
    if (link) link.addEventListener("click", () => openCase(link.dataset.open));
  }
  $$(".svc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".svc-btn").forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("is-active"); btn.setAttribute("aria-selected", "true");
      renderService(btn.dataset.svc);
    });
  });
  renderService("spreadsheet");

  /* ============================================================
     EASTER EGG — Komal mode
     ============================================================ */
  const eggLaunch = $("#eggLaunch");
  const egg = $("#egg");
  const eggClose = $("#eggClose");
  function toggleEgg(open) {
    egg.classList.toggle("open", open);
    eggLaunch.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (eggLaunch) eggLaunch.addEventListener("click", () => toggleEgg(!egg.classList.contains("open")));
  if (eggClose) eggClose.addEventListener("click", () => toggleEgg(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggleEgg(false); });
  document.addEventListener("click", e => {
    if (egg.classList.contains("open") && !egg.contains(e.target) && e.target !== eggLaunch)
      toggleEgg(false);
  });

  /* konami-lite: typing "komal" anywhere opens the egg */
  let buffer = "";
  window.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea")) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-5);
    if (buffer === "komal") toggleEgg(true);
  });

})();
