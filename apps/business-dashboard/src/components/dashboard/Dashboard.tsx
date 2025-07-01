"use client";

import React from "react";

const Dashboard = ({ user }: any) => {
  console.log(user);
  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-green-50/50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-green-900 tracking-tight">
              Dashboard
            </h1>
            <h2 className="text-green-700/80 text-sm sm:text-base mt-1">
              FoodBridge Management Overview
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-4">
            <button className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 border border-green-600 rounded-lg text-sm font-semibold transition-colors duration-300">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 h-5 w-5 -ml-1 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Manage Dashboard
            </button>
            <button className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors duration-300">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 h-5 w-5 -ml-1 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Dashboard
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-14 sm:w-14 text-green-600 bg-green-100 rounded-full mr-4">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-green-900">
                62
              </span>
              <span className="block text-green-700/80 text-sm">Partners</span>
            </div>
          </div>
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-14 sm:w-14 text-green-600 bg-green-100 rounded-full mr-4">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-green-900">
                6.8
              </span>
              <span className="block text-green-700/80 text-sm">
                Average Rating
              </span>
            </div>
          </div>
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-14 sm:w-14 text-red-600 bg-red-100 rounded-full mr-4">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <div>
              <span className="inline-block text-xl sm:text-2xl font-bold text-green-900">
                9
              </span>
              <span className="inline-block text-lg text-green-700/80 font-semibold ml-2">
                (14%)
              </span>
              <span className="block text-green-700/80 text-sm">
                Pending Deliveries
              </span>
            </div>
          </div>
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-14 sm:w-14 text-green-600 bg-green-100 rounded-full mr-4">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-green-900">
                83%
              </span>
              <span className="block text-green-700/80 text-sm">
                Completed Orders
              </span>
            </div>
          </div>
        </section>

        {/* Charts and Lists Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-4 sm:gap-6">
          <div className="flex flex-col md:col-span-2 md:row-span-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-5 font-semibold text-green-900 border-b border-green-100">
              Monthly Partner Activity
            </div>
            <div className="p-4 flex-grow">
              <div className="flex items-center justify-center h-full px-4 py-12 sm:py-16 text-green-600 text-xl sm:text-2xl font-semibold bg-green-50 border-2 border-green-100 border-dashed rounded-lg">
                Activity Chart
              </div>
            </div>
          </div>
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-14 sm:w-14 text-green-600 bg-green-100 rounded-full mr-4">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path
                  fill="#fff"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-green-900">
                25
              </span>
              <span className="block text-green-700/80 text-sm">
                Pending Tasks
              </span>
            </div>
          </div>
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 sm:h-14 sm:w-14 text-green-600 bg-green-100 rounded-full mr-4">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8 decembrie 4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-green-900">
                139
              </span>
              <span className="block text-green-700/80 text-sm">
                Hours on Operations
              </span>
            </div>
          </div>

          <div className="row-span-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between px-6 py-5 font-semibold text-green-900 border-b border-green-100">
              <span>Top Partners by Performance</span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md px-2 py-1 bg-green-50 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-100 transition-colors duration-300"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
              >
                Descending
                <svg
                  className="-mr-1 ml-1 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
              <ul className="p-6 space-y-4">
                {[
                  {
                    name: "Annette Watson",
                    score: 9.3,
                    img: "https://randomuser.me/api/portraits/women/82.jpg",
                  },
                  {
                    name: "Calvin Steward",
                    score: 8.9,
                    img: "https://randomuser.me/api/portraits/men/81.jpg",
                  },
                  {
                    name: "Ralph Richards",
                    score: 8.7,
                    img: "https://randomuser.me/api/portraits/men/80.jpg",
                  },
                  {
                    name: "Bernard Murphy",
                    score: 8.2,
                    img: "https://randomuser.me/api/portraits/men/79.jpg",
                  },
                  {
                    name: "Arlene Robertson",
                    score: 8.2,
                    img: "https://randomuser.me/api/portraits/women/78.jpg",
                  },
                  {
                    name: "Jane Lane",
                    score: 8.1,
                    img: "https://randomuser.me/api/portraits/women/77.jpg",
                  },
                  {
                    name: "Pat Mckinney",
                    score: 7.9,
                    img: "https://randomuser.me/api/portraits/men/76.jpg",
                  },
                  {
                    name: "Norman Walters",
                    score: 7.7,
                    img: "https://randomuser.me/api/portraits/men/75.jpg",
                  },
                ].map((partner, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-10 w-10 mr-3 bg-green-50 rounded-full overflow-hidden">
                      <img
                        src={partner.img}
                        alt={`${partner.name} profile picture`}
                      />
                    </div>
                    <span className="text-green-900 font-medium">
                      {partner.name}
                    </span>
                    <span className="ml-auto font-semibold text-green-600">
                      {partner.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col row-span-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-5 font-semibold text-green-900 border-b border-green-100">
              Partners by Activity Type
            </div>
            <div className="p-4 flex-grow">
              <div className="flex items-center justify-center h-full px-4 py-12 sm:py-24 text-green-600 text-xl sm:text-2xl font-semibold bg-green-50 border-2 border-green-100 border-dashed rounded-lg">
                Activity Type Chart
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
