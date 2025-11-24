'use client'
import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react';

const TherapyCategoryRevenueSection = () => {
  // Revenue by therapy type
  const therapyRevenueData = [
    { category: 'Individual', revenue: 45000, sessions: 180, avgPrice: 250 },
    { category: 'Couples', revenue: 28000, sessions: 80, avgPrice: 350 },
    { category: 'Group', revenue: 15000, sessions: 60, avgPrice: 250 },
    { category: 'Family', revenue: 22000, sessions: 70, avgPrice: 314 },
    { category: 'Teen', revenue: 18000, sessions: 90, avgPrice: 200 },
    { category: 'Crisis', revenue: 12000, sessions: 40, avgPrice: 300 },
  ];

  // Therapy category distribution (pie chart)
  const categoryDistribution = [
    { name: 'Individual', value: 40, color: '#3b82f6' },
    { name: 'Couples', value: 25, color: '#14b8a6' },
    { name: 'Group', value: 13, color: '#8b5cf6' },
    { name: 'Family', value: 12, color: '#f59e0b' },
    { name: 'Teen', value: 7, color: '#ef4444' },
    { name: 'Crisis', value: 3, color: '#ec4899' },
  ];

  // Monthly revenue trend by category
  const monthlyTrendData = [
    { month: 'Jan', Individual: 3200, Couples: 1800, Group: 1000, Family: 1400, Teen: 900, Crisis: 700 },
    { month: 'Feb', Individual: 3500, Couples: 2000, Group: 1100, Family: 1600, Teen: 1000, Crisis: 800 },
    { month: 'Mar', Individual: 3800, Couples: 2200, Group: 1200, Family: 1800, Teen: 1100, Crisis: 900 },
    { month: 'Apr', Individual: 4200, Couples: 2500, Group: 1400, Family: 2000, Teen: 1300, Crisis: 1000 },
    { month: 'May', Individual: 4500, Couples: 2800, Group: 1600, Family: 2200, Teen: 1500, Crisis: 1100 },
    { month: 'Jun', Individual: 4800, Couples: 3100, Group: 1800, Family: 2400, Teen: 1700, Crisis: 1200 },
  ];

  const totalRevenue = therapyRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSessions = therapyRevenueData.reduce((sum, item) => sum + item.sessions, 0);
  const topCategory = therapyRevenueData.sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Revenue by Therapy Category</h2>
        <p className="text-slate-600">Detailed breakdown of revenue across different therapy types and sessions</p>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-900">${(totalRevenue / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-300 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-600 font-medium mb-1">Total Sessions</p>
              <p className="text-3xl font-bold text-teal-900">{totalSessions}</p>
            </div>
            <Users className="w-12 h-12 text-teal-300 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Avg Session Price</p>
              <p className="text-3xl font-bold text-purple-900">${Math.round(totalRevenue / totalSessions)}</p>
            </div>
            <Briefcase className="w-12 h-12 text-purple-300 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium mb-1">Top Category</p>
              <p className="text-2xl font-bold text-amber-900">{topCategory.category}</p>
              <p className="text-sm text-amber-700 mt-1">${(topCategory.revenue / 1000).toFixed(1)}K</p>
            </div>
            <TrendingUp className="w-12 h-12 text-amber-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart - Revenue by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={therapyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryDistribution.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend by Category (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line type="monotone" dataKey="Individual" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            <Line type="monotone" dataKey="Couples" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6' }} />
            <Line type="monotone" dataKey="Group" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
            <Line type="monotone" dataKey="Family" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
            <Line type="monotone" dataKey="Teen" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            <Line type="monotone" dataKey="Crisis" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Sessions</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Avg Price</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {therapyRevenueData.map((item) => (
                <tr key={item.category} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-900 font-medium">{item.category}</td>
                  <td className="text-right py-3 px-4 text-slate-900 font-medium">${item.revenue.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-slate-600">{item.sessions}</td>
                  <td className="text-right py-3 px-4 text-slate-600">${item.avgPrice}</td>
                  <td className="text-right py-3 px-4 text-slate-600">{((item.revenue / totalRevenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TherapyCategoryRevenueSection;
