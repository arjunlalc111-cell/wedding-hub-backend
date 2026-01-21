/* ================================
   VENDOR PROFILE – FINAL CLEAN JS
================================ */

// API base
const API_BASE = "http://localhost:5000/api";

/* ================================
   GET VENDOR ID FROM URL
================================ */
const params = new URLSearchParams(window.location.search);
const vendorId = params.get("id");

if (!vendorId) {
  alert("Vendor not found");
  throw new Error("Vendor ID missing");
}

/* ================================
   LOAD VENDOR DETAILS
================================ */
async function loadVendorProfile() {
  try {
    const res = await fetch(`${API_BASE}/vendors/${vendorId}`);
    const vendor = await res.json();

    // Basic info
    document.getElementById("vendorName").innerText = vendor.name;
    document.getElementById("vendorService").innerText = vendor.service;
    document.getElementById("vendorLocation").innerText = vendor.city;
    document.getElementById("vendorPrice").innerText =
      vendor.price ? `₹${vendor.price}` : "Price on request";

    // Contact buttons (optional)
    if (vendor.phone) {
      document.getElementById("callBtn").href = `tel:${vendor.phone}`;
      document.getElementById("whatsappBtn").href =
        `https://wa.me/91${vendor.phone}`;
    }
  } catch (err) {
    console.error(err);
    alert("Error loading vendor profile");
  }
}

/* ================================
   BOOKING FUNCTION (REAL BACKEND)
================================ */
async function bookVendor() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const date = document.getElementById("bookingDate").value;

  if (!name || !phone || !email || !date) {
    alert("Please fill all booking details");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorId,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        eventDate: date,
      }),
    });

    if (!res.ok) throw new Error("Booking failed");

    alert("✅ Booking request sent successfully");
  } catch (err) {
    console.error(err);
    alert("❌ Booking failed. Try again");
  }
}

/* ================================
   ON PAGE LOAD
================================ */
document.addEventListener("DOMContentLoaded", loadVendorProfile);

// expose booking function to button
window.bookVendor = bookVendor;