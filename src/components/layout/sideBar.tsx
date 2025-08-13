"use client";

import React, { useState } from "react";
import {
  Home,
  Users,
  BarChart3,
  MapPin,
  Settings,
  User,
  ChevronDown,
  ChevronUp,
  Store,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const SideBar = () => {
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);
  const { user } = useAuthStore();
  const pathname = usePathname();

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", section: "Overview" },
    {
      href: "/check-in",
      icon: UserCheck,
      label: "Check-ins",
      section: "Overview",
    },
    {
      href: "/analytics",
      icon: BarChart3,
      label: "Analytics",
      section: "Overview",
    },
    { href: "/resorts", icon: MapPin, label: "Resorts", section: "Management" },
    {
      href: "/restaurants",
      icon: Store,
      label: "Restaurants",
      section: "Management",
    },
    {
      href: "/admin",
      icon: Settings,
      label: "Admin Manager",
      section: "Management",
    },
  ];

  // Define role-based access control
  const hasAccessToRoute = (route: string, userRole: string | undefined) => {
    if (!userRole) return false;

    // Convert user role to lowercase for comparison
    const normalizedUserRole = userRole.toLowerCase();

    const routePermissions: { [key: string]: string[] } = {
      "/dashboard": ["admin", "manager", "host"],
      "/check-in": ["admin", "manager", "host"],
      "/analytics": ["admin", "manager", "host"],
      "/resorts": ["admin"],
      "/restaurants": ["admin"],
      "/admin": ["admin"],
      "/managers": ["admin"],
      "/hosts": ["admin", "manager"],
      "/profile": ["admin", "manager", "host"], // Always accessible
    };

    // Check if route starts with any defined path
    for (const [routePath, allowedRoles] of Object.entries(routePermissions)) {
      if (route.startsWith(routePath)) {
        return allowedRoles.includes(normalizedUserRole);
      }
    }

    return false;
  };

  const overviewItems = navigationItems.filter(
    (item) => item.section === "Overview"
  );
  const managementItems = navigationItems.filter(
    (item) => item.section === "Management"
  );

  return (
    <>
      {/* Sidebar*/}
      <div className="inset-y-0 left-0 z-40">
        <div className="bg-[var(--primary)] text-white flex flex-col h-screen">
          {/* Logo Section */}
          <div className="flex items-center justify-center my-6 lg:my-10">
            {/* Mobile/Tablet Logo */}
            <div className="lg:hidden w-11 h-11 sm:w-13 sm:h-13">
              <div className="w-full h-full bg-[var(--primary)] rounded-lg shadow-xl flex items-center justify-center relative overflow-hidden transform ">
                <div className="absolute inset-0 via-transparent to-transparent"></div>
                <div className="transform text-white font-black text-sm tracking-wider">
                  RM
                </div>
              </div>
            </div>

            {/* Desktop Logo */}
            <div className="hidden lg:flex flex-col items-center justify-center">
              {/* Brand Text */}
              <div className="text-center space-y-1">
                <div className="text-white font-light text-sm tracking-[0.3em] leading-tight">
                  THE
                </div>
                <div className="text-white font-bold text-lg tracking-[0.25em] leading-none">
                  RESIDENCE
                </div>
                <div className="text-white font-light text-sm tracking-[0.3em] leading-tight mb-2">
                  MALDIVES
                </div>

                {/* Elegant divider line */}
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full mx-2"></div>
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>

                <div className="text-white/80 text-[0.65rem] font-light italic tracking-widest">
                  BY CENIZARO
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-2 lg:px-4 scrollbar-hide">
            <nav className="space-y-1 lg:space-y-2">
              {/* Overview Section - Only show on desktop */}
              <div className="hidden lg:block text-gray-50 opacity-90 font-medium text-sm mb-2 px-4">
                Overview
              </div>

              {overviewItems.map((item) => (
                <NavItem
                  key={item.label}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  pathname={pathname}
                  userRole={user?.role}
                  hasAccess={hasAccessToRoute(item.href, user?.role)}
                />
              ))}

              {/* Management Section - Only show on desktop */}
              <div className="hidden lg:block text-gray-50 opacity-90 font-medium text-sm mb-2 mt-4 px-4">
                Management
              </div>

              {managementItems
                .filter((item) => !item.label.includes("Admin Manager"))
                .map((item) => (
                  <NavItem
                    key={item.label}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    pathname={pathname}
                    userRole={user?.role}
                    hasAccess={hasAccessToRoute(item.href, user?.role)}
                  />
                ))}

              {/* User Management Dropdown */}
              <div>
                <button
                  className="flex items-center w-full gap-2 px-2 lg:px-4 py-3 rounded hover:bg-[#7A5F3F] transition-all"
                  onClick={() => setUserMgmtOpen((open) => !open)}
                >
                  <Users className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
                  <span className="hidden lg:inline text-base text-left">
                    User Management
                  </span>
                  {userMgmtOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {userMgmtOpen && (
                  <div className="lg:ml-5 mt-1 flex flex-col gap-1 transition-all duration-200">
                    <div className="lg:border-l-4 border-white/30">
                      <Link
                        href="/managers"
                        className={`flex items-center gap-2 px-2 py-2 lg:ml-4 rounded transition-colors text-sm ${
                          pathname.startsWith("/managers") &&
                          hasAccessToRoute("/managers", user?.role)
                            ? "bg-[#8B6F47] text-white"
                            : "hover:bg-[#8B6F47]"
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span className="lg:hidden font-medium text-lg">M</span>
                        <span className="hidden lg:inline">Managers</span>
                      </Link>
                      <Link
                        href="/hosts"
                        className={`flex items-center gap-2 px-2 py-2 lg:ml-4 rounded transition-colors text-sm ${
                          pathname.startsWith("/hosts") &&
                          hasAccessToRoute("/hosts", user?.role)
                            ? "bg-[#8B6F47] text-white"
                            : "hover:bg-[#8B6F47]"
                        }`}
                      >
                        <User className="h-4 w-4 " />
                        <span className="lg:hidden font-medium text-lg">H</span>
                        <span className="hidden lg:inline">Hosts</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Now render Admin Manager below */}
              {managementItems
                .filter((item) => item.label === "Admin Manager")
                .map((item) => (
                  <NavItem
                    key={item.label}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    pathname={pathname}
                    userRole={user?.role}
                    hasAccess={hasAccessToRoute(item.href, user?.role)}
                  />
                ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <Link
            className="p-2 lg:p-4 border-t border-[#7A5F3F]"
            href="/profile"
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#7A5F3F] rounded-full flex items-center justify-center group relative">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                {/* Mobile/Tablet Tooltip */}
                <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {user?.username}
                </div>
              </div>
              <div className="hidden lg:block flex-1 min-w-0">
                <div className="text-sm font-medium text-white">
                  {user?.username}
                </div>
                <div className="text-xs text-white opacity-80 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="hidden lg:block text-xs text-white opacity-60 mt-2 text-center lg:text-left">
              Powered by VerveAutomation.com
            </div>
          </Link>
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
  pathname: string;
  userRole?: string;
  hasAccess: boolean;
};

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  label,
  pathname,
  hasAccess,
}) => {
  // Only show as active if the pathname matches AND user has access
  const isActive = pathname.startsWith(href) && hasAccess;

  return (
    <Link
      href={href}
      className={`flex items-center justify-start gap-2 lg:gap-3 px-2 lg:px-4 py-3 lg:py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors group relative ${
        isActive ? "bg-[#8B6F47]" : ""
      }`}
    >
      <Icon className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
      <span className="hidden lg:inline text-base">{label}</span>
      {/* Mobile/Tablet Tooltip */}
      <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {label}
      </div>
    </Link>
  );
};

export default SideBar;
