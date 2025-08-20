"use client";

import ProtectedRoute from "@/components/routes/ProtectedRoute";
import SideBar from "@/components/layout/sideBar";
import TopBar from "@/components/layout/topBar";
import React, { useState } from "react";

const Pagelayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["Admin", "Manager", "Host"]}>
      <div className="flex h-screen overflow-hidden">
        <SideBar
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />
        {/* Main content area */}
        <div className="flex-1 bg-[var(--background)] flex flex-col overflow-hidden lg:ml-0">
          {/* Top Bar */}
          <TopBar
            onMobileMenuToggle={setIsMobileMenuOpen}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          {/* Main content - No extra padding needed */}
          <div className="px-2 md:px-8 flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Pagelayout;
