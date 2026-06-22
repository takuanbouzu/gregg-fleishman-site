/* ============================================================
   GF THEME  ·  shared light/dark controller
   Load SYNCHRONOUSLY in <head> (no defer) so the stored palette
   is applied before first paint — avoids a flash on light pages.

     <script src="assets/gf-theme.js"></script>

   Pairs with the .gf-toggle button + #data-theme tokens in
   gf-tokens.css. Dark ("night") is the brand default.

   API:  window.gfTheme.get() | .set('light'|'dark') | .toggle()
   Event: document fires 'gf-themechange' {detail:{theme}} on change —
          the instrument page listens to drive its WebGL applyTheme().
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'gf-theme';
  var META = { dark: '#0B0B0B', light: '#F4EFE6' };

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function persist(t) {
    try { localStorage.setItem(KEY, t); } catch (e) {}
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme, opts) {
    theme = theme === 'light' ? 'light' : 'dark';
    var root = document.documentElement;
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');            /* dark = default :root */

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', META[theme]);

    syncButton(theme);

    if (!opts || opts.persist !== false) persist(theme);
    if (!opts || opts.silent !== true) {
      document.dispatchEvent(new CustomEvent('gf-themechange', { detail: { theme: theme } }));
    }
    return theme;
  }

  function syncButton(theme) {
    var btn = document.getElementById('gfThemeToggle');
    if (!btn) return;
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    btn.setAttribute('title', theme === 'light' ? 'Dark mode' : 'Light mode');
  }

  /* --- run immediately (pre-paint): set <html data-theme> from storage --- */
  apply(stored() === 'light' ? 'light' : 'dark', { persist: false, silent: true });

  /* --- wire the toggle button once the DOM is ready --- */
  function wire() {
    syncButton(current());
    var btn = document.getElementById('gfThemeToggle');
    if (btn && !btn._gfWired) {
      btn._gfWired = true;
      btn.addEventListener('click', function () {
        apply(current() === 'light' ? 'dark' : 'light');
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  window.gfTheme = {
    get: current,
    set: function (t) { return apply(t); },
    toggle: function () { return apply(current() === 'light' ? 'dark' : 'light'); }
  };
})();
