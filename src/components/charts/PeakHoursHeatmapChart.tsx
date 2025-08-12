"use client";

interface PeakHoursHeatmapProps {
  data: Array<{
    day: string;
    hour: number;
    value: number;
    color: string;
  }>;
}

export default function PeakHoursHeatmapChart({ data }: PeakHoursHeatmapProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Create a matrix for the heatmap
  const heatmapData = days
    .map((day) =>
      hours.map((hour) => {
        const dataPoint = data.find((d) => d.day === day && d.hour === hour);
        return {
          day,
          hour,
          value: dataPoint?.value || 0,
          color: dataPoint?.color || "#f3f4f6",
        };
      })
    )
    .flat();

  const getIntensityColor = (value: number) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const intensity = value / maxValue;

    if (intensity === 0) return "#f3f4f6";
    if (intensity <= 0.2) return "#dbeafe";
    if (intensity <= 0.4) return "#93c5fd";
    if (intensity <= 0.6) return "#60a5fa";
    if (intensity <= 0.8) return "#3b82f6";
    return "#1d4ed8";
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return "12AM";
    if (hour < 12) return `${hour}AM`;
    if (hour === 12) return "12PM";
    return `${hour - 12}PM`;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-indigo-600 rounded flex-shrink-0"></div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Peak Hours Heatmap
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">
            Check-in activity by day and hour
          </p>
        </div>
      </div>

      {/* Mobile: Simplified view */}
      <div className="sm:hidden">
        <div className="grid grid-cols-4 gap-1 mb-4">
          {heatmapData
            .filter((_, index) => index % 6 === 0)
            .map((cell, index) => (
              <div
                key={index}
                className="aspect-square rounded text-xs flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: getIntensityColor(cell.value) }}
              >
                {cell.value}
              </div>
            ))}
        </div>
        <p className="text-xs text-gray-500 text-center">
          Showing every 6th hour. View on desktop for full heatmap.
        </p>
      </div>

      {/* Desktop: Full heatmap */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hour labels */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              {hours
                .filter((h) => h % 2 === 0)
                .map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 text-xs text-center text-gray-500"
                  >
                    {formatHour(hour)}
                  </div>
                ))}
            </div>

            {/* Heatmap grid */}
            {days.map((day) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-12 text-xs text-gray-600 font-medium">
                  {day}
                </div>
                {hours.map((hour) => {
                  const cell = heatmapData.find(
                    (d) => d.day === day && d.hour === hour
                  );
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="flex-1 aspect-square mx-0.5 rounded text-xs flex items-center justify-center text-white font-medium cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: getIntensityColor(cell?.value || 0),
                      }}
                      title={`${day} ${formatHour(hour)}: ${
                        cell?.value || 0
                      } check-ins`}
                    >
                      {(cell?.value || 0) > 0 ? cell?.value : ""}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-center mt-4 gap-2">
              <span className="text-xs text-gray-500">Less</span>
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: getIntensityColor(
                      intensity * Math.max(...data.map((d) => d.value))
                    ),
                  }}
                ></div>
              ))}
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
