import React, { useEffect, useState } from "react";
import { Edit3, Save, Trash2, X, XCircle, Eye, EyeOff } from "lucide-react";
import { Resort, Restaurant, User } from "@/lib/types";
import {
  deleteUser,
  getUserDetails,
  updateUserDetails,
} from "@/lib/api/userApi";
import { restaurantApi} from "@/lib/api";
import toast from "react-hot-toast";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  pageRole?: "Admin" | "Manager" | "Host" ;
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
  const [mealTypes] = useState([
    "Breakfast",
    "Lunch",
    "Dinner",
    "All"
  ]);

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
    ? restaurants.filter(r => r.resort_id === selectedResortId)
    : [];

  useEffect(() => {
    if (isOpen && userId) {
      const fetchUser = async () => {
        try {
          const response = await getUserDetails(userId);
          console.log("Fetched user:", response.data);
          if (response?.success) {
            setUser(response.data);
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

  // Check if logedin user can edit selected user
  // const canEditUser = () => {
  //   if (!loginUser || !user) return false;

  //   // Admin can edit anyone
  //   if (loginUser.role === "Admin") return true;

  //   // Manager can edit Hosts status and permissions
  //   if (loginUser.role === "Manager" && user.role === "Host") return true;

  //   // User can only edit their own details
  //   return loginUser.UserId === user.UserId;
  // };

  // // Check if current user can edit specific fields
  // const canEditField = (field: string) => {
  //   if (!loginUser || !user) return false;

  //   // Admin can edit all fields
  //   if (loginUser.role === "Admin") return true;

  //   // Manager can only edit status and permission of hosts
  //   if (loginUser.role === "Manager" && user.role === "Host") {
  //     return field === "status" || field === "permission";
  //   }

  //   // User can edit their own details (but not status/permission/role)
  //   if (loginUser.UserId === user.UserId) {
  //     return !["status", "role"].includes(field);
  //   }

  //   return false;
  // };

  // // Check if current user can delete this user
  // const canDeleteUser = () => {
  //   if (!loginUser || !user) return false;
  //   // Only Admin can delete users
  //   return loginUser.role === "Admin";
  // };

  useEffect(()=>{
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
        setPasswordError(errors[0]); // Show first error
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }

    // Validate confirm password if it exists
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
        // Manager: must have at least one of resort, restaurant, or meal_type
        if (!user?.resortId && !user?.restaurantId ) {
          setError("Manager must be assigned to a resort or restaurant before activating.");
          toast.error("Manager must be assigned to a resort or restaurant before activating.");
          return;
        }
      } else if (pageRole === "Host") {
        // Host: must have all assigned
        if (!user?.resortId || !user?.restaurantId || !user?.meal_type) {
          setError("Host must be assigned to a resort, restaurant, and meal type before activating.");
          toast.error("Host must be assigned to a resort, restaurant, and meal type before activating.");
          return;
        }
      }
      // Admin: no assignment required
    }
    setUser((prev) => (prev ? { ...prev, status } : undefined));
    if (error.includes("assign")) setError("");
  };

  const handleSave = async () => {
    if (!user) {
      setError("No user data available.");
      return;
    }

    // Validate email before saving (only if user can edit email)
      if (!user.email.trim()) {
        setEmailError("Email is required");
        return;
      }

      const validation = validateEmail(user.email);
      if (!validation.isValid) {
        setEmailError(
          validation.message || "Please enter a valid email address"
        );
        if (validation.suggestion) {
          setEmailSuggestion(validation.suggestion);
        }
        return;
      }

    // Validate password if changing (only if user can change password)
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

    // Validate status change
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
        // Reset password fields
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
    (!!emailError || !user.email.trim()) ||
    (changePassword &&
      (!!passwordError ||
        !!confirmPasswordError ||
        !password.trim() ||
        !confirmPassword.trim()));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative transition-all duration-300 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl">
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
                  {(
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Permission message for non-editable users */}
            {/* {!canEditUser() && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-sm text-yellow-700 rounded-lg">
                {loginUser?.role === "Manager" && user.role === "Host"
                  ? "As a Manager, you can only edit Host users' status and permissions."
                  : "You can only edit your own user details or have admin privileges to edit other users."}
              </div>
            )} */}

            {/* Manager editing limitations message */}
            {/* {isEditing &&
              loginUser?.role === "Manager" &&
              user.role === "Host" && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-sm text-blue-700 rounded-lg">
                  As a Manager, you can only modify this Host&apos;s status and
                  permissions.
                </div>
              )} */}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username section */}
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

              {/* Email section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email{" "}
                  {(
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
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
                  <p className="text-gray-900 font-medium py-2">{user.email}</p>
                )}
              </div>

              {/* Role Section */}
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
                    {user.role === "Admin" && (
                      <option
                        value="Admin"
                        className="text-base sm:text-sm text-gray-700"
                      >
                        Admin
                      </option>
                    )}

                    {(user.role === "Manager" || user.role === "Host") && (
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

              {/* Permission section */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission
                </label>
                {isEditing && canEditField("permission") ? (
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
                    <option
                      value=""
                      disabled
                      className="text-base sm:text-sm text-gray-700"
                    >
                      Please select a Permission
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
                ) : (
                  <p className="text-gray-900 font-medium py-2">
                    {user.permission?.name || "No Permission"}
                  </p>
                )}
              </div> */}
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Password
                  </h4>
                  <button
                    type="button"
                    onClick={() => setChangePassword(!changePassword)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {changePassword
                      ? "Cancel Password Change"
                      : "Change Password"}
                  </button>
                </div>

                {changePassword && (
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
                          value={password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
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
                        Confirm Password <span className="text-red-500">*</span>
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

                    {/* Password Requirements */}
                    <div className="md:col-span-2">
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
                              /(?=.*\d)/.test(password) ? "text-green-600" : ""
                            }
                          >
                            • Contains number
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status section - Full Width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              {isEditing ? (
                <div>
                  <select
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  {user.status === "Active" && !user.resortId && !user.restaurantId && !user.meal_type && (
                    <p className="mt-1 text-sm text-amber-600">
                      ⚠️ User must have a resort, restaurant, or meal type assigned before activating.
                    </p>
                  )}
                </div>
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

            {/* Resort Select */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resort
              </label>
              {isEditing ? (
                <select
                  value={selectedResortId || ""}
                  onChange={e => {
                    const resortId = Number(e.target.value);
                    setSelectedResortId(resortId);
                    setUser(prev => prev ? { ...prev, resortId } : prev);
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Resort</option>
                  {resorts.map(resort => (
                    <option key={resort.id} value={resort.id}>
                      {resort.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 font-medium py-2">
                  {user.resortId
                    ? resorts.find(resort => resort.id === user.resortId)?.name
                    : "No Resort Assigned"}
                </p>
              )}
            </div>

            {/* Restaurant Select */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant
              </label>
              {isEditing ? (
                <select
                  value={user.restaurantId ?? ""}
                  onChange={e =>
                    setUser(prev => prev ? { ...prev, restaurantId: Number(e.target.value) } : prev)
                  }
                  required
                  disabled={!selectedResortId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Restaurant</option>
                  {filteredRestaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.restaurantName}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 font-medium py-2">
                  {user.restaurantId
                    ? restaurants.find(restaurant => restaurant.id === user.restaurantId)?.restaurantName
                    : "No Restaurant Assigned"}
                </p>
              )}
            </div>

            {/* Meal Type Select */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              {isEditing ? (
                <select
                  value={user.meal_type ?? ""}
                  onChange={e =>
                    setUser(prev => prev ? { ...prev, meal_type: e.target.value as "Breakfast" | "Lunch" | "Dinner"|"All" } : prev)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Meal Type</option>
                  {mealTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 font-medium py-2">
                  {user.meal_type || "No Meal Type Assigned"}
                </p>
              )}
            </div>

            {/* Edit Mode Actions */}
            {isEditing && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={loading || hasValidationErrors}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelEdit}
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
                  Last Updated
                </label>
                <p className="text-gray-600 text-sm">
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Added By
                </label>
                <p className="text-gray-600 text-sm">
                  {user.createdBy?.username || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Edited By
                </label>
                <p className="text-gray-600 text-sm">
                  {user.updatedBy?.username || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 sticky bottom-0 bg-white rounded-b-xl">
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
              <p className="mb-4 text-lg font-semibold text-gray-800">
                Are you sure you want to delete this user?
              </p>
              <div className="flex justify-center gap-4">
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
