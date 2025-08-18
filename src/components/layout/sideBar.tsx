"use client";

import React, { useState, useEffect } from "react";
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
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const SideBar = ({
  isMobileMenuOpen = false,
  onMobileMenuClose,
}: {
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}) => {
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);
  const { user } = useAuthStore();
  const pathname = usePathname();

  // Close mobile menu when route changes (handled by parent now)
  useEffect(() => {
    // This effect can be removed as parent handles menu closing
  }, [pathname]);

  // Close mobile menu when clicking outside (handled by parent now)
  useEffect(() => {
    // This can be handled by parent component if needed
  }, [isMobileMenuOpen]);

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
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-transparent bg-opacity-50 z-[45]" />
      )}

      {/* Sidebar */}
      <div
        id="mobile-sidebar"
        className={`
          fixed lg:relative inset-y-0 left-0 z-[50] w-64 lg:w-auto
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="bg-[var(--primary)] text-white flex flex-col h-screen w-64 lg:w-auto">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-3">
            <button
              onClick={onMobileMenuClose}
              className="bg-[#7A5F3F] text-white p-1.5 rounded-md shadow-sm hover:bg-[#8B6F47] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex items-center justify-center my-6 lg:my-10">
            {/* Mobile Logo - Using same design as desktop but smaller */}
            <div className="lg:hidden">
              <div className="text-center space-y-0.5">
                <div className="text-white font-light text-[0.6rem] tracking-[0.2em] leading-tight">
                  THE
                </div>
                <div className="text-white font-bold text-xs tracking-[0.15em] leading-none">
                  RESIDENCE
                </div>
                <div className="text-white font-light text-[0.6rem] tracking-[0.2em] leading-tight mb-1">
                  MALDIVES
                </div>

                {/* Elegant divider line - smaller for mobile */}
                <div className="flex items-center justify-center mb-1">
                  <div className="w-4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  <div className="w-0.5 h-0.5 bg-white/60 rounded-full mx-1"></div>
                  <div className="w-4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>

                <div className="text-white/80 text-[0.5rem] font-light italic tracking-wider">
                  BY CENIZARO
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
              {/* Overview Section */}
              <div className="text-gray-50 opacity-90 font-medium text-sm mb-2 px-4">
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
                  onClick={onMobileMenuClose}
                />
              ))}

              {/* Management Section */}
              <div className="text-gray-50 opacity-90 font-medium text-sm mb-2 mt-4 px-4">
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
                    onClick={onMobileMenuClose}
                  />
                ))}

              {/* User Management Dropdown */}
              <div>
                <button
                  className="flex items-center w-full gap-2 px-4 py-3 rounded hover:bg-[#7A5F3F] transition-all"
                  onClick={() => setUserMgmtOpen((open) => !open)}
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="text-base text-left">User Management</span>
                  {userMgmtOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {userMgmtOpen && (
                  <div className="ml-5 mt-1 flex flex-col gap-1 transition-all duration-200">
                    <div className="border-l-4 border-white/30">
                      <Link
                        href="/managers"
                        className={`flex items-center gap-2 px-2 py-2 ml-4 rounded transition-colors text-sm ${
                          pathname.startsWith("/managers") &&
                          hasAccessToRoute("/managers", user?.role)
                            ? "bg-[#8B6F47] text-white"
                            : "hover:bg-[#8B6F47]"
                        }`}
                        onClick={onMobileMenuClose}
                      >
                        <User className="h-4 w-4" />
                        <span>Managers</span>
                      </Link>
                      <Link
                        href="/hosts"
                        className={`flex items-center gap-2 px-2 py-2 ml-4 rounded transition-colors text-sm ${
                          pathname.startsWith("/hosts") &&
                          hasAccessToRoute("/hosts", user?.role)
                            ? "bg-[#8B6F47] text-white"
                            : "hover:bg-[#8B6F47]"
                        }`}
                        onClick={onMobileMenuClose}
                      >
                        <User className="h-4 w-4 " />
                        <span>Hosts</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Manager */}
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
                    onClick={onMobileMenuClose}
                  />
                ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <Link
            className="p-4 border-t border-[#7A5F3F]"
            href="/profile"
            onClick={onMobileMenuClose}
          >
            <div className="flex items-center justify-start gap-3">
              <div className="w-8 h-8 bg-[#7A5F3F] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">
                  {user?.username}
                </div>
                <div className="text-xs text-white opacity-80 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="text-xs text-white opacity-60 mt-2 text-left">
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
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  label,
  pathname,
  hasAccess,
  onClick,
}) => {
  // Only show as active if the pathname matches AND user has access
  const isActive = pathname.startsWith(href) && hasAccess;

  return (
    <Link
      href={href}
      className={`flex items-center justify-start gap-3 px-4 py-2 rounded text-white hover:bg-[#7A5F3F] transition-colors ${
        isActive ? "bg-[#8B6F47]" : ""
      }`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="text-base">{label}</span>
    </Link>
  );
};

export default SideBar;
