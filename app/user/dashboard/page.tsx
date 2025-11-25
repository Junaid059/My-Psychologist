'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Calendar, Clock, Heart, TrendingUp, Activity, 
  CheckCircle, XCircle, AlertCircle, Target, Award, Zap,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface DashboardData {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    phone: string;
    location: string;
    createdAt: string;
  };
  stats: {
    pomodoro: {
      total: number;
      today: number;
      thisWeek: number;
      totalFocusHours: number;
      totalFocusMinutes: number;
      recentSessions: number;
    };
    mood: {
      totalEntries: number;
      averageMood: number;
      currentStreak: number;
      recentEntries: number;
      topEmotions: Array<{ emotion: string; count: number }>;
    };
    appointments: {
      total: number;
      upcoming: number;
      completed: number;
      cancelled: number;
      pending: number;
    };
    bookings: {
      total: number;
      active: number;
      completed: number;
    };
  };
  recentActivity: {
    pomodoroSessions: any[];
    moodEntries: any[];
    appointments: any[];
    bookings: any[];
  };
}

const UserDashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userToken = localStorage.getItem('userToken') || localStorage.getItem('user_token');
      
      if (!userToken) {
        console.log('❌ No token found, redirecting to login');
        router.push('/login');
        return;
      }

      console.log('🔐 Token found, fetching dashboard...');
      const userFromStorage = localStorage.getItem('user');
      console.log('📋 User from localStorage:', userFromStorage ? JSON.parse(userFromStorage) : null);

      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      console.log('📡 Dashboard API response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('❌ Unauthorized, redirecting to login');
          localStorage.removeItem('userToken');
          localStorage.removeItem('user_token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        
        // Log the error response
        const errorData = await response.json();
        console.error('❌ API Error Response:', errorData);
        console.error('❌ Error message:', errorData.error);
        console.error('❌ UserId from token:', errorData.userId);
        console.error('❌ Debug info:', errorData.debug);
        throw new Error(errorData.error || 'Failed to fetch dashboard data');
      }

      const data = await response.json();
      console.log('✅ Dashboard data loaded:', data);
      setDashboardData(data);
    } catch (err: any) {
      console.error('❌ Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (level: number) => {
    if (level >= 8) return 'text-green-600 bg-green-50';
    if (level >= 6) return 'text-blue-600 bg-blue-50';
    if (level >= 4) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getMoodEmoji = (level: number) => {
    if (level >= 8) return '😊';
    if (level >= 6) return '🙂';
    if (level >= 4) return '😐';
    return '😔';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-slate-600 mb-6">{error || 'Something went wrong'}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const { user, stats, recentActivity } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user.firstName || 'User'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Here's your mental wellness journey overview
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pomodoro Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                Today: {stats.pomodoro.today}
              </span>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">Total Pomodoros</h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">{stats.pomodoro.total}</p>
            <div className="text-sm text-slate-500">
              {stats.pomodoro.totalFocusHours} hours focused
            </div>
          </div>

          {/* Mood Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl">{getMoodEmoji(stats.mood.averageMood)}</span>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">Average Mood</h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">{stats.mood.averageMood}/10</p>
            <div className="text-sm text-slate-500">
              🔥 {stats.mood.currentStreak} day streak
            </div>
          </div>

          {/* Appointments Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {stats.appointments.upcoming} upcoming
              </span>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">Appointments</h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">{stats.appointments.total}</p>
            <div className="text-sm text-slate-500">
              ✅ {stats.appointments.completed} completed
            </div>
          </div>

          {/* Bookings Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {stats.bookings.active} active
              </span>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">Total Bookings</h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">{stats.bookings.total}</p>
            <div className="text-sm text-slate-500">
              {stats.bookings.completed} completed
            </div>
          </div>
        </div>

        {/* Detailed Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Appointment Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Appointment Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  Pending
                </span>
                <span className="text-blue-600 font-bold">{stats.appointments.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Completed
                </span>
                <span className="text-green-600 font-bold">{stats.appointments.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Cancelled
                </span>
                <span className="text-red-600 font-bold">{stats.appointments.cancelled}</span>
              </div>
            </div>
          </div>

          {/* Top Emotions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              Top Emotions
            </h3>
            {stats.mood.topEmotions.length > 0 ? (
              <div className="space-y-3">
                {stats.mood.topEmotions.map((emotion, index) => (
                  <div key={emotion.emotion} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">
                      {index + 1}. {emotion.emotion}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                          style={{ width: `${(emotion.count / stats.mood.topEmotions[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-600 w-8 text-right">{emotion.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No emotions logged yet</p>
            )}
          </div>

          {/* Weekly Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              This Week
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Pomodoros</p>
                  <p className="text-2xl font-bold text-red-600">{stats.pomodoro.thisWeek}</p>
                </div>
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Mood Entries</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.mood.recentEntries}</p>
                </div>
                <Heart className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Focus Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round((stats.pomodoro.totalFocusMinutes / 60) * 10) / 10}</p>
                </div>
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Pomodoro Sessions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Recent Pomodoro Sessions
            </h3>
            {recentActivity.pomodoroSessions.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentActivity.pomodoroSessions.map((session: any) => (
                  <div key={session.id || session._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        session.mode === 'work' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {session.mode === 'work' ? '🍅' : '☕'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {session.taskTitle || `${session.mode === 'work' ? 'Work' : 'Break'} Session`}
                        </p>
                        <p className="text-sm text-slate-500">
                          {session.duration} min • {new Date(session.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {session.distractions > 0 && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        {session.distractions} distractions
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No sessions yet</p>
                <button
                  onClick={() => router.push('/pomodoro')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start your first session →
                </button>
              </div>
            )}
          </div>

          {/* Recent Mood Entries */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              Recent Mood Entries
            </h3>
            {recentActivity.moodEntries.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentActivity.moodEntries.map((entry: any) => (
                  <div key={entry.id || entry._id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMoodColor(entry.moodLevel)}`}>
                        {getMoodEmoji(entry.moodLevel)} {entry.moodLevel}/10
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.emotions.slice(0, 3).map((emotion: string) => (
                          <span key={emotion} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {emotion}
                          </span>
                        ))}
                        {entry.emotions.length > 3 && (
                          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                            +{entry.emotions.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Heart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No mood entries yet</p>
                <button
                  onClick={() => router.push('/mood-journal')}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Log your first mood →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/pomodoro')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-4 rounded-xl text-left border border-white/30"
            >
              <Clock className="w-8 h-8 mb-2" />
              <h4 className="font-bold mb-1">Start Pomodoro</h4>
              <p className="text-sm text-blue-100">Focus on your tasks</p>
            </button>
            <button
              onClick={() => router.push('/mood-journal')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-4 rounded-xl text-left border border-white/30"
            >
              <Heart className="w-8 h-8 mb-2" />
              <h4 className="font-bold mb-1">Log Mood</h4>
              <p className="text-sm text-blue-100">Track your emotions</p>
            </button>
            <button
              onClick={() => router.push('/booking')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-4 rounded-xl text-left border border-white/30"
            >
              <Calendar className="w-8 h-8 mb-2" />
              <h4 className="font-bold mb-1">Book Session</h4>
              <p className="text-sm text-blue-100">Schedule therapy</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
