/* ============================================================
   GF NAV  ·  responsive hamburger enhancer  (progressive)
   Pairs with the RESPONSIVE NAV block in gf-tokens.css.

   Drop into any page that has a <nav id="gfnav"> with the
   standard `.brand` + `.navlink` set:
     <script src="assets/gf-nav.js"></script>

   It wraps the links in `.navlinks`, injects a `.navburger`
   button and a `#gf-mobilemenu` slide-down panel built from the
   existing links (numbered, hrefs + active state preserved), and
   flips <html> to `.gf-nav-ready` so the CSS collapses the bar on
   small screens. No per-page markup or wiring required. Idempotent.
   ============================================================ */
(function () {
  'use strict';

  function init() {
    var root = document.documentElement;
    var nav = document.getElementById('gfnav');
    if (!nav || root.classList.contains('gf-nav-ready')) return;

    if (!nav.hasAttribute('aria-label')) nav.setAttribute('aria-label', 'Primary');

    // 1 — collect the existing links (direct or already-wrapped)
    var links = Array.prototype.slice.call(nav.querySelectorAll('a.navlink'));
    if (!links.length) return;

    // 2 — wrap links in `.navlinks` (skip if a wrapper already exists)
    var wrap = nav.querySelector('.navlinks');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'navlinks';
      nav.insertBefore(wrap, links[0]);
      links.forEach(function (a) { wrap.appendChild(a); });
    }

    // 3 — build the slide-down menu from the links
    var menu = document.createElement('div');
    menu.id = 'gf-mobilemenu';
    menu.setAttribute('aria-hidden', 'true');
    links.forEach(function (a, i) {
      var item = document.createElement('a');
      item.href = a.getAttribute('href');
      if (/\bactive\b/.test(a.className)) item.classList.add('active');
      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = ('0' + (i + 1)).slice(-2);
      item.appendChild(num);
      item.appendChild(document.createTextNode(a.textContent.trim()));
      menu.appendChild(item);
    });
    document.body.appendChild(menu);

    // 4 — inject the burger button (rightmost in the bar)
    var burger = document.createElement('button');
    burger.className = 'navburger';
    burger.id = 'navburger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Open menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'gf-mobilemenu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    // 5 — keep the menu tucked just under the nav bar
    function offset() { menu.style.paddingTop = (nav.offsetHeight + 14) + 'px'; }
    offset();

    // 6 — wiring
    function set(open) {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { set(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    window.addEventListener('resize', function () {
      offset();
      if (window.innerWidth > 820) set(false);
    });

    root.classList.add('gf-nav-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
