"use client";

import Image from "next/image";
import logo from "../../public/assets/theme/removed-bg-logo.png";
import Link from "next/link";
import { Leaf, HelpCircle, Menu, X, Search, Plus, LogOut } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  
  // Show navigation links only on auth pages or when not logged in
  const showNavLinks = !isLoggedIn || pathname?.includes('/login') || pathname?.includes('/register');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src={logo} height={40} width="auto" alt="logo" />
            <span className="text-xl font-semibold text-gray-900">Notezy</span>
          </div>

          {/* Desktop Navigation & Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
            {/* Navigation Links */}
            <nav className="flex space-x-6 mr-6">
              {showNavLinks && (
                <>
                  <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                    Home
                  </a>
                  <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                    Explore
                  </a>
                  <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                    About
                  </a>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                    Login
                  </Link>
                  <Link href="/register" className="text-gray-700 hover:text-gray-900 font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* Search Bar */}
            {!isLoggedIn && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search notes..."
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white hidden sm:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
                <HelpCircle className="h-5 w-5 text-gray-500 hidden sm:block" />
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://static.vecteezy.com/system/resources/thumbnails/029/796/026/small_2x/asian-girl-anime-avatar-ai-art-photo.jpg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <Image src={logo} height={32} width="auto" alt="logo" />
              <span className="text-xl font-semibold text-gray-900">Notezy</span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Search */}
          {isLoggedIn && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white w-full"
                />
              </div>
            </div>
          )}

          {/* Mobile New Note Button */}
          {isLoggedIn && (
            <div className="mb-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>
          )}

          <nav className="space-y-6">
            {showNavLinks && (
              <>
                <a href="#" className="block text-lg font-medium text-gray-700 hover:text-gray-900">
                  Home
                </a>
                <a href="#" className="block text-lg font-medium text-gray-700 hover:text-gray-900">
                  Explore
                </a>
                <a href="#" className="block text-lg font-medium text-gray-700 hover:text-gray-900">
                  About
                </a>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link href="/login" className="block text-lg font-medium text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/register" className="block text-lg font-medium text-gray-700 hover:text-gray-900">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
