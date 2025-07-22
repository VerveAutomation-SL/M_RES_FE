"use client";
import Header from "@/components/layout/header";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllResortsWithRestaurants } from "@/lib/api/restaurants";
import { Resort, Restaurant } from "@/lib/types";
import {
  Badge,
  ChevronRight,
  Clock,
  Edit,
  Filter,
  MapPin,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const Page = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [activeResort, setActiveResort] = useState<Resort>(resorts[0]);
  const [loadingResorts, setLoadingResorts] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedResort, setSelectedResort] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchResorts = async () => {
      setLoadingResorts(true);
      try {
        const response = await getAllResortsWithRestaurants();
        console.log("Fetched resorts:", response.data);
        setResorts(response.data);
        setActiveResort(response.data[0]);
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
    console.log("Selected resort:", resort);
    setActiveResort(resort);
  };

  function handleRestaurantClick(restaurant: Restaurant): void {
    console.log("Selected restaurant:", restaurant);
    // You can add further logic here, such as navigating to a detailed view
    // or opening a modal with restaurant details.
  }

  const allRestaurants = resorts.flatMap((resort) => resort.restaurants || []);

  const filteredRestaurants = allRestaurants.filter((restaurant) => {
    const matchesSearch = restaurant.restaurantName
      .toLowerCase()
      .startsWith(searchValue.toLowerCase());

    const matchesResort =
      selectedResort === "all" || restaurant.restaurantName === selectedResort;

    return matchesSearch && matchesResort;
  });

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
                key={resort.id}
                classname={getCardClasses()}
                onClick={() => handleResortSelect(resort)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin className="w-4 md:w-5 h-4 md:h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm md:text-lg lg:text-xl leading-tight">
                        {resort.name}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:gap-4 text-center">
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-gray-900">
                        {0 || resort.restaurants?.length}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        Total Restaurants
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
      {/* <div>
        {activeResort && (
          <Card classname="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="md:p-2">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  <span>{activeResort.name}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {activeResort.restaurants?.length === 0 ? (
                  <div className="text-gray-500 text-center col-span-full">
                    No restaurants available for this resort.
                  </div>
                ) : (
                  activeResort.restaurants?.map((restaurant) => (
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
                  ))
                )}
              </div>
            </div>
          </Card>
        )}
      </div> */}

      <Card classname="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-semibold">Restaurant Directory</h1>
            <div className="flex items-center gap-4">
              <Button
                variant={
                  viewMode === "grid"
                    ? "outline bg-black text-white"
                    : "default"
                }
                size="sm"
                onClick={() => setViewMode("grid")}
                className="py-1 px-3 rounded-md"
              >
                Grid
              </Button>
              <Button
                variant={
                  viewMode === "list"
                    ? "outline bg-black text-white"
                    : "default"
                }
                size="sm"
                onClick={() => setViewMode("list")}
                className="py-1 px-3 rounded-md flex items-center gap-1"
              >
                List
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search restaurants by name"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedResort}
                  onChange={(e) => setSelectedResort(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white"
                >
                  <option value="all">All Locations</option>
                  {resorts.map((resort) => (
                    <option key={resort.id} value={resort.name}>
                      {resort.name}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Restaurant Cards - Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  classname="cursor-pointer hover:shadow-lg transition-all bg-gray-100"
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  <div className="flex items-center justify-between w-full max-w-md p-4 rounded-lg shadow-sm bg-white">
                    {/* Left side: Title and Location */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {restaurant.restaurantName}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        Dhigurah Island
                      </div>
                    </div>

                    {/* Right side: Status badge */}
                    <div
                      className={`text-sm px-3 py-1 font-medium rounded-full ${
                        restaurant.status === "Open" || true
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }`}
                    >
                      {restaurant.status || "Open"}
                    </div>
                  </div>
                  {/* <div className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <div className="font-medium text-gray-900">
                            {restaurant.id}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Capacity:</span>
                          <div className="font-medium text-gray-900">
                            {restaurant.id} guests
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Cuisine:</span>
                        <div className="font-medium text-gray-900">
                          {restaurant.id}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Hours:</span>
                        <div className="font-medium text-gray-900">
                          {restaurant.id}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Last updated: Today
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </Card>
              ))}
            </div>
          )}

          {/* Restaurant Cards - List View */}
          {viewMode === "list" && (
            <div className="space-y-6">
              {filteredRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  classname="cursor-pointer hover:shadow-lg transition-al bg-gray-50"
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  <div className="py-1 px-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-8 mb-1">
                            <h3 className="font-semibold text-xl text-gray-900">
                              {restaurant.restaurantName}
                            </h3>
                            <div
                              className={`text-sm px-3 py-1 font-medium rounded-full ${
                                restaurant.status === "Open" || true
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }`}
                            >
                              {restaurant.status || "Open"}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span className="text-sm">
                              {restaurant.resort_id}
                            </span>
                          </div>
                        </div>
                        {/* <div className="hidden md:flex items-center gap-6 text-sm mr-10 text-gray-600">
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-1 font-medium">
                              {restaurant.id}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Cuisine:</span>
                            <span className="ml-1 font-medium">
                              {restaurant.id}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Capacity:</span>
                            <span className="ml-1 font-medium">
                              {restaurant.id} guests
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Hours:</span>
                            <span className="ml-1 font-medium">
                              {restaurant.id}
                            </span>
                          </div>
                        </div> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* No results message */}
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-lg">No restaurants found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Results count */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
            <span>
              Showing {filteredRestaurants.length} of {allRestaurants.length}{" "}
              restaurants
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Page;
