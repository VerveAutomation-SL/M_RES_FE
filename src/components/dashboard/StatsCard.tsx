import React from "react";

interface StatsCardProps{
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode | string; // Allow string for emoji or icon
    bgColor: string;
    textColor: string;
}

export default function StatsCard({
    title,
    value,
    subtitle,
    icon,
    bgColor,
    textColor
}: StatsCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {/* <span className="text-lg">{icon}</span> */}
                        <h3 className="text-lg font-semibold text-black">{title}</h3>
                    </div>
                    <div className={`text-3xl font-bold ${textColor} mb-1`}>
                        {value}
                    </div>
                    <p className="text-md text-gray-500">{subtitle}</p>
                </div>
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                    <span className={`text-2xl `}>{icon}</span>
                </div>
            </div>
        </div>
    )
}