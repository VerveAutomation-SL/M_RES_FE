import React, { useEffect, useState } from "react";
import { Edit3, Save, Trash2, X, XCircle } from "lucide-react";
import { Resort, Restaurant } from "@/lib/types";
import {
  deleteRestaurant,
  getAllResorts,
  getRestaurantById,
  updateRestaurant,
} from "@/lib/api/restaurants";

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
  }, [isOpen, restaurantId]);

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
    console.log("Saving restaurant:", restaurant);

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

  if (!isOpen || !restaurant) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Restaurant</h2>
          <button onClick={onClose} disabled={loading}>
            <X className="text-gray-500 hover:text-gray-700 w-6 h-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-sm text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name
            </label>
            {isEditing ? (
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
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
              <p className="text-gray-800">{restaurant.restaurantName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            {isEditing ? (
              <select
                className="w-full p-2 border rounded-md focus:outline-none"
                value={restaurant.status}
                onChange={(e) =>
                  setRestaurant((prev) =>
                    prev
                      ? { ...prev, status: e.target.value as "Open" | "Closed" }
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
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  restaurant.status === "Open"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {restaurant.status}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resort Name
            </label>
            {isEditing ? (
              <select
                className="w-full p-2 border rounded-md"
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
              <p className="text-gray-800">
                {resorts.find((r) => r.id === restaurant.resort_id)?.name ||
                  "Unknown Resort"}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center border-t pt-4">
          {!isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}

          <button
            className="text-sm text-gray-600 hover:underline"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Confirm Delete Prompt */}
        {confirmDelete && (
          <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-800 text-sm mb-3">
              Are you sure you want to delete this restaurant? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRestaurantModal;
