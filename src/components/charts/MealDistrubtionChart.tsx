"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  // Mobile custom label (shorter)
  const renderMobileLabel = ({ percentage }: any) => {
    return `${percentage}%`;
  };

  if (!data || data.length === 0 || !data.some(item => item.value > 0)) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Meal Distribution</h3>
            <p className="text-xs sm:text-sm text-gray-600">Breakdown of meal served today</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm sm:text-lg font-medium text-gray-900 mb-2">No Meal Data Available</p>
          <p className="text-xs sm:text-sm text-gray-500 text-center max-w-xs px-4">
            There are no meal check-ins recorded for the selected time period.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Meal Distribution</h3>
          <p className="text-xs sm:text-sm text-gray-600">Breakdown of meal served today</p>
        </div>
      </div>
      
      {/* Mobile Chart */}
      <ResponsiveContainer width="100%" height={200} className="sm:hidden">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
            label={renderMobileLabel}
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
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Desktop Chart */}
      <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
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
      
      {/* Mobile Legend */}
      <div className="flex flex-col gap-2 mt-4 sm:hidden">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{entry.name}</span>
            </div>
            <span className="text-sm text-gray-600">{entry.percentage}%</span>
          </div>
        ))}
      </div>

      {/* Desktop Legend */}
      <div className="hidden sm:flex justify-center gap-6 mt-4">
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