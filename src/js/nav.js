// Shared nav toggle for mobile hamburger menu + theme toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Mobile: make "Tools ▾" dropdown expand inline on tap
  const dropdown = navLinks.querySelector('.nav-dropdown');
  if (dropdown) {
    const trigger = dropdown.querySelector(':scope > a');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        // Only handle as toggle on mobile (when hamburger is visible)
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('mobile-open');
        }
      });
    }
  }

  // Close menu when a non-dropdown link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      // Don't close for the dropdown trigger on mobile
      if (link.closest('.nav-dropdown') && link === link.closest('.nav-dropdown').querySelector(':scope > a') && window.innerWidth <= 768) {
        return;
      }
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ===== Back to Top Button =====
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
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

// ===== Shared Toast Utility =====
// Usage: window.showToast('Message') from any page
window.showToast = function(msg) {
  let toast = document.getElementById('sharedToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sharedToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2200);
};
