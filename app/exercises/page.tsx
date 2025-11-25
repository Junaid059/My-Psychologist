'use client'
import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter, Clock, TrendingUp, Heart, Brain, Wind } from 'lucide-react';

interface Exercise {
  _id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  createdAt: string;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?type=exercise');

      if (response.ok) {
        const data = await response.json();
        setExercises(data.content || []);
      } else {
        console.error('Failed to fetch exercises');
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(exercises.map(ex => ex.category)))];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || exercise.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('breathing')) return <Wind className="w-6 h-6" />;
    if (lower.includes('meditation')) return <Brain className="w-6 h-6" />;
    if (lower.includes('relaxation')) return <Heart className="w-6 h-6" />;
    return <Activity className="w-6 h-6" />;
  };

  const getCategoryColor = (category: string) => {
    // Use the same blue/cyan/sky/teal theme as the main website
    const lower = category.toLowerCase();
    if (lower.includes('breathing')) return 'from-cyan-500 to-blue-500';
    if (lower.includes('meditation')) return 'from-blue-500 to-sky-500';
    if (lower.includes('relaxation')) return 'from-sky-500 to-cyan-500';
    return 'from-blue-500 to-cyan-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Activity className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🏃 Wellness Exercises
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Practice mindfulness and improve your mental well-being with our guided exercises
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-lg text-white">
            <Activity className="w-10 h-10 text-blue-200 mb-2" />
            <p className="text-blue-100 text-sm font-medium">Total Exercises</p>
            <p className="text-3xl font-bold mt-1">{exercises.length}</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white">
            <TrendingUp className="w-10 h-10 text-cyan-200 mb-2" />
            <p className="text-cyan-100 text-sm font-medium">Total Views</p>
            <p className="text-3xl font-bold mt-1">
              {exercises.reduce((sum, ex) => sum + (ex.views || 0), 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <Heart className="w-10 h-10 text-sky-200 mb-2" />
            <p className="text-sky-100 text-sm font-medium">Categories</p>
            <p className="text-3xl font-bold mt-1">{categories.length - 1}</p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading exercises...</p>
            </div>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center py-20">
            <Activity className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-400 mb-2">No exercises found</p>
            <p className="text-slate-500">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise, index) => (
              <div
                key={exercise._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-slate-100 hover:border-cyan-300 group cursor-pointer transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Category Banner */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(exercise.category)}`}></div>

                <div className="p-6">
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${getCategoryColor(exercise.category)} rounded-xl text-white shadow-md`}>
                      {getCategoryIcon(exercise.category)}
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                      {exercise.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-600 transition-colors">
                    {exercise.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {exercise.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{exercise.views || 0} views</span>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all">
                      Start Exercise
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Brain className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Practice Makes Progress</h3>
              <p className="text-blue-100 text-lg">
                Regular practice of these exercises can help reduce stress, improve focus, and enhance your overall mental well-being. Start with 5-10 minutes daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
