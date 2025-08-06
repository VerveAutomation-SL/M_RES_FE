"use client";

import { Resort, Restaurant } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ResortOutletSelectorProps {
  AllData: Resort[];
  onSelect: (resort: Resort, outlet: Restaurant) => void;
  onClose: () => void;
  assignResort?: number | null;
  assignRestaurant?: number | null;
}

export default function ResortOutletSelector({
  AllData,
  onSelect,
  onClose,
  assignResort,
  assignRestaurant,
}: ResortOutletSelectorProps) {
  // selected resort and outlet Ids
  const [selectedResort, setSelectedResort] = useState<number | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(
    null
  );

  // available resorts and restaurants based on user role
  const [resortSelection, setResortSelection] = useState<Resort[]>();
  const [restaurantSelection, setRestaurantSelection] =
    useState<Restaurant[]>();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === "Admin") {
      setResortSelection(AllData);
      if (selectedResort) {
        const resort = AllData.find((r) => r.id === selectedResort);
        setRestaurantSelection(resort?.restaurants || []);
        setSelectedRestaurant(null);
        // Debug
        console.log("Selected resort:", resort);
        console.log("Outlets for resort:", resort?.restaurants);
      }
    } else if (user?.role === "Manager" || user?.role === "Host") {
      if (assignResort) {
        const resort = AllData.find((r) => r.id === assignResort);
        console.log("Assign resort:", resort);
        if (resort) {
          setResortSelection([resort]);
          setSelectedResort(resort.id);
          if (assignRestaurant) {
            // have assignRestaurant
            const restaurant = resort.restaurants?.find(
              (r) => r.id === assignRestaurant
            );
            console.log("Assign restaurant:", restaurant);
            if (restaurant) {
              setRestaurantSelection([restaurant]);
              setSelectedRestaurant(restaurant.id);
            }
          } else {
            // no assignRestaurant, set all restaurants for the resort
            setRestaurantSelection(resort.restaurants || []);
          }
          // setRestaurantSelection(resort.restaurants || []);
          // setSelectedRestaurant(assignRestaurant ?? null);
        }
      } else {
        // No assignResort, show all resorts
        setResortSelection(AllData);
        setSelectedResort(null);
        setSelectedRestaurant(null);
      }
    }
  }, [selectedResort, AllData, user?.role, assignResort, assignRestaurant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedResort && selectedRestaurant) {
      const resort = AllData.find((r) => r.id === selectedResort);
      const outlet = (restaurantSelection ?? []).find(
        (o) => o.id === selectedRestaurant
      );
      if (resort && outlet) {
        onSelect(resort, outlet);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
      <form
        className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-gray-100"
        onSubmit={handleSubmit}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-6 h-6 cursor-pointer" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Select Resort & Outlet
        </h2>
        <div>
          <label className="block text-base font-medium mb-2 text-gray-700">
            Resort
          </label>
          <select
            required
            value={selectedResort || ""}
            onChange={(e) => setSelectedResort(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-base bg-gray-50"
          >
            <option value="">Choose a resort</option>
            {(resortSelection ?? []).map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-medium mb-2 text-gray-700">
            Outlet
          </label>
          <select
            required
            value={selectedRestaurant || ""}
            onChange={(e) => setSelectedRestaurant(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-base bg-gray-50"
            disabled={!selectedResort}
          >
            <option value="">Choose an outlet</option>
            {(restaurantSelection ?? [])
              .filter((o) => o.status === "Open")
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.restaurantName}
                </option>
              ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-2 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-lg text-base shadow transition cursor-pointer"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
