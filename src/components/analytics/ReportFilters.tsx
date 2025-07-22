"use client";

import { Filter } from "lucide-react";
import { useState } from "react";


interface ReportFiltersProps {
  onFiltersChange : (filters: {
    dateRange: string;
    resorts: string[];
    mealPlans: string[];
    mealTypes: string[];
  }) => void;
}

export default function ReportFilters({onFiltersChange}: ReportFiltersProps){
    const [dateRange, setDateRange] = useState("Last 07 Days");
    const [selectedResorts, setSelectedResorts] = useState(["All Resorts"]);
    const [mealType, setMealType] = useState(["All Meal Types"]);
    const [mealPlans, setMealPlans] = useState(["All Meal Plans"]);

    const handleApplyFilters = () => {
        onFiltersChange({
            dateRange,
            resorts: selectedResorts,
            mealPlans,
            mealTypes: mealType
        });
    };

    return(
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
                {/* Data Range */}
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                    </label>
                    <select value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent">
                        <option value="Last 07 Days">Last 07 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="Last 90 Days">Last 90 Days</option>
                        <option value="Custom Range">Custom Range</option>
                    </select>
                </div>
                {/* Resorts */}
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resort
                    </label>
                    <select
                        value={selectedResorts[0]}
                        onChange={(e) => setSelectedResorts([e.target.value])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                        <option>All Resorts</option>
                        <option>Dhigurah Resort</option>
                        <option>Falhumaafushi Resort</option>
                    </select>
                </div>
                {/* Meal Type */}
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meal Type
                    </label>
                    <select
                        value={mealType[0]}
                        onChange={(e) => setMealType([e.target.value])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                        
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                    </select>
                </div>

                {/* Meal Plans */}
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meal Plans
                    </label>
                    <select
                        value={mealPlans[0]}
                        onChange={(e) => setMealPlans([e.target.value])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                        <option>All Inclusive</option>
                        <option>Full Board</option>
                        <option>Half Board</option>
                    </select>
                </div>

                {/* Apply Button */}
                <button 
                    onClick={handleApplyFilters} 
                    className="px-6 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--secondary)] transition-colors cursor-pointer">
                    Apply Filters
                </button>
            </div>
        </div>
    );
};


