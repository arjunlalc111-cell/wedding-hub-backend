import { useRouter } from "next/router";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";

export default function useAdminGuard() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const decoded = jwt_decode(token);
      if (decoded.role !== "admin") {
        router.replace("/login"); // or router.replace("/") for home
      }
    } catch (e) {
      router.replace("/login");
    }
  }, [router]);
}