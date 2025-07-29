export default function Login () {
    return <>
     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Side - Login Form */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
              <div className="max-w-md mx-auto w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">
                  Welcome to Notezy
                </h1>

                <form className="space-y-4 lg:space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Email or Username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors text-base"
                  >
                    Login
                  </button>
                </form>

                <div className="mt-4 lg:mt-6 text-center">
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                    Or continue as guest
                  </a>
                </div>

                <div className="mt-6 lg:mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                  />
                </div>

                <button className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-base">
                  Continue as Guest
                </button>
              </div>
            </div>

            {/* Right Side - Marketing Content */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative order-1 lg:order-2 min-h-[300px] lg:min-h-[600px]">
              <div className="max-w-md mx-auto lg:mx-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 text-center lg:text-left">
                  Your space for thoughts, organized and shareable.
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6 lg:mb-8 text-center lg:text-left text-sm sm:text-base">
                  Notezy is a platform designed for seamless note-taking and sharing. Organize your ideas,
                  collaborate with others, and keep your thoughts accessible anytime, anywhere.
                </p>
              </div>

              {/* Illustration - Hidden on small mobile, visible on larger screens */}
              <div className="hidden sm:block absolute bottom-4 right-4 lg:bottom-8 lg:right-8">
                <div className="relative">
                  <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 w-48 h-60 lg:w-64 lg:h-80 transform rotate-3">
                    {/* Notebook illustration */}
                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4 h-full">
                      <div className="space-y-3 lg:space-y-4">
                        <div className="text-xs font-medium text-gray-500 mb-3 lg:mb-4">NATURAL</div>

                        {/* Botanical drawings */}
                        <div className="space-y-4 lg:space-y-6">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <div className="w-3 h-3 lg:w-4 lg:h-4 text-green-600">🌿</div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="h-1.5 lg:h-2 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-1.5 lg:h-2 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-orange-100 flex items-center justify-center">
                              <div className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600">🍃</div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="h-1.5 lg:h-2 bg-gray-200 rounded w-2/3"></div>
                              <div className="h-1.5 lg:h-2 bg-gray-200 rounded w-3/4"></div>
                            </div>
                          </div>

                          <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-orange-200 mx-auto flex items-center justify-center">
                            <div className="text-orange-700 text-sm lg:text-base">🌸</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pen */}
                  <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-12 h-1.5 lg:w-16 lg:h-2 bg-gray-800 rounded-full transform rotate-45"></div>
                  <div className="absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-2 h-2 lg:w-3 lg:h-3 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
}