"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // named import for jwt-decode

export default function UserLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // get current route path

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Check if role is "user"
      if (decoded.role !== "patient") {
        router.replace("/login");
        return;
      }

      
    } catch (err) {
      console.error("Invalid token", err);
      router.replace("/login");
    }
  }, [router, pathname]);

  return <>{children}</>;
}
