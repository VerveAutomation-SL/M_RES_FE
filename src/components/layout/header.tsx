import { Plus } from "lucide-react";
import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
  addButton?: string;
  onClick?: () => void;
}

const Header = ({ title, subtitle, addButton, onClick }: HeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between md:px-5 md:py-2">
        <div>
          <h1 className="text-2xl lg:text-4xl font-semibold text-gray-900">
            {title}
          </h1>
          <p className="text-sm lg:text-lg text-gray-600 mt-1">{subtitle}</p>
        </div>
        {addButton && (
          <button
            className="flex items-center p-2 text-[var(--primary)] border-2 rounded-full"
            onClick={onClick}
          >
            <Plus className="w-5 h-5 mr-2" />
            {addButton}
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
