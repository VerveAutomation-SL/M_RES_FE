"use client";

import AuthInput from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Key, User } from "lucide-react";
import React from "react";
import { useState } from "react";
import { loginUser } from "@/lib/api/auth";
import { LoginFormData } from "@/lib/types/auth";

const Page = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    userName: "",
    password: "",
    role: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await loginUser(formData);

      if (response.error) {
        console.error("Login error:", response.error);
        // Handle error (show toast, etc.)
      } else {
        console.log("Login successful:", response);
        // Handle success (redirect, show success message, etc.)
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newError: Record<string, string> = {};

    if (!formData.userName.trim()) newError.name = "UserName is required";
    if (formData.password.length < 6)
      newError.password = "Password must be at least 8 characters long";

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Side - Brand Section */}
        <div className="flex-1 bg-[var(--primary)] text-white flex items-center justify-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wider mb-2 text-center">
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
        <div className="flex-1/8 bg-[var(--background)] flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-5xl font-bold tracking-wide text-[var(--highlight-text)] mb-2">
                WELCOME
              </h3>
              <p className="text-lg md:text-xl text-gray-600">
                Please login to continue
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* userName Input */}
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
                  icon={User}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 bg-[#D4C4A8] border-none rounded-full text-[#8B6F47] placeholder:text-[#8B6F47] placeholder:opacity-70 text-base"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#8B6F47] opacity-70" />
                </div>
                <AuthInput
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  icon={Key}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 bg-[#D4C4A8] border-none rounded-full text-[#8B6F47] placeholder:text-[#8B6F47] placeholder:opacity-70 text-base"
                />
                <div className="text-right mt-3 mr-2 space-y-2">
                  <p className="text-[#8B6F47] text-sm">
                    <a
                      href="/forgot-password"
                      className="font-medium  hover:underline transition-all duration-200 "
                    >
                      Forgot Password?
                    </a>
                  </p>
                </div>
              </div>

              {/* Login Button */}
              <div className="flex pt-6 space-around gap-10">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 bg-[#6B4E3D] hover:bg-[#5A3F2E] text-white font-medium tracking-wider rounded-full transition-colors duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "SIGNING IN..." : "SIGN IN as Admin"}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 bg-[#6B4E3D] hover:bg-[#5A3F2E] text-white font-medium tracking-wider rounded-full transition-colors duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "SIGNING IN..." : "SIGN IN as User"}
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
