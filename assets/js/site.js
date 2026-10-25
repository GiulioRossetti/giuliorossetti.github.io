/* v2026 — site behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- Theme ---------- */
  function store(key, val) { try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; } }
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("theme", next);
    });
  });

  /* ---------- Header ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navToggle = document.querySelector("[data-nav-toggle]");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); navToggle.setAttribute("aria-expanded", "false"); });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Publication panels (abstract / bibtex) ---------- */
  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-pub-toggle]");
    if (btn) {
      var pub = btn.closest(".pub");
      var target = pub && pub.querySelector('[data-pub-panel="' + btn.getAttribute("data-pub-toggle") + '"]');
      if (!target) return;
      var willOpen = target.hasAttribute("hidden");
      pub.querySelectorAll("[data-pub-panel]").forEach(function (p) { p.setAttribute("hidden", ""); });
      pub.querySelectorAll("[data-pub-toggle]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      if (willOpen) { target.removeAttribute("hidden"); btn.setAttribute("aria-expanded", "true"); }
      return;
    }
    var more = ev.target.closest(".more-authors");
    if (more) {
      var full = more.getAttribute("data-full");
      if (full) { more.textContent = full; more.classList.remove("more-authors"); }
    }
  });

  /* ---------- Publications filter ---------- */
  var list = document.querySelector("[data-pub-filter-root]");
  if (list) {
    var search = document.querySelector("[data-pub-search]");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-pub-type]"));
    var counter = document.querySelector("[data-pub-count]");
    var empty = document.querySelector(".no-results");
    var items = Array.prototype.slice.call(list.querySelectorAll("ol.bibliography > li"));
    var years = Array.prototype.slice.call(list.querySelectorAll(".pub-year"));
    var activeType = "all";
    items.forEach(function (li) { li._text = li.textContent.toLowerCase().replace(/\s+/g, " "); });

    function apply() {
      var q = (search && search.value || "").trim().toLowerCase();
      var terms = q ? q.split(/\s+/) : [];
      var shown = 0;
      items.forEach(function (li) {
        var pub = li.querySelector(".pub");
        var type = pub ? pub.getAttribute("data-type") : "";
        var ok = (activeType === "all" || type === activeType) && terms.every(function (t) { return li._text.indexOf(t) !== -1; });
        li.hidden = !ok;
        if (ok) shown++;
      });
      years.forEach(function (y) {
        var any = y.querySelector("ol.bibliography > li:not([hidden])");
        y.classList.toggle("is-empty", !any);
      });
      if (counter) counter.textContent = shown + (shown === 1 ? " publication" : " publications");
      if (empty) empty.classList.toggle("is-visible", shown === 0);
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        activeType = b.getAttribute("data-pub-type");
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
    apply();
  }

  /* ---------- YSocial animated feed ----------
     Adapted from the YSocial website (https://y-not.social, assets/js/ysocial-v4.js):
     rotating illustrative discussion threads with "typing" indicators. */
  function initFeed() {
    var feed = document.querySelector('.ys-feed[data-ys-feed]');
    if (!feed || !window.Promise) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var COL = { teal: 'var(--ys-teal)', violet: 'var(--ys-violet)', orange: 'var(--ys-orange)', green: 'var(--ys-ok)' };
    var T = [
      { tag: '#urbanplanning', posts: [
        { n: 'Marta', h: 'marta_rome', c: 'teal', t: '4m', x: 'New bike lanes downtown finally approved. Curious how the shops on the corner will react', g: '#urbanplanning', r: 12, l: 48, s: 7 },
        { n: 'Luca', h: 'luca_b', c: 'violet', t: '2m', x: 'Less parking means fewer customers. Nobody asked the people who work here.', r: 4, l: 21, s: 2 },
        { n: 'Sara', h: 'sara_k', c: 'orange', t: '1m', x: 'Two good points here. A pilot on one street might settle it', g: '#evidence', r: 1, l: 9, s: 1 },
        { n: 'Dario', h: 'dario_m', c: 'green', t: 'now', x: 'Pilot for three months, publish the footfall data, then vote. Deal?', r: 0, l: 6, s: 0 } ] },
      { tag: '#climate', posts: [
        { n: 'Giulia', h: 'giulia_r', c: 'green', t: '5m', x: 'Third heatwave this summer. Can we talk about adaptation, not only targets?', g: '#climate', r: 18, l: 73, s: 15 },
        { n: 'Omar', h: 'omar_h', c: 'violet', t: '3m', x: 'Adaptation is expensive and invisible. Voters reward ribbons, not shade trees.', r: 6, l: 34, s: 4 },
        { n: 'Chen', h: 'chen_w', c: 'teal', t: '1m', x: 'Streets with new trees were 2 degrees cooler at noon. Boring and it works', g: '#evidence', r: 2, l: 41, s: 9 } ] },
      { tag: '#health', posts: [
        { n: 'Elena', h: 'elena_md', c: 'orange', t: '6m', x: 'Our clinic now uses an AI assistant for triage notes. Faster, but who checks the checker?', g: '#health', r: 9, l: 52, s: 6 },
        { n: 'Paolo', h: 'paolo_v', c: 'violet', t: '4m', x: 'Humans in the loop, or it is just liability laundering.', r: 3, l: 27, s: 3 },
        { n: 'Amira', h: 'amira_s', c: 'teal', t: '2m', x: 'We audit a weekly sample. Errors were 3%, nearly all in the same category.', g: '#evidence', r: 2, l: 19, s: 2 },
        { n: 'Elena', h: 'elena_md', c: 'orange', t: 'now', x: 'That is exactly the kind of number we needed. Sharing it with the board.', r: 0, l: 8, s: 1 } ] },
      { tag: '#football', posts: [
        { n: 'Tom', h: 'tom_fc', c: 'violet', t: '3m', x: 'That offside call again. Replays settle nothing when the rule is fuzzy', g: '#football', r: 31, l: 96, s: 12 },
        { n: 'Ivana', h: 'ivana_p', c: 'orange', t: '2m', x: 'The rule is clear. The camera angle is the problem.', r: 8, l: 44, s: 5 },
        { n: 'Noor', h: 'noor_a', c: 'green', t: 'now', x: 'Honest question: would you rather have fast calls or right calls?', r: 5, l: 23, s: 2 } ] },
      { tag: '#openscience', posts: [
        { n: 'Ada', h: 'ada_lab', c: 'teal', t: '7m', x: 'Our lab code is finally public. Reviewers asked for it, nobody asked for the docs', g: '#openscience', r: 14, l: 88, s: 21 },
        { n: 'Ben', h: 'ben_phd', c: 'violet', t: '4m', x: 'Docs are the real paper. I can rerun yours in an hour or I cannot.', r: 5, l: 39, s: 6 },
        { n: 'Rita', h: 'rita_o', c: 'orange', t: '2m', x: 'Pin your dependencies and add one runnable example. That is 90% of it', r: 3, l: 31, s: 8 },
        { n: 'Ada', h: 'ada_lab', c: 'teal', t: 'now', x: 'Adding a notebook tonight. Thank you both.', r: 0, l: 12, s: 0 } ] },
      { tag: '#news', posts: [
        { n: 'Marco', h: 'marco_t', c: 'orange', t: '5m', x: 'A headline claims the new tax doubles rent. I read the bill: it does not', g: '#news', r: 22, l: 67, s: 31 },
        { n: 'Yara', h: 'yara_j', c: 'green', t: '3m', x: 'Corrections never travel as far as the first headline.', r: 7, l: 58, s: 14 },
        { n: 'Leo', h: 'leo_k', c: 'teal', t: '1m', x: 'A visible note under the original post would help more than another thread', g: '#factcheck', r: 3, l: 26, s: 5 } ] }
    ];

    var head = feed.querySelector('.ys-feed-head');
    var topic = head && head.children[1];
    var body = document.createElement('div');
    body.className = 'ys-feed-body';
    feed.insertBefore(body, head ? head.nextSibling : feed.firstChild);
    [].slice.call(feed.querySelectorAll(':scope > .ys-post')).forEach(function (p, i) { p.classList.add('l' + i); body.appendChild(p); });
    feed.setAttribute('aria-label', 'Illustration of a simulated social media feed in which agents discuss different topics');

    function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
    function avatar(p) { var a = el('div', 'ys-av', p.n.charAt(0)); a.style.background = COL[p.c]; return a; }
    function stats(e) {
      e.rep.textContent = e.d.r + (e.d.r === 1 ? ' reply' : ' replies');
      e.like.textContent = '♥ ' + e.d.l;
      e.sh.textContent = e.d.s + (e.d.s === 1 ? ' share' : ' shares');
    }
    function build(p, lvl) {
      var node = el('div', 'ys-post l' + lvl), col = el('div');
      var who = el('div', 'ys-who', p.n + ' ');
      who.appendChild(el('span', null, '@' + p.h + ' · ' + p.t));
      var para = el('p', null, p.x);
      if (p.g) { para.appendChild(document.createTextNode(' ')); para.appendChild(el('span', 'ys-tag', p.g)); }
      var act = el('div', 'ys-act'), rep = el('span'), like = el('span', 'liked'), sh = el('span');
      act.appendChild(rep); act.appendChild(like); act.appendChild(sh);
      col.appendChild(who); col.appendChild(para); col.appendChild(act);
      node.appendChild(avatar(p)); node.appendChild(col);
      var rec = { node: node, rep: rep, like: like, sh: sh, d: { r: p.r, l: p.l, s: p.s } };
      stats(rec);
      return rec;
    }
    function typing(p, lvl) {
      var node = el('div', 'ys-post ys-typing l' + lvl), col = el('div');
      col.appendChild(el('div', 'ys-who', p.n + ' is typing'));
      var dots = el('div', 'ys-dots'); dots.appendChild(el('i')); dots.appendChild(el('i')); dots.appendChild(el('i'));
      col.appendChild(dots);
      node.appendChild(avatar(p)); node.appendChild(col);
      return node;
    }

    /* keep the card height steady: measure the tallest thread off-screen */
    function measure() {
      var probe = el('div', 'ys-feed-body ys-probe');
      probe.style.width = body.offsetWidth + 'px';
      feed.appendChild(probe);
      var max = 0;
      T.forEach(function (th) {
        probe.textContent = '';
        th.posts.forEach(function (p, i) { probe.appendChild(build(p, i).node); });
        max = Math.max(max, probe.offsetHeight);
      });
      feed.removeChild(probe);
      body.style.minHeight = max + 'px';
    }
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 200); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();

    var visible = true, live = [];
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(feed);
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function gate() { return (document.hidden || !visible) ? wait(400).then(gate) : Promise.resolve(); }
    function step(ms) { return gate().then(function () { return wait(ms); }); }

    setInterval(function () {
      if (document.hidden || !visible || !live.length) return;
      var e = live[Math.floor(Math.random() * live.length)], k = Math.random();
      if (k < .65) e.d.l += 1; else if (k < .85) e.d.s += 1; else e.d.r += 1;
      stats(e);
    }, 1300);

    function clear(recs) {
      recs.forEach(function (e) { e.node.classList.add('out'); });
      return wait(550).then(function () { recs.forEach(function (e) { if (e.node.parentNode) e.node.parentNode.removeChild(e.node); }); live = []; });
    }
    function play(th) {
      var recs = [], chain = Promise.resolve();
      chain = chain.then(function () { if (topic) topic.textContent = th.tag + ' · illustrative feed'; });
      th.posts.forEach(function (p, i) {
        chain = chain.then(function () {
          if (i === 0) return null;
          return step(300).then(function () { var t = typing(p, i); body.appendChild(t); return step(1000).then(function () { body.removeChild(t); }); });
        }).then(function () {
          var e = build(p, i); recs.push(e); live.push(e); body.appendChild(e.node); return step(1700);
        });
      });
      return chain.then(function () { return step(5200); }).then(function () { return clear(recs); });
    }
    function loop(i) { return play(T[i % T.length]).then(function () { return loop(i + 1); }); }

    /* the first thread is already in the page: let it rest, then rotate */
    var first = [].slice.call(body.querySelectorAll('.ys-post')).map(function (n) { return { node: n }; });
    step(6500).then(function () { return clear(first); }).then(function () { return loop(1); });
  }
  try { initFeed(); } catch (e) { if (window.console) console.warn("ysocial feed:", e); }

  /* ---------- Animated illustrations: pointer parallax, pause off-screen ---------- */
  (function () {
    var wraps = document.querySelectorAll(".illo-wrap");
    if (!wraps.length) return;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var svgs = [];
    wraps.forEach(function (w) {
      var svg = w.querySelector("svg.illo");
      if (!svg) return;
      svgs.push(svg);
      if (reduceMotion && svg.pauseAnimations) { try { svg.setCurrentTime(2.6); svg.pauseAnimations(); } catch (e) {} return; }
      var layers = svg.querySelectorAll("[data-depth]");
      w.addEventListener("pointermove", function (e) {
        var r = w.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width * 2 - 1, dy = (e.clientY - r.top) / r.height * 2 - 1;
        layers.forEach(function (l) {
          var d = parseFloat(l.getAttribute("data-depth")) || 0;
          l.style.transform = "translate(" + (dx * d * 16).toFixed(1) + "px," + (dy * d * 10).toFixed(1) + "px)";
        });
      }, { passive: true });
      w.addEventListener("pointerleave", function () { layers.forEach(function (l) { l.style.transform = ""; }); });
    });
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var svg = en.target;
        if (!svg.pauseAnimations) return;
        if (en.isIntersecting) svg.unpauseAnimations(); else svg.pauseAnimations();
      });
    });
    svgs.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- CV: highlight the current section in the side navigation ---------- */
  (function () {
    var nav = document.querySelector(".cv-nav");
    if (!nav || !("IntersectionObserver" in window)) return;
    var links = {};
    nav.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle("is-active", k === en.target.id); });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".cv-block[id]").forEach(function (b) { io.observe(b); });
  })();
})();
