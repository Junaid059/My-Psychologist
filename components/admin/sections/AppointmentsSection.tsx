'use client'
import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MapPin, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Appointment {
  id: number;
  clientName: string;
  therapist: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  location: string;
  notes: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const AppointmentsSection = () => {
  const [selectedView, setSelectedView] = useState<'upcoming' | 'all'>('upcoming');

  const appointments: Appointment[] = [
    { id: 1, clientName: 'Sarah Chen', therapist: 'Dr. Johnson', date: '2024-11-25', time: '10:00 AM', duration: '60 min', type: 'Individual Therapy', location: 'Office - Room 101', notes: 'Follow-up on anxiety management', status: 'upcoming' },
    { id: 2, clientName: 'Michael R.', therapist: 'Dr. Smith', date: '2024-11-25', time: '02:00 PM', duration: '90 min', type: 'Couples Therapy', location: 'Office - Room 201', notes: 'Relationship counseling session', status: 'upcoming' },
    { id: 3, clientName: 'Emma T.', therapist: 'Dr. Williams', date: '2024-11-26', time: '09:00 AM', duration: '60 min', type: 'Group Session', location: 'Online - Zoom', notes: 'Group therapy - Stress management', status: 'upcoming' },
    { id: 4, clientName: 'James Wilson', therapist: 'Dr. Johnson', date: '2024-11-24', time: '03:00 PM', duration: '60 min', type: 'Individual Therapy', location: 'Office - Room 103', notes: 'Completed', status: 'completed' },
    { id: 5, clientName: 'Lisa Anderson', therapist: 'Dr. Davis', date: '2024-11-23', time: '11:00 AM', duration: '45 min', type: 'Crisis Support', location: 'Phone', notes: 'Emergency consultation - Cancelled', status: 'cancelled' },
    { id: 6, clientName: 'David Brown', therapist: 'Dr. Miller', date: '2024-11-27', time: '04:00 PM', duration: '60 min', type: 'Individual Therapy', location: 'Office - Room 102', notes: 'Initial assessment', status: 'upcoming' },
  ];

  const filteredAppointments = selectedView === 'upcoming'
    ? appointments.filter(a => a.status === 'upcoming')
    : appointments;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-600 mt-1">View and manage all scheduled appointments</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedView('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedView === 'upcoming'
              ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-800'
          }`}
        >
          Upcoming ({appointments.filter(a => a.status === 'upcoming').length})
        </button>
        <button
          onClick={() => setSelectedView('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedView === 'all'
              ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-800'
          }`}
        >
          All Appointments ({appointments.length})
        </button>
      </div>

      {/* Calendar/Timeline View */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 shadow-sm transition">
            <div className="flex flex-col md:flex-row">
              {/* Date/Time Column */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-r border-slate-200 p-6 md:w-32 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-600">{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-500" />
                  <span className="font-semibold text-slate-800">{appointment.time}</span>
                </div>
                <span className="text-xs text-slate-500 mt-2">{appointment.duration}</span>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{appointment.clientName}</p>
                      <p className="text-sm text-slate-600">Dr. {appointment.therapist.split(' ')[1]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(appointment.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-sm text-slate-600">{appointment.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Session Type</p>
                    <p className="text-sm text-slate-600">{appointment.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Notes</p>
                    <p className="text-sm text-slate-600">{appointment.notes}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2 p-4 border-l border-slate-200 flex-shrink-0 justify-end md:justify-center">
                {appointment.status === 'upcoming' && (
                  <>
                    <button className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-medium transition">
                      Complete
                    </button>
                    <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Total Appointments</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">{appointments.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Upcoming</p>
          <p className="text-2xl font-bold text-amber-600 mt-2">{appointments.filter(a => a.status === 'upcoming').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{appointments.filter(a => a.status === 'completed').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-slate-600 text-sm">Cancelled</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{appointments.filter(a => a.status === 'cancelled').length}</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsSection;
