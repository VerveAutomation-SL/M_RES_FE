"use client";
import UserForm from "@/components/forms/addUser";
import ViewUser from "@/components/forms/viewUser";
import Header from "@/components/layout/header";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import Button from "@/components/ui/button";
import { getAllManagers } from "@/lib/api/userApi";
import Image from "next/image";
import { User } from "@/lib/types";
import { UserIcon, View } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

const Page = () => {
  const [managerLoading, setManagerLoading] = useState(false);
  const [managerError, setManagerError] = useState("");
  const [managerData, setManagerData] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showaddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    const fetchManagers = async () => {
      setManagerLoading(true);
      try {
        const responseManagers = await getAllManagers();
        setManagerData(responseManagers.data);
      } catch (error) {
        console.error("Error fetching Managers:", error);
        setManagerError(
          "Failed to load managers. Please refresh and try again."
        );
      } finally {
        setManagerLoading(false);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchManagers();
    }
  }, [isAuthenticated, isLoading, refreshTrigger]);

  const handelRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleAddUser = () => setShowAddModal(true);
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div className="max-w-7xl mx-auto">
        <Header
          title="Manager Management"
          subtitle="Manage your Manager accounts and permissions"
          addButton="Add Manager"
          onClick={handleAddUser}
          disabled={
            managerLoading ||
            !!managerError ||
            !(user?.role === "Admin" || user?.role === "Manager")
          }
        />
        {/* <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight underline">
        Managers
      </h1> */}
        <div className="rounded-lg border-none">
          {managerLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
              <span className="ml-4 text-gray-700 text-lg">Loading...</span>
            </div>
          ) : managerError ? (
            <div className="flex flex-col items-center justify-center min-h-[100px] text-gray-600">
              <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
              <p>{managerError}</p>
            </div>
          ) : managerData.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[100px] text-gray-600">
              <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
              <p>No Managers found</p>
            </div>
          ) : (
            <div className="space-y-6 mb-4">
              {managerData.map((manager) => (
                <div
                  key={manager.UserId}
                  className="relative flex bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleEditUser(manager)}
                >
                  {/* Colored sidebar */}
                  <div
                    className={`w-2 ${
                      manager.status === "Active"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  />
                  {/* Avatar */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white">
                    <Image
                      src={manager.avatar || "/userPlaceholder.jpg"}
                      width={72}
                      height={72}
                      className="rounded-full object-cover shadow"
                      alt={manager.username || "User Avatar"}
                      onError={(e) => {
                        e.currentTarget.src = "/userPlaceholder.jpg";
                      }}
                    />
                    <span
                      className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        manager.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {manager.status}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">
                          {manager.username}
                        </h3>
                        <span className="ml-2 text-xs text-gray-400">
                          {manager.email}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {manager.resorts?.name || "No Resort"}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                          {manager.restaurant?.restaurantName ||
                            "No Restaurant"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className=" text-amber-700 hover:bg-amber-50"
                        onClick={() => handleEditUser(manager)}
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
        {showViewModal && selectedUser && (
          <ViewUser
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            userId={selectedUser.UserId}
            onSuccess={handelRefresh}
            pageRole="Manager"
          />
        )}
        {showaddModal && (
          <UserForm
            isOpen={showaddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={handelRefresh}
            selectedRole={"Manager"}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Page;
