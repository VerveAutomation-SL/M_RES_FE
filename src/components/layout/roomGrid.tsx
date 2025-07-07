"use client";

import React, { useState } from "react";
import SearchBar from "../ui/searchBar";
import ButtonGrid from "../ui/buttonGrid";
import Tabs from "./tabs";
import { roomNumbers, tabItems, rooms } from "@/lib/data";


type ResortName = "dhigurah" | "falhumaafushi";

interface ResortNavigationProps {
  activeResort: ResortName;
  onResortChange: (resort: ResortName) => void;
}

// Simplified version of the Navigation component
const ResortNavigation = ({ activeResort, onResortChange }: ResortNavigationProps) => {
  return (

    <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow-md text-xs lg:text-base mb-6 transition-all duration-200">
      <button
        onClick={() => onResortChange("dhigurah")}
        className={`flex-1 py-1 font-medium rounded-md transition-colors cursor-pointer ${
          activeResort === "dhigurah"
            ? "text-gray-900 bg-gray-200"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <span className=""> Dhigurah Island</span>
      </button>

      <button
        onClick={() => onResortChange("falhumaafushi")}
        className={`flex-1 py-1 font-medium rounded-md transition-colors cursor-pointer ${
          activeResort === "falhumaafushi"
            ? "text-gray-900 bg-gray-200"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <span className="text-nowrap"> Falhumaafushi Island</span>
      </button>
    </div>
  );
};

const getFilteredRooms = (tabName: string, searchTerm: string, activeResort: ResortName) => {
  let filteredRooms : number[] = [];

  // Special handling for "All" tab
  if (tabName === "All") {
    filteredRooms = rooms[activeResort];
  } else {
    // Existing tab filtering logic
    switch (tabName) {
      case "100-130":
        filteredRooms = roomNumbers.filter((room) => room >= 100 && room <= 130);
        break;
      case "200-218":
        filteredRooms = roomNumbers.filter((room) => room >= 200 && room <= 218);
        break;
      case "300-343":
        filteredRooms = roomNumbers.filter((room) => room >= 300 && room <= 343);
        break;
      case "600-693":
        filteredRooms = roomNumbers.filter((room) => room >= 600 && room <= 693);
        break;
      case "800-820":
        filteredRooms = roomNumbers.filter((room) => room >= 800 && room <= 820);
        break;
      case "840-897":
        filteredRooms = roomNumbers.filter((room) => room >= 840 && room <= 897);
        break;
      default:
        filteredRooms = rooms[activeResort] || []; // Fallback to resort rooms if tab not recognized
    }
  }

  // Filter by search term
  if (searchTerm.trim()) {
    return filteredRooms.filter((room) =>
      room.toString().startsWith(searchTerm.trim())
    );
  }
  return filteredRooms;
};

const RoomGrid = () => {
  // Manage both resort and tab selection in this component
  const [activeResort, setActiveResort] = useState<ResortName>("dhigurah");
  const [activeTab, setActiveTab] = useState("All"); // Default to "all" tab
  const [searchTerm, setSearchTerm] = useState("");

  // Get the appropriate tab items based on active resort
  const currentTabItems = tabItems[activeResort as keyof typeof tabItems];

  // Pass activeResort to getFilteredRooms
  const filteredRooms = getFilteredRooms(activeTab, searchTerm, activeResort);

  // Handle resort change
  const handleResortChange = (resort: ResortName) => {
    setActiveResort(resort);
    // Reset tab to "all" when changing resorts
    setActiveTab("All");
  };

  // Handle tab click
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Get resort display name
  const resortDisplayName =
    activeResort === "dhigurah"
      ? "Dhigurah Island"
      : "Falhumaafushi Island";

  return (
    <>
      <div className="space-y-6">
        {/* Resort Navigation */}
        <ResortNavigation
          activeResort={activeResort}
          onResortChange={handleResortChange}
        />

        {/* Room Grid */}
        <div className="bg-white shadow-sm">
          <div className="p-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {resortDisplayName} Rooms
              </h2>
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Search results count */}
            {searchTerm && (
              <div className="mb-4 text-sm text-gray-600">
                Found {filteredRooms.length}{" "}
                {filteredRooms.length === 1 ? "room" : "rooms"} matching &quot;{searchTerm}&quot;
              </div>
            )}

            {/* Room Tabs */}
            <Tabs
              items={currentTabItems}
              activeItem={activeTab}
              className="mb-4"
              onTabClick={handleTabClick}
            />

            {/* Room Buttons */}
            {filteredRooms.length > 0 ? (
              <ButtonGrid rooms={filteredRooms} />
            ) : (
              <div className="text-center p-8 text-gray-500">
                No rooms found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomGrid;
