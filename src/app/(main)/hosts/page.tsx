"use client";
import UserForm from "@/components/forms/addUser";
import ViewUser from "@/components/forms/viewUser";
import Header from "@/components/layout/header";
import Button from "@/components/ui/button";
import { getAllHosts } from "@/lib/api/userApi";
import Image from "next/image";
import { User } from "@/lib/types";
import { UserIcon, View } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/routes/ProtectedRoute";

const Page = () => {
  const [hostLoading, setHostLoading] = useState(false);
  const [hostError, setHostError] = useState("");
  const [hostData, setHostData] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showaddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    const fetchHosts = async () => {
      setHostLoading(true);
      try {
        const responseHosts = await getAllHosts();
        setHostData(responseHosts.data);
      } catch (error) {
        console.error("Error fetching Hosts:", error);
        setHostError("Failed to load Hosts. Please refresh and try again.");
      } finally {
        setHostLoading(false);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchHosts();
    }
  }, [isAuthenticated, isLoading, refreshTrigger]);

  const handelRefresh = () => setRefreshTrigger((prev) => prev + 1);
  const handleAddUser = () => setShowAddModal(true);
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  return (
    <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
      <div className="max-w-7xl mx-auto">
        <Header
          title="Host Management"
          subtitle="Manage your Host's accounts and permissions"
          addButton="Add Hosts"
          onClick={handleAddUser}
          disabled={
            hostLoading ||
            !!hostError ||
            !(user?.role === "Admin" || user?.role === "Manager")
          }
        />
        {/* <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight underline">
        Hosts
      </h1> */}
        <div className="rounded-lg border-none">
          {hostLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
              <span className="ml-4 text-gray-700 text-lg">Loading...</span>
            </div>
          ) : hostError ? (
            <div className="flex flex-col items-center justify-center min-h-[100px] text-gray-600">
              <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
              <p>{hostError}</p>
            </div>
          ) : hostData.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[100px] text-gray-600">
              <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
              <p>No Hosts found</p>
            </div>
          ) : (
            <div className="space-y-6 mb-4">
              {hostData.map((user) => (
                <div
                  key={user.UserId}
                  className="relative flex bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleEditUser(user)}
                >
                  {/* Colored sidebar */}
                  <div
                    className={`w-2 ${
                      user.status === "Active" ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  {/* Avatar */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white">
                    <Image
                      src={user.avatar || "/userPlaceholder.jpg"}
                      width={72}
                      height={72}
                      className="rounded-full object-cover shadow"
                      alt={user.username || "User Avatar"}
                      onError={(e) => {
                        e.currentTarget.src = "/userPlaceholder.jpg";
                      }}
                    />
                    <span
                      className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">
                          {user.username}
                        </h3>
                        <span className="ml-2 text-xs text-gray-400">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {user.resorts?.name || "No Resort"}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                          {user.restaurant?.restaurantName || "No Restaurant"}
                        </span>
                        {user.meal_type && (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Meal: {user.meal_type}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className=" text-amber-700 hover:bg-amber-50"
                        onClick={() => handleEditUser(user)}
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
            pageRole="Host"
          />
        )}
        {showaddModal && (
          <UserForm
            isOpen={showaddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={handelRefresh}
            selectedRole={"Host"}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Page;
