"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, isLoading, user, setUserFromCookie } = useAuthStore();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Load user from cookie
  useEffect(() => {
    const checkAuth = async () => {
      await setUserFromCookie();
      setAuthCheckComplete(true);
    };
    checkAuth();
  }, [setUserFromCookie]);

  // Handle routing after auth is checked
  useEffect(() => {
    if (!authCheckComplete || isLoading) return;

    if (isAuthenticated && user) {
      if (allowedRoles.includes(user.role)) {
        // User has access, allow rendering
        setShouldRender(true);
      } else {
        // User doesn't have access
        if (!hasRedirected.current) {
          // Display toast for longer duration (5 seconds)
          toast.error(
            "You do not have permission to access this page.",
            {
              duration: 4000, // 4 seconds
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
                padding: "16px",
              },
              iconTheme: {
                primary: "#e11d48",
                secondary: "#fff",
              },
            }
          );
          hasRedirected.current = true;

          setTimeout(() => {
            router.back();
          }, 800); // Short delay to ensure toast is visible
        }
      }
    } else {
      // Not authenticated
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.push("/login");
        localStorage.removeItem("checkin_resort");
        localStorage.removeItem("checkin_outlet");
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, authCheckComplete]);

  // Show loading while checking auth
  if (isLoading || !authCheckComplete) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        <span className="ml-4 text-gray-700 text-lg">Authenticating...</span>
      </div>
    );
  }

  // Only render children if user is authenticated, has user data, and has proper role
  if (!isAuthenticated || !user || !shouldRender) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        <span className="ml-4 text-gray-700 text-lg">Checking permissions...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;