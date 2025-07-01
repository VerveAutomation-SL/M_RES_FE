import TopBar from "@/components/topBar";
import SideBar from "@/components/sideBar";
//import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* {redirect("/login")} */}
      <SideBar />
      <div className="flex-4 bg-[var(--background)] flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <TopBar />
        {/* Main content goes here */}
        <div className="p-6 flex-9">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>Welcome to the Maldives Admin Dashboard!</p>
        </div>
      </div>
    </div>
  );
}
