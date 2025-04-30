"use client";

import React, { Fragment } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Business Dashboard
              </h1>
              <h2 className="text-gray-600 text-lg">
                Manage your business operations
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard/businesses/add"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-green-700 border border-green-600 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="flex-shrink-0 h-5 w-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Add Business
              </Link>
              <Link
                href="/dashboard/businesses"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="flex-shrink-0 h-5 w-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                View Businesses
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}
