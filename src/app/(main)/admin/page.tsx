"use client";
import Header from "@/components/layout/header";
import { User } from "@/lib/types";
import {
  UserIcon,
  View,
  Search,
  Filter,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { getAllAdmins } from "@/lib/api/userApi";
import Image from "next/image";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import ViewUser from "@/components/forms/viewUser";
import UserForm from "@/components/forms/addUser";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/routes/ProtectedRoute";

const Page = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showaddModal, setShowAddModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllAdmins();
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching Admins:", error);
        setError("Failed to load Admins. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchAdmins();
    }
  }, [isAuthenticated, isLoading, refreshTrigger]);

  const handelRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleAddAdmin = () => setShowAddModal(true);
  const handleEditAdmin = (admin: User) => {
    setSelectedAdmin(admin);
    setShowViewModal(true);
  };

  // Filter admins based on search and status
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.username
      .toLowerCase()
      .startsWith(searchValue.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      admin.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div className="max-w-7xl mx-auto">
        <Header
          title="Admin Management"
          subtitle="Manage your Admins accounts and permissions"
          addButton="Add Admin"
          onClick={handleAddAdmin}
          disabled={loading || error !== null || user?.role !== "Admin"}
        />
        {/* <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight underline">
        Admins
      </h1> */}
        <div className="rounded-lg border-none">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
              <span className="ml-4 text-gray-700 text-lg">Loading...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[100px] text-gray-600">
              <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
              <p>{error}</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[100px] text-gray-600">
              <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
              <p>No administrators found</p>
            </div>
          ) : (
            <Card classname="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <h1 className="text-2xl font-semibold">Admin Directory</h1>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={
                        viewMode === "grid"
                          ? "outline bg-black text-white"
                          : "default"
                      }
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="py-1 px-3 rounded-md border"
                    >
                      Grid
                    </Button>
                    <Button
                      variant={
                        viewMode === "list"
                          ? "outline bg-black text-white"
                          : "default"
                      }
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="py-1 px-3 rounded-md flex items-center gap-1 border"
                    >
                      List
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-6 lg:items-center">
                  {/* Search Input */}
                  <div className="w-full lg:flex-[2]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search administrators"
                        value={searchValue}
                        onChange={(e: {
                          target: { value: React.SetStateAction<string> };
                        }) => setSearchValue(e.target.value)}
                        className="pl-10 w-full text-sm placeholder:text-xs sm:placeholder:text-sm"
                        name={""}
                        required={false}
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full lg:flex-1">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white"
                      >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Cards - Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
                    {filteredAdmins.map((admin) => (
                      <div
                        key={admin.UserId}
                        className="group relative bg-gradient-to-br from-white via-white to-amber-50/30 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-amber-200 overflow-hidden"
                        onClick={() => handleEditAdmin(admin)}
                      >
                        {/* Status indicator bar */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 ${
                            admin.status === "Active"
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : "bg-gradient-to-r from-red-400 to-red-500"
                          }`}
                        />

                        {/* Card content */}
                        <div className="p-4">
                          {/* ID Display at the top */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              ID: {admin.UserId}
                            </span>
                            {/* Status badge */}
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                admin.status === "Active"
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {admin.status}
                            </div>
                          </div>

                          {/* Header with avatar */}
                          <div className="flex flex-col items-center mb-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 p-1 shadow-inner">
                                <Image
                                  src={admin.avatar || "/userPlaceholder.jpg"}
                                  width={44}
                                  height={44}
                                  className="w-full h-full rounded-lg object-cover"
                                  alt={admin.username || "Admin Avatar"}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/userPlaceholder.jpg";
                                  }}
                                />
                              </div>
                              {/* Online indicator */}
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md ${
                                  admin.status === "Active"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              />
                            </div>
                          </div>

                          {/* User info */}
                          <div className="space-y-2 text-center">
                            <div>
                              <h3 className="font-bold text-base text-gray-900 group-hover:text-amber-800 transition-colors truncate">
                                {admin.username}
                              </h3>
                              <p className="text-xs text-gray-500 truncate">
                                {admin.email}
                              </p>
                            </div>

                            {/* Role */}
                            <div className="flex justify-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                {admin.role || "Admin"}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="pt-2 border-t border-gray-100 space-y-1">
                              {admin.resortId && (
                                <div className="flex items-center justify-center text-xs text-gray-600">
                                  <MapPin className="w-3 h-3 mr-1 text-amber-500" />
                                  <span>Resort {admin.resortId}</span>
                                </div>
                              )}
                              {admin.createdAt && (
                                <div className="flex items-center justify-center text-xs text-gray-600">
                                  <Calendar className="w-3 h-3 mr-1 text-amber-500" />
                                  <span>
                                    {new Date(
                                      admin.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action button */}
                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <div className="text-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <div className="flex items-center justify-center text-amber-600 text-xs font-medium">
                                  <span>View Details</span>
                                  <View className="w-3 h-3 ml-1" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin Cards - List View */}
                {viewMode === "list" && (
                  <div className="space-y-3">
                    {filteredAdmins.map((admin) => (
                      <div
                        key={admin.UserId}
                        className="group relative bg-gradient-to-r from-white via-white to-amber-50/20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-amber-200 overflow-hidden"
                        onClick={() => handleEditAdmin(admin)}
                      >
                        {/* Status indicator */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 ${
                            admin.status === "Active"
                              ? "bg-gradient-to-b from-green-400 to-green-500"
                              : "bg-gradient-to-b from-red-400 to-red-500"
                          }`}
                        />

                        <div className="p-6 pl-8">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="relative">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 p-1 shadow-inner">
                                  <Image
                                    src={admin.avatar || "/userPlaceholder.jpg"}
                                    width={52}
                                    height={52}
                                    className="w-full h-full rounded-lg object-cover"
                                    alt={admin.username || "Admin Avatar"}
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "/userPlaceholder.jpg";
                                    }}
                                  />
                                </div>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                                    admin.status === "Active"
                                      ? "bg-green-500"
                                      : "bg-gray-400"
                                  }`}
                                />
                              </div>

                              {/* User info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-800 transition-colors">
                                    {admin.username}
                                  </h3>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                    {admin.role || "Admin"}
                                  </span>
                                  <span className="text-xs text-gray-400 font-mono">
                                    #{admin.UserId}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {admin.email}
                                </p>
                              </div>
                            </div>

                            {/* Status badge */}
                            <div
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                                admin.status === "Active"
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {admin.status}
                            </div>
                          </div>

                          {/* Details grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="font-medium">
                                  Resort Assignment
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-900">
                                <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                                <span>
                                  {admin.resortId
                                    ? `Resort ${admin.resortId}`
                                    : "Not Assigned"}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="font-medium">Date Joined</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-900">
                                <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                                <span>
                                  {admin.createdAt
                                    ? new Date(
                                        admin.createdAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="font-medium">
                                  Last Updated
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-900">
                                <Clock className="w-4 h-4 mr-2 text-amber-500" />
                                <span>
                                  {admin.updatedAt
                                    ? new Date(
                                        admin.updatedAt
                                      ).toLocaleDateString()
                                    : "Recently"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-400">
                                Admin Account
                              </span>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <div className="flex items-center text-amber-600 text-sm font-medium hover:text-amber-700">
                                <span>View Details</span>
                                <View className="w-4 h-4 ml-2" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results message */}
                {filteredAdmins.length === 0 && admins.length > 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-lg">No administrators found</p>
                    <p className="text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}

                {/* Results count */}
                <div className="mt-6 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
                  <span>
                    Showing {filteredAdmins.length} of {admins.length}{" "}
                    administrators
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
        {showViewModal && selectedAdmin && (
          <ViewUser
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            userId={selectedAdmin.UserId}
            onSuccess={handelRefresh}
            pageRole="Admin"
          />
        )}

        {showaddModal && (
          <UserForm
            isOpen={showaddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={handelRefresh}
            selectedRole={"Admin"}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Page;
