import React, { useEffect, useState } from "react";
import { Edit3, Save, Trash2, X, XCircle } from "lucide-react";
import { Permission, User } from "@/lib/types";
import {
  deleteUser,
  getAllPermissions,
  getUserDetails,
  updateUserDetails,
} from "@/lib/api/userApi";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const EditUserModal = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
  onUpdate,
  onDelete,
}: EditUserModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchUser = async () => {
        try {
          const response = await getUserDetails(userId);
          console.log("Fetched user:", response.data);
          if (response?.success) {
            setUser(response.data);
            setError(""); // Clear any previous errors
          } else {
            setError("Failed to fetch user data.");
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("An error occurred while fetching user data.");
        }
      };
      fetchUser();
    }
  }, [isOpen, userId, refreshTrigger]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getAllPermissions();
        if (response?.success && response.data) {
          setPermissions(response.data);
        }
      } catch (err) {
        console.error("Error fetching permissions", err);
      }
    };
    fetchPermissions();
  }, []);

  const handleSave = async () => {
    if (!user) {
      setError("No user data available.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateUserDetails(user.UserId, {
        ...user,
        status: user.status === "Inactive" ? "Inactive" : user.status,
      });

      if (response?.success) {
        console.log("Update response:", response);
        onUpdate?.();
        setIsEditing(false);
        setError("");
        handelRefresh();
        onSuccess?.();
      } else {
        setError("Failed to update user.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await deleteUser(user.UserId);
      if (response?.success) {
        onDelete?.();
        onClose();
      } else {
        setError("Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting user.");
    } finally {
      setLoading(false);
      handelRefresh();
    }
  };

  const handelRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
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
          {/* User Information Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                User Information
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
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={user.username}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev ? { ...prev, username: e.target.value } : undefined
                      )
                    }
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {user.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={user.email}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev ? { ...prev, email: e.target.value } : undefined
                      )
                    }
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-2">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                {isEditing ? (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={user.role}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              role: e.target.value as
                                | "Admin"
                                | "Manager"
                                | "Host",
                            }
                          : undefined
                      )
                    }
                    disabled={loading}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Host">Host</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "Manager"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission
                </label>
                {isEditing ? (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={user.PermissionId || ""}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              PermissionId: e.target.value
                                ? Number(e.target.value)
                                : null,
                            }
                          : undefined
                      )
                    }
                    disabled={loading}
                  >
                    <option value="">No Permission</option>
                    {permissions.map((permission) => (
                      <option
                        key={permission.PermissionId}
                        value={permission.PermissionId}
                      >
                        {permission.description}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {permissions.find(
                      (permission) =>
                        permission.PermissionId === user.PermissionId
                    )?.description || "No Permission Assigned"}
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
                  value={user.status}
                  onChange={(e) =>
                    setUser((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: e.target.value as "Active" | "Inactive",
                          }
                        : undefined
                    )
                  }
                  disabled={loading}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              ) : (
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
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
                  User ID
                </label>
                <p className="text-gray-600 text-sm">{user.UserId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission ID
                </label>
                <p className="text-gray-600 text-sm">
                  {user.PermissionId || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-gray-600 text-sm">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-600 text-sm">
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
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
                Delete User
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                Are you sure you want to delete this user? This action cannot be
                undone.
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

export default EditUserModal;
