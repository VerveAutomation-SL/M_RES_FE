"use client";
import React from "react";
import { useState } from "react";

const Navigation = () => {
  const [activeTab, setActiveTab] = useState("dhigurah");

  return (
    <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow-md text-xs lg:text-base transition-all duration-200">
      <button
        onClick={() => setActiveTab("dhigurah")}
        className={` flex-1 py-1
                     font-medium rounded-md transition-colors cursor-pointer ${
                       activeTab === "dhigurah"
                         ? "text-gray-900 bg-gray-200"
                         : "text-gray-600 hover:text-gray-900"
                     }`}
      >
        <span className=""> Dhigurah Island</span>
      </button>

      <button
        onClick={() => setActiveTab("fathurnahafushi")}
        className={`flex-1 py-1 
                    font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === "fathurnahafushi"
                        ? "text-gray-900 bg-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
      >
        <span className="text-nowrap"> Fathurnahafushi Island</span>
      </button>
    </div>
  );
};

export default Navigation;
