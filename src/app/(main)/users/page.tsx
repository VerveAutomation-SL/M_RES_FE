"use client";
import Header from "@/components/layout/header";
import { User } from "@/lib/types";
import { Trash2, UserIcon, View } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getAllHosts, getAllManagers } from "@/lib/api/userApi";
import Card from "@/components/ui/card";
import Image from "next/image";
import Button from "@/components/ui/button";
import ViewUser from "@/components/forms/viewUser";
import AddUserForm from "@/components/forms/addUser";

const Page = () => {
  const [managerLoading, setManagerLoading] = useState(false);
  const [managerError, setManagerError] = useState("");
  const [managerData, setManagerData] = useState<User[]>([]);

  const [hostLoading, setHostLoading] = useState(false);
  const [hostError, setHostError] = useState("");
  const [hostData, setHostData] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showaddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      setManagerLoading(true);
      try {
        const responseManagers = await getAllManagers();
        console.log("Fetched Managers:", responseManagers);
        setManagerData(responseManagers.data);
      } catch (error) {
        console.error("Error fetching managers:", error);
        setManagerError(
          "Failed to load managers. Please refresh and try again."
        );
      } finally {
        setManagerLoading(false);
      }
    };

    const fetchHosts = async () => {
      setHostLoading(true);
      try {
        const responseHosts = await getAllHosts();
        console.log("Fetched Hosts:", responseHosts);
        setHostData(responseHosts.data);
      } catch (error) {
        console.error("Error fetching Hosts:", error);
        setHostError("Failed to load Hosts. Please refresh and try again.");
      } finally {
        setHostLoading(false);
      }
    };

    fetchManagers();
    fetchHosts();
  }, [refreshTrigger]);

  const handelRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Trigger re-fetch
  };

  const handleAddUser = () => {
    console.log("Add new User clicked");
    setShowAddModal(true);
  };
  const handleEditUser = (user: User) => {
    console.log("Edit User with ID:", user);
    setSelectedUser(user);
    setShowViewModal(true);
    handelRefresh();
  };

  return (
    <>
      <Header
        title="User Management"
        subtitle="Manage your User accounts and permissions"
        addButton="Add Users"
        onClick={handleAddUser}
        disabled={
          managerLoading || hostLoading || !!managerError || !!hostError
        }
      />
      <div className="mx-auto mb-10">
        <h1 className="flex text-3xl justify-center font-bold text-gray-800 underline">
          Managers
        </h1>
        <div className="rounded-lg border-none p-2">
          {managerLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[var(--primary)]"></div>
              <span className="ml-2 text-gray-700">Loading...</span>
            </div>
          ) : managerError ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600">
              <div className="h-12 w-12 text-amber-500 mb-2" />
              <p>Error loading Managers. Please try again later.</p>
            </div>
          ) : managerData.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600">
              <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
              <p>No Managers found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {managerData.map((manager) => (
                <Card
                  key={manager.UserId}
                  classname="border bg-amber-50 border-gray-300 hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Image
                            src={manager.avatar || "/userPlaceholder.jpg"}
                            width={56}
                            height={56}
                            className="rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/userPlaceholder.jpg";
                            }}
                            alt={manager.username || "User Avatar"}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base lg:text-xl">
                            {manager.username}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <span>Full Access</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div
                          className={`${
                            manager.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          } text-sm px-3 py-2 rounded-full font-medium`}
                        >
                          {manager.status}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                            onClick={() => handleEditUser(manager)}
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

      {/* Hosts section */}
      <div className="mx-auto">
        <h1 className="flex text-3xl justify-center font-bold text-gray-800 underline">
          Hosts
        </h1>
        <div className="rounded-lg border-none p-2">
          {hostLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[var(--primary)]"></div>
              <span className="ml-2 text-gray-700">Loading...</span>
            </div>
          ) : hostError ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600">
              <div className="h-12 w-12 text-amber-500 mb-2" />
              <p>Error loading Hosts. Please try again later.</p>
            </div>
          ) : hostData.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600">
              <UserIcon className="h-12 w-12 text-amber-500 mb-2" />
              <p>No Hosts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hostData.map((host) => (
                <Card
                  key={host.UserId}
                  classname="border bg-amber-50 border-gray-300 hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Image
                            src={host.avatar || "/userPlaceholder.jpg"}
                            width={56}
                            height={56}
                            className="rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/userPlaceholder.jpg";
                            }}
                            alt={host.username || "User Avatar"}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base lg:text-xl">
                            {host.username}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <span>Full Access</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div
                          className={`${
                            host.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          } text-sm px-3 py-2 rounded-full font-medium`}
                        >
                          {host.status}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                            onClick={() => handleEditUser(host)}
                          >
                            <View className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                            onClick={() =>
                              alert(
                                "Delete User functionality not implemented yet"
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4" />
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

      {showViewModal && selectedUser && (
        <ViewUser
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          userId={selectedUser.UserId}
          onSuccess={handelRefresh}
        />
      )}

      {showaddModal && (
        <AddUserForm
          isOpen={showaddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handelRefresh}
          role={"User"}
        />
      )}
    </>
  );
};

export default Page;
