/* ============================================================
   GF THEME  ·  inert dark-only compatibility stub
   The site is dark-only — there is no light mode and no toggle.
   This file no longer controls any palette. It exists only so
   legacy callers of window.gfTheme don't crash, and to clear any
   stale stored theme + lock the theme-color meta to dark.

     <script src="assets/gf-theme.js"></script>

   API (all no-ops, always report dark):
     window.gfTheme.get() | .set() | .toggle()  ->  'dark'
   ============================================================ */
(function () {
  'use strict';

  try {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#0B0B0B');
    localStorage.removeItem('gf-theme');
  } catch (e) {}

  window.gfTheme = {
    get: function () { return 'dark'; },
    set: function () { return 'dark'; },
    toggle: function () { return 'dark'; }
  };
})();
