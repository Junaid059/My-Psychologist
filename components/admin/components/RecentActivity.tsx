'use client'
import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    { id: 1, user: 'Sarah Chen', action: 'Booked appointment', status: 'confirmed', time: '2 hours ago' },
    { id: 2, user: 'Michael R.', action: 'Completed session', status: 'completed', time: '3 hours ago' },
    { id: 3, user: 'Emma T.', action: 'Cancelled booking', status: 'cancelled', time: '5 hours ago' },
    { id: 4, user: 'James Wilson', action: 'Pending approval', status: 'pending', time: '1 hour ago' },
    { id: 5, user: 'Lisa Anderson', action: 'Rescheduled session', status: 'confirmed', time: '30 min ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
          >
            {getStatusIcon(activity.status)}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{activity.user}</p>
              <p className="text-xs text-slate-500">{activity.action}</p>
            </div>
            <p className="text-xs text-slate-500">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
