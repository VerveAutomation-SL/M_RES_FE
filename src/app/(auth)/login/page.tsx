"use client";

import Button from "@/components/ui/button";
import { Key, User } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { LoginFormData } from "@/lib/types";
import AuthInput from "@/components/ui/input";
import { tokenRefresh, login } from "@/lib/api/auth";
import { AppError } from "@/lib/types";
import { useRouter } from "next/navigation";
import { setDecodedUser } from "@/utils/decoedUser";

const Page = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    userName: "",
    password: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          setDecodedUser(response.data.accessToken);
          router.push("/dashboard");
        }
      } catch (err: unknown) {
        if (err instanceof AppError) {
          console.error(err.message);
        } else {
          console.error(err);
        }
      }
    };
    checkAuth();
  }, [router]);

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
        setDecodedUser(response.data.accessToken);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof AppError) {
        console.error(err.message);
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 mt-4 flex items-start pointer-events-none">
                  <Key className="h-5 w-5 text-[#8B6F47] opacity-70" />
                </div>
                <AuthInput
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-[#D4C4A8] border-none rounded-full text-[#8B6F47] placeholder:text-[#8B6F47] placeholder:opacity-70 text-sm sm:text-base transition-all duration-300"
                />
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
