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