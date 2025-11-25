'use client'
import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Eye, Plus, X, Loader, CheckCircle, AlertCircle, DollarSign, Briefcase, Star } from 'lucide-react';
import Modal from '@/components/ui/modal';

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization: string;
  experience: number;
  salary: number;
  isActive: boolean;
  createdAt: string;
}

const EmployeeManagementSection = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    experience: 0,
    salary: 0
  });

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
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
      } else {
        setError(data.error || 'Failed to fetch employees');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && employee.isActive) ||
                         (filterStatus === 'inactive' && !employee.isActive);
    return matchesSearch && matchesFilter;
  });

  // Handle create employee
  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      specialization: '',
      experience: 0,
      salary: 0
    });
    setShowModal(true);
    setError('');
  };

  // Handle edit employee
  const handleEdit = (employee: Employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      password: '',
      specialization: employee.specialization,
      experience: employee.experience,
      salary: employee.salary
    });
    setShowModal(true);
    setError('');
  };

  // Handle view employee
  const handleView = (employee: Employee) => {
    setModalMode('view');
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  // Handle submit (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      if (modalMode === 'create') {
        const response = await fetch('/api/admin/employees', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
          setSuccess('Employee created successfully!');
          fetchEmployees();
          setTimeout(() => {
            setShowModal(false);
            setSuccess('');
          }, 2000);
        } else {
          setError(data.error || 'Failed to create employee');
        }
      } else if (modalMode === 'edit' && selectedEmployee) {
        const updateData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: formData.experience,
          salary: formData.salary
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/employees/${selectedEmployee._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });

        const data = await response.json();
        if (response.ok) {
          setSuccess('Employee updated successfully!');
          fetchEmployees();
          setTimeout(() => {
            setShowModal(false);
            setSuccess('');
          }, 2000);
        } else {
          setError(data.error || 'Failed to update employee');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Handle delete employee
  const handleDelete = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Employee deleted successfully!');
        fetchEmployees();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete employee');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgExperience = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + emp.experience, 0) / employees.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Employee Management</h2>
          <p className="text-slate-600 mt-1">Manage therapists and staff members</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
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
            placeholder="Search by name, email or specialization..."
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

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-slate-500">No employees found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-xs text-slate-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">{employee.specialization}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-slate-900">{employee.experience} years</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-slate-900">${employee.salary.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(employee)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(employee)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total Employees</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{employees.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{employees.filter(e => e.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total Payroll</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">${totalSalary.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Avg Experience</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">{avgExperience.toFixed(1)} yrs</p>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'create' ? '👨‍⚕️ Add New Therapist' :
          modalMode === 'edit' ? '✏️ Edit Therapist' :
          '👤 Therapist Details'
        }
        maxWidth="2xl"
      >
        {modalMode === 'view' && selectedEmployee ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-5 rounded-xl">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Name</label>
                <p className="text-xl font-semibold text-slate-900 mt-2">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-5 rounded-xl">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Email</label>
                <p className="text-lg font-medium text-slate-900 mt-2">{selectedEmployee.email}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Specialization</label>
                <p className="text-lg font-medium text-slate-900 mt-2">{selectedEmployee.specialization || 'General'}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Experience</label>
                <p className="text-lg font-medium text-slate-900 mt-2">{selectedEmployee.experience || 0} years</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Salary</label>
                <p className="text-xl font-bold text-green-600 mt-2">${(selectedEmployee.salary || 0).toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-xl">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Status</label>
                <p className="text-lg font-medium mt-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${selectedEmployee.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedEmployee.isActive ? '✓ Active' : '✗ Inactive'}
                  </span>
                </p>
              </div>
            </div>
            {selectedEmployee.phone && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Phone</label>
                <p className="text-lg font-medium text-slate-900 mt-2">{selectedEmployee.phone}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="therapist@clinic.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password {modalMode === 'edit' && <span className="text-slate-500 text-xs font-normal">(leave blank to keep unchanged)</span>}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="••••••••"
                required={modalMode === 'create'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Specialization *</label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              >
                <option value="">Select Specialization</option>
                <option value="Clinical Psychology">Clinical Psychology</option>
                <option value="Cognitive Behavioral Therapy">Cognitive Behavioral Therapy (CBT)</option>
                <option value="Family Therapy">Family Therapy</option>
                <option value="Child Psychology">Child Psychology</option>
                <option value="Addiction Counseling">Addiction Counseling</option>
                <option value="Trauma Therapy">Trauma Therapy</option>
                <option value="Marriage Counseling">Marriage Counseling</option>
                <option value="General Therapy">General Therapy</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Experience (years) *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Salary ($) *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="5000"
                  required
                />
              </div>
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
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              >
                {modalMode === 'create' ? '✨ Add Therapist' : '💾 Update Therapist'}
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
        )}
      </Modal>
    </div>
  );
};

export default EmployeeManagementSection;
