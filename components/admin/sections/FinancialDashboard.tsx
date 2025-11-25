'use client'
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, RefreshCw, Download, Search, Filter } from 'lucide-react';
import Modal from '@/components/ui/modal';

interface Transaction {
  _id: string;
  bookingId: any;
  userId: any;
  amount: number;
  paymentMethod: 'card' | 'cash' | 'online';
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  transactionDate: string;
  refundAmount?: number;
  notes?: string;
}

const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTransactions(data.transactions || []);
      } else {
        console.error('Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalRevenue: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingPayments: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    refundsIssued: transactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + (t.refundAmount || 0), 0),
    transactionCount: transactions.length
  };

  const handleRefund = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount(transaction.amount);
    setRefundReason('');
    setShowRefundModal(true);
  };

  const processRefund = async () => {
    if (!selectedTransaction) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/transactions/${selectedTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'refunded',
          refundAmount,
          notes: refundReason
        })
      });

      if (response.ok) {
        alert(`Refund of $${refundAmount} processed successfully!`);
        fetchTransactions();
        setShowRefundModal(false);
      } else {
        alert('Failed to process refund');
      }
    } catch (err) {
      console.error('Error processing refund:', err);
      alert('Error processing refund');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bookingId?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || t.paymentMethod === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            💰 Financial Transactions & Payments
          </h2>
          <p className="text-slate-600 mt-1">Monitor revenue, payments, and refunds</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending Payments</p>
              <p className="text-3xl font-bold mt-2">${stats.pendingPayments.toFixed(2)}</p>
            </div>
            <CreditCard className="w-10 h-10 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Refunds Issued</p>
              <p className="text-3xl font-bold mt-2">${stats.refundsIssued.toFixed(2)}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Transactions</p>
              <p className="text-3xl font-bold mt-2">{stats.transactionCount}</p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
        >
          <option value="all">All Methods</option>
          <option value="card">Card</option>
          <option value="cash">Cash</option>
          <option value="online">Online</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Service</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-600">#{transaction._id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {transaction.userId?.firstName} {transaction.userId?.lastName}
                      </span>
                      <span className="text-xs text-slate-500">{transaction.userId?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {transaction.bookingId?.serviceName || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-green-600">${transaction.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      transaction.paymentMethod === 'card' ? 'bg-blue-100 text-blue-700' :
                      transaction.paymentMethod === 'cash' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {transaction.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      transaction.status === 'refunded' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetailsModal(true);
                        }}
                        className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                      >
                        View
                      </button>
                      {transaction.status === 'completed' && (
                        <button
                          onClick={() => handleRefund(transaction)}
                          className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="💳 Transaction Details"
        maxWidth="lg"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                <p className="text-sm text-slate-600 font-medium">Transaction ID</p>
                <p className="font-mono text-lg font-bold text-slate-900 mt-1">#{selectedTransaction._id}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                <p className="text-sm text-slate-600 font-medium">Amount</p>
                <p className="text-2xl font-bold text-green-600 mt-1">${selectedTransaction.amount.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                <p className="text-sm text-slate-600 font-medium">Client</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {selectedTransaction.userId?.firstName} {selectedTransaction.userId?.lastName}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
                <p className="text-sm text-slate-600 font-medium">Payment Method</p>
                <p className="text-lg font-bold text-slate-900 mt-1 capitalize">{selectedTransaction.paymentMethod}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="💸 Process Refund"
        maxWidth="lg"
      >
        <div className="space-y-5">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This action will process a refund to the client's original payment method.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Refund Amount ($)</label>
            <input
              type="number"
              min="0"
              max={selectedTransaction?.amount || 0}
              step="0.01"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">
              Maximum: ${selectedTransaction?.amount.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Refund Reason *</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              rows={3}
              placeholder="Explain the reason for this refund..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={processRefund}
              disabled={!refundReason || refundAmount <= 0}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💸 Process Refund
            </button>
            <button
              onClick={() => setShowRefundModal(false)}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FinancialDashboard;
