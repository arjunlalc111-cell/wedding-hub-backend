// Vendor Registration – Frontend only

document.getElementById("vendorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  alert(
    "Registration submitted successfully!\n\n" +
    "After verification, your profile will be live on Wedding Hub."
  );

  this.reset();
});