const BASE_URL = "https://wedding-hub-backend-1.onrender.com/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: "Bearer " + token }),
  };

  const res = await fetch(BASE_URL + endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "API Error");
  }

  return res.json();
}