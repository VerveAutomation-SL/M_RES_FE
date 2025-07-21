"use client";
import Header from "@/components/layout/header";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { getAllResorts } from "@/lib/api/restaurants";
import { Resort, Restaurant } from "@/lib/types";
import { ChevronRight, MapPin } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { resorts } from "@/lib/data";

const Page = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeResort, setActiveResort] = useState<Resort>(resorts[0] || null);
  //const [resorts, setResorts] = useState<Resort[]>([]);
  const [loadingResorts, setLoadingResorts] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  useEffect(() => {
    const fetchResorts = async () => {
      setLoadingResorts(true);
      try {
        const response = await getAllResorts();
        console.log("Fetched resorts:", response.data);
        // setResorts(response.data);
      } catch (error) {
        console.error("Error fetching resorts:", error);
      } finally {
        setLoadingResorts(false);
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
    return "bg-white shadow-sm w-full transition-transform duration-200 hover:scale-105 cursor-pointer";
  };

  const handleResortSelect = async (resort: React.SetStateAction<Resort>) => {
    setActiveResort(resort);
    setLoadingRestaurants(true);
    try {
      const response = await getAllResorts();
      console.log("Fetched restaurants for resort:", response.data);
      // setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  function handleRestaurantClick(restaurant: Restaurant): void {
    console.log("Selected restaurant:", restaurant);
    // You can add further logic here, such as navigating to a detailed view
    // or opening a modal with restaurant details.
  }

  return (
    <>
      <Header
        title="Restaurants Management"
        subtitle="Manage your restaurant listings and details."
        addButton="Add Restaurant"
        onClick={() => console.log("Add Restaurant clicked")}
      />

      <div className="relative mb-4 md:mb-8">
        {/* Navigation Buttons */}
        {needsScrolling && (
          <Button
            className="absolute right-5 -top-1/12 z-10 bg-gray-200 shadow-md hover:bg-gray-50 p-1 md:p-2 cursor-pointer"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        {/* Scrollable Resort Cards Container */}
        {loadingResorts ? (
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
              <Card
                key={resort.name}
                classname={getCardClasses()}
                onClick={() => handleResortSelect(resort)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin className="w-4 md:w-5 h-4 md:h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                        {resort.name}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:gap-4 text-center">
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-gray-900">
                        {resort.restaurants.length}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        Total Restaurants
                      </div>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-green-500">
                        {
                          resort.restaurants.filter(
                            (restaurant) => restaurant.diningTables > 0
                          ).length
                        }
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Restaurants List */}
      {loadingRestaurants ? (
        <div className="flex justify-center items-center h-60">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[var(--primary)]"></div>
          <span className="ml-2 text-gray-700">Loading...</span>
        </div>
      ) : (
        <div>
          {activeResort && (
            <Card classname="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="md:p-2">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                    <span>{activeResort.name}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  {activeResort.restaurants.map((restaurant) => (
                    <Card
                      key={restaurant.id}
                      classname="bg-gray-50 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleRestaurantClick(restaurant)}
                    >
                      <div className="">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2 flex-1">
                            {restaurant.restaurantName}
                          </h3>
                        </div>
                        <div className="space-y-1.5 lg:space-y-2 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {restaurant.id}
                          </div>
                          <div>
                            <span className="font-medium">Cuisine:</span>{" "}
                            {restaurant.id}
                          </div>
                          <div>
                            <span className="font-medium">Capacity:</span>{" "}
                            {restaurant.id} guests
                          </div>
                          <div className="">
                            <span className="font-medium">Hours:</span>{" "}
                            {restaurant.id}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
