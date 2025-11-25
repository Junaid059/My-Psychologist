'use client'
import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Users, Mail, MessageSquare, Smartphone, Search, Filter } from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  channels: string[];
  targetAudience: string;
  sentAt: string;
  deliveryStats?: {
    totalRecipients: number;
  };
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // Fetch only sent announcements (public-facing)
      const response = await fetch('/api/announcements');

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      } else {
        console.error('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = filterChannel === 'all' || announcement.channels.includes(filterChannel);
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Bell className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              📢 Announcements
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Stay updated with the latest news, updates, and important information from our team
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Channel Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white"
              >
                <option value="all">All Channels</option>
                <option value="email">📧 Email</option>
                <option value="sms">💬 SMS</option>
                <option value="push">🔔 Push Notification</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading announcements...</p>
            </div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-400 mb-2">No announcements found</p>
            <p className="text-slate-500">Check back later for updates and news</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAnnouncements.map((announcement, index) => (
              <div
                key={announcement._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-slate-100 hover:border-blue-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        {announcement.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(announcement.sentAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        {announcement.deliveryStats && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{announcement.deliveryStats.totalRecipients} recipients</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Channels Badge */}
                    <div className="flex gap-2">
                      {announcement.channels.map((channel, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg ${
                            channel === 'email' ? 'bg-blue-100 text-blue-700' :
                            channel === 'sms' ? 'bg-cyan-100 text-cyan-700' :
                            'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {channel === 'email' && <Mail className="w-5 h-5" />}
                          {channel === 'sms' && <MessageSquare className="w-5 h-5" />}
                          {channel === 'push' && <Smartphone className="w-5 h-5" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="prose max-w-none">
                    <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {announcement.message}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Sent {new Date(announcement.sentAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                        {announcement.targetAudience === 'all' ? '👥 All Users' :
                         announcement.targetAudience === 'patients' ? '🏥 Patients' :
                         '👨‍⚕️ Therapists'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bell className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
              <p className="text-blue-100 text-lg">
                Make sure to enable notifications in your settings to receive important updates via email, SMS, and push notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
