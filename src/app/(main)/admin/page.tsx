"use client";
import Header from "@/components/layout/header";
import { User } from "@/lib/types";
import { UserIcon, View } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getAllAdmins } from "@/lib/api/userApi";
import Card from "@/components/ui/card";
import Image from "next/image";
import Button from "@/components/ui/button";
import ViewUser from "@/components/forms/viewUser";
import UserForm from "@/components/forms/addUser";
import { useAuthStore } from "@/store/authStore";

const Page = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showaddModal, setShowAddModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);

  const { isAuthenticated, isLoading, user } = useAuthStore();

  console.log(user, "user in managers page");

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllAdmins();
        console.log("Fetched Admins:", response);
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setError("Failed to load Admins. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchAdmins();
    }
  }, [isAuthenticated, isLoading, refreshTrigger]);

  const handelRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Trigger re-fetch
  };

  const handleAddAdmin = () => {
    setShowAddModal(true);
  };
  const handleEditAdmin = (admin: User) => {
    setSelectedAdmin(admin);
    setShowViewModal(true);
  };

  return (
    <>
      <Header
        title="Admin Management"
        subtitle="Manage your Admins accounts and permissions"
        addButton="Add Admin"
        onClick={handleAddAdmin}
        disabled={
          loading || error !== null || user?.role !== "Admin" ? true : false
        }
      />
      <div className="flex-1">
        <div className="mx-auto">
          {/* Admins Section */}

          <h1 className="flex text-3xl justify-center font-bold text-gray-800 underline">
            Admins
          </h1>
          <div className="rounded-lg border-none p-4">
            {loading ? (
              <div className="flex justify-center items-center h-60">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[var(--primary)]"></div>
                <span className="ml-2 text-gray-700">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[100px] text-gray-600">
                <div className="h-12 w-12 text-amber-500 mb-2" />
                <p>Error loading administrators. Please try again later.</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[100px] text-gray-600">
                <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
                <p>No administrators found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <Card
                    key={admin.UserId}
                    classname="border bg-amber-50 border-gray-300 hover:shadow-lg transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Image
                              src={admin.avatar || "/userPlaceholder.jpg"}
                              width={56}
                              height={56}
                              className="rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/userPlaceholder.jpg";
                              }}
                              alt={admin.username || "Admin Avatar"}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base lg:text-xl">
                              {admin.username}
                            </h3>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <span>{admin.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div
                            className={`${
                              admin.status === "Active"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            } text-sm px-3 py-2 rounded-full font-medium`}
                          >
                            {admin.status}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                              onClick={() => handleEditAdmin(admin)}
                            >
                              <View className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showViewModal && selectedAdmin && (
        <ViewUser
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          userId={selectedAdmin.UserId}
          onSuccess={handelRefresh}
          loginUser={user ?? undefined}
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
    </>
  );
};

export default Page;
