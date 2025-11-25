'use client'
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Download, Filter } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    completionRate: 0,
    avgSessionDuration: 0
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<any[]>([]);
  const [topTherapists, setTopTherapists] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setMonthlyData(data.monthlyData);
        setTopServices(data.topServices);
        setTopTherapists(data.topTherapists);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📊 Analytics & Reports
          </h2>
          <p className="text-slate-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-slate-600 mt-4">Loading analytics...</p>
        </div>
      ) : (
        <>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white">
          <Users className="w-8 h-8 text-blue-200 mb-2" />
          <p className="text-blue-100 text-xs font-medium">Total Users</p>
          <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl shadow-lg text-white">
          <TrendingUp className="w-8 h-8 text-green-200 mb-2" />
          <p className="text-green-100 text-xs font-medium">Active Users</p>
          <p className="text-3xl font-bold mt-1">{stats.activeUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-5 rounded-2xl shadow-lg text-white">
          <Calendar className="w-8 h-8 text-purple-200 mb-2" />
          <p className="text-purple-100 text-xs font-medium">Total Bookings</p>
          <p className="text-3xl font-bold mt-1">{stats.totalBookings}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-5 rounded-2xl shadow-lg text-white">
          <DollarSign className="w-8 h-8 text-yellow-200 mb-2" />
          <p className="text-yellow-100 text-xs font-medium">Revenue</p>
          <p className="text-3xl font-bold mt-1">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-5 rounded-2xl shadow-lg text-white">
          <BarChart3 className="w-8 h-8 text-teal-200 mb-2" />
          <p className="text-teal-100 text-xs font-medium">Completion Rate</p>
          <p className="text-3xl font-bold mt-1">{stats.completionRate}%</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-5 rounded-2xl shadow-lg text-white">
          <Calendar className="w-8 h-8 text-red-200 mb-2" />
          <p className="text-red-100 text-xs font-medium">Avg Duration</p>
          <p className="text-3xl font-bold mt-1">{stats.avgSessionDuration}m</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Revenue Trend
          </h3>
          <div className="space-y-3">
            {monthlyData.map((data, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{data.month}</span>
                  <span className="text-sm font-bold text-green-600">${data.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            User Growth
          </h3>
          <div className="space-y-3">
            {monthlyData.map((data, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{data.month}</span>
                  <span className="text-sm font-bold text-blue-600">+{data.users} users</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(data.users / 31) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Top Services
          </h3>
          <div className="space-y-3">
            {topServices.map((service, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{service.name}</p>
                  <p className="text-xs text-slate-600">{service.count} sessions</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${service.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Therapists */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top Therapists
          </h3>
          <div className="space-y-3">
            {topTherapists.map((therapist, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{therapist.name}</p>
                  <p className="text-xs text-slate-600">{therapist.sessions} sessions</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <p className="font-bold text-slate-800">{therapist.rating}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          Monthly Booking Trends
        </h3>
        <div className="flex items-end gap-4 h-64">
          {monthlyData.map((data, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gradient-to-t from-teal-500 to-cyan-500 rounded-t-lg hover:from-teal-600 hover:to-cyan-600 transition-all cursor-pointer relative group"
                   style={{ height: `${(data.bookings / 52) * 100}%` }}>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {data.bookings} bookings
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-600">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
