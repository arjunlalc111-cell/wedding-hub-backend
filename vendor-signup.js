import { useState } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "../utils/api";

export default function VendorSignup() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1=register, 2=otp
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [vendorId, setVendorId] = useState("");

  async function handleSignup(e) {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      // 1. Signup API call
      const res = await apiFetch("/auth/vendor/signup", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setVendorId(res.vendorId || res.vendor?._id); // Use returned ID
      // 2. Send OTP
      await apiFetch("/auth/vendor/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: form.email, otp: res.otp || undefined })
      });
      setStep(2);
    } catch (e) { setErr(e.message || "Signup failed"); }
    setLoading(false);
  }

  async function handleOtpVerify(e) {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      await apiFetch("/auth/vendor/verify-otp", {
        method: "POST",
        body: JSON.stringify({ vendorId, otp, email: form.email })
      });
      alert("Signup & verification successful. Please login!");
      router.push("/login");
    } catch (e) { setErr(e.message || "OTP failed"); }
    setLoading(false);
  }

  if (step === 2) {
    // OTP verify step
    return (
      <form onSubmit={handleOtpVerify}>
        <h2>Email OTP Verification</h2>
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={e=>setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
        {err && <div style={{color:"red"}}>{err}</div>}
      </form>
    );
  }

  // Registration form
  return (
    <form onSubmit={handleSignup}>
      <h2>Vendor Signup</h2>
      <input required placeholder="Business Name" value={form.businessName} onChange={e=>setForm(f=>({...f, businessName: e.target.value}))} />
      <input required placeholder="Owner Name" value={form.ownerName} onChange={e=>setForm(f=>({...f, ownerName: e.target.value}))} />
      <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} />
      <input required placeholder="Phone" value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} />
      <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f, password: e.target.value}))} />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Signup"}
      </button>
      {err && <div style={{color:"red"}}>{err}</div>}
    </form>
  );
}