import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { useState } from "react";
import Home from "./routes/home";
import Header from "./components/landing-page/navbar";
import SignIn from "./routes/signin";
import SignUp from "./routes/signup";
import Search from "./routes/search";
import CheckoutPage from "./routes/checkout";
import LandingPage from "./routes/landing";
import BusinessPage from "./routes/business";
import DonatePage from "./routes/donate";
import SuccessPage from "./routes/success";
import TrackOrderPage from "./routes/track-order";
import LeftSideBar from "./components/business-pages/left-side-bar";
import RightSideBar from "./components/business-pages/right-side-bar";
import PaymentPage from "./routes/payments";
import "./styles/index.css";
import "./styles/tailwind.css";
import { UserContext } from "./hooks/user-context";
import FetchUser from "./hooks/fetch-user";

function Layout() {
  return (
    <>
      <Header />
      <div className="flex flex-col bg-slate-50 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

function AppLayout() {
  const [isRightSideBarOpen, setIsRightSideBarOpen] = useState(false);
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);

  const toggleRightSideBar = () => {
    setIsRightSideBarOpen(!isRightSideBarOpen);
  };

  const toggleLeftSideBar = () => {
    setIsLeftSideBarOpen(!isLeftSideBarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-gray-800">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
        <button
          onClick={toggleLeftSideBar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          {/* Hamburger icon */}
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 6h18M3 12h18M3 18h18"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold">Dashboard</h1>
        <button
          onClick={toggleRightSideBar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          {/* Sidebar toggle icon */}
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isRightSideBarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M3 6h18M3 12h18M3 18h18"
              }
            />
          </svg>
        </button>
      </div>

      {/* Left Sidebar */}
      <div
        className={`${
          isLeftSideBarOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white shadow-md md:shadow-none z-30`}
      >
        <LeftSideBar />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <div className="hidden md:flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <button
            onClick={toggleRightSideBar}
            className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isRightSideBarOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M3 12h18M3 6h18M3 18h18"
                }
              />
            </svg>
          </button>
        </div>

        <div className="rounded-xl p-4 sm:p-6 min-h-[80vh]">
          <Outlet />
        </div>
      </main>

      {/* Right Sidebar */}
      <div
        className={`${
          isRightSideBarOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white shadow-md md:shadow-none z-30`}
      >
        <RightSideBar
          isOpen={isRightSideBarOpen}
          toggleSidebar={toggleRightSideBar}
        />
      </div>
    </div>
  );
}

const App = () => {
  const { user, setUser, isLoading } = FetchUser();

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<LandingPage />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="search" element={<Search />} />
            <Route path="donate" element={<DonatePage />} />
            <Route path="payment-success" element={<SuccessPage />} />
          </Route>
          <Route path="/fbe" element={<AppLayout />}>
            <Route index element={<BusinessPage />} />
            <Route path="business" element={<BusinessPage />} />
            <Route path="business/:id" element={<BusinessPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="track" element={<TrackOrderPage />} />
            <Route path="settings" element={<BusinessPage />} />
            <Route path="chat" element={<BusinessPage />} />
            <Route path="fav" element={<BusinessPage />} />
            <Route path="payments" element={<PaymentPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
