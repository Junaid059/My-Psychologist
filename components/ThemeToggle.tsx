'use client'
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className={`p-2 rounded-full flex items-center justify-center transition-colors ${
        theme === 'dark' 
          ? 'bg-white/10 hover:bg-white/20' 
          : 'bg-gray-200 hover:bg-gray-300'
      }`}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-700" />
      )}
    </button>
  );
}
