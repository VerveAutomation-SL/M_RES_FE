"use client";
import Header from "@/components/layout/header";
import { User } from "@/lib/types";
import { UserIcon, View } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getAllAdmins } from "@/lib/api/userApi";
import Image from "next/image";
import Button from "@/components/ui/button";
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
            <div className="space-y-6 mb-4">
              {admins.map((admin) => (
                <div
                  key={admin.UserId}
                  className="relative flex bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleEditAdmin(admin)}
                >
                  {/* Colored sidebar */}
                  <div
                    className={`w-2 ${
                      admin.status === "Active" ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  {/* Avatar */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white">
                    <Image
                      src={admin.avatar || "/userPlaceholder.jpg"}
                      width={72}
                      height={72}
                      className="rounded-full object-cover shadow"
                      alt={admin.username || "User Avatar"}
                      onError={(e) => {
                        e.currentTarget.src = "/userPlaceholder.jpg";
                      }}
                    />
                    <span
                      className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        admin.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">
                          {admin.username}
                        </h3>
                        <span className="ml-2 text-xs text-gray-400">
                          {admin.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className=" text-amber-700 hover:bg-amber-50"
                        onClick={() => handleEditAdmin(admin)}
                      >
                        <View className="w-5 h-5 mr-1 cursor-pointer" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
