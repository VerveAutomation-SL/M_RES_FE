"use client";

import RecentCheckIns from "@/components/dashboard/RecentCheckIns";
import ResortOverview from "@/components/dashboard/ResortOverview";
import StatsCard from "@/components/dashboard/StatsCard";
import { useMealPeriodCheckIns } from "@/hooks/useMealPeriodCheckIns";
import { resortApi } from "@/lib/api";
import { Resort } from "@/lib/types";
import { Hotel, SquareCheck, UserRoundCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const { totalRooms, checkedIn, available, mealType, loading } = useMealPeriodCheckIns();
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [resortsLoading, setResortsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchResorts();
    }, []);

    const fetchResorts = async () => {
        try {
            setResortsLoading(true);
            const resortsResponse = await resortApi.getAllResortsWithRooms();
            if (resortsResponse.success && resortsResponse.data) {
                setResorts(resortsResponse.data);
            }
        } catch (error) {
            console.error("Error fetching resorts:", error);
        } finally {
            setResortsLoading(false);
        }
    };

    if (loading || resortsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-8">
                <StatsCard
                    title="Total Rooms"
                    value={totalRooms.toString()}
                    subtitle="Across both resorts"
                    bgColor="bg-white"
                    textColor="text-gray-800"
                    icon={<Hotel />}
                />
                <StatsCard
                    title={`Checked In (${mealType})`}
                    value={checkedIn.toString()}
                    subtitle={`Total check-ins for ${mealType}`}
                    bgColor="bg-white"
                    textColor="text-red-600"
                    icon={<UserRoundCheck />}
                />
                <StatsCard
                    title="Available"
                    value={available.toString()}
                    subtitle={`Available for ${mealType}`}
                    bgColor="bg-white"
                    textColor="text-green-600"
                    icon={<SquareCheck />}
                />
                <StatsCard
                    title="Active Hosts"
                    value="40"
                    subtitle="Across both resorts"
                    bgColor="bg-white"
                    textColor="text-purple-600"
                    icon={<Users />}
                />
            </div>

            {/* Resort Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {resorts.map((resort) => (
                    <ResortOverview key={resort.id} resort={resort} />
                ))}
            </div>
            <RecentCheckIns />
        </div>
    );
}
