"use client";

import ReportFilters from "@/components/analytics/ReportFilters";
import TabNavigation from "@/components/analytics/TabNavigation";
import DailyCheckInsChart from "@/components/charts/CheckInsChart";
import HourlyTrendsChart from "@/components/charts/HourlyTrendsChart";
import MealDistributionChart from "@/components/charts/MealDistrubtionChart";
import Header from "@/components/layout/header";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import {
  exportExcelReport,
  exportPdfReport,
  getAnalyticsData,
  getPreviewData,
} from "@/lib/api/analyticsApi";
import {
  AnalyticsResponse,
  AppError,
  checkInRecord,
  PreviewPagination,
  ReportFilterData,
} from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Sheet,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();

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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState<"pdf" | "excel" | null>(
    null
  );

  // Pagination state
  //const [currentPage, setCurrentPage] = useState(1);
  //const pageSize = 20;
  //const totalPages = Math.ceil(previewData.length / pageSize);

  const [remarkModal, setRemarkModal] = useState<{
    open: boolean;
    remark: string | null;
    roomNumber?: string | number | null;
  }>({ open: false, remark: "", roomNumber: null });

  const { isAuthenticated, isLoading } = useAuthStore();

  // Resort mapping
  const resortNames: { [key: number]: string } = {
    1: "dhigurah",
    2: "falhumaafushi",
  };

  // Handle filters change from ReportFilters component
  const handleFiltersChange = (newFilters: ReportFilterData) => {
    setFilters(newFilters);
  };

  // Handle preview data from ReportFilters component
  const handlePreviewData = (
    data: checkInRecord[],
    paginationData: PreviewPagination
  ) => {
    setPreviewData(data);
    setPagination(paginationData);
    setShowPreview(true);
    setFilterLoading(false);
  };

  // Handle page changes
  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    setFilterLoading(true);

    try {
      const response = await getPreviewData({
        ...filters,
        page: newPage,
        pageSize: pagination.pageSize,
      });

      if (response.success) {
        setPreviewData(response.data);
        setPagination(response.pagination);

        const previewElement = document.getElementById("preview-section");
        if (previewElement) {
          previewElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    } catch (error) {
      console.log("Error fetching preview data:", error);
      if (error instanceof AppError) {
        setError(error.message);
        console.log(error.message);
      } else {
        setError("An unexpected error occurred while fetching preview data.");
        console.log(error);
      }
    } finally {
      setFilterLoading(false);
    }
  };

  // Utility functions
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "checked-in") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === "checked-out") {
      return `${baseClasses} bg-red-100 text-red-800`;
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
    return { date };
  };

  // Export functions
  const handleExportPDF = async () => {
    try {
      setExportLoading("pdf");
      const pdfBlob = await exportPdfReport(filters);
      const { date } = formatDateTime();
      const filename = `checkins_report_${date}.pdf`;
      downloadFile(pdfBlob, filename);
      setExportDropdownOpen(false);
    } catch (error) {
      if (error instanceof AppError) {
        if (error.statusCode === 403 || error.statusCode === 401) {
          toast.error(
            "You do not have permission to export this report. Please log in again."
          );
          router.push("/login");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unexpected error occurred while exporting PDF report.");
      }
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportLoading("excel");
      const excelBlob = await exportExcelReport(filters);
      const { date } = formatDateTime();
      const filename = `checkins_report_${date}.xlsx`;
      downloadFile(excelBlob, filename);
      setExportDropdownOpen(false);
    } catch (error) {
      if (error instanceof AppError) {
        if (error.statusCode === 403 || error.statusCode === 401) {
          toast.error(
            "You do not have permission to export this report. Please log in again."
          );
          router.push("/login");
        } else {
          toast.error(error.message);
        }
      } else {
        console.error("Error exporting Excel report:", error);
        toast.error(
          "An unexpected error occurred while exporting Excel report."
        );
      }
    } finally {
      setExportLoading(null);
    }
  };

  // Fetch analytics data on component mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await getAnalyticsData();
        setAnalyticsData(response.data);
        setError(null);
      } catch (error) {
        if (error instanceof AppError) {
          toast.error(error.message);
        } else {
          toast.error(
            "An unexpected error occurred while fetching preview data."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchAnalyticsData();
    }
  }, [isAuthenticated, isLoading]);

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

  // Transform functions for new charts
  // const transformResortOccupancyData = () => {
  //   if (!analyticsData?.resortOccupancy) {
  //     // Mock data for demonstration
  //     return [
  //       { name: "Dhigurah", value: 75, percentage: 68.2, color: "#8B5CF6" },
  //       {
  //         name: "Falhumaafushi",
  //         value: 85,
  //         percentage: 77.3,
  //         color: "#10B981",
  //       },
  //       { name: "Available", value: 40, percentage: 25.5, color: "#6B7280" },
  //     ];
  //   }

  //   return analyticsData.resortOccupancy.map((item) => ({
  //     name: item.resort_name,
  //     value: item.occupied_rooms,
  //     percentage: item.occupancy_percentage,
  //     color: item.resort_name === "dhigurah" ? "#8B5CF6" : "#10B981",
  //   }));
  // };

  // const transformWeeklyPerformanceData = () => {
  //   if (!analyticsData?.weeklyPerformance) {
  //     // Mock data for demonstration
  //     return [
  //       { week: "Week 1", checkIns: 156, checkOuts: 142 },
  //       { week: "Week 2", checkIns: 189, checkOuts: 176 },
  //       { week: "Week 3", checkIns: 234, checkOuts: 198 },
  //       { week: "Week 4", checkIns: 201, checkOuts: 215 },
  //     ];
  //   }

  //   return analyticsData.weeklyPerformance.map((item) => ({
  //     week: `${item.week_start} - ${item.week_end}`,
  //     checkIns: item.total_checkins,
  //     checkOuts: item.total_checkouts,
  //     revenue: item.revenue,
  //   }));
  // };

  // const transformMealPlanDistributionData = () => {
  //   if (!analyticsData?.mealPlanDistribution) {
  //     // Mock data for demonstration
  //     return [
  //       { name: "All Inclusive", value: 120, percentage: 60, color: "#8B5CF6" },
  //       { name: "Half Board", value: 50, percentage: 25, color: "#10B981" },
  //       { name: "Breakfast Only", value: 20, percentage: 10, color: "#F59E0B" },
  //       { name: "Full Board", value: 10, percentage: 5, color: "#EF4444" },
  //     ];
  //   }

  //   return analyticsData.mealPlanDistribution.map((item, index) => {
  //     const colors = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];
  //     return {
  //       name: item.meal_plan,
  //       value: item.guest_count,
  //       percentage: item.percentage,
  //       color: colors[index % colors.length],
  //     };
  //   });
  // };

  // const transformPeakHoursData = () => {
  //   if (!analyticsData?.peakHours) {
  //     // Mock data for demonstration
  //     const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  //     const mockData = [];

  //     for (const day of days) {
  //       for (let hour = 0; hour < 24; hour++) {
  //         const value =
  //           Math.floor(Math.random() * 20) + (hour >= 7 && hour <= 22 ? 5 : 0);
  //         mockData.push({
  //           day,
  //           hour,
  //           value,
  //           color: "#3B82F6",
  //         });
  //       }
  //     }
  //     return mockData;
  //   }

  //   return analyticsData.peakHours.map((item) => ({
  //     day: item.day_of_week,
  //     hour: item.hour,
  //     value: item.checkin_count,
  //     color: "#3B82F6",
  //   }));
  // };

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
  // const resortOccupancyData = transformResortOccupancyData();
  // const weeklyPerformanceData = transformWeeklyPerformanceData();
  // const mealPlanDistributionData = transformMealPlanDistributionData();
  // const peakHoursData = transformPeakHoursData();

  return (
    <ProtectedRoute allowedRoles={["Admin", "Manager", "Host"]}>
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
                      onClick={handleExportPDF}
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
                      onClick={handleExportExcel}
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
                className="fixed inset-0 z-40 bg-transparent bg-opacity-10 sm:bg-transparent"
                onClick={() => setExportDropdownOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Report Filters Component */}
        <ReportFilters
          onFiltersChange={handleFiltersChange}
          onPreviewData={handlePreviewData}
          loading={filterLoading}
        />

        {/* Preview Section */}
        {showPreview && (
          <div
            id="preview-section"
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6"
          >
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
                  {previewData.map((record) => (
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
                  ))}

                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPrevPage || filterLoading}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {filterLoading ? "Loading..." : "Previous"}
                      </button>
                      <span className="text-xs">
                        Page {pagination.currentPage} of {pagination.totalPages}
                        ({pagination.totalCount} total records)
                      </span>
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={!pagination.hasNextPage || filterLoading}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {filterLoading ? "Loading..." : "Next"}
                      </button>
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
                            {record.status === "checked-out" &&
                              record.checkout_remarks && (
                                <button
                                  className="ml-2 text-blue-600 hover:underline flex items-center gap-1 text-xs cursor-pointer"
                                  onClick={() =>
                                    setRemarkModal({
                                      open: true,
                                      remark: record.checkout_remarks!,
                                      roomNumber: record.room_number,
                                    })
                                  }
                                  title="View Remark"
                                  type="button"
                                >
                                  {/* <Eye className="w-4 h-4 cursor-pointer" /> */}
                                  View Remark
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination Controls */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-500">
                        Showing{" "}
                        {(pagination.currentPage - 1) * pagination.pageSize + 1}{" "}
                        to{" "}
                        {Math.min(
                          pagination.currentPage * pagination.pageSize,
                          pagination.totalCount
                        )}{" "}
                        of {pagination.totalCount} results
                      </div>

                      <div className="flex items-center gap-2">
                        {/* First page */}
                        {pagination.currentPage > 2 && (
                          <>
                            <button
                              onClick={() => handlePageChange(1)}
                              disabled={filterLoading}
                              className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                            >
                              1
                            </button>
                            {pagination.currentPage > 3 && (
                              <span className="px-2">...</span>
                            )}
                          </>
                        )}

                        {/* Previous page */}
                        {pagination.hasPrevPage && (
                          <button
                            onClick={() =>
                              handlePageChange(pagination.currentPage - 1)
                            }
                            disabled={filterLoading}
                            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                          >
                            {pagination.currentPage - 1}
                          </button>
                        )}

                        {/* Current page */}
                        <button
                          disabled
                          className="px-3 py-1 rounded bg-blue-600 text-white font-semibold cursor-pointer"
                        >
                          {pagination.currentPage}
                        </button>

                        {/* Next page */}
                        {pagination.hasNextPage && (
                          <button
                            onClick={() =>
                              handlePageChange(pagination.currentPage + 1)
                            }
                            disabled={filterLoading}
                            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                          >
                            {pagination.currentPage + 1}
                          </button>
                        )}

                        {/* Last page */}
                        {pagination.currentPage < pagination.totalPages - 1 && (
                          <>
                            {pagination.currentPage <
                              pagination.totalPages - 2 && (
                              <span className="px-2">...</span>
                            )}
                            <button
                              onClick={() =>
                                handlePageChange(pagination.totalPages)
                              }
                              disabled={filterLoading}
                              className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                            >
                              {pagination.totalPages}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "overview" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
              <DailyCheckInsChart data={dailyCheckInsData} />
              <MealDistributionChart data={mealDistributionData} />
              {/* <ResortOccupancyChart data={resortOccupancyData} />
              <MealPlanDistributionChart data={mealPlanDistributionData} />
              <WeeklyPerformanceChart data={weeklyPerformanceData} />
              <div className="lg:col-span-1">
                <PeakHoursHeatmapChart data={peakHoursData} />
              </div> */}
            </div>
          </div>
        ) : (
          <div className="space-y-6 mb-5">
            <HourlyTrendsChart data={hourlyTrendsData} />
          </div>
        )}

        {/* Modern Remark Modal */}
        {remarkModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
              className="relative rounded-2xl shadow-2xl p-7 max-w-md w-full border border-[var(--primary)] bg-[var(--background)] dark:bg-[#232323]/90 animate-[modalPop_0.25s_ease]"
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 text-[var(--primary)] hover:text-[var(--highlight-text)] transition-colors cursor-pointer"
                onClick={() =>
                  setRemarkModal({ open: false, remark: "", roomNumber: null })
                }
                aria-label="Close"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Room badge and icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow">
                  <span className="text-xl font-bold text-white drop-shadow">
                    {remarkModal.roomNumber}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--heading-text)] dark:text-white">
                      Checkout Remark
                    </h3>
                  </div>
                  <div className="text-xs text-[var(--highlight-text)] mt-0.5">
                    Room {remarkModal.roomNumber}
                  </div>
                </div>
              </div>

              {/* Remark content */}
              <div className="mb-6">
                <p className="text-[var(--foreground)] dark:text-gray-100 text-base whitespace-pre-line leading-relaxed">
                  {remarkModal.remark}
                </p>
              </div>

              {/* Close action */}
              <button
                className="w-full py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--secondary)] text-white font-semibold transition-colors shadow cursor-pointer"
                onClick={() =>
                  setRemarkModal({ open: false, remark: "", roomNumber: null })
                }
              >
                Close
              </button>
            </div>
            {/* Modal pop animation */}
            <style>
              {`
                @keyframes modalPop {
                  0% { transform: scale(0.95) translateY(30px); opacity: 0; }
                  100% { transform: scale(1) translateY(0); opacity: 1; }
                }
              `}
            </style>
          </div>
        )}

        {filterLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </>
    </ProtectedRoute>
  );
}
