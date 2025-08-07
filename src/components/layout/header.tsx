import { Plus } from "lucide-react";
import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
  addButton?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Header = ({
  title,
  subtitle,
  addButton,
  onClick,
  disabled = false,
  children,
}: HeaderProps) => {
  return (
    <>
      <div className="block sm:flex justify-between py-2 md:py-6 transition-all duration-200">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl text-[var(--primary)] font-extrabold">
            {title}
          </h1>
          <p className="text-sm lg:text-lg text-[var(--secondary)] mt-1">
            {subtitle}
          </p>
        </div>
        {addButton && !disabled && (
          <button
            className="flex w-full p-2 justify-center items-center
                      sm:w-fit lg:px-4 lg:py-3 my-2 text-xs md:text-base text-white border-2 rounded-full bg-[var(--primary)] hover:bg-white hover:text-[var(--primary)] transition-all duration-200 cursor-pointer"
            onClick={onClick}
          >
            <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-2 rounded-full" />
            <span className="items-center text-nowrap">{addButton}</span>
          </button>
        )}
        {children && (
          <div className="flex items-center justify-end mt-2 sm:mt-0">
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
