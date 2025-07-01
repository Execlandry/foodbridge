"use client";

import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
  CollectionIcon,
  DuplicateIcon,
  FilmIcon,
  LocationMarkerIcon,
  ClockIcon,
  CogIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";

const Nav = ({ sidebarOutsideClick }) => {
  const [sidebarStatus, setSidebarStatus] = useState(true);

  useEffect(() => {
    if (sidebarOutsideClick) {
      setSidebarStatus(false);
    }
  }, [sidebarOutsideClick]);

  return (
    <nav
      className={`h-full bg-green-50/50 transition-all duration-300 ${
        sidebarStatus ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full px-3 py-6 space-y-2">
        {/* Toggle button */}
        <div className="flex justify-end">
          {sidebarStatus ? (
            <button
              className="p-1 rounded-full hover:bg-green-100 transition-colors duration-300"
              onClick={() => setSidebarStatus(false)}
            >
              <ArrowNarrowLeftIcon className="h-5 w-5 text-green-600 hover:text-green-700 transition-transform duration-300" />
            </button>
          ) : (
            <button
              className="p-1 rounded-full hover:bg-green-100 transition-colors duration-300"
              onClick={() => setSidebarStatus(true)}
            >
              <ArrowNarrowRightIcon className="h-5 w-5 text-green-600 hover:text-green-700 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <NavItem
          hrefLink="/dashboard/businesses"
          sidebarStatus={sidebarStatus}
          menuTitle="Businesses"
        >
          <CollectionIcon className="h-5 w-5 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/orders"
          sidebarStatus={sidebarStatus}
          menuTitle="Orders"
        >
          <DuplicateIcon className="h-5 w-5 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/payments"
          sidebarStatus={sidebarStatus}
          menuTitle="Payments"
        >
          <FilmIcon className="h-5 w-5 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/livetracking"
          sidebarStatus={sidebarStatus}
          menuTitle="Live Tracking"
        >
          <LocationMarkerIcon className="h-5 w-5 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/pasthistory"
          sidebarStatus={sidebarStatus}
          menuTitle="Past History"
        >
          <ClockIcon className="h-5 w-5 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/usersettings"
          sidebarStatus={sidebarStatus}
          menuTitle="User Settings"
        >
          <CogIcon className="h-5 w-5 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
        </NavItem>
      </div>
    </nav>
  );
};

export default Nav;
