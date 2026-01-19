const token = localStorage.getItem("token");
const box = document.getElementById("bookingList");

fetch("http://localhost:5000/api/admin/bookings", {
  headers: {
    Authorization: "Bearer " + token
  }
})
.then(res => res.json())
.then(data => {
  box.innerHTML = "";
  data.forEach(b => {
    box.innerHTML += `
      <div class="card">
        <h3>${b.customerName}</h3>
        <p>Vendor: ${b.vendor?.name}</p>
        <p>Date: ${new Date(b.eventDate).toDateString()}</p>
        <p>Status: <b>${b.status}</b></p>

        <button class="approve" onclick="update('${b._id}','Approved')">Approve</button>
        <button class="reject" onclick="update('${b._id}','Rejected')">Reject</button>
        <button class="cancel" onclick="update('${b._id}','Cancelled')">Cancel</button>
      </div>
    `;
  });
});

function update(id, status) {
  fetch(`http://localhost:5000/api/admin/bookings/${id}, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ status })
  }).then(() => location.reload()`);
}