"use client";

import Button from "@/components/ui/button";
import { resetPassword } from "@/lib/api/authApi";
import { AppError } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenFormUrl = searchParams.get("token");
    if (tokenFormUrl) {
      setToken(tokenFormUrl);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!password.trim()) {
      setError("Please enter your new password.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, password.trim());
      setSubmitted(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof AppError) {
        console.error(err.message);
        if (err.statusCode === 400) {
          setError(err.message || "Invalid reset link or token expired.");
        } else if (err.statusCode === 429) {
          setError(err.message || "Too many requests. Please try again later.");
        } else {
          setError(
            err.message || "Failed to reset password. Please try again."
          );
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
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Enter your new password below.
        </p>
        {!submitted ? (
          <>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-base bg-gray-50"
                required
                disabled={loading}
                minLength={6}
                aria-label="New Password"
                autoComplete="new-password"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-base bg-gray-50"
                required
                disabled={loading}
                minLength={6}
                aria-label="Confirm New Password"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-base shadow transition"
              disabled={loading || !token}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-medium">
              Password reset successful!
            </div>
            <p className="text-gray-600 text-sm">
              Your password has been reset successfully. You will be redirected
              to the login page in a few seconds.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-base shadow transition"
            >
              Go to Login
            </Button>
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
