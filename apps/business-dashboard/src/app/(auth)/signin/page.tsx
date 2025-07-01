import Header from "../../../auth/Header";
import Login from "../../../auth/login";

export default async function LoginPage() {
  return (
    <div className="max-h-screen flex flex-col bg-gradient-to-b from-green-50/80 to-white">
      {/* Header Section */}
      <div className="w-full max-w-4xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <Header
          heading="Login to Your Account"
          paragraph="Don't have an account yet?"
          linkName="Signup"
          linkUrl="/signup"
        />
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-2xl p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:scale-[1.02]">
          <Login />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-green-600 text-sm bg-green-50/80">
        <p className="font-medium tracking-tight">
          © {new Date().getFullYear()} FoodBridge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
