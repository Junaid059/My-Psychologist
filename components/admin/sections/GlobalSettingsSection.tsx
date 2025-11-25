'use client'
import React, { useState, useEffect } from 'react';
import { Settings, DollarSign, Globe, Clock, Mail, Bell, Save } from 'lucide-react';

const GlobalSettingsSection = () => {
  const [settings, setSettings] = useState({
    // Pricing
    defaultCurrency: 'USD',
    conversionRates: {
      EUR: 0.85,
      GBP: 0.73,
      CAD: 1.25,
      AUD: 1.35
    },
    servicePrices: {
      individual: 120,
      couples: 180,
      family: 200,
      group: 80,
      child: 100
    },
    
    // Session Settings
    defaultDuration: 60,
    maxAppointmentsPerDay: 8,
    advanceBookingDays: 30,
    
    // Cancellation Policy
    fullRefundHours: 24,
    partialRefundHours: 12,
    partialRefundPercent: 50,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderHoursBefore: 24
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Error saving settings');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ⚙️ Global Settings
          </h2>
          <p className="text-slate-600 mt-1">Configure system-wide preferences and pricing</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <Save className="w-5 h-5" />
          Save All Settings
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Currency & Pricing */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Currency & Pricing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Default Currency</label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Individual Therapy ($)</label>
            <input
              type="number"
              min="0"
              value={settings.servicePrices.individual}
              onChange={(e) => setSettings({
                ...settings,
                servicePrices: {...settings.servicePrices, individual: parseFloat(e.target.value) || 0}
              })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Couples Therapy ($)</label>
            <input
              type="number"
              min="0"
              value={settings.servicePrices.couples}
              onChange={(e) => setSettings({
                ...settings,
                servicePrices: {...settings.servicePrices, couples: parseFloat(e.target.value) || 0}
              })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Family Therapy ($)</label>
            <input
              type="number"
              min="0"
              value={settings.servicePrices.family}
              onChange={(e) => setSettings({
                ...settings,
                servicePrices: {...settings.servicePrices, family: parseFloat(e.target.value) || 0}
              })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Group Therapy ($)</label>
            <input
              type="number"
              min="0"
              value={settings.servicePrices.group}
              onChange={(e) => setSettings({
                ...settings,
                servicePrices: {...settings.servicePrices, group: parseFloat(e.target.value) || 0}
              })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Child Therapy ($)</label>
            <input
              type="number"
              min="0"
              value={settings.servicePrices.child}
              onChange={(e) => setSettings({
                ...settings,
                servicePrices: {...settings.servicePrices, child: parseFloat(e.target.value) || 0}
              })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
        </div>

        {/* Currency Conversion Rates */}
        <div className="mt-6">
          <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Currency Conversion Rates
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
              <p className="text-sm font-medium text-slate-600">EUR Rate</p>
              <input
                type="number"
                step="0.01"
                value={settings.conversionRates.EUR}
                onChange={(e) => setSettings({
                  ...settings,
                  conversionRates: {...settings.conversionRates, EUR: parseFloat(e.target.value) || 0}
                })}
                className="w-full mt-2 px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
              <p className="text-sm font-medium text-slate-600">GBP Rate</p>
              <input
                type="number"
                step="0.01"
                value={settings.conversionRates.GBP}
                onChange={(e) => setSettings({
                  ...settings,
                  conversionRates: {...settings.conversionRates, GBP: parseFloat(e.target.value) || 0}
                })}
                className="w-full mt-2 px-3 py-2 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
              <p className="text-sm font-medium text-slate-600">CAD Rate</p>
              <input
                type="number"
                step="0.01"
                value={settings.conversionRates.CAD}
                onChange={(e) => setSettings({
                  ...settings,
                  conversionRates: {...settings.conversionRates, CAD: parseFloat(e.target.value) || 0}
                })}
                className="w-full mt-2 px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
              <p className="text-sm font-medium text-slate-600">AUD Rate</p>
              <input
                type="number"
                step="0.01"
                value={settings.conversionRates.AUD}
                onChange={(e) => setSettings({
                  ...settings,
                  conversionRates: {...settings.conversionRates, AUD: parseFloat(e.target.value) || 0}
                })}
                className="w-full mt-2 px-3 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Session Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Session Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Default Duration (minutes)</label>
            <input
              type="number"
              min="15"
              step="15"
              value={settings.defaultDuration}
              onChange={(e) => setSettings({...settings, defaultDuration: parseInt(e.target.value) || 60})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Max Appointments/Day</label>
            <input
              type="number"
              min="1"
              value={settings.maxAppointmentsPerDay}
              onChange={(e) => setSettings({...settings, maxAppointmentsPerDay: parseInt(e.target.value) || 8})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Advance Booking (days)</label>
            <input
              type="number"
              min="1"
              value={settings.advanceBookingDays}
              onChange={(e) => setSettings({...settings, advanceBookingDays: parseInt(e.target.value) || 30})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-600" />
          Cancellation & Refund Policy
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Refund (hours before)</label>
            <input
              type="number"
              min="0"
              value={settings.fullRefundHours}
              onChange={(e) => setSettings({...settings, fullRefundHours: parseInt(e.target.value) || 24})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">100% refund if cancelled this early</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Partial Refund (hours before)</label>
            <input
              type="number"
              min="0"
              value={settings.partialRefundHours}
              onChange={(e) => setSettings({...settings, partialRefundHours: parseInt(e.target.value) || 12})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">Partial refund threshold</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Partial Refund (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.partialRefundPercent}
              onChange={(e) => setSettings({...settings, partialRefundPercent: parseInt(e.target.value) || 50})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">Percentage for partial refunds</p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-600" />
          Notification Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-bold text-slate-800">Email Notifications</p>
                <p className="text-xs text-slate-600">Send appointment reminders via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-bold text-slate-800">SMS Notifications</p>
                <p className="text-xs text-slate-600">Send text message reminders</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-bold text-slate-800">Push Notifications</p>
                <p className="text-xs text-slate-600">Send app push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Reminder Hours Before</label>
            <input
              type="number"
              min="1"
              value={settings.reminderHoursBefore}
              onChange={(e) => setSettings({...settings, reminderHoursBefore: parseInt(e.target.value) || 24})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">When to send appointment reminders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsSection;
