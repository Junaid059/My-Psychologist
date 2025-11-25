'use client'
import React, { useState } from 'react';
import { Menu, Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onLogout
}) => {
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationCenter />

        {/* Settings */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-slate-700 font-medium">Admin</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* Dropdown Menu */}
          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm text-slate-800 font-medium">admin@mypsychologist.com</p>
                <p className="text-xs text-slate-500 mt-1">Administrator</p>
              </div>
              <button
                onClick={() => {
                  setProfileDropdown(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
