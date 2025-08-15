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
        {/* Left Side - Brand Section - Adjusted for mobile */}
        <div className="flex flex-1 md:flex-3 bg-[var(--primary)] text-white items-center justify-center py-6 md:py-10 relative overflow-hidden h-[40vh] md:h-auto">
          {/* Background pattern - unchanged */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Logo - repositioned for mobile */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full blur-md"></div>
              <Image
                src="/Guestiefy logo trans.png"
                alt="Gusteify Brand Logo"
                width={128}
                height={128}
                className="w-16 md:w-24 lg:w-32 h-auto relative"
                priority
              />
            </div>
          </div>

          {/* Content - simplified for mobile */}
          <div className="z-10 transition-all duration-500 hover:scale-105">
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="relative">
                <h2 className="text-xl md:text-2xl font-medium text-center tracking-wider text-white/90">
                  Guestify
                </h2>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-200 to-transparent mx-auto mt-1 md:mt-2"></div>
              </div>

              <h5 className="text-sm md:text-lg lg:text-xl tracking-wider text-center text-white/80 font-light mt-2 md:mt-4 mb-1 md:mb-2">
                FOR
              </h5>

              <div className="relative">
                <div className="absolute -inset-1 bg-white/10 rounded-xl blur-sm"></div>
                <h1 className="text-xl md:text-4xl lg:text-5xl font-bold tracking-wider my-1 md:my-2 text-center transition-all duration-300 relative">
                  The Residence
                </h1>
              </div>

              <h3 className="text-lg md:text-3xl lg:text-4xl tracking-wider mb-1 md:mb-2 text-center font-light">
                Maldives
              </h3>

              <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-100/30 to-transparent mx-auto"></div>

              <p className="text-center text-xs md:text-base lg:text-lg mt-1 md:mt-3 italic text-white/70">
                by Cenizaro
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col flex-1/2 md:flex-4 bg-[var(--background)] items-center justify-start px-4 py-6 md:pt-24 md:pb-0 h-[60vh] md:h-auto">
          {/* Centered container */}
          <div className="w-full max-w-md flex flex-col items-center my-auto">
            {/* Heading */}
            <div className="text-center mb-4 md:mb-8">
              <h3 className="text-xl sm:text-3xl font-bold tracking-wide text-[var(--highlight-text)] mb-1 md:mb-2">
                WELCOME
              </h3>
              <p className="text-sm sm:text-lg text-gray-600">
                Please login to continue
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-3 p-2 md:p-3 bg-red-100 text-red-700 text-center rounded-md text-xs sm:text-base gap-1 md:gap-2 flex items-center w-full">
                <X
                  className="inline-block h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 cursor-pointer"
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
              className="space-y-3 md:space-y-5 w-full"
            >
              {/* Username - smaller on mobile */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-[#8B6F47] opacity-70" />
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
                  className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-[#D4C4A8] border-none rounded-full text-[#8B6F47] placeholder:text-[#8B6F47] placeholder:opacity-70 text-xs md:text-sm transition-all duration-300"
                  autoComplete="loginUser"
                />
              </div>

              {/* Password - smaller on mobile */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 mt-3 md:mt-4 flex items-start pointer-events-none">
                  <Key className="h-4 w-4 md:h-5 md:w-5 text-[#8B6F47] opacity-70" />
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
                  className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 bg-[#D4C4A8] border-none rounded-full text-[#8B6F47] placeholder:text-[#8B6F47] placeholder:opacity-70 text-xs md:text-sm transition-all duration-300"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 md:pr-4 mt-3 md:mt-4 flex items-start text-[#8B6F47] opacity-70"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
                <div className="text-right mt-1 md:mt-2 mr-2">
                  <a
                    href="/forgot-password"
                    className="text-[#8B6F47] text-xs sm:text-sm font-medium hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Buttons - smaller on mobile */}
              <div className="flex flex-col pt-2 md:pt-4 gap-3 md:gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 md:py-3 bg-[#6B4E3D] hover:bg-[#5A3F2E] text-white font-medium tracking-wide rounded-full transition-all duration-300 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "SIGNING IN..." : "SIGN IN"}
                </Button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="w-full mt-auto pb-4">
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="relative overflow-hidden">
                <Image
                  src="/verveLogo.png"
                  alt="Verve Automation Logo"
                  width={36}
                  height={36}
                  className="rounded-full object-cover w-6 h-6 md:w-8 md:h-8"
                  priority
                />
              </div>
              <Link
                href="https://verveautomation.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 md:gap-2 transition-all duration-300"
              >
                <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wide font-light">
                  Powered by
                </p>
                <span className="font-medium text-[10px] md:text-sm text-gray-700 group-hover:text-[var(--primary)] hover:underline">
                  Verve Automation
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
