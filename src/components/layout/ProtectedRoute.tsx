"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { setUserFromCookie, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  console.log("ProtectedRoute mounted");

  useEffect(() => {
    console.log("Checking authentication status...");
    setUserFromCookie();
  }, [setUserFromCookie]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
