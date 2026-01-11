// env.js - Frontend environment / runtime config
// Place this file in your project root (same folder as index.html).
// Replace BASE_URL before deploying if you have a live backend.

window.BASE_URL = window.BASE_URL || 'https://REPLACE_WITH_YOUR_BACKEND_URL';

window.FRONTEND_CONFIG = window.FRONTEND_CONFIG || {
  // default radius for vendor search (km) — set to 100km as requested
  DEFAULT_SEARCH_RADIUS_KM: 100,
  // WhatsApp number in international format without + (India = 91)
  WHATSAPP_NUMBER: '917727962793'
};

// Backwards-compatibility: expose APP_CONFIG.whatsappNumber for pages that expect it
window.APP_CONFIG = window.APP_CONFIG || {};
window.APP_CONFIG.whatsappNumber = window.APP_CONFIG.whatsappNumber || window.FRONTEND_CONFIG.WHATSAPP_NUMBER;

// Helper to (re)configure WhatsApp floating link and icon
function ensureWhatsAppFloat() {
  try {
    const cfg = window.FRONTEND_CONFIG || {};
    const waNumber = (cfg.WHATSAPP_NUMBER || window.APP_CONFIG.whatsappNumber || '').toString().trim();
    const a = document.getElementById('whatsappFloat');
    if (!a) return;

    if (waNumber) {
      // ensure international format (no +) is used in wa.me link
      a.href = 'https://wa.me/' + waNumber.replace(/^\+/, '');
      a.setAttribute('aria-label', 'WhatsApp: +' + waNumber);
      a.target = '_blank';
    }

    const img = a.querySelector('img');
    if (!img) {
      // fallback inline SVG icon (white stroke on green circle)
      a.innerHTML = '<svg role="img" aria-label="WhatsApp" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5A9 9 0 1 1 11.5 3"></path><path d="M21 11.5v3.5a2 2 0 0 1-2 2h-1.5"></path><path d="M8.5 10.5c.5 1 1.5 2.2 3 3.2 1.2.8 1.8.9 2.4 1"></path></svg>';
    } else {
      // if src empty or missing, set to a file under images (you can replace)
      if (!img.getAttribute('src')) img.src = 'images/whatsapp-icon.svg';
    }
  } catch (err) {
    // don't break the page if something goes wrong
    // eslint-disable-next-line no-console
    console.warn('env.js ensureWhatsAppFloat error', err);
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureWhatsAppFloat);
} else {
  ensureWhatsAppFloat();
}

// Expose a small API to update config at runtime if needed
window.setFrontendConfig = function (cfg) {
  try {
    window.FRONTEND_CONFIG = Object.assign(window.FRONTEND_CONFIG || {}, cfg || {});
    window.APP_CONFIG = window.APP_CONFIG || {};
    window.APP_CONFIG.whatsappNumber = window.FRONTEND_CONFIG.WHATSAPP_NUMBER || window.APP_CONFIG.whatsappNumber;
    ensureWhatsAppFloat();
  } catch (e) {
    // ignore
  }
};