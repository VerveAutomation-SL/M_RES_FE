"use client";

import { Clock, User, Utensils } from "lucide-react";
import { CheckInDetails } from "@/lib/types";

interface CheckInTooltipProps {
  checkInDetails: CheckInDetails;
  roomNumber: string;
}

export default function CheckInTooltipContent({ 
  checkInDetails, 
  roomNumber 
}: CheckInTooltipProps) {
  const formatTime = (timeString: string) => {
    try {
      if (timeString.includes('T')) {
        return new Date(timeString).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch {
      return timeString;
    }
  };

  return (
    <div className="space-y-2 min-w-[250px]">
      <div className="font-semibold text-white border-b border-gray-600 pb-1">
        Room {roomNumber} - Check-in Details
      </div>
      
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-blue-300" />
          <span className="text-gray-300">Check-in:</span>
          <span className="text-white font-medium">
            {formatTime(checkInDetails.check_in_time)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Utensils className="w-3 h-3 text-green-300" />
          <span className="text-gray-300">Meal:</span>
          <span className="text-white font-medium capitalize">
            {checkInDetails.meal_type}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="w-3 h-3 text-purple-300" />
          <span className="text-gray-300">Plan:</span>
          <span className="text-white font-medium">
            {checkInDetails.meal_plan}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 text-center text-orange-300">🍽️</span>
          <span className="text-gray-300">Outlet:</span>
          <span className="text-white font-medium">
            {checkInDetails.outlet_name}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 text-center text-yellow-300">📍</span>
          <span className="text-gray-300">Table:</span>
          <span className="text-white font-medium">
            {checkInDetails.table_number}
          </span>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 pt-1 border-t border-gray-600">
        Click to view full details or check-out
      </div>
    </div>
  );
}