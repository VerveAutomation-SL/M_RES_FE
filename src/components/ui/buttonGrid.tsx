"use client";
import { useState, useEffect } from "react";
import React from "react";
import CheckInForm from "../forms/checkInForm";
import { checkInApi, roomApi } from "@/lib/api";

interface ButtonGridProps {
  mode?: "check-in" | "view-details";
  resortId: number;
  searchTerm?: string;
}

// Keep meal times configurable
const MEAL_TIMES = {
  breakfast: { start: "06:00:00", end: "09:30:00" },
  lunch: { start: "09:40:00", end: "15:00:00" },
  dinner: { start: "18:00:00", end: "23:30:00" },
};

const getCurrentMealType = () => {
  const now = new Date();
  const currentTime = now.toTimeString().split(' ')[0];
  
  if (currentTime >= MEAL_TIMES.breakfast.start && currentTime <= MEAL_TIMES.breakfast.end) {
    return "breakfast";
  } else if (currentTime >= MEAL_TIMES.lunch.start && currentTime <= MEAL_TIMES.lunch.end) {
    return "lunch";
  } else if (currentTime >= MEAL_TIMES.dinner.start && currentTime <= MEAL_TIMES.dinner.end) {
    return "dinner";
  }
  
  // Return next meal if outside periods
  if (currentTime < MEAL_TIMES.breakfast.start) {
    return "breakfast";
  } else if (currentTime < MEAL_TIMES.lunch.start) {
    return "lunch";
  } else if (currentTime < MEAL_TIMES.dinner.start) {
    return "dinner";
  } else {
    return "breakfast";
  }
};

const isWithinMealPeriod = (mealType: string) => {
  const now = new Date();
  const currentTime = now.toTimeString().split(' ')[0];
  const mealPeriod = MEAL_TIMES[mealType as keyof typeof MEAL_TIMES];
  
  if (!mealPeriod) return false;
  
  return currentTime >= mealPeriod.start && currentTime <= mealPeriod.end;
};

interface RoomStatus {
  room_number: string;
  meal_type: string;
  resort_id: number;
}

const ButtonGrid = ({ mode = "check-in", resortId, searchTerm = "" }: ButtonGridProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [roomStatusData, setRoomStatusData] = useState<RoomStatus[]>([]);
  const [mealType, setMealType] = useState<string>(getCurrentMealType());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [rooms, setRooms] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch rooms for the current resort
  useEffect(() => {
    const fetchRooms = async () => {
        setLoading(true);
        try {
            console.log(`Fetching rooms for resort ${resortId}`);
            const response = await roomApi.getRoomsByResort(resortId);
            
            console.log('Full API Response:', response);
            console.log('Response.data:', response.data);
            
            if (response.success && response.data) {
                // Log each room to see the structure
                response.data.forEach((room: any, index: number) => {
                    console.log(`Room ${index}:`, room);
                    console.log(`Available fields:`, Object.keys(room));
                });
                
                // Try multiple possible field names
                const roomNumbers = response.data
                    .map((room: any) => {
                        // Check all possible field names
                        const possibleRoomNumber = room.room_number || room.number || room.roomNumber || room.name;
                        console.log(`Processing room:`, room, `Room number field:`, possibleRoomNumber);
                        
                        if (possibleRoomNumber) {
                            // Handle both string and number types
                            const parsed = parseInt(possibleRoomNumber.toString());
                            console.log(`Parsed: ${possibleRoomNumber} -> ${parsed}`);
                            return parsed;
                        }
                        return NaN;
                    })
                    .filter((num: number) => !isNaN(num))
                    .sort((a: number, b: number) => a - b);
                    
                console.log(`Successfully parsed ${roomNumbers.length} room numbers:`, roomNumbers);
                setRooms(roomNumbers);
            } else {
                console.log(`No rooms found for resort ${resortId}`, response);
                setRooms([]);
            }
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    if (resortId) {
        fetchRooms();
    }
  }, [resortId]);

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => 
    room.toString().includes(searchTerm.toLowerCase())
  );

  // Load room status
  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        console.log(`Fetching room status for resort ${resortId}, meal: ${mealType}`);
        const response = await checkInApi.getCheckInStatus(resortId, mealType);
        
        console.log("Room status response:", response);
        
        if (response && response.success && response.data) {
          setRoomStatusData(response.data);
          console.log("Room status data set:", response.data);
        } else {
          console.log("No room status data or unsuccessful response");
          setRoomStatusData([]);
        }
      } catch (error) {
        console.error("Failed to fetch room status:", error);
        setRoomStatusData([]);
      }
    };
    
    if (resortId) {
      fetchRoomStatus();
    }

    // Set up interval to update meal type and refresh data
    const interval = setInterval(() => {
      const newMealType = getCurrentMealType();
      if (newMealType !== mealType) {
        setMealType(newMealType);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [resortId, mealType, refreshTrigger]);

  const handleRoomClick = (roomNumber: number) => {
    const roomStatus = roomStatusData.find(
      room => room.room_number === roomNumber.toString()                            
    );
    
    const isCheckedIn = roomStatus ? roomStatus.checked_in : false;
    const withinPeriod = isWithinMealPeriod(mealType);

    if (isCheckedIn) {
      alert(`Room ${roomNumber} is already checked in for ${mealType}.`);
      return;
    }

    if (!withinPeriod) {
      alert(`Check-in is only available during ${mealType} time period.`);
      return;
    }

    setSelectedRoom(roomNumber.toString());
    setShowModal(true);
  };

  const handleCheckInSuccess = (roomNumber: string) => {
    setRoomStatusData(prev => 
      prev.map(room => 
        room.room_number === roomNumber 
          ? { ...room, checked_in: true }
          : room
      )
    );
    setRefreshTrigger(prev => prev + 1);
  };

  const getRoomButtonColor = (roomNumber: number) => {
    const roomStatus = roomStatusData.find(
      room => room.room_number === roomNumber.toString()
    );
    
    const isCheckedIn = roomStatus ? roomStatus.checked_in : false;
    const withinMealPeriod = isWithinMealPeriod(mealType);
    
    if (isCheckedIn) {
      return "bg-red-500 hover:bg-red-600 border-red-500";
    }
    
    if (withinMealPeriod) {
      return "bg-green-500 hover:bg-green-600 border-green-500";
    }
    
    return "bg-gray-200 hover:bg-gray-500 border-gray-400";
  };

  if (loading) {
    return <div className="text-center p-4">Loading rooms...</div>;
  }

  return (
    <>
      {/* Current meal type indicator */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">
            Current Meal: {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            isWithinMealPeriod(mealType) 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isWithinMealPeriod(mealType) ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Room Number Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {filteredRooms.map((roomNumber) => {
          const buttonColor = getRoomButtonColor(roomNumber);
          
          return (
            <button
              key={roomNumber}
              onClick={() => handleRoomClick(roomNumber)}
              className={`h-10 w-full ${buttonColor} text-white text-sm font-medium cursor-pointer transition-colors duration-200`}
              title={`Room ${roomNumber}`}
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
          mealType={mealType}
          resortId={resortId}
          onCheckInSuccess={handleCheckInSuccess} 
        />
      )}
    </>
  );
};

export default ButtonGrid;