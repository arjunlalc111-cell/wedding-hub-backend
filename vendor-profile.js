const params = new URLSearchParams(window.location.search);
const vendorId = params.get("id");

fetch(`http://localhost:5000/api/vendors/${vendorId}`)
  .then(res => res.json())
  .then(v => {
    document.getElementById("vendorName").innerText = v.name;
    document.getElementById("vendorService").innerText = v.service;
    document.getElementById("vendorLocation").innerText = v.location;
    document.getElementById("vendorPhone").innerText = v.phone;
    document.getElementById("vendorAbout").innerText = v.about || "No description";

    document.getElementById("callBtn").href = `tel:${v.phone}``;
    document.getElementById("whatsappBtn").href = https://wa.me/91${v.phone}`;
  })
  .catch(() => {
    alert("Vendor profile load nahi ho pa raha");
  });