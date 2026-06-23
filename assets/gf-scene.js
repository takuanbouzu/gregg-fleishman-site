/* ============================================================
   GF SCENE  ·  shared geometry palette for the WebGL pages
   Pairs with gf-theme.js + gf-tokens.css. Gives the deep-dive
   three.js scenes the same night/paper colors the instrument
   uses, so chrome and 3D stay matched across the toggle.

   Load AFTER gf-theme.js:
     <script src="assets/gf-theme.js"></script>
     <script src="assets/gf-scene.js"></script>

   Usage inside a scene script:
     const C = GF_SCENE.active();           // role -> CSS color string
     makeMat(C.unit); label('√3', p, C.space); ctx.strokeStyle = C.halo;
     GF_SCENE.onChange(GF_SCENE.reload);    // rebuild scene on theme flip

   Colors are CSS strings; THREE.Color parses them directly, so they
   work for both materials and 2D label canvases.
   ============================================================ */
(function () {
  'use strict';

  var GF_SCENE = {
    /* LIGHT — paper palette; geometry colours darkened for cream bg. */
    light: {
      bg:    ['#fffaf0', '#f6f2e8', '#e8deca'],   /* radial: center, mid, edge */
      ink:   '#141414', grid: '#d9d2c3', ghost: '#b4a896', muted: '#6b665d',
      unit:  '#141414',                            /* edge = structural ink */
      face:  '#4a7aaa',                            /* face diagonal √2 — muted blue darkened */
      space: '#b85339',                            /* space diagonal √3 — terracotta darkened */
      tri:   'rgba(100,145,113,0.28)',             /* root-triangle fill */
      angle: '#8a7030',                            /* angle measures — gold darkened */
      halo:  'rgba(246,242,232,.95)'              /* label outline */
    },
    /* DARK — Vector Pod instrument palette (exact token values). */
    dark: {
      bg:    ['#070a0b', '#07090a', '#060809'],    /* --bg void gradient */
      ink:   '#e5e0d4',                            /* --tx parchment */
      grid:  'rgba(198,205,198,0.10)',             /* --hairline */
      ghost: 'rgba(198,205,198,0.16)',             /* --border */
      muted: '#7e8581',                            /* --tx-dim */
      unit:  '#e5e0d4',                            /* --geo-unit  edge = 1 */
      face:  '#6f9bc4',                            /* --geo-face  √2 muted blue */
      space: '#db684d',                            /* --geo-space √3 terracotta = --accent */
      tri:   'rgba(119,164,133,0.22)',             /* --geo-tri   root-triangle fill */
      angle: '#c9a24b',                            /* --geo-angle gold */
      halo:  'rgba(9,13,14,0.82)'                 /* --nav-bg sprite label halo */
    },

    name: function () {
      if (window.gfTheme) return window.gfTheme.get();
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    },
    active: function () { return this.name() === 'light' ? this.light : this.dark; },

    onChange: function (cb) { document.addEventListener('gf-themechange', cb); },
    /* simplest reliable scene re-theme: rebuild from scratch in the new palette */
    reload: function () { location.reload(); }
  };

  window.GF_SCENE = GF_SCENE;
})();
