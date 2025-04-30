"use client";

import React from "react";

const Footer = () => {
  return (
    <div className="text-center bg-green-50/80 py-4 text-green-600 text-sm font-medium w-full fixed bottom-0 z-10">
      <span>© {new Date().getFullYear()} FoodBridge. All rights reserved.</span>
    </div>
  );
};

export default Footer;
