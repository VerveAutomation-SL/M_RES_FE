"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import RoomGrid from "@/components/layout/roomGrid";
import Card from "@/components/ui/card";
import Modal from "@/components/ui/legend";
import { MapPin, RefreshCw } from "lucide-react";
import { useCheckInStats } from "@/hooks/useCheckInStats";
import { resortApi } from "@/lib/api";
import { Resort } from "@/lib/types";

export default function CheckInPage() {
  // Resort state management
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [activeResort, setActiveResort] = useState<number | null>(null);
  const [resortsLoading, setResortsLoading] = useState(true);
  
  // Resort details
  const [resortName, setResortName] = useState<string>("Loading...");
  const [resortLocation, setResortLocation] = useState<string>("Loading...");
  
  // Stats hook using the shared activeResort
  const { stats, loading, error, refetch } = useCheckInStats(activeResort || 0);

  // Fetch resorts on component mount
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        console.log("🏨 CheckInPage: Fetching resorts...");
        const response = await resortApi.getAllResortsWithRooms();

        if (
          response &&
          response.success &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const sortedResorts = response.data.sort((a, b) => a.id - b.id);
          setResorts(sortedResorts);
          setActiveResort(sortedResorts[0].id);
          console.log("✅ CheckInPage: Resorts loaded, active resort:", sortedResorts[0].id);
        } else {
          console.warn("❌ CheckInPage: No resorts found");
          setResorts([]);
          setActiveResort(null);
        }
      } catch (error) {
        console.error("💥 CheckInPage: Failed to fetch resorts:", error);
        setResorts([]);
        setActiveResort(null);
      } finally {
        setResortsLoading(false);
      }
    };

    fetchResorts();
  }, []);

  // Fetch resort details when activeResort changes
  useEffect(() => {
    const fetchResortDetails = async () => {
      if (!activeResort) return;
      
      try {
        const response = await resortApi.getResortById(activeResort);
        if (response?.success && response.data) {
          setResortName(response.data.name);
          setResortLocation(response.data.location);
        }
      } catch (error) {
        console.error("Failed to fetch resort details:", error);
      }
    };

    fetchResortDetails();
  }, [activeResort]);

  // Handle resort change from RoomGrid navigation
  const handleResortChange = (resortId: number) => {
    if (resortId === activeResort) return;
    
    console.log(`🔄 CheckInPage: Resort changed from ${activeResort} to ${resortId}`);
    setActiveResort(resortId);
  };

  const formatMealTime = (mealType: string) => {
    const mealTimes = {
      breakfast: "06:00 - 10:30",
      lunch: "12:00 - 15:30", 
      dinner: "19:00 - 22:30"
    };
    return mealTimes[mealType as keyof typeof mealTimes] || "";
  };

  // Show loading while resorts are being fetched
  if (resortsLoading) {
    return (
      <div className="space-y-6">
        <Header 
          title="Dining Check-ins" 
          subtitle="The Residence Maldives - Daily Dining Management" 
        />
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading resorts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Dining Check-ins" 
        subtitle="The Residence Maldives - Daily Dining Management" 
      />

      <div className="flex flex-wrap gap-6 justify-between">
        {/* Resort Statistics Card */}
        <Card classname="w-[48%] gap-4 bg-white">
          <div className="grid grid-cols-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-950 mr-2 mb-1" />
                <h1 className="font-semibold text-gray-900 text-2xl">{resortName}</h1>
              </div>
              <button 
                onClick={refetch}
                disabled={loading}
                className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                title="Refresh statistics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{resortLocation}</p>
            
            {error ? (
              <div className="text-red-600 text-sm mb-4">{error}</div>
            ) : loading ? (
              <div className="text-gray-500 text-sm mb-4">Loading statistics...</div>
            ) : (
              <>
                {/* Current Meal Period Info */}
                <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Current Period: {stats.currentMealType.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatMealTime(stats.currentMealType)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      stats.isWithinMealPeriod 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {stats.isWithinMealPeriod ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <span className="block text-lg font-bold text-green-700">
                      {stats.availableForCheckIn}
                    </span>
                    <span className="text-xs text-green-600">
                      Remainders for Check-in
                    </span>
                  </div>
                  
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <span className="block text-lg font-bold text-red-700">
                      {stats.currentPeriodCheckIns}
                    </span>
                    <span className="text-xs text-red-600">
                      Check-ins in Current Period
                    </span>
                  </div>
                  
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <span className="block text-lg font-bold text-blue-700">
                      {stats.totalTodayCheckIns}
                    </span>
                    <span className="text-xs text-blue-600">
                      Total Check-ins for Today
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Rooms: {stats.totalRooms}</span>
                    <span>Last Updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Restaurant Card - Dynamic restaurant name */}
        <Card classname="w-[48%] gap-6 bg-white">
          <div className="grid grid-cols-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-xl">
                {/* Dynamic restaurant name based on resort */}
                {resortName && resortName.toLowerCase().includes('water') 
                  ? 'Aqua Restaurant' 
                  : resortName && resortName.toLowerCase().includes('beach')
                  ? 'Beachside Restaurant'
                  : 'LIBAI Restaurant'
                }
              </h3>
              <span className={`text-xs px-3 py-1 rounded-full ${
                stats.isWithinMealPeriod 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {stats.isWithinMealPeriod ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Meal:</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.currentMealType.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Service Hours:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatMealTime(stats.currentMealType)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Diners:</span>
                <span className="text-sm font-bold text-red-600">
                  {stats.currentPeriodCheckIns}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Modal />
      
      <RoomGrid 
        mode="check-in"
        externalResorts={resorts}
        externalActiveResort={activeResort}
        onExternalResortChange={handleResortChange}
      />
    </div>
  );
}