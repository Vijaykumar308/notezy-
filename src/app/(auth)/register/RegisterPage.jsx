"use client";
import { useActionState, useState } from "react"
import Link from "next/link"
import Head from "next/head";
import { registerUser } from "@/actions/userActions";

export default function RegisterPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(registerUser);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 min-h-[700px]">
              {/* Left Side - Register Form */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                <div className="max-w-lg mx-auto w-full">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">
                    Join Notezy
                  </h1>

                  <form action={formAction} className="space-y-4 lg:space-y-6">
                    {/* Username and Full Name - Two Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                          type="text"
                          placeholder="Enter username"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                          name="username"
                          value="vijay123"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          placeholder="Enter full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                          name="fullname"
                          value='vijay kumar 123'
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Email - Full Width */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                        name="email"
                        value="vijay@123.com"
                        readOnly
                      />
                    </div>

                    {/* Password and Confirm Password - Two Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                          type="password"
                          placeholder="Create password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                          name="password"
                          value="1234321"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          placeholder="Confirm password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                          name="confirmPassword"
                           value="1234321"
                           readOnly
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors text-base"
                    >
                      Create Account
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                      Already have an account?{" "}
                      <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - About Content */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative order-1 lg:order-2 min-h-[400px] lg:min-h-[700px]">
                <div className="max-w-md mx-auto lg:mx-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 text-center lg:text-left">
                    Start your journey with Notezy
                  </h2>

                  <div className="space-y-6 text-center lg:text-left">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Organize Your Ideas</h3>
                        <p className="text-gray-700 text-sm">
                          Create, categorize, and structure your thoughts with our intuitive note-taking system.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Collaborate Seamlessly</h3>
                        <p className="text-gray-700 text-sm">
                          Share your notes with team members and collaborate in real-time on projects.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Access Anywhere</h3>
                        <p className="text-gray-700 text-sm">
                          Sync across all your devices and access your notes whenever inspiration strikes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                    <p className="text-sm text-gray-700 italic text-center lg:text-left">
                      "Notezy has transformed how I organize my thoughts and collaborate with my team. It's simple,
                      powerful, and always available when I need it."
                    </p>
                    <p className="text-xs text-gray-600 mt-2 text-center lg:text-left">
                      — Vijay Kumar, Product Owner
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="hidden lg:block absolute top-8 right-8 w-16 h-16 bg-blue-200 rounded-full opacity-50"></div>
                <div className="hidden lg:block absolute bottom-16 right-16 w-8 h-8 bg-green-200 rounded-full opacity-60"></div>
                <div className="hidden lg:block absolute top-32 right-32 w-4 h-4 bg-purple-200 rounded-full opacity-70"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
