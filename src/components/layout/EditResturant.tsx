import React, { useEffect, useState } from "react";
import { Edit3, Save, Trash2, X, XCircle } from "lucide-react";
import { Resort, Restaurant } from "@/lib/types";
import {
  deleteRestaurant,
  getAllResorts,
  getRestaurantById,
  updateRestaurant,
} from "@/lib/api/restaurantsApi";

interface EditRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: number;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const EditRestaurantModal = ({
  isOpen,
  onClose,
  restaurantId,
  onUpdate,
  onDelete,
}: EditRestaurantModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (isOpen && restaurantId) {
      const fetchRestaurant = async () => {
        try {
          const response = await getRestaurantById(restaurantId);
          console.log("Fetched restaurant:", response.data);
          if (response?.success) {
            setRestaurant(response.data);
            setError(""); // Clear any previous errors
          } else {
            setError("Failed to fetch restaurant data.");
          }
        } catch (err) {
          console.error("Error fetching restaurant:", err);
          setError("An error occurred while fetching restaurant data.");
        }
      };
      fetchRestaurant();
    }
  }, [isOpen, restaurantId, refreshTrigger]);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await getAllResorts();
        if (response?.success && response.data) {
          setResorts(response.data);
        }
      } catch (err) {
        console.error("Error fetching resorts", err);
      }
    };
    fetchResorts();
  }, []);

  const handleSave = async () => {
    if (!restaurant) {
      setError("No restaurant data available.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateRestaurant(restaurant.id, {
        ...restaurant,
        status: restaurant.status === "Closed" ? "Close" : restaurant.status,
      });

      if (response?.success) {
        console.log("Update response:", response);
        onUpdate?.();
        setIsEditing(false);
        handelRefresh();
        setError("");
      } else {
        setError("Failed to update restaurant.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!restaurant) return;
    setLoading(true);
    try {
      const response = await deleteRestaurant(restaurant.id);
      if (response?.success) {
        onDelete?.();
        onClose();
      } else {
        setError("Failed to delete restaurant.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting restaurant.");
    } finally {
      setLoading(false);
    }
  };

  const handelRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!isOpen || !restaurant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Restaurant Details
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          {/* Restaurant Information Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Restaurant Information
              </h3>
              {!isEditing && (
                <div className="flex gap-2">
                  <button
                    disabled={loading}
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={restaurant.restaurantName}
                    onChange={(e) =>
                      setRestaurant((prev) =>
                        prev
                          ? { ...prev, restaurantName: e.target.value }
                          : undefined
                      )
                    }
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {restaurant.restaurantName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resort Name
                </label>
                {isEditing ? (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={restaurant.resort_id}
                    onChange={(e) =>
                      setRestaurant((prev) =>
                        prev
                          ? { ...prev, resort_id: Number(e.target.value) }
                          : undefined
                      )
                    }
                    disabled={loading}
                  >
                    {resorts.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {resorts.find((r) => r.id === restaurant.resort_id)?.name ||
                      "Unknown Resort"}
                  </p>
                )}
              </div>
            </div>

            {/* Status Field - Full Width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              {isEditing ? (
                <select
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={restaurant.status}
                  onChange={(e) =>
                    setRestaurant((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: e.target.value as "Open" | "Closed",
                          }
                        : undefined
                    )
                  }
                  disabled={loading}
                >
                  <option value="Open">Open</option>
                  <option value="Close">Close</option>
                </select>
              ) : (
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    restaurant.status === "Open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {restaurant.status}
                </span>
              )}
            </div>

            {/* Edit Mode Actions */}
            {isEditing && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* System Information Section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-gray-600 text-sm">
                  {restaurant.createdAt
                    ? new Date(restaurant.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-600 text-sm">
                  {restaurant.updatedAt
                    ? new Date(restaurant.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Confirm Delete Prompt */}
        {confirmDelete && (
          <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Restaurant
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                Are you sure you want to delete this restaurant? This action
                cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRestaurantModal;
