"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast"; // or your toast lib

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (!(user && allowedRoles.includes(user.role))) {
        if (hasRedirected.current) return; // Prevent multiple redirects
        toast.error("You do not have permission to access this page.");
        hasRedirected.current = true;
        router.back();
      }
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role))
    return null;

  return <>{children}</>;
};

export default ProtectedRoute;
