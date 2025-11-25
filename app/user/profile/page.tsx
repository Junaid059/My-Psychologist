'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Globe, Calendar, Edit2, Save, X, Camera, TrendingUp, Target, Heart, Clock, Award, BarChart3, Zap, LogOut } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  age: number | null;
  location: string;
  language: string;
  bio: string;
  avatar: string | null;
  emergencyContact: string;
  createdAt: string;
}

interface UserStats {
  totalPomodoros: number;
  totalMoodEntries: number;
  currentMoodStreak: number;
  averageMood: number;
  totalFocusHours: number;
  completedTasks: number;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Editable fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [bio, setBio] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  useEffect(() => {
    checkAuth();
    loadUserData();
    loadUserStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      router.push('/user/login');
    }
  };

  const loadUserData = () => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFirstName(parsedUser.firstName || '');
      setLastName(parsedUser.lastName || '');
      setPhone(parsedUser.phone || '');
      setAge(parsedUser.age || null);
      setLocation(parsedUser.location || '');
      setLanguage(parsedUser.language || 'English');
      setBio(parsedUser.bio || '');
      setEmergencyContact(parsedUser.emergencyContact || '');
      setLoading(false);
    }
  };

  const loadUserStats = () => {
    const userData = localStorage.getItem('user_data');
    if (!userData) return;
    
    const user = JSON.parse(userData);
    
    // Get Pomodoro stats
    const pomodoroSessions = JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]');
    const userPomodoros = pomodoroSessions.filter((s: any) => s.userId === user.id || s.userId === 'demo-user');
    const totalPomodoros = userPomodoros.filter((s: any) => s.mode === 'work').length;
    const totalMinutes = userPomodoros.filter((s: any) => s.mode === 'work').reduce((acc: number, s: any) => acc + s.duration, 0);
    
    // Get Mood stats
    const moodEntries = JSON.parse(localStorage.getItem('mood_entries') || '[]');
    const userMoodEntries = moodEntries.filter((e: any) => e.userId === user.id || e.userId === 'demo-user');
    const totalMoodEntries = userMoodEntries.length;
    const averageMood = userMoodEntries.length > 0 
      ? userMoodEntries.reduce((acc: number, e: any) => acc + e.moodLevel, 0) / userMoodEntries.length
      : 0;
    
    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = userMoodEntries.some((e: any) => 
        new Date(e.date).toDateString() === checkDate.toDateString()
      );
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    // Get Task stats
    const tasks = JSON.parse(localStorage.getItem('pomodoro_tasks') || '[]');
    const completedTasks = tasks.filter((t: any) => t.isCompleted).length;
    
    setStats({
      totalPomodoros,
      totalMoodEntries,
      currentMoodStreak: streak,
      averageMood: Math.round(averageMood * 10) / 10,
      totalFocusHours: Math.round(totalMinutes / 60 * 10) / 10,
      completedTasks,
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      firstName,
      lastName,
      phone,
      age,
      location,
      language,
      bio,
      emergencyContact,
    };

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    router.push('/user/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent mb-3">
            My Profile
          </h1>
          <p className="text-slate-600 text-lg">
            Manage your personal information and view your wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b-2 border-slate-100">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {firstName.charAt(0)}{lastName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-all">
                    <Camera className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800">{firstName} {lastName}</h2>
                  <p className="text-slate-600">{user.email}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              {/* Edit Toggle */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        loadUserData();
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800">{firstName || 'Not set'}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800">{lastName || 'Not set'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <p className="px-4 py-3 bg-slate-100 rounded-xl text-slate-500">{user.email}</p>
                  <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800">{phone || 'Not set'}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={age || ''}
                      onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="25"
                      min="13"
                      max="120"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800">{age || 'Not set'}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="New York, USA"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800">{location || 'Not set'}</p>
                  )}
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Language
                  </label>
                  {isEditing ? (
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Urdu">Urdu</option>
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800">{language}</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Emergency Contact
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="+1 (555) 987-6543"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800">{emergencyContact || 'Not set'}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  About Me
                </label>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none resize-none"
                  />
                ) : (
                  <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 min-h-[100px]">{bio || 'No bio yet'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Wellness Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Your Wellness Stats
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium">🍅 Pomodoros</span>
                    <span className="text-2xl font-bold text-blue-600">{stats?.totalPomodoros || 0}</span>
                  </div>
                  <p className="text-xs text-slate-500">{stats?.totalFocusHours || 0} hours of focused work</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium">📊 Mood Entries</span>
                    <span className="text-2xl font-bold text-teal-600">{stats?.totalMoodEntries || 0}</span>
                  </div>
                  <p className="text-xs text-slate-500">Average: {stats?.averageMood || 0}/10</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border-2 border-sky-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium">🔥 Current Streak</span>
                    <span className="text-2xl font-bold text-sky-600">{stats?.currentMoodStreak || 0}</span>
                  </div>
                  <p className="text-xs text-slate-500">Consecutive days tracked</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium">✅ Tasks Done</span>
                    <span className="text-2xl font-bold text-green-600">{stats?.completedTasks || 0}</span>
                  </div>
                  <p className="text-xs text-slate-500">Tasks completed</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/mood-journal')}
                  className="w-full py-3 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-xl font-medium hover:from-teal-200 hover:to-cyan-200 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Check-in Mood
                </button>
                <button 
                  onClick={() => router.push('/pomodoro')}
                  className="w-full py-3 bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 rounded-xl font-medium hover:from-blue-200 hover:to-sky-200 transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Start Pomodoro
                </button>
                <button 
                  onClick={() => router.push('/booking')}
                  className="w-full py-3 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 rounded-xl font-medium hover:from-cyan-200 hover:to-teal-200 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
