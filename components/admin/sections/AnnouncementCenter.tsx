'use client'
import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, Mail, MessageSquare, Smartphone, Calendar, Plus, Eye, Edit2, Trash2, Search } from 'lucide-react';
import Modal from '@/components/ui/modal';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'patients' | 'therapists';
  channels: ('email' | 'sms' | 'push')[];
  status: 'draft' | 'sent' | 'scheduled' | 'sending';
  scheduledFor?: string;
  sentAt?: string;
  deliveryStats?: {
    totalRecipients: number;
    emailSent: number;
    smsSent: number;
    pushSent: number;
    emailDelivered: number;
    smsDelivered: number;
    pushDelivered: number;
  };
  createdAt: string;
}

const AnnouncementCenter = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'all',
    channels: [] as string[],
    scheduleDate: '',
    scheduleTime: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

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

  const handleCreate = async (sendNow: boolean = false) => {
    if (!formData.title || !formData.message || formData.channels.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const payload: any = {
        title: formData.title,
        message: formData.message,
        channels: formData.channels,
        targetAudience: formData.targetAudience,
        sendNow
      };

      // If scheduling, combine date and time
      if (!sendNow && formData.scheduleDate && formData.scheduleTime) {
        payload.scheduledFor = `${formData.scheduleDate}T${formData.scheduleTime}:00`;
      }

      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(sendNow ? 'Announcement sent successfully!' : 'Announcement created successfully!');
        setShowCreateModal(false);
        setFormData({
          title: '',
          message: '',
          targetAudience: 'all',
          channels: [],
          scheduleDate: '',
          scheduleTime: ''
        });
        fetchAnnouncements();
      } else {
        alert('Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Announcement deleted successfully');
        fetchAnnouncements();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('An error occurred');
    }
  };

  const stats = {
    totalAnnouncements: announcements.length,
    sent: announcements.filter(a => a.status === 'sent').length,
    scheduled: announcements.filter(a => a.status === 'scheduled').length,
    drafts: announcements.filter(a => a.status === 'draft').length
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            📢 Announcements & Notifications
          </h2>
          <p className="text-slate-600 mt-1">Send broadcast messages and push notifications to users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-lg text-white">
          <Bell className="w-10 h-10 text-blue-200 mb-2" />
          <p className="text-blue-100 text-sm font-medium">Total Announcements</p>
          <p className="text-3xl font-bold mt-1">{stats.totalAnnouncements}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white">
          <Send className="w-10 h-10 text-green-200 mb-2" />
          <p className="text-green-100 text-sm font-medium">Sent</p>
          <p className="text-3xl font-bold mt-1">{stats.sent}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-lg text-white">
          <Calendar className="w-10 h-10 text-purple-200 mb-2" />
          <p className="text-purple-100 text-sm font-medium">Scheduled</p>
          <p className="text-3xl font-bold mt-1">{stats.scheduled}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
          <Edit2 className="w-10 h-10 text-yellow-200 mb-2" />
          <p className="text-yellow-100 text-sm font-medium">Drafts</p>
          <p className="text-3xl font-bold mt-1">{stats.drafts}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
        />
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">Loading announcements...</span>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No announcements found
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{announcement.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      announcement.status === 'sent' ? 'bg-green-100 text-green-700' :
                      announcement.status === 'scheduled' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{announcement.message}</p>

                  {/* Announcement Details */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Users className="w-4 h-4" />
                      <span className="capitalize">{announcement.targetAudience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {announcement.channels.map((channel, idx) => (
                        <span key={idx} className={`px-2 py-1 rounded-full text-xs font-bold ${
                          channel === 'email' ? 'bg-blue-100 text-blue-700' :
                          channel === 'sms' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {channel === 'email' && '📧'}
                          {channel === 'sms' && '💬'}
                          {channel === 'push' && '🔔'}
                          {' '}{channel}
                        </span>
                      ))}
                    </div>
                    {announcement.deliveryStats && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <Users className="w-4 h-4" />
                        <span>{announcement.deliveryStats.totalRecipients} recipients</span>
                      </div>
                    )}
                  </div>

                  {announcement.status === 'sent' && announcement.sentAt && (
                    <p className="text-xs text-slate-500 mt-2">
                      Sent: {new Date(announcement.sentAt).toLocaleString()}
                      {announcement.deliveryStats && ` • Delivered: ${
                        (announcement.deliveryStats.emailDelivered || 0) + 
                        (announcement.deliveryStats.smsDelivered || 0) + 
                        (announcement.deliveryStats.pushDelivered || 0)
                      }/${announcement.deliveryStats.totalRecipients}`}
                    </p>
                  )}

                {announcement.status === 'scheduled' && announcement.scheduledFor && (
                  <p className="text-xs text-purple-600 mt-2 font-medium">
                    📅 Scheduled for: {new Date(announcement.scheduledFor).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Eye className="w-5 h-5" />
                </button>
                {announcement.status === 'draft' && (
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(announcement._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))
        )}
      </div>      {/* Create Announcement Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="📢 Create New Announcement"
        maxWidth="2xl"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Announcement Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., New Services Available"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Message Content *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={6}
              placeholder="Write your announcement message here..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">
              Characters: {formData.message.length} • SMS limit: 160
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience *</label>
            <select
              value={formData.targetAudience}
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
            >
              <option value="all">👥 All Users (Patients + Therapists)</option>
              <option value="patients">🏥 Patients Only</option>
              <option value="therapists">👨‍⚕️ Therapists Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Notification Channels *</label>
            <div className="grid grid-cols-3 gap-4">
              <div
                onClick={() => handleChannelToggle('email')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.channels.includes('email')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail className={`w-6 h-6 ${formData.channels.includes('email') ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Email</p>
                    <p className="text-xs text-slate-500">Send via email</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleChannelToggle('sms')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.channels.includes('sms')
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-6 h-6 ${formData.channels.includes('sms') ? 'text-green-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">SMS</p>
                    <p className="text-xs text-slate-500">Text message</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleChannelToggle('push')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.channels.includes('push')
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className={`w-6 h-6 ${formData.channels.includes('push') ? 'text-purple-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Push</p>
                    <p className="text-xs text-slate-500">App notification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Schedule Date (Optional)</label>
              <input
                type="date"
                value={formData.scheduleDate}
                onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Schedule Time (Optional)</label>
              <input
                type="time"
                value={formData.scheduleTime}
                onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => handleCreate(true)}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              📤 Send Now
            </button>
            <button 
              onClick={() => handleCreate(false)}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              📅 {formData.scheduleDate ? 'Schedule' : 'Save as Draft'}
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnnouncementCenter;
