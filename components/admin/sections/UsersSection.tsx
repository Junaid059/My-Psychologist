'use client'
import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Eye, Mail, Phone, Calendar, Plus, X, Loader, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  currency?: string;
  isActive: boolean;
  createdAt: string;
}

const UsersSection = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    country: '',
    currency: 'USD'
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
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
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesFilter;
  });

  // Handle create user
  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      country: '',
      currency: 'USD'
    });
    setShowModal(true);
    setError('');
  };

  // Handle edit user
  const handleEdit = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      password: '',
      country: user.country || '',
      currency: user.currency || 'USD'
    });
    setShowModal(true);
    setError('');
  };

  // Handle view user
  const handleView = (user: User) => {
    setModalMode('view');
    setSelectedUser(user);
    setShowModal(true);
  };

  // Handle submit (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (modalMode === 'create') {
        // Create new user
        const response = await fetch('/api/auth/user/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
          setSuccess('User created successfully!');
          fetchUsers();
          setTimeout(() => {
            setShowModal(false);
            setSuccess('');
          }, 2000);
        } else {
          setError(data.error || 'Failed to create user');
        }
      } else if (modalMode === 'edit' && selectedUser) {
        // Update user
        const updateData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          currency: formData.currency
        };

        // Only include password if provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });

        const data = await response.json();
        if (response.ok) {
          setSuccess('User updated successfully!');
          fetchUsers();
          setTimeout(() => {
            setShowModal(false);
            setSuccess('');
          }, 2000);
        } else {
          setError(data.error || 'Failed to update user');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Handle delete user
  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('User deleted successfully!');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Users Management</h2>
          <p className="text-slate-600 mt-1">Manage and view all client profiles</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Success/Error Messages */}
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        {user.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">{user.country || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total Users</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Active Users</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{users.filter(u => u.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Inactive Users</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{users.filter(u => !u.isActive).length}</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {modalMode === 'create' && 'Create New User'}
                {modalMode === 'edit' && 'Edit User'}
                {modalMode === 'view' && 'User Details'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalMode === 'view' && selectedUser ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Name</label>
                    <p className="text-lg text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-lg text-slate-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone</label>
                    <p className="text-lg text-slate-900">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Country</label>
                    <p className="text-lg text-slate-900">{selectedUser.country || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Currency</label>
                    <p className="text-lg text-slate-900">{selectedUser.currency || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Status</label>
                    <p className="text-lg text-slate-900">{selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Joined</label>
                    <p className="text-lg text-slate-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password {modalMode === 'edit' && '(leave blank to keep unchanged)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={modalMode === 'create'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD</option>
                        <option value="PKR">PKR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {success}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg font-medium transition"
                    >
                      {modalMode === 'create' ? 'Create User' : 'Update User'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSection;
