"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HourlyTrendsProps {
  data: Array<{
    time: string;
    checkIns: number;
  }>;
}

const HourlyTrendsChart = ({ data }: HourlyTrendsProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-blue-500 rounded"></div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Hourly Check-in Trends</h3>
          <p className="text-xs sm:text-sm text-gray-600">Peak dining hour analysis</p>
        </div>
      </div>
      
      {/* Mobile Chart */}
      <ResponsiveContainer width="100%" height={250} className="sm:hidden">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#666"
            fontSize={10}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#666"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="checkIns" 
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Desktop Chart */}
      <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="checkIns" 
            stroke="#8B5CF6"
            strokeWidth={3}
            fill="url(#colorGradient)"
            dot={false}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyTrendsChart;