'use client'
import React, { useState } from 'react';
import { Download, Eye, Trash2, FileText, Calendar, Users } from 'lucide-react';

interface Report {
  id: number;
  title: string;
  type: string;
  generatedDate: string;
  period: string;
  fileSize: string;
  status: 'ready' | 'processing' | 'archived';
}

const ReportsSection = () => {
  const [reportType, setReportType] = useState('all');

  const reports: Report[] = [
    { id: 1, title: 'Monthly Revenue Report - June 2024', type: 'Revenue', generatedDate: '2024-07-01', period: 'June 2024', fileSize: '2.4 MB', status: 'ready' },
    { id: 2, title: 'Therapist Performance Report - Q2 2024', type: 'Performance', generatedDate: '2024-07-02', period: 'Q2 2024', fileSize: '1.8 MB', status: 'ready' },
    { id: 3, title: 'Client Satisfaction Survey - June 2024', type: 'Satisfaction', generatedDate: '2024-06-30', period: 'June 2024', fileSize: '890 KB', status: 'ready' },
    { id: 4, title: 'Booking & Appointment Report - June 2024', type: 'Operations', generatedDate: '2024-07-01', period: 'June 2024', fileSize: '3.1 MB', status: 'ready' },
    { id: 5, title: 'Annual Review Report - 2023', type: 'Annual', generatedDate: '2024-01-15', period: 'Year 2023', fileSize: '5.2 MB', status: 'archived' },
    { id: 6, title: 'Client Demographics Report - Q2 2024', type: 'Demographics', generatedDate: '2024-07-02', period: 'Q2 2024', fileSize: '1.2 MB', status: 'ready' },
  ];

  const filteredReports = reportType === 'all' 
    ? reports 
    : reports.filter(r => r.type.toLowerCase() === reportType.toLowerCase());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-emerald-100 text-emerald-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'archived':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Reports</h2>
        <p className="text-slate-600 mt-1">Access and manage all generated reports</p>
      </div>

      {/* Generate Report Button */}
      <button className="px-6 py-3 bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white rounded-lg font-medium transition flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Generate New Report
      </button>

      {/* Report Type Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setReportType('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            reportType === 'all'
              ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          All Reports
        </button>
        <button
          onClick={() => setReportType('revenue')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            reportType === 'revenue'
              ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Revenue
        </button>
        <button
          onClick={() => setReportType('performance')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            reportType === 'performance'
              ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setReportType('operations')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            reportType === 'operations'
              ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Operations
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Report Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Period</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Generated</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Size</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-900">{report.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{report.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{report.period}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{report.generatedDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{report.fileSize}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition" title="View">
                        <Eye className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-emerald-50 rounded-lg transition" title="Download">
                        <Download className="w-4 h-4 text-slate-400 hover:text-emerald-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Total Reports</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">{reports.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Ready to Download</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{reports.filter(r => r.status === 'ready').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Total Storage Used</p>
          <p className="text-2xl font-bold text-teal-600 mt-2">19.7 MB</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
