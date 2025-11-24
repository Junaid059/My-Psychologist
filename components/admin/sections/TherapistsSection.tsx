'use client'
import React, { useState } from 'react';
import { Search, Edit2, Trash2, Eye, Mail, Phone, Award, Users, Calendar } from 'lucide-react';

interface Therapist {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  clients: number;
  availability: string;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  avatar: string;
}

const TherapistsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const therapists: Therapist[] = [
    { id: 1, name: 'Dr. Johnson', email: 'dr.johnson@clinic.com', phone: '+1 (555) 111-2222', specialization: 'Anxiety & Depression', clients: 24, availability: 'Mon-Fri 9AM-5PM', rating: 4.9, status: 'available', avatar: 'DJ' },
    { id: 2, name: 'Dr. Smith', email: 'dr.smith@clinic.com', phone: '+1 (555) 222-3333', specialization: 'Couples Therapy', clients: 18, availability: 'Tue-Sat 10AM-6PM', rating: 4.8, status: 'busy', avatar: 'DS' },
    { id: 3, name: 'Dr. Williams', email: 'dr.williams@clinic.com', phone: '+1 (555) 333-4444', specialization: 'Group Therapy', clients: 32, availability: 'Wed-Sun 12PM-8PM', rating: 4.7, status: 'available', avatar: 'DW' },
    { id: 4, name: 'Dr. Davis', email: 'dr.davis@clinic.com', phone: '+1 (555) 444-5555', specialization: 'Crisis Support', clients: 15, availability: '24/7', rating: 5.0, status: 'offline', avatar: 'DD' },
    { id: 5, name: 'Dr. Miller', email: 'dr.miller@clinic.com', phone: '+1 (555) 555-6666', specialization: 'Cognitive Therapy', clients: 20, availability: 'Mon-Thu 8AM-4PM', rating: 4.6, status: 'available', avatar: 'DM' },
  ];

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || therapist.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700';
      case 'busy':
        return 'bg-amber-100 text-amber-700';
      case 'offline':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Therapists Management</h2>
          <p className="text-slate-600 mt-1">Manage all therapists and their schedules</p>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white rounded-lg font-medium transition">
          + Add Therapist
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Therapists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapists.map((therapist) => (
          <div key={therapist.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {therapist.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{therapist.name}</h3>
                  <p className="text-xs text-slate-500">{therapist.specialization}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(therapist.status)}`}>
                {therapist.status.charAt(0).toUpperCase() + therapist.status.slice(1)}
              </span>
            </div>

            {/* Rating */}
            <div className="mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-slate-800">{therapist.rating.toFixed(1)}/5.0</span>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600 break-all">{therapist.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600">{therapist.phone}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Active Clients</p>
                <p className="text-lg font-bold text-slate-800">{therapist.clients}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Schedule</p>
                <p className="text-xs font-medium text-slate-700 line-clamp-2">{therapist.availability}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 p-2 hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-1" title="View">
                <Eye className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                <span className="text-xs text-slate-600">View</span>
              </button>
              <button className="flex-1 p-2 hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-1" title="Edit">
                <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                <span className="text-xs text-slate-600">Edit</span>
              </button>
              <button className="flex-1 p-2 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-1" title="Delete">
                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                <span className="text-xs text-slate-600">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Total Therapists</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">{therapists.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Available Now</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{therapists.filter(t => t.status === 'available').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Total Clients</p>
          <p className="text-2xl font-bold text-teal-600 mt-2">{therapists.reduce((sum, t) => sum + t.clients, 0)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Avg. Rating</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{(therapists.reduce((sum, t) => sum + t.rating, 0) / therapists.length).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TherapistsSection;
