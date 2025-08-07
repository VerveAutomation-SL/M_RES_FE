"use client";

import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, setUserFromCookie } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Public routes that don't need auth
    const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

    // Skip check for public routes
    if (publicRoutes.includes(pathname)) return;

    // Skip during loading
    if (isLoading) return;

    // Force check for access token
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      // Check for token expiration
      try {
        const decoded = jwtDecode(accessToken);
        const now = Math.floor(Date.now() / 1000);

        // Token is expired
        if (decoded.exp && decoded.exp < now) {
          console.log("Token expired, redirecting to login");
          Cookies.remove("accessToken");
          localStorage.removeItem("checkin_resort");
          localStorage.removeItem("checkin_outlet");
          router.replace("/login");
          return;
        }

        // If token is valid but not in state
        if (!isAuthenticated) {
          setUserFromCookie();
        }
      } catch (err) {
        // Invalid token
        console.error("Invalid token:", err);
        Cookies.remove("accessToken");
        router.replace("/login");
      }
    } else {
      // No token
      router.replace("/login");
      localStorage.removeItem("checkin_resort");
      localStorage.removeItem("checkin_outlet");
    }
  }, [isAuthenticated, isLoading, pathname, router, setUserFromCookie]);

  return <>{children}</>;
}
