// Pending Vendors page with Tailwind UI & react-hot-toast notifications!
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function PendingVendors() {
  const [pending, setPending] = useState([]);
  const [reason, setReason] = useState({});
  const [loading, setLoading] = useState(false);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const adminHeader = { "Content-Type": "application/json", Authorization: "Bearer " + token };

  async function fetchPending() {
    setLoading(true);
    const res = await fetch(api + "/admin/vendors/pending", { headers: adminHeader });
    setPending(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchPending(); }, []);

  async function handleApprove(id) {
    setLoading(true);
    const res = await fetch(api + `/admin/vendors/${id}/approve`, {
      method: "POST",
      headers: adminHeader,
    });
    const data = await res.json();
    if(res.ok) {
      toast.success("Vendor Approved!");
    } else {
      toast.error("Approve failed: " + (data.message || "API error"));
    }
    fetchPending();
    setLoading(false);
  }

  async function handleReject(id) {
    if (!reason[id]) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    setLoading(true);
    const res = await fetch(api + `/admin/vendors/${id}/reject`, {
      method: "POST",
      headers: adminHeader,
      body: JSON.stringify({ reason: reason[id] }),
    });
    const data = await res.json();
    if(res.ok) {
      toast.success("Vendor rejected!");
    } else {
      toast.error("Reject failed: " + (data.message || "API error"));
    }
    fetchPending();
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 mt-8">Pending Vendors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Approve</th>
              <th className="p-2 border">Reject</th>
            </tr>
          </thead>
          <tbody>
            {pending.length ? pending.map((v) => (
              <tr key={v._id} className="even:bg-gray-50">
                <td className="p-2 border">{v._id}</td>
                <td className="p-2 border">{v.businessName}</td>
                <td className="p-2 border">{v.email}</td>
                <td className="p-2 border">{v.phone}</td>
                <td className="p-2 border">{v.ownerName}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    placeholder="Reason (for reject)"
                    className="border px-2 py-1 w-32 rounded"
                    value={reason[v._id] || ""}
                    onChange={e => setReason(r => ({ ...r, [v._id]: e.target.value }))}
                  />
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => {
                      if (window.confirm("Approve this vendor?")) handleApprove(v._id);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    Approve
                  </button>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => {
                      if (!reason[v._id]) return toast.error("Please provide a reason.");
                      if (window.confirm("Reject this vendor?")) handleReject(v._id);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    disabled={loading}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 p-8">
                  {loading ? "Loading..." : "No pending vendors."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}