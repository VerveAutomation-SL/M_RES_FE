"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setMessage("");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    // TODO: Call your API to update user details here
    setEditing(false);
    setMessage("Profile updated successfully!");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (form.newPassword !== form.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    // TODO: Call your API to change password here
    setForm({ ...form, password: "", newPassword: "", confirmNewPassword: "" });
    setMessage("Password changed successfully!");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>
      {message && <div className="text-green-600 mb-4">{message}</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="space-y-4">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <span className="font-semibold text-gray-700">Username:</span>
              <input
                className="ml-2 border rounded px-2 py-1"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email:</span>
              <input
                className="ml-2 border rounded px-2 py-1"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <span className="font-semibold text-gray-700">Username:</span>
              <span className="ml-2">{user.username}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="ml-2">{user.email}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Role:</span>
              <span className="ml-2">{user.role}</span>
            </div>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleEdit}
            >
              Edit Details
            </button>
          </>
        )}

        {/* Change Password Section */}
        <form onSubmit={handlePasswordChange} className="space-y-2 mt-8">
          <div className="font-semibold text-gray-700 mb-2">Change Password</div>
          <input
            className="w-full border rounded px-2 py-1"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Current Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border rounded px-2 py-1"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border rounded px-2 py-1"
            name="confirmNewPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={form.confirmNewPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="text-blue-600 text-xs"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Hide Passwords" : "Show Passwords"}
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded mt-2 block"
          >
            Change Password
          </button>
        </form>

        {/* Logout Button */}
        <button
          className="mt-8 bg-red-600 text-white px-4 py-2 rounded w-full"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}