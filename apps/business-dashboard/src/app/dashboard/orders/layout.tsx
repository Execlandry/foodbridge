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
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-200">
        {children}
      </div>
    </div>
  );
}
