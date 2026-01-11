document.getElementById("adminLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("loginMsg");

  // TEMP LOGIN (frontend only – backend next step)
  if (username === "mamta6367" && password === "arjun6367") {
    msg.style.color = "green";
    msg.innerText = "Login successful!";
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  } else {
    msg.style.color = "red";
    msg.innerText = "Invalid username or password";
  }
});