"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface WeeklyPerformanceProps {
  data: Array<{
    week: string;
    checkIns: number;
    checkOuts: number;
    revenue?: number;
  }>;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export default function WeeklyPerformanceChart({
  data,
}: WeeklyPerformanceProps) {
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-green-600 rounded flex-shrink-0"></div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Weekly Performance
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">
            Check-ins and check-outs over the last 4 weeks
          </p>
        </div>
      </div>

      {/* Mobile: Smaller chart height */}
      <ResponsiveContainer width="100%" height={250} className="sm:hidden">
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="week"
            stroke="#666"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="checkIns"
            stroke="#10B981"
            strokeWidth={2}
            name="Check-ins"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="checkOuts"
            stroke="#EF4444"
            strokeWidth={2}
            name="Check-outs"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Desktop: Full chart height */}
      <ResponsiveContainer
        width="100%"
        height={300}
        className="hidden sm:block"
      >
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="week"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="checkIns"
            stroke="#10B981"
            strokeWidth={3}
            name="Check-ins"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="checkOuts"
            stroke="#EF4444"
            strokeWidth={3}
            name="Check-outs"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
