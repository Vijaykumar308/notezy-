"use client";
import { useRef, useState, useEffect } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileDropdown({ currentUser, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open profile menu"
        tabIndex={0}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={currentUser?.avatar || "/placeholder.svg?height=32&width=32"} alt={currentUser?.name || "User"} />
          <AvatarFallback>{currentUser?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <a
            href="/profile/current-user"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <User className="w-4 h-4" /> Profile
          </a>
          <a
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <Settings className="w-4 h-4" /> Settings
          </a>
          <button
            onClick={() => {
              // Place your logout logic here. For now, redirect to login page.
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
