const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/admin/vendors", {
  headers: { Authorization: "Bearer " + token }
})
.then(r => r.json())
.then(vendors => {
  vendors.forEach(v => {
    console.log(v.name, v.isApproved);
  });
});