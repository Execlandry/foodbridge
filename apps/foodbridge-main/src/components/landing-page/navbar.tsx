import React, { useContext, useEffect, useRef, useState } from "react";
import { MdLogin, MdLogout, MdMenu, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../../hooks/user-context";
import useAuth from "../../hooks/use-auth";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track if menu is open on mobile
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { user } = useContext(UserContext) as UserContextType;

  const ref = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    setNav(false);
    navigate(path);
  };

  const handleLogout = () => {
    setNav(false);
    logoutUser();
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setNav(false);
        setIsMenuOpen(false); // Close the mobile menu if clicking outside
      }
    };
    // Attach the event listener to the document
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <nav className="w-full bg-white shadow-lg shadow-gray-100/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16" ref={ref}>
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            <h2
              className="text-2xl font-extrabold text-green-600 tracking-tight cursor-pointer hover:text-green-700 transition-colors duration-300 ease-in-out"
              onClick={() => navigate("/")}
            >
              Foodbridge
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6 md:flex hidden">
            {user && user.permissions != "business-admin" ? (
              <>
                {/* Cart */}
                <button
                  className="relative group p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105"
                  aria-label="Cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <div className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-md">
                    <span className="text-white text-xs font-semibold">4</span>
                  </div>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-4">
                  <div className="group relative flex items-center">
                    {/* <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm transition-all duration-300 group-hover:ring-green-300">
                      <img
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        src={user.avatar || 'https://via.placeholder.com/40'}
                        alt="User avatar"
                      />
                    </div> */}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                        {user.name?.substring(0, 10) || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.email?.substring(0, 15) || "Email"}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Button */}
                  <button
                    onClick={() => navigate("/fbe/business")}
                    className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-lg shadow-md hover:from-green-800 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                  >
                    Dashboard
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                  >
                    <MdLogout className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate("/signin?role=agency")}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  <MdLogin className="w-5 h-5 mr-2" />
                  Sign In as Agency
                </button>
                <button
                  onClick={() =>
                    (window.location.href = "http://localhost:3007/signin")
                  }
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  <MdLogin className="w-5 h-5 mr-2" />
                  Sign In as Business
                </button>
              </div>
            )}
            <button
              onClick={() => navigate("/donate")}
              className="
    inline-flex items-center px-4 py-1.5 
    bg-gradient-to-r from-green-600 to-green-700 
    text-white rounded-lg shadow-md 
    hover:from-green-700 hover:to-green-800 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 
    transition-all duration-300 ease-in-out 
    transform hover:-translate-y-0.5
  "
            >
              Donate
            </button>
          </div>

          {/* Hamburger Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <MdClose className="w-8 h-8" />
              ) : (
                <MdMenu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          {user ? (
            <div className="flex flex-col space-y-4 py-4 px-6">
              <button
                onClick={() => navigate("/fbe/business")}
                className="px-4 py-2 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-lg shadow-md hover:from-green-800 hover:to-green-900 focus:outline-none"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-md hover:from-red-700 hover:to-red-800 focus:outline-none"
              >
                <MdLogout className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4 py-4 px-6">
              <button
                onClick={() => navigate("/signin?role=agency")}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none"
              >
                Sign In as Agency
              </button>
              <button
                onClick={() =>
                  (window.location.href = "http://localhost:3007/signin")
                }
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none"
              >
                Sign In as Business
              </button>
                          <button
              onClick={() => navigate("/donate")}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none
  "
            >
              Donate
            </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
