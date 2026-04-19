import React from "react";
import Logo from "../components/Logo";
import { Outlet } from "react-router";

const Authlayout = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col p-6 bg-base-100">
      {/* Top Logo - Fixed at the top left */}
      <div className="m-1">
        <Logo />
      </div>

      {/* Main Container - Split Screen */}
      <div className="flex flex-1 items-center justify-center lg:grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto w-full">
        {/* Left Side: Form (Outlet) */}
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>

        {/* Right Side: Image (Visible only on Large screens) */}
        <div className="hidden lg:block h-full max-h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
            alt="Club Community"
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Authlayout;
