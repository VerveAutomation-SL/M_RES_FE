"use client";

import Header from "@/components/layout/header";
import Button from "@/components/ui/button";
import {
  getUserDetails,
  updateUserDetails,
  verifyPassword,
} from "@/lib/api/userApi";
import { User } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import {
  Activity,
  BarChart3,
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Save,
  Settings,
  Shield,
  UserIcon,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, logout_user, isAuthenticated } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Form state - all passwords stored here
  const [form, setForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");

  console.log(user);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAuthenticated && user?.UserId) {
        try {
          const response = await getUserDetails(user.UserId);
          console.log("Fetched User Details:", response);
          setSelectedUser(response.data);
        } catch (err) {
          console.error("Error fetching user details:", err);
          setError("Failed to load user details. Please try again.");
        }
      }
    };
    fetchUserDetails();
  }, [isAuthenticated, user, refreshTrigger]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile Information", icon: UserIcon },
    { id: "activity", label: "Activity Log", icon: Activity },
    { id: "performance", label: "Performance", icon: BarChart3 },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handelRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

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

  // Handle new password change with validation
  const handleNewPasswordChange = (pwd: string) => {
    setForm({ ...form, newPassword: pwd });

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

    // Validate confirm password if it exists
    if (form.confirmNewPassword && pwd !== form.confirmNewPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (confirmPwd: string) => {
    setForm({ ...form, confirmNewPassword: confirmPwd });

    if (confirmPwd && form.newPassword !== confirmPwd) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setForm({
      username: selectedUser?.username || "",
      email: selectedUser?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    // Reset password change states
    setChangePassword(false);
    setPasswordError("");
    setConfirmPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);

    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    // Reset password change states
    setChangePassword(false);
    setPasswordError("");
    setConfirmPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);

    setMessage("");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setMessage("");
    setError("");

    // If password change is enabled, validate passwords
    if (changePassword) {
      // Check if current password is provided
      if (!form.currentPassword.trim()) {
        setError("Current password is required to change password");
        return;
      }

      // Validate new password
      if (!form.newPassword.trim()) {
        setPasswordError("New password is required");
        return;
      }

      const passwordValidationErrors = validatePassword(form.newPassword);
      if (passwordValidationErrors.length > 0) {
        setPasswordError(passwordValidationErrors[0]);
        return;
      }

      // Check if passwords match
      if (form.newPassword !== form.confirmNewPassword) {
        setConfirmPasswordError("Passwords do not match");
        return;
      }

      // Check if new password is different from current
      if (form.currentPassword === form.newPassword) {
        setPasswordError(
          "New password must be different from current password"
        );
        return;
      }
      try {
        console.log("Verifying current password...");
        const response = await verifyPassword(
          selectedUser?.UserId as number,
          form.currentPassword
        );

        if (!response.success) {
          setError("Current password is incorrect");
          return;
        }
        console.log("Current password verified successfully");
      } catch (verifyErr) {
        console.error("Password verification error:", verifyErr);
        setError("Failed to verify current password. Please try again.");
        return;
      }
    }

    try {
      // Prepare update data
      const updateData = {
        ...selectedUser,
        username: form.username,
        email: form.email,
        status: selectedUser?.status as "Active" | "Inactive",
        ...(changePassword && {
          password: form.newPassword, // Backend expects 'password' field for new password
        }),
      };

      console.log("Updating user with data:", updateData);

      const response = await updateUserDetails(
        selectedUser?.UserId as number,
        updateData
      );

      if (response?.success) {
        console.log("Update response:", response);

        // Reset editing states
        setEditing(false);
        setChangePassword(false);
        setPasswordError("");
        setConfirmPasswordError("");

        // Reset form
        setForm({
          username: "",
          email: "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });

        setMessage("Profile updated successfully!");
        handelRefresh();
      } else {
        setError("Failed to update user.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating.");
    }
  };

  return (
    <>
      {/* Header Section */}
      <Header
        title="Profile Management"
        subtitle="Manage your profile and account settings"
      >
        <div className="flex gap-3">
          {editing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex w-full p-2 justify-center items-center
                      sm:w-fit lg:px-4 lg:py-3 my-2 text-xs md:text-base text-black border-1 rounded-full bg-white hover:bg-[var(--background)] transition-all duration-200 cursor-pointer"
              >
                <X className="w-3 h-3 lg:w-4 lg:h-4 mr-2 rounded-full" />
                <span className="items-center text-nowrap">Cancel</span>
              </Button>
              <Button
                onClick={handleSave}
                className="flex w-full p-2 justify-center items-center
                      sm:w-fit lg:px-4 lg:py-3 my-2 text-xs md:text-base text-white border-2 rounded-full bg-green-600 hover:bg-white hover:text-[var(--primary)] transition-all duration-200 cursor-pointer"
              >
                <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-2 rounded-full" />
                <span className="items-center text-nowrap">Save Changes</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEdit}
              className="flex w-full p-2 justify-center items-center
                      sm:w-fit lg:px-4 lg:py-3 my-2 text-xs md:text-base text-white border-2 rounded-full bg-[var(--primary)] hover:bg-white hover:text-[var(--primary)] transition-all duration-200 cursor-pointer"
            >
              <Edit className="w-3 h-3 lg:w-4 lg:h-4 mr-2 rounded-full" />
              <span className="items-center text-nowrap">Edit Profile</span>
            </Button>
          )}
        </div>
      </Header>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Image
              src="/userPlaceholder.jpg"
              width={120}
              height={120}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              alt={selectedUser?.username || "User Avatar"}
              onError={(e) => {
                e.currentTarget.src = "/userPlaceholder.jpg";
              }}
            />
            <div
              className={`absolute -bottom-2 -right-2 w-6 h-6 border-4 border-white rounded-full ${
                selectedUser?.status === "Active"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedUser?.username}
                </h1>
                <p className="text-lg text-gray-600 mb-3">
                  {selectedUser?.role} • User ID: {selectedUser?.UserId}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>
                      Restaurant ID:{" "}
                      {selectedUser?.restaurantId || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      Resort ID: {selectedUser?.resortId || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined{" "}
                      {selectedUser?.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-full font-medium text-sm ${
                  selectedUser?.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedUser?.status}
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {selectedUser?.role} with meal access: {selectedUser?.meal_type}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-t-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
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
      <div className="bg-white rounded-b-xl shadow-sm p-8">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

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
                    <p className="text-gray-900 font-medium">
                      {selectedUser?.UserId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Username
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {selectedUser?.username}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{selectedUser?.email}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Role
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                      selectedUser?.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : selectedUser?.role === "Manager"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedUser?.role}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser?.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser?.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Created At
                    </label>
                    <p className="text-gray-900">
                      {selectedUser?.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {selectedUser?.updatedAt
                        ? new Date(selectedUser.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Change Password Section - Only show when editing */}
              {editing && (
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
                          // Reset password fields when disabling
                          setForm({
                            ...form,
                            currentPassword: "",
                            newPassword: "",
                            confirmNewPassword: "",
                          });
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
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          key={`password-${editing}`}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          name="currentPassword"
                          type="password"
                          placeholder="Enter current password"
                          value={form.currentPassword}
                          onChange={handleChange}
                        />
                      </div>

                      {/* New Password Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10 ${
                                passwordError
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              }`}
                              value={form.newPassword}
                              onChange={(e) =>
                                handleNewPasswordChange(e.target.value)
                              }
                              placeholder="Enter new password"
                              autoComplete="new-password"
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
                              value={form.confirmNewPassword}
                              onChange={(e) =>
                                handleConfirmPasswordChange(e.target.value)
                              }
                              placeholder="Confirm new password"
                              autoComplete="new-password"
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

                        {/* Password Requirements */}
                        <div className="md:col-span-2">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Password Requirements:
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li
                                className={
                                  form.newPassword.length >= 8
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                • At least 8 characters long
                              </li>
                              <li
                                className={
                                  /(?=.*[a-z])/.test(form.newPassword)
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                • Contains lowercase letter
                              </li>
                              <li
                                className={
                                  /(?=.*[A-Z])/.test(form.newPassword)
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                • Contains uppercase letter
                              </li>
                              <li
                                className={
                                  /(?=.*\d)/.test(form.newPassword)
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                • Contains number
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Assignment Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Assignment Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Resort ID
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedUser?.resortId || "Not assigned"}
                  </p>
                  {selectedUser?.resort?.name && (
                    <p className="text-sm text-gray-500">
                      {selectedUser.resort.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Restaurant ID
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedUser?.restaurantId || "Not assigned"}
                  </p>
                  {selectedUser?.restaurant?.restaurantName && (
                    <p className="text-sm text-gray-500">
                      {selectedUser.restaurant.restaurantName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Meal Type Access
                  </label>
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedUser?.meal_type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Activity Log
            </h3>
            <p className="text-gray-500">
              Activity log functionality coming soon.
            </p>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Performance
            </h3>
            <p className="text-gray-500">Performance metrics coming soon.</p>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Permissions
            </h3>
            <p className="text-gray-500">Permission management coming soon.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-500">Settings panel coming soon.</p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="my-6 text-center">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          onClick={logout_user}
        >
          Log out
        </button>
      </div>
    </>
  );
}
