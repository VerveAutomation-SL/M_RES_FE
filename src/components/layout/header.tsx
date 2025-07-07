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
      <div className="flex items-start justify-between px-2 md:px-5 py-2 md:py-6">
        <div>
          <h1 className="text-lg md:text-2xl lg:text-3xl text-[var(--primary)] font-extrabold">
            {title}
          </h1>
          <p className="text-sm lg:text-lg text-[var(--secondary)] mt-1">
            {subtitle}
          </p>
        </div>
        {addButton && (
          <button
            className="flex items-center p-1 lg:p-2 text-xs text-[var(--primary)] border-2 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
            onClick={onClick}
          >
            <Plus className="w-3 h-3 lg:w-5 lg:h-5 mr-2" />
            <span className="items-center text-nowrap">{addButton}</span>
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
