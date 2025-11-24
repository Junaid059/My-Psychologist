'use client'
import React from 'react';
import { LayoutDashboard, Users, Calendar, Clock, LogOut, Heart, Stethoscope, TrendingUp, FileText, DollarSign, Briefcase } from 'lucide-react';

type Section = 'home' | 'users' | 'bookings' | 'appointments' | 'therapists' | 'revenue' | 'reports' | 'therapyRevenue' | 'employees' | 'appointmentMgmt';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  sidebarOpen: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  sidebarOpen,
  onLogout
}) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'appointments', label: 'Appointments', icon: Clock },
    { id: 'therapists', label: 'Therapists', icon: Stethoscope },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'therapyRevenue', label: 'Revenue by Type', icon: DollarSign },
    { id: 'employees', label: 'Employees', icon: Briefcase },
    { id: 'appointmentMgmt', label: 'Appointment Mgmt', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div className="text-slate-800">
              <p className="font-bold text-sm">MyPsych</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id as Section)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 text-blue-700'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
