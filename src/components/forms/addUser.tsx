"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Permission } from "@/lib/types";
import { createUser, getAllPermissions } from "@/lib/api/userApi";

interface UserFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  role: string; // Role can be "Admin", "Manager", or "Host"
}

export default function UserForm({
  isOpen = false,
  onClose,
  onSuccess,
  role,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    PermissionId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Add error state
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getAllPermissions();
        console.log("📊 Permissions fetched:", response.data);
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setError("Failed to load permissions. Please refresh and try again.");
      }
    };
    if (!role.includes("Admin")) fetchPermissions();
  }, [role]);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      return "Username is required.";
    }
    if (formData.username.length < 3) {
      return "Username must be at least 3 characters long.";
    }
    if (!formData.email.trim()) {
      return "Email is required.";
    }
    if (!validateEmail(formData.email)) {
      return "Please provide a valid email address.";
    }
    if (!formData.password) {
      return "Password is required.";
    }
    if (!validatePassword(formData.password)) {
      return "Password must be at least 8 characters with uppercase, lowercase, and number.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    if (!formData.role) {
      return "Role is required.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🚀 Submitting user form...");
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    console.log("🚀 Submitting user form with data:", formData);

    try {
      // Validate required fields
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      console.log("👤 form data:", formData);

      const Payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role as "Admin" | "Manager" | "Host",
        PermissionId: formData.PermissionId
          ? parseInt(formData.PermissionId)
          : null,
        status: "Active" as "Active" | "Inactive",
      };

      const response = await createUser(Payload);

      console.log("📊 User creation response:", response);

      if (response && response.success) {
        // Success - clear form and close modal
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          PermissionId: "",
        });
        setError("");

        alert("User created successfully!");

        // Call callbacks
        onSuccess?.();
        onClose?.();
      } else {
        // Handle API error response
        const errorMessage =
          response?.message || "Failed to create user. Please try again.";
        setError(errorMessage);
        console.error("❌ User creation failed:", response);
      }
    } catch (error: unknown) {
      console.error("💥 Error submitting user form:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form and error when canceling
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      PermissionId: "",
    });
    setError("");
    onClose?.();
  };

  // Clear error when user starts typing
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, username: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, confirmPassword: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, role: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, PermissionId: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-x-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold">Add New {role}</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username*
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={handleUsernameChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-transparent ${
                error && error.toLowerCase().includes("username")
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="e.g., john_doe"
              disabled={loading}
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={handleEmailChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-transparent ${
                error && error.toLowerCase().includes("email")
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="e.g., john@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password*
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-transparent ${
                error && error.toLowerCase().includes("password")
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
              disabled={loading}
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password*
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-transparent ${
                error && error.toLowerCase().includes("password")
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="Re-enter your password"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role*
            </label>
            <select
              value={formData.role}
              onChange={handleRoleChange}
              className={`w-full h-11 px-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-700 truncate ${
                error && error.toLowerCase().includes("role")
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              disabled={loading}
              required
            >
              {role.includes("Admin") && (
                <option
                  value="Admin"
                  className="text-sm text-gray-700 truncate"
                  disabled={role.includes("Admin") ? false : true}
                >
                  Admin
                </option>
              )}
              {role.includes("User") && (
                <>
                  <option
                    value=""
                    disabled
                    className="text-sm text-gray-700 truncate"
                  >
                    Please select a role
                  </option>
                  <option
                    value="Manager"
                    className="text-sm text-gray-700 truncate"
                    disabled={role.includes("User") ? false : true}
                  >
                    Manager
                  </option>
                  <option
                    value="Host"
                    className="text-sm text-gray-700 truncate"
                    disabled={role.includes("User") ? false : true}
                  >
                    Host
                  </option>
                </>
              )}
            </select>
          </div>

          {!role.includes("Admin") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permission (Optional)
              </label>
              <select
                value={formData.PermissionId}
                onChange={handlePermissionChange}
                className={`w-full h-11 px-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-700 ${
                  error && error.toLowerCase().includes("permission")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                disabled={loading}
              >
                <option className="text-sm py-2 text-gray-700" value="">
                  No specific permission
                </option>
                {permissions.map((permission) => (
                  <option
                    key={permission.PermissionId}
                    value={permission.PermissionId}
                    className="text-sm py-2 text-gray-700"
                  >
                    {permission.PermissionId}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-3 pt-12">
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
                loading ||
                !formData.username.trim() ||
                !formData.email.trim() ||
                !formData.password ||
                !formData.confirmPassword ||
                !formData.role
              }
              className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-amber-900 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
