import { roomNumbers } from "@/lib/data";
import React from "react";

const ButtonGrid = () => {
  const filteredRooms = roomNumbers.filter((room) =>
    room.toString().includes("")
  );
  return (
    <>
      {/* Room Number Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {filteredRooms.map((roomNumber) => (
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
