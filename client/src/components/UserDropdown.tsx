"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserDropdown = ({ name }: { name?: string }) => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <img
          src="/avatar.jpg"
          alt="User"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-800 hidden md:block">
          {name || "Loading..."}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 w-40 bg-white shadow-lg rounded-md py-2 z-50">
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
