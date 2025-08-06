"use client";

import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, setUserFromCookie } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't need auth
  const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

  useEffect(() => {
    // Skip check for public routes
    if (publicRoutes.includes(pathname)) return;
    
    // Skip during loading
    if (isLoading) return;
    
    // Force check for access token
    const accessToken = Cookies.get("accessToken");
    
    if (accessToken) {
      // If token exists but not authenticated in store, try to set from cookie
      if (!isAuthenticated) {
        setUserFromCookie();
        return; // Exit and wait for the next effect run with updated state
      }
    } else {
      // Only redirect if no token exists
      console.log("No access token found, redirecting to login");
      localStorage.removeItem("checkin_resort");
      localStorage.removeItem("checkin_outlet");
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router, setUserFromCookie]);

  return <>{children}</>;
}