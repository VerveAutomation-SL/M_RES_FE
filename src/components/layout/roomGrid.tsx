'use client';

import React,{useState} from "react";
import SearchBar from "../ui/searchBar";
import ButtonGrid from "../ui/buttonGrid";
import Tabs from "./tabs";
import { roomNumbers } from "@/lib/data";

const getFilteredRooms = (tabName : string, searchTerm : string) =>{
  let rooms = [];
  switch (tabName) {
    case "600-693":
      rooms = roomNumbers.filter(room => room >= 600 && room <= 693);
      break;
    case "800-820":
      rooms = roomNumbers.filter(room => room >= 800 && room <= 820);
      break;
    case "840-897":
      rooms = roomNumbers.filter(room => room >= 840 && room <= 897);
      break;
    default:
      return roomNumbers;
  }

  if(searchTerm.trim()){
    return rooms.filter(room => 
      room.toString().startsWith(searchTerm.trim())
    );
  }
  return rooms;
}

const RoomGrid = () => {
  const [activeTab, setActiveTab] = useState("600-693");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredRooms = getFilteredRooms(activeTab, searchTerm);

  const tabItems =[
    {name : "600-693", href: "#600-693"},
    {name : "800-820", href: "#800-820"},
    {name : "840-897", href: "#840-897"},
  ];

  // Handle tab click
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  }
  
  return (
    <>
      <div className="bg-white shadow-sm">
        <div className="p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Dhigurah Island Rooms
            </h2>
            <SearchBar  onSearch={handleSearch}/>
          </div>
          {/* Room Grid */}
          <Tabs
            items={tabItems}
            activeItem={activeTab}
            className="mb-4"
            onTabClick={handleTabClick}
          />

          {filteredRooms.length >0 ?(
            <ButtonGrid  rooms={filteredRooms} />
          ) : (
            <div className="text-center p-8 text-gray-500">No rooms found matching your search.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomGrid;
