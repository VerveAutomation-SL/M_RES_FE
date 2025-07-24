'use client';

import React from "react";
import { Home, Users, BarChart3, MapPin, Settings, User } from "lucide-react";
import Link from "next/link";

const SideBar = () => {
  const navigationItems = [
    { href: "/", icon: Home, label: "Dashboard", section: "Overview" },
    { href: "/check-in", icon: Users, label: "Check-ins", section: "Overview" },
    { href: "/analytics", icon: BarChart3, label: "Analytics", section: "Overview" },
    { href: "/resorts", icon: MapPin, label: "Resorts", section: "Management" },
    { href: "/restaurants", icon: Users, label: "Restaurants", section: "Management" },
    { href: "/users", icon: User, label: "Users", section: "Management" },
    { href: "/admin", icon: Settings, label: "Admin Manager", section: "Management" },
  ];

  const overviewItems = navigationItems.filter(item => item.section === "Overview");
  const managementItems = navigationItems.filter(item => item.section === "Management");

  return (
    <>
      {/* Sidebar - Always visible, responsive width */}
      <div className="fixed lg:static inset-y-0 left-0 z-40 w-16 sm:w-20 lg:w-64">
        <div className="bg-[var(--primary)] text-white flex flex-col h-screen">
          <div className="px-2 lg:px-4 flex-1">
            {/* Logo Section */}
            <div className="flex items-center justify-center my-6 lg:my-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center">
                {/* Mobile/Tablet - Show only icon */}
                <div className="lg:hidden text-[var(--primary)] font-bold text-xs sm:text-sm">
                  RM
                </div>
                {/* Desktop - Show full logo */}
                <div className="hidden lg:flex flex-col items-center justify-center text-[var(--heading-text)] font-extrabold text-[1 rem] text-center leading-tight">
                  <span>THE RESIDENCE</span>
                  <span>MALDIVES</span>
                  <span className="text-[0.6rem] italic font-normal">
                    by Cenizaro
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 lg:space-y-2">
              {/* Overview Section - Only show on desktop */}
              <div className="hidden lg:block text-white text-sm font-medium mb-2 px-3">
                Overview
              </div>

              {overviewItems.map((item) => (
                <NavItem 
                  key={item.label}
                  href={item.href}
                  icon={item.icon}
        
                  label={item.label}
                  
                />
              ))}

              {/* Management Section - Only show on desktop */}
              <div className="hidden lg:block text-white text-sm font-medium mb-2 mt-4 px-3">
                Management
              </div>

              {managementItems.map((item) => (
                <NavItem 
                  key={item.label}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="p-2 lg:p-4 border-t border-[#7A5F3F]">
            <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#7A5F3F] rounded-full flex items-center justify-center group relative">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                {/* Mobile/Tablet Tooltip */}
                <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  Admin User
                </div>
              </div>
              <div className="hidden lg:block flex-1 min-w-0">
                <div className="text-sm font-medium text-white">Admin User</div>
                <div className="text-xs text-white opacity-80 truncate">
                  admin@residence.mv
                </div>
              </div>
            </div>
            <div className="hidden lg:block text-xs text-white opacity-60 mt-2 text-center lg:text-left">
              Powered by verveautomation.com
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Updated Navigation Item Component
type NavItemProps = {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label }) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-2 lg:px-4 py-3 lg:py-2 mx-1 lg:mx-2 rounded text-white hover:bg-[#7A5F3F] transition-colors group relative"
    >
      <Icon className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
      <span className="hidden lg:inline text-base lg:text-lg">{label}</span>
      
      {/* Mobile/Tablet Tooltip */}
      <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {label}
      </div>
    </Link>
  );
};

export default SideBar;
