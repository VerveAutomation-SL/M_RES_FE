"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Button from "../ui/button";
import { Clock, RefreshCw, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  isMobileMenuOpen?: boolean;
}

const TopBar = ({
  breadcrumbs,
  onMobileMenuToggle,
  isMobileMenuOpen = false,
}: HeaderProps) => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Dynamic breadcrumbs based on current route
  const getBreadcrumbs = () => {
    if (breadcrumbs) return breadcrumbs;

    const routeBreadcrumbs: {
      [key: string]: Array<{ label: string; href?: string }>;
    } = {
      "/dashboard": [{ label: "Home", href: "/" }, { label: "Dashboard" }],
      "/check-in": [
        { label: "Home", href: "/" },
        { label: "Overview" },
        { label: "Check-ins" },
      ],
      "/analytics": [
        { label: "Home", href: "/" },
        { label: "Overview" },
        { label: "Analytics" },
      ],
      "/resorts": [
        { label: "Home", href: "/" },
        { label: "Management" },
        { label: "Resorts" },
      ],
      "/restaurants": [
        { label: "Home", href: "/" },
        { label: "Management" },
        { label: "Restaurants" },
      ],
      "/admin": [
        { label: "Home", href: "/" },
        { label: "Management" },
        { label: "Admin Manager" },
      ],
      "/managers": [
        { label: "Home", href: "/" },
        { label: "Management" },
        { label: "User Management" },
        { label: "Managers" },
      ],
      "/hosts": [
        { label: "Home", href: "/" },
        { label: "Management" },
        { label: "User Management" },
        { label: "Hosts" },
      ],
      "/profile": [{ label: "Home", href: "/" }, { label: "Profile" }],
    };

    const routeCrumbs = routeBreadcrumbs[pathname] || [
      { label: `Hi ${user?.username || "User"}!` },
    ];

    return routeCrumbs.filter((crumb) => crumb.label !== "Home");
  };

  // Get mobile-friendly breadcrumbs (only show current page)
  const getMobileBreadcrumbs = () => {
    const allBreadcrumbs = getBreadcrumbs();
    // On mobile, only show the last (current) breadcrumb
    return allBreadcrumbs.length > 0
      ? [allBreadcrumbs[allBreadcrumbs.length - 1]]
      : [];
  };

  const [time, setTime] = useState("HH:MM:SS AM/PM");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 bg-[var(--background)] shadow-md border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button and Breadcrumb Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 text-sm flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => onMobileMenuToggle?.(!isMobileMenuOpen)}
            className="lg:hidden bg-[var(--primary)] text-white p-1.5 rounded-md shadow-sm border border-[#7A5F3F] flex-shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <Menu className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop breadcrumbs - show all levels */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2">
              {getBreadcrumbs().map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span className="text-gray-400 mx-1 text-xs sm:text-sm flex-shrink-0">
                      &gt;
                    </span>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm lg:text-base truncate"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-[#8B6F47] font-medium truncate text-xs sm:text-sm lg:text-base">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile breadcrumbs - only show current page */}
            <div className="flex md:hidden items-center">
              {getMobileBreadcrumbs().map((crumb, index) => (
                <span
                  key={index}
                  className="text-[#8B6F47] font-medium truncate text-sm"
                >
                  {crumb.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Time and Refresh */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Time Display */}
          <div className="flex items-center gap-1 text-xs bg-[#D4B896] text-[#8B6F47] px-2 sm:px-3 py-1 sm:py-2 rounded-full font-medium">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden lg:inline md:text-base pt-0.5">{time}</span>
            <span className="lg:hidden">
              {time.split(" ")[0].substring(0, 5)}
            </span>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 
                      px-2 sm:px-3 py-1 sm:py-2 text-xs md:text-base rounded-full shadow-sm transition-colors cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden lg:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
