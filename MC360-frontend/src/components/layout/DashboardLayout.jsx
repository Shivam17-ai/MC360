import { useState } from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, role = "patient", user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page Title placeholder */}
          <div className="hidden md:block text-sm text-gray-400 font-medium">
            Welcome back, <span className="text-gray-700 font-semibold">{user?.name || "User"}</span> 👋
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Bell */}
            <button className="relative text-gray-500 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;