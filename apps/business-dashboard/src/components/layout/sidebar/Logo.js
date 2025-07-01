"use client";

import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <span className="inline-flex items-center justify-center h-20 w-full bg-green-50 hover:bg-green-100 focus:bg-green-100 cursor-pointer transition-colors duration-300">
        <svg
          className="h-10 w-10 sm:h-12 sm:w-12"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>FoodBridge Logo</title>
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="#F0FDF4"
            stroke="#15803D"
            strokeWidth="2"
          />
          <text
            x="32"
            y="36"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="#166534"
            fontFamily="'Inter', sans-serif"
          >
            FB
          </text>
          <path
            d="M20 44 C26 38, 38 38, 44 44"
            stroke="#22C55E"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </Link>
  );
};

export default Logo;
