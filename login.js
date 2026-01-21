import { useState } from "react";
import { useRouter } from 'next/router';
import { apiFetch } from "../utils/api";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await apiFetch("/auth/vendor/login", {
        method: "POST",
        body: JSON.stringify({ phone, password })
      });
      // Save token for auth use (in localStorage/cookie)
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (error) {
      setErr(error.message || "Failed to login");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Vendor Login</h2>
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      {err && <p style={{color:"red"}}>{err}</p>}
    </form>
  );
}