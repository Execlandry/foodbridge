"use client";

import React from "react";
import FoodListing from "../layout/foodlisting";
import UserCard from "../layout/usercard";

const Dashboard = () => {
  return (
    <>
      <main className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
          <h2 className="text-gray-600 ml-0.5">Summary</h2>
        </div>
        <div className="flex flex-wrap items-start justify-end -mb-3">
          <a className="inline-flex px-5 py-3 text-white bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 rounded-md ml-6 mb-3" href="/newlisting">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create new listing
          </a>
        </div>
      </div>
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        <div className="w-full  flex flex-col gap-8">
          {/* statistics */}
          <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="Completed" />
            <UserCard type="Cancelled" />
            <UserCard type="Currently Listed" />
            <UserCard type="Pending" />
          </div>
          
          {/* foodlisting table */}
          <div className="flex gap-4 flex-col lg:flex-row bg-white">
            <FoodListing />
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default Dashboard;
