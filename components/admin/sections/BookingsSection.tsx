'use client'
import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Eye, CheckCircle, XCircle, Clock, DollarSign, Loader, AlertCircle } from 'lucide-react';

interface Booking {
  _id: string;
  userId: any;
  serviceId: any;
  employeeId?: any;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}

const BookingsSection = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings || []);
      } else {
        setError(data.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setSuccess(`Booking ${status} successfully!`);
        fetchBookings();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update booking');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Booking deleted!');
        fetchBookings();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete booking');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const userName = booking.userId?.firstName ? `${booking.userId.firstName} ${booking.userId.lastName}` : 'Unknown';
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Bookings Management</h2>
          <p className="text-slate-600 mt-1">Manage appointments and reservations</p>
        </div>
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

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings..."
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
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-slate-500">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {booking.userId?.firstName ? `${booking.userId.firstName} ${booking.userId.lastName}` : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">{booking.serviceId?.name || 'Unknown Service'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <DollarSign className="w-4 h-4" />
                        {booking.totalAmount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
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
          <p className="text-sm text-slate-600">Total Bookings</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Confirmed</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{confirmedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{bookings.filter(b => b.status === 'pending').length}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingsSection;
