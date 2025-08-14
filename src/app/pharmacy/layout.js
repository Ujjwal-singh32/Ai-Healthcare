"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function PharmacyLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);


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
