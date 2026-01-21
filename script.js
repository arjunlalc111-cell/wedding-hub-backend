//
// ======== (existing code at the top, unchanged) =======
// ===============================
// CONFIG
// ===============================

const API_BASE = window.BASE_URL;
const translations = {};

/* =========================
   LANGUAGE SWITCH FIX
========================= */
let currentLang = localStorage.getItem("lang") || "en";

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
  localStorage.setItem("lang", lang);
}
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    applyLanguage(lang);
  });
});

// ===============================
// LOADER SPINNER (ADD THIS BLOCK)
// ===============================
function showLoader() {
  const loader = document.getElementById("mainLoader");
  if (loader) loader.classList.add("active");
}
function hideLoader() {
  const loader = document.getElementById("mainLoader");
  if (loader) loader.classList.remove("active");
}
// (Make sure index.html contains the loader HTML block)
/*
<div id="mainLoader">
  <div class="loader-spinner"></div>
</div>
*/

// ===============================
// DOM ELEMENTS
// ===============================
const serviceCards = document.querySelectorAll(".service-card");
const selectedServiceText = document.getElementById("selectedService");
const clearFilterBtn = document.getElementById("clearFilter");

const vendorsSection = document.getElementById("vendors");

// Search inputs
const searchBtn = document.querySelector(".search-bar button");
const searchInputs = document.querySelectorAll(".search-bar input");

// ===============================
// STATE
// ===============================
let selectedService = "";
let selectedCity = "";
let selectedDate = "";

// ===============================
// SERVICE ICON CLICK
// ===============================
serviceCards.forEach(card => {
  card.addEventListener("click", () => {
    selectedService = card.dataset.service;
    selectedServiceText.innerText = selectedService;
    loadVendors();
  });
});

// ===============================
// CLEAR FILTER
// ===============================
clearFilterBtn.addEventListener("click", () => {
  selectedService = "";
  selectedCity = "";
  selectedDate = "";

  selectedServiceText.innerText = "All Services";
  searchInputs.forEach(i => i.value = "");

  loadVendors();
});

/* =========================
   SEARCH BAR → VENDORS PAGE
========================= */


if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const service = document.getElementById("searchService").value;
    const city = document.getElementById("searchCity").value;

    localStorage.setItem("searchService", service);
    localStorage.setItem("searchCity", city);

    window.location.href = "vendors.html";
  });
}

// ===============================
// LOAD VENDORS (BACKEND)
// ===============================
async function loadVendors() {
  vendorsSection.innerHTML = "<p>Loading vendors...</p>";
  showLoader(); // Show spinner before fetching

  try {
    const query = new URLSearchParams({
      service: selectedService,
      city: selectedCity,
      date: selectedDate
    });

    const res = await fetch(`${API_BASE}/vendors?${query.toString()}`);
    const vendors = await res.json();

    if (!vendors.length) {
      vendorsSection.innerHTML = "<p>No vendors found</p>";
      hideLoader();
      return;
    }

    vendorsSection.innerHTML = `
      <h2>Verified Wedding Vendors</h2>
      <div class="vendor-grid"></div>
    `;

    const grid = document.querySelector(".vendor-grid");

    vendors.forEach(vendor => {
      const card = document.createElement("div");
      card.className = "vendor-card";

      card.innerHTML = `
        <h3>${vendor.name}</h3>
        <p><b>Service:</b> ${vendor.service}</p>
        <p><b>City:</b> ${vendor.city}</p>
        <p class="price">₹ ${vendor.price || "On Request"}</p>
        <a href="vendor-profile.html?id=${vendor._id}" class="btn">View Profile</a>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    vendorsSection.innerHTML = "<p>Error loading vendors</p>";
  } finally {
    hideLoader(); // Hide spinner after load
  }
}

// ===============================
// INITIAL LOAD
// ===============================
loadVendors();

document.addEventListener("DOMContentLoaded", () => {

  // SERVICE ICON CLICK → vendors.html
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", () => {
      const service = card.dataset.service;
      localStorage.setItem("service", service);
      window.location.href = "vendors.html";
    });
  });

  // SEARCH BAR → vendors.html
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      localStorage.setItem(
        "service",
        document.getElementById("searchService").value
      );
      localStorage.setItem(
        "city",
        document.getElementById("searchCity").value
      );
      window.location.href = "vendors.html";
    });
  }

});
applyLanguage(currentLang);