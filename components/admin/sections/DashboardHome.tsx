'use client'
import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';

// Sample data
const appointmentsData = [
  { month: 'Jan', appointments: 120, completed: 100, cancelled: 20 },
  { month: 'Feb', appointments: 145, completed: 130, cancelled: 15 },
  { month: 'Mar', appointments: 165, completed: 150, cancelled: 15 },
  { month: 'Apr', appointments: 190, completed: 175, cancelled: 15 },
  { month: 'May', appointments: 210, completed: 195, cancelled: 15 },
  { month: 'Jun', appointments: 240, completed: 220, cancelled: 20 },
];

const therapyTypesData = [
  { name: 'Individual Therapy', value: 45, color: '#a855f7' },
  { name: 'Couples Therapy', value: 25, color: '#06b6d4' },
  { name: 'Group Sessions', value: 20, color: '#ec4899' },
  { name: 'Crisis Support', value: 10, color: '#f59e0b' },
];

const bookingStatusData = [
  { month: 'Jan', confirmed: 95, pending: 20, cancelled: 5 },
  { month: 'Feb', confirmed: 115, pending: 25, cancelled: 5 },
  { month: 'Mar', confirmed: 135, pending: 25, cancelled: 5 },
  { month: 'Apr', confirmed: 160, pending: 25, cancelled: 5 },
  { month: 'May', confirmed: 185, pending: 20, cancelled: 5 },
  { month: 'Jun', confirmed: 210, pending: 25, cancelled: 5 },
];

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="1,245"
          change="+12%"
          icon={Users}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total Bookings"
          value="892"
          change="+8%"
          icon={Calendar}
          color="from-cyan-500 to-blue-600"
        />
        <StatCard
          title="Appointments Today"
          value="28"
          change="+15%"
          icon={Clock}
          color="from-pink-500 to-rose-600"
        />
        <StatCard
          title="Avg. Satisfaction"
          value="4.8/5"
          change="+2%"
          icon={TrendingUp}
          color="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Appointments Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#1e293b' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6' }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Therapy Types Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Therapy Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={therapyTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {therapyTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#1e293b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Booking Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#1e293b' }}
              />
              <Legend />
              <Bar dataKey="confirmed" stackId="a" fill="#10b981" />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
              <Bar dataKey="cancelled" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardHome;
