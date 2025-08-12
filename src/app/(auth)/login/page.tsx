"use client";

import Button from "@/components/ui/button";
import { Eye, EyeOff, Key, User, X } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoginFormData } from "@/lib/types";
import AuthInput from "@/components/ui/input";
import { login, tokenRefresh } from "@/lib/api/authApi";
import { AppError } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const Page = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    userName: "",
    password: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { autoLogin, login_user } = useAuthStore.getState();

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await tokenRefresh();
        console.log("Authentication check response:", response);
        if (response.success) {
          console.log(
            "User is already authenticated, redirecting to dashboard."
          );
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <p className="text-sm text-center font-medium text-gray-900 dark:text-white">
                    Already logged in, redirecting to dashboard as{" "}
                    {response.user.username}.
                  </p>
                </div>
              </div>
            ),
            {
              position: "top-center",
              duration: 5000,
            }
          );
          autoLogin();
          router.push("/dashboard");
        }
      } catch (err: unknown) {
        if (err instanceof AppError) {
          console.log(err.message);
        } else {
          console.log(err);
        }
      }
    };
    checkAuth();
  }, [autoLogin, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(validateForm);
    if (Object.keys(errors).length > 0) {
      console.error("Form validation failed:", errors);
      return;
    }
    setLoading(true);
    try {
      const response = await login(formData);

      console.log("Login response:", response);
      if (response.data.success) {
        login_user(response.data.accessToken);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof AppError) {
        console.error(err.message);
        setLoginError(err.message);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): Record<string, string> => {
    const newError: Record<string, string> = {};

    if (!formData.userName.trim()) newError.name = "UserName is required";
    if (formData.password.length < 8)
      newError.password = "Password must be at least 8 characters long";

    return newError;
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Brand Section */}
        <div className="flex flex-1 md:flex-3 bg-[var(--primary)] text-white items-center justify-center">
          {/* Moved logo to top left of brand section */}
          <div className="absolute top-2 left-2">
            <Image
              src="/Guestiefy logo trans.png"
              alt="Gusteify Brand Logo"
              width={128}
              height={128}
              className="w-auto"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl tracking-wider my-2 text-center transition-all duration-300">
              The Residence
            </h1>
            <h3 className="text-2xl md:text-3xl lg:text-4xl tracking-wider mb-8 text-center">
              Maldives
            </h3>
            <p className="text-center text-sm md:text-base lg:text-lg">
              by Cenizaro
            </p>
          </div>
        </div>
        {/* Right Side - Login Form */}
        <div className="flex flex-col flex-1/2 md:flex-4 bg-[var(--background)] items-center justify-center px-4 py-12 md:py-0">
          <div className="absolute bottom-6 right-6">
            <p className="text-gray-600 text-sm md:text-base font-light">
              Powered by{" "}
              <Link
                href="https://verveautomation.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--primary)] transition-colors duration-200 underline"
              >
                Verve Automation
              </Link>
            </p>
          </div>
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-wide text-[var(--highlight-text)] mb-2">
                WELCOME
              </h3>
              <p className="text-base sm:text-lg text-gray-600">
                Please login to continue
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-center rounded-md text-sm sm:text-base gap-2 flex items-center">
                <X
                  className="inline-block h-5 w-5 mr-2 cursor-pointer"
                  onClick={() => {
                    setLoginError(null);
                    formData.userName = "";
                    formData.password = "";
                  }}
                />
                {loginError}
              </div>
            )}

            {/* Login Form */}
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Username */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#8B6F47] opacity-70" />
                </div>
                <AuthInput
                  type="text"
                  name="userName"
                  placeholder="Enter User Name"
                  value={formData.userName}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-[#D4C4A8] border-none rounded-full text-[#8B6F47] placeholder:text-[#8B6F47] placeholder:opacity-70 text-sm sm:text-base transition-all duration-300"
                  autoComplete="loginUser"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 mt-4 flex items-start pointer-events-none">
                  <Key className="h-5 w-5 text-[#8B6F47] opacity-70" />
                </div>
                <AuthInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-3 sm:py-4 bg-[#D4C4A8] border-none rounded-full text-[#8B6F47] placeholder:text-[#8B6F47] placeholder:opacity-70 text-sm sm:text-base transition-all duration-300"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 mt-5 flex items-start text-[#8B6F47] opacity-70"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <div className="text-right mt-2 sm:mt-3 mr-2">
                  <a
                    href="/forgot-password"
                    className="text-[#8B6F47] text-xs sm:text-sm font-medium hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row pt-4 sm:pt-6 gap-4 sm:gap-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 bg-[#6B4E3D] hover:bg-[#5A3F2E] text-white font-medium tracking-wide rounded-full transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "SIGNING IN..." : "SIGN IN "}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
