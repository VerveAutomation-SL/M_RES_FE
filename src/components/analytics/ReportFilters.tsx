"use client";

import { Filter, Calendar, MapPin, Utensils, Eye, RefreshCw } from "lucide-react";
import { useState} from "react";
import { ReportFilterData, checkInRecord } from "@/lib/types";
import { getPreviewData } from "@/lib/api/analyticsApi";

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

  const filterOptions = {
    resorts: [
      { id: 1, name: 'Dhigurah Resort' },
      { id: 2, name: 'Falhumaafushi Resort' }
    ],
    outlets: ['Libai', 'Beach Resort', 'Pool Bar', 'Sunset Lounge'],
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    mealPlans: ['all-inclusive', 'full-board', 'half-board'],
    statuses: ['checked-in', 'checked-out']
  };

  // Filter the data based on the selected filters
//   const filterData = (data: checkInRecord[]): checkInRecord[] => {
//     return data.filter(item => {
//       // Resort filtering - handle both empty and valid values
//       const matchesResort = !filters.resort_id || 
//         filters.resort_id === '' ||
//         filterOptions.resorts.find(r => r.id.toString() === filters.resort_id?.toString())?.name === item.resort_name;
      
//       const matchesOutlet = !filters.outlet_name || 
//         filters.outlet_name === '' || 
//         item.outlet_name === filters.outlet_name;
      
//       const matchesMealType = !filters.meal_type || 
//         filters.meal_type === '' || 
//         item.meal_type === filters.meal_type;
      
//       const matchesMealPlan = !filters.meal_plan || 
//         filters.meal_plan === '' || 
//         item.meal_plan === filters.meal_plan;
      
//       const matchesStatus = !filters.status || 
//         filters.status === '' || 
//         item.status === filters.status;

//       const matchesTableNumber = !filters.table_number || 
//         filters.table_number === '' || 
//         item.table_number.includes(filters.table_number);

//       const matchesCheckinDate = (!filters.checkinStartDate || item.check_in_date >= filters.checkinStartDate) &&
//         (!filters.checkinEndDate || item.check_in_date <= filters.checkinEndDate);
      
//       return matchesResort && matchesOutlet && matchesMealType && matchesMealPlan && matchesStatus && matchesTableNumber && matchesCheckinDate;
//     });
//   };

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
      // Simulate API delay
    //   await new Promise(resolve => setTimeout(resolve, 1000));
      
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
            <Calendar className="w-4 h-4" />
            Check-in Date Range
          </h3>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.checkinStartDate || ''}
              onChange={(e) => handleFilterChange('checkinStartDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.checkinEndDate || ''}
              onChange={(e) => handleFilterChange('checkinEndDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.checkoutEndDate || ''}
              onChange={(e) => handleFilterChange('checkoutEndDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Resorts</option>
              {filterOptions.resorts.map(resort => (
                <option key={resort.id} value={resort.id}>{resort.name}</option>
              ))}
            </select>
            <select
              value={filters.outlet_name || ''}
              onChange={(e) => handleFilterChange('outlet_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Meal Types</option>
              {filterOptions.mealTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <select
              value={filters.meal_plan || ''}
              onChange={(e) => handleFilterChange('meal_plan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Meal Plans</option>
              {filterOptions.mealPlans.map(plan => (
                <option key={plan} value={plan}>{plan.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
              ))}
            </select>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>{status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          {loading ? 'Loading...' : 'Preview Data'}
        </button>

        <button
          onClick={clearFilters}
          disabled={previewLoading||loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}


