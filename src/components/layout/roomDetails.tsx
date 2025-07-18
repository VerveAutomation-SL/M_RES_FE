import React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { Room } from "@/lib/types";

interface ViewDetailsProps {
  isOpen?: boolean;
  onClose: () => void;
  room?: Room;
}

const RoomDetails = ({ isOpen = false, onClose, room }: ViewDetailsProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Form submitted:", room);
      onClose?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-200 pb-2 w-full">
          <div className="flex w-full justify-between items-center">
            <h3 className="text-lg font-semibold">Room D004</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 bg-gray-200 p-4 rounded-lg mb-6 text-center">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Room Number:
            </label>
            <p className="text-sm text-gray-900">{room?.room_number}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div>
              <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {room?.status || "AVAILABLE"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Date and Time:
            </label>
            <p className="text-sm text-gray-900">2025-06-25 14:30:00</p>
          </div>
        </div>

        {/* Information Sections */}
        <div className="grid grid-cols-3 gap-6 text-center space-y-6 p-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Restaurant Information:
            </label>
            <p className="text-sm text-gray-900">LIBAI</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Resort Information:
            </label>
            <p className="text-sm text-gray-900">Dhigurah_Maldives</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Resort Information:
            </label>
            <p className="text-sm text-gray-900">Dhigurah_Maldives</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Resort Information:
            </label>
            <p className="text-sm text-gray-900">Dhigurah_Maldives</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Resort Information:
            </label>
            <p className="text-sm text-gray-900">Dhigurah_Maldives</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Resort Information:
            </label>
            <p className="text-sm text-gray-900">Dhigurah_Maldives</p>
          </div>
        </div>

        <div className="space-y-4">
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
};

export default RoomDetails;
