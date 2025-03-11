"use client";

import { useState } from "react";

export default function LiveTracking() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // Toggle the expand/collapse state
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      {/* Charity Name and Arrow Button */}
      <div
        className="flex items-center justify-between bg-gray-200 p-4 rounded-md cursor-pointer"
        onClick={toggleExpand} // Toggle on click
      >
        <h3 className="text-lg font-semibold">Charity Name</h3>
        <button
          className="transform transition-transform duration-200"
          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expanded Area (Live Tracking Map) */}
      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <div className="w-full h-64 bg-gray-300 rounded-md">
            {/* Here you would embed the map, for now a placeholder */}
            <p className="text-center text-gray-700">
              Live Tracking Map Goes Here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
