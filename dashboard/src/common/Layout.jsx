import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header - Always on top */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed Sidebar (20% on desktop, hidden on mobile) */}
        <aside className="w-[20%] bg-[#232E34] text-white hidden md:block overflow-y-auto">
          <Sidebar />
        </aside>

        {/* - Right Area: Takes 100% of remaining space */}
        <main className="w-full md:w-[80%] bg-gray-50 overflow-y-auto">
          <div className="p-4 md:p-6">
            <Outlet />   {/* All your pages (Dashboard, Categories, etc.) appear here */}
          </div>
        </main>
      </div>

      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
}

export default Layout;