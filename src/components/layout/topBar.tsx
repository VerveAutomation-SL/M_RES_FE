"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Button from "../ui/button";
import { Clock, RefreshCw } from "lucide-react";

interface HeaderProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const TopBar = ({ breadcrumbs }: HeaderProps) => {
  const pathname = usePathname();

  // Dynamic breadcrumbs based on current route
  const getBreadcrumbs = () => {
    if (breadcrumbs) return breadcrumbs;

    const routeBreadcrumbs: {
      [key: string]: Array<{ label: string; href?: string }>;
    } = {
      "/": [{ label: "Home", href: "/" }, { label: "Dashboard" }],
      "/check-in": [
        { label: "Home", href: "/" },
        { label: "Overview"},
        { label: "Check-ins" },
      ],
      "/analytics": [
        { label: "Home", href: "/" },
        { label: "Overview"},
        { label: "Analytics" },
      ],
      "/resorts": [
        { label: "Home", href: "/" },
        { label: "Management"},
        { label: "Resorts" },
      ],
      "/restaurants": [
        { label: "Home", href: "/" },
        { label: "Management"},
        { label: "Restaurants" },
      ],
      "/users": [
        { label: "Home", href: "/" },
        { label: "Management" },
        { label: "Users" },
      ],
      "/admin": [
        { label: "Home", href: "/" },
        { label: "Management" },
        { label: "Admin Manager" },
      ],
    };

    const routeCrumbs = routeBreadcrumbs[pathname] || [
    { label: "Dashboard" }
  ];
  
    return routeCrumbs.filter(crumb => crumb.label !== "Home");
  };

  

  const currentBreadcrumbs = getBreadcrumbs();

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
    <div className="bg-[var(--background)] shadow-md border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation - Fixed for mobile sidebar */}
        <div className="flex items-center gap-1 sm:gap-2 text-sm  flex-1 min-w-0">
          {currentBreadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-gray-400 mx-1 text-xs sm:text-sm flex-shrink-0 hidden sm:inline">
                  &gt;
                </span>
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className={`text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm lg:text-base truncate ${
                    index === 0 ? "hidden sm:inline" : ""
                  }`}
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
            className="flex items-center gap-1 bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 px-2 sm:px-3 py-1 sm:py-2 text-xs md:text-base rounded-full shadow-sm transition-colors"
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
