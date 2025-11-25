'use client'
import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, X, Loader, CheckCircle, AlertCircle, Calendar, Clock, User } from 'lucide-react';
import Modal from '@/components/ui/modal';

interface Appointment {
  _id: string;
  userId: any;
  employeeId: any;
  serviceId: any;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const AppointmentManagementSection = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dropdown data
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    userId: '',
    employeeId: '',
    serviceId: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'scheduled',
    notes: ''
  });

  const fetchAppointments = async () => {
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
        setAppointments(data.appointments || []);
      } else {
        setError(data.error || 'Failed to fetch appointments');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setEmployees(data.employees || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setServices(Array.isArray(data) ? data : data.services || []);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
    fetchEmployees();
    fetchServices();
  }, []);

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      userId: '',
      employeeId: '',
      serviceId: '',
      appointmentDate: '',
      appointmentTime: '',
      status: 'scheduled',
      notes: ''
    });
    setShowModal(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setModalMode('edit');
    setSelectedAppointment(appointment);
    setFormData({
      userId: appointment.userId?._id || '',
      employeeId: appointment.employeeId?._id || '',
      serviceId: appointment.serviceId?._id || '',
      appointmentDate: appointment.appointmentDate.split('T')[0],
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      if (modalMode === 'create') {
        const response = await fetch('/api/admin/appointments', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setSuccess('Appointment created!');
          fetchAppointments();
          setTimeout(() => {
            setShowModal(false);
            setSuccess('');
          }, 2000);
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to create appointment');
        }
      } else if (modalMode === 'edit' && selectedAppointment) {
        const response = await fetch(`/api/admin/appointments/${selectedAppointment._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setSuccess('Appointment updated!');
          fetchAppointments();
          setTimeout(() => {
            setShowModal(false);
            setSuccess('');
          }, 2000);
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to update appointment');
        }
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setSuccess(`Appointment ${newStatus}!`);
        fetchAppointments();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Delete this appointment?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Appointment deleted!');
        fetchAppointments();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const userName = apt.userId?.firstName ? `${apt.userId.firstName} ${apt.userId.lastName}` : 'Unknown';
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-600 mt-1">Manage all appointments</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-slate-500">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Therapist</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {apt.userId?.firstName ? `${apt.userId.firstName} ${apt.userId.lastName}` : 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">
                        {apt.employeeId?.firstName ? `${apt.employeeId.firstName} ${apt.employeeId.lastName}` : 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">{apt.serviceId?.name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-slate-900">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-900">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {apt.appointmentTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {apt.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(apt._id, 'completed')}
                              className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition flex items-center gap-1"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Complete
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(apt._id, 'cancelled')}
                              className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition flex items-center gap-1"
                              title="Cancel Appointment"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </>
                        )}
                        {apt.status === 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt._id, 'scheduled')}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                            title="Reschedule"
                          >
                            Reschedule
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(apt)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(apt._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{appointments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Scheduled</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{appointments.filter(a => a.status === 'scheduled').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{appointments.filter(a => a.status === 'completed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Cancelled</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{appointments.filter(a => a.status === 'cancelled').length}</p>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? '📅 New Appointment' : '✏️ Edit Appointment'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Client *</label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              >
                <option value="">Select a client</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Therapist *</label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              >
                <option value="">Select a therapist</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName} - {emp.specialization || 'General'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Service *</label>
              <select
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Date *</label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Time *</label>
              <input
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="scheduled">📅 Scheduled</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              rows={3}
              placeholder="Add any special notes or requirements..."
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              {modalMode === 'create' ? '✨ Create Appointment' : '💾 Update Appointment'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentManagementSection;
