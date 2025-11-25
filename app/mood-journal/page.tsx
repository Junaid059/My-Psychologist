'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserId, requireAuth } from '@/lib/client-auth';
import { Calendar, TrendingUp, Heart, Smile, Meh, Frown, CloudRain, Sun, Cloud, Wind, Zap, Coffee, Users, Home, Briefcase, Activity, Plus, X, ChevronLeft, ChevronRight, BarChart3, LineChart, PieChart, Book, Sparkles, Award, Target, AlertCircle, CheckCircle, Edit2, Trash2 } from 'lucide-react';

type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface MoodEntry {
  id: string;
  userId: string;
  date: string;
  moodLevel: MoodLevel;
  emotions: string[];
  triggers: string[];
  activities: string[];
  notes: string;
  gratitude?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function MoodJournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentView, setCurrentView] = useState<'entry' | 'calendar' | 'analytics'>('entry');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  
  // Form state
  const [moodLevel, setMoodLevel] = useState<MoodLevel>(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);

  // Check authentication on mount - GUEST MODE ALLOWED
  useEffect(() => {
    const id = getUserId();
    if (id) {
      setUserId(id);
      setIsGuest(false);
    } else {
      // Guest mode - can track mood but won't be saved
      setIsGuest(true);
      console.log('🎭 Guest mode - Mood entries will not be saved');
    }
  }, [router]);

  // Available options
  const emotions = [
    { name: 'Happy', icon: '😊', color: 'from-yellow-400 to-orange-400' },
    { name: 'Sad', icon: '😢', color: 'from-blue-400 to-indigo-400' },
    { name: 'Anxious', icon: '😰', color: 'from-purple-400 to-pink-400' },
    { name: 'Angry', icon: '😠', color: 'from-red-400 to-orange-400' },
    { name: 'Calm', icon: '😌', color: 'from-teal-400 to-cyan-400' },
    { name: 'Excited', icon: '🤩', color: 'from-pink-400 to-rose-400' },
    { name: 'Tired', icon: '😴', color: 'from-slate-400 to-gray-400' },
    { name: 'Energetic', icon: '⚡', color: 'from-yellow-400 to-amber-400' },
    { name: 'Grateful', icon: '🙏', color: 'from-green-400 to-emerald-400' },
    { name: 'Lonely', icon: '😔', color: 'from-indigo-400 to-blue-400' },
    { name: 'Confident', icon: '😎', color: 'from-cyan-400 to-blue-400' },
    { name: 'Stressed', icon: '😫', color: 'from-orange-400 to-red-400' },
  ];

  const triggers = [
    { name: 'Work', icon: '💼' },
    { name: 'Relationships', icon: '❤️' },
    { name: 'Family', icon: '👨‍👩‍👧' },
    { name: 'Health', icon: '🏥' },
    { name: 'Money', icon: '💰' },
    { name: 'Sleep', icon: '😴' },
    { name: 'Social', icon: '👥' },
    { name: 'Weather', icon: '🌤️' },
    { name: 'Exercise', icon: '🏃' },
    { name: 'Food', icon: '🍽️' },
    { name: 'News', icon: '📰' },
    { name: 'Other', icon: '📌' },
  ];

  const activities = [
    { name: 'Exercise', icon: '🏃' },
    { name: 'Meditation', icon: '🧘' },
    { name: 'Reading', icon: '📚' },
    { name: 'Music', icon: '🎵' },
    { name: 'Socializing', icon: '👥' },
    { name: 'Work', icon: '💼' },
    { name: 'Hobbies', icon: '🎨' },
    { name: 'Nature', icon: '🌳' },
    { name: 'Therapy', icon: '💭' },
    { name: 'Sleep', icon: '😴' },
    { name: 'Cooking', icon: '👨‍🍳' },
    { name: 'Gaming', icon: '🎮' },
  ];

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mood_entries');
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('mood_entries', JSON.stringify(entries));
    }
  }, [entries]);

  // Check if there's an entry for today
  const todayEntry = entries.find(e => 
    new Date(e.date).toDateString() === new Date().toDateString()
  );

  const handleSubmitEntry = async () => {
    const entry: MoodEntry = {
      id: editingEntry?.id || `entry_${Date.now()}`,
      userId: userId || 'guest',
      date: selectedDate.toISOString(),
      moodLevel,
      emotions: selectedEmotions,
      triggers: selectedTriggers,
      activities: selectedActivities,
      notes,
      gratitude: gratitude || undefined,
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
      updatedAt: editingEntry ? new Date().toISOString() : undefined,
    };

    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? entry : e));
    } else {
      setEntries([...entries, entry]);
    }

    // Save to backend ONLY if logged in
    if (!isGuest && userId) {
      try {
        const response = await fetch('/api/mood-journal', {
          method: editingEntry ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
        
        if (response.ok) {
          console.log('✅ Mood entry saved to database');
        }
      } catch (error) {
        console.error('Error saving mood entry:', error);
      }
    } else {
      console.log('🎭 Guest mode - Entry not saved to database');
    }

    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? entry : e));
    } else {
      setEntries([...entries, entry]);
    }

    // Save to backend
    try {
      const response = await fetch('/api/mood-journal', {
        method: editingEntry ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      
      if (response.ok) {
        console.log('Mood entry saved successfully');
      }
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }

    resetForm();
  };

  const resetForm = () => {
    setMoodLevel(5);
    setSelectedEmotions([]);
    setSelectedTriggers([]);
    setSelectedActivities([]);
    setNotes('');
    setGratitude('');
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const editEntry = (entry: MoodEntry) => {
    setEditingEntry(entry);
    setMoodLevel(entry.moodLevel);
    setSelectedEmotions(entry.emotions);
    setSelectedTriggers(entry.triggers);
    setSelectedActivities(entry.activities);
    setNotes(entry.notes);
    setGratitude(entry.gratitude || '');
    setShowEntryForm(true);
  };

  // Analytics calculations
  const getLast7DaysData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toDateString();
    });

    return last7Days.map(dateStr => {
      const entry = entries.find(e => new Date(e.date).toDateString() === dateStr);
      return {
        date: dateStr,
        mood: entry?.moodLevel || null,
        hasEntry: !!entry,
      };
    });
  };

  const getLast30DaysData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toDateString();
    });

    return last30Days.map(dateStr => {
      const entry = entries.find(e => new Date(e.date).toDateString() === dateStr);
      return {
        date: new Date(dateStr).getDate(),
        mood: entry?.moodLevel || null,
      };
    });
  };

  const getAverageMood = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, e) => acc + e.moodLevel, 0);
    return (sum / entries.length).toFixed(1);
  };

  const getMoodTrend = () => {
    if (entries.length < 2) return 'neutral';
    const recent = entries.slice(-7);
    const older = entries.slice(-14, -7);
    
    const recentAvg = recent.reduce((acc, e) => acc + e.moodLevel, 0) / recent.length;
    const olderAvg = older.reduce((acc, e) => acc + e.moodLevel, 0) / (older.length || 1);
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  const getTopEmotions = () => {
    const emotionCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });
    
    return Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const getTopTriggers = () => {
    const triggerCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });
    
    return Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const getCurrentStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = entries.some(e => 
        new Date(e.date).toDateString() === checkDate.toDateString()
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const moodColors = [
    'from-red-500 to-red-600',      // 1
    'from-orange-500 to-red-500',   // 2
    'from-orange-400 to-orange-500', // 3
    'from-yellow-400 to-orange-400', // 4
    'from-yellow-300 to-yellow-400', // 5
    'from-lime-400 to-yellow-400',   // 6
    'from-green-400 to-lime-400',    // 7
    'from-green-500 to-green-600',   // 8
    'from-emerald-500 to-green-500', // 9
    'from-teal-500 to-emerald-500',  // 10
  ];

  const moodEmojis = ['😢', '😔', '😕', '😐', '🙂', '😊', '😄', '😁', '🤗', '🤩'];
  const moodLabels = ['Terrible', 'Very Bad', 'Bad', 'Poor', 'Okay', 'Good', 'Great', 'Very Good', 'Excellent', 'Amazing'];

  const last7Days = getLast7DaysData();
  const last30Days = getLast30DaysData();
  const avgMood = getAverageMood();
  const trend = getMoodTrend();
  const topEmotions = getTopEmotions();
  const topTriggers = getTopTriggers();
  const streak = getCurrentStreak();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Guest Mode Banner */}
        {isGuest && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">Guest Mode</p>
                <p className="text-sm text-amber-700">You can track your mood, but entries won't be saved</p>
              </div>
            </div>
            <Link
              href="/login"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Login to Save
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent mb-3">
            📊 Mood Journal
          </h1>
          <p className="text-slate-600 text-lg">
            Track your emotions, discover patterns, improve your wellbeing
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-3xl font-bold text-blue-600">{streak}</p>
            <p className="text-slate-600 text-sm">Day Streak</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-3xl font-bold text-cyan-600">{avgMood}</p>
            <p className="text-slate-600 text-sm">Avg Mood</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-3xl font-bold text-sky-600">{entries.length}</p>
            <p className="text-slate-600 text-sm">Total Entries</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">
              {trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️'}
            </div>
            <p className="text-lg font-bold text-teal-600 capitalize">{trend}</p>
            <p className="text-slate-600 text-sm">Trend</p>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setCurrentView('entry')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentView === 'entry'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Plus className="w-5 h-5 inline mr-2" />
            New Entry
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentView === 'calendar'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            History
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentView === 'analytics'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Analytics
          </button>
        </div>

        {/* New Entry View */}
        {currentView === 'entry' && (
          <div className="max-w-4xl mx-auto">
            {todayEntry && !showEntryForm ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">You've checked in today! 🎉</h2>
                  <p className="text-slate-600">Come back tomorrow for your next mood check-in</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => editEntry(todayEntry)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Edit2 className="w-4 h-4 inline mr-2" />
                    Edit Today's Entry
                  </button>
                  <button
                    onClick={() => setCurrentView('analytics')}
                    className="px-6 py-3 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-50 border-2 border-slate-200"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  {editingEntry ? 'Edit Mood Entry' : "How are you feeling today?"}
                </h2>

                {/* Mood Scale */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-700 mb-4">
                    Mood Level: {moodLevel}/10 - {moodLabels[moodLevel - 1]} {moodEmojis[moodLevel - 1]}
                  </label>
                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                      <button
                        key={level}
                        onClick={() => setMoodLevel(level as MoodLevel)}
                        className={`flex-1 h-12 rounded-xl font-bold text-white transition-all transform hover:scale-105 ${
                          moodLevel === level
                            ? `bg-gradient-to-br ${moodColors[level - 1]} shadow-lg scale-110`
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 px-1">
                    <span>Terrible</span>
                    <span>Amazing</span>
                  </div>
                </div>

                {/* Emotions */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-700 mb-4">
                    How do you feel? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.name}
                        onClick={() => {
                          if (selectedEmotions.includes(emotion.name)) {
                            setSelectedEmotions(selectedEmotions.filter(e => e !== emotion.name));
                          } else {
                            setSelectedEmotions([...selectedEmotions, emotion.name]);
                          }
                        }}
                        className={`p-4 rounded-2xl text-center transition-all transform hover:scale-105 ${
                          selectedEmotions.includes(emotion.name)
                            ? `bg-gradient-to-br ${emotion.color} text-white shadow-lg scale-105`
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        <div className="text-3xl mb-2">{emotion.icon}</div>
                        <div className="text-sm font-medium">{emotion.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Triggers */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-700 mb-4">
                    What influenced your mood?
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {triggers.map((trigger) => (
                      <button
                        key={trigger.name}
                        onClick={() => {
                          if (selectedTriggers.includes(trigger.name)) {
                            setSelectedTriggers(selectedTriggers.filter(t => t !== trigger.name));
                          } else {
                            setSelectedTriggers([...selectedTriggers, trigger.name]);
                          }
                        }}
                        className={`p-4 rounded-2xl text-center transition-all transform hover:scale-105 ${
                          selectedTriggers.includes(trigger.name)
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        <div className="text-2xl mb-2">{trigger.icon}</div>
                        <div className="text-xs font-medium">{trigger.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-700 mb-4">
                    What did you do today?
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {activities.map((activity) => (
                      <button
                        key={activity.name}
                        onClick={() => {
                          if (selectedActivities.includes(activity.name)) {
                            setSelectedActivities(selectedActivities.filter(a => a !== activity.name));
                          } else {
                            setSelectedActivities([...selectedActivities, activity.name]);
                          }
                        }}
                        className={`p-4 rounded-2xl text-center transition-all transform hover:scale-105 ${
                          selectedActivities.includes(activity.name)
                            ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg scale-105'
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        <div className="text-2xl mb-2">{activity.icon}</div>
                        <div className="text-xs font-medium">{activity.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-slate-700 mb-3">
                    Journal Entry (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How was your day? What's on your mind?"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Gratitude */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-700 mb-3">
                    What are you grateful for today? 🙏
                  </label>
                  <input
                    type="text"
                    value={gratitude}
                    onChange={(e) => setGratitude(e.target.value)}
                    placeholder="I'm grateful for..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    onClick={handleSubmitEntry}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                  >
                    {editingEntry ? 'Update Entry' : 'Save Entry'}
                  </button>
                  {editingEntry && (
                    <button
                      onClick={resetForm}
                      className="px-8 py-4 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 7-Day Mood Chart Preview */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mt-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Last 7 Days</h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {last7Days.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center mb-2" style={{ height: '150px' }}>
                      {day.hasEntry && day.mood && (
                        <div
                          className={`w-full bg-gradient-to-t ${moodColors[day.mood - 1]} rounded-t-lg transition-all hover:opacity-80`}
                          style={{ height: `${day.mood * 10}%` }}
                        >
                          <div className="text-center text-white font-bold pt-2 text-sm">
                            {day.mood}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar/History View */}
        {currentView === 'calendar' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Mood History</h2>
              
              <div className="space-y-4">
                {entries.length === 0 ? (
                  <div className="text-center py-12">
                    <Book className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No entries yet</p>
                    <p className="text-slate-400 text-sm">Start tracking your mood to see your history</p>
                  </div>
                ) : (
                  entries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-4xl">{moodEmojis[entry.moodLevel - 1]}</span>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                  {moodLabels[entry.moodLevel - 1]} ({entry.moodLevel}/10)
                                </h3>
                                <p className="text-sm text-slate-500">
                                  {new Date(entry.date).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editEntry(entry)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {entry.emotions.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-slate-600 mb-2">Emotions:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.emotions.map((emotion) => (
                                <span
                                  key={emotion}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                  {emotions.find(e => e.name === emotion)?.icon} {emotion}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.triggers.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-slate-600 mb-2">Triggers:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.triggers.map((trigger) => (
                                <span
                                  key={trigger}
                                  className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm"
                                >
                                  {triggers.find(t => t.name === trigger)?.icon} {trigger}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.activities.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-slate-600 mb-2">Activities:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.activities.map((activity) => (
                                <span
                                  key={activity}
                                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                                >
                                  {activities.find(a => a.name === activity)?.icon} {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.notes && (
                          <div className="mb-3 p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-700">{entry.notes}</p>
                          </div>
                        )}

                        {entry.gratitude && (
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                            <p className="text-sm text-green-800">
                              <span className="font-semibold">🙏 Grateful for:</span> {entry.gratitude}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 30-Day Mood Trend */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:col-span-2">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <LineChart className="w-6 h-6 text-blue-500" />
                30-Day Mood Trend
              </h2>
              <div className="flex items-end justify-between gap-1 h-64">
                {last30Days.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                      {day.mood && (
                        <div
                          className={`w-full bg-gradient-to-t ${moodColors[day.mood - 1]} rounded-t transition-all hover:opacity-80`}
                          style={{ height: `${day.mood * 10}%` }}
                          title={`Day ${day.date}: ${day.mood}/10`}
                        />
                      )}
                    </div>
                    {index % 5 === 0 && (
                      <div className="text-xs text-slate-400 mt-2">{day.date}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-4">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Top Emotions */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-cyan-500" />
                Most Common Emotions
              </h2>
              <div className="space-y-4">
                {topEmotions.length > 0 ? (
                  topEmotions.map((emotion, index) => {
                    const emotionData = emotions.find(e => e.name === emotion.name);
                    return (
                      <div key={emotion.name} className="flex items-center gap-4">
                        <div className="text-3xl">{emotionData?.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-slate-700">{emotion.name}</span>
                            <span className="text-slate-500">{emotion.count} times</span>
                          </div>
                          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${emotionData?.color}`}
                              style={{ width: `${(emotion.count / entries.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-center py-8">No data yet</p>
                )}
              </div>
            </div>

            {/* Top Triggers */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-sky-500" />
                Common Triggers
              </h2>
              <div className="space-y-4">
                {topTriggers.length > 0 ? (
                  topTriggers.map((trigger) => {
                    const triggerData = triggers.find(t => t.name === trigger.name);
                    return (
                      <div key={trigger.name} className="flex items-center gap-4">
                        <div className="text-3xl">{triggerData?.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-slate-700">{trigger.name}</span>
                            <span className="text-slate-500">{trigger.count} times</span>
                          </div>
                          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              style={{ width: `${(trigger.count / entries.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-center py-8">No data yet</p>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:col-span-2">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-teal-500" />
                Insights & Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trend === 'improving' && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                    <div className="text-3xl mb-3">📈</div>
                    <h3 className="font-bold text-green-800 mb-2">Great Progress!</h3>
                    <p className="text-green-700 text-sm">
                      Your mood has been improving lately. Keep up whatever you're doing!
                    </p>
                  </div>
                )}
                {trend === 'declining' && (
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200">
                    <div className="text-3xl mb-3">⚠️</div>
                    <h3 className="font-bold text-orange-800 mb-2">Need Support?</h3>
                    <p className="text-orange-700 text-sm">
                      Your mood seems lower recently. Consider talking to a therapist or loved one.
                    </p>
                  </div>
                )}
                {streak >= 7 && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                    <div className="text-3xl mb-3">🔥</div>
                    <h3 className="font-bold text-blue-800 mb-2">Amazing Streak!</h3>
                    <p className="text-blue-700 text-sm">
                      You've been consistent for {streak} days! Self-awareness is key to growth.
                    </p>
                  </div>
                )}
                {Number(avgMood) >= 7 && (
                  <div className="p-6 bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl border-2 border-teal-200">
                    <div className="text-3xl mb-3">😊</div>
                    <h3 className="font-bold text-teal-800 mb-2">Thriving!</h3>
                    <p className="text-teal-700 text-sm">
                      Your average mood is {avgMood}/10. You're doing great! Share your positivity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
