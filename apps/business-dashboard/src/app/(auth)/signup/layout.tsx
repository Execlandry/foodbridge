"use client";

import "../../globals.css";

export default function AuthLayout({ children }: any) {
  return (
    <html lang="en">
      <head />
      <body className="flex justify-center min-h-screen bg-gradient-to-b from-green-50/50 to-white">
        <div className="w-full max-w-md px-4 sm:px-6 md:max-w-lg lg:max-w-xl m-auto py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
