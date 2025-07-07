import React from "react";

interface NavigationProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const Navigation = ({ activeNav, setActiveNav }: NavigationProps) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow-md text-xs lg:text-base transition-all duration-200">
      <button
        onClick={() => setActiveNav("dhigurah")}
        className={` flex-1 py-1
                     font-medium rounded-md transition-colors cursor-pointer ${
                       activeNav === "dhigurah"
                         ? "text-gray-900 bg-gray-200"
                         : "text-gray-600 hover:text-gray-900"
                     }`}
      >
        <span className=""> Dhigurah Island</span>
      </button>

      <button
        onClick={() => setActiveNav("Falhumaafushi")}
        className={`flex-1 py-1 
                    font-medium rounded-md transition-colors cursor-pointer ${
                      activeNav === "Falhumaafushi"
                        ? "text-gray-900 bg-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
      >
        <span className="text-nowrap"> Falhumaafushi Island</span>
      </button>
    </div>
  );
};

export default Navigation;
