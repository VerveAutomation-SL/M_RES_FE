"use client";
import { ChevronLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createUser } from "@/lib/api/userApi";
import { getAllResortsWithRestaurants } from "@/lib/api/restaurantsApi";
import { Resort} from "@/lib/types";
import toast from "react-hot-toast";

interface UserFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  selectedRole: string; // Role can be "Admin", "Manager", "Host"
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
    role: selectedRole,
    restaurantId: null as number | null,
    resortId: null as number | null,
    meal_type: "All", // Set a single default value
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Add error state
  const [currentStep, setCurrentStep] = useState(1);
  const [resorts, setResorts] = useState<Resort[]>([]); 

  useEffect(() => {
    // fetch all restaurant and resort
    const fetchResorts = async () => {
      setLoading(true);
      try {
        const response = await getAllResortsWithRestaurants();
        console.log("Fetched resorts:", response.data);
        setResorts(response.data);
      } catch (error) {
        console.error("Error fetching resorts:", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentStep === 2) {
      fetchResorts();
    }
  }, [currentStep]);

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

  const validateStep1 = () => {
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

  const validateStep2 = () => {
    if (!formData.username.trim()) {
      return "Username is required.";
    }
    if (formData.username.length < 3) {
      return "Username must be at least 3 characters long.";
    }
    if (!formData.email.trim()) {
      return "Email is required.";
    }
  };

  const handleNext = () => {
    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setCurrentStep(2);
  };

  const handleBack = () => {
    setError("");
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🚀 Submitting user form...");
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    console.log("🚀 Submitting user form with data:", formData);

    try {
      const validationError = validateStep2();
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
        restaurantId: formData.restaurantId ?? undefined,
        resortId: formData.resortId ?? undefined,
        meal_type: formData.meal_type as
          | "All"
          | "Breakfast"
          | "Lunch"
          | "Dinner",
        status: "Inactive" as "Active" | "Inactive",
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
          restaurantId: null,
          resortId: null,
          meal_type: "All",
        });
        setError("");
        setCurrentStep(1);
        toast.success(`User ${formData.username} created successfully!`);

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
      restaurantId: null,
      resortId: null,
      meal_type: "",
    });
    setError("");
    setCurrentStep(1);
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

  const handleMealTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, meal_type: e.target.value });
    if (error) setError("");
  };

  const filteredRestaurants = formData.resortId
    ? resorts.find(r => r.id === formData.resortId)?.restaurants || []
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {currentStep === 2 && (
                <button
                  onClick={handleBack}
                  className="mr-3 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors"
                  disabled={loading}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {currentStep === 1
                  ? `Add New ${selectedRole}`
                  : "Permission Details"}
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

          {currentStep === 1 && (
            <form className="space-y-4 sm:space-y-5">
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
                <input
                  value={formData.role}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
            </form>
          )}

          {currentStep === 2 && selectedRole !== "Admin" && (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Resort ID Field */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resort
              </label>
              <select
                value={formData.resortId || ""}
                onChange={e => {
                  const resortId = Number(e.target.value);
                  setFormData({
                    ...formData,
                    resortId,
                    restaurantId: null, // Reset restaurant when resort changes
                  });
                  if (error) setError("");
                }}
                className="w-full min-w-0 appearance-none px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base text-gray-700"
                disabled={loading}
                required
              >
                <option value="" disabled>
                  Please select a Resort
                </option>
                {resorts.map(resort => (
                  <option key={resort.id} value={resort.id}>
                    {resort.name}
                  </option>
                ))}
              </select>

              {/* Restaurant ID Field */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant
              </label>
              <select
                value={formData.restaurantId || ""}
                onChange={e =>
                  setFormData({
                    ...formData,
                    restaurantId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full min-w-0 appearance-none px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base text-gray-700"
                disabled={loading || !formData.resortId}
                required
              >
                <option value="" disabled>
                  Please select a Restaurant
                </option>
                {filteredRestaurants.map(restaurant => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.restaurantName}
                  </option>
                ))}
              </select>

              {/* Meal Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={formData.meal_type}
                  onChange={handleMealTypeChange}
                  className="w-full min-w-0 appearance-none px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base text-gray-700"
                  disabled={loading}
                  required
                >
                  <option value="All">All</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
            </form>
          )}
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

            {/* Decide if we should show Next or Submit */}
            {currentStep === 1 && selectedRole !== "Admin" ? (
              <button
                type="button"
                onClick={handleNext}
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
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !formData.meal_type}
                className="w-full sm:flex-1 px-4 py-3 sm:py-2 bg-[var(--primary)] text-white rounded-md hover:bg-amber-900 disabled:opacity-50 cursor-pointer transition-colors text-base sm:text-sm font-medium"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
