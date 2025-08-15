"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";

interface SearchBarProps {
  onSearch?: (value: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    onSearch?.(searchValue);
  }, [searchValue, onSearch]);

  return (
    <div className="flex items-center border rounded-lg px-2 py-1 sm:px-4 sm:py-2 shadow-md bg-white transition-all duration-200 w-full max-w-xs sm:max-w-sm md:max-w-md">
      <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
      <input
        type="text"
        placeholder="Enter Room number"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-2 sm:pl-4 border-none focus:outline-none w-full text-sm sm:text-base text-gray-700 placeholder-gray-400 bg-transparent"
      />
    </div>
  );
};

export default SearchBar;
