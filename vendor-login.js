const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("msg");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  msg.style.color = "red";
  msg.innerText = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    msg.innerText = "Please fill all fields";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/vendor/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.message || "Login failed";
      return;
    }

    // ✅ TOKEN SAVE
    localStorage.setItem("token", data.token);
    localStorage.setItem("vendor", JSON.stringify(data.vendor));

    msg.style.color = "green";
    msg.innerText = "Login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "vendor-dashboard.html";
    }, 1000);
  } catch (err) {
    msg.innerText = "Server error. Try again.";
  }
});