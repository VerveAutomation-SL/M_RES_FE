"use client";

import { roomApi, resortApi } from "@/lib/api";
import { Resort, RoomFormData } from "@/lib/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface RoomFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void; // Add success callback
  selectedResort?: string;
  roomNumber?: string;
}

export default function RoomForm({
  isOpen = false,
  onClose,
  onSuccess,
  selectedResort,
  roomNumber,
}: RoomFormProps) {
  const [formData, setFormData] = useState<RoomFormData>({
    room_number: roomNumber || "",
    resortId: 0,
    name: "",
  });

  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(false);
  const [resortLoading, setResortLoading] = useState(true);
  const [error, setError] = useState("");
  // const [roomType, setRoomType] = useState('');

  // Fetch resorts on component mount
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        console.log("🏨 Fetching resorts for room form...");
        const response = await resortApi.getAllResortsWithRooms();

        if (response && response.success && Array.isArray(response.data)) {
          setResorts(response.data);
          console.log("✅ Resorts loaded for room form:", response.data.length);

          // Set default resort if selectedResort is provided
          if (selectedResort) {
            const resort = response.data.find((r) => r.name === selectedResort);
            if (resort) {
              setFormData((prev) => ({ ...prev, resortId: resort.id }));
            }
          }
        } else {
          console.warn("❌ Invalid resorts data for room form");
          setResorts([]);
        }
      } catch (err) {
        console.error("Failed to fetch resorts for room form:", err);
        setResorts([]);
      } finally {
        setResortLoading(false);
      }
    };

    if (isOpen) {
      fetchResorts();
    }
  }, [isOpen, selectedResort]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.room_number.trim()) {
        setError("Room number is required");
        setLoading(false);
        return;
      }

      if (!formData.resortId || formData.resortId <= 0) {
        setError("Please select a resort");
        setLoading(false);
        return;
      }

      // if (!roomType) {
      //     setError("Please select a room type");
      //     setLoading(false);
      //     return;
      // }

      console.log("🏠 Creating room:", formData);

      // Create room payload
      const roomPayload = {
        room_number: formData.room_number.trim(),
        resort_id: formData.resortId,
        // room_type: roomType,
        // status: "available"
      };

      const response = await roomApi.createRoom(roomPayload);

      console.log("📊 Room creation response:", response);

      if (response && response.success) {
        alert("Room created successfully!");

        // Reset form
        setFormData({ room_number: "", resortId: 0, name: "" });
        // setRoomType('');
        setError("");

        // Call success callback to refresh parent data
        onSuccess?.();

        // Close modal
        onClose?.();
      } else {
        const errorMessage =
          response?.message || "Failed to create room. Please try again.";
        setError(errorMessage);
        console.error("❌ Room creation failed:", response);
      }
    } catch (error) {
      console.error("💥 Error creating room:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const { status, data } = (error as any).response;
        if (status === 409) {
          const errorMessage =
            data?.message ||
            `Room number ${formData.room_number} already exists. Please choose a different room number.`;
          setError(errorMessage);
        } else if (status === 400) {
          const errorMessage =
            data?.message || "Invalid room data. Please check your input.";
          setError(errorMessage);
        } else {
          // Other server errors
          const errorMessage =
            data?.message || "Server error occurred. Please try again.";
          setError(errorMessage);
        }
      } else if (
        typeof error === "object" &&
        error !== null &&
        "request" in error
      ) {
        // Network error
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other errors
        const errorMessage =
          (error as any).message ||
          "An unexpected error occurred while creating the room.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({ room_number: "", resortId: 0, name: "" });
    // setRoomType('');
    setError("");
    onClose?.();
  };

  if (!isOpen) return null;

  if (resortLoading) {
    return (
      <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading resorts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Room</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-red-600 font-medium">
                {error.includes("already exists")
                  ? "Duplicate Room Number"
                  : "Error"}
              </p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number
            </label>
            <input
              type="text"
              required
              value={formData.room_number}
              onChange={(e) =>
                setFormData({ ...formData, room_number: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., 0001"
              disabled={loading}
            />
          </div>

          {/* Resort Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resort Name
            </label>
            <select
              value={formData.resortId}
              onChange={(e) =>
                setFormData({ ...formData, resortId: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
              disabled={loading}
              required
            >
              <option value={0}>Select Resort</option>
              {resorts.map((resort) => (
                <option key={resort.id} value={resort.id}>
                  {resort.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room Type *
                        </label>
                        <select
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
                            disabled={loading}
                            required
                        >
                            <option value="">Select Room Type</option>
                            <option value="Standard">Standard Room</option>
                            <option value="Deluxe">Deluxe Room</option>
                            <option value="Suite">Suite</option>
                            <option value="Villa">Villa</option>
                            <option value="Overwater">Overwater Bungalow</option>
                            <option value="Beach">Beach Villa</option>
                        </select>
                    </div> */}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || !formData.room_number.trim() || !formData.resortId
              }
              className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-amber-900 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
