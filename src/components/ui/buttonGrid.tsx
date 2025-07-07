import React from "react";

interface ButtonGridProps {
  rooms?: number[];
}

const ButtonGrid = ({ rooms }: ButtonGridProps) => {
  return (
    <>
      {/* Room Number Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {rooms?.map((roomNumber) => (
          <button
            key={roomNumber}
            className="h-10 w-full bg-green-500 hover:bg-green-600 text-white border-green-500 text-sm font-medium"
          >
            {roomNumber}
          </button>
        ))}
      </div>
    </>
  );
};

export default ButtonGrid;
