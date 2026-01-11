// vendors.js (FINAL CLEAN VERSION)

const vendorList = document.getElementById("vendorList");
const loadingText = document.getElementById("loadingText");
loadingText.style.display = "block";

async function loadVendors() {
  const service = localStorage.getItem("searchservice") || "";
  const city = localStorage.getItem("searchcity") || "";

  let url = `${API_BASE}/api/vendors?service=${encodeURIComponent(service)}&city=${encodeURIComponent(city)}`;

  try {
    const res = await fetch(url);
    const vendors = await res.json();
    
   if (!vendors.length) {
  vendorList.innerHTML = "<p>No vendors found for selected service/city.</p>";
  loadingText.style.display = "none";
  return;
} 

    vendorList.innerHTML = "";

    if (!vendors.length) {
      vendorList.innerHTML = "<p>No vendors found.</p>";
      return;
    }

    vendors.forEach(v => {
      const card = document.createElement("div");
      card.className = "vendor-card";

      card.innerHTML = `
        <h3>${v.name}</h3>
        <p><b>Service:</b> ${v.service}</p>
        <p><b>City:</b> ${v.city}</p>
        <button onclick="openProfile('${v._id}')">View Profile</button>
      `;

      vendorList.appendChild(card);
    });

  } catch (err) {
    vendorList.innerHTML = "<p>Error loading vendors</p>";
    console.error(err);
  }
}

function openProfile(id) {
  window.location.href = "vendor-profile.html?id=" + id;
}

document.addEventListener("DOMContentLoaded", loadVendors);