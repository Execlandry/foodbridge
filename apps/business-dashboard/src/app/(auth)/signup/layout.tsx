"use client"

import React from 'react';
import '../../globals.css';

export default function AuthLayout({ children }:{children:React.ReactNode}) {
  return (
    <html lang="en">
    <head />
    <body className="flex justify-center">
      <div className="w-1/4 m-auto">
      {children} 
      </div>
    </body>
    </html>
  );
}

