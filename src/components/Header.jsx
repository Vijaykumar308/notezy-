"use client";

import Image from "next/image";
import logo from "../../public/assets/theme/removed-bg-logo.png";
import Link from "next/link";
import { Leaf, HelpCircle, Menu, X } from "lucide-react"
import { useState } from "react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const [isLoggedIn, setIsLoggedIn] = useState(true);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
   return <>
      {/* Header */}
      <header className="bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              {/* <Leaf className="h-6 w-6 text-green-600" /> */}
              <Image src={logo} height={50} width='auto' alt="logo" />
              <span className="text-xl font-semibold text-gray-900">Notezy</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                  Explore
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                  About
                </a>
               {!isLoggedIn && (
                <>
                  <Link href="/login" className="block text-md text-gray-700 hover:text-gray-900"> Login </Link>
                  <Link href="/register" className="block text-md font-medium text-gray-700 hover:text-gray-900"> Sign Up  </Link>
                </>
              )}
              </nav>

              <div className="flex items-center space-x-3">
                <HelpCircle className="h-5 w-5 text-gray-500" />
                <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center">
                  <Image
                    src="https://static.vecteezy.com/system/resources/thumbnails/029/796/026/small_2x/asian-girl-anime-avatar-ai-art-photo.jpg"
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <HelpCircle className="h-5 w-5 text-gray-500" />
              <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

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
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="text-xl font-semibold text-gray-900">Notezy</span>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="space-y-6">
              <a href="#" className="block text-lg font-medium text-gray-700 hover:text-gray-900"> Home </a>
              <a href="#" className="block text-lg font-medium text-gray-700 hover:text-gray-900"> Explore </a>
              <a href="#" className="block text-lg font-medium text-gray-700 hover:text-gray-900"> About </a>

              {!isLoggedIn && (
                <>
                  <Link href="#" className="block text-lg font-medium text-gray-700 hover:text-gray-900"> Login </Link>
                  <Link href="#" className="block text-lg font-medium text-gray-700 hover:text-gray-900"> Sign Up  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
   </>
}