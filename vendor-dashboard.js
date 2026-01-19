document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("bookingTable");
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "vendor-login.html";
  });

  fetch("http://localhost:5000/api/bookings/vendor", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(bookings => {
      tableBody.innerHTML = "";

      if (!bookings.length) {
        tableBody.innerHTML =
          "<tr><td colspan='4'>No bookings yet</td></tr>";
        return;
      }

      bookings.forEach(b => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${b.customerName}</td>
          <td>${new Date(b.eventDate).toLocaleDateString()}</td>
          <td class="status-${b.status.toLowerCase()}">${b.status}</td>
          <td>
            <button class="action-btn approve">Approve</button>
            <button class="action-btn reject">Reject</button>
          </td>
        `;

        tableBody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error(err);
      tableBody.innerHTML =
        "<tr><td colspan='4'>Error loading bookings</td></tr>";
    });
});