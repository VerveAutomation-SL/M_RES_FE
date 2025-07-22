"use client";

import ReportFilters from "@/components/analytics/ReportFilters";
import TabNavigation from "@/components/analytics/TabNavigation";
import DailyCheckInsChart from "@/components/charts/CheckInsChart";
import Header from "@/components/layout/header";
import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [activeTab,setActiveTab] = useState<"overview" | "trends">("overview");
  const handleFiltersChange = (filters: {
    dateRange: string;
    resorts: string[];
    mealPlans: string[];
    mealTypes: string[];
  }) => {
    // Handle the filter changes here
  };

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

      <ReportFilters onFiltersChange={handleFiltersChange} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyCheckInsChart data={[]} />
          </div>
        </div>
      ):( 
        <div>
          HourlyTrends
        </div>
      )}
    </>
    
    

  );
}