'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, ChevronDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  hourlyRate?: number;
  monthlySalary?: number;
  currency: string;
  paymentStatus: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
}

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    hourlyRate: '',
    monthlySalary: '',
    bio: ''
  });

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch employees');

      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        ? `/api/admin/employees/${editingId}` 
        : '/api/admin/employees';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save employee');

      setSuccess(editingId ? 'Employee updated successfully' : 'Employee created successfully');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        qualification: '',
        experience: '',
        hourlyRate: '',
        monthlySalary: '',
        bio: ''
      });
      setShowForm(false);
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setError('Failed to save employee');
      console.error(err);
    }
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      specialization: employee.specialization,
      qualification: employee.qualification || '',
      experience: employee.experience?.toString() || '',
      hourlyRate: employee.hourlyRate?.toString() || '',
      monthlySalary: employee.monthlySalary?.toString() || '',
      bio: employee.bio || ''
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete');

      setSuccess('Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && emp.isActive) ||
                         (filterStatus === 'inactive' && !emp.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Employees</h2>
          <p className="text-slate-600">Manage therapists and staff members</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              specialization: '',
              qualification: '',
              experience: '',
              hourlyRate: '',
              monthlySalary: '',
              bio: ''
            });
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          Add Employee
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
            {editingId ? 'Edit Employee' : 'Add New Employee'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization *"
                value={formData.specialization}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="qualification"
                placeholder="Qualification (e.g., PhD Psychology)"
                value={formData.qualification}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="hourlyRate"
                placeholder="Hourly Rate (PKR)"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="monthlySalary"
                placeholder="Monthly Salary (PKR)"
                value={formData.monthlySalary}
                onChange={handleInputChange}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              name="bio"
              placeholder="Bio / Professional Summary"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                {editingId ? 'Update' : 'Create'} Employee
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
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
            placeholder="Search by name or email..."
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
            <option value="all">All Employees</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Clock className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-slate-600">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No employees found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Specialization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Salary</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-sm text-slate-500">{emp.experience || 0} years exp</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{emp.email}</td>
                    <td className="px-6 py-4 text-slate-700">{emp.specialization}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {emp.monthlySalary ? `₨${emp.monthlySalary.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${emp.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        <div className={`w-2 h-2 rounded-full ${emp.isActive ? 'bg-green-600' : 'bg-slate-400'}`}></div>
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
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
    </div>
  );
};

export default EmployeeCRUD;
