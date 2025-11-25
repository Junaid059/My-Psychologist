'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserId, requireAuth } from '@/lib/client-auth';
import { Play, Pause, RotateCcw, Settings, X, Target, Coffee, Clock, Plus, Trash2, Check, Circle, ListTodo, TrendingUp, BarChart3, Calendar, Zap, Award, AlertCircle, Edit2, ChevronDown, Filter } from 'lucide-react';

type TimerMode = 'work' | 'break' | 'longBreak' | 'custom';
type TimerStatus = 'idle' | 'running' | 'paused';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type TaskCategory = 'work' | 'study' | 'personal' | 'health' | 'project' | 'other';

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  dailyGoal: number;
}

interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

interface Session {
  userId: string;
  mode: TimerMode;
  duration: number;
  completedAt: string;
  taskId?: string;
  taskTitle?: string;
  distractions?: number;
}

export default function EnhancedPomodoroPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  
  // Settings with defaults
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    soundEnabled: true,
    autoStartBreaks: false,
    autoStartWork: false,
    dailyGoal: 8,
  });

  // Timer state
  const [mode, setMode] = useState<TimerMode>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Task management state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'work' as TaskCategory,
    priority: 'medium' as TaskPriority,
    estimatedPomodoros: 1,
    notes: '',
  });

  // Distraction counter
  const [distractionCount, setDistractionCount] = useState(0);

  // View state
  const [activeView, setActiveView] = useState<'timer' | 'tasks' | 'stats'>('timer');
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Check authentication on mount - GUEST MODE ALLOWED
  useEffect(() => {
    const id = getUserId();
    if (id) {
      setUserId(id);
      setIsGuest(false);
    } else {
      // Guest mode - can use timer but data won't persist
      setIsGuest(true);
      console.log('🎭 Guest mode - Sessions will not be saved');
    }
  }, [router]);

  // Fetch sessions and tasks on mount
  useEffect(() => {
    if (userId) {
      fetchSessions();
      loadTasks();
    }
  }, [userId]);

  // Load tasks from localStorage
  const loadTasks = () => {
    const stored = localStorage.getItem('pomodoro_tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      // Add some example tasks
      const exampleTasks: Task[] = [
        {
          id: '1',
          title: 'Complete project documentation',
          category: 'work',
          priority: 'high',
          estimatedPomodoros: 3,
          completedPomodoros: 0,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Study React advanced patterns',
          category: 'study',
          priority: 'medium',
          estimatedPomodoros: 2,
          completedPomodoros: 0,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        },
      ];
      setTasks(exampleTasks);
      localStorage.setItem('pomodoro_tasks', JSON.stringify(exampleTasks));
    }
  };

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/pomodoro/sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Timer logic
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  const handleTimerComplete = () => {
    setStatus('idle');
    
    // Play alarm sound
    if (settings.soundEnabled) {
      playAlarmSound();
    }

    // Show notification
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Work session complete! Time for a break.' : 'Break complete! Ready to focus?',
        icon: '/favicon.ico',
      });
    }

    // Save session
    saveSession();

    // Update task progress if working
    if (mode === 'work' && activeTaskId) {
      updateTaskProgress(activeTaskId);
    }

    // Auto-switch modes
    if (mode === 'work') {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      
      if (newCount % settings.longBreakInterval === 0) {
        switchMode('longBreak');
        if (settings.autoStartBreaks) {
          setTimeout(() => setStatus('running'), 1000);
        }
      } else {
        switchMode('break');
        if (settings.autoStartBreaks) {
          setTimeout(() => setStatus('running'), 1000);
        }
      }
    } else {
      switchMode('work');
      if (settings.autoStartWork) {
        setTimeout(() => setStatus('running'), 1000);
      }
    }

    // Reset distraction counter
    setDistractionCount(0);
  };

  const playAlarmSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a calming, zen-like chime with harmonious notes
    const createNote = (frequency: number, startTime: number, duration: number, volume: number = 0.15) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine'; // Smooth sine wave for calm sound
      
      // Gentle fade in and out for soothing effect
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05); // Quick fade in
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration); // Gentle fade out
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    // Beautiful harmonic sequence: C - E - G - C (C major chord arpeggio)
    // These frequencies create a peaceful, resolved feeling
    const currentTime = audioContext.currentTime;
    
    // C5 (523.25 Hz) - Root note
    createNote(523.25, currentTime, 1.2, 0.12);
    
    // E5 (659.25 Hz) - Major third - adds warmth
    createNote(659.25, currentTime + 0.25, 1.2, 0.10);
    
    // G5 (783.99 Hz) - Perfect fifth - adds stability
    createNote(783.99, currentTime + 0.5, 1.5, 0.10);
    
    // C6 (1046.50 Hz) - Octave - creates resolution and completeness
    createNote(1046.50, currentTime + 0.8, 2.0, 0.08);
    
    // Add a subtle low harmonic for depth (C4)
    createNote(261.63, currentTime, 2.5, 0.06);
  };

  const saveSession = async () => {
    // Guest mode - don't save to backend
    if (isGuest || !userId) {
      console.log('🎭 Guest mode - Session not saved');
      return;
    }
    
    const activeTask = tasks.find(t => t.id === activeTaskId);
    
    const sessionData = {
      userId: userId,
      mode,
      duration: mode === 'work' ? settings.workDuration : mode === 'break' ? settings.breakDuration : settings.longBreakDuration,
      completedAt: new Date().toISOString(),
      taskId: activeTaskId,
      taskTitle: activeTask?.title,
      distractions: distractionCount,
    };

    try {
      const response = await fetch('/api/pomodoro/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      
      if (response.ok) {
        fetchSessions();
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const updateTaskProgress = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newCompleted = task.completedPomodoros + 1;
        return {
          ...task,
          completedPomodoros: newCompleted,
          isCompleted: newCompleted >= task.estimatedPomodoros,
          completedAt: newCompleted >= task.estimatedPomodoros ? new Date().toISOString() : undefined,
        };
      }
      return task;
    }));
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    const duration = newMode === 'work' ? settings.workDuration : newMode === 'break' ? settings.breakDuration : settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const handleStart = () => {
    if (status === 'idle' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setStatus('running');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleReset = () => {
    setStatus('idle');
    const duration = mode === 'work' ? settings.workDuration : mode === 'break' ? settings.breakDuration : settings.longBreakDuration;
    setTimeLeft(duration * 60);
    setDistractionCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = mode === 'work' ? settings.workDuration * 60 : mode === 'break' ? settings.breakDuration * 60 : settings.longBreakDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Task management functions
  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      estimatedPomodoros: newTask.estimatedPomodoros,
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      notes: newTask.notes,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      category: 'work',
      priority: 'medium',
      estimatedPomodoros: 1,
      notes: '',
    });
    setShowTaskForm(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          isCompleted: !task.isCompleted,
          completedAt: !task.isCompleted ? new Date().toISOString() : undefined,
        };
      }
      return task;
    }));
  };

  // Statistics calculations
  const getTodaySessions = () => {
    const today = new Date().toDateString();
    return sessions.filter(s => new Date(s.completedAt).toDateString() === today);
  };

  const getTodayPomodoros = () => {
    return getTodaySessions().filter(s => s.mode === 'work').length;
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySessions = sessions.filter(s => new Date(s.completedAt) >= weekAgo);
    const workSessions = weeklySessions.filter(s => s.mode === 'work');
    const totalMinutes = workSessions.reduce((acc, s) => acc + s.duration, 0);
    const avgDistractions = workSessions.reduce((acc, s) => acc + (s.distractions || 0), 0) / (workSessions.length || 1);
    
    return {
      totalPomodoros: workSessions.length,
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      avgDistractions: Math.round(avgDistractions * 10) / 10,
      dailyAverage: Math.round(workSessions.length / 7 * 10) / 10,
    };
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'active') return !task.isCompleted;
    if (taskFilter === 'completed') return task.isCompleted;
    return true;
  });

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700 border-blue-300',
    medium: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    high: 'bg-sky-100 text-sky-700 border-sky-300',
    urgent: 'bg-teal-100 text-teal-700 border-teal-300',
  };

  const categoryIcons = {
    work: '💼',
    study: '📚',
    personal: '🏠',
    health: '💪',
    project: '🎯',
    other: '📌',
  };

  const weeklyStats = getWeeklyStats();
  const todayPomodoros = getTodayPomodoros();
  const goalProgress = (todayPomodoros / settings.dailyGoal) * 100;

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
                <p className="text-sm text-amber-700">You can use the timer, but sessions won't be saved</p>
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
            🍅 Enhanced Pomodoro Timer
          </h1>
          <p className="text-slate-600 text-lg">
            Focus, track tasks, and boost productivity
          </p>
        </div>

        {/* View Selector */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveView('timer')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'timer'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            Timer
          </button>
          <button
            onClick={() => setActiveView('tasks')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'tasks'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ListTodo className="w-5 h-5 inline mr-2" />
            Tasks ({filteredTasks.filter(t => !t.isCompleted).length})
          </button>
          <button
            onClick={() => setActiveView('stats')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'stats'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Statistics
          </button>
        </div>

        {/* Timer View */}
        {activeView === 'timer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Timer */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                {/* Active Task Display */}
                {activeTask && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Currently working on:</p>
                        <h3 className="text-xl font-bold text-slate-800">{categoryIcons[activeTask.category]} {activeTask.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {activeTask.completedPomodoros} / {activeTask.estimatedPomodoros} pomodoros completed
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTaskId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Mode Selector */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => switchMode('work')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      mode === 'work'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Target className="w-4 h-4 inline mr-2" />
                    Focus
                  </button>
                  <button
                    onClick={() => switchMode('break')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      mode === 'break'
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Coffee className="w-4 h-4 inline mr-2" />
                    Short Break
                  </button>
                  <button
                    onClick={() => switchMode('longBreak')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      mode === 'longBreak'
                        ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Award className="w-4 h-4 inline mr-2" />
                    Long Break
                  </button>
                </div>

                {/* Circular Timer */}
                <div className="flex justify-center my-12">
                  <div className="relative">
                    <svg width="320" height="320" className="transform -rotate-90">
                      <circle
                        cx="160"
                        cy="160"
                        r="140"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <circle
                        cx="160"
                        cy="160"
                        r="140"
                        fill="none"
                        stroke={mode === 'work' ? 'url(#gradient-work)' : mode === 'break' ? 'url(#gradient-break)' : 'url(#gradient-long)'}
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 140}`}
                        strokeDashoffset={`${2 * Math.PI * 140 * (1 - getProgress() / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient-work" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient id="gradient-break" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient id="gradient-long" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-7xl font-bold text-slate-800 mb-2">{formatTime(timeLeft)}</p>
                      <p className="text-lg text-slate-500 capitalize">
                        {mode === 'work' ? '🎯 Focus Time' : mode === 'break' ? '☕ Short Break' : '🎉 Long Break'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mb-6">
                  {status === 'running' ? (
                    <button
                      onClick={handlePause}
                      className="px-8 py-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl font-semibold hover:from-slate-600 hover:to-slate-700 transition-all shadow-lg"
                    >
                      <Pause className="w-5 h-5 inline mr-2" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={handleStart}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                    >
                      <Play className="w-5 h-5 inline mr-2" />
                      {status === 'paused' ? 'Resume' : 'Start'}
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-lg border-2 border-slate-200"
                  >
                    <RotateCcw className="w-5 h-5 inline mr-2" />
                    Reset
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-lg border-2 border-slate-200"
                  >
                    <Settings className="w-5 h-5 inline mr-2" />
                    Settings
                  </button>
                </div>

                {/* Distraction Counter */}
                {status === 'running' && mode === 'work' && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setDistractionCount(distractionCount + 1)}
                      className="px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-xl font-medium hover:from-teal-200 hover:to-cyan-200 transition-all border-2 border-teal-300"
                    >
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      Mark Distraction ({distractionCount})
                    </button>
                  </div>
                )}

                {/* Session Progress */}
                <div className="mt-6 flex justify-center gap-2">
                  {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full ${
                        i < pomodorosCompleted % settings.longBreakInterval
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-slate-500 mt-2">
                  {pomodorosCompleted % settings.longBreakInterval} / {settings.longBreakInterval} until long break
                </p>
              </div>
            </div>

            {/* Side Panel - Quick Stats & Task Selection */}
            <div className="space-y-6">
              {/* Daily Goal */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Today's Goal</h3>
                  <Award className="w-5 h-5 text-cyan-500" />
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-slate-800">{todayPomodoros}</span>
                      <span className="text-slate-500"> / {settings.dailyGoal}</span>
                    </div>
                    <span className="text-sm font-semibold text-cyan-600">
                      {Math.min(100, Math.round(goalProgress))}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-200">
                    <div
                      style={{ width: `${Math.min(100, goalProgress)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <span className="text-slate-600">Total Sessions</span>
                    <span className="font-bold text-blue-600">{sessions.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl">
                    <span className="text-slate-600">This Week</span>
                    <span className="font-bold text-cyan-600">{weeklyStats.totalPomodoros}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-sky-50 rounded-xl">
                    <span className="text-slate-600">Current Session</span>
                    <span className="font-bold text-sky-600">#{pomodorosCompleted + 1}</span>
                  </div>
                </div>
              </div>

              {/* Active Tasks Quick Select */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Select Task</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.filter(t => !t.isCompleted).slice(0, 5).map(task => (
                    <button
                      key={task.id}
                      onClick={() => setActiveTaskId(task.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        activeTaskId === task.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <p className="font-medium text-sm">{categoryIcons[task.category]} {task.title}</p>
                      <p className={`text-xs mt-1 ${activeTaskId === task.id ? 'text-white/80' : 'text-slate-500'}`}>
                        {task.completedPomodoros}/{task.estimatedPomodoros} 🍅
                      </p>
                    </button>
                  ))}
                  {tasks.filter(t => !t.isCompleted).length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-4">No active tasks</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks View */}
        {activeView === 'tasks' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Task Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTaskFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      taskFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    All ({tasks.length})
                  </button>
                  <button
                    onClick={() => setTaskFilter('active')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      taskFilter === 'active' ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Active ({tasks.filter(t => !t.isCompleted).length})
                  </button>
                  <button
                    onClick={() => setTaskFilter('completed')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      taskFilter === 'completed' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Completed ({tasks.filter(t => t.isCompleted).length})
                  </button>
                </div>
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Task
                </button>
              </div>

              {/* Task Form */}
              {showTaskForm && (
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Task</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task title..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                        <select
                          value={newTask.category}
                          onChange={(e) => setNewTask({ ...newTask, category: e.target.value as TaskCategory })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="work">💼 Work</option>
                          <option value="study">📚 Study</option>
                          <option value="personal">🏠 Personal</option>
                          <option value="health">💪 Health</option>
                          <option value="project">🎯 Project</option>
                          <option value="other">📌 Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Estimated Pomodoros: {newTask.estimatedPomodoros}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={newTask.estimatedPomodoros}
                        onChange={(e) => setNewTask({ ...newTask, estimatedPomodoros: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <textarea
                      value={newTask.notes}
                      onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                      placeholder="Notes (optional)..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addTask}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600"
                      >
                        Add Task
                      </button>
                      <button
                        onClick={() => setShowTaskForm(false)}
                        className="px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Task List */}
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      task.isCompleted
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-blue-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            task.isCompleted
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-500'
                              : 'border-slate-300 hover:border-blue-400'
                          }`}
                        >
                          {task.isCompleted && <Check className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`text-lg font-semibold ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {categoryIcons[task.category]} {task.title}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>🍅 {task.completedPomodoros} / {task.estimatedPomodoros}</span>
                            <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                          </div>
                          {task.notes && (
                            <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">{task.notes}</p>
                          )}
                          {/* Progress Bar */}
                          <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                              style={{ width: `${Math.min(100, (task.completedPomodoros / task.estimatedPomodoros) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!task.isCompleted && (
                          <button
                            onClick={() => setActiveTaskId(task.id)}
                            className={`p-2 rounded-lg transition-all ${
                              activeTaskId === task.id
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12">
                    <ListTodo className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No tasks yet</p>
                    <p className="text-slate-400 text-sm">Create your first task to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statistics View */}
        {activeView === 'stats' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Overview */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:col-span-2">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                Weekly Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                  <p className="text-slate-600 text-sm mb-2">Total Pomodoros</p>
                  <p className="text-4xl font-bold text-blue-600">{weeklyStats.totalPomodoros}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl border-2 border-cyan-200">
                  <p className="text-slate-600 text-sm mb-2">Total Hours</p>
                  <p className="text-4xl font-bold text-cyan-600">{weeklyStats.totalHours}h</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl border-2 border-sky-200">
                  <p className="text-slate-600 text-sm mb-2">Daily Average</p>
                  <p className="text-4xl font-bold text-sky-600">{weeklyStats.dailyAverage}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border-2 border-teal-200">
                  <p className="text-slate-600 text-sm mb-2">Avg Distractions</p>
                  <p className="text-4xl font-bold text-teal-600">{weeklyStats.avgDistractions}</p>
                </div>
              </div>
            </div>

            {/* Task Statistics */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ListTodo className="w-6 h-6 text-cyan-500" />
                Task Progress
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <span className="text-slate-700 font-medium">Total Tasks</span>
                  <span className="text-2xl font-bold text-blue-600">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-xl">
                  <span className="text-slate-700 font-medium">Completed</span>
                  <span className="text-2xl font-bold text-cyan-600">{tasks.filter(t => t.isCompleted).length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                  <span className="text-slate-700 font-medium">In Progress</span>
                  <span className="text-2xl font-bold text-teal-600">{tasks.filter(t => !t.isCompleted).length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-sky-50 rounded-xl">
                  <span className="text-slate-700 font-medium">Completion Rate</span>
                  <span className="text-2xl font-bold text-sky-600">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-sky-500" />
                Recent Sessions
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessions.slice(0, 10).map((session, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">
                        {session.mode === 'work' ? '🎯 Focus' : session.mode === 'break' ? '☕ Break' : '🎉 Long Break'}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(session.completedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    {session.taskTitle && (
                      <p className="text-sm text-slate-600 mb-1">{session.taskTitle}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{session.duration} min</span>
                      {session.distractions !== undefined && (
                        <span>⚠️ {session.distractions} distractions</span>
                      )}
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-slate-400 text-center py-8">No sessions yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Timer Durations */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-4">Timer Durations</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-2">
                        Focus Duration: {settings.workDuration} minutes
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={settings.workDuration}
                        onChange={(e) => {
                          const newDuration = parseInt(e.target.value);
                          setSettings({ ...settings, workDuration: newDuration });
                          if (mode === 'work' && status === 'idle') {
                            setTimeLeft(newDuration * 60);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-2">
                        Short Break: {settings.breakDuration} minutes
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={settings.breakDuration}
                        onChange={(e) => {
                          const newDuration = parseInt(e.target.value);
                          setSettings({ ...settings, breakDuration: newDuration });
                          if (mode === 'break' && status === 'idle') {
                            setTimeLeft(newDuration * 60);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-2">
                        Long Break: {settings.longBreakDuration} minutes
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={settings.longBreakDuration}
                        onChange={(e) => {
                          const newDuration = parseInt(e.target.value);
                          setSettings({ ...settings, longBreakDuration: newDuration });
                          if (mode === 'longBreak' && status === 'idle') {
                            setTimeLeft(newDuration * 60);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-2">
                        Daily Goal: {settings.dailyGoal} pomodoros
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={settings.dailyGoal}
                        onChange={(e) => setSettings({ ...settings, dailyGoal: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Long Break Interval */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-4">Long Break Interval</h3>
                  <label className="block text-sm text-slate-600 mb-2">
                    Pomodoros until long break: {settings.longBreakInterval}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={settings.longBreakInterval}
                    onChange={(e) => setSettings({ ...settings, longBreakInterval: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                        className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-slate-700">Enable sound notifications</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <input
                        type="checkbox"
                        checked={settings.autoStartBreaks}
                        onChange={(e) => setSettings({ ...settings, autoStartBreaks: e.target.checked })}
                        className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-slate-700">Auto-start breaks</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <input
                        type="checkbox"
                        checked={settings.autoStartWork}
                        onChange={(e) => setSettings({ ...settings, autoStartWork: e.target.checked })}
                        className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-slate-700">Auto-start work sessions</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
