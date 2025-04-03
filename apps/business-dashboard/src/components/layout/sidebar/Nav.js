"use client";

import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
  CollectionIcon,
  DuplicateIcon,
  FilmIcon,
  PlusCircleIcon,
  LocationMarkerIcon,
  ClockIcon,
  CogIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";

const Nav = ({ sidebarOutsideClick }) => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [subMenuToggleStatus, setSubMenuToggleStatus] = useState(false);

  const sidebarClose = () => {
    setSidebarStatus(false);
  };

  const sidebarOpen = () => {
    setSidebarStatus(true);
  };

  useEffect(() => {
    if (sidebarOutsideClick) {
      setSidebarStatus(false);
    }
  }, [sidebarOutsideClick]);

  return (
    <>
      <nav className="flex flex-col mx-4 my-6 space-y-4">
        <div className="inline-flex items-center justify-center ">
          {sidebarStatus ? (
            <ArrowNarrowLeftIcon
              className="inline-block h-12 cursor-pointer"
              onClick={sidebarClose}
            />
          ) : (
            <ArrowNarrowRightIcon
              className="inline-block h-12 cursor-pointer"
              onClick={sidebarOpen}
            />
          )}
        </div>

        <NavItem
          hrefLink="/dashboard/businesses"
          sidebarStatus={sidebarStatus}
          menuTitle="Business"
          subMenu={false}
          subMenuArray={null}
        >
          <CollectionIcon className="h-10" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/orders"
          sidebarStatus={sidebarStatus}
          menuTitle="Orders"
          subMenu={false}
          subMenuArray={null}
        >
          <DuplicateIcon className="h-10" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/payments"
          sidebarStatus={sidebarStatus}
          menuTitle="Payments"
        >
          <FilmIcon className="h-10" />
        </NavItem>

        {/* New Items */}
        {/* <NavItem
          hrefLink="/dashboard/newlisting"
          sidebarStatus={sidebarStatus}
          menuTitle="New Listing"
        >
          <PlusCircleIcon className="h-10" />
        </NavItem> */}

        <NavItem
          hrefLink="/dashboard/livetracking"
          sidebarStatus={sidebarStatus}
          menuTitle="Live Tracking"
        >
          <LocationMarkerIcon className="h-10" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/pasthistory"
          sidebarStatus={sidebarStatus}
          menuTitle="Past History"
        >
          <ClockIcon className="h-10" />
        </NavItem>

        <NavItem
          hrefLink="/dashboard/usersettings"
          sidebarStatus={sidebarStatus}
          menuTitle="User Setting"
        >
          <CogIcon className="h-10" />
        </NavItem>
      </nav>
    </>
  );
};

export default Nav;
