"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "../ui/searchBar";
import ButtonGrid from "../ui/buttonGrid";
import Tabs from "./tabs";
import { roomNumbers, tabItems } from "@/lib/data";

interface RoomGridProps {
  activeNav: string;
}

const getFilteredRooms = (tabName: string, searchTerm: string) => {
  let rooms = [];
  switch (tabName) {
    case "100-130":
      rooms = roomNumbers.filter((room) => room >= 100 && room <= 130);
      break;
    case "200-218":
      rooms = roomNumbers.filter((room) => room >= 200 && room <= 218);
      break;
    case "300-343":
      rooms = roomNumbers.filter((room) => room >= 300 && room <= 343);
      break;
    case "600-693":
      rooms = roomNumbers.filter((room) => room >= 600 && room <= 693);
      break;
    case "800-820":
      rooms = roomNumbers.filter((room) => room >= 800 && room <= 820);
      break;
    case "840-897":
      rooms = roomNumbers.filter((room) => room >= 840 && room <= 897);
      break;
    default:
      return roomNumbers;
  }

  if (searchTerm.trim()) {
    return rooms.filter((room) =>
      room.toString().startsWith(searchTerm.trim())
    );
  }
  return rooms;
};

const RoomGrid = ({ activeNav }: RoomGridProps) => {
  const [activeTab, setActiveTab] = useState("600-693");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredRooms = getFilteredRooms(activeTab, searchTerm);

  useEffect(() => {
    setActiveTab(activeNav === "dhigurah" ? "600-693" : "100-130");
  }, [activeNav]);

  // Handle tab click
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <>
      <div className="bg-white shadow-sm">
        <div className="p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeNav[0].toLocaleUpperCase() + activeNav.slice(1)} Island
              Rooms
            </h2>
            <SearchBar onSearch={handleSearch} />
          </div>
          {/* Room Grid */}
          <Tabs
            items={
              activeNav === "dhigurah"
                ? tabItems.dhigurah
                : tabItems.Falhumaafushi
            }
            activeItem={activeTab}
            className="mb-4"
            onTabClick={handleTabClick}
          />

          {filteredRooms.length > 0 ? (
            <ButtonGrid rooms={filteredRooms} />
          ) : (
            <div className="text-center p-8 text-gray-500">
              No rooms found matching your search.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomGrid;
