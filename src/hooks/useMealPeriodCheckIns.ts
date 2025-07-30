import { useState, useEffect } from "react";
import { checkInApi, resortApi, userApi } from "@/lib/api";
import { getCurrentMealType } from "@/lib/data";
import { CheckIn } from "@/lib/types";

export const useMealPeriodCheckIns = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalRooms: number;
    activehosts: number;
    checkedIn: number;
    available: number;
    checkIns: CheckIn[];
    mealType: string;
  }>({
    totalRooms: 0,
    activehosts: 0,
    checkedIn: 0,
    available: 0,
    checkIns: [],
    mealType: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const mealType = getCurrentMealType();

        const activeHostsResponse = await userApi.getActiveHosts();
        console.log("Active Hosts Response:", activeHostsResponse);
        const activeHosts = activeHostsResponse.data;
        console.log("Active Hosts:", activeHosts);

        // Fetch all resorts and rooms
        const resortsResponse = await resortApi.getAllResortsWithRooms();
        const resorts = resortsResponse.data || [];
        const totalRooms = resorts.reduce(
          (sum, resort) => sum + (resort.Rooms?.length || 0),
          0
        );

        // Fetch all check-ins for today
        const today = new Date().toISOString().split("T")[0];
        const checkInsResponse = await checkInApi.getAllCheckInsToday(today);
        const allCheckIns = checkInsResponse.data || [];

        // Filter check-ins by meal period and checked-in status
        const mealPeriodCheckIns = allCheckIns.filter(
          (item: any) =>
            item.meal_type?.toLowerCase() === mealType.toLowerCase() &&
            item.status === "checked-in"
        );



        setStats({
          totalRooms,
          activehosts: activeHosts,
          checkedIn: mealPeriodCheckIns.length,
          available: totalRooms - mealPeriodCheckIns.length,
          checkIns: mealPeriodCheckIns,
          mealType,
        });
      } catch (error) {
        setStats({
          totalRooms: 0,
          activehosts: 0,
          checkedIn: 0,
          available: 0,
          checkIns: [],
          mealType: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { ...stats, loading };
};