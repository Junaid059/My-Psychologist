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
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';

const RevenueAnalyticsSection = () => {
  // Revenue trend data
  const revenueData = [
    { month: 'Jan', revenue: 8400, target: 10000, expenses: 2400 },
    { month: 'Feb', revenue: 9200, target: 10000, expenses: 2210 },
    { month: 'Mar', revenue: 11000, target: 10000, expenses: 2290 },
    { month: 'Apr', revenue: 13200, target: 10000, expenses: 2000 },
    { month: 'May', revenue: 15800, target: 10000, expenses: 2181 },
    { month: 'Jun', revenue: 18900, target: 10000, expenses: 2500 },
  ];

  // Payment method breakdown
  const paymentMethodData = [
    { name: 'Credit Card', value: 45, color: '#3b82f6' },
    { name: 'Debit Card', value: 25, color: '#14b8a6' },
    { name: 'Bank Transfer', value: 20, color: '#8b5cf6' },
    { name: 'Insurance', value: 10, color: '#f59e0b' },
  ];

  // Session type revenue
  const sessionTypeData = [
    { name: 'Individual', revenue: 8500 },
    { name: 'Couples', revenue: 4200 },
    { name: 'Group', revenue: 2800 },
    { name: 'Crisis', revenue: 1500 },
  ];

  const totalRevenue = 31000;
  const monthlyGrowth = 18.2;
  const revenueVsTarget = ((18900 / 10000) * 100).toFixed(1);
  const averageSessionPrice = Math.round(totalRevenue / 150);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Revenue Analytics</h2>
        <p className="text-slate-600 mt-1">Track and analyze your clinic's revenue performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +{monthlyGrowth.toFixed(1)}%
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">${totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center">
              <Target className="w-6 h-6 text-teal-600" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +{parseFloat(revenueVsTarget) - 100}%
            </div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium">vs Target</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{revenueVsTarget}%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-slate-400 text-xs font-medium">This Month</div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium">Avg. Session Price</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">${averageSessionPrice}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-slate-400 text-xs font-medium">Projected</div>
          </div>
          <h3 className="text-slate-600 text-sm font-medium">End of Year</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">${(totalRevenue * 2).toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
                name="Actual Revenue"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#dc2626' }}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Expenses */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
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
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
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

        {/* Session Type Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue by Session Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sessionTypeData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#1e293b' }}
              />
              <Bar dataKey="revenue" fill="#14b8a6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalyticsSection;
