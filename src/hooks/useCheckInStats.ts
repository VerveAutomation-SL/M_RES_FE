import { useState, useEffect } from 'react';
import { checkInApi, roomApi } from '@/lib/api';

interface CheckInStats {
  availableForCheckIn: number;
  currentPeriodCheckIns: number;
  totalTodayCheckIns: number;
  totalRooms: number;
  currentMealType: string;
  isWithinMealPeriod: boolean;
}

export const useCheckInStats = (resortId: number) => {
  const [stats, setStats] = useState<CheckInStats>({
    availableForCheckIn: 0,
    currentPeriodCheckIns: 0,
    totalTodayCheckIns: 0,
    totalRooms: 0,
    currentMealType: '',
    isWithinMealPeriod: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Meal time logic (same as ButtonGrid)
  const MEAL_TIMES = {
    breakfast: { start: "06:00:00", end: "10:30:00" },
    lunch: { start: "12:00:00", end: "16:00:00" },
    dinner: { start: "19:00:00", end: "22:30:00" }
  };

  const getCurrentMealType = () => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0];
    
    if (currentTime >= MEAL_TIMES.breakfast.start && currentTime <= MEAL_TIMES.breakfast.end) {
      return "breakfast";
    } else if (currentTime >= MEAL_TIMES.lunch.start && currentTime <= MEAL_TIMES.lunch.end) {
      return "lunch";
    } else if (currentTime >= MEAL_TIMES.dinner.start && currentTime <= MEAL_TIMES.dinner.end) {
      return "dinner";
    } else if (currentTime < MEAL_TIMES.breakfast.start) {
      return "breakfast";
    } else if (currentTime < MEAL_TIMES.lunch.start) {
      return "lunch";
    } else if (currentTime < MEAL_TIMES.dinner.start) {
      return "dinner";
    } else {
      return "breakfast";
    }
  };

  const isWithinMealPeriod = (mealType: string) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0];
    const mealPeriod = MEAL_TIMES[mealType as keyof typeof MEAL_TIMES];
    
    if (!mealPeriod) return false;
    
    return currentTime >= mealPeriod.start && currentTime <= mealPeriod.end;
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      const currentMeal = getCurrentMealType();
      const withinPeriod = isWithinMealPeriod(currentMeal);

      // Fetch multiple data sources
      const [roomsResponse, currentPeriodResponse, todayResponse] = await Promise.all([
        // Get total rooms for this resort
        roomApi.getRoomsByResort(resortId),
        
        // Get current meal period check-ins
        checkInApi.getCheckInStatus(resortId, currentMeal),
        
        
        // Get all today's check-ins
        checkInApi.getTodayCheckIns(resortId)
      ]);

      const totalRooms = roomsResponse?.data?.length || 0;
      const currentPeriodCheckIns = currentPeriodResponse?.data?.filter((item: any) => item.checked_in)?.length || 0;
      const totalTodayCheckIns = todayResponse?.data?.length || 0;
      
      // Available = Total rooms - Current period check-ins (only during meal periods)
      const availableForCheckIn = withinPeriod ? Math.max(0, totalRooms - currentPeriodCheckIns) : 0;

      setStats({
        availableForCheckIn,
        currentPeriodCheckIns,
        totalTodayCheckIns,
        totalRooms,
        currentMealType: currentMeal,
        isWithinMealPeriod: withinPeriod
      });

    } catch (err) {
      console.error('Error fetching check-in stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resortId) {
      fetchStats();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [resortId]);

  return { stats, loading, error, refetch: fetchStats };
};