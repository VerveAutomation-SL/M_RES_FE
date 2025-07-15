import React, { useState } from "react";
import RoomDetails from "../layout/roomDetails";

interface ButtonGridProps {
  rooms?: number[];
  mode: string;
}

const ButtonGrid = ({ rooms, mode }: ButtonGridProps) => {
  const [showRoomModal, setShowRoomModal] = useState(false);
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

      {mode === "roomDetails" && (
        <RoomDetails
          isOpen={showRoomModal}
          onClose={() => {
            setShowRoomModal(false);
          }}
        />
      )}
    </>
  );
};

export default ButtonGrid;
