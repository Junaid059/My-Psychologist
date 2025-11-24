'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Calendar, Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react';

interface Appointment {
  id: string;
  userId: string;
  employeeId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  userFirstName?: string;
  userLastName?: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  serviceName?: string;
  createdAt: string;
}

const AppointmentCRUD = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    userId: '',
    employeeId: '',
    serviceId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    status: 'scheduled',
    notes: ''
  });

  // Fetch data
  useEffect(() => {
    fetchAppointments();
    fetchUsers();
    fetchEmployees();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `/api/admin/appointments/${editingId}` 
        : '/api/admin/appointments';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save');

      setSuccess(editingId ? 'Appointment updated' : 'Appointment created');
      setFormData({
        userId: '',
        employeeId: '',
        serviceId: '',
        appointmentDate: '',
        startTime: '',
        endTime: '',
        status: 'scheduled',
        notes: ''
      });
      setShowForm(false);
      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      setError('Failed to save appointment');
      console.error(err);
    }
  };

  const handleEdit = (apt: Appointment) => {
    setFormData({
      userId: apt.userId,
      employeeId: apt.employeeId,
      serviceId: apt.serviceId,
      appointmentDate: apt.appointmentDate,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      notes: apt.notes || ''
    });
    setEditingId(apt.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this appointment?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete');
      setSuccess('Appointment deleted');
      fetchAppointments();
    } catch (err) {
      setError('Failed to delete');
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = (apt.userFirstName + ' ' + apt.userLastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.employeeFirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Appointments</h2>
          <p className="text-slate-600">Schedule and manage therapy sessions</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              userId: '',
              employeeId: '',
              serviceId: '',
              appointmentDate: '',
              startTime: '',
              endTime: '',
              status: 'scheduled',
              notes: ''
            });
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          Schedule Appointment
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            {editingId ? 'Edit Appointment' : 'Schedule New Appointment'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Client *</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>

              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Therapist *</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.specialization})
                  </option>
                ))}
              </select>

              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Service *</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <textarea
              name="notes"
              placeholder="Notes / Special Instructions"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                {editingId ? 'Update' : 'Schedule'} Appointment
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client or therapist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg bg-white">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent focus:outline-none text-slate-700"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Clock className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-slate-600">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Therapist</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900 font-semibold">{apt.userFirstName} {apt.userLastName}</td>
                    <td className="px-6 py-4 text-slate-700">{apt.employeeFirstName} {apt.employeeLastName}</td>
                    <td className="px-6 py-4 text-slate-700">{apt.serviceName}</td>
                    <td className="px-6 py-4 text-slate-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {apt.appointmentDate}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {apt.startTime} - {apt.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${
                        apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(apt)}
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCRUD;
