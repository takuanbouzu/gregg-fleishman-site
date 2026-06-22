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
    /* LIGHT — the pages' original "paper" palette (ink on cream). */
    light: {
      bg:    ['#fffaf0', '#f6f2e8', '#e8deca'],   /* radial: center, mid, edge */
      ink:   '#141414', grid: '#d9d2c3', ghost: '#b4a896', muted: '#6b665d',
      unit:  '#1769ff', face: '#e2811f', space: '#d9295f', tri: '#23a76d', angle: '#927400',
      halo:  'rgba(246,242,232,.95)'              /* light label outline */
    },
    /* DARK — mirrors the instrument's THEMES.night (glowing geometry). */
    dark: {
      bg:    ['#161616', '#0B0B0B', '#070707'],
      ink:   '#F0EDE8', grid: '#252525', ghost: '#383838', muted: '#8A8480',
      unit:  '#F0EDE8', face: '#4A90D9', space: '#E0349E', tri: '#3CCB8E', angle: '#C8A96E',
      halo:  'rgba(8,8,8,.86)'                     /* dark label outline */
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
