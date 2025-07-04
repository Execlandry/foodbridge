"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <section className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8 sm:p-10 transition-all duration-300">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Title + Subheading */}
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Business Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-500 font-medium">
                Monitor and manage your business operations seamlessly
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/businesses/add"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-green-700 border border-green-600 rounded-full bg-gradient-to-r from-green-50 to-white hover:from-white hover:to-green-50 transition-shadow shadow-sm hover:shadow-md focus:ring-2 focus:ring-green-400"
              >
                <svg
                  className="h-5 w-5 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-shadow shadow-md"
              >
                <svg
                  className="h-5 w-5 mr-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
        </section>

        {/* Main Content */}
        <section className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8 sm:p-10 transition-all duration-300">
          {children}
        </section>
      </div>
    </div>
  );
}
