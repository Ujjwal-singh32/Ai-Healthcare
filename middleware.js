    // middleware.js
    import { NextResponse } from "next/server";
    import jwt from "jsonwebtoken";

    export function middleware(req) {
    const token = req.cookies.get("token")?.value;
    console.log("Decoded token:");

    // If no token, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    
    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        // Map routes to required roles
        const roleRoutes = {
        doctor: "/doctor",
        user: "/user",
        pathlab: "/pathlab",
        };

        const pathname = req.nextUrl.pathname;

        // Check if trying to access a role-specific route without permission
        if (pathname.startsWith("/doctor") && decoded.role !== "doctor") {
        return NextResponse.redirect(new URL("/login", req.url));
        }
        if ((pathname.startsWith("/user")||pathname.startsWith("/pharmacy")) && decoded.role !== "user") {
        return NextResponse.redirect(new URL("/login", req.url));
        }
        if (pathname.startsWith("/pathlab") && decoded.role !== "pathlab") {
        return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return NextResponse.redirect(new URL("/login", req.url));
    }
    }

    export const config = {
    matcher: ["/doctor/:path*", "/user/:path*","/pharmacy/:path*", "/pathlab/:path*"],
    };
