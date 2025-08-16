"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export default function PathlabLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("pttoken");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "pathlab") {
        router.replace("/login");
      }
      
    } catch (err) {
      console.error("Invalid token", err);
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
