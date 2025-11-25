'use client'
import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Calendar, User, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'appointment' | 'user';
  message: string;
  time: string;
  read: boolean;
}

const NotificationCenter = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch initial notifications
    fetchNotifications();
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // In a real app, this would be an API call
      // For now, we'll create simulated notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'booking',
          message: 'New booking from John Doe for Anxiety Therapy',
          time: new Date(Date.now() - 5 * 60000).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'appointment',
          message: 'Appointment scheduled with Dr. Smith at 3:00 PM',
          time: new Date(Date.now() - 15 * 60000).toISOString(),
          read: false
        },
        {
          id: '3',
          type: 'user',
          message: 'New user registration: sarah.johnson@email.com',
          time: new Date(Date.now() - 30 * 60000).toISOString(),
          read: true
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'appointment':
        return <Clock className="w-5 h-5 text-green-500" />;
      case 'user':
        return <User className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getTimeAgo = (time: string) => {
    const diff = Date.now() - new Date(time).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Notifications</h3>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mt-2 text-sm text-white/90 hover:text-white underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 cursor-pointer transition-colors ${
                        notif.read 
                          ? 'bg-white hover:bg-slate-50' 
                          : 'bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notif.read ? 'text-slate-700' : 'text-slate-900 font-semibold'}`}>
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">
                              {getTimeAgo(notif.time)}
                            </span>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                        {notif.read && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-3 bg-slate-50">
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
