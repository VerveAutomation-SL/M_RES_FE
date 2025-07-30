"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Permission } from "@/lib/types";
import {
  createUser,
  getAdminPermissions,
  getAllUserPermissions,
} from "@/lib/api/userApi";

interface UserFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  selectedRole: string; // Role can be "Admin", "User"
}

export default function UserForm({
  isOpen = false,
  onClose,
  onSuccess,
  selectedRole,
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
    const fetchAllUserPermissions = async () => {
      try {
        const response = await getAllUserPermissions();
        console.log("📊 Permissions fetched:", response.data);
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setError("Failed to load permissions. Please refresh and try again.");
      }
    };

    const fetchAdminPermissions = async () => {
      try {
        const response = await getAdminPermissions();
        console.log("📊 Admin Permissions fetched:", response.data);
        setPermissions(response.data);
        setFormData((prev) => ({
          ...prev,
          PermissionId: String(response.data.at(0)?.PermissionId),
          role: "Admin",
        }));
      } catch (error) {
        console.error("Error fetching Admin permissions:", error);
        setError(
          "Failed to load Admin permissions. Please refresh and try again."
        );
      }
    };

    if (selectedRole === "Admin") {
      fetchAdminPermissions();
    } else {
      fetchAllUserPermissions();
    }
  }, [selectedRole]);

  // Enhanced email validation function with strict checking for all major providers
  const validateEmail = (email: string) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Extract domain from email
    const domain = email.toLowerCase().split("@")[1];

    // Strict validation for major email providers - only accept exact domains
    const strictProviders = {
      // Gmail variations - only accept gmail.com
      gmail: "gmail.com",
      // Yahoo variations - only accept yahoo.com
      yahoo: "yahoo.com",
      // Hotmail variations - only accept hotmail.com
      hotmail: "hotmail.com",
      // Outlook variations - only accept outlook.com
      outlook: "outlook.com",
      // Live variations - only accept live.com
      live: "live.com",
      // iCloud variations - only accept icloud.com
      icloud: "icloud.com",
      // AOL variations - only accept aol.com
      aol: "aol.com",
      // Protonmail variations - only accept protonmail.com
      proton: "protonmail.com",
      protonmail: "protonmail.com",
    };

    // Check each provider for strict validation
    for (const [provider, correctDomain] of Object.entries(strictProviders)) {
      if (domain.includes(provider)) {
        if (domain !== correctDomain) {
          return {
            isValid: false,
            suggestion: correctDomain,
            isStrictProvider: true,
            providerName: provider.charAt(0).toUpperCase() + provider.slice(1),
          };
        }
      }
    }

    // Additional common domain typos for less common providers
    const otherTypos: Record<string, string> = {
      "msn.co": "msn.com",
      "comcast.co": "comcast.net",
      "verizon.co": "verizon.net",
      "att.co": "att.net",
      "sbcglobal.co": "sbcglobal.net",
    };

    // Check if domain is a typo for other providers
    if (otherTypos[domain]) {
      return { isValid: false, suggestion: otherTypos[domain] };
    }

    return { isValid: true };
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

    const emailValidation = validateEmail(formData.email);
    if (
      emailValidation === false ||
      (typeof emailValidation === "object" && !emailValidation.isValid)
    ) {
      if (typeof emailValidation === "object" && emailValidation.suggestion) {
        if (emailValidation.isStrictProvider) {
          return `Invalid ${
            emailValidation.providerName
          } domain. Use exactly "@${
            emailValidation.suggestion
          }" - did you mean "${formData.email.split("@")[0]}@${
            emailValidation.suggestion
          }"?`;
        }
        return `Invalid email domain. Did you mean "${
          formData.email.split("@")[0]
        }@${emailValidation.suggestion}"?`;
      }
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
      }
    } catch (error: any) {
      if (error?.message?.message) {
        // AppError with nested message structure
        setError(error.message.message);
      } else if (error?.message) {
        // Standard Error or AppError with direct message
        setError(error.message);
      } else if (typeof error === "string") {
        // String error
        setError(error);
      } else {
        // Unknown error type
        setError("An unexpected error occurred.");
      }
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
    console.log("🚀 Role changed:", e.target.value);
    if (error) setError(""); // Clear error when user types
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("🚀 Permission changed:", e.target.value);
    setFormData({ ...formData, PermissionId: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Add New {selectedRole}
              </h3>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
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
                  <p className="text-sm text-red-600 break-words">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username*
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={handleUsernameChange}
                className={`w-full px-3 py-3 sm:py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base sm:text-sm ${
                  error && error.toString().toLowerCase().includes("username")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="e.g., john_doe"
                disabled={loading}
                minLength={3}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email*
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={handleEmailChange}
                className={`w-full px-3 py-3 sm:py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base sm:text-sm ${
                  error && error.toString().toLowerCase().includes("email")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="e.g., john@example.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password*
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-3 sm:py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base sm:text-sm ${
                  error && error.toString().toLowerCase().includes("password")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
                disabled={loading}
                minLength={8}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password*
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-3 py-3 sm:py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base sm:text-sm ${
                  error && error.toString().toLowerCase().includes("password")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Re-enter your password"
                disabled={loading}
              />
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role*
              </label>
              <select
                value={formData.role}
                onChange={handleRoleChange}
                className={`w-full min-w-0 appearance-none px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base text-gray-700 ${
                  error && error.toString().toLowerCase().includes("role")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                disabled={loading}
                required
              >
                {selectedRole === "Admin" && (
                  <option
                    value="Admin"
                    className="text-base sm:text-sm text-gray-700"
                  >
                    Admin
                  </option>
                )}

                {selectedRole === "User" && (
                  <>
                    <option
                      value=""
                      disabled
                      className="text-base sm:text-sm text-gray-700"
                    >
                      Please select a role
                    </option>
                    <option
                      value="Manager"
                      className="text-base sm:text-sm text-gray-700"
                    >
                      Manager
                    </option>
                    <option
                      value="Host"
                      className="text-base sm:text-sm text-gray-700"
                    >
                      Host
                    </option>
                  </>
                )}
              </select>
            </div>

            {/* Permission Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permission
              </label>
              <select
                value={formData.PermissionId}
                onChange={handlePermissionChange}
                className={`w-full min-w-0 appearance-none px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base text-gray-700 ${
                  error && error.toString().toLowerCase().includes("permission")
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
                    className="text-base sm:text-sm py-2 text-gray-700"
                  >
                    {permission.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer transition-colors text-base sm:text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.username ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                !formData.role
              }
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 bg-[var(--primary)] text-white rounded-md hover:bg-amber-900 disabled:opacity-50 cursor-pointer transition-colors text-base sm:text-sm font-medium"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
