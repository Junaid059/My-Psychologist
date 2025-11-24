'use client'
import React, { useState } from 'react';
import { LogOut, Menu, X, Bell, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHome from './sections/DashboardHome';
import UsersSection from './sections/UsersSection';
import BookingsSection from './sections/BookingsSection';
import AppointmentsSection from './sections/AppointmentsSection';
import TherapistsSection from './sections/TherapistsSection';
import RevenueAnalyticsSection from './sections/RevenueAnalyticsSection';
import ReportsSection from './sections/ReportsSection';
import TherapyCategoryRevenueSection from './sections/TherapyCategoryRevenueSection';
import EmployeeManagementSection from './sections/EmployeeManagementSection';
import AppointmentManagementSection from './sections/AppointmentManagementSection';

type Section = 'home' | 'users' | 'bookings' | 'appointments' | 'therapists' | 'revenue' | 'reports' | 'therapyRevenue' | 'employees' | 'appointmentMgmt';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/login');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UsersSection />;
      case 'bookings':
        return <BookingsSection />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'therapists':
        return <TherapistsSection />;
      case 'revenue':
        return <RevenueAnalyticsSection />;
      case 'therapyRevenue':
        return <TherapyCategoryRevenueSection />;
      case 'employees':
        return <EmployeeManagementSection />;
      case 'appointmentMgmt':
        return <AppointmentManagementSection />;
      case 'reports':
        return <ReportsSection />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        sidebarOpen={sidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
