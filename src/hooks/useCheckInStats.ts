import { useState, useEffect } from 'react';
import { checkInApi, roomApi } from '@/lib/api';
import { getCurrentMealType, MEAL_TIMES } from '@/lib/data';

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