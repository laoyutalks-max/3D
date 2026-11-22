/* LAOYUTALKS 3D Review — shared depth & motion layer (every page).
   1. Scroll progress bar + header depth on scroll
   2. Card elevation, pointer-driven 3D tilt and glare (fine pointers only)
   3. Scroll reveal for sections and cards below the fold
   Purely presentational: it only adds classes / CSS variables, never
   changes content, links or the page's own scripts. Respects
   prefers-reduced-motion. If this file fails, every page still works. */
(function () {
  "use strict";
  var root = document.documentElement;
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  var reduce = mq("(prefers-reduced-motion: reduce)");
  var fine = mq("(hover: hover) and (pointer: fine)");

  var CARDS = ".card, .rCard, .goal, .hubCard, .toolCard, .demoCard, .atCard, .upCard, .featCard, .csCard, .wfCard, .modCard, .hProbCard, .mfgCard, .roiCard";
  var REVEAL = ".secHead, .stHead, .heroFlow, .resPart, .kitBox, .relLinks, " + CARDS;

  /* ---------- 1. progress + header ---------- */
  var bar = document.createElement("div");
  bar.className = "r3dProgress"; bar.setAttribute("aria-hidden", "true");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    bar.style.setProperty("--r3d-p", Math.min(1, Math.max(0, y / max)).toFixed(4));
    root.classList.toggle("r3d-scrolled", y > 8);
  }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }

  /* ---------- 2. cards ---------- */
  function hasForm(el) { return !!el.querySelector("input, textarea, select"); }
  function isClickable(el) { return el.tagName === "A" || !!el.querySelector("a[href], button"); }

  function prepCard(el) {
    if (el.__r3d) return; el.__r3d = 1;
    if (el.closest(".cine, .sbPanel, .sidebar, .chatbot, .cbPanel, dialog")) return;
    el.classList.add("r3dCard");
    if (!fine || reduce || hasForm(el) || !isClickable(el)) return;
    el.classList.add("r3dTilt");
    var glare = null, raf = 0, px = 0, py = 0;
    function paint() {
      raf = 0;
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var x = (px - r.left) / r.width, y = (py - r.top) / r.height;
      el.style.setProperty("--r3d-ry", ((x - .5) * 7).toFixed(2) + "deg");
      el.style.setProperty("--r3d-rx", ((.5 - y) * 6).toFixed(2) + "deg");
      el.style.setProperty("--r3d-gx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--r3d-gy", (y * 100).toFixed(1) + "%");
    }
    el.addEventListener("pointerenter", function () {
      if (!glare) {
        glare = document.createElement("span");
        glare.className = "r3dGlare"; glare.setAttribute("aria-hidden", "true");
        el.appendChild(glare);
      }
      el.classList.add("is-live");
    });
    el.addEventListener("pointermove", function (e) {
      px = e.clientX; py = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
    el.addEventListener("pointerleave", function () {
      el.classList.remove("is-live");
      el.style.setProperty("--r3d-rx", "0deg"); el.style.setProperty("--r3d-ry", "0deg");
    });
  }

  /* ---------- 3. reveal ---------- */
  var io = null;
  if (!reduce && "IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        el.classList.add("r3dShow");
        el.classList.remove("r3dWait");
        setTimeout(function () { el.style.removeProperty("--r3d-d"); }, 1200);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
  }

  function prepReveal(el, idx) {
    if (!io || el.__r3dR) return; el.__r3dR = 1;
    if (el.closest(".cine, .hero, .sbPanel, .sidebar, dialog, [hidden]")) return;
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 || r.height === 0) return; /* already on screen or not rendered: leave visible */
    el.style.setProperty("--r3d-d", (Math.min(idx, 5) * 0.06).toFixed(2) + "s");
    el.classList.add("r3dWait");
    io.observe(el);
  }

  function scan() {
    var groups = new Map();
    document.querySelectorAll(CARDS).forEach(prepCard);
    document.querySelectorAll(REVEAL).forEach(function (el) {
      var p = el.parentNode, n = groups.get(p) || 0;
      groups.set(p, n + 1);
      prepReveal(el, n);
    });
  }

  function init() {
    if (io) root.classList.add("r3d");
    document.body.appendChild(bar);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    onScroll();
    scan();
    /* cards rendered later by page scripts (resources, labs, tools) */
    window.addEventListener("load", function () { setTimeout(scan, 60); });
    if ("MutationObserver" in window) {
      var pending = 0;
      new MutationObserver(function () {
        if (pending) return;
        pending = setTimeout(function () { pending = 0; document.querySelectorAll(CARDS).forEach(prepCard); }, 120);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
