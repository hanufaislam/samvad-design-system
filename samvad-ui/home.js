/* Product behaviour adapted from the supplied HTML. Current application visuals and onboarding are retained. */
(function () {
  "use strict";
  const D = window.SAMVAD_DATA;
  const $ = (q) => document.querySelector(q);
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const iconNames = {
    home: "house",
    library: "books",
    progress: "chart-bar",
    profile: "user",
    back: "arrow-left",
    chevron: "caret-right",
    search: "magnifying-glass",
    settings: "gear",
    heart: "heart",
    users: "users",
    briefcase: "briefcase",
    sparkles: "sparkle",
    shield: "shield",
    ear: "ear",
    clock: "clock",
    play: "play",
    check: "check",
    checkCircle: "check-circle",
    mic: "microphone",
    bookmark: "bookmark-simple",
    volume: "speaker-high",
    send: "paper-plane-right",
    refresh: "arrows-clockwise",
    info: "info",
    bolt: "lightning",
    lock: "lock",
    globe: "globe",
    target: "target",
    chat: "chat-circle",
  };
  const icon = (name, cl = "") =>
    `<img class="icon ${cl}" src="assets/${iconNames[name] || "chat-circle"}-regular.svg" alt="" aria-hidden="true">`;
  const avatar = (name = "Samvad") =>
    `<span class="speaker-initial" aria-hidden="true">${esc(name[0])}</span>`;
  const DEF = window.SamvadStore.defaults();
  let user = window.SamvadStore.load();
  const { demoReply, evaluateLocal } = window.SamvadPracticeLogic;
  let page = { view: "home" },
    routeStack = [],
    activePractice = null,
    toastTimeout = null,
    playing = false,
    recognizer = null,
    searchText = "";
  const completed = (id) => user.completed.includes(id);
  const mod = (id) => D.modules.find((m) => m.id === id);
  const cat = (id) => D.categories.find((c) => c.id === id);
  const lx = (k) =>
    (D.locales[user.language] || D.locales.en)[k] || D.locales.en[k] || k;
  const save = () => {
    if (!window.SamvadStore.save(user))
      notify(
        "Browser storage is unavailable. Changes will last for this session.",
      );
  };
  const dateKey = (d = new Date()) =>
    [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  const activity = () => {
    let d = dateKey();
    if (!user.activity.includes(d)) user.activity.push(d);
    save();
  };
  function notify(message) {
    let old = $(".toast");
    if (old) old.remove();
    let n = document.createElement("div");
    n.className = "toast";
    n.setAttribute("role", "status");
    n.textContent = message;
    $("#main-app").append(n);
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => n.remove(), 3300);
  }
  const progress = (m) => {
    const done =
      m.lessons.filter(completed).length +
      (user.sessions.some((s) => s.moduleId === m.id && s.valid) ? 1 : 0);
    return {
      done,
      total: m.lessons.length + 1,
      percent: Math.round((done / (m.lessons.length + 1)) * 100),
    };
  };
  const totalCompleted = () => user.completed.length;
  const root = document.createElement("main");
  root.id = "main-app";
  root.className = "home-app";
  root.hidden = true;
  root.setAttribute("aria-label", "Samvad application");
  document.body.append(root);
  const routes = new Set([
    "home",
    "library",
    "progress",
    "profile",
    "category",
    "module",
    "lesson",
    "lesson-done",
    "deep",
    "practice-intro",
    "practice",
    "review",
    "settings",
    "goals",
    "search",
    "about",
    "practice-hub",
    "legacy",
  ]);
  function routeURL(p) {
    return (
      "#" +
      p.view +
      (p.lessonId
        ? "/" + encodeURIComponent(p.lessonId)
        : p.id
          ? "/" + encodeURIComponent(p.id)
          : p.moduleId
            ? "/" + encodeURIComponent(p.moduleId)
            : "")
    );
  }
  function fromHash() {
    const [v, id] = location.hash.slice(1).split("/").map(decodeURIComponent);
    const view =
      v === "lessons"
        ? "library"
        : v === "practice" && !id
          ? "practice-hub"
          : v;
    const p = { view: routes.has(view) ? view : "home" };
    if (id) {
      if (view === "lesson") {
        p.lessonId = id;
        p.moduleId = D.modules.find((m) => m.lessons.includes(id))?.id;
      } else if (view === "practice") p.moduleId = id;
      else p.id = id;
    }
    return p;
  }
  function canLeave() {
    return (
      !(
        page.view === "practice" &&
        activePractice?.messages.some((m) => m.role === "user")
      ) ||
      confirm(
        "Leave this conversation? Your unfinished attempt will not be saved.",
      )
    );
  }
  function goto(view, props = {}, append = true) {
    if (!routes.has(view)) view = "home";
    if (view !== "review" && !canLeave()) return;
    if (page.view === "practice" && view !== "practice" && recognizer) {
      recognizer.stop();
      recognizer = null;
    }
    if (append) {
      routeStack.push({ ...page });
      window.history.pushState(
        { samvad: true, page: { view, ...props } },
        "",
        routeURL({ view, ...props }),
      );
    }
    page = { view, ...props };
    if (
      props.moduleId ||
      (view === "module" && props.id) ||
      (view === "practice-intro" && props.id)
    ) {
      const candidate = props.moduleId || props.id;
      if (mod(candidate) && !mod(candidate).comingSoon) {
        user.lastModule = candidate;
        save();
      }
    }
    if (view !== "practice" && view !== "review") activePractice = null;
    render();
    window.scrollTo(0, 0);
  }
  function goBack() {
    if (!canLeave()) return;
    if (routeStack.length) {
      window.history.back();
      return;
    }
    goto("home", {}, false);
  }
  function tab(view) {
    if (!canLeave()) return;
    goto(view, {}, true);
  }
  function nav() {
    return `<nav class="bottom-nav" aria-label="Main navigation">${["home", "library", "progress", "profile"].map((x) => `<button data-tab="${x}" ${page.view === x ? 'aria-current="page"' : ""}>${icon(x)}<span>${esc(lx(x))}</span></button>`).join("")}</nav>`;
  }
  function shell(body, { focused = false, navVisible = true } = {}) {
    const focusedElement = document.activeElement;
    const focusChoice = focusedElement?.dataset?.choice;
    const focusGoal = focusedElement?.dataset?.goal;
    const focusToggle = focusedElement?.dataset?.action?.startsWith("toggle-")
      ? focusedElement.dataset.action
      : null;
    root.dataset.view = page.view;
    root.classList.toggle("focused-app", !navVisible);
    root.innerHTML = `<div class="product-content ${focused ? "focus" : ""}">${body}</div>${navVisible ? nav() : ""}`;
    window.history.replaceState(
      { samvad: true, page: { ...page } },
      "",
      routeURL(page),
    );
    document.title =
      "Samvad · " +
      ({
        home: "Home",
        library: "Library",
        profile: "Profile",
        progress: "Progress",
      }[page.view] || page.view.replaceAll("-", " "));
    if (page.view === "lesson") {
      user.currentLesson = { ...page };
      save();
    }
    root.querySelectorAll("button").forEach((b) => {
      if (!b.getAttribute("aria-label") && !b.textContent.trim())
        b.setAttribute(
          "aria-label",
          b.dataset.action === "search" ? "Search" : "Open",
        );
    });
    const heading = root.querySelector("h1");
    if (heading) {
      heading.tabIndex = -1;
      if (page.view !== "practice") {
        const target =
          focusChoice !== undefined
            ? root.querySelector(`[data-choice="${CSS.escape(focusChoice)}"]`)
            : focusGoal
              ? root.querySelector(`[data-goal="${CSS.escape(focusGoal)}"]`)
              : focusToggle
                ? root.querySelector(`[data-action="${focusToggle}"]`)
                : null;
        (target || heading).focus({ preventScroll: true });
      }
    }
  }
  const header = (title, subtitle = "", right = "") =>
    `<header class="topbar"><div class="top-left"><h1>${esc(title)}</h1>${subtitle ? `<p class="subtitle">${esc(subtitle)}</p>` : ""}</div>${right ? `<div class="header-actions">${right}</div>` : ""}</header>`;
  const back = (title, right = "") =>
    `<div class="backrow"><button class="icon-btn" data-action="back" aria-label="Back">${icon("back")}</button><div ><h1>${esc(title)}</h1></div>${right ? `<span class="right">${right}</span>` : ""}</div>`;
  const button = (label, action, attrs = "") =>
    `<button class="primary full" data-action="${action}" ${attrs}>${label}</button>`;
  const sec = (label, action, attrs = "") =>
    `<button class="secondary full" data-action="${action}" ${attrs}>${label}</button>`;
  const sticky = (inner) => `<div class="sticky-action">${inner}</div>`;
  const heading = (h, action, label = "See all") =>
    `<div class="section-heading"><h2>${esc(h)}</h2>${action ? `<button data-action="${action}">${esc(label)} ${icon("chevron", "sm")}</button>` : ""}</div>`;
  const tile = (c) =>
    `<button class="category" data-category="${c.id}"><span class="cat-icon ${c.accent}">${icon(c.icon)}</span><span>${esc(c.title)}</span></button>`;
  function moduleCard(m) {
    return `<button class="module-card" data-module="${m.id}"><span class="tile-art ${m.accent}">${icon(m.icon)}<span class="mini-bubble">${icon("chat", "sm")}</span></span><span class="info"><h3>${esc(m.title)}</h3><p class="module-description">${esc(m.description)}</p><span class="meta">${icon("clock", "sm")} ${m.comingSoon ? "Coming soon" : `${m.lessons.length} lessons`} ${m.comingSoon ? "" : `<span class="tag">Bite-sized</span>`}</span></span><span class="forward">${icon("chevron")}</span></button>`;
  }
  function libraryCard(m) {
    return `<button class="lesson-card" data-module="${m.id}"><div class="tile-art ${m.accent}">${icon(m.icon)}</div><h3>${esc(m.title)}</h3><p class="module-description">${esc(m.description)}</p><div class="meta">${m.comingSoon ? "Coming soon" : `${m.lessons.length} lessons · Guided practice`}</div></button>`;
  }
  function home() {
    const available = D.modules.filter((m) => !m.comingSoon),
      m = available.find((x) => x.id === user.lastModule) || available[0],
      p = progress(m),
      next = m.lessons.find((id) => !completed(id));
    const overall = Object.keys(D.lessons).filter(completed).length;
    const current = next || m.lessons[0];
    shell(
      `<div class="home-topbar"><span class="brand">samvad</span><button class="language-tag" data-action="settings" aria-label="Learning language settings">${esc(D.languageNames[user.language])}</button></div><div class="welcome-home"><div><p class="eyebrow">Your ${esc(D.languageNames[user.language])} learning space</p><h1>${user.name && user.name !== "Learner" ? `Welcome, ${esc(user.name)}.` : "A little more confident."}</h1><p>One conversation at a time.</p></div><img class="character" src="assets/guide.png" alt="Your friendly Samvad guide"></div><section class="continue-card"><div class="section-kicker"><span>${p.done ? "Continue learning" : "Your next lesson"}</span><span>${esc(m.title)}</span></div><h2>${esc(next ? D.lessons[next].title : m.title)}</h2><p>${esc(m.description)}</p><div class="lesson-progress"><progress value="${p.done}" max="${p.total}" aria-label="Module learning progress"></progress><span>${p.done} of ${p.total} steps</span></div>${button(`${next ? "Start lesson" : "Practice with AI"} <span aria-hidden="true">→</span>`, next ? "next-module-lesson" : "start-practice-intro", `data-id="${m.id}"`)}</section><button class="practice-entry" data-action="practice-hub"><span class="practice-icon">${icon("mic")}</span><span><strong>A little practice, today?</strong><small>Try a real-world conversation.</small></span><span aria-hidden="true">↗</span></button><section class="journey-section"><div class="section-heading"><h2>Your learning journey</h2><button class="text-action" data-module="${m.id}">View all</button></div><ol class="journey">${m.lessons.map((id, i) => `<li class="${completed(id) ? "done" : id === next ? "current" : "upcoming"}"><span class="journey-marker" aria-hidden="true">${completed(id) ? "✓" : i + 1}</span><div><span class="lesson-state">${completed(id) ? "Completed" : id === next ? "Your next step" : "Up next"}</span><button class="lesson-link" data-lesson="${id}" data-parent="${m.id}">${esc(D.lessons[id].title)}</button></div></li>`).join("")}</ol><p class="caption">${overall} of ${Object.keys(D.lessons).length} short lessons complete</p></section><section class="section">${heading(lx("explore"), "all-skills", lx("seeAll"))}<div class="categories">${D.categories.map(tile).join("")}</div></section><section class="section">${heading(lx("recommended"), "all-skills", lx("seeAll"))}<div class="module-list">${available
        .filter((x) => x.id !== m.id)
        .map(moduleCard)
        .join("")}</div></section>`,
    );
  }
  function library() {
    let category = page.category || "all",
      depth = page.depth || "all";
    let source = D.modules.filter(
      (m) => category === "all" || m.category === category,
    );
    if (depth === "deep") {
      source = source.filter((m) => !!m.deep);
    } else if (depth === "short") {
      source = source.filter((m) => !m.comingSoon);
    }
    const filters = [
      { id: "all", title: "All", icon: "library" },
      ...D.categories,
    ];
    const depthUI = `<div class="segmented">${[
      ["all", "All Lessons"],
      ["short", "Bite-sized"],
      ["deep", "Deep Lessons"],
    ]
      .map(
        ([id, label]) =>
          `<button class="${depth === id ? "active" : ""}" data-depth="${id}">${label}</button>`,
      )
      .join("")}</div>`;
    let main = "";
    if (depth === "deep") {
      main = `<div class="lib-group"><div class="lib-grid">${source.map((m) => `<button class="lesson-card" data-deep="${m.deep}"><div class="tile-art ${m.accent}">${icon(m.icon)}</div><h3>${esc(D.deep[m.deep].title)}</h3><div class="meta">${icon("clock", "sm")} 12 min <span class="tag deep">Deep</span></div></button>`).join("")}</div></div>`;
    } else if (category !== "all") {
      main = `<section class="lib-group">${heading((cat(category) || {}).title || "Lessons")}<div class="lib-grid">${source.map(libraryCard).join("")}</div></section>`;
    } else {
      main = D.categories
        .map((c) => {
          const items = source.filter((m) => m.category === c.id);
          return items.length
            ? `<section class="lib-group">${heading(c.title, "category:" + c.id)}<div class="lib-grid">${items.map(libraryCard).join("")}</div></section>`
            : "";
        })
        .join("");
    }
    shell(
      `${header(lx("library"), "Explore lessons and build your conversation skills.", `<button class="icon-btn" data-action="search">${icon("search")}</button>`)}<div class="filter-row">${filters.map((c) => `<button class="filter-chip ${category === c.id ? "active" : ""}" data-filter="${c.id}">${icon(c.icon, "sm")}${esc(c.title)}</button>`).join("")}</div>${depthUI}${main || `<div class="empty">${icon("search")}No lessons in this category yet.</div>`}`,
    );
  }
  function category() {
    const c = cat(page.id);
    if (!c) return tab("library");
    const list = D.modules.filter((m) => m.category === c.id);
    shell(
      `${back(c.title)}<div class="module-banner ${c.accent}" ><h2>${esc(c.title)}</h2><p>${esc(c.description)}</p></div><section class="section">${heading("Modules")}<div class="module-list">${list.map(moduleCard).join("")}</div></section>`,
      { navVisible: false },
    );
  }
  function modulePage() {
    const m = mod(page.id);
    if (!m) return tab("library");
    if (m.comingSoon) {
      shell(
        `${back(m.title)}<div class="module-banner ${m.accent}"><h2>${esc(m.title)}</h2><p>${esc(m.description)}</p></div><div class="section empty">${icon("clock")}This module is being developed. Three complete modules are available in Library.<div >${sec("Explore available lessons", "go-library")}</div></div>`,
        { navVisible: false },
      );
      return;
    }
    const p = progress(m),
      next = m.lessons.find((l) => !completed(l)),
      hasPractice = user.sessions.some((s) => s.moduleId === m.id && s.valid);
    shell(
      `${back(m.title)}<div class="module-banner"><div class="eyebrow">GUIDED MODULE</div><h2 >${esc(m.title)}</h2><p>${esc(m.description)}</p><img src="assets/guide.png" alt=""/></div><div class="section"><div class="row-between mb8"><strong>${p.done} of ${p.total} steps complete</strong><span class="pill-label">${esc(m.estimated)}</span></div><div class="progressline"><span style="width:${p.percent}%"></span></div></div><section class="section">${heading("Your learning journey")}<div class="step-list">${m.lessons
        .map((id, i) => {
          const l = D.lessons[id],
            done = completed(id);
          return `<button class="step" data-lesson="${id}" data-parent="${m.id}"><span class="number ${done ? "done" : ""}">${done ? icon("check", "sm") : i + 1}</span><span class="details"><h3>${esc(l.title)}</h3><p>${l.minutes} min · Bite-sized${done ? " · Completed" : ""}</p></span><span class="trailing">${icon(done ? "checkCircle" : "chevron")}</span></button>`;
        })
        .join(
          "",
        )}<button class="step" data-practice-intro="${m.id}"><span class="number ${hasPractice ? "done" : ""}">${hasPractice ? icon("check", "sm") : icon("mic", "sm")}</span><span class="details"><h3>Practice with AI</h3><p>Open-ended conversation · 4–6 min${hasPractice ? " · Completed" : ""}</p></span><span class="trailing">${icon("chevron")}</span></button></div></section><section class="section">${heading("Go deeper")}<button class="module-card" data-deep="${m.deep}"><span class="tile-art lavender">${icon("bookmark")}</span><span class="info"><h3>${esc(D.deep[m.deep].title)}</h3><span class="meta">12 min <span class="tag deep">Deep lesson · Optional</span></span></span><span class="forward">${icon("chevron")}</span></button></section>${sticky(button(next ? "Continue learning" : "Practice with AI", next ? "next-module-lesson" : "start-practice-intro", `data-id="${m.id}"`))}`,
      { focused: true, navVisible: false },
    );
  }
  function ldata(id) {
    let l = D.lessons[id];
    return id === "comfort-1" && D.localizedFirst[user.language]
      ? { ...l, ...D.localizedFirst[user.language] }
      : l;
  }
  function lessonPage() {
    const m = mod(page.moduleId),
      l = ldata(page.lessonId);
    if (!m || !l) return tab("library");
    const segment = page.segment || "watch",
      idx = page.line || 0,
      lines = l.dialogue,
      ready = segment === "check" && page.choice !== undefined;
    const steps = ["watch", "learn", "examples", "check"];
    const intro = `${back(l.title, `<small>${m.lessons.indexOf(l.id) + 1}/${m.lessons.length}</small>`)}<div class="learning-head"><div class="top-note"><span>${esc(m.title)}</span><span>${esc(l.minutes)} min · Bite-sized</span></div><div class="progressline"><span style="width:${((steps.indexOf(segment) + 1) / steps.length) * 100}%"></span></div></div><div class="segmented">${steps.map((s) => `<button data-segment="${s}" class="${segment === s ? "active" : ""}">${{ watch: "Watch", learn: "Learn", examples: "Examples", check: "Check" }[s]}</button>`).join("")}</div>`;
    let body = "";
    if (segment === "watch") {
      const cur = lines[Math.min(idx, lines.length - 1)];
      body = `<div class="scene"><img src="assets/guide.png" alt="Your Samvad guide"/><div class="dialogue-overlay"><div class="dialogue-bubble ${cur[0] === "Priya" ? "right" : ""}"><strong>${esc(cur[0])}</strong>${user.captions ? esc(cur[1]) : '<span class="caption">Captions off · Use Read aloud or enable captions in Settings.</span>'}</div></div></div><div class="audio-card"><button data-action="read-line" aria-label="Read current line aloud">${icon("volume")}</button><div class="audio-lines">${[7, 15, 11, 22, 13, 17, 9, 20, 10, 15, 7, 18, 12, 23, 9, 15, 12, 18, 11, 8].map((h) => `<i style="--h:${h}px"></i>`).join("")}</div><small>${idx + 1} of ${lines.length}</small></div><section class="section"><h2>What's happening here?</h2><p class="explain">Listen to how the characters respond to each other. Notice what makes the conversation feel supportive and natural.</p></section>`;
    } else if (segment === "learn") {
      body = `<div class="section" ><div class="info-panel"><h2>Why this matters</h2><p>${esc(l.why)}</p></div><section class="section">${heading("What you can do")}${l.principles.map((p, i) => `<div class="principle"><span class="number">${i + 1}</span><span>${esc(p)}</span></div>`).join("")}</section></div>`;
    } else if (segment === "examples") {
      body = `<section class="section" >${heading("Compare the responses")}<div class="example good"><strong>${icon("checkCircle")} More supportive in this context</strong>“${esc(l.good)}”</div><div class="example bad"><strong>${icon("info")} Less helpful in this context</strong>“${esc(l.bad)}”</div><p class="explain">There is rarely only one perfect response. Focus on the intention and the person's situation rather than memorizing a script.</p></section>`;
    } else {
      body = `<section class="section" >${heading("Quick check")}<h3 >${esc(l.question)}</h3>${l.answers.map((a, i) => `<button class="option ${page.choice === i ? (i === l.correct ? "correct" : "incorrect") : ""}" data-choice="${i}" aria-pressed="${page.choice === i}"><span class="radio"></span>${esc(a)}</button>`).join("")}${ready ? `<div class="result-hint" role="status"><strong>${page.choice === l.correct ? "Well observed." : "Consider the situation again."}</strong><div >${esc(l.why)}</div></div>` : ""}</section>`;
    }
    let action = "",
      label = "";
    if (segment === "watch") {
      action = idx + 1 < lines.length ? "next-line" : "next-segment";
      label = idx + 1 < lines.length ? "Next line" : "Continue to learn";
    } else if (segment === "learn") {
      action = "next-segment";
      label = "See examples";
    } else if (segment === "examples") {
      action = "next-segment";
      label = "Take quick check";
    } else {
      action = "finish-lesson";
      label = "Complete lesson";
    }
    shell(
      `${intro}${body}${sticky(button(`${esc(label)} ${icon("chevron", "sm")}`, action, segment === "check" && !ready ? "disabled" : ""))}`,
      { focused: true, navVisible: false },
    );
  }
  function completeLesson() {
    if (page.choice === undefined || !D.lessons[page.lessonId]) return;
    if (!user.completed.includes(page.lessonId))
      user.completed.push(page.lessonId);
    activity();
    save();
    const m = mod(page.moduleId),
      next = m.lessons.find((id) => !completed(id));
    goto(
      "lesson-done",
      { moduleId: m.id, lessonId: page.lessonId, next },
      true,
    );
  }
  function lessonDone() {
    const m = mod(page.moduleId),
      l = D.lessons[page.lessonId];
    shell(
      `${back("Lesson complete")}<div class="review-head" ><div class="icon-wrap">${icon("checkCircle", "lg")}</div><h2>One step forward!</h2><p class="caption">You completed “${esc(l.title)}”.</p></div><section class="section"><div class="scenario"><strong >What you learned</strong><p >${esc(l.why)}</p></div></section><section class="section"><h2>Keep the momentum</h2><p class="explain">Put what you learned into practice with the next lesson or an unscripted conversation.</p></section>${sticky(`${button(page.next ? "Next lesson" : "Practice with AI", page.next ? "done-next-lesson" : "start-practice-intro", `data-id="${m.id}"`)}<div >${sec("Back to module", "back-module", `data-id="${m.id}"`)}</div>`)}`,
      { focused: true, navVisible: false },
    );
  }
  function deepPage() {
    const d = D.deep[page.id];
    if (!d) return tab("library");
    const p = page.part || 0;
    const s = d.sections[Math.min(p, d.sections.length - 1)];
    const done = user.deepCompleted.includes(d.id);
    shell(
      `${back(d.title, `<small>${Math.min(p + 1, d.sections.length)}/${d.sections.length}</small>`)}<div class="row-between"><span class="tag deep">Deep lesson · 12 min</span>${done ? `<span class="tag">Completed</span>` : ""}</div><div class="progressline mt14"><span style="width:${((p + 1) / d.sections.length) * 100}%"></span></div><div class="scene" ><img src="assets/guide.png" alt="Your Samvad guide" /></div><section class="section"><span class="eyebrow">CHAPTER ${p + 1}</span><h2 >${esc(s.title)}</h2><p class="explain">${esc(s.text)}</p><div class="info-panel" ><strong>Reflect</strong><p >How would you respond differently in this situation? Consider the other person's context, not only the words you might say.</p></div></section><div class="info-panel"><strong>Reflection prompt</strong><p>${esc(d.prompt)}</p></div>${sticky(button(p + 1 < d.sections.length ? "Continue to next chapter" : "Finish deep lesson", p + 1 < d.sections.length ? "deep-next" : "deep-finish"))}`,
      { focused: true, navVisible: false },
    );
  }
  function deepFinish() {
    const d = D.deep[page.id];
    if (!user.deepCompleted.includes(d.id)) user.deepCompleted.push(d.id);
    activity();
    save();
    goto("module", { id: d.module });
  }
  function practiceIntro() {
    const m = mod(page.id),
      sc =
        D.scenarios[m.id]?.[
          Number.isInteger(page.scenarioIndex)
            ? page.scenarioIndex
            : user.sessions.filter((s) => s.moduleId === m.id).length % 2
        ];
    if (!sc) return goto("module", { id: m.id });
    shell(
      `${back("Practice with AI")}<div class="practice-hero"><div class="eyebrow">REAL-WORLD CONVERSATION</div><div class="practice-avatar">${avatar(sc.name)}</div><h2 >Meet ${esc(sc.name)}</h2><p class="explain" >No fixed answers. Just you and the conversation.</p></div><div class="scenario"><h3>Your scenario</h3><p>${esc(sc.description)}</p><div class="divider"></div><strong class="small">Your goal</strong><p >${esc(sc.goal)}</p></div><div class="scenario"><div class="row-between"><strong class="small">Practice language</strong><span class="pill-label">${esc(D.languageNames[user.language])}</span></div><div class="toggle-row"><span>Read spoken responses aloud</span><button class="switch ${user.voice ? "on" : ""}" data-action="toggle-voice" aria-label="Toggle spoken responses" aria-pressed="${user.voice}"><span></span></button></div></div><p class="privacy-note">Microphone is optional. You can type instead. This prototype retains conversation text locally when you end an attempt, including partial attempts. Your browser’s speech service may process microphone audio; Samvad does not save audio recordings.</p><div class="disclaimer" >Demo mode: character replies use local scenario rules, not a live AI model. Scenario text is authored in English.</div>${sticky(button("Start conversation", "practice-begin", `data-id="${m.id}"`))}`,
      { focused: true, navVisible: false },
    );
  }
  function startPractice(id) {
    const all = D.scenarios[id];
    if (!all) return;
    const idx = Number.isInteger(page.scenarioIndex)
      ? page.scenarioIndex
      : user.sessions.filter((s) => s.moduleId === id).length % all.length;
    const sc = all[idx];
    activePractice = {
      moduleId: id,
      scenario: sc,
      scenarioIndex: idx,
      messages: [{ role: "assistant", name: sc.name, text: sc.opening }],
      startedAt: Date.now(),
      sending: false,
    };
    routeStack.push({ ...page });
    page = { view: "practice", moduleId: id };
    window.history.pushState(
      { samvad: true, page: { ...page } },
      "",
      routeURL(page),
    );
    render();
    if (user.voice) readAloud(sc.opening);
  }
  function practicePage() {
    if (!activePractice) return goto("practice-intro", { id: page.moduleId });
    const a = activePractice,
      n = a.messages.filter((m) => m.role === "user").length;
    const thinking = a.sending
      ? `<div class="chat-row"><span class="chat-avatar">${esc(a.scenario.name[0])}</span><div class="chat-bubble"><small>${esc(a.scenario.name)}</small>Thinking…</div></div>`
      : "";
    const chat = a.messages
      .map(
        (m) =>
          `<div class="chat-row ${m.role === "user" ? "user" : ""}"><span class="chat-avatar">${m.role === "user" ? "You" : esc(a.scenario.name[0])}</span><div class="chat-bubble"><small>${m.role === "user" ? "You" : esc(a.scenario.name)}</small>${esc(m.text)}</div></div>`,
      )
      .join("");
    shell(
      `${back("Practice with AI", `<span class="pill-label">Demo mode</span>`)}<div class="top-note"><span>${esc(a.scenario.description)}</span><span>${n} turns</span></div><div class="chat-area" id="chat-area">${chat}${thinking}</div><div class="composer"><div class="end"><small>Speak in your own words. No scripted answers.</small><button data-action="end-practice">End practice</button></div><form id="practice-form" class="input-row"><button type="button" class="mic ${recognizer ? "recording" : ""}" data-action="mic" title="Use microphone" aria-label="Use microphone">${icon("mic")}</button><input id="composer-input" autocomplete="off" maxlength="1000" required value="${esc(a.draft || "")}" placeholder="Type your response…" aria-label="Your response" ${a.sending ? "disabled" : ""}/><button type="submit" class="send" aria-label="Send response" ${a.sending ? "disabled" : ""}>${icon("send")}</button></form></div>`,
      { navVisible: false },
    );
    setTimeout(() => {
      let el = $("#chat-area");
      if (el) el.scrollIntoView({ block: "end" });
    }, 0);
  }
  const recognizeAvailable = !!(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );
  function startMic() {
    if (!recognizeAvailable) {
      notify(
        "Speech input is not available in this browser. Type your response instead.",
      );
      return;
    }
    if (recognizer) {
      recognizer.stop();
      recognizer = null;
      render();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang =
      { en: "en-IN", hi: "hi-IN", te: "te-IN" }[user.language] || "en-IN";
    rec.interimResults = false;
    rec.continuous = false;
    recognizer = rec;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      recognizer = null;
      const input = $("#composer-input");
      if (input) input.value = transcript;
      if (activePractice) activePractice.draft = transcript;
      notify("Speech captured. Review the text and send.");
    };
    rec.onerror = (e) => {
      recognizer = null;
      notify(
        e.error === "not-allowed"
          ? "Microphone permission was denied. You can type instead."
          : "Could not recognize speech. You can type your reply.",
      );
      render();
    };
    rec.onend = () => {
      recognizer = null;
      const mic = $(".mic");
      if (mic) mic.classList.remove("recording");
    };
    try {
      rec.start();
      render();
    } catch {
      recognizer = null;
      notify("Microphone unavailable. Use text input.");
    }
  }
  function readAloud(text) {
    if (!user.voice || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang =
        { en: "en-IN", hi: "hi-IN", te: "te-IN" }[user.language] || "en-IN";
      u.rate = 0.94;
      window.speechSynthesis.speak(u);
    } catch {}
  }
  function stopAudio() {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  function sendPractice(text) {
    if (!activePractice || activePractice.sending || !text.trim()) return;
    const a = activePractice;
    a.messages.push({
      role: "user",
      name: "You",
      text: text.trim().slice(0, 1000),
    });
    a.draft = "";
    const reply = demoReply(text, a);
    a.messages.push({ role: "assistant", name: a.scenario.name, text: reply });
    render();
    $("#composer-input")?.focus({ preventScroll: true });
    readAloud(reply);
  }
  function endPractice() {
    if (!activePractice) return;
    stopAudio();
    if (recognizer) {
      recognizer.stop();
      recognizer = null;
    }
    const a = activePractice,
      review = evaluateLocal(a);
    const session = {
      id: "s" + Date.now(),
      moduleId: a.moduleId,
      scenarioName: a.scenario.name,
      scenarioDescription: a.scenario.description,
      scenarioIndex: a.scenarioIndex,
      messages: a.messages,
      date: new Date().toISOString(),
      duration: Math.max(1, Math.round((Date.now() - a.startedAt) / 1000)),
      valid: review.status === "completed",
      mode: "demo",
      review,
    };
    user.sessions.unshift(session);
    user.sessions = user.sessions.slice(0, 30);
    if (session.valid) activity();
    save();
    activePractice = null;
    goto("review", { id: session.id }, true);
  }
  function reviewPage() {
    const s = user.sessions.find((x) => x.id === page.id);
    if (!s) return tab("progress");
    const r = s.review,
      m = mod(s.moduleId),
      tabName = page.tab || "summary";
    const top = `<div class="disclaimer">Demo review: authored local rules, not live AI evaluation. Findings may miss nuance.</div>${back("Your feedback", `<small>${s.valid ? "Practice complete" : "Partial session"}</small>`)}<div class="review-head"><div class="icon-wrap">${icon(s.valid ? "checkCircle" : "info", "lg")}</div><h2>${s.valid ? "Practice complete" : "Not enough to review"}</h2><p class="caption">${esc(m.title)} · ${new Date(s.date).toLocaleDateString()} · ${s.messages.filter((x) => x.role === "user").length} turns</p></div><div class="segmented mt14">${[
      ["summary", "Summary"],
      ["details", "Details"],
      ["transcript", "Transcript"],
    ]
      .map(
        ([id, label]) =>
          `<button data-review-tab="${id}" class="${tabName === id ? "active" : ""}">${label}</button>`,
      )
      .join("")}</div>`;
    let content = "";
    if (tabName === "summary") {
      content = `<section class="section"><h2>How it went</h2><p class="explain">${esc(r.summary)}</p></section>${r.strengths.length ? `<div class="scenario" ><strong class="success-text">${icon("checkCircle", "sm")} What worked well</strong>${r.strengths.map((x) => `<p >${icon("check", "sm")} ${esc(x)}</p>`).join("")}</div>` : ""}<section class="section">${heading("Areas to improve")}${r.issues.length ? r.issues.map((i, n) => `<div class="review-issue"><h3>${n + 1}. ${esc(i.title)}</h3><p>${esc(i.why)}</p><blockquote>“${esc(i.evidence)}”</blockquote><strong class="small">Try instead</strong><p >“${esc(i.alternative)}”</p></div>`).join("") : `<div class="feedback-empty">${icon("checkCircle", "sm")} ${r.status === "insufficient" ? "There were not enough turns for a reliable review. Try another conversation." : "No significant improvement areas detected by this review."}</div>`}</section>`;
    } else if (tabName === "details") {
      content = `<section class="section">${heading("Evidence & suggestions")}${r.issues.length ? r.issues.map((i) => `<div class="review-issue"><h3>${esc(i.title)}</h3><p><strong>Observed response</strong></p><blockquote>${esc(i.evidence)}</blockquote><p><strong>Why it matters</strong><br>${esc(i.why)}</p><p><strong>Retry focus</strong><br>${esc(i.focus)}</p></div>`).join("") : `<div class="feedback-empty">There are no supported concerns to highlight in this attempt.</div>`}</section><div class="disclaimer mt14">The feedback addresses observable responses in this scenario, not personality or emotional intelligence. Voice fluency and accents are not assessed here.</div>`;
    } else {
      content = `<section class="section">${heading("Conversation transcript")}${s.messages.map((msg) => `<div class="transcript-item"><strong>${msg.role === "user" ? "You" : esc(s.scenarioName)}</strong>${esc(msg.text)}</div>`).join("")}</section><div class="disclaimer">Transcript is saved in this browser only. Delete it from Profile → Clear local progress.</div>`;
    }
    shell(
      `${top}${content}<section class="section"><h2>Recommended next step</h2><p class="explain">${r.issues[0] ? esc("Practice focus: " + r.issues[0].focus) : "Try a new version of the situation to strengthen your skill."}</p></section>${sticky(`${button(`${icon("refresh", "sm")} Practice again`, "retry-practice", `data-id="${s.moduleId}" data-scenario="${s.scenarioIndex}"`)}<div >${sec(m.lessons.some((id) => !completed(id)) ? "Continue to next lesson" : "Back to module", "review-next", `data-id="${s.moduleId}"`)}</div>`)}`,
      { focused: true, navVisible: false },
    );
  }
  function streakCount() {
    let n = 0,
      d = new Date();
    for (let i = 0; i < 365; i++) {
      if (user.activity.includes(dateKey(d))) n++;
      else if (i > 0 || user.activity.length === 0) break;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }
  function progressPage() {
    const all = D.modules.filter((m) => !m.comingSoon),
      total = all.reduce((s, m) => s + m.lessons.length, 0),
      done = totalCompleted(),
      practiceCount = user.sessions.filter((s) => s.valid).length,
      percent = Math.min(100, Math.round((done / Math.max(total, 1)) * 100));
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const start = new Date();
    let dayOfWeek = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dayOfWeek);
    const week = days
      .map((d, i) => {
        let dt = new Date(start);
        dt.setDate(start.getDate() + i);
        let yes = user.activity.includes(dateKey(dt));
        return `<div class="day"><div class="dot ${yes ? "done" : ""}">${yes ? icon("check", "sm") : ""}</div>${d}</div>`;
      })
      .join("");
    const lines = D.categories
      .map((c) => {
        let mods = all.filter((m) => m.category === c.id),
          lessons = mods.flatMap((m) => m.lessons),
          d = lessons.filter(completed).length,
          p = lessons.length ? Math.round((d / lessons.length) * 100) : 0;
        return `<div class="skill-line"><div class="cat-icon ${c.accent}">${icon(c.icon)}</div><div class="info"><div class="label"><span>${esc(c.title)}</span><span class="muted">${d}/${lessons.length}</span></div><div class="progressline"><span style="width:${p}%"></span></div></div></div>`;
      })
      .join("");
    shell(
      `${header(lx("progress"), "Small steps. Big change.")}<div class="progress-card"><div class="row-between"><div><span class="eyebrow">LEARNING CONSISTENCY</span><h2 >${streakCount()} day streak</h2></div><div class="cat-icon butter" >${icon("bolt", "lg")}</div></div><div class="streak-day-row">${week}</div></div><div class="progress-card overall"><strong >Your learning progress</strong><div class="row-between mt14"><div class="ring" style="--value:${percent}%"><strong>${percent}%</strong></div><div ><strong >${done} of ${total} lessons</strong><p class="caption">Curriculum completion—not a rating of your communication ability.</p></div></div><div class="metric-row"><div class="metric"><strong>${done}</strong><span>Lessons</span></div><div class="metric"><strong>${practiceCount}</strong><span>Practices</span></div><div class="metric"><strong>${new Set(user.completed.map((x) => mod(D.modules.find((m) => m.lessons.includes(x))?.id)?.category).filter(Boolean)).size}</strong><span>Skills explored</span></div></div></div><section class="section">${heading("Skills overview")}<div class="progress-card">${lines}</div></section><section class="section">${heading("Recent practice")}${
        user.sessions.length
          ? `<div class="module-list">${user.sessions
              .slice(0, 3)
              .map(
                (s) =>
                  `<button class="module-card" data-review="${s.id}"><span class="tile-art sky">${icon("mic")}</span><span class="info"><h3>${esc(mod(s.moduleId).title)}</h3><span class="meta">${new Date(s.date).toLocaleDateString()} · ${s.valid ? "Review available" : "Partial attempt"}</span></span><span class="forward">${icon("chevron")}</span></button>`,
              )
              .join("")}</div>`
          : `<div class="empty">${icon("mic")}No practice sessions yet. Finish a lesson and start your first conversation.</div>`
      }</section>`,
    );
  }
  function profilePage() {
    const achievements = [
      ["First Lesson", "bookmark", user.completed.length >= 1, "butter"],
      ["First AI Practice", "mic", user.sessions.some((s) => s.valid), "sky"],
      ["3-Day Streak", "bolt", streakCount() >= 3, "pink"],
    ];
    shell(
      `${header(lx("profile"), "Your learning space.", `<button class="icon-btn" data-action="settings" aria-label="Settings">${icon("settings")}</button>`)}<div class="profile-card"><div class="profile-avatar">${avatar(user.name)}</div><div><h2>${esc(user.name)}</h2><p class="caption" >Learning to communicate more thoughtfully.</p><span class="pill-label">Growing every day</span></div></div><section class="section">${heading(lx("goals"), "edit-goals", "Edit")}<div class="goal-grid">${user.goals
        .slice(0, 3)
        .map(
          (g, i) =>
            `<div class="goal-card ${["sky", "mint", "pink"][i]}">${icon(["target", "briefcase", "heart"][i])}<div>${esc(g)}</div></div>`,
        )
        .join(
          "",
        )}</div></section><section class="section">${heading("Achievements")}<p class="caption">Practice achievements include completed demo sessions.</p><div class="achievements">${achievements.map(([name, ico, active, color]) => `<div class="achievement"><div class="badge-icon ${active ? color : "lavender"}" >${icon(active ? ico : "lock", "lg")}</div><small>${esc(name)}</small></div>`).join("")}</div></section><section class="section"><div class="section-heading"><h2>Earlier preview</h2></div><button class="secondary full" data-action="legacy">Earlier sample activities</button><p class="caption">Your original practice draft remains available in Practice.</p>${heading(lx("settings"))}<div class="setting-list"><button class="setting-row" data-action="settings">${icon("globe")}<span>Language</span><small>${esc(D.languageNames[user.language])}</small>${icon("chevron", "sm")}</button><button class="setting-row" data-action="settings">${icon("mic")}<span>Voice & captions</span>${icon("chevron", "sm")}</button><button class="setting-row" data-action="settings">${icon("shield")}<span>Privacy & data</span>${icon("chevron", "sm")}</button><button class="setting-row" data-action="about">${icon("info")}<span>About Samvad</span>${icon("chevron", "sm")}</button></div></section>`,
    );
  }
  function settingsPage() {
    shell(
      `${back("Settings")}<section class="section" >${heading("Learning language")}<label class="input-label" for="language">Preferred language</label><select class="select" id="language">${Object.entries(
        D.languageNames,
      )
        .map(
          ([code, name]) =>
            `<option value="${code}" ${user.language === code ? "selected" : ""}>${esc(name)}</option>`,
        )
        .join(
          "",
        )}</select><p class="caption">The first comfort lesson and shared labels are localized in Hindi and Telugu. Other authored lessons and demo scenarios use English. Voice availability depends on your browser.</p></section><section class="section">${heading("Voice and accessibility")}<div class="setting-list"><div class="toggle-row"><span>Read dialogue aloud</span><button class="switch ${user.voice ? "on" : ""}" data-action="toggle-voice" aria-label="Read dialogue aloud" aria-pressed="${user.voice}"><span></span></button></div><div class="divider" ></div><div class="toggle-row"><span>Show captions</span><button class="switch ${user.captions ? "on" : ""}" data-action="toggle-captions" aria-label="Show captions" aria-pressed="${user.captions}"><span></span></button></div></div></section><section class="section">${heading("Local data")}<p class="explain">Lesson completions and practice transcripts are stored in this browser. Audio recordings are not saved by this prototype. No live AI backend is connected in this build. Browser speech services may process microphone audio when you choose to use them.</p><button class="secondary full" data-action="reset">Clear all local progress and transcripts</button></section><section class="section"><div class="disclaimer">This is a product prototype, not a psychological or clinical assessment tool. Review observations are contextual and may be imperfect.</div></section>`,
      { navVisible: false },
    );
  }
  function goalsPage() {
    const opts = [
      "Be more confident",
      "Communicate with empathy",
      "Build stronger relationships",
      "Improve workplace communication",
      "Listen more actively",
      "Manage difficult conversations",
      ...user.goals,
    ];
    shell(
      `${back("Learning goals")}<p class="explain">Choose up to three goals to shape your learning experience.</p><div class="step-list mt25">${[...new Set(opts)].map((g) => `<button class="step" data-goal="${esc(g)}"><span class="number ${user.goals.includes(g) ? "done" : ""}">${user.goals.includes(g) ? icon("check", "sm") : icon("target", "sm")}</span><span class="details"><h3>${esc(g)}</h3></span></button>`).join("")}</div>${sticky(button("Save goals", "save-goals"))}`,
      { navVisible: false, focused: true },
    );
  }
  function searchPage() {
    const matches = D.modules.filter((m) =>
      `${m.title} ${m.description} ${(cat(m.category) || {}).title}`
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    );
    shell(
      `${back("Search")}<input class="search-input" id="search-input" aria-label="Search lessons and skills" autocomplete="off" placeholder="${esc(lx("search"))}" value="${esc(searchText)}"/><section class="section">${heading(searchText ? "Search results" : "Popular skills")}<div class="module-list">${matches.length ? matches.map(moduleCard).join("") : `<div class="empty">${icon("search")}No lessons found. Try a different topic or category.</div>`}</div></section>`,
      { navVisible: false },
    );
  }
  function aboutPage() {
    shell(
      `${back("About Samvad")}<div class="hero" ><h2>Listen. Understand. Speak. Improve.</h2><p>Communication learning through realistic conversations.</p><img src="assets/guide.png" alt=""/></div><section class="section"><h2>About this build</h2><p class="explain">Samvad is a mobile-first working prototype following the product specification. Core lessons, navigation, progress, and reviews work locally. Voice input depends on browser support. Live AI roleplay requires a server-side API key; without it, the app uses a clearly labeled demo simulation.</p></section><section class="section"><div class="disclaimer">Practice feedback is instructional, not a measure of personality or emotional intelligence. In demo mode, it uses limited, rule-based text analysis and may miss nuance.</div></section>`,
      { navVisible: false },
    );
  }
  function practiceHub() {
    shell(
      `${header("Practice", "A little space to try it in your own words.")}<div class="disclaimer">Demo conversations use authored replies and a limited local review rubric. No live AI service is connected.</div><section class="section">${heading("Choose a conversation")}<div class="module-list">${D.modules
        .filter((m) => D.scenarios[m.id])
        .map(
          (m) =>
            `<button class="module-card" data-practice-intro="${m.id}"><span class="tile-art">${icon(m.icon)}</span><span class="info"><h3>${esc(m.title)}</h3><p class="module-description">${esc(m.description)}</p><span class="meta">${D.scenarios[m.id].length} authored scenarios · Demo</span></span><span class="forward">${icon("chevron")}</span></button>`,
        )
        .join(
          "",
        )}</div></section><section class="section">${heading("Your writing draft")}<label class="input-label" for="saved-draft">Your conversation starter</label><textarea id="saved-draft" rows="4" placeholder="I’d ask…">${esc(user.draft)}</textarea>${button("Save my draft", "save-draft")}<p class="caption">Saved in this browser. This is your original writing practice space.</p></section>`,
      { navVisible: true },
    );
  }
  function legacyPage() {
    const items = window.SAMVAD_LEGACY || [],
      l = items.find((x) => x.id === page.id);
    if (!l) {
      shell(
        `${back("Earlier sample activities")}<p class="explain">Your original preview exercises and completion records are retained here. These are separate from the authored curriculum.</p><div class="module-list">${items.map((x) => `<button class="module-card" data-legacy="${x.id}"><span class="tile-art">${icon(user.legacyCompleted.includes(x.id) ? "checkCircle" : "bookmark")}</span><span class="info"><h3>${esc(x.title)}</h3><span class="meta">${user.legacyCompleted.includes(x.id) ? "Completed" : "Earlier sample activity"}</span></span></button>`).join("")}</div>`,
        { navVisible: false },
      );
      return;
    }
    const selected = Number.isInteger(page.legacyChoice);
    shell(
      `${back(l.title)}<h2>${esc(l.question)}</h2><div class="options">${l.answers.map((a, i) => `<button class="option" aria-pressed="${page.legacyChoice === i}" data-action="legacy-answer" data-index="${i}">${esc(a)}</button>`).join("")}</div>${selected ? `<div class="info-panel" role="status"><blockquote>${esc(l.answers[page.legacyChoice])}</blockquote><p>${esc(l.feedback[page.legacyChoice])}</p></div>${button("Finish sample activity", "legacy-finish")}` : ""}`,
      { navVisible: false },
    );
  }
  function confirmReset() {
    const dialog = document.createElement("dialog");
    dialog.className = "learning-dialog";
    dialog.setAttribute("aria-labelledby", "reset-heading");
    dialog.innerHTML =
      '<h2 id="reset-heading">Clear local Samvad data?</h2><p>This deletes lesson progress, transcripts, writing drafts, goals and preferences from this browser. Language returns to English.</p><button class="primary" id="confirm-reset">Clear local data</button><button class="quiet" id="cancel-reset">Keep my data</button>';
    document.body.append(dialog);
    const opener = document.activeElement;
    dialog.addEventListener("close", () => {
      dialog.remove();
      if (opener?.isConnected) opener.focus();
    });
    dialog.querySelector("#cancel-reset").onclick = () => dialog.close();
    dialog.querySelector("#confirm-reset").onclick = () => {
      user = window.SamvadStore.defaults();
      save();
      try {
        localStorage.removeItem("samvad-v1");
      } catch {}
      activePractice = null;
      dialog.close();
      goto("home", {}, false);
      notify("Local progress and transcripts cleared.");
    };
    dialog.showModal();
    dialog.querySelector("#cancel-reset").focus();
  }

  function render() {
    stopAudio();
    if (["module", "practice-intro"].includes(page.view) && !mod(page.id))
      page = { view: "library" };
    if (
      page.view === "lesson" &&
      (!D.lessons[page.lessonId] || !mod(page.moduleId))
    )
      page = { view: "library" };
    if (
      page.view === "lesson-done" &&
      (!D.lessons[page.lessonId] || !mod(page.moduleId))
    )
      page = { view: "home" };
    const view = page.view;
    switch (view) {
      case "home":
        return home();
      case "library":
        return library();
      case "progress":
        return progressPage();
      case "profile":
        return profilePage();
      case "category":
        return category();
      case "module":
        return modulePage();
      case "lesson":
        return lessonPage();
      case "lesson-done":
        return lessonDone();
      case "deep":
        return deepPage();
      case "practice-intro":
        return practiceIntro();
      case "practice":
        return practicePage();
      case "practice-hub":
        return practiceHub();
      case "legacy":
        return legacyPage();
      case "review":
        return reviewPage();
      case "settings":
        return settingsPage();
      case "goals":
        return goalsPage();
      case "search":
        return searchPage();
      case "about":
        return aboutPage();
      default:
        return home();
    }
  }
  function handleClick(e) {
    const target = e.target.closest(
      "[data-action],[data-tab],[data-category],[data-module],[data-lesson],[data-deep],[data-depth],[data-filter],[data-segment],[data-choice],[data-practice-intro],[data-review-tab],[data-review],[data-goal],[data-legacy]",
    );
    if (!target) return;
    if (target.dataset.legacy)
      return goto("legacy", { id: target.dataset.legacy });
    if (target.dataset.tab) return tab(target.dataset.tab);
    if (target.dataset.category)
      return goto("category", { id: target.dataset.category });
    if (target.dataset.module)
      return goto("module", { id: target.dataset.module });
    if (target.dataset.deep)
      return goto("deep", { id: target.dataset.deep, part: 0 });
    if (target.dataset.lesson)
      return goto("lesson", {
        moduleId:
          target.dataset.parent ||
          D.modules.find((m) => m.lessons.includes(target.dataset.lesson))?.id,
        lessonId: target.dataset.lesson,
        segment: "watch",
        line: 0,
      });
    if (target.dataset.practiceIntro)
      return goto("practice-intro", { id: target.dataset.practiceIntro });
    if (target.dataset.review)
      return goto("review", { id: target.dataset.review });
    if (target.dataset.depth) {
      page.depth = target.dataset.depth;
      render();
      return;
    }
    if (target.dataset.filter) {
      page.category = target.dataset.filter;
      render();
      return;
    }
    if (target.dataset.segment) {
      page.segment = target.dataset.segment;
      render();
      return;
    }
    if (target.dataset.choice !== undefined) {
      page.choice = Number(target.dataset.choice);
      render();
      return;
    }
    if (target.dataset.reviewTab) {
      page.tab = target.dataset.reviewTab;
      render();
      return;
    }
    if (target.dataset.goal) {
      const g = target.dataset.goal;
      if (user.goals.includes(g))
        user.goals = user.goals.filter((x) => x !== g);
      else if (user.goals.length < 3) user.goals.push(g);
      else notify("Choose up to three goals.");
      render();
      return;
    }
    const action = target.dataset.action;
    switch (action) {
      case "practice-hub":
        return goto("practice-hub");
      case "save-draft":
        user.draft = $("#saved-draft").value;
        save();
        notify("Draft saved in this browser.");
        return;
      case "legacy":
        return goto("legacy");
      case "legacy-answer":
        page.legacyChoice = Number(target.dataset.index);
        return render();
      case "legacy-finish":
        if (!user.legacyCompleted.includes(page.id))
          user.legacyCompleted.push(page.id);
        save();
        notify("Earlier preview activity completed.");
        return goto("legacy");
      case "back":
        return goBack();
      case "search":
        return goto("search");
      case "all-skills":
        return tab("library");
      case "go-library":
        return tab("library");
      case "settings":
        return goto("settings");
      case "about":
        return goto("about");
      case "edit-goals":
        return goto("goals");
      case "save-goals":
        save();
        notify("Goals saved.");
        return goBack();
      case "toggle-voice":
        user.voice = !user.voice;
        save();
        return render();
      case "toggle-captions":
        user.captions = !user.captions;
        save();
        return render();
      case "reset":
        return confirmReset();
      case "next-module-lesson": {
        const m = mod(target.dataset.id),
          id = m.lessons.find((x) => !completed(x));
        if (
          user.currentLesson?.moduleId === m.id &&
          !completed(user.currentLesson.lessonId)
        )
          return goto("lesson", { ...user.currentLesson });
        if (id)
          return goto("lesson", {
            moduleId: m.id,
            lessonId: id,
            segment: "watch",
            line: 0,
          });
        return goto("practice-intro", { id: m.id });
      }
      case "start-practice-intro":
        return goto("practice-intro", { id: target.dataset.id });
      case "next-line":
        page.line = (page.line || 0) + 1;
        return render();
      case "next-segment": {
        const segments = ["watch", "learn", "examples", "check"];
        page.segment =
          segments[
            Math.min(
              segments.length - 1,
              segments.indexOf(page.segment || "watch") + 1,
            )
          ];
        return render();
      }
      case "read-line": {
        const l = ldata(page.lessonId),
          cur = l.dialogue[Math.min(page.line || 0, l.dialogue.length - 1)];
        return readAloud(cur[1]);
      }
      case "finish-lesson":
        return completeLesson();
      case "done-next-lesson": {
        const m = mod(target.dataset.id);
        return goto("lesson", {
          moduleId: m.id,
          lessonId: page.next,
          segment: "watch",
          line: 0,
        });
      }
      case "back-module":
        return goto("module", { id: target.dataset.id });
      case "review-next": {
        const m = mod(target.dataset.id),
          next = m.lessons.find((id) => !completed(id));
        return next
          ? goto("lesson", {
              moduleId: m.id,
              lessonId: next,
              segment: "watch",
              line: 0,
            })
          : goto("module", { id: m.id });
      }
      case "deep-next":
        page.part = (page.part || 0) + 1;
        return render();
      case "deep-finish":
        return deepFinish();
      case "practice-begin":
        return startPractice(target.dataset.id);
      case "mic":
        return startMic();
      case "end-practice":
        return endPractice();
      case "retry-practice":
        return goto("practice-intro", {
          id: target.dataset.id,
          scenarioIndex: Number(target.dataset.scenario),
        });
      case "category:all":
        return tab("library");
      default:
        if (action && action.startsWith("category:"))
          return goto("category", { id: action.split(":")[1] });
    }
  }
  $("#main-app").addEventListener("click", handleClick);
  $("#main-app").addEventListener("submit", (e) => {
    if (e.target.id === "practice-form") {
      e.preventDefault();
      const t = $("#composer-input")?.value || "";
      sendPractice(t);
    }
  });
  $("#main-app").addEventListener("change", (e) => {
    if (e.target.id === "language") {
      user.language = e.target.value;
      save();
      render();
      notify(`Language: ${D.languageNames[user.language]}`);
    }
  });
  $("#main-app").addEventListener("input", (e) => {
    if (e.target.id === "composer-input" && activePractice)
      activePractice.draft = e.target.value;
    if (e.target.id === "saved-draft") {
      user.draft = e.target.value;
      save();
    }
    if (e.target.id === "search-input") {
      searchText = e.target.value;
      const pos = e.target.selectionStart;
      const matches = D.modules.filter((m) =>
        `${m.title} ${m.description} ${(cat(m.category) || {}).title}`
          .toLowerCase()
          .includes(searchText.toLowerCase().trim()),
      );
      const box = e.target.nextElementSibling;
      if (box && box.classList.contains("section")) {
        box.innerHTML = `${heading(searchText ? "Search results" : "Popular skills")}<div class="module-list">${matches.length ? matches.map(moduleCard).join("") : `<div class="empty">No lessons found.</div>`}</div>`;
      }
      e.target.focus();
      e.target.setSelectionRange(pos, pos);
    }
  });
  window.addEventListener("popstate", (e) => {
    if (root.hidden) return;
    if (!canLeave()) {
      window.history.forward();
      return;
    }
    routeStack.pop();
    page = e.state?.samvad ? { ...e.state.page } : fromHash();
    if (page.view === "practice" && !activePractice)
      page = {
        view: "practice-intro",
        id: page.moduleId || user.lastModule || "comfort",
      };
    if (page.view !== "practice" && page.view !== "review")
      activePractice = null;
    render();
    window.scrollTo(0, 0);
  });
  window.addEventListener("hashchange", () => {
    if (root.hidden) return;
    const target = fromHash();
    if (routeURL(target) === routeURL(page)) return;
    if (!canLeave()) {
      window.history.replaceState({ samvad: true, page }, "", routeURL(page));
      return;
    }
    page = target;
    render();
  });
  window.SamvadHome = {
    open(preferences = {}) {
      user.language = window.SamvadStore.languageCode(
        preferences.language || user.language,
      );
      if (preferences.subtitles)
        user.captions = preferences.subtitles === "Subtitles on";
      if (Array.isArray(preferences.goals))
        user.goals = [...preferences.goals].slice(0, 3);
      if (preferences.confidence !== undefined)
        user.confidence = preferences.confidence;
      if (typeof preferences.name === "string")
        user.name = preferences.name.slice(0, 80);
      save();
      document.querySelector(".app").hidden = true;
      root.hidden = false;
      page = { view: "home" };
      render();
      window.scrollTo(0, 0);
    },
  };
  if (location.hash) {
    document.querySelector(".app").hidden = true;
    root.hidden = false;
    page = window.history.state?.samvad
      ? { ...window.history.state.page }
      : fromHash();
    if (page.view === "practice")
      page = {
        view: "practice-intro",
        id: page.moduleId || user.lastModule || "comfort",
      };
    render();
  }
})();
