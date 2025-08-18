import React, { useEffect, useState } from "react";
import { Edit3, Save, Trash2, X, XCircle } from "lucide-react";
import { Resort } from "@/lib/types";
import toast from "react-hot-toast";
import { deleteResort, getResortById, updateResort } from "@/lib/api/resortApi";

interface ViewResortProps {
  isOpen: boolean;
  onClose: () => void;
  resortId: number;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const ViewResort = ({
  isOpen,
  onClose,
  resortId,
  onUpdate,
  onDelete,
}: ViewResortProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [resort, setResort] = useState<Resort>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (isOpen && resortId) {
      const fetchResort = async () => {
        try {
          const response = await getResortById(resortId);
          console.log("Fetched resort:", response.data);
          if (response?.success) {
            setResort(response.data);
            setError(""); // Clear any previous errors
          } else {
            setError("Failed to fetch resort data.");
          }
        } catch (err) {
          console.error("Error fetching resort:", err);
          setError("An error occurred while fetching resort data.");
        }
      };
      fetchResort();
    }
  }, [isOpen, resortId, refreshTrigger]);

  const handleSave = async () => {
    if (!resort) {
      setError("No resort data available.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateResort(resort.id, {
        ...resort,
      });

      if (response?.success) {
        console.log("Update response:", response);
        onUpdate?.();
        setIsEditing(false);
        handelRefresh();
        setError("");
        toast.success("Resort updated successfully!");
      } else {
        setError("Failed to update resort.");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while updating.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!resort) return;
    setLoading(true);
    try {
      const response = await deleteResort(resort.id);
      if (response?.success) {
        toast.success("Resort deleted successfully!");
        onDelete?.();
        onClose();
      } else {
        setError("Failed to delete resort.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting resort.");
    } finally {
      setLoading(false);
    }
  };

  const handelRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!isOpen || !resort) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Resort Details
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
          {/* Resort Information Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Resort Information
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
                  Resort Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={resort.name}
                    onChange={(e) =>
                      setResort((prev) =>
                        prev ? { ...prev, name: e.target.value } : undefined
                      )
                    }
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {resort.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={resort.location}
                    onChange={(e) =>
                      setResort((prev) =>
                        prev ? { ...prev, location: e.target.value } : undefined
                      )
                    }
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {resort.location}
                  </p>
                )}
              </div>
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
                  {resort.createdAt
                    ? new Date(resort.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-600 text-sm">
                  {resort.updatedAt
                    ? new Date(resort.updatedAt).toLocaleString()
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
                Delete Resort
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                Are you sure you want to delete this resort? This action cannot
                be undone.
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

export default ViewResort;
