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
import TrackOrderPage from "./components/track-order/track-order";
import LeftSideBar from "./components/business-pages/left-side-bar";
import RightSideBar from "./components/business-pages/right-side-bar";
import PaymentPage from "./routes/payments"
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
  const [isRightSideBarOpen, setIsRightSideBarOpen] = useState(true);

  const toggleRightSideBar = () => {
    setIsRightSideBarOpen(!isRightSideBarOpen);
  };

  return (
    <div className="flex flex-row bg-slate-50 min-h-screen">
      {/* Left Sidebar */}
      <LeftSideBar />

      {/* Main Content */}
      <div className="ml-32 w-full flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button
            onClick={toggleRightSideBar}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
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
        <Outlet />
      </div>

      {/* Right Sidebar */}
      <RightSideBar
        isOpen={isRightSideBarOpen}
        toggleSidebar={toggleRightSideBar}
      />
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
            <Route path="payments" element={<BusinessPage />} />
            <Route path="donate" element={<DonatePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
