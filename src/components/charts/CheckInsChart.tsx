"use client";


import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { ResponsiveContainer } from "recharts";

interface DailyCheckInsProps {
    data: Array<{
        date: string;
        dhigurah: number;
        falhumaafushi: number;
    }>;
}

export default function DailyCheckInsChart({ data }: DailyCheckInsProps) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-gray-700 rounded flex-shrink-0"></div>
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Daily Check-ins by Resort</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">Check-ins comparison over the last 7 days</p>
                </div>
            </div>

            {/* Mobile: Smaller chart height */}
            <ResponsiveContainer width="100%" height={250} className="sm:hidden">
                <BarChart data={data} barCategoryGap="15%" margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#666"
                        fontSize={10}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
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
                            border: "1px solid #e5e7eb", 
                            borderRadius: "8px", 
                            padding: "8px", 
                            backgroundColor: "#fff", 
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            fontSize: "12px"
                        }}
                    />
                    <Legend 
                        wrapperStyle={{ fontSize: "12px" }}
                        iconType="rect"
                    />
                    <Bar 
                        dataKey="dhigurah" 
                        fill="#8B5CF6"
                        name="Dhigurah" 
                        radius={[2, 2, 0, 0]} 
                    />
                    <Bar 
                        dataKey="falhumaafushi" 
                        fill="#10B981"
                        name="Falhumaafushi"
                        radius={[2, 2, 0, 0]} 
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* Desktop: Full chart height */}
            <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                <BarChart data={data} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
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
                            border: "1px solid #e5e7eb", 
                            borderRadius: "8px", 
                            padding: "12px", 
                            backgroundColor: "#fff", 
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" 
                        }}
                    />
                    <Legend />
                    <Bar 
                        dataKey="dhigurah" 
                        fill="#8B5CF6"
                        name="Dhigurah" 
                        radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                        dataKey="falhumaafushi" 
                        fill="#10B981"
                        name="Falhumaafushi"
                        radius={[4, 4, 0, 0]} 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}