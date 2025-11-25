'use client'
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Music, Image, Upload, Eye, Edit2, Trash2, Plus, Search } from 'lucide-react';
import Modal from '@/components/ui/modal';

interface Content {
  _id: string;
  type: 'exercise' | 'audio' | 'article';
  title: string;
  description: string;
  category: string;
  status: 'published' | 'draft';
  createdAt: string;
  views?: number;
}

const ContentManagementSection = () => {
  const [activeTab, setActiveTab] = useState<'exercises' | 'audios' | 'articles'>('exercises');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'exercise',
    title: '',
    description: '',
    category: '',
    status: 'draft'
  });
  
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAllContent(data.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Content created successfully!');
        setShowCreateModal(false);
        setFormData({
          type: 'exercise',
          title: '',
          description: '',
          category: '',
          status: 'draft'
        });
        fetchContent();
      } else {
        alert('Failed to create content');
      }
    } catch (err) {
      console.error('Error creating content:', err);
      alert('Error creating content');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Content deleted successfully!');
        fetchContent();
      } else {
        alert('Failed to delete content');
      }
    } catch (err) {
      console.error('Error deleting content:', err);
      alert('Error deleting content');
    }
  };
  
  const exercises = allContent.filter(c => c.type === 'exercise');
  const audios = allContent.filter(c => c.type === 'audio');
  const articles = allContent.filter(c => c.type === 'article');

  const getContentByTab = () => {
    switch (activeTab) {
      case 'exercises': return exercises;
      case 'audios': return audios;
      case 'articles': return articles;
    }
  };

  const filteredContent = getContentByTab().filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalExercises: exercises.length,
    totalAudios: audios.length,
    totalArticles: articles.length,
    totalViews: [...exercises, ...audios, ...articles].reduce((sum, item) => sum + (item.views || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            📚 Content Management System
          </h2>
          <p className="text-slate-600 mt-1">Manage exercises, meditation audios, and educational articles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          Add Content
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-lg text-white">
          <BookOpen className="w-10 h-10 text-blue-200 mb-2" />
          <p className="text-blue-100 text-sm font-medium">Exercises</p>
          <p className="text-3xl font-bold mt-1">{stats.totalExercises}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-lg text-white">
          <Music className="w-10 h-10 text-purple-200 mb-2" />
          <p className="text-purple-100 text-sm font-medium">Audio Files</p>
          <p className="text-3xl font-bold mt-1">{stats.totalAudios}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white">
          <FileText className="w-10 h-10 text-green-200 mb-2" />
          <p className="text-green-100 text-sm font-medium">Articles</p>
          <p className="text-3xl font-bold mt-1">{stats.totalArticles}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-lg text-white">
          <Eye className="w-10 h-10 text-orange-200 mb-2" />
          <p className="text-orange-100 text-sm font-medium">Total Views</p>
          <p className="text-3xl font-bold mt-1">{stats.totalViews}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'exercises'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          📝 Exercises
        </button>
        <button
          onClick={() => setActiveTab('audios')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'audios'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          🎵 Meditation Audio
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'articles'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          📄 Articles
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                item.type === 'exercise' ? 'bg-blue-100' :
                item.type === 'audio' ? 'bg-purple-100' :
                'bg-green-100'
              }`}>
                {item.type === 'exercise' && <BookOpen className="w-6 h-6 text-blue-600" />}
                {item.type === 'audio' && <Music className="w-6 h-6 text-purple-600" />}
                {item.type === 'article' && <FileText className="w-6 h-6 text-green-600" />}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{item.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {item.views}
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">{item.category}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="➕ Add New Content"
        maxWidth="lg"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Content Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as 'exercise' | 'audio' | 'article'})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            >
              <option value="exercise">📝 Exercise</option>
              <option value="audio">🎵 Meditation Audio</option>
              <option value="article">📄 Article</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter content title..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="e.g., Anxiety Management, Sleep, Stress Relief"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Upload File</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">PDF, MP3, or Image files</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreate}
              disabled={!formData.title || !formData.description || !formData.category}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📚 Publish Content
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentManagementSection;
