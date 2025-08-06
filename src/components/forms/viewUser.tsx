import React, { useEffect, useState } from "react";
import {
  Edit3,
  Save,
  Trash2,
  X,
  XCircle,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Calendar,
  UserIcon,
  UtensilsCrossed,
  Shield,
} from "lucide-react";
import { Resort, Restaurant, User } from "@/lib/types";
import {
  deleteUser,
  getUserDetails,
  updateUserDetails,
} from "@/lib/api/userApi";
import { restaurantApi } from "@/lib/api";
import toast, { ToastBar } from "react-hot-toast";
import Image from "next/image";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  pageRole?: "Admin" | "Manager" | "Host";
}

const EditUserModal = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
  onUpdate,
  onDelete,
  pageRole,
}: EditUserModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [emailSuggestion, setEmailSuggestion] = useState("");
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [mealTypes] = useState(["Breakfast", "Lunch", "Dinner", "All"]);
  const [activeTab, setActiveTab] = useState("profile");

  // Password related states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [changePassword, setChangePassword] = useState(false);

  const [selectedResortId, setSelectedResortId] = useState<number | null>(null);

  const filteredRestaurants = selectedResortId
    ? restaurants.filter((r) => r.resort_id === selectedResortId)
    : [];

  const tabs = [
    { id: "profile", label: "Profile Information", icon: UserIcon },
    { id: "assignments", label: "Assignments", icon: MapPin },
  ];

  useEffect(() => {
    if (isOpen && userId) {
      const fetchUser = async () => {
        try {
          const response = await getUserDetails(userId);
          console.log("Fetched user:", response.data);
          if (response?.success) {
            setUser(response.data);
            setSelectedResortId(response.data.resortId);
            setError("");
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
    const fetchResorts = async () => {
      const res = await restaurantApi.getAllResorts();
      if (res.success) {
        setResorts(res.data);
      }
    };
    const fetchRestaurants = async () => {
      const res = await restaurantApi.getAllRestaurants();
      if (res.success) {
        setRestaurants(res.data);
      }
    };
    fetchResorts();
    fetchRestaurants();
  }, []);

  // Password validation function
  const validatePassword = (pwd: string) => {
    const errors = [];
    if (pwd.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(pwd)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  // Email validation function with domain checking
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email format" };
    }

    const domain = email.toLowerCase().split("@")[1];

    const strictProviders = {
      gmail: "gmail.com",
      yahoo: "yahoo.com",
      hotmail: "hotmail.com",
      outlook: "outlook.com",
      live: "live.com",
      icloud: "icloud.com",
      aol: "aol.com",
      proton: "protonmail.com",
      protonmail: "protonmail.com",
    };

    for (const [provider, correctDomain] of Object.entries(strictProviders)) {
      if (domain.includes(provider)) {
        if (domain !== correctDomain) {
          return {
            isValid: false,
            suggestion: correctDomain,
            isStrictProvider: true,
            providerName: provider.charAt(0).toUpperCase() + provider.slice(1),
            message: `Did you mean ${email.split("@")[0]}@${correctDomain}?`,
          };
        }
      }
    }

    const otherTypos: Record<string, string> = {
      "msn.co": "msn.com",
      "comcast.co": "comcast.net",
      "verizon.co": "verizon.net",
      "att.co": "att.net",
      "sbcglobal.co": "sbcglobal.net",
    };

    if (otherTypos[domain]) {
      return {
        isValid: false,
        suggestion: otherTypos[domain],
        message: `Did you mean ${email.split("@")[0]}@${otherTypos[domain]}?`,
      };
    }

    return { isValid: true };
  };

  // Handle email change with validation
  const handleEmailChange = (email: string) => {
    setUser((prev) => (prev ? { ...prev, email } : undefined));

    if (emailError) {
      setEmailError("");
    }
    if (emailSuggestion) {
      setEmailSuggestion("");
    }

    if (email.trim()) {
      const validation = validateEmail(email);
      if (!validation.isValid) {
        setEmailError(
          validation.message || "Please enter a valid email address"
        );
        if (validation.suggestion) {
          setEmailSuggestion(validation.suggestion);
        }
      }
    }
  };

  // Handle password change with validation
  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);

    if (pwd.trim()) {
      const errors = validatePassword(pwd);
      if (errors.length > 0) {
        setPasswordError(errors[0]);
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }

    if (confirmPassword && pwd !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (confirmPwd: string) => {
    setConfirmPassword(confirmPwd);

    if (confirmPwd && password !== confirmPwd) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Handle accepting email suggestion
  const handleAcceptSuggestion = () => {
    if (emailSuggestion && user) {
      const username = user.email.split("@")[0];
      const suggestedEmail = `${username}@${emailSuggestion}`;
      setUser((prev) =>
        prev ? { ...prev, email: suggestedEmail } : undefined
      );
      setEmailError("");
      setEmailSuggestion("");
    }
  };

  // Handle status change with permission validation
  const handleStatusChange = (status: "Active" | "Inactive") => {
    if (status === "Active") {
      if (pageRole === "Manager") {
        if (!user?.resortId && !user?.restaurantId) {
          setError(
            "Manager must be assigned to a resort or restaurant before activating."
          );
          toast.error(
            "Manager must be assigned to a resort or restaurant before activating."
          );
          return;
        }
      } else if (pageRole === "Host") {
        if (!user?.resortId || !user?.restaurantId || !user?.meal_type) {
          setError(
            "Host must be assigned to a resort, restaurant, and meal type before activating."
          );
          toast.error(
            "Host must be assigned to a resort, restaurant, and meal type before activating."
          );
          return;
        }
      }
    }
    setUser((prev) => (prev ? { ...prev, status } : undefined));
    if (error.includes("assign")) setError("");
  };

  const handleSave = async () => {
    if (!user) {
      setError("No user data available.");
      return;
    }

    if (!user.email.trim()) {
      setEmailError("Email is required");
      return;
    }

    const validation = validateEmail(user.email);
    if (!validation.isValid) {
      setEmailError(validation.message || "Please enter a valid email address");
      if (validation.suggestion) {
        setEmailSuggestion(validation.suggestion);
      }
      return;
    }

    if (changePassword) {
      if (!password.trim()) {
        setPasswordError("Password is required when changing password");
        return;
      }

      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        setPasswordError(passwordErrors[0]);
        return;
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        return;
      }
    }

    if (
      user.status === "Active" &&
      !user.meal_type &&
      !user.resortId &&
      !user.restaurantId
    ) {
      setError(
        "User must have a permission assigned before activating account"
      );
      return;
    }

    setEmailError("");
    setEmailSuggestion("");
    setPasswordError("");
    setConfirmPasswordError("");

    setLoading(true);
    try {
      const updateData = {
        ...user,
        status: user.status as "Active" | "Inactive",
        ...(changePassword && { password }),
      };

      console.log("Updating user with data:", updateData);

      const response = await updateUserDetails(user.UserId, updateData);

      if (response?.success) {
        console.log("Update response:", response);
        onUpdate?.();
        setIsEditing(false);
        setError("");
        handelRefresh();
        onSuccess?.();
        setChangePassword(false);
        setPassword("");
        setConfirmPassword("");
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
        toast.success("User deleted successfully");
        onDelete?.();
        onClose();
        onSuccess?.();
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEmailError("");
    setEmailSuggestion("");
    setPasswordError("");
    setConfirmPasswordError("");
    setChangePassword(false);
    setPassword("");
    setConfirmPassword("");
  };

  if (!isOpen || !user) return null;

  const hasValidationErrors =
    !!emailError ||
    !user.email.trim() ||
    (changePassword &&
      (!!passwordError ||
        !!confirmPasswordError ||
        !password.trim() ||
        !confirmPassword.trim()));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl relative transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header Section - Similar to ProfilePage */}
        <div className="bg-white rounded-t-xl shadow-sm p-8 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Image
                  src="/userPlaceholder.jpg"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  alt={user.username || "User Avatar"}
                  onError={(e) => {
                    e.currentTarget.src = "/userPlaceholder.jpg";
                  }}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 border-3 border-white rounded-full ${
                    user.status === "Active" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {user.username}
                    </h1>
                    <p className="text-base text-gray-600 mb-2">
                      {user.role} • User ID: {user.UserId}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <UtensilsCrossed className="w-3 h-3" />
                        <span>
                          Restaurant: {user.restaurantId || "Not assigned"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>Resort: {user.resortId || "Not assigned"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Joined{" "}
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full font-medium text-sm ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  {user.role} with meal access:{" "}
                  {user.meal_type || "Not assigned"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    disabled={loading}
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || hasValidationErrors}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-sm p-6">
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  User Information
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        User ID
                      </label>
                      <p className="text-gray-900 font-medium">{user.UserId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Username
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={user.username}
                          onChange={(e) =>
                            setUser((prev) =>
                              prev
                                ? { ...prev, username: e.target.value }
                                : undefined
                            )
                          }
                          disabled={loading}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {user.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Email Address{" "}
                      {isEditing && <span className="text-red-500">*</span>}
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="email"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                            emailError
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                          value={user.email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          disabled={loading}
                          placeholder="Enter email address"
                        />
                        {emailError && (
                          <div className="mt-1">
                            <p className="text-sm text-red-600">{emailError}</p>
                            {emailSuggestion && (
                              <button
                                type="button"
                                onClick={handleAcceptSuggestion}
                                className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none"
                              >
                                Use suggested email: {user.email.split("@")[0]}@
                                {emailSuggestion}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Role
                    </label>
                    {isEditing ? (
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        {user.role === "Admin" && (
                          <option value="Admin">Admin</option>
                        )}
                        {(user.role === "Manager" || user.role === "Host") && (
                          <>
                            <option value="" disabled>
                              Please select a role
                            </option>
                            <option value="Manager">Manager</option>
                            <option value="Host">Host</option>
                          </>
                        )}
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
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <div>
                        <select
                          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={user.status}
                          onChange={(e) =>
                            handleStatusChange(
                              e.target.value as "Active" | "Inactive"
                            )
                          }
                          disabled={loading}
                        >
                          <option value="Inactive">Inactive</option>
                          <option value="Active">Active</option>
                        </select>
                        {user.status === "Active" &&
                          !user.resortId &&
                          !user.restaurantId &&
                          !user.meal_type && (
                            <p className="mt-1 text-sm text-amber-600">
                              ⚠️ User must have assignments before activating.
                            </p>
                          )}
                      </div>
                    ) : (
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Created At
                      </label>
                      <p className="text-gray-900">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Last Updated
                      </label>
                      <p className="text-gray-900">
                        {user.updatedAt
                          ? new Date(user.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Change Password Section */}
                {isEditing && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Change Password
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setChangePassword(!changePassword);
                          if (changePassword) {
                            setPassword("");
                            setConfirmPassword("");
                            setPasswordError("");
                            setConfirmPasswordError("");
                          }
                        }}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          changePassword
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        {changePassword
                          ? "Cancel Password Change"
                          : "Change Password"}
                      </button>
                    </div>

                    {changePassword && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10 ${
                                  passwordError
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                value={password}
                                onChange={(e) =>
                                  handlePasswordChange(e.target.value)
                                }
                                disabled={loading}
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {passwordError && (
                              <p className="mt-1 text-sm text-red-600">
                                {passwordError}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm Password{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10 ${
                                  confirmPasswordError
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                value={confirmPassword}
                                onChange={(e) =>
                                  handleConfirmPasswordChange(e.target.value)
                                }
                                disabled={loading}
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {confirmPasswordError && (
                              <p className="mt-1 text-sm text-red-600">
                                {confirmPasswordError}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Password Requirements:
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li
                              className={
                                password.length >= 8 ? "text-green-600" : ""
                              }
                            >
                              • At least 8 characters long
                            </li>
                            <li
                              className={
                                /(?=.*[a-z])/.test(password)
                                  ? "text-green-600"
                                  : ""
                              }
                            >
                              • Contains lowercase letter
                            </li>
                            <li
                              className={
                                /(?=.*[A-Z])/.test(password)
                                  ? "text-green-600"
                                  : ""
                              }
                            >
                              • Contains uppercase letter
                            </li>
                            <li
                              className={
                                /(?=.*\d)/.test(password)
                                  ? "text-green-600"
                                  : ""
                              }
                            >
                              • Contains number
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* System Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  System Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Added By
                    </label>
                    <p className="text-gray-900 font-medium">
                      {user.createdBy?.username || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Last Edited By
                    </label>
                    <p className="text-gray-900 font-medium">
                      {user.updatedBy?.username || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {user.updatedAt
                        ? new Date(user.updatedAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Assignment Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Resort Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Resort Assignment
                    </label>
                    {isEditing ? (
                      <select
                        value={selectedResortId || ""}
                        onChange={(e) => {
                          const resortId = Number(e.target.value);
                          setSelectedResortId(resortId);
                          setUser((prev) =>
                            prev ? { ...prev, resortId } : prev
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Resort</option>
                        {resorts.map((resort) => (
                          <option key={resort.id} value={resort.id}>
                            {resort.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        <p className="text-gray-900 font-medium">
                          {user.resortId
                            ? resorts.find(
                                (resort) => resort.id === user.resortId
                              )?.name
                            : "No Resort Assigned"}
                        </p>
                        {user.resortId && (
                          <p className="text-sm text-gray-500">
                            Resort ID: {user.resortId}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Restaurant Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Restaurant Assignment
                    </label>
                    {isEditing ? (
                      <select
                        value={user.restaurantId ?? ""}
                        onChange={(e) =>
                          setUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  restaurantId: Number(e.target.value),
                                }
                              : prev
                          )
                        }
                        disabled={!selectedResortId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Restaurant</option>
                        {filteredRestaurants.map((restaurant) => (
                          <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.restaurantName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        <p className="text-gray-900 font-medium">
                          {user.restaurantId
                            ? restaurants.find(
                                (restaurant) =>
                                  restaurant.id === user.restaurantId
                              )?.restaurantName
                            : "No Restaurant Assigned"}
                        </p>
                        {user.restaurantId && (
                          <p className="text-sm text-gray-500">
                            Restaurant ID: {user.restaurantId}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Meal Type Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Meal Type Access
                    </label>
                    {isEditing ? (
                      <select
                        value={user.meal_type ?? ""}
                        onChange={(e) =>
                          setUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  meal_type: e.target.value as
                                    | "Breakfast"
                                    | "Lunch"
                                    | "Dinner"
                                    | "All",
                                }
                              : prev
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Meal Type</option>
                        {mealTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {user.meal_type || "No Meal Type Assigned"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Assignment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Resort:</span>
                      <span
                        className={`text-sm font-medium ${
                          user.resortId ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.resortId ? "✓ Assigned" : "✗ Not Assigned"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Restaurant:</span>
                      <span
                        className={`text-sm font-medium ${
                          user.restaurantId ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.restaurantId ? "✓ Assigned" : "✗ Not Assigned"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Meal Type:</span>
                      <span
                        className={`text-sm font-medium ${
                          user.meal_type ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.meal_type ? "✓ Assigned" : "✗ Not Assigned"}
                      </span>
                    </div>
                  </div>

                  {user.status === "Active" &&
                    user.role !== "Admin" &&
                    (!user.resortId ||
                      !user.restaurantId ||
                      !user.meal_type) && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-700">
                          ⚠️ This user is active but missing some assignments.
                          Consider completing all assignments for optimal
                          functionality.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete User Account
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{user.username}</strong>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
                  onClick={() => setConfirmDelete(false)}
                  disabled={loading}
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
