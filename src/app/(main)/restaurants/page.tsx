"use client";
import ResturantForm from "@/components/forms/resturantForm";
import Header from "@/components/layout/header";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { getAllResortsWithRestaurants } from "@/lib/api/restaurants";
import { Resort } from "@/lib/types";
import { ChevronRight, Clock, Filter, MapPin, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import EditRestaurantModal from "@/components/layout/EditResturant";
import { useAuthStore } from "@/store/authStore";

const Page = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loadingResorts, setLoadingResorts] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedResort, setSelectedResort] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showaddModal, setShowaddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { isAuthenticated, isLoading, user } = useAuthStore();

  console.log(user, "user in restaurant page");

  useEffect(() => {
    const fetchResorts = async () => {
      setLoadingResorts(true);
      try {
        const response = await getAllResortsWithRestaurants();
        console.log("Fetched resorts:", response.data);
        setResorts(response.data);
      } catch (error) {
        console.error("Error fetching resorts:", error);
      } finally {
        setLoadingResorts(false);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchResorts();
    }
  }, [isAuthenticated, isLoading, refreshTrigger]);

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
      return "bg-white shadow-sm flex-shrink-0 w-62 md:w-72 lg:w-80 xl:w-96 transition-transform duration-200 cursor-pointer";
    }
    return "bg-white shadow-sm w-full transition-transform duration-200 cursor-pointer";
  };

  const allRestaurants = resorts.flatMap((resort) => resort.restaurants || []);

  const filteredRestaurants = allRestaurants.filter((restaurant) => {
    const matchesSearch = restaurant.restaurantName
      .toLowerCase()
      .startsWith(searchValue.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      restaurant.status.toLowerCase() === statusFilter.toLowerCase();

    const resortName = resorts.find(
      (resort) => resort.id === restaurant.resort_id
    )?.name;

    const matchesResort =
      selectedResort === "all" || resortName === selectedResort;

    return matchesSearch && matchesResort && matchesStatus;
  });

  const handelRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Trigger re-fetch
  };

  const handleRestaurantClick = (restaurantId: number) => {
    console.log("Selected restaurant:", restaurantId);
    setSelectedRestaurant(restaurantId);
    setShowViewModal(true);
  };

  const handleCloseAddModal = () => {
    setShowaddModal(false);
  };

  const handelAddRestaurant = () => {
    setShowaddModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    handelRefresh();
  };

  return (
    <>
      <Header
        title="Restaurants Management"
        subtitle="Manage your restaurant listings and details."
        addButton="Add Restaurant"
        onClick={() => handelAddRestaurant()}
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
          <div>
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
                        <h3 className="font-semibold text-gray-900 text-sm md:text-lg lg:text-xl leading-tight">
                          {resort.name} Island
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
                      <div className="text-green-600">
                        <div className="text-xl md:text-2xl font-bold">
                          {resort.restaurants?.filter(
                            (restaurant) => restaurant.status === "Open"
                          ).length || 0}
                        </div>
                        <div className="text-xs md:text-sm ">
                          Active Restaurants
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Card classname="bg-white shadow-sm border border-gray-200 rounded-lg mt-5">
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <h1 className="text-2xl font-semibold">
                    Restaurant Directory
                  </h1>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={
                        viewMode === "grid"
                          ? "outline bg-black text-white"
                          : "default"
                      }
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="py-1 px-3 rounded-md border"
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
                      className="py-1 px-3 rounded-md flex items-center gap-1 border"
                    >
                      List
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-6 lg:items-center">
                  {/* Search Input - Row 1 on Mobile, Takes More Space on Desktop */}
                  <div className="w-full lg:flex-[2]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search restaurants"
                        value={searchValue}
                        onChange={(e: {
                          target: { value: React.SetStateAction<string> };
                        }) => setSearchValue(e.target.value)}
                        className="pl-10 w-full text-sm placeholder:text-xs sm:placeholder:text-sm"
                        name={""}
                        required={false}
                      />
                    </div>
                  </div>

                  {/* Location Filter - Row 2 on Mobile, Equal Space with Status on Desktop */}
                  <div className="w-full lg:flex-1">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <select
                        value={selectedResort}
                        onChange={(e) => setSelectedResort(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white"
                      >
                        <option value="all">All Locations</option>
                        {resorts.map((resort) => (
                          <option key={resort.id} value={resort.name}>
                            {resort.name}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Status Filter - Row 3 on Mobile, Equal Space with Location on Desktop */}
                  <div className="w-full lg:flex-1">
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white appearance-none"
                      >
                        <option value="all">All Status</option>
                        <option value="Open">Open</option>
                        <option value="Close">Closed</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restaurant Cards - Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {filteredRestaurants.map((restaurant) => (
                      <Card
                        key={restaurant.id}
                        classname="cursor-pointer hover:shadow-lg transition-all bg-white"
                        onClick={() => handleRestaurantClick(restaurant.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-lg lg:text-xl leading-tight pr-2 flex-1">
                            {restaurant.restaurantName} Restaurant
                          </h3>
                          <div
                            className={`text-sm px-3 py-1 font-medium rounded-full ${
                              restaurant.status === "Open"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            {restaurant.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="text-sm">
                            {
                              resorts.find(
                                (resort) => resort.id === restaurant.resort_id
                              )?.name
                            }{" "}
                            Island
                          </span>
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
                  <div className="space-y-4">
                    {filteredRestaurants.map((restaurant) => (
                      <Card
                        key={restaurant.id}
                        classname="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200 hover:border-gray-300"
                        onClick={() => handleRestaurantClick(restaurant.id)}
                      >
                        <div className="p-1">
                          {/* Header with Restaurant Name and Status */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                            <div className="flex flex-col items-start gap-2">
                              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-900">
                                {restaurant.restaurantName}
                              </h3>
                              <div className="text-xs sm:text-sm text-gray-500">
                                <MapPin className="inline-block w-3 h-3 mr-1" />
                                {resorts.find(
                                  (resort) => resort.id === restaurant.resort_id
                                )?.name || "Unknown Resort"}
                              </div>
                            </div>
                            <div className="flex-shrink-0 mt-2 sm:mt-0">
                              <span
                                className={`inline-flex items-center px-2 py-1 lg:px-3 lg:py-2 text-sm md:text-base font-medium rounded-full ${
                                  restaurant.status === "Open"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {restaurant.status}
                              </span>
                            </div>
                          </div>

                          {/* Restaurant Details - All in One Row */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
                                Restaurant ID
                              </span>
                              <span className="text-sm sm:text-base font-medium text-gray-900 mt-1">
                                #{restaurant.id}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
                                Type
                              </span>
                              <span className="text-sm sm:text-base font-medium text-gray-900 mt-1">
                                Full Service
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
                                Capacity
                              </span>
                              <span className="text-sm sm:text-base font-medium text-gray-900 mt-1">
                                50-80 guests
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
                                Cuisine Type
                              </span>
                              <span className="text-sm sm:text-base font-medium text-gray-900 mt-1">
                                International
                              </span>
                            </div>
                          </div>

                          {/* Second Row - Operating Hours */}
                          <div className="mb-4">
                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
                                Operating Hours
                              </span>
                              <span className="text-sm sm:text-base font-medium text-gray-900 mt-1">
                                7:00 AM - 11:00 PM
                              </span>
                            </div>
                          </div>

                          {/* Footer with Timestamp and Edit Action */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                Last updated:{" "}
                                {restaurant.updatedAt
                                  ? new Date(
                                      restaurant.updatedAt
                                    ).toLocaleDateString()
                                  : "Today"}
                              </span>
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
                    Showing {filteredRestaurants.length} of{" "}
                    {allRestaurants.length} restaurants
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {showaddModal && (
        <ResturantForm
          isOpen={showaddModal}
          onClose={handleCloseAddModal}
          onSuccess={handelRefresh}
        />
      )}
      {showViewModal && selectedRestaurant && (
        <EditRestaurantModal
          restaurantId={selectedRestaurant}
          onClose={handleCloseViewModal}
          onUpdate={handelRefresh}
          isOpen={showViewModal}
        />
      )}

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
    </>
  );
};

export default Page;
