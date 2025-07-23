"use client";

import ReportFilters from "@/components/analytics/ReportFilters";
import TabNavigation from "@/components/analytics/TabNavigation";
import DailyCheckInsChart from "@/components/charts/CheckInsChart";
import HourlyTrendsChart from "@/components/charts/HourlyTrendsChart";
import MealDistributionChart from "@/components/charts/MealDistrubtionChart";
import Header from "@/components/layout/header";
import { getAnalyticsData } from "@/lib/api/analyticsApi";
import { AnalyticsResponse, checkInRecord, ReportFilterData } from "@/lib/types";
import { ChevronDown, Download, Eye, FileText, Sheet, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data structure based on your backend
const mockCheckInData: checkInRecord[] = [
  {
    id: 1,
    room_number: "101",
    resort_name: "Dhigurah Resort",
    outlet_name: "Main Restaurant",
    table_number: "T15",
    meal_type: "breakfast",
    meal_plan: "all-inclusive",
    check_in_date: "2025-07-20",
    check_in_time: "08:30:00",
    check_out_time: "09:15:00",
    status: "checked-out",
    checkout_remarks: "Great service"
  },
  {
    id: 2,
    room_number: "205",
    resort_name: "Falhumaafushi Resort",
    outlet_name: "Beachside Cafe",
    table_number: "T08",
    meal_type: "lunch",
    meal_plan: "full-board",
    check_in_date: "2025-07-20",
    check_in_time: "12:45:00",
    check_out_time: undefined,
    status: "checked-in",
    checkout_remarks: undefined
  },
  {
    id: 3,
    room_number: "308",
    resort_name: "Dhigurah Resort",
    outlet_name: "Pool Bar",
    table_number: "T22",
    meal_type: "dinner",
    meal_plan: "half-board",
    check_in_date: "2025-07-19",
    check_in_time: "19:20:00",
    check_out_time: "20:45:00",
    status: "checked-out",
    checkout_remarks: "Excellent food"
  }
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "trends">("overview");
  const [filters, setFilters] = useState<ReportFilterData>({
    checkinStartDate: '',
    checkinEndDate: '',
    checkoutStartDate: '',
    checkoutEndDate: '',
    resort_id: null,
    outlet_name: '',
    room_id: null,
    table_number: '',
    meal_type: '',
    meal_plan: '',
    status: ''
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [previewData, setPreviewData] = useState<checkInRecord[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Resort mapping 
  const resortNames: { [key: number]: string } = {
    1: 'dhigurah',
    2: 'falhumaafushi'
  };

  // Handle filters change from ReportFilters component
  const handleFiltersChange = (newFilters: ReportFilterData) => {
    console.log('🔄 Filters changed:', newFilters);
    setFilters(newFilters);
  };

  // Handle preview data from ReportFilters component
  const handlePreviewData = (data: checkInRecord[]) => {
    console.log('👁️ Preview data received:', data.length, 'records');
    setPreviewData(data);
    setShowPreview(true);
    setFilterLoading(false);
  };

  // Utility functions
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === 'checked-in') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return 'N/A';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Export functions
  const handleExportPDF = () => {
    console.log('📄 Exporting PDF with filters:', filters);
    console.log('📄 Preview data:', previewData);
    // TODO: Implement PDF export
    alert('PDF export will be implemented');
  };

  const handleExportExcel = () => {
    console.log('📊 Exporting Excel with filters:', filters);
    console.log('📊 Preview data:', previewData);
    // TODO: Implement Excel export
    alert('Excel export will be implemented');
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

  // Transform functions with fallback mock data
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
      const shortDate = dateObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
      
      return {
        date: `${dayName}\n${shortDate}`,
        dhigurah: resorts.dhigurah || 0,
        falhumaafushi: resorts.falhumaafushi || 0
      };
    });
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
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

        <div className="flex h-15 gap-4 mt-4 sm:mt-0 relative">
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all duration-200 w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Data</span>
              <span className="sm:hidden">Export</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {exportDropdownOpen && (
              <div className="absolute left-0 sm:right-0 mt-2 w-full sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      handleExportPDF();
                      setExportDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-medium">Export as PDF</div>
                      <div className="text-xs text-gray-500">Formatted report document</div>
                    </div>
                  </button>
                  
                  <div className="h-px bg-gray-100 mx-2"></div>
                  
                  <button
                    onClick={() => {
                      handleExportExcel();
                      setExportDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Sheet className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-medium">Export as Excel</div>
                      <div className="text-xs text-gray-500">Spreadsheet with raw data</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Add click outside to close dropdown */}
          {exportDropdownOpen && (
            <div 
              className="fixed inset-0 z-40  bg-opacity-25 sm:bg-transparent" 
              onClick={() => setExportDropdownOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Report Filters Component - now contains all filter logic */}
      <ReportFilters
        onFiltersChange={handleFiltersChange}
        onPreviewData={handlePreviewData}
        mockData={mockCheckInData}
        loading={filterLoading}
      />

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Data Preview</h2>
            </div>
            <span className="text-sm text-gray-500">({previewData.length} records found)</span>
          </div>

          {previewData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No records found matching your filters.</p>
            </div>
          ) : (
            <>
              {/* Mobile: Card Layout */}
              <div className="block sm:hidden space-y-4">
                {previewData.slice(0, 5).map((record) => ( // Show only first 5 on mobile
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">#{record.id}</span>
                        <span className={getStatusBadge(record.status)}>
                          {record.status?.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{record.room_number}</div>
                        <div className="text-xs text-gray-500">Room</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Resort</div>
                        <div className="font-medium text-gray-900 truncate">{record.resort_name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Outlet</div>
                        <div className="font-medium text-gray-900 truncate">{record.outlet_name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Table</div>
                        <div className="font-medium text-gray-900">{record.table_number}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Meal</div>
                        <div className="font-medium text-gray-900 capitalize">{record.meal_type}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500">Check-in</div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.check_in_date} {formatTime(record.check_in_time)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Check-out</div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.check_out_time ? formatTime(record.check_out_time) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {previewData.length > 5 && (
                  <div className="text-center py-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Showing 5 of {previewData.length} records. 
                      <button 
                        onClick={handleExportExcel}
                        className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                      >
                        Export all data
                      </button>
                    </p>
                  </div>
                )}
              </div>

              {/* Desktop: Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resort</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outlet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.room_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.resort_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.outlet_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.table_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{record.meal_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{record.meal_plan?.replace('-', ' ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{record.check_in_date}</div>
                          <div className="text-xs text-gray-500">{formatTime(record.check_in_time)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.check_out_time ? formatTime(record.check_out_time) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(record.status)}>
                            {record.status?.replace('-', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyCheckInsChart data={dailyCheckInsData} />
            <MealDistributionChart data={mealDistributionData} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <HourlyTrendsChart data={hourlyTrendsData} />
        </div>
      )}
    </>
  );
}