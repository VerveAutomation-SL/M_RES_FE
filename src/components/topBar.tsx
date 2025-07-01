"use client";

import React, { useState, useEffect } from "react";
import Button from "./button";
import { Clock, RefreshCw } from "lucide-react";

interface HeaderProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const TopBar = ({ breadcrumbs }: HeaderProps) => {
  const defaultBreadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard" },
  ];

  const currentBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

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
    <div className="bg-[var(--background)] border-b border-gray-400 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-3 text-md">
          {currentBreadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-gray-400 mx-1 hidden sm:inline">
                  {">"}
                </span>
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className={`text-gray-600 hover:text-gray-800 transition-colors ${
                    index === 0 ? "hidden sm:inline" : ""
                  }`}
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-[#8B6F47] font-medium truncate">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right Side - Time and Refresh */}
        <div className="flex items-center gap-2">
          {/* Time Display */}
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm bg-[#D4B896] text-[#8B6F47] px-2 md:px-4 py-1 md:py-2 rounded-full font-medium">
            <Clock className="h-3 w-3 md:h-4 md:w-4" />
            {/* <span className="sm:hidden">12:23</span> */}
            <span className="hidden sm:inline">{time}</span>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 md:gap-2 bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 px-2 md:px-3 py-1 md:py-2"
          >
            <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
