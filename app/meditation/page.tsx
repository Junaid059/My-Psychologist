'use client'
import React, { useState, useEffect } from 'react';
import { Music, Search, Filter, Play, Pause, Clock, TrendingUp, Heart, Headphones } from 'lucide-react';

interface Audio {
  _id: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  views: number;
  createdAt: string;
}

export default function MeditationPage() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?type=audio');

      if (response.ok) {
        const data = await response.json();
        setAudios(data.content || []);
      } else {
        console.error('Failed to fetch audios');
      }
    } catch (error) {
      console.error('Error fetching audios:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(audios.map(audio => audio.category)))];

  const filteredAudios = audios.filter(audio => {
    const matchesSearch = audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audio.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || audio.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const getCategoryColor = (category: string) => {
    // Use the same blue/cyan/sky/teal theme as the main website
    const lower = category.toLowerCase();
    if (lower.includes('sleep')) return 'from-blue-500 to-cyan-500';
    if (lower.includes('stress')) return 'from-cyan-500 to-sky-500';
    if (lower.includes('focus')) return 'from-sky-500 to-teal-500';
    if (lower.includes('calm')) return 'from-teal-500 to-cyan-500';
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
                <Headphones className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎵 Meditation & Relaxation
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find peace and tranquility with our collection of guided meditations and calming audio
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
                placeholder="Search meditation audios..."
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
            <Music className="w-10 h-10 text-blue-200 mb-2" />
            <p className="text-blue-100 text-sm font-medium">Total Audios</p>
            <p className="text-3xl font-bold mt-1">{audios.length}</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white">
            <TrendingUp className="w-10 h-10 text-cyan-200 mb-2" />
            <p className="text-cyan-100 text-sm font-medium">Total Listens</p>
            <p className="text-3xl font-bold mt-1">
              {audios.reduce((sum, audio) => sum + (audio.views || 0), 0)}
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
              <p className="text-slate-600 text-lg">Loading meditation audios...</p>
            </div>
          </div>
        ) : filteredAudios.length === 0 ? (
          <div className="text-center py-20">
            <Music className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-400 mb-2">No meditation audios found</p>
            <p className="text-slate-500">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAudios.map((audio, index) => (
              <div
                key={audio._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-slate-100 hover:border-cyan-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Category Banner */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(audio.category)}`}></div>

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Play Button */}
                    <button
                      onClick={() => togglePlay(audio._id)}
                      className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${getCategoryColor(audio.category)} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110`}
                    >
                      {playingId === audio._id ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8 ml-1" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                          {audio.title}
                        </h3>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                          {audio.category}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {audio.description}
                      </p>

                      {/* Audio Info */}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{audio.views || 0} listens</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>15 min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (shown when playing) */}
                  {playingId === audio._id && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/3 animate-pulse"></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>0:00</span>
                        <span>15:00</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Headphones className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Tips for Better Meditation</h3>
              <p className="text-blue-100 text-lg mb-3">
                Find a quiet space, use headphones for the best experience, and practice daily for maximum benefits.
              </p>
              <ul className="space-y-2 text-blue-100">
                <li>• Start with 5-10 minutes daily</li>
                <li>• Focus on your breath</li>
                <li>• Be patient with yourself</li>
                <li>• Consistency is key</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
