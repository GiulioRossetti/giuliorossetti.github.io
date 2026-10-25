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
})();
