"use client";

import Button from "@/components/ui/button";
import { forgotPassword } from "@/lib/api/auth";
import { AppError } from "@/lib/types";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof AppError) {
        console.error(err.message);
        if (err.statusCode === 404) {
          setSubmitted(true);
        } else if (err.statusCode === 429) {
          setError("Too many requests. Please try again later.");
        } else {
          setError(err.message || "An error occurred. Please try again.");
        }
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {!submitted ? (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-base bg-gray-50"
              required
              disabled={loading}
            />
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-base shadow transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-medium">
              Check your email!
            </div>
            <p className="text-gray-600 text-sm">
              If an account with that email exists, we&apos;ve sent you a
              password reset link. It may take a few minutes to arrive.
            </p>
            <p className="text-gray-500 text-xs">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                  setError("");
                }}
                className="text-amber-800 hover:underline"
              >
                try again
              </button>
            </p>
          </div>
        )}

        <div className="text-center">
          <a href="/login" className="text-amber-800 hover:underline text-sm">
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
}
