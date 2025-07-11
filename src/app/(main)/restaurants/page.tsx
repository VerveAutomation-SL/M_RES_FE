"use client";
import Header from "@/components/layout/header";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { restaurants } from "@/lib/data";
import { Building2, ChevronRight, MapPin } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  //const [resorts, setResorts] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(
    restaurants[0]?.outlets[0]?.name || null
  );

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await fetch("/resorts");
        const data = await response.json();
        console.log("Fetched resorts:", data);
        //setResorts(data);
      } catch (error) {
        console.error("Error fetching resorts:", error);
      } finally {
        // For demonstration, using static data
        console.log("Using static restaurant data");
      }
    };
    fetchResorts();
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

  const needsScrolling = restaurants.length > 3;

  // Get responsive grid classes based on number of resorts
  const getGridClasses = () => {
    if (needsScrolling) {
      return "flex gap-4 overflow-x-auto custom-scrollbar pb-2";
    }

    // Static grid for 2-3 resorts
    if (restaurants.length === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-4";
    } else if (restaurants.length === 3) {
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
        title="Restaurants Management"
        subtitle="Manage your restaurant listings and details."
        addButton="Add Restaurant"
        onClick={() => console.log("Add Restaurant Clicked")}
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
        <div
          ref={needsScrolling ? scrollRef : null}
          className={getGridClasses()}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {restaurants.map((resort) => (
            <Card key={resort.name} classname={getCardClasses()}>
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="w-4 md:w-5 h-4 md:h-5 text-gray-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                      {resort.name}
                    </h3>
                  </div>
                </div>
                <div className="gap-2 md:gap-4 text-center">
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-2 text-sm md:text-base">
                      {resort.outlets.map((outlet, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                            selectedOutlet === outlet.name
                              ? "text-[var(--primary)]"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedOutlet(outlet.name)}
                        >
                          <span className="flex-shrink-0">
                            <Building2 className="w-2 h-2 md:w-4 md:h-4" />
                          </span>
                          <span className="leading-tight">{outlet.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
