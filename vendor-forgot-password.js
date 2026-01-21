import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function VendorForgotPassword() {
  const [step, setStep] = useState(1);
  const [vendorId, setVendorId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [msg, setMsg] = useState("");

  // 1: Enter email
  // 2: Enter OTP
  // 3: Enter new password

  async function requestOtp(e) {
    e.preventDefault();
    setMsg("");
    try {
      const { vendorId } = await apiFetch("/auth/vendor/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setVendorId(vendorId);
      setStep(2);
      setMsg("OTP sent to email.");
    } catch (e) { setMsg(e.message); }
  }
  async function submitOtp(e) {
    e.preventDefault();
    setMsg("");
    try {
      await apiFetch("/auth/vendor/verify-reset-otp", {
        method: "POST",
        body: JSON.stringify({ vendorId, otp }),
      });
      setStep(3);
      setMsg("OTP valid. Now set new password.");
    } catch (e) { setMsg(e.message); }
  }
  async function submitNewPwd(e) {
    e.preventDefault();
    setMsg("");
    try {
      await apiFetch("/auth/vendor/reset-password", {
        method: "POST",
        body: JSON.stringify({ vendorId, otp, password: newPwd }),
      });
      setMsg("Password reset! You can login.");
      setStep(1);
      setEmail(""); setOtp(""); setNewPwd("");
    } catch (e) { setMsg(e.message); }
  }

  return (
    <div style={{maxWidth:400,margin:"0 auto"}}>
      <h2>Vendor Password Reset</h2>
      {msg && <div style={{ color:"red" }}>{msg}</div>}
      {step === 1 && <form onSubmit={requestOtp}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter vendor email" required />
        <button type="submit">Send OTP</button>
      </form>}
      {step === 2 && <form onSubmit={submitOtp}>
        <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter received OTP" required />
        <button type="submit">Verify OTP</button>
      </form>}
      {step === 3 && <form onSubmit={submitNewPwd}>
        <input value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="New password" type="password" required minLength={6} />
        <button type="submit">Reset Password</button>
      </form>}
    </div>
  );
}