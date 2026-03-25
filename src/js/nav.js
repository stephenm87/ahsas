// Shared nav toggle for mobile hamburger menu + theme toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
});

// ===== Theme Toggle =====
(function initTheme() {
  const STORAGE_KEY = 'ahsas-theme';

  // Determine initial theme
  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // Apply theme immediately (before DOMContentLoaded to avoid flash)
  const theme = getPreferred();
  document.documentElement.setAttribute('data-theme', theme);

  // Update the meta theme-color tag
  function updateMetaTheme(t) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#faf7f2' : '#0f0f14');
  }
  updateMetaTheme(theme);

  // Wire up toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    function updateIcon() {
      const current = document.documentElement.getAttribute('data-theme');
      btn.textContent = current === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', current === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
    updateIcon();

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
      updateMetaTheme(next);
      updateIcon();
    });
  });
})();
