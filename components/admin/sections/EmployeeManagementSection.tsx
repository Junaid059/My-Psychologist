'use client'
import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Eye, Plus, X, Loader, CheckCircle, AlertCircle, DollarSign, Briefcase, Star } from 'lucide-react';

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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {modalMode === 'create' && 'Create New Employee'}
                {modalMode === 'edit' && 'Edit Employee'}
                {modalMode === 'view' && 'Employee Details'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {modalMode === 'view' && selectedEmployee ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Name</label>
                    <p className="text-lg text-slate-900">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-lg text-slate-900">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone</label>
                    <p className="text-lg text-slate-900">{selectedEmployee.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Specialization</label>
                    <p className="text-lg text-slate-900">{selectedEmployee.specialization}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Experience</label>
                    <p className="text-lg text-slate-900">{selectedEmployee.experience} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Salary</label>
                    <p className="text-lg text-slate-900">${selectedEmployee.salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Status</label>
                    <p className="text-lg text-slate-900">{selectedEmployee.isActive ? 'Active' : 'Inactive'}</p>
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

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Specialization *</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="e.g. Clinical Psychology, CBT, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Experience (years) *</label>
                      <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Salary ($) *</label>
                      <input
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                      />
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
                      {modalMode === 'create' ? 'Create Employee' : 'Update Employee'}
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

export default EmployeeManagementSection;
