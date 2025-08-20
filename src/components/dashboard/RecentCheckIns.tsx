"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { checkInApi } from "@/lib/api";
import { checkInRecord } from "@/lib/types";

export default function RecentCheckIns() {
  const [checkIns, setCheckIns] = useState<checkInRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCheckIns = async () => {
      try {
        setLoading(true);
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Fetch all check-ins for today (adjust params as needed)
        const response = await checkInApi.getAllCheckInsToday(today);
        if (response.success && response.data) {
          console.log("Recent Check-Ins:", response.data);
          const sorted = response.data
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5); // Get the latest 5 check-ins
          setCheckIns(sorted);
        } else {
          setCheckIns([]);
        }
      } catch (error) {
        console.error("Error fetching recent check-ins:", error);
        setCheckIns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCheckIns();
  }, []);

  const getMealTypeColor = (mealType: string) => {
    switch (mealType?.toLowerCase()) {
      case "breakfast":
        return "bg-orange-100 text-orange-800";
      case "lunch":
        return "bg-blue-100 text-blue-800";
      case "dinner":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper to get "time ago"
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 mb-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-black">
            Recent Check-ins
          </h3>
          <p className="text-sm sm:text-md text-gray-500">
            Latest guest check-ins across all restaurants
          </p>
        </div>
        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-20 flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      ) : checkIns.length === 0 ? (
        <div className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
          No recent check-ins for today.
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {checkIns.map((checkIn) => (
            <div
              key={checkIn.id}
              className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {/* Room Number */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-amber-800 text-xs sm:text-sm">
                  {checkIn.Room?.room_number}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                    {checkIn.outlet_name}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${getMealTypeColor(
                      checkIn.meal_type
                    )}`}
                  >
                    {checkIn.meal_type}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Table No: {checkIn.table_number}
                </p>
              </div>

              {/* Time */}
              <div className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                {getTimeAgo(checkIn.createdAt ?? "")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      {/* <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center py-2 text-amber-600 hover:text-amber-700 font-medium transition-colors">
          View All Check-ins
        </button>
      </div> */}
    </div>
  );
}
