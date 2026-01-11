// Admin Dashboard UI – frontend only

document.querySelectorAll(".approve").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Vendor approved (UI only)");
  });
});

document.querySelectorAll(".block").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Vendor blocked (UI only)");
  });
});

document.querySelectorAll(".view").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Open vendor profile (later connect)");
  });
});
fetch("http://localhost:5000/api/notifications")
  .then(res => res.json())
  .then(data => console.log("Notifications:", data));