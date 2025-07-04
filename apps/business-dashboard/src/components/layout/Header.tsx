"use client";

import { MenuIcon } from "@heroicons/react/solid";
import React from "react";
import LogOutButton from "./header/LogOutButton";
import Notifications from "./header/Notifications";
import UserMenu from "./header/UserMenu";
import Logo from "./sidebar/Logo";

const Header = ({
  mobileNavsidebar,
  setMobileNavsidebar,
  user,
}: {
  mobileNavsidebar: boolean;
  setMobileNavsidebar: (state: boolean) => void;
  user: any;
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-green-100/50 shadow-sm px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
      {/* Left: Sidebar toggle + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileNavsidebar(!mobileNavsidebar)}
          className="sm:hidden p-1 rounded-md text-green-600 hover:text-green-700 transition-transform hover:scale-110 focus:outline-none"
        >
          <MenuIcon className="w-7 h-7" />
        </button>
        <Logo />
      </div>

      {/* Right: User info + logout */}
      <div className="flex items-center gap-4 sm:gap-6">
        <UserMenu user={user} />
        <div className="flex items-center gap-2 sm:gap-4 pl-4 border-l border-green-200">
          {/* Uncomment when ready */}
          {/* <Notifications /> */}
          <LogOutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
