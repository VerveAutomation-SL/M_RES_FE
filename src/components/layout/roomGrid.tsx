"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "../ui/searchBar";
import ButtonGrid from "../ui/buttonGrid";
import { Plus } from "lucide-react";
import { resortApi } from "@/lib/api";
import { Resort } from "@/lib/types";
import RoomForm from "../forms/roomForm";

interface ResortNavigationProps {
  resorts: Resort[];
  activeResort: number;
  onResortChange: (resortId: number) => void;
}

const ResortNavigation = ({
  resorts,
  activeResort,
  onResortChange
}: ResortNavigationProps) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow-md text-xs lg:text-base mb-6 transition-all duration-200">
      {resorts.map((resort) => (
        <button
          key={resort.id}
          onClick={() => onResortChange(resort.id)}
          className={`flex-1 py-1 font-medium rounded-md transition-colors cursor-pointer mx-1 ${
            activeResort === resort.id
              ? "text-gray-900 bg-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span className="text-nowrap">{resort.name}</span>
        </button>
      ))}
    </div>
  );
};

interface RoomGridProps {
  addButton?: string;
  onClick?: () => void;
  mode?: "view-details" | "check-in";
}

const RoomGrid = ({ addButton, mode }: RoomGridProps) => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [activeResort, setActiveResort] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch resorts when component mounts
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        console.log("🏨 RoomGrid: Fetching resorts...");
        const response = await resortApi.getAllResorts();

        if (
          response &&
          response.success &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          // Sort resorts by ID to ensure consistent ordering
          const sortedResorts = response.data.sort((a, b) => a.id - b.id);
          setResorts(sortedResorts);
          setActiveResort(sortedResorts[0].id); // Set first resort as default
          console.log("✅ RoomGrid: Resorts sorted by ID, active resort:", sortedResorts[0].id);
        } else {
          console.warn("❌ RoomGrid: No resorts found");
          setResorts([]);
          setActiveResort(null);
        }
      } catch (error) {
        console.error("💥 RoomGrid: Failed to fetch resorts:", error);
        setResorts([]);
        setActiveResort(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, []); // Remove dependencies to prevent unnecessary re-fetching

  // Handle resort change
  const handleResortChange = (resortId: number) => {
    if (resortId === activeResort) return;

    console.log(
      `🔄 RoomGrid: Changing resort from ${activeResort} to ${resortId}`
    );
    setActiveResort(resortId);
    setSearchTerm(""); // Clear search when changing resorts
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddRoom = () => {
    setShowRoomModal(true);
  };

  // Update the room creation handler to force ButtonGrid refresh
  const handleRoomCreated = () => {
    console.log("🎉 Room created, refreshing grid...");
    setRefreshTrigger((prev) => prev + 1);
  };

  // Add effect to refetch resorts when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log("🔄 RoomGrid: Refreshing due to trigger change...");
      // The ButtonGrid will handle its own refresh via the key prop or internal logic
    }
  }, [refreshTrigger]);

  const handleRoomModalClose = () => {
    setShowRoomModal(false);
  };

  const currentResort = resorts.find((resort) => resort.id === activeResort);

  // Show loading state
  if (loading) {
    return (
      <div className="container my-2 lg:my-4">
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading rooms...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state when no resorts
  if (resorts.length === 0) {
    return (
      <div className="container my-2 lg:my-4">
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="text-center p-8">
              <p className="text-gray-600">
                No resorts available. Please add a resort first.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render ButtonGrid until we have a valid activeResort
  if (activeResort === null) {
    return (
      <div className="container my-2 lg:my-4">
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="text-center p-4">Initializing...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container my-2 lg:my-4">
        {/* Resort Navigation */}
        <ResortNavigation
          resorts={resorts}
          activeResort={activeResort}
          onResortChange={handleResortChange}
        />

        {/* Room Grid */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentResort?.name || "Resort"} Rooms
              </h2>
              <div className="flex items-center space-x-5">
                <SearchBar onSearch={handleSearch} />
                {addButton && (
                  <button
                    className="flex items-center p-1 lg:p-2 text-xs text-[var(--primary)] border-2 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
                    onClick={handleAddRoom}
                  >
                    <Plus className="w-3 h-3 lg:w-5 lg:h-5 mr-2" />
                    <span className="items-center">{addButton}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Room Grid */}
            <ButtonGrid
              resortId={activeResort}
              searchTerm={searchTerm}
              mode={mode}
              key={`${activeResort}-${refreshTrigger}`} // This ensures ButtonGrid refreshes
            />
          </div>
        </div>
      </div>

      {/* Room Form Modal */}
      {showRoomModal && (
        <RoomForm
          isOpen={showRoomModal}
          onClose={handleRoomModalClose}
          onSuccess={handleRoomCreated}
          selectedResort={currentResort?.name}
        />
      )}
    </>
  );
};

export default RoomGrid;
