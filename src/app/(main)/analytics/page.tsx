"use client";

import ReportFilters from "@/components/analytics/ReportFilters";
import TabNavigation from "@/components/analytics/TabNavigation";
import DailyCheckInsChart from "@/components/charts/CheckInsChart";
import HourlyTrendsChart from "@/components/charts/HourlyTrendsChart";
import MealDistributionChart from "@/components/charts/MealDistrubtionChart";
import Header from "@/components/layout/header";
import { getAnalyticsData } from "@/lib/api/analyticsApi";
import { AnalyticsResponse } from "@/lib/types";
import { Download, FileSpreadsheet } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [activeTab,setActiveTab] = useState<"overview" | "trends">("overview");
  const [filters, setFilters] = useState({
    dateRange: "last7Days",
    resorts: ["dhigurah", "falhumaafushi"],
    mealPlans: ["all"],
    mealTypes: ["breakfast", "lunch", "dinner"],
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resort mapping 
  const resortNames: { [key: number]: string } = {
    1: 'dhigurah',
    2: 'falhumaafushi'
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  }; 

  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await getAnalyticsData();
        setAnalyticsData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Transform backend data for DailyCheckInsChart
  const transformDailyCheckInsData = () => {
    if (!analyticsData?.checkInsLastWeek) return [];

    const dateMap: { [key: string]: { [key: string]: number } } = {};
    
    analyticsData.checkInsLastWeek.forEach(item => {
      const date = item.checkin_date;
      const resortName = resortNames[item.resort_id] || `resort_${item.resort_id}`;
      const count = item.total_checkins;
      
      if (!dateMap[date]) {
        dateMap[date] = {};
      }
      dateMap[date][resortName] = count;
    });

    return Object.entries(dateMap).map(([date, resorts]) => {
      const dateObj = new Date(date);
      const dayIndex = dateObj.getDay();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = days[dayIndex];
      
      return {
        date: dayName,
        dhigurah: resorts.dhigurah || 0,
        falhumaafushi: resorts.falhumaafushi || 0
      };
    })
  };

  const transformMealDistributionData = () => {
    if (!analyticsData?.mealDistribution) return [];

    return analyticsData.mealDistribution.map(item => ({
      name: item.meal_type.charAt(0).toUpperCase() + item.meal_type.slice(1),
      value: parseInt(item.meals_count),
      percentage: parseFloat(item.meals_percentage)
    }));
  };

  const transformHourlyTrendsData = () => {
    if (!analyticsData?.hourlyTrends) return [];

    return analyticsData.hourlyTrends.map(item => ({
      time: item.time,
      checkIns: item.checkIns
    }));
  }
  
  // const hourlyTrendsData = [
  //   { time: '6:00', checkIns: 15 },
  //   { time: '7:00', checkIns: 32 },
  //   { time: '8:00', checkIns: 45 },
  //   { time: '9:00', checkIns: 28 },
  //   { time: '10:00', checkIns: 18 },
  //   { time: '11:00', checkIns: 12 },
  //   { time: '12:00', checkIns: 38 },
  //   { time: '13:00', checkIns: 52 },
  //   { time: '14:00', checkIns: 41 },
  //   { time: '15:00', checkIns: 25 },
  //   { time: '16:00', checkIns: 15 },
  //   { time: '17:00', checkIns: 22 },
  //   { time: '18:00', checkIns: 35 },
  //   { time: '19:00', checkIns: 68 },
  //   { time: '20:00', checkIns: 75 },
  //   { time: '21:00', checkIns: 45 },
  //   { time: '22:00', checkIns: 20 }
  // ];

  // const dailyCheckInsData = [
  //   { date: 'Mon', dhigurah: 45, falhumaafushi: 38 },
  //   { date: 'Tue', dhigurah: 52, falhumaafushi: 42 },
  //   { date: 'Wed', dhigurah: 48, falhumaafushi: 35 },
  //   { date: 'Thu', dhigurah: 61, falhumaafushi: 48 },
  //   { date: 'Fri', dhigurah: 55, falhumaafushi: 52 },
  //   { date: 'Sat', dhigurah: 67, falhumaafushi: 58 },
  //   { date: 'Sun', dhigurah: 58, falhumaafushi: 45 }
  // ];

  // const mealDistributionData = [
  //   { name: 'Breakfast', value: 145, percentage: 35 },
  //   { name: 'Lunch', value: 104, percentage: 25 },
  //   { name: 'Dinner', value: 166, percentage: 40 }
  // ];

  if( loading) {
    return(
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if(error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const dailyCheckInsData = transformDailyCheckInsData();
  const mealDistributionData = transformMealDistributionData();
  const hourlyTrendsData = transformHourlyTrendsData();

  return (
    <>
    <div className="block sm:flex justify-between items-center transition-all duration-200">
        <Header
          title="Reports & Analytics"
          subtitle="Comprehensive insights and data analysis of all resorts"
        />

        <div className="flex h-15 gap-4 mt-4 sm:mt-0">
          <button 
            
            className="flex w-full p-2 justify-center items-center 
                      sm:w-fit lg:px-4 lg:py-3 my-2 text-xs md:text-base text-black border-2 border-[var(--primary)] rounded-full hover:bg-[var(--primary)] hover:text-white transition-all duration-200 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            <span className="items-center text-nowrap">Export PDF</span>
          </button>
          <button 
            
            className="flex w-full p-2 justify-center items-center
                      sm:w-fit lg:px-4 lg:py-3 my-2 text-xs md:text-base text-white border-2 rounded-full bg-[var(--primary)] hover:bg-white hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="items-center text-nowrap">Export Excel</span>
          </button>
        </div>
      </div>

      <ReportFilters onFiltersChange={handleFiltersChange}/>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyCheckInsChart data={dailyCheckInsData} />
            <MealDistributionChart data={mealDistributionData} />
          </div>
        </div>
      ):( 
        <div className="space-y-6">
          <HourlyTrendsChart data={hourlyTrendsData} />
        </div>
      )}
    </>
    
    

  );
}