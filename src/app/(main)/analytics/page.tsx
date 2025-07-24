"use client";

import ReportFilters from "@/components/analytics/ReportFilters";
import TabNavigation from "@/components/analytics/TabNavigation";
import DailyCheckInsChart from "@/components/charts/CheckInsChart";
import HourlyTrendsChart from "@/components/charts/HourlyTrendsChart";
import MealDistributionChart from "@/components/charts/MealDistrubtionChart";
import Header from "@/components/layout/header";
import {
  exportExcelReport,
  exportPdfReport,
  getAnalyticsData,
} from "@/lib/api/analyticsApi";
import {
  AnalyticsResponse,
  checkInRecord,
  ReportFilterData,
} from "@/lib/types";
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Sheet,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "trends">("overview");
  const [filters, setFilters] = useState<ReportFilterData>({
    checkinStartDate: "",
    checkinEndDate: "",
    checkoutStartDate: "",
    checkoutEndDate: "",
    resort_id: null,
    outlet_name: "",
    room_id: null,
    table_number: "",
    meal_type: "",
    meal_plan: "",
    status: "",
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(
    null
  );
  const [previewData, setPreviewData] = useState<checkInRecord[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState<"pdf" | "excel" | null>(
    null
  );

  // Resort mapping
  const resortNames: { [key: number]: string } = {
    1: "dhigurah",
    2: "falhumaafushi",
  };

  // Handle filters change from ReportFilters component
  const handleFiltersChange = (newFilters: ReportFilterData) => {
    console.log("🔄 Filters changed:", newFilters);
    setFilters(newFilters);
  };

  // Handle preview data from ReportFilters component
  const handlePreviewData = (data: checkInRecord[]) => {
    console.log("👁️ Preview data received:", data.length, "records");
    console.log("Preview data:", data);
    setPreviewData(data);
    setShowPreview(true);
    setFilterLoading(false);
  };

  // Utility functions
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "checked-in") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return "N/A";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // download helper function
  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Helper function to format date and time
  const formatDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    //const time = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
    return { date };
  };

  // Export functions
  const handleExportPDF = async () => {
    try {
      setExportLoading("pdf");
      console.log("📄 Exporting PDF with filters:", filters);

      const pdfBlob = await exportPdfReport(filters);
      const { date } = formatDateTime();
      const filename = `checkins_report_${date}.pdf`;

      downloadFile(pdfBlob, filename);
      setExportDropdownOpen(false);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again later.");
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportLoading("excel");
      console.log("📊 Exporting Excel with filters:", filters);

      const excelBlob = await exportExcelReport(filters);
      const { date } = formatDateTime();
      const filename = `checkins_report_${date}.xlsx`;

      downloadFile(excelBlob, filename);
      setExportDropdownOpen(false);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Failed to export Excel. Please try again.");
    } finally {
      setExportLoading(null);
    }
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
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch analytics data");
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

    analyticsData.checkInsLastWeek.forEach((item) => {
      const date = item.checkin_date;
      const resortName =
        resortNames[item.resort_id] || `resort_${item.resort_id}`;
      const count = item.total_checkins;

      if (!dateMap[date]) {
        dateMap[date] = {};
      }
      dateMap[date][resortName] = count;
    });

    return Object.entries(dateMap).map(([date, resorts]) => {
      const dateObj = new Date(date);
      const dayIndex = dateObj.getDay();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = days[dayIndex];
      const shortDate = dateObj.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      });

      return {
        date: `${dayName}\n${shortDate}`,
        dhigurah: resorts.dhigurah || 0,
        falhumaafushi: resorts.falhumaafushi || 0,
      };
    });
  };

  const transformMealDistributionData = () => {
    if (!analyticsData?.mealDistribution) return [];

    return analyticsData.mealDistribution.map((item) => ({
      name: item.meal_type.charAt(0).toUpperCase() + item.meal_type.slice(1),
      value: parseInt(item.meals_count),
      percentage: parseFloat(item.meals_percentage),
    }));
  };

  const transformHourlyTrendsData = () => {
    if (!analyticsData?.hourlyTrends) return [];

    return analyticsData.hourlyTrends.map((item) => ({
      time: item.time,
      checkIns: item.checkIns,
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
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Data</span>
              <span className="sm:hidden">Export</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  exportDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 sm:right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-max">
                <div className="py-2">
                  <button
                    onClick={() => {
                      handleExportPDF();
                    }}
                    disabled={exportLoading !== null}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {exportLoading === "pdf" ? (
                      <div className="w-5 h-5 flex-shrink-0">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
                      </div>
                    ) : (
                      <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <div className="text-left flex-1">
                      <div className="font-medium">
                        {exportLoading === "pdf"
                          ? "Generating PDF..."
                          : "Export as PDF"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Formatted report document
                      </div>
                    </div>
                  </button>

                  <div className="h-px bg-gray-100 mx-2"></div>

                  <button
                    onClick={() => {
                      handleExportExcel();
                    }}
                    disabled={exportLoading !== null}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {exportLoading === "excel" ? (
                      <div className="w-5 h-5 flex-shrink-0">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent"></div>
                      </div>
                    ) : (
                      <Sheet className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                    <div className="text-left flex-1">
                      <div className="font-medium">
                        {exportLoading === "excel"
                          ? "Generating Excel..."
                          : "Export as Excel"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Spreadsheet with raw data
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Backdrop for mobile with better z-index */}
          {exportDropdownOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-10 sm:bg-transparent"
              onClick={() => setExportDropdownOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Report Filters Component - now contains all filter logic */}
      <ReportFilters
        onFiltersChange={handleFiltersChange}
        onPreviewData={handlePreviewData}
        loading={filterLoading}
      />

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Data Preview
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              ({previewData.length} records found)
            </span>
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
                {previewData.slice(0, 5).map(
                  (
                    record // Show only first 5 on mobile
                  ) => (
                    <div
                      key={record.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            #{record.id}
                          </span>
                          <span className={getStatusBadge(record.status)}>
                            {record.status?.replace("-", " ")}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {record.room_number}
                          </div>
                          <div className="text-xs text-gray-500">Room</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Resort
                          </div>
                          <div className="font-medium text-gray-900 truncate">
                            {record.resort_name}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Outlet
                          </div>
                          <div className="font-medium text-gray-900 truncate">
                            {record.outlet_name}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Table
                          </div>
                          <div className="font-medium text-gray-900">
                            {record.table_number}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Meal
                          </div>
                          <div className="font-medium text-gray-900 capitalize">
                            {record.meal_type}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div>
                          <div className="text-xs text-gray-500">Check-in</div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.check_in_date}{" "}
                            {formatTime(record.check_in_time)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Check-out</div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.check_out_date}{" "}
                            {formatTime(record.check_out_time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resort
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Outlet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.room_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.resort_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.outlet_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.table_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {record.meal_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {record.meal_plan?.replace("-", " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{record.check_in_date}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(record.check_in_time)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{record.check_out_date}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(record.check_out_time)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(record.status)}>
                            {record.status?.replace("-", " ")}
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

      {activeTab === "overview" ? (
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
