import TopBar from "@/components/layout/topBar";
import SideBar from "@/components/layout/sideBar";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      {/* Main content area - Only needs margin on mobile/tablet */}
      <div className="flex-1 bg-[var(--background)] flex flex-col overflow-hidden ml-16 sm:ml-20 lg:ml-0">
        {/* Top Bar */}
        <TopBar />
        {/* Main content */}
        <div className="p-4 sm:p-12 flex-1 overflow-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-sm sm:text-base">
            Welcome to the Maldives Admin Dashboard!
          </p>
        </div>
      </div>
    </div>
  );
}
