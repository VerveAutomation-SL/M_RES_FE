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
    <>
      <div className="flex items-center border rounded-lg px-4 py-2 shadow-md bg-white transition-all duration-200">
        <div className="flex items-center justify-center">
          <Search className=" h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Enter Room number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 border-none focus:outline-none w-full text-sm lg:text-base text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </>
  );
};

export default SearchBar;
