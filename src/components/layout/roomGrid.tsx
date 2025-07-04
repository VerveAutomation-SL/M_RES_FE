import React from "react";
import SearchBar from "../ui/searchBar";
import ButtonGrid from "../ui/buttonGrid";
import Tabs from "./tabs";

const RoomGrid = () => {
  return (
    <>
      <div className="bg-white shadow-sm">
        <div className="p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Dhigurah Island Rooms
            </h2>
            <SearchBar />
          </div>
          {/* Room Grid */}
          <Tabs
            items={[
              { name: "Resorts", href: "" },
              { name: "Rooms", href: "" },
              { name: "Check-Ins", href: "" },
            ]}
            className="mb-4"
          />
          <ButtonGrid />
        </div>
      </div>
    </>
  );
};

export default RoomGrid;
