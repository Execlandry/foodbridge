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
  const user = session?.user;

  return (
    <div className="min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto border-gray-200 p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
