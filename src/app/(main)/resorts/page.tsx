"use client";
import ResortForm from "@/components/forms/resortForm";
import Header from "@/components/layout/header";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import RoomGrid from "@/components/layout/roomGrid";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { checkInApi, resortApi } from "@/lib/api";
import { getCurrentMealType } from "@/lib/data";
import { ResortStats, Resort, RoomStatus } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { ChevronRight, MapPin } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const Page = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Add state for check-in stats
  const [resortStats, setResortStats] = useState<Record<number, ResortStats>>(
    {}
  );

  const { isAuthenticated, isLoading, user } = useAuthStore();

  console.log(user, "user in resorts page");

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchResorts = async () => {
      setLoading(true);
      try {
        const response = await resortApi.getAllResortsWithRooms();
        console.log("Fetched resorts:", response.data);
        if (response.success) {
          setResorts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch resorts:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchResorts();
    }
  }, [isAuthenticated, isLoading, refreshTrigger]);

  // Fetch check-in stats for each resort
  useEffect(() => {
    const fetchResortStats = async () => {
      if (resorts.length > 0) {
        const statsPromises = resorts.map(async (resort) => {
          try {
            // Get today's check-ins
            const todayResponse = await checkInApi.getTodayCheckIns(resort.id);

            // Get current check-in status for active diners
            const currentMeal = getCurrentMealType();
            const activeResponse = await checkInApi.getCheckInStatus(
              resort.id,
              currentMeal
            );
            console.log(activeResponse, "activeResponse");

            // Process the data
            const todayCheckInsCount = todayResponse?.data?.length || 0;
            const activeCheckInsCount =
              activeResponse?.data?.filter(
                (item: RoomStatus) => item.checked_in
              )?.length || 0;

            return {
              resortId: resort.id,
              stats: {
                todayCheckIns: todayCheckInsCount,
                activeCheckIns: activeCheckInsCount,
              },
            };
          } catch (error) {
            console.error(
              `Error fetching stats for resort ${resort.id}:`,
              error
            );
            return {
              resortId: resort.id,
              stats: {
                todayCheckIns: 0,
                activeCheckIns: 0,
              },
            };
          }
        });

        const results = await Promise.all(statsPromises);
        const statsMap = results.reduce((acc, { resortId, stats }) => {
          acc[resortId] = stats;
          return acc;
        }, {} as Record<number, ResortStats>);

        console.log("Resort stats:", statsMap); // Debug log
        setResortStats(statsMap);
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchResortStats();
    }
  }, [isAuthenticated, isLoading, resorts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 424;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const needsScrolling = resorts.length > 3;

  // Get responsive grid classes based on number of resorts
  const getGridClasses = () => {
    if (needsScrolling) {
      return "flex gap-4 overflow-x-auto custom-scrollbar pb-2";
    }

    // Static grid for 2-3 resorts
    if (resorts.length === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-4";
    } else if (resorts.length === 3) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
    } else {
      return "grid grid-cols-1 gap-4";
    }
  };

  // Get card classes based on scrolling mode
  const getCardClasses = () => {
    if (needsScrolling) {
      return "bg-white shadow-sm flex-shrink-0 w-62 md:w-72 lg:w-80 xl:w-96 transition-transform duration-200 hover:scale-105 cursor-pointer";
    }
    return "bg-white shadow-sm w-full";
  };

  const handleAddResort = () => {
    setShowModal(true);
  };

  const handleResortCreated = () => {
    console.log("Resort created, refreshing...");
    setRefreshTrigger((prev) => prev + 1); // Trigger re-fetch
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <>
        <Header
          title="Resort Management"
          subtitle="Manage your resorts and rooms efficiently."
          addButton="Add Resort"
          onClick={handleAddResort}
        />
        <div className="relative">
          {/* Navigation Buttons */}
          {needsScrolling && (
            <Button
              className="absolute right-5 -top-1/12 z-10 bg-gray-200 shadow-md hover:bg-gray-50 p-1 md:p-2 cursor-pointer"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}

          {/* Scrollable Cards Container */}
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[var(--primary)]"></div>
              <span className="ml-2 text-gray-700">Loading...</span>
            </div>
          ) : resorts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <h3 className="text-lg font-medium">No resorts found</h3>
                <p className="text-sm">
                  Create your first resort to get started
                </p>
              </div>
              <button
                onClick={handleAddResort}
                className="px-6 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-amber-900 transition-colors"
              >
                Add Your First Resort
              </button>
            </div>
          ) : (
            <div
              ref={needsScrolling ? scrollRef : null}
              className={getGridClasses()}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {resorts.map((resort) => (
                <Card key={resort.id} classname={getCardClasses()}>
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <MapPin className="w-4 md:w-5 h-4 md:h-5 text-gray-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                          {resort.name}
                        </h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                      <div>
                        <div className="text-xl md:text-2xl font-bold text-blue-600">
                          {resort.Rooms.length}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          Total Rooms
                        </div>
                      </div>
                      <div>
                        <div className="text-xl md:text-2xl font-bold text-green-500">
                          {resortStats[resort.id]?.todayCheckIns || 0}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          Today&apos;s Check-ins
                        </div>
                      </div>
                      <div>
                        <div className="text-xl md:text-2xl font-bold text-red-500">
                          {resortStats[resort.id]?.activeCheckIns || 0}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          Currently Dining
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <RoomGrid
          mode="view-details"
          addButton="Add Room"
          onClick={() => {}}
          key={refreshTrigger}
        />

        {showModal && (
          <ResortForm
            isOpen={showModal}
            onClose={handleCloseModal}
            onSuccess={handleResortCreated}
          />
        )}
      </>
    </ProtectedRoute>
  );
};

export default Page;
