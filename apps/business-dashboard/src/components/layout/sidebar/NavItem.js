"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const NavItem = ({
  sidebarStatus,
  menuTitle,
  subMenu = false,
  subMenuArray = [],
  hrefLink = "#",
  children,
}) => {
  const [subMenuToggleStatus, setSubMenuToggleStatus] = useState(false);

  const subMenuToggle = () => {
    if (subMenu) {
      setSubMenuToggleStatus((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!sidebarStatus) {
      setSubMenuToggleStatus(false);
    }
  }, [sidebarStatus]);

  return (
    <div>
      <Link href={hrefLink} passHref>
        <div
          className={`flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 
          ${sidebarStatus ? "justify-start" : "justify-center"} 
          hover:bg-green-100 hover:text-green-800`}
          onClick={subMenuToggle}
        >
          {/* Icon */}
          <span className="text-green-700">{children}</span>

          {/* Menu Title */}
          {sidebarStatus && (
            <span className="text-sm font-medium">{menuTitle}</span>
          )}

          {/* Tooltip when sidebar collapsed */}
          {!sidebarStatus && (
            <span className="absolute left-full ml-2 bg-green-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 whitespace-nowrap">
              {menuTitle}
            </span>
          )}
        </div>
      </Link>

      {/* Submenu items */}
      {subMenu && subMenuToggleStatus && (
        <ul className="ml-6 mt-2 space-y-1 text-sm text-green-700">
          {subMenuArray.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.linkHref}
                className="block px-3 py-1 rounded hover:text-white hover:bg-green-600 transition"
              >
                {item.subMenuTitle}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavItem;
