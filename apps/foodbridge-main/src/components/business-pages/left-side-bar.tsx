import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ChatAlt2Icon,
  HeartIcon,
  ShoppingBagIcon,
  CashIcon,
  SearchIcon,
  FolderOpenIcon,
  CogIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { FaMapMarked } from "react-icons/fa";
import useAuth from "../../hooks/use-auth";
import { UserContext, UserContextType } from "../../hooks/user-context";

export const LeftBarRoutes = [
  {
    id: 1,
    name: "Home",
    route: "/fbe/business",
    icon: HomeIcon,
  },
  {
    id: 2,
    name: "Chat",
    route: "/fbe/chat",
    icon: ChatAlt2Icon,
  },
  {
    id: 10,
    name: "Search",
    route: "/search",
    icon: SearchIcon,
  },
  {
    id: 9,
    name: "Businesses",
    route: "/fbe/business",
    icon: FolderOpenIcon,
  },
  {
    id: 3,
    name: "Wallet",
    route: "/fbe/wallet",
    icon: CashIcon,
  },
  {
    id: 4,
    name: "Track",
    route: "/fbe/track",
    icon: FaMapMarked,
  },
  {
    id: 5,
    name: "Orders",
    route: "/fbe/checkout",
    icon: ShoppingBagIcon,
  },
  {
    id: 6,
    name: "Favorite",
    route: "/favorite",
    icon: HeartIcon,
  },
  {
    id: 7,
    name: "Settings",
    route: "/settings",
    icon: CogIcon,
  },
];

export default function LeftSideBar() {
  const navigation = useNavigate();
  const { logoutUser } = useAuth();
  const { user } = useContext(UserContext) as UserContextType;

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-white shadow-lg border-r border-gray-100 flex flex-col items-center py-6 z-50">
      {/* Logo/Branding */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          F
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {LeftBarRoutes.map((item) => (
          <button
            key={item.id}
            onClick={() => navigation(item.route)}
            className="group relative w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 hover:bg-green-50 hover:text-green-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <item.icon className="h-6 w-6" />
            <span className="absolute left-14 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md py-1 px-2 -translate-y-1/2 top-1/2 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
              {item.name}
            </span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => logoutUser()}
        className="group relative w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200 mb-4"
      >
        <LogoutIcon className="h-6 w-6" />
        <span className="absolute left-14 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md py-1 px-2 -translate-y-1/2 top-1/2 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
          Logout
        </span>
      </button>
    </div>
  );
}
