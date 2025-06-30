"use client";

import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <span className="inline-flex items-center px-3 justify-center h-20 w-full bg-green-50 hover:bg-green-100 focus:bg-green-100 cursor-pointer transition-colors duration-300">
        <div className="flex-shrink-0">
            <h2
              className="text-2xl font-extrabold text-green-600 tracking-tight cursor-pointer hover:text-green-700 transition-colors duration-300 ease-in-out"
              onClick={() => navigate("/")}
            >
              Foodbridge
            </h2>
          </div>
      </span>
    </Link>
  );
};

export default Logo;
