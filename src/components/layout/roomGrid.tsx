"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "../ui/searchBar";
import ButtonGrid from "../ui/buttonGrid";
import Tabs from "./tabs";
import { Plus } from "lucide-react";
import { resortApi } from "@/lib/api";
import { Resort } from "@/lib/types";

interface ResortNavigationProps {
  resorts: Resort[];
  activeResort: number; // Use resort ID instead of string
  onResortChange: (resortId: number) => void;
}

const ResortNavigation = ({
  resorts,
  activeResort,
  onResortChange,
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
}

const RoomGrid = ({ addButton, onClick }: RoomGridProps) => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [activeResort, setActiveResort] = useState<number>(1); // Default to first resort
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch resorts on component mount
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await resortApi.getAllResorts();
        if (response.success && response.data.length > 0) {
          setResorts(response.data);
          setActiveResort(response.data[0].id); // Set first resort as default
        }
      } catch (error) {
        console.error("Failed to fetch resorts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, []);

  const handleResortChange = (resortId: number) => {
    setActiveResort(resortId);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Get current resort data
  const currentResort = resorts.find((resort) => resort.id === activeResort);

  if (loading) {
    return <div className="text-center p-4">Loading resorts...</div>;
  }

  if (resorts.length === 0) {
    return <div className="text-center p-4">No resorts found.</div>;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Resort Navigation */}
        <ResortNavigation
          resorts={resorts}
          activeResort={activeResort}
          onResortChange={handleResortChange}
        />

        {/* Room Grid */}
        <div className="bg-white shadow-sm">
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
                    onClick={onClick}
                  >
                    <Plus className="w-3 h-3 lg:w-5 lg:h-5 mr-2" />
                    <span className="items-center">{addButton}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Room Grid - Pass the active resort ID */}
            <ButtonGrid resortId={activeResort} searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomGrid;
