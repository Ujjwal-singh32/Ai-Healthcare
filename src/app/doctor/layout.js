"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export default function DoctorLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("drtoken");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "doctor") {
        router.replace("/login");
      }
      
    } catch (err) {
      console.error("Invalid token", err);
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
