"use client";
import { useState, useEffect } from "react";
import React from "react";
import CheckInForm from "../forms/checkInForm";
import { checkInApi } from "@/lib/api";

interface ButtonGridProps {
  rooms?: number[];
  mode ?: "check-in" | "view-details";
}

const ButtonGrid = ({ rooms, mode = "check-in" }: ButtonGridProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [checkedInRooms, setCheckedInRooms] = useState<number[]>([]);
  
  // Load checked-in rooms on component mount
  useEffect(() => {
    // Fetch checked-in rooms from API
    const fetchCheckedInRooms = async () => {
      try {
        const response = await checkInApi.getTodayCheckIns();
        if (response.data.success) {
          type CheckIn = { room_number: string };
          const roomNumbers = response.data.data.map((checkIn: CheckIn) => 
            parseInt(checkIn.room_number) );
          setCheckedInRooms(roomNumbers);
        }
      } catch (error) {
        console.error("Failed to fetch checked-in rooms:", error);
      }
    };
    
    fetchCheckedInRooms();
  }, []);

  const handleRoomClick = (roomNumber: number) => {
    setSelectedRoom(roomNumber.toString());
    setShowModal(true);
  };
  
  const handleCheckInSuccess = (roomNumber: string) => {
    // Add room to checked-in list
    setCheckedInRooms(prev => [...prev, parseInt(roomNumber)]);
  };

  return (
    <>
      {/* Room Number Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {rooms?.map((roomNumber) => {
          const isCheckedIn = checkedInRooms.includes(roomNumber);
          
          return (
            <button
              key={roomNumber}
              onClick={() => handleRoomClick(roomNumber)}
              className={`h-10 w-full ${
                isCheckedIn 
                  ? "bg-red-500 hover:bg-red-600 border-red-500" 
                  : "bg-green-500 hover:bg-green-600 border-green-500"
              } text-white text-sm font-medium cursor-pointer`}
            >
              {roomNumber}
            </button>
          );
        })}
      </div>
      {mode === "check-in" && showModal && (
        <CheckInForm 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          selectedRoom={selectedRoom}
          onCheckInSuccess={handleCheckInSuccess} 
        />
      )}
      
    </>
  );
};

export default ButtonGrid;
