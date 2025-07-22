"use client";


import { Bar, BarChart,CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { ResponsiveContainer } from "recharts";

interface DailyCheckInsProps{
    data : Array<{
        date: string;
        dhigurah: number;
        falhumaafushi: number;
    }>;
}

export default function DailyCheckInsChart({data}: DailyCheckInsProps){
    return(
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-gray-700 rounded"></div>
                <h3 className="text-lg font-semibold text-gray-900">Daily Check-ins by Resort</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Check-ins comparison over the last 7 days</p>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data= {data} barCategoryGap="20%">
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
                            borderRadius: "8px", padding: "12px", 
                            backgroundColor: "#fff", 
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" 
                        }}
                    />
                    <Legend/>
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