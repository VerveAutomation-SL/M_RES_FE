"use client";
import Header from "@/components/layout/header";
import RoomGrid from "@/components/layout/roomGrid";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { getResorts } from "@/lib/api/resorts";
import { Resort } from "@/lib/types";
import { ChevronRight, MapPin } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const Page = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllResorts = async () => {
      setLoading(true);
      try {
        const response = await getResorts();
        console.log("Fetched resorts:", response.data);
        setResorts(response.data);
      } catch (error) {
        console.error("Error fetching resorts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllResorts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 424;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const needsScrolling = resorts.length > 3;

  // Get responsive grid classes based on number of resorts
  const getGridClasses = () => {
    if (needsScrolling) {
      return "flex gap-4 overflow-x-auto custom-scrollbar pb-2";
    }

    // Static grid for 2-3 resorts
    if (resorts.length === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-4";
    } else if (resorts.length === 3) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
    } else {
      return "grid grid-cols-1 gap-4";
    }
  };

  // Get card classes based on scrolling mode
  const getCardClasses = () => {
    if (needsScrolling) {
      return "bg-white shadow-sm flex-shrink-0 w-62 md:w-72 lg:w-80 xl:w-96 transition-transform duration-200 hover:scale-105 cursor-pointer";
    }
    return "bg-white shadow-sm w-full";
  };

  return (
    <>
      <Header
        title="Resort Management"
        subtitle="Manage your resorts and rooms efficiently."
        addButton="Add Resort"
        onClick={() => {
          console.log("Add Resort Clicked");
        }}
      />
      <div className="relative">
        {/* Navigation Buttons */}
        {needsScrolling && (
          <Button
            className="absolute right-5 -top-1/12 z-10 bg-gray-200 shadow-md hover:bg-gray-50 p-1 md:p-2 cursor-pointer"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        {/* Scrollable Cards Container */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[var(--primary)]"></div>
            <span className="ml-2 text-gray-700">Loading...</span>
          </div>
        ) : (
          <div
            ref={needsScrolling ? scrollRef : null}
            className={getGridClasses()}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {resorts.map((resort) => (
              <Card key={resort.id} classname={getCardClasses()}>
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin className="w-4 md:w-5 h-4 md:h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                        {resort.name}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-gray-900">
                        {resort.Rooms.length}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        Total Rooms
                      </div>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-red-500">
                        {resort.id}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        Booked
                      </div>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-green-500">
                        {resort.id}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        Available
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <RoomGrid
        resorts={resorts} // name, location, Rooms
        addButton="Add Room"
        onClick={() => {
          console.log("Add Room Clicked");
        }}
        mode="roomDetails"
      />
    </>
  );
};

export default Page;
