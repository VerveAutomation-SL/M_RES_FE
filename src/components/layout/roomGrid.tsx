'use client';

import React,{useState} from "react";
import SearchBar from "../ui/searchBar";
import ButtonGrid from "../ui/buttonGrid";
import Tabs from "./tabs";
import { roomNumbers } from "@/lib/data";

const getFilteredRooms = (tabName : string) =>{
  switch (tabName) {
    case "600-693":
      return roomNumbers.filter(room => room >= 600 && room <= 693);
    case "800-820":
      return roomNumbers.filter(room => room >= 800 && room <= 820);
    case "840-897":
      return roomNumbers.filter(room => room >= 840 && room <= 897);
    default:
      return roomNumbers;
  }
}

const RoomGrid = () => {
  const [activeTab, setActiveTab] = useState("600-693");
  const filteredRooms = getFilteredRooms(activeTab);

  const tabItems =[
    {name : "600-693", href: "#600-693"},
    {name : "800-820", href: "#800-820"},
    {name : "840-897", href: "#840-897"},
  ];

  // Handle tab click
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };
  
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
            items={tabItems}
            activeItem={activeTab}
            className="mb-4"
            onTabClick={handleTabClick}
          />
          <ButtonGrid  rooms={filteredRooms} />
        </div>
      </div>
    </>
  );
};

export default RoomGrid;
