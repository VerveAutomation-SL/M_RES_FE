"use client";

import { Filter, Calendar, MapPin, Utensils, Eye, RefreshCw } from "lucide-react";
import { useEffect, useState} from "react";
import { ReportFilterData, Resort, checkInRecord } from "@/lib/types";
import { getPreviewData } from "@/lib/api/analyticsApi";
import { resortApi } from "@/lib/api";
import { mealPlans, mealTypes, statuses } from "@/lib/data";

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportFilterData) => void;
  onPreviewData: (data: checkInRecord[]) => void;
  loading?: boolean;
}

export default function ReportFilters({ 
  onFiltersChange, 
  onPreviewData, 
  loading 
}: ReportFiltersProps) {
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

  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resorts, setResorts] = useState<Resort[]>([]);
  const [resortsLoading, setResortsLoading] = useState(true);

  const filterOptions = {
    resorts: resorts,
    outlets: ['Libai', 'Beach Resort', 'Pool Bar', 'Sunset Lounge'],
    mealTypes: mealTypes.map(type => type.value),
    mealPlans: mealPlans.map(plan => plan.value),
    statuses: statuses.map(status => status.value)
  };

  // Fetch resorts on component mount
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setResortsLoading(true);
        console.log("Fetching resorts...");

        const response = await resortApi.getAllResorts();
        const resortsData = response.data ?? [];

        setResorts(resortsData);
        console.log("Resorts fetched:", resortsData);
      } catch (error) {
        console.error("Error fetching resorts:", error);
      } finally {
        setResortsLoading(false);
      }
    };

    fetchResorts();
  }, []);



  const handleFilterChange = (key: keyof ReportFilterData, value: string | number | null) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    
    // Notify parent about filter changes
    onFiltersChange(newFilters);
  };

  const handlePreview = async () => {
    try {
        setPreviewLoading(true);
        setError(null);
      
      // Filter the data and send to parent
      const filteredData = await getPreviewData(filters);
      onPreviewData(filteredData);
    } catch (error) {
      console.error("Error filtering data:", error);
      setError("Failed to fetch preview data. Please try again.");
      onPreviewData([]);
    }finally{
        setPreviewLoading(false);
    }
  };

  const clearFilters = () => {
    const clearedFilters: ReportFilterData = {
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
    };
    
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onPreviewData([]);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
        {resortsLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Date Range Filters */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 cursor-pointer" />
            Check-in Date Range
          </h3>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.checkinStartDate || ''}
              onChange={(e) => handleFilterChange('checkinStartDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.checkinEndDate || ''}
              onChange={(e) => handleFilterChange('checkinEndDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              placeholder="End Date"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Check-out Date Range
          </h3>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.checkoutStartDate || ''}
              onChange={(e) => handleFilterChange('checkoutStartDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.checkoutEndDate || ''}
              onChange={(e) => handleFilterChange('checkoutEndDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Resort and Location Filters */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location Details
          </h3>
          <div className="space-y-2">
            <select
              value={filters.resort_id || ''}
              onChange={(e) => handleFilterChange('resort_id', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Resorts</option>
              {filterOptions.resorts.map(resort => (
                <option key={resort.id} value={resort.id}>{resort.name}</option>
              ))}
            </select>
            <select
              value={filters.outlet_name || ''}
              onChange={(e) => handleFilterChange('outlet_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Outlets</option>
              {filterOptions.outlets.map(outlet => (
                <option key={outlet} value={outlet}>{outlet}</option>
              ))}
            </select>
            <input
              type="text"
              value={filters.table_number || ''}
              onChange={(e) => handleFilterChange('table_number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              placeholder="Table Number (e.g., T15)"
            />
          </div>
        </div>

        {/* Meal and Status Filters */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Meal & Status
          </h3>
          <div className="space-y-2">
            <select
              value={filters.meal_type || ''}
              onChange={(e) => handleFilterChange('meal_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Meal Types</option>
              {mealTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={filters.meal_plan || ''}
              onChange={(e) => handleFilterChange('meal_plan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Meal Plans</option>
              {mealPlans.map(plan => (
                <option key={plan.value} value={plan.value}>
                  {plan.label}
                </option>
              ))}
            </select>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Status</option>
              {statuses.map(status =>(
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handlePreview}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          {loading ? 'Loading...' : 'Preview Data'}
        </button>

        <button
          onClick={clearFilters}
          disabled={previewLoading||loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}


