"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { checkInApi, resortApi, roomApi } from "@/lib/api";
import { CheckInDetails, CheckInDetailsModalProps } from "@/lib/types";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function CheckInDetailsModal({
  isOpen,
  onClose,
  roomId,
  resortId,
  mealType,
  onCheckoutSuccess,
}: CheckInDetailsModalProps) {
  const [checkInDetails, setCheckInDetails] = useState<CheckInDetails | null>(
    null
  );
  const [resortName, setResortName] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState<string>("");
  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const { user } = useAuthStore();

  const fetchCheckInDetails = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [checkInResponse, resortResponse, roomResponse] = await Promise.all(
        [
          checkInApi.getCheckInDetails(resortId, roomId, mealType),
          resortApi.getResortById(resortId),
          roomApi.getRoomById(roomId),
        ]
      );

      if (checkInResponse && checkInResponse.success && checkInResponse.data) {
        setCheckInDetails(checkInResponse.data);
      } else {
        setError("Check-in details not found");
      }

      if (resortResponse && resortResponse.success && resortResponse.data) {
        setResortName(resortResponse.data.name);
      } else {
        setResortName(`Resort ${resortId}`);
      }

      if (roomResponse && roomResponse.success && roomResponse.data) {
        setRoomNumber(roomResponse.data.room_number);
      } else {
        setRoomNumber(`Room ${roomId}`);
      }
    } catch (error) {
      console.error("Failed to fetch check-in details:", error);
      setError("Failed to load check-in details");
    } finally {
      setLoading(false);
    }
  }, [mealType, resortId, roomId]);

  useEffect(() => {
    if (isOpen && roomId && resortId && mealType) {
      fetchCheckInDetails();
    }
  }, [isOpen, roomId, resortId, mealType, fetchCheckInDetails]);

  const formatTime = (timeString: string) => {
    try {
      if (timeString.includes("T")) {
        return new Date(timeString).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        const [hours, minutes] = timeString.split(":");
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleCheckoutClick = () => {
    if (user?.role === "Host") {
      toast.error("Only Admins and Manager can check out rooms");
      return;
    }
    setShowRemarksModal(true);
  };

  const handleConfirmCheckout = async () => {
    setCheckOutLoading(true);
    try {
      const checkOutData = {
        resortId: resortId,
        roomId: roomId,
        mealType: mealType,
        remarks: remarks,
      };

      const response = await checkInApi.processCheckOut(checkOutData);
      if (response.success) {
        toast.success("Check-out successful");

        onCheckoutSuccess?.(roomNumber);
        setShowRemarksModal(false);
        onClose();
      } else {
        toast.error("Check-out failed: " + response.message);
        console.error("Check-out error:", response.message);
      }
    } catch (error) {
      console.error("Check-out failed:", error);
    } finally {
      setCheckOutLoading(false);
      setShowRemarksModal(false);
    }
  };

  const handleCloseRemarksModal = () => {
    setShowRemarksModal(false);
    setRemarks("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Room {roomNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchCheckInDetails}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : checkInDetails ? (
            <div className="space-y-6">
              {/* Status and Room Info */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    DINING
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Room Number</p>
                  <p className="font-medium">{roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date and Time</p>
                  <p className="font-medium text-sm">
                    {formatDate(checkInDetails.createdAt)}{" "}
                    {formatTime(checkInDetails.check_in_time)}
                  </p>
                </div>
              </div>

              {/* Three Column Layout */}
              <div className="grid grid-cols-3 gap-6">
                {/* Restaurant Information */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Restaurant Information
                  </h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">
                      {checkInDetails.outlet_name}
                    </p>
                  </div>
                </div>

                {/* Resort Information */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Resort Name
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium">{resortName}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Table Number</p>
                  <p className="font-medium">{checkInDetails.table_number}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Meal Type</p>
                  <p className="font-medium capitalize">
                    {checkInDetails.meal_type}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Meal Plan</p>
                  <p className="font-medium">{checkInDetails.meal_plan}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Check-out
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No details available
            </div>
          )}
        </div>
      </div>

      {/* Remarks Modal */}
      {showRemarksModal && (
        <div className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">📝</span>
                Remarks
              </h3>
              <button
                onClick={handleCloseRemarksModal}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Content */}
            <div className="p-6 ">
              <textarea
                value={remarks}
                required
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your reason to checkout..."
                className="w-full h-32 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleCloseRemarksModal}
                disabled={checkOutLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckout}
                disabled={checkOutLoading || remarks.length < 10}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {checkOutLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Confirm Check-out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
