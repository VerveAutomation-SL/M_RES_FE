"use client";

interface TabNavigationProps {
    activeTab: "overview" | "trends";
    onTabChange: (tab: "overview" | "trends") => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-full sm:w-fit">
            <button
                onClick={() => onTabChange("overview")}
                className={`px-4 sm:px-6 py-3 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none sm:w-40 ${
                    activeTab === 'overview' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                Overview
            </button>
            <button
                onClick={() => onTabChange("trends")}
                className={`px-4 sm:px-6 py-3 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none sm:w-40 ${
                    activeTab === 'trends' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                Trends
            </button>
        </div>
    );
}