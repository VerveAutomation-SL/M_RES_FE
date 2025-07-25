"use client";   

import { useCheckInStats } from "@/hooks/useCheckInStats";
import { restaurantApi } from "@/lib/api";
import { Resort, Restaurant } from "@/lib/types";
import { MapPinned, Store } from "lucide-react";
import { useEffect, useState } from "react";

interface ResortOverviewProps {
    resort: Resort;
}

export default function ResortOverview({resort}:ResortOverviewProps){

    const{ stats, loading: statsLoading} = useCheckInStats(resort.id);
    
    const [outlets, setOutlets] = useState<Restaurant[]>([]);
    const [outletLoading, setOutletLoading] = useState(true);
   
    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                setOutletLoading(true);
                const result = await restaurantApi.getAllResortsWithRestaurants();
                console.log("Fetched outlets:", result);
                let restaurantsData : Restaurant[] = [];
                
                if (result?.success && result.data) {
                    // If API returns {success: true, data: [...]}
                    if (Array.isArray(result.data)) {
                        // Find restaurants for this specific resort
                        const resortWithRestaurants = result.data.find((r: Restaurant) => r.id === resort.id);
                        restaurantsData = resortWithRestaurants?.restaurants || resortWithRestaurants?.Restaurants || [];
                    } else if (result.data.restaurants) {
                        restaurantsData = result.data.restaurants;
                    }
                } else if (Array.isArray(result)) {
                    // If API returns array directly
                    const resortWithRestaurants = result.find((r: Restaurant) => r.id === resort.id);
                    restaurantsData = resortWithRestaurants?.restaurants || resortWithRestaurants?.Restaurants || [];
                } else if (result?.data && Array.isArray(result.data)) {
                    // If API returns {data: [...]}
                    const resortWithRestaurants = result.data.find((r: Restaurant) => r.id === resort.id);
                    restaurantsData = resortWithRestaurants?.restaurants || resortWithRestaurants?.Restaurants || [];
                }

                console.log("Restaurants for resort", resort.id, ":", restaurantsData);

                setOutlets(restaurantsData);
            } catch (error) {
                console.error("Error fetching outlets:", error);
                setOutlets([]);
            }finally {
                setOutletLoading(false);
            }
        };
        fetchOutlets();
    }, [resort.id,resort.name]);

    return(
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Resort Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <MapPinned className="w-5 h-5 " />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-lg leading-tight">
            {resort.name}
          </h3>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {stats.totalRooms}
          </div>
          <div className="text-md text-gray-500">Total Rooms</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500 mb-1">
            {statsLoading? "Loading..." : stats.currentPeriodCheckIns}
          </div>
          <div className="text-md text-gray-500">Checked In</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">
            {statsLoading? "Loading..." : stats.availableForCheckIn}
          </div>
          <div className="text-md text-gray-500">Available</div>
        </div>
      </div>

      {/* Outlets */}
      <div>
        <h4 className="font-lg font-semibold text-gray-900 mb-3">Outlets</h4>
        <div className="space-y-2">
            {outletLoading ? (
                <div className="animate-pulse">Loading...</div>
            ) : outlets && Array.isArray(outlets) && outlets.length > 0 ? (
                // ✅ Display outlets with proper key and fallback
                    outlets.map((outlet, index) => (
                        <div 
                            key={outlet.id || `outlet-${index}`} 
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Store className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                                {outlet.restaurantName || `Outlet ${index + 1}`}
                            </span>
                        </div>
                    ))               
            ) : (
                <div className="text-sm text-gray-500 p-2">
                    No outlets found
                </div>
            )}
        </div>
      </div>
    </div>
    );
}