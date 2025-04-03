import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Home from './routes/home';
import Header from './components/landing-page/navbar';
import SignIn from './routes/signin';
import SignUp from './routes/signup';
import Search from './routes/search';
import CheckoutPage from "./routes/checkout"

import LandingPage from "./routes/landing";
import BusinessPage from "./routes/business";

import './styles/index.css';
import './styles/tailwind.css';
import { useState } from 'react';
import { UserContext } from './hooks/user-context';
import FetchUser from './hooks/fetch-user';
import LeftSideBar from './components/business-pages/left-side-bar';
import RightSideBar from './components/business-pages/right-side-bar';
import TrackOrderPage from './components/track-order/track-order';

{/* Left side bar */}

function Layout() {
  return (
    <>
      <Header />
      <div className="flex flex-col bg-slate-50">
      <Outlet />
    </div>
</>

  );
}

function AppLayout(){
  return (
    <div className="flex flex-row bg-slate-50">
    {/* Left side bar */}
    <LeftSideBar />

    {/* Middle Section for children */}
    <div className=" ml-32 w-full">
      <Outlet />
    </div>

   <RightSideBar />
    {/* Right side bar */}
</div>
  )
}

const App = () => {

  const { 
    user, 
    setUser, 
    isLoading } = FetchUser();
  return (
    
    <UserContext.Provider value={{user, 
      setUser, 
      isLoading}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route path="/fbe" element={<AppLayout />}>
          <Route path="" element={<BusinessPage />} />
          <Route path="business" element={<BusinessPage />} />
          <Route path="business/:id" element={<BusinessPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track" element={<TrackOrderPage />} />
          <Route path="settings" element={<BusinessPage />} />
          <Route path="chat" element={<BusinessPage />} />
          <Route path="fav" element={<BusinessPage />} />
          <Route path="payments" element={<BusinessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
