"use client";
import { useState, useEffect } from "react";
import React from "react";
import CheckInForm from "../forms/checkInForm";
import { checkInApi, roomApi } from "@/lib/api";
import Tabs from "../layout/tabs";
import CheckInDetailsModal from "../forms/checkInDetails";
import { Restaurant, Room, RoomStatusApiResponse } from "@/lib/types";
import RoomDetails from "../layout/roomDetails";
import { getCurrentMealType, MEAL_TIMES, ROOM_SERIES } from "@/lib/data";
import { CheckInDetails } from "@/lib/types";
import TooltipWithAsyncContent from "./tooltipWithAsyncContent";
import toast from "react-hot-toast";

interface ButtonGridProps {
  mode?: "check-in" | "view-details";
  resortId: number;
  searchTerm?: string;
  outlets: Restaurant[];
  selectedOutlet?: Restaurant;
}

const isWithinMealPeriod = (mealType: string) => {
  const now = new Date();
  const currentTime = now.toTimeString().split(" ")[0];
  const mealPeriod = MEAL_TIMES[mealType as keyof typeof MEAL_TIMES];

  if (!mealPeriod) return false;

  return currentTime >= mealPeriod.start && currentTime <= mealPeriod.end;
};

interface RoomStatus {
  room_id: number;
  room_number: string;
  meal_type: string;
  resort_id: number;
  checked_in: boolean;
}

const ButtonGrid = ({
  mode = "check-in",
  resortId,
  searchTerm = "",
  selectedOutlet,
}: ButtonGridProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null); // Move this up
  const [roomStatusData, setRoomStatusData] = useState<RoomStatus[]>([]);
  const [mealType, setMealType] = useState<string>(getCurrentMealType());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [rooms, setRooms] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsRoomId, setDetailsRoomId] = useState<number>(0);
  const [roomsWithIds, setRoomsWithIds] = useState<Room[]>([]);
  const [checkInDetailsCache, setCheckInDetailsCache] = useState<
    Record<string, CheckInDetails>
  >({});
  const [loadingTooltip, setLoadingTooltip] = useState<string | null>(null);

  // group rooms by series
  const groupRoomsBySeries = (roomNumbers: number[]) => {
    const seriesConfig =
      ROOM_SERIES[resortId as keyof typeof ROOM_SERIES] || [];

    const grouped: { [key: string]: number[] } = {
      All: roomNumbers,
    };

    // Intializing empty arrays for each series
    seriesConfig.forEach((series) => {
      grouped[series.name] = [];
    });

    // Grouping rooms into series
    roomNumbers.forEach((roomNum) => {
      seriesConfig.forEach((series) => {
        if (roomNum >= series.start && roomNum <= series.end) {
          grouped[series.name].push(roomNum);
        }
      });
    });

    // Remove empty series
    Object.keys(grouped).forEach((key) => {
      if (key !== "All" && grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  };

  // Generate tab items based on grouped rooms
  const generateTabItems = (groupedRooms: { [key: string]: number[] }) => {
    return Object.keys(groupedRooms).map((seriesName) => ({
      name: seriesName,
      href: `#${seriesName.toLowerCase()}`,
      count: groupedRooms[seriesName].length,
    }));
  };

  // Fetch rooms for the current resort
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        console.log(`Fetching rooms for resort ${resortId}`);
        const response = await roomApi.getRoomsByResort(resortId);

        console.log("Full API Response:", response);
        console.log("Response.data:", response.data);

        if (response.success && response.data) {
          setRoomsWithIds(response.data);

          // Try multiple possible field names
          const roomNumbers = response.data
            .map((room: Room) => {
              // Check all possible field names
              const possibleRoomNumber = room.room_number;
              console.log(
                `Processing room:`,
                room,
                `Room number field:`,
                possibleRoomNumber
              );

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

          console.log(
            `Successfully parsed ${roomNumbers.length} room numbers:`,
            roomNumbers
          );
          setRooms(roomNumbers);
          setActiveTab("All");
        } else {
          console.log(`No rooms found for resort ${resortId}`, response);
          setRooms([]);
          setRoomsWithIds([]);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setRooms([]);
        setRoomsWithIds([]);
      } finally {
        setLoading(false);
      }
    };

    if (resortId) {
      fetchRooms();
    }
  }, [resortId]);

  // Group rooms by series
  const groupedRooms = groupRoomsBySeries(rooms);
  const tabItems = generateTabItems(groupedRooms);

  // Get rooms for the active tab
  const getDisplayRooms = () => {
    const seriesRooms = groupedRooms[activeTab] || [];
    return seriesRooms.filter((room) =>
      room.toString().includes(searchTerm.toLowerCase())
    );
  };

  const displayRooms = getDisplayRooms();

  const getRoomIdByNumber = (roomNumber: string): number | null => {
    const room = roomsWithIds.find((room) => room.room_number === roomNumber);
    return room ? room.id : null;
  };

  // Load room status
  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        console.log(
          `Fetching room status for resort ${resortId}, meal: ${mealType}`
        );
        const response = await checkInApi.getCheckInStatus(resortId, mealType);

        console.log("Room status response:", response);

        if (response && response.success && response.data) {
          // Map response.data to RoomStatus type
          const mappedRoomStatus = response.data.map((item: RoomStatusApiResponse) => ({
            room_id: item.room_id ?? item.id ?? 0,
            room_number:
              item.room_number?.toString() ?? item.roomNumber?.toString() ?? "",
            meal_type: item.meal_type ?? mealType,
            resort_id: item.resort_id ?? resortId,
            checked_in: item.checked_in ?? false,
          }));
          setRoomStatusData(mappedRoomStatus);
          console.log("Room status data set:", mappedRoomStatus);
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

    // Time interval to update meal type and refresh data
    const interval = setInterval(() => {
      const newMealType = getCurrentMealType();
      if (newMealType !== mealType) {
        setMealType(newMealType);
        // Clear cache when meal type changes
        setCheckInDetailsCache({});
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [resortId, mealType, refreshTrigger]);

  const fetchCheckInDetailsForTooltip = async (roomNumber: string) => {
    const cacheKey = `${resortId}-${roomNumber}-${mealType}`;

    // Return cached data if available
    if (checkInDetailsCache[cacheKey]) {
      return checkInDetailsCache[cacheKey];
    }

    try {
      setLoadingTooltip(roomNumber);
      const roomId = getRoomIdByNumber(roomNumber);

      if (!roomId) {
        console.warn(`Room ID not found for room ${roomNumber}`);
        return null;
      }

      const response = await checkInApi.getCheckInDetails(
        resortId,
        roomId,
        mealType
      );

      if (response?.success && response.data) {
        // Cache the result
        setCheckInDetailsCache((prev) => ({
          ...prev,
          [cacheKey]: response.data,
        }));

        return response.data;
      }
    } catch (error) {
      console.error(
        `Failed to fetch check-in details for room ${roomNumber}:`,
        error
      );
    } finally {
      setLoadingTooltip(null);
    }

    return null;
  };

  // this effect to re-fetch rooms when refreshTrigger changes
  useEffect(() => {
    const refetchRooms = async () => {
      if (refreshTrigger > 0) {
        // Only refetch if trigger was actually incremented
        console.log("🔄 Refreshing rooms due to trigger change...");

        try {
          const response = await roomApi.getRoomsByResort(resortId);

          if (response.success && response.data) {
            const roomsWithIds = response.data.map((room: Room) => ({
              ...room,
              resortId: resortId,
            }));

            setRoomsWithIds(roomsWithIds);

            const roomNumbers = response.data
              .map((room: Room) => {
                const parsed = parseInt(room.room_number.toString());
                return parsed;
              })
              .filter((num: number) => !isNaN(num))
              .sort((a: number, b: number) => a - b);

            setRooms(roomNumbers);
            console.log("✅ Rooms refreshed successfully");
          }
        } catch (error) {
          console.error("❌ Failed to refresh rooms:", error);
        }
      }
    };

    refetchRooms();
  }, [refreshTrigger, resortId]); // Add refreshTrigger as dependency

  const handleRoomClick = (roomNumber: number) => {
    const roomStatus = roomStatusData.find(
      (room) => room.room_number === roomNumber.toString()
    );

    const isCheckedIn = roomStatus ? roomStatus.checked_in : false;

    const roomId = getRoomIdByNumber(roomNumber.toString());

    // If room is checked in, show details modal
    if (isCheckedIn) {
      setDetailsRoomId(roomId ?? 0);
      setShowDetailsModal(true);
      return;
    }

    if (mode === "check-in") {
      const withinPeriod = isWithinMealPeriod(mealType);

      if (!withinPeriod) {
        toast.error(
          `Check-in is only available during ${mealType} time period.`
        );
        return;
      }

      if (!roomId) {
        toast.error(`Room ${roomNumber} not found.`);
        return;
      }
      setSelectedRoom(roomNumber.toString());
      setSelectedRoomId(roomId);
      setShowModal(true);
    } else if (mode === "view-details") {
      setSelectedRoom(roomNumber.toString());
      setSelectedRoomId(roomId);
      setShowModal(true);
    }
  };

  const handleCheckInSuccess = (roomNumber: string) => {
    console.log(`✅ Check-in success for room ${roomNumber}`);

    // Check if room already exists in status data
    const existingRoomIndex = roomStatusData.findIndex(
      (room) => room.room_number === roomNumber
    );

    if (existingRoomIndex >= 0) {
      // Update existing room status
      setRoomStatusData((prev) =>
        prev.map((room) =>
          room.room_number === roomNumber ? { ...room, checked_in: true } : room
        )
      );
    } else {
      // Add new room status entry
      const roomId = getRoomIdByNumber(roomNumber);
      if (roomId) {
        const newRoomStatus: RoomStatus = {
          room_id: roomId,
          room_number: roomNumber,
          meal_type: mealType,
          resort_id: resortId,
          checked_in: true,
        };

        setRoomStatusData((prev) => [...prev, newRoomStatus]);
      }
    }

    // Force refresh of room status data
    setRefreshTrigger((prev) => prev + 1);

    console.log("Updated room status data");
  };

  // checkout success handler
  const handleCheckoutSuccess = (roomNumber: string) => {
    console.log(`✅ Checkout success for room ${roomNumber}`);

    // Remove from room status data (change red to green)
    setRoomStatusData((prev) =>
      prev.filter((room) => room.room_number !== roomNumber)
    );

    // Force refresh of room status data
    setRefreshTrigger((prev) => prev + 1);

    console.log(`🔄 Room ${roomNumber} should now be green`);
  };

  const getRoomButtonColor = (roomNumber: number) => {
    const roomStatus = roomStatusData.find(
      (room) => room.room_number === roomNumber.toString()
    );

    const isCheckedIn = roomStatus ? roomStatus.checked_in : false;
    const withinMealPeriod = isWithinMealPeriod(mealType);

    if (mode === "view-details") {
      return "bg-green-500 hover:bg-green-600 border-green-500";
    }

    if (isCheckedIn) {
      return "bg-red-500 hover:bg-red-600 border-red-500";
    }

    if (mode === "check-in") {
      if (withinMealPeriod) {
        return "bg-green-500 hover:bg-green-600 border-green-500";
      }
      return "bg-gray-300 hover:bg-gray-500 border-gray-400";
    }

    return "bg-green-500 hover:bg-green-600 border-green-500";
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Extract fetchRoomStatus to be reusable

  // Update the existing room status useEffect to use the extracted function
  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        console.log(
          `Fetching room status for resort ${resortId}, meal: ${mealType}`
        );
        const response = await checkInApi.getCheckInStatus(resortId, mealType);

        if (response && response.success && response.data) {
          const mappedRoomStatus = response.data.map((item: RoomStatusApiResponse) => ({
            room_id: item.room_id ?? item.id ?? 0,
            room_number:
              item.room_number?.toString() ?? item.roomNumber?.toString() ?? "",
            meal_type: item.meal_type ?? mealType,
            resort_id: item.resort_id ?? resortId,
            checked_in: item.checked_in ?? false,
          }));
          setRoomStatusData(mappedRoomStatus);
        } else {
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

    const interval = setInterval(() => {
      const newMealType = getCurrentMealType();
      if (newMealType !== mealType) {
        setMealType(newMealType);
        // Clear cache when meal type changes
        setCheckInDetailsCache({});
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [resortId, mealType, refreshTrigger]);

  // Handle room update with immediate refresh
  const handleRoomUpdate = () => {
    console.log("🔄 Room updated, refreshing data...");
    setRefreshTrigger((prev) => prev + 1);

    // Also refresh room status to ensure colors are correct
    // fetchRoomStatus();
  };

  // Handle room deletion with immediate refresh
  const handleRoomDelete = () => {
    console.log("🗑️ Room deleted, refreshing data...");
    setRefreshTrigger((prev) => prev + 1);

    // Close the details modal since room is deleted
    setShowDetailsModal(false);
    setDetailsRoomId(0);
  };

  if (loading) {
    return <div className="text-center p-4">Loading rooms...</div>;
  }

  return (
    <>
      {/* Room Series Tabs */}
      {tabItems.length > 1 && (
        <div className="mb-4 overflow-x-auto">
          <div className="flex flex-nowrap gap-2 sm:gap-4">
            <Tabs
              items={tabItems}
              activeItem={activeTab}
              onTabClick={handleTabClick}
            />
          </div>
        </div>
      )}

      {/* Current meal type indicator */}
      {mode === "check-in" && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Current Meal:{" "}
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                isWithinMealPeriod(mealType)
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {isWithinMealPeriod(mealType) ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      )}

      {/* Room Number Grid */}
      {displayRooms.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {displayRooms.map((roomNumber) => {
            const buttonColor = getRoomButtonColor(roomNumber);
            const roomStatus = roomStatusData.find(
              (room) => room.room_number === roomNumber.toString()
            );
            const isCheckedIn = roomStatus ? roomStatus.checked_in : false;
            const cacheKey = `${resortId}-${roomNumber}-${mealType}`;
            const cachedDetails = checkInDetailsCache[cacheKey];

            // Create the room button
            const roomButton = (
              <button
                key={roomNumber}
                onClick={() => handleRoomClick(roomNumber)}
                className={`h-10 w-full ${buttonColor} text-white text-sm font-medium cursor-pointer transition-colors duration-200 relative`}
                title={!isCheckedIn ? `Room ${roomNumber}` : undefined}
              >
                {roomNumber}
                {loadingTooltip === roomNumber.toString() && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            );

            // If room is checked in, wrap with tooltip
            if (isCheckedIn && mode === "check-in") {
              return (
                <TooltipWithAsyncContent
                  key={roomNumber}
                  roomNumber={roomNumber.toString()}
                  fetchDetails={fetchCheckInDetailsForTooltip}
                  cachedDetails={cachedDetails}
                >
                  {roomButton}
                </TooltipWithAsyncContent>
              );
            }

            return roomButton;
          })}
        </div>
      ) : (
        <div className="text-center p-4">
          No rooms available for this series.
        </div>
      )}

      {/* Check-in Form Modal */}
      {mode === "check-in" && showModal && (
        <CheckInForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          selectedRoom={selectedRoom}
          mealType={mealType}
          resortId={resortId}
          roomId={selectedRoomId ?? undefined}
          defaultOutlet={selectedOutlet}
          onCheckInSuccess={handleCheckInSuccess}
        />
      )}

      {/* Check-in Details Modal - Add onCheckoutSuccess prop */}
      {showDetailsModal && (
        <CheckInDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          roomId={detailsRoomId}
          resortId={resortId}
          mealType={mealType}
          onCheckoutSuccess={handleCheckoutSuccess} // Add this line
        />
      )}

      {mode === "view-details" && (
        <RoomDetails
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          room={roomsWithIds.find((room) => room.id === selectedRoomId)}
          onUpdate={handleRoomUpdate}
          onDelete={handleRoomDelete}
        />
      )}
    </>
  );
};

export default ButtonGrid;
