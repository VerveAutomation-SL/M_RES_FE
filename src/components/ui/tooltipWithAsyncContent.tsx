"use client";

import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import CheckInTooltipContent from "./checkInTooltip";
import { CheckInDetails } from "@/lib/types";

interface TooltipWithAsyncContentProps {
  children: React.ReactNode;
  roomNumber: string;
  fetchDetails: (roomNumber: string) => Promise<CheckInDetails | null>;
  cachedDetails?: CheckInDetails;
}

export default function TooltipWithAsyncContent({
  children,
  roomNumber,
  fetchDetails,
  cachedDetails
}: TooltipWithAsyncContentProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [details, setDetails] = useState<CheckInDetails | null>(cachedDetails || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHovering && !details && !loading) {
      setLoading(true);
      fetchDetails(roomNumber).then((result) => {
        setDetails(result);
        setLoading(false);
      });
    }
  }, [isHovering, details, loading, roomNumber, fetchDetails]);

  const tooltipContent = loading ? (
    <div className="flex items-center gap-2 py-1">
      <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
      <span>Loading details...</span>
    </div>
  ) : details ? (
    <CheckInTooltipContent 
      checkInDetails={details} 
      roomNumber={roomNumber} 
    />
  ) : (
    <div className="text-gray-300">
      No check-in details available
    </div>
  );

  return (
    <div
      className="w-full h-full" // Add consistent sizing
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Tooltip content={tooltipContent} position="top">
        {children}
      </Tooltip>
    </div>
  );
}