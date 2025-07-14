"use client";

import "../globals.css";

import React, { useState } from "react";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { useSession } from "next-auth/react";

export default function RootLayout({ children }: any) {
  const [mobileNavsidebar, setMobileNavsidebar] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <html lang="en">
      <head />
      <body className="overflow-x-hidden bg-gray-100 text-gray-900 antialiased">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header
            user={user}
            mobileNavsidebar={mobileNavsidebar}
            setMobileNavsidebar={setMobileNavsidebar}
          />

          {/* Main Content Layout */}
          <div className="flex flex-1 relative isolate overflow-hidden">
            {/* Sidebar: Slide-out on mobile, static on desktop */}
            <div
              className={`fixed top-0 bg-white/80 left-0 h-full z-50 transition-transform duration-300 ease-in-out shadow-md
                sm:static sm:translate-x-0 sm:h-auto sm:shadow-none 
                ${mobileNavsidebar ? "translate-x-0" : "-translate-x-full"}
              `}
            >
              <Sidebar mobileNavsidebar={mobileNavsidebar} />
            </div>

            {/* Overlay on mobile to close sidebar */}
            {mobileNavsidebar && (
              <div
                className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                onClick={() => setMobileNavsidebar(false)}
              />
            )}

            {/* Main Page Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
