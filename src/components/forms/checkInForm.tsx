"use client";

import { mealPlans, mealTypes } from "@/lib/data";
import { CheckInFormData, Restaurant } from "@/lib/types";
import { Clock, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { checkInApi } from "@/lib/api";
import { resortApi } from "@/lib/api"; // Import the resortApi
import toast from "react-hot-toast";

interface CheckInFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedRoom?: string;
  mealType?: string;
  resortId?: number;
  roomId?: number;
  outlets?: Restaurant[];
  defaultOutlet?: Restaurant | null;
  onCheckInSuccess?: (roomNumber: string) => void;
}

export default function CheckInForm({
  isOpen = false,
  onClose,
  selectedRoom,
  mealType,
  resortId,
  roomId,
  outlets = [],
  defaultOutlet = null,
  onCheckInSuccess,
}: CheckInFormProps) {
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState<CheckInFormData>({
    resort_name: "",
    room_id: roomId || 0,
    outlet_name: "",
    meal_type: "",
    meal_plan: "",
    table_number: "",
    resort_id: 0,
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchResortAndSetData = async () => {
      if (selectedRoom && resortId && roomId) {
        try {
          // Fetch resort data dynamically
          const resortResponse = await resortApi.getResortById(resortId);
          const resortName = resortResponse.success
            ? resortResponse.data.name
            : `Resort ${resortId}`;

          setFormData((prev) => ({
            ...prev,
            resort_name: resortName,
            resort_id: resortId,
            room_id: roomId,
            room_number: selectedRoom,
            meal_type: mealType || "",
          }));
        } catch (error) {
          console.error("Failed to fetch resort data:", error);
          // Fallback to generic name
          setFormData((prev) => ({
            ...prev,
            resort_name: `Resort ${resortId}`,
            resort_id: resortId,
            room_id: roomId,
            room_number: selectedRoom,
            meal_type: mealType || "",
          }));
        }
      }
    };

    fetchResortAndSetData();
  }, [selectedRoom, resortId, mealType, roomId]);

  useEffect(() => {
    if (defaultOutlet) {
      setFormData((prev) => ({
        ...prev,
        outlet_name: defaultOutlet.restaurantName ||  "",
      }));
    }
  }, [defaultOutlet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.resort_name ||
        !formData.room_id ||
        !formData.outlet_name ||
        !formData.meal_type ||
        !formData.meal_plan ||
        !formData.table_number
      ) {
        toast.error("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      if (!roomId) {
        toast.error("Room ID not found. Please try again.");
        setLoading(false);
        return;
      }

      const timeOnly = currentTime.toTimeString().split(" ")[0];

      const checkInPayload = {
        resort_name: formData.resort_name,
        room_id: roomId,
        outlet_name: formData.outlet_name,
        meal_type: formData.meal_type,
        meal_plan: formData.meal_plan,
        table_number: formData.table_number,
        resort_id: formData.resort_id,
        check_in_time: timeOnly,
      };

      console.log("Submitting check-in data:", checkInPayload);

      const response = await checkInApi.processCheckIn(checkInPayload);

      if (response && response.success) {
        onCheckInSuccess?.(selectedRoom!);
        toast.success("Check-in successful!");
        onClose?.();
      } else {
        alert(response?.message || "Failed to check in");
      }
    } catch (error) {
      console.error("Check-in submission error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during check-in";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold">
              Check-in Room {selectedRoom} - {mealType}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resort Name*
            </label>
            <input
              type="text"
              required
              value={formData.resort_name}
              onChange={(e) =>
                setFormData({ ...formData, resort_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
              placeholder="Resort Name"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number*
            </label>
            <input
              type="text"
              required
              value={selectedRoom || ""} // Use selectedRoom prop instead of formData.room_number
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
              placeholder="Room Number"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outlet*
            </label>
            <select
              required
              value={formData.outlet_name}
              onChange={(e) =>
                setFormData({ ...formData, outlet_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">Select outlet</option>
              {(outlets || [])
                .filter((outlet) => outlet.status === 'Open')
                .map((outlet) => (
                <option
                  key={outlet.id}
                  value={outlet.restaurantName}
                >
                  {outlet.restaurantName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Number*
            </label>
            <input
              type="text"
              required
              value={formData.table_number}
              onChange={(e) =>
                setFormData({ ...formData, table_number: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              placeholder="012"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Type*
            </label>
            <select
              required
              value={formData.meal_type}
              onChange={(e) =>
                setFormData({ ...formData, meal_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
              disabled
            >
              <option value="">Select meal type</option>
              {mealTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Plan*
            </label>
            <select
              required
              value={formData.meal_plan}
              onChange={(e) =>
                setFormData({ ...formData, meal_plan: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">Select meal plan</option>
              {mealPlans.map((plan) => (
                <option key={plan.value} value={plan.value}>
                  {plan.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Check-in time: {currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-amber-900 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
