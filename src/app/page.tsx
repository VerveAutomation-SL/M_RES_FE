import SideBar from "@/components/sideBar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-[#F5F5F5]">
        <SideBar />
      </div>
      <div className="flex-5 bg-white p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {/* Main content goes here */}
        <p>Welcome to the Maldives Admin Dashboard!</p>
      </div>
    </div>
  );
}
