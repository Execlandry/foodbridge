"use client";

import { MenuIcon } from "@heroicons/react/solid";
import React from "react";
import LogOutButton from "./header/LogOutButton";
import Notifications from "./header/Notifications";
import SearchBox from "./header/SearchBox";
import UserMenu from "./header/UserMenu";

const Header = ({ mobileNavsidebar, setMobileNavsidebar, user }: any) => {
  return (
    <header className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-8 bg-white shadow-lg border-b border-green-100/50 sticky top-0 z-20">
      {/* Left: Sidebar toggle + search */}
      <div className="flex items-center gap-3 sm:gap-4">
        <MenuIcon
          className="h-7 w-7 sm:h-8 sm:w-8 text-green-600 hover:text-green-700 cursor-pointer hover:scale-110 transition-transform duration-300 sm:hidden"
          onClick={() => setMobileNavsidebar(!mobileNavsidebar)}
        />
        <SearchBox />
      </div>

      {/* Right: User info + notifications + logout */}
      <div className="flex items-center gap-4 sm:gap-6">
        <UserMenu user={user} />
        <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 border-l border-green-200">
          {/* <Notifications /> */}
          <LogOutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
