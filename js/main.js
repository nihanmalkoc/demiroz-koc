/* ==========================================================================
   DEMİRÖZ ✕ KOÇ — Behaviour
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Current year
     ---------------------------------------------------------------------- */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------------------
     Mark the active nav item
     ---------------------------------------------------------------------- */
  (function markCurrent() {
    var here = location.pathname.split('/').pop() || 'index.html';
    var links = doc.querySelectorAll('.nav a[href], .drawer__list a[href]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === here) {
        links[i].classList.add('is-current', 'link', 'link--on');
      } else {
        links[i].classList.add('link');
      }
    }
  })();

  /* ----------------------------------------------------------------------
     Header: sticky background, hide-on-scroll-down, invert over dark hero
     ---------------------------------------------------------------------- */
  (function header() {
    var head = doc.getElementById('siteHead');
    var hero = doc.getElementById('hero');
    var bar = doc.getElementById('progress');
    if (!head) return;

    var lastY = window.scrollY;
    var ticking = false;

    if (hero) head.classList.add('is-over-dark');

    function update() {
      var y = window.scrollY;
      var vh = window.innerHeight;
      var docH = doc.documentElement.scrollHeight - vh;

      head.classList.toggle('is-stuck', y > 24);

      /* Invert to white only while the dark hero sits behind the bar */
      if (hero) {
        var overDark = y < hero.offsetHeight - head.offsetHeight - 8;
        head.classList.toggle('is-over-dark', overDark);
        if (overDark) head.classList.remove('is-stuck');
      }

      /* Hide when scrolling down past the first screen, show on the way up */
      var drawerOpen = doc.body.classList.contains('nav-open');
      if (!drawerOpen && y > vh * 0.9 && y > lastY + 4) {
        head.classList.add('is-hidden');
      } else if (y < lastY - 4 || y < vh * 0.9) {
        head.classList.remove('is-hidden');
      }
      lastY = y;

      if (bar) bar.style.transform = 'scaleX(' + (docH > 0 ? Math.min(y / docH, 1) : 0) + ')';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ----------------------------------------------------------------------
     Mobile drawer
     ---------------------------------------------------------------------- */
  (function drawer() {
    var toggle = doc.getElementById('navToggle');
    var panel = doc.getElementById('drawer');
    if (!toggle || !panel) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      doc.body.classList.toggle('nav-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 896) setOpen(false);
    });
  })();

  /* ----------------------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------------------- */
  (function reveal() {
    var items = doc.querySelectorAll('[data-reveal], [data-reveal-mask]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  })();

  /* ----------------------------------------------------------------------
     Language toggle (TR default in markup, EN from js/i18n.js)
     ---------------------------------------------------------------------- */
  (function i18n() {
    var EN = window.DK_EN || {};
    var buttons = doc.querySelectorAll('[data-lang-btn]');
    if (!buttons.length) return;

    /* Snapshot the Turkish already in the document */
    var TR = {};
    function snapshot(selector, prop, store) {
      var nodes = doc.querySelectorAll(selector);
      for (var i = 0; i < nodes.length; i++) {
        var key = nodes[i].getAttribute(store);
        if (key && !(key in TR)) TR[key] = prop === 'placeholder'
          ? nodes[i].placeholder
          : nodes[i].innerHTML;
      }
    }
    snapshot('[data-i18n]', 'html', 'data-i18n');
    snapshot('[data-i18n-ph]', 'placeholder', 'data-i18n-ph');

    var trTitle = doc.title;
    var enTitle = doc.body.getAttribute('data-title-en') || trTitle;

    function apply(lang) {
      var dict = lang === 'en' ? EN : TR;

      var nodes = doc.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var k = nodes[i].getAttribute('data-i18n');
        if (dict[k] != null) nodes[i].innerHTML = dict[k];
      }

      var phs = doc.querySelectorAll('[data-i18n-ph]');
      for (var j = 0; j < phs.length; j++) {
        var pk = phs[j].getAttribute('data-i18n-ph');
        if (dict[pk] != null) phs[j].placeholder = dict[pk];
      }

      /* The wordmark exists in two lockups — MİMARLIK•TASARIM and
         ARCHITECTURE&DESIGN — so it follows the language too. */
      var marks = doc.querySelectorAll('[data-src-tr][data-src-en]');
      for (var m = 0; m < marks.length; m++) {
        marks[m].src = marks[m].getAttribute(lang === 'en' ? 'data-src-en' : 'data-src-tr');
      }

      doc.documentElement.lang = lang;
      doc.title = lang === 'en' ? enTitle : trTitle;

      for (var b = 0; b < buttons.length; b++) {
        buttons[b].setAttribute('aria-pressed',
          String(buttons[b].getAttribute('data-lang-btn') === lang));
      }

      try { localStorage.setItem('dk-lang', lang); } catch (e) {}
    }

    for (var n = 0; n < buttons.length; n++) {
      buttons[n].addEventListener('click', function () {
        apply(this.getAttribute('data-lang-btn'));
      });
    }

    var saved = null;
    try { saved = localStorage.getItem('dk-lang'); } catch (e) {}
    if (saved === 'en') apply('en');
  })();

  /* ----------------------------------------------------------------------
     Works filter
     ---------------------------------------------------------------------- */
  (function filters() {
    var wrap = doc.getElementById('filters');
    var grid = doc.getElementById('workGrid');
    if (!wrap || !grid) return;

    var buttons = wrap.querySelectorAll('button[data-filter]');
    var cards = grid.querySelectorAll('[data-cat]');
    var countEl = doc.getElementById('workCount');
    var emptyEl = doc.getElementById('workEmpty');

    function apply(cat) {
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var match = cat === 'all' || cards[i].getAttribute('data-cat') === cat;
        cards[i].classList.toggle('is-filtered', !match);
        if (match) shown++;
      }
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].setAttribute('aria-pressed',
          String(buttons[b].getAttribute('data-filter') === cat));
      }
      if (countEl) countEl.textContent = String(shown).padStart(2, '0');
      if (emptyEl) emptyEl.hidden = shown !== 0;
    }

    for (var n = 0; n < buttons.length; n++) {
      buttons[n].addEventListener('click', function () {
        apply(this.getAttribute('data-filter'));
      });
    }
    apply('all');
  })();

  /* ----------------------------------------------------------------------
     Mass-development sequence.

     The eight massing frames share one camera, so cross-fading them in place
     reads as a single evolving diagram. Built from separate images rather
     than a GIF: it stays sharp at any width, the frames load lazily, and the
     viewer can step through them instead of only watching.
     ---------------------------------------------------------------------- */
  (function massfilm() {
    var root = doc.getElementById('massfilm');
    if (!root) return;

    var frames  = root.querySelectorAll('.massfilm__stage img');
    var steps   = root.querySelectorAll('.massfilm__steps button');
    var playBtn = root.querySelector('.massfilm__play');
    var stepEl  = root.querySelector('.massfilm__step .n');
    var capEl   = root.querySelector('.massfilm__caption');
    if (!frames.length) return;

    var i = 0;
    var timer = null;
    var HOLD = 1900;

    function show(n) {
      i = (n + frames.length) % frames.length;
      for (var f = 0; f < frames.length; f++) frames[f].classList.toggle('is-on', f === i);
      for (var s = 0; s < steps.length; s++) steps[s].setAttribute('aria-pressed', String(s === i));
      if (stepEl) stepEl.textContent = String(i + 1).padStart(2, '0');
      if (capEl) {
        var key = steps[i] && steps[i].getAttribute('data-caption-key');
        var trText = steps[i] && steps[i].getAttribute('data-caption');
        var en = (window.DK_EN || {})[key];
        capEl.textContent = (doc.documentElement.lang === 'en' && en) ? en : (trText || '');
      }
    }

    function play() {
      if (timer || reduceMotion) return;
      timer = setInterval(function () { show(i + 1); }, HOLD);
      if (playBtn) playBtn.setAttribute('aria-pressed', 'true');
    }
    function pause() {
      clearInterval(timer);
      timer = null;
      if (playBtn) playBtn.setAttribute('aria-pressed', 'false');
    }

    for (var s = 0; s < steps.length; s++) {
      (function (n) {
        steps[n].addEventListener('click', function () { pause(); show(n); });
      })(s);
    }

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (timer) pause(); else play();
      });
    }

    /* Only run while it is actually on screen */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) play(); else pause();
        });
      }, { threshold: 0.35 }).observe(root);
    } else {
      play();
    }

    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) pause();
    });

    show(0);
    if (reduceMotion && playBtn) playBtn.setAttribute('aria-pressed', 'false');
  })();

  /* ----------------------------------------------------------------------
     Contact form — front-end only.
     Replace the handler below with your real endpoint (Formspree, Netlify
     Forms, your own PHP/API) when the site goes live.
     ---------------------------------------------------------------------- */
  (function contactForm() {
    var form = doc.getElementById('enquiry');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var note = doc.getElementById('formNote');
      if (note) {
        var key = 'f.sent';
        var en = (window.DK_EN || {})[key];
        note.textContent = doc.documentElement.lang === 'en' && en
          ? en
          : 'Teşekkürler — mesajınız bize ulaştı. İki iş günü içinde yanıtlayacağız.';
        note.style.color = 'var(--blue)';
      }
      form.reset();
    });
  })();

})();
