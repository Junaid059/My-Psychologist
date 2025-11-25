'use client'
import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, TrendingUp, Clock, Eye, Award, BookmarkPlus, Share2, Sparkles } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  createdAt: string;
}

export default function ResourcesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?type=article');

      if (response.ok) {
        const data = await response.json();
        setArticles(data.content || []);
      } else {
        console.error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(articles.map(article => article.category)))];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    // Use the same blue/cyan/sky theme as the main website
    const lower = category.toLowerCase();
    if (lower.includes('mental health')) return 'from-blue-500 to-cyan-500';
    if (lower.includes('anxiety')) return 'from-sky-500 to-blue-500';
    if (lower.includes('depression')) return 'from-cyan-500 to-teal-500';
    if (lower.includes('stress')) return 'from-blue-600 to-sky-500';
    if (lower.includes('self-care')) return 'from-teal-500 to-cyan-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getReadTime = (description: string) => {
    const words = description.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative p-6 bg-white/20 rounded-full backdrop-blur-sm border-2 border-white/30">
                  <BookOpen className="w-16 h-16" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-cyan-200" />
              Mental Health Resources
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Evidence-based articles and expert guides to help you understand and improve your mental well-being
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Expert Reviewed</span>
              </div>
              <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">Science-Based</span>
              </div>
              <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Updated Regularly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search for mental health topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg font-medium placeholder-slate-400"
              />
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-6 h-6 group-focus-within:text-cyan-600 transition-colors" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border-2 border-cyan-200 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all appearance-none bg-white text-lg font-medium cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '🎯 All Topics' : `📖 ${cat}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Search Results Count */}
          <div className="mt-4 text-center">
            <p className="text-slate-600 font-medium">
              Showing <span className="text-blue-600 font-bold">{filteredArticles.length}</span> of <span className="text-blue-600 font-bold">{articles.length}</span> articles
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-12 h-12 text-white drop-shadow-lg" />
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-2">Total Articles</p>
              <p className="text-5xl font-bold text-white">{articles.length}</p>
              <p className="text-blue-100 text-sm mt-2">Knowledge base growing</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-cyan-500 to-teal-500 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-12 h-12 text-white drop-shadow-lg" />
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-cyan-100 text-sm font-semibold uppercase tracking-wider mb-2">Total Views</p>
              <p className="text-5xl font-bold text-white">
                {articles.reduce((sum, article) => sum + (article.views || 0), 0).toLocaleString()}
              </p>
              <p className="text-cyan-100 text-sm mt-2">Readers engaged</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-12 h-12 text-white drop-shadow-lg" />
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-sky-100 text-sm font-semibold uppercase tracking-wider mb-2">Topics Covered</p>
              <p className="text-5xl font-bold text-white">{categories.length - 1}</p>
              <p className="text-sky-100 text-sm mt-2">Diverse content</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 text-xl font-semibold">Loading amazing content...</p>
              <p className="text-slate-400 mt-2">Please wait</p>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100">
            <div className="relative inline-block mb-6">
              <BookOpen className="w-24 h-24 text-blue-300 mx-auto" />
              <div className="absolute -top-2 -right-2 p-2 bg-cyan-500 rounded-full">
                <Search className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-600 mb-3">No articles found</p>
            <p className="text-lg text-slate-500 mb-6">Try adjusting your search or filter to find what you're looking for</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredArticles.map((article, index) => (
              <div
                key={article._id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-blue-100 hover:border-cyan-300 hover:-translate-y-1"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Decorative Gradient Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${getCategoryColor(article.category)} group-hover:w-3 transition-all duration-300`}></div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-sky-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-sky-500/5 transition-all duration-500"></div>

                <div className="relative p-8 md:p-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getCategoryColor(article.category)} text-white rounded-full text-sm font-bold shadow-lg`}>
                          <Sparkles className="w-4 h-4" />
                          {article.category}
                        </span>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-slate-500 text-sm font-medium">
                          {new Date(article.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300 leading-tight">
                        {article.title}
                      </h2>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="hidden md:flex flex-col gap-2 ml-4">
                      <button className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all hover:scale-110 shadow-sm hover:shadow-md">
                        <BookmarkPlus className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-xl transition-all hover:scale-110 shadow-sm hover:shadow-md">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-8">
                    {article.description}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 border-t-2 border-slate-100 gap-4">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold">
                        <Eye className="w-5 h-5" />
                        <span>{(article.views || 0).toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-xl font-semibold">
                        <Clock className="w-5 h-5" />
                        <span>{getReadTime(article.description)}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl font-semibold">
                        <TrendingUp className="w-5 h-5" />
                        <span>Trending</span>
                      </div>
                    </div>

                    <button className="group/btn relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="relative z-10 flex items-center gap-2">
                        Read Full Article
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-12 relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 rounded-3xl shadow-2xl p-10 text-white">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="p-6 bg-white/20 rounded-3xl backdrop-blur-sm border-2 border-white/30 shadow-xl">
                <BookOpen className="w-16 h-16" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center md:justify-start gap-3">
                <Sparkles className="w-8 h-8" />
                Knowledge is Power
              </h3>
              <p className="text-blue-100 text-lg md:text-xl leading-relaxed">
                Understanding mental health is the first step toward better well-being. These articles are written by mental health professionals and based on scientific research to help you on your journey.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                  ✓ Expert Verified
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                  ✓ Research-Based
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                  ✓ Free Access
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 15s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
