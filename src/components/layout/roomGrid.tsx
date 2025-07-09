"use client";

import React, { useState } from "react";
import SearchBar from "../ui/searchBar";
import ButtonGrid from "../ui/buttonGrid";
import Tabs from "./tabs";
import { roomNumbers, tabItems, rooms } from "@/lib/data";
import { Plus } from "lucide-react";
import { resorts } from "@/lib/data";
import { Resort } from "@/lib/types";

interface ResortNavigationProps {
  activeResort: string;
  onResortChange: (resort: string) => void;
}

// Simplified version of the Navigation component
const ResortNavigation = ({
  activeResort,
  onResortChange,
}: ResortNavigationProps) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow-md text-xs lg:text-base mb-6 transition-all duration-200">
      {resorts.map((resort) => (
        <button
          key={resort.name}
          onClick={() => onResortChange(resort.name)}
          className={`flex-1 py-1 font-medium rounded-md transition-colors cursor-pointer ${
            activeResort === resort.name
              ? "text-gray-900 bg-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span>
            {activeResort === resort.name} {resort.name}
          </span>
        </button>
      ))}
    </div>
  );
};

const getFilteredRooms = (
  tabName: string,
  searchTerm: string,
  activeResort: string
) => {
  let filteredRooms: number[] = [];

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
      filteredRooms = rooms[activeResort as keyof typeof rooms] || [];
  }

  // Filter by search term
  if (searchTerm.trim()) {
    return filteredRooms.filter((room) =>
      room.toString().startsWith(searchTerm.trim())
    );
  }
  return filteredRooms;
};

interface RoomGridProps {
  resorts: Resort[]; // name, totalRooms, booked, available
  addButton?: string;
  onClick?: () => void;
}

const RoomGrid = ({ resorts, addButton, onClick }: RoomGridProps) => {
  // Manage both resort and tab selection in this component
  const [activeResort, setActiveResort] = useState<string>(
    resorts[0].name || ""
  );
  const [activeTab, setActiveTab] = useState("All"); // Default to "all" tab
  const [searchTerm, setSearchTerm] = useState("");

  // Get the appropriate tab items based on active resort
  const currentTabItems = tabItems[activeResort as keyof typeof tabItems];

  // Pass activeResort to getFilteredRooms
  const filteredRooms = getFilteredRooms(activeTab, searchTerm, activeResort);

  // Handle resort change
  const handleResortChange = (resort: string) => {
    setActiveResort(resort as keyof typeof rooms);
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
  const resortDisplayName = activeResort;

  return (
    <>
      <div className="container my-2 lg:my-4">
        {/* Resort Navigation */}
        <ResortNavigation
          activeResort={activeResort}
          onResortChange={handleResortChange}
        />

        {/* Room Grid */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {resortDisplayName} Rooms
              </h2>
              <div className="flex items-center space-x-5">
                <SearchBar onSearch={handleSearch} />
                {addButton && (
                  <button
                    className="flex items-center p-1 lg:p-2 text-xs text-[var(--primary)] border-2 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
                    onClick={onClick}
                  >
                    <Plus className="w-3 h-3 lg:w-5 lg:h-5 mr-2" />
                    <span className="items-center">{addButton}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search results count */}
            {searchTerm && (
              <div className="mb-4 text-sm text-gray-600">
                Found {filteredRooms.length}{" "}
                {filteredRooms.length === 1 ? "room" : "rooms"} matching &quot;
                {searchTerm}&quot;
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
