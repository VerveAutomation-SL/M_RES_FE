"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface MealPlanDistributionProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
}

export default function MealPlanDistributionChart({
  data,
}: MealPlanDistributionProps) {
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        value: number;
        percentage: number;
        color: string;
      };
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{data.value}</span> guests (
            {data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-purple-600 rounded flex-shrink-0"></div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Meal Plan Distribution
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">
            Breakdown of guests by meal plan type
          </p>
        </div>
      </div>

      {/* Mobile: Smaller chart height */}
      <ResponsiveContainer width="100%" height={250} className="sm:hidden">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="rect" />
        </PieChart>
      </ResponsiveContainer>

      {/* Desktop: Full chart height */}
      <ResponsiveContainer
        width="100%"
        height={300}
        className="hidden sm:block"
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Statistics Summary */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div
              className="w-4 h-4 mx-auto mb-1 rounded"
              style={{ backgroundColor: item.color }}
            ></div>
            <p className="text-xs sm:text-sm font-medium text-gray-900">
              {item.name}
            </p>
            <p className="text-xs text-gray-600">{item.value} guests</p>
          </div>
        ))}
      </div>
    </div>
  );
}
