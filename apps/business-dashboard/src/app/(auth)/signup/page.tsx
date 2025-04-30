"use client";

import Header from "../../../auth/Header";
import Signup from "../../../auth/Signup";

export default function SignupPage() {
  return (
    <div className="max-h-screen flex flex-col bg-gradient-to-b from-green-50/50 to-white">
      {/* Header Section */}
      <div className="w-full max-w-4xl mx-auto backdrop:px-4 sm:px-6 lg:px-8">
        <Header
          heading="Signup to Create an Account"
          paragraph="Already have an account?"
          linkName="Login"
          linkUrl="/"
        />
      </div>

      {/* Signup Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-xl p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:scale-[1.02]">
          <Signup />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-green-600 text-sm bg-green-50/50">
        <p className="font-medium">
          © {new Date().getFullYear()} FoodBridge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
