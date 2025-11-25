'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, DollarSign, AlertCircle, CheckCircle, XCircle, RefreshCw, Search } from 'lucide-react';
import Modal from '@/components/ui/modal';

interface Session {
  _id: string;
  appointmentId: any;
  userId: any;
  employeeId: any;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  cancellationReason?: string;
  refundStatus?: 'none' | 'pending' | 'processed';
  refundAmount?: number;
  notes?: string;
  createdAt: string;
}

const SessionManagementSection = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        // Map appointments to session format
        const sessionsData = data.appointments.map((apt: any) => ({
          _id: apt._id,
          appointmentId: apt._id,
          userId: apt.userId,
          employeeId: apt.employeeId,
          sessionDate: apt.appointmentDate,
          sessionTime: apt.appointmentTime,
          duration: 60, // default duration
          status: apt.status,
          cancellationReason: apt.cancellationReason,
          refundStatus: apt.refundStatus || 'none',
          refundAmount: apt.refundAmount || 0,
          notes: apt.notes,
          createdAt: apt.createdAt
        }));
        setSessions(sessionsData);
      }
    } catch (err) {
      console.error('Failed to fetch sessions');
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = (session: Session) => {
    setSelectedSession(session);
    setRefundAmount(0);
    setCancellationReason('');
    setShowCancelModal(true);
  };

  const processCancellation = async () => {
    if (!selectedSession) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/appointments/${selectedSession._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'cancelled',
          cancellationReason,
          refundStatus: refundAmount > 0 ? 'pending' : 'none',
          refundAmount
        })
      });

      if (response.ok) {
        setSuccess('Session cancelled successfully!');
        fetchSessions();
        setShowCancelModal(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to cancel session');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleReschedule = async (sessionId: string) => {
    // This would open a reschedule modal
    alert('Reschedule feature - coming soon!');
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.employeeId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
    noShow: sessions.filter(s => s.status === 'no-show').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          📅 Session & Cancellation Management
        </h2>
        <p className="text-slate-600 mt-1">Manage therapy sessions, cancellations, and refunds</p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-blue-100 text-sm font-medium">Total Sessions</p>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-yellow-100 text-sm font-medium">Scheduled</p>
          <p className="text-3xl font-bold mt-2">{stats.scheduled}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-green-100 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold mt-2">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-red-100 text-sm font-medium">Cancelled</p>
          <p className="text-3xl font-bold mt-2">{stats.cancelled}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-gray-100 text-sm font-medium">No-Show</p>
          <p className="text-3xl font-bold mt-2">{stats.noShow}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-Show</option>
        </select>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Therapist</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Refund</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.map((session) => (
                <tr key={session._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">
                        {session.userId?.firstName} {session.userId?.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {session.employeeId?.firstName} {session.employeeId?.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm text-slate-900">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {session.sessionDate ? new Date(session.sessionDate).toLocaleDateString() : '-'}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {session.sessionTime || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      session.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                      session.status === 'completed' ? 'bg-green-100 text-green-700' :
                      session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {session.refundStatus && session.refundStatus !== 'none' ? (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          ${session.refundAmount || 0}
                        </span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                          session.refundStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {session.refundStatus}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {session.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleReschedule(session._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Reschedule"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelSession(session)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="❌ Cancel Session"
        maxWidth="lg"
      >
        <div className="space-y-5">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Cancelling this session will notify the client and therapist.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Cancellation Reason *</label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              rows={3}
              placeholder="e.g., Therapist unavailable, Client request, Emergency..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Refund Amount ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="0.00"
            />
            <p className="text-xs text-slate-500 mt-1">
              Leave 0 for no refund. Full/partial refunds will be processed.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={processCancellation}
              disabled={!cancellationReason}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ❌ Confirm Cancellation
            </button>
            <button
              onClick={() => setShowCancelModal(false)}
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

export default SessionManagementSection;
