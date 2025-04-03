import Header from "../../../auth/Header";
import Login from "../../../auth/login";

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="w-full max-w-2xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <Header
          heading="Login to Your Account"
          paragraph="Don't have an account yet? "
          linkName="Signup"
          linkUrl="/signup"
        />
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Login />
        </div>
      </div>

      {/* Footer (optional) */}
      <footer className="w-full py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}