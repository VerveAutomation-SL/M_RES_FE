import SideBar from "@/components/layout/sideBar";
import TopBar from "@/components/layout/topBar";
import React from "react";

const Pagelayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      {/* Main content area - Only needs margin on mobile/tablet */}
      <div className="flex-1 bg-[var(--background)] flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        {/* Main content */}
        <div className="px-2 md:px-8 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Pagelayout;
