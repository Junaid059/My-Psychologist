'use client'
import React, { useState, useEffect } from 'react';
import { MessageSquare, Flag, AlertTriangle, CheckCircle, XCircle, Eye, UserX, MessageCircle, Search } from 'lucide-react';
import Modal from '@/components/ui/modal';

interface Report {
  _id: string;
  type: 'post' | 'comment' | 'user';
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  reporter?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reportedUser?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
  };
  action?: string;
  notes?: string;
}

const ModerationSection = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'forums' | 'actions'>('reports');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        console.error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    resolvedReports: reports.filter(r => r.status === 'resolved').length,
    dismissedReports: reports.filter(r => r.status === 'dismissed').length
  };

  const handleTakeAction = (report: Report) => {
    setSelectedReport(report);
    setSelectedAction('');
    setActionNotes('');
    setShowActionModal(true);
  };

  const executeAction = async () => {
    if (!selectedReport || !selectedAction) {
      alert('Please select an action');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/reports/${selectedReport._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: selectedAction,
          status: selectedAction === 'dismiss' ? 'dismissed' : 'resolved',
          notes: actionNotes
        })
      });

      if (response.ok) {
        alert('Action executed successfully');
        setShowActionModal(false);
        setSelectedReport(null);
        setSelectedAction('');
        setActionNotes('');
        fetchReports(); // Refresh the list
      } else {
        alert('Failed to execute action');
      }
    } catch (error) {
      console.error('Error executing action:', error);
      alert('An error occurred');
    }
  };

  const filteredReports = reports.filter(report => {
    const searchLower = searchTerm.toLowerCase();
    const reportedUserName = report.reportedUser 
      ? `${report.reportedUser.firstName} ${report.reportedUser.lastName}`.toLowerCase()
      : '';
    const reporterName = report.reporter
      ? `${report.reporter.firstName} ${report.reporter.lastName}`.toLowerCase()
      : '';
    
    return (
      reportedUserName.includes(searchLower) ||
      reporterName.includes(searchLower) ||
      report.description.toLowerCase().includes(searchLower) ||
      report.reason.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          👮 Community Moderation
        </h2>
        <p className="text-slate-600 mt-1">Monitor and manage discussion rooms, forums, and user reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
          <Flag className="w-10 h-10 text-blue-200 mb-2" />
          <p className="text-blue-100 text-sm font-medium">Total Reports</p>
          <p className="text-3xl font-bold mt-1">{stats.totalReports}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
          <AlertTriangle className="w-10 h-10 text-yellow-200 mb-2" />
          <p className="text-yellow-100 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold mt-1">{stats.pendingReports}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white">
          <CheckCircle className="w-10 h-10 text-green-200 mb-2" />
          <p className="text-green-100 text-sm font-medium">Resolved</p>
          <p className="text-3xl font-bold mt-1">{stats.resolvedReports}</p>
        </div>

        <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-6 rounded-2xl shadow-lg text-white">
          <XCircle className="w-10 h-10 text-slate-200 mb-2" />
          <p className="text-slate-100 text-sm font-medium">Dismissed</p>
          <p className="text-3xl font-bold mt-1">{stats.dismissedReports}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          🚨 User Reports
        </button>
        <button
          onClick={() => setActiveTab('forums')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'forums'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          💬 Forums Activity
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'actions'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          📋 Action Log
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
        />
      </div>

      {/* Reports Table */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Reported User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Content</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-slate-600">Loading reports...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No reports found
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          report.type === 'post' ? 'bg-blue-100 text-blue-700' :
                          report.type === 'comment' ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserX className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">
                            {report.reportedUser 
                              ? `${report.reportedUser.firstName} ${report.reportedUser.lastName}`
                              : 'Unknown User'
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 truncate max-w-xs">{report.description}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{report.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTakeAction(report)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg text-sm font-bold transition-all"
                          >
                            Take Action
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forums Activity */}
      {activeTab === 'forums' && (
        <div className="text-center py-20">
          <MessageCircle className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-400">Forums activity monitoring coming soon</p>
          <p className="text-sm text-slate-500 mt-2">View recent posts, comments, and forum statistics</p>
        </div>
      )}

      {/* Action Log */}
      {activeTab === 'actions' && (
        <div className="text-center py-20">
          <Flag className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-400">Moderation action log coming soon</p>
          <p className="text-sm text-slate-500 mt-2">Track all moderation decisions and actions taken</p>
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="⚠️ Take Moderation Action"
        maxWidth="lg"
      >
        {selectedReport && (
          <div className="space-y-5">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Moderation actions are logged and may impact user accounts.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="font-bold text-slate-800 mb-2">Report Details</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Reported User:</strong> {
                  selectedReport.reportedUser 
                    ? `${selectedReport.reportedUser.firstName} ${selectedReport.reportedUser.lastName} (${selectedReport.reportedUser.email})`
                    : 'Unknown User'
                }</p>
                <p><strong>Reported By:</strong> {
                  selectedReport.reporter
                    ? `${selectedReport.reporter.firstName} ${selectedReport.reporter.lastName}`
                    : 'Unknown Reporter'
                }</p>
                <p><strong>Type:</strong> {selectedReport.type}</p>
                <p><strong>Description:</strong> {selectedReport.description}</p>
                <p><strong>Reason:</strong> {selectedReport.reason}</p>
                <p><strong>Priority:</strong> <span className={`px-2 py-1 rounded text-xs font-bold ${
                  selectedReport.priority === 'high' ? 'bg-red-100 text-red-700' :
                  selectedReport.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{selectedReport.priority}</span></p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Action</label>
              <select 
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
              >
                <option value="">Choose an action...</option>
                <option value="delete">🗑️ Delete Content</option>
                <option value="warn">⚠️ Warn User</option>
                <option value="suspend">🚫 Suspend User (30 days)</option>
                <option value="ban">❌ Ban User Permanently</option>
                <option value="dismiss">✅ Dismiss Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Action Notes</label>
              <textarea
                rows={4}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Explain the reasoning for this action..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={executeAction}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                ⚡ Execute Action
              </button>
              <button
                onClick={() => setShowActionModal(false)}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModerationSection;
