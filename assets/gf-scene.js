/* ============================================================
   GF SCENE  ·  shared geometry palette for the WebGL pages
   Pairs with gf-theme.js + gf-tokens.css. Gives the deep-dive
   three.js scenes the same dark instrument colors the chrome
   uses, so chrome and 3D stay matched. SINGLE dark palette —
   the site is dark-only (no night/paper toggle).

   Load AFTER gf-theme.js:
     <script src="assets/gf-theme.js"></script>
     <script src="assets/gf-scene.js"></script>

   Usage inside a scene script:
     const C = GF_SCENE.active();           // role -> CSS color string
     makeMat(C.unit); label('√3', p, C.space); ctx.strokeStyle = C.halo;

   Colors are CSS strings; THREE.Color parses them directly, so they
   work for both materials and 2D label canvases.
   ============================================================ */
(function () {
  'use strict';

  var GF_SCENE = {
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

    name: function () { return 'dark'; },
    active: function () { return this.dark; },

    onChange: function () {},
    /* simplest reliable scene re-theme: rebuild from scratch in the new palette */
    reload: function () { location.reload(); }
  };

  window.GF_SCENE = GF_SCENE;
})();
