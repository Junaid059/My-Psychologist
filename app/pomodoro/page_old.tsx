'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Clock, Coffee, Target, TrendingUp, Award, Volume2, VolumeX } from 'lucide-react';

type TimerMode = 'work' | 'break' | 'longBreak';
type TimerStatus = 'idle' | 'running' | 'paused';

interface PomodoroSettings {
  workDuration: number; // in minutes
  breakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

interface Session {
  _id?: string;
  userId?: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
}

export default function PomodoroPage() {
  // Settings with defaults
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    soundEnabled: true,
    autoStartBreaks: false,
    autoStartWork: false,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60); // in seconds
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [todaysSessions, setTodaysSessions] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    // Create alarm sound (beep at 440Hz)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const createBeep = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440; // A4 note
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    audioRef.current = {
      play: () => {
        if (settings.soundEnabled) {
          // Play 3 beeps
          createBeep();
          setTimeout(createBeep, 200);
          setTimeout(createBeep, 400);
        }
      }
    } as any;

    // Load user sessions from API
    fetchSessions();
  }, []);

  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (status === 'paused' || status === 'idle') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, timeLeft]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/pomodoro/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        
        // Count today's sessions
        const today = new Date().toDateString();
        const todayCount = (data.sessions || []).filter((s: Session) => 
          new Date(s.completedAt).toDateString() === today && s.mode === 'work'
        ).length;
        setTodaysSessions(todayCount);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const saveSession = async (session: Session) => {
    try {
      await fetch('/api/pomodoro/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
      fetchSessions();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleTimerComplete = () => {
    // Play alarm sound
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Work session complete! Time for a break.' : 'Break complete! Ready to focus?',
        icon: '/icon.png',
      });
    }

    // Save completed session
    const session: Session = {
      mode,
      duration: mode === 'work' ? settings.workDuration : 
                mode === 'break' ? settings.breakDuration : settings.longBreakDuration,
      completedAt: new Date(),
    };
    saveSession(session);

    // Update pomodoro count
    if (mode === 'work') {
      setCompletedPomodoros(prev => prev + 1);
    }

    // Auto-switch to next mode
    if (mode === 'work') {
      const nextIsLongBreak = (completedPomodoros + 1) % settings.longBreakInterval === 0;
      const nextMode = nextIsLongBreak ? 'longBreak' : 'break';
      setMode(nextMode);
      setTimeLeft(nextIsLongBreak ? settings.longBreakDuration * 60 : settings.breakDuration * 60);
      
      if (settings.autoStartBreaks) {
        setStatus('running');
      } else {
        setStatus('idle');
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
      
      if (settings.autoStartWork) {
        setStatus('running');
      } else {
        setStatus('idle');
      }
    }
  };

  const handleStart = () => {
    if (status === 'idle') {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    setStatus('running');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleReset = () => {
    setStatus('idle');
    const duration = mode === 'work' ? settings.workDuration : 
                     mode === 'break' ? settings.breakDuration : settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setStatus('idle');
    const duration = newMode === 'work' ? settings.workDuration : 
                     newMode === 'break' ? settings.breakDuration : settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = mode === 'work' ? settings.workDuration * 60 : 
                         mode === 'break' ? settings.breakDuration * 60 : settings.longBreakDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getModeColor = () => {
    switch(mode) {
      case 'work': return 'from-blue-500 to-cyan-500';
      case 'break': return 'from-teal-500 to-cyan-500';
      case 'longBreak': return 'from-sky-500 to-blue-500';
    }
  };

  const getModeIcon = () => {
    switch(mode) {
      case 'work': return <Target className="w-8 h-8" />;
      case 'break': return <Coffee className="w-8 h-8" />;
      case 'longBreak': return <Coffee className="w-10 h-10" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Clock className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🍅 Pomodoro Timer
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Boost your productivity with the proven Pomodoro Technique. Work in focused 25-minute sessions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-lg text-white">
            <Target className="w-10 h-10 text-blue-200 mb-2" />
            <p className="text-blue-100 text-sm font-medium">Today's Pomodoros</p>
            <p className="text-3xl font-bold mt-1">{todaysSessions}</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white">
            <TrendingUp className="w-10 h-10 text-cyan-200 mb-2" />
            <p className="text-cyan-100 text-sm font-medium">Current Session</p>
            <p className="text-3xl font-bold mt-1">{completedPomodoros + 1}</p>
          </div>

          <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <Award className="w-10 h-10 text-sky-200 mb-2" />
            <p className="text-sky-100 text-sm font-medium">Total Sessions</p>
            <p className="text-3xl font-bold mt-1">{sessions.length}</p>
          </div>
        </div>

        {/* Timer Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          
          {/* Mode Selector */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => switchMode('work')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                mode === 'work' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Target className="w-5 h-5 inline mr-2" />
              Focus
            </button>
            <button
              onClick={() => switchMode('break')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                mode === 'break' 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Coffee className="w-5 h-5 inline mr-2" />
              Short Break
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                mode === 'longBreak' 
                  ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Coffee className="w-5 h-5 inline mr-2" />
              Long Break
            </button>
          </div>

          {/* Timer Display */}
          <div className="relative mb-12">
            {/* Progress Ring */}
            <div className="relative w-80 h-80 mx-auto">
              <svg className="transform -rotate-90 w-80 h-80">
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-200"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 140}
                  strokeDashoffset={2 * Math.PI * 140 * (1 - getProgress() / 100)}
                  className="transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={mode === 'work' ? 'text-blue-500' : mode === 'break' ? 'text-teal-500' : 'text-sky-500'} stopColor="currentColor" />
                    <stop offset="100%" className={mode === 'work' ? 'text-cyan-500' : mode === 'break' ? 'text-cyan-500' : 'text-blue-500'} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`mb-4 p-4 bg-gradient-to-br ${getModeColor()} rounded-full text-white`}>
                  {getModeIcon()}
                </div>
                <div className="text-6xl md:text-7xl font-bold text-slate-800 mb-2 font-mono">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-slate-500 font-semibold uppercase tracking-wider">
                  {mode === 'work' ? 'Focus Time' : mode === 'break' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            {status !== 'running' ? (
              <button
                onClick={handleStart}
                className={`px-12 py-4 bg-gradient-to-r ${getModeColor()} text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3`}
              >
                <Play className="w-6 h-6" />
                {status === 'paused' ? 'Resume' : 'Start'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-12 py-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3"
              >
                <Pause className="w-6 h-6" />
                Pause
              </button>
            )}
            
            <button
              onClick={handleReset}
              className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Session Counter */}
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-2">
              {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${
                    i < completedPomodoros % settings.longBreakInterval
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md scale-110'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500">
              {completedPomodoros % settings.longBreakInterval} / {settings.longBreakInterval} until long break
            </p>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              Timer Settings
            </h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all font-semibold"
            >
              {showSettings ? 'Hide' : 'Show'}
            </button>
          </div>

          {showSettings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Focus Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.workDuration}
                  onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.breakDuration}
                  onChange={(e) => setSettings({...settings, breakDuration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Pomodoros until Long Break
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={settings.longBreakInterval}
                  onChange={(e) => setSettings({...settings, longBreakInterval: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium flex items-center gap-2">
                    {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-blue-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                    Enable sound notifications
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoStartBreaks}
                    onChange={(e) => setSettings({...settings, autoStartBreaks: e.target.checked})}
                    className="w-5 h-5 text-cyan-600 rounded focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-slate-700 font-medium">
                    Auto-start breaks
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoStartWork}
                    onChange={(e) => setSettings({...settings, autoStartWork: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">
                    Auto-start focus sessions
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 rounded-3xl shadow-2xl p-10 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="p-6 bg-white/20 rounded-3xl backdrop-blur-sm border-2 border-white/30">
                <Clock className="w-16 h-16" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-3">What is the Pomodoro Technique?</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-4">
                The Pomodoro Technique is a time management method that uses a timer to break work into intervals, 
                traditionally 25 minutes in length, separated by short breaks. This method helps improve focus and productivity.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-3xl font-bold">25</div>
                  <div className="text-sm text-blue-100">min focus</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-sm text-blue-100">min break</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-sm text-blue-100">cycles</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-3xl font-bold">15</div>
                  <div className="text-sm text-blue-100">min rest</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
