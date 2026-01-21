import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { apiFetch } from "../utils/api";

export default function Dashboard() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/vendor/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        setVendor(await res.json());
      } catch (err) {
        router.push("/login");
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!vendor) return null;

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <pre>{JSON.stringify(vendor.vendor, null, 2)}</pre>
    </div>
  );
}