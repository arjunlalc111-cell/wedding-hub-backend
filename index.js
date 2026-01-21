// Admin Dashboard for WeddingHub: Pending Vendors, Tailwind UI, Admin Guard, Search, Logout, Analytics, Bookings Action Buttons, Loading & Error States!
import { useEffect, useState } from "react";
import useAdminGuard from "../../hooks/useAdminGuard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  useAdminGuard();

  const [stats, setStats] = useState({});
  const [vendors, setVendors] = useState([]);
  const [searchVendor, setSearchVendor] = useState("");
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [bookings, setBookings] = useState([]);
  const [searchBooking, setSearchBooking] = useState("");
  const [tab, setTab] = useState("stats");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const adminHeader = { Authorization: "Bearer " + token };

  async function fetchAll() {
    try {
      setLoading(true);
      setError("");
      const api = process.env.NEXT_PUBLIC_API_URL;
      setStats(
        await (await fetch(api + "/admin/stats", { headers: adminHeader })).json()
      );
      setVendors(
        await (await fetch(api + "/admin/vendors", { headers: adminHeader })).json()
      );
      setUsers(
        await (await fetch(api + "/admin/users", { headers: adminHeader })).json()
      );
      setBookings(
        await (await fetch(api + "/admin/bookings", { headers: adminHeader })).json()
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Unable to fetch data. Please try again.");
    }
  }

  // Approve/Reject booking status update function
  async function handleBookingStatus(id, status) {
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bookings/${id}/status`, {
        method: "POST",
        headers: {
          ...adminHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status }),
      });
      await fetchAll();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert("Failed to update booking status");
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  // Dummy analytics data for chart
  const monthlyBookings = [
    { month: "Jan", total: 5 },
    { month: "Feb", total: 8 },
    { month: "Mar", total: 13 },
    { month: "Apr", total: 7 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 mt-8">Admin Dashboard</h2>

      {/* Tailwind Buttons Navbar + Logout Button */}
      <div className="flex gap-2 mb-8 items-center">
        <button
          className={`px-4 py-2 rounded ${
            tab === "stats" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setTab("stats")}
        >
          Platform Stats
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "vendors" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setTab("vendors")}
        >
          All Vendors
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "users" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setTab("users")}
        >
          All Users
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "bookings" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setTab("bookings")}
        >
          All Bookings
        </button>
        <a
          href="/admin/pending-vendors"
          className="px-4 py-2 rounded bg-yellow-100 text-yellow-900 font-semibold hover:underline ml-2"
        >
          Pending Vendors
        </a>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="ml-auto bg-gray-200 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
        >
          Logout
        </button>
      </div>

      {loading && <div className="text-blue-600 mb-3">Loading...</div>}
      {error && <div className="bg-red-100 text-red-700 rounded px-4 py-2 mb-3">{error}</div>}

      {tab === "stats" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Stats</h3>
          <pre className="bg-gray-50 border rounded p-4">
            {JSON.stringify(stats, null, 2)}
          </pre>
          <div className="mt-4 mb-4" style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyBookings}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "vendors" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Vendors</h3>
          <input
            className="border px-2 py-1 mb-2 rounded w-full max-w-xs"
            placeholder="Search vendor name or email"
            value={searchVendor}
            onChange={e => setSearchVendor(e.target.value)}
          />
          <table className="min-w-full border border-gray-300 my-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {vendors
                .filter(v =>
                  v.businessName?.toLowerCase().includes(searchVendor.toLowerCase()) ||
                  v.email?.toLowerCase().includes(searchVendor.toLowerCase())
                )
                .map((v) => (
                  <tr key={v._id} className="even:bg-gray-50">
                    <td className="p-2 border">{v._id}</td>
                    <td className="p-2 border">{v.businessName}</td>
                    <td className="p-2 border">{v.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <input
            className="border px-2 py-1 mb-2 rounded w-full max-w-xs"
            placeholder="Search user name or email"
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
          />
          <table className="min-w-full border border-gray-300 my-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  u =>
                    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchUser.toLowerCase())
                )
                .map(u => (
                  <tr key={u._id} className="even:bg-gray-50">
                    <td className="p-2 border">{u.name}</td>
                    <td className="p-2 border">{u.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings TAB: Table with Status Badge & Approve/Reject Action Buttons */}
      {tab === "bookings" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Bookings</h3>
          <input
            className="border px-2 py-1 mb-2 rounded w-full max-w-xs"
            placeholder="Search by booking ID, status, email, etc."
            value={searchBooking}
            onChange={e => setSearchBooking(e.target.value)}
          />
          <table className="min-w-full border border-gray-300 my-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter(
                  b =>
                    b._id?.toLowerCase().includes(searchBooking.toLowerCase()) ||
                    b.email?.toLowerCase().includes(searchBooking.toLowerCase()) ||
                    b.status?.toLowerCase().includes(searchBooking.toLowerCase())
                )
                .map(b => (
                  <tr key={b._id} className="even:bg-gray-50">
                    <td className="p-2 border">{b._id}</td>
                    <td className="p-2 border">{b.email}</td>
                    <td className="p-2 border">
                      <span className={
                        b.status === "approved"
                          ? "bg-green-100 text-green-800 px-2 py-0.5 rounded"
                          : b.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded"
                          : "bg-red-100 text-red-800 px-2 py-0.5 rounded"
                      }>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      {b.status === "pending" && (
                        <>
                          <button
                            className="bg-green-500 text-white px-2 rounded mr-1"
                            onClick={() => handleBookingStatus(b._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 rounded"
                            onClick={() => handleBookingStatus(b._id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}