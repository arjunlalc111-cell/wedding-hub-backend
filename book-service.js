import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function BookService() {
  const [form, setForm] = useState({
    vendor: "", // Vendor ID (can be select/dropdown in advanced version)
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    eventDate: "",
    notes: ""
  });
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(""); setErr(""); setLoading(true);
    try {
      const data = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setResult("Booking request sent! You'll get an email if entered.");
      setForm(f => ({ ...f, notes: "" })); // Clear notes but keep contact data for more bookings
    } catch (e) {
      setErr(e.message || "Booking failed");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{maxWidth: 380, margin: "0 auto"}}>
      <h2>Book a Vendor Service</h2>
      <input required placeholder="Vendor ID" value={form.vendor} onChange={e=>setForm(f=>({...f, vendor: e.target.value}))} />
      <input required placeholder="Your Name" value={form.customerName} onChange={e=>setForm(f=>({...f, customerName: e.target.value}))} />
      <input required placeholder="Phone" value={form.customerPhone} onChange={e=>setForm(f=>({...f, customerPhone: e.target.value}))} />
      <input type="email" placeholder="Email (for updates)" value={form.customerEmail} onChange={e=>setForm(f=>({...f, customerEmail: e.target.value}))} />
      <input required type="date" placeholder="Event Date" value={form.eventDate} onChange={e=>setForm(f=>({...f, eventDate: e.target.value}))} />
      <textarea placeholder="Notes / Details" value={form.notes} onChange={e=>setForm(f=>({...f, notes: e.target.value}))} />
      <button type="submit" disabled={loading}>{loading ? "Booking..." : "Book Now"}</button>
      {result && <div style={{color:"green"}}>{result}</div>}
      {err && <div style={{color:"red"}}>{err}</div>}
    </form>
  );
}