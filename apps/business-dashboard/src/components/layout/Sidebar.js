"use client";

import React, { useRef } from "react";
import OutsideClick from "../../utils/outsideClick";
import Nav from "./sidebar/Nav";

const Sidebar = ({ mobileNavsidebar }) => {
  const sidebarRef = useRef(null);
  const sidebarOutsideClick = OutsideClick(sidebarRef);

  return (
    <aside
      className={`${
        mobileNavsidebar ? "block" : "hidden"
      } sm:flex sm:flex-col z-50`}
      ref={sidebarRef}
    >
      <div className="flex-grow flex flex-col justify-between">
        <Nav sidebarOutsideClick={sidebarOutsideClick} />
      </div>
    </aside>
  );
};

export default Sidebar;
