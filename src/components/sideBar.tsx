import React from "react";
import { Home, Users, BarChart3, MapPin, Settings, User } from "lucide-react";
import Link from "next/link";

const SideBar = () => {
  return (
    // sidebar flex-1 and other side flex-5 or 4
    <div className="bg-[var(--primary)] text-white flex flex-col h-screen">
      <div className="px-2 flex-1">
        {/* Logo Section */}
        <div className="flex items-center justify-center my-12">
          <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center">
            <div className="text-[#8B6F47] font-bold text-[10px] text-center leading-tight">
              THE RESIDENCE
              <br />
              MALDIVES
              <br />
              <span className="text-[8px] italic font-normal">by Cenizaro</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {/* Overview Section */}
          <div className="text-white text-sm font-medium mb-3 px-3">
            Overview
          </div>

          <Link
            href={"/"}
            className="flex items-center gap-3 px-3 py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">Dashboard</span>
          </Link>

          <Link
            href={"/"}
            className="flex items-center gap-3 px-3 py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm">Check-ins</span>
          </Link>

          <Link
            href={"/"}
            className="flex items-center gap-3 px-3 py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Analytics</span>
          </Link>

          {/* Management Section */}
          <div className="text-white text-sm font-medium mb-3 mt-6 px-3">
            Management
          </div>

          <Link
            href={"/"}
            className="flex items-center gap-3 px-3 py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Resorts</span>
          </Link>

          <Link
            href={"/"}
            className="flex items-center gap-3 px-3 py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm">Restaurants</span>
          </Link>

          <Link
            href={"/"}
            className="flex items-center gap-3 px-3 py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors"
          >
            <User className="h-4 w-4" />
            <span className="text-sm">Users</span>
          </Link>

          <Link
            href={"/"}
            className="flex items-center gap-3 px-3 py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Admin Manager</span>
          </Link>
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#7A5F3F]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#7A5F3F] rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white">Admin User</div>
            <div className="text-xs text-white opacity-80 truncate">
              admin@residence.mv
            </div>
          </div>
        </div>
        <div className="text-xs text-white opacity-60 mt-2">
          Powered by verveautomation.com
        </div>
      </div>
    </div>
  );
};

export default SideBar;
