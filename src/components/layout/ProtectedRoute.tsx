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

    if (isAuthenticated) {
      if (!(user && allowedRoles.includes(user.role))) {
        if (hasRedirected.current) return;
        toast.error("You do not have permission to access this page.");
        hasRedirected.current = true;
        router.back();
      }
    } else {
      router.push("/login");
      localStorage.removeItem("checkin_resort");
      localStorage.removeItem("checkin_outlet");
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, authCheckComplete]);

  if (isLoading || !authCheckComplete) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        <span className="ml-4 text-gray-700 text-lg">Authenticating...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role))
    return null;

  return <>{children}</>;
};

export default ProtectedRoute;
