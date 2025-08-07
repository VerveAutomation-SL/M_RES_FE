"use client";

import RecentCheckIns from "@/components/dashboard/RecentCheckIns";
import ResortOverview from "@/components/dashboard/ResortOverview";
import StatsCard from "@/components/dashboard/StatsCard";
import { useMealPeriodCheckIns } from "@/hooks/useMealPeriodCheckIns";
import { resortApi } from "@/lib/api";
import { Resort } from "@/lib/types";
import { Hotel, SquareCheck, UserRoundCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  console.log(user, "user in dashboard page");

  const { totalRooms, activehosts, checkedIn, available, mealType, loading } =
    useMealPeriodCheckIns();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [resortsLoading, setResortsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setResortsLoading(true);
        const resortsResponse = await resortApi.getAllResortsWithRooms();
        if (resortsResponse.success && resortsResponse.data) {
          setResorts(resortsResponse.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          // Handle specific Axios error
          console.error("Axios error:", error);
        }
      } finally {
        setResortsLoading(false);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchResorts();
    }
  }, [isAuthenticated, isLoading]);

  if (loading || resortsLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["Admin", "Manager", "Host"]}>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 mb-5">
        <StatsCard
          title="Total Rooms"
          value={totalRooms.toString()}
          subtitle="Across both resorts"
          bgColor="bg-white"
          textColor="text-gray-800"
          icon={<Hotel />}
        />
        <StatsCard
          title={`Checked In (${
            mealType[0].toUpperCase() + mealType.slice(1)
          })`}
          value={checkedIn.toString()}
          subtitle={`Total check-ins for ${
            mealType[0].toUpperCase() + mealType.slice(1)
          }`}
          bgColor="bg-white"
          textColor="text-red-600"
          icon={<UserRoundCheck />}
        />
        <StatsCard
          title="Available"
          value={available.toString()}
          subtitle={`Available for ${
            mealType[0].toUpperCase() + mealType.slice(1)
          }`}
          bgColor="bg-white"
          textColor="text-green-600"
          icon={<SquareCheck />}
        />
        <StatsCard
          title="Active Hosts"
          value={activehosts.toString()}
          subtitle="Across both resorts"
          bgColor="bg-white"
          textColor="text-purple-600"
          icon={<Users />}
        />
      </div>

      {/* Resort Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
        {resorts.map((resort) => (
          <ResortOverview key={resort.id} resort={resort} />
        ))}
      </div>
      <RecentCheckIns />
    </div>
    </ProtectedRoute>
  );
}
