"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';

interface MealDistributionProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

const MealDistributionChart = ({ data }: MealDistributionProps) => {
  const COLORS = {
    'Breakfast': '#8B5CF6',
    'Lunch': '#10B981', 
    'Dinner': '#F59E0B'
  };

  const renderCustomLabel = ({ name, percentage }: any) => {
    return `${name} ${percentage}%`;
  };

  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">Meal Distribution</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">Breakdown of meal served today</p>
        
        {/* Empty state */}
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">No Meal Data Available</p>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            There are no meal check-ins recorded for the selected time period.
          </p>
        </div>
      </div>
    );
  }

  // Check if all values are zero
  const hasData = data.some(item => item.value > 0);
  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">Meal Distribution</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">Breakdown of meal served today</p>
        
        {/* Zero data state */}
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">No Check-ins Today</p>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            All meal categories show 0 check-ins. Check-ins may start during meal periods.
          </p>
        </div>
        
        {/* Show zero values in legend */}
        <div className="flex justify-center gap-6 mt-6">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 opacity-50">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
              ></div>
              <span className="text-sm text-gray-400">
                {entry.name} 0%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-900">Meal Distribution</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">Breakdown of meal served today</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name as keyof typeof COLORS]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
            ></div>
            <span className="text-sm text-gray-600">
              {entry.name} {entry.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealDistributionChart;