'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Menu, X, Eye, EyeOff, Mail, Lock, ArrowRight, User } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt:', { email });

    try {
      // First try admin login
      console.log('👤 Trying admin login...');
      const adminResponse = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Admin response status:', adminResponse.status);

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        console.log('✅ Admin login successful!', adminData);
        localStorage.setItem('adminToken', adminData.token);
        localStorage.setItem('admin', JSON.stringify(adminData.admin));
        router.push('/admin/dashboard');
        return;
      }

      // If admin login fails, try user login
      console.log('👥 Admin failed, trying user login...');
      const userResponse = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 User response status:', userResponse.status);

      const userData = await userResponse.json();
      console.log('📦 User response data:', userData);

      if (!userResponse.ok) {
        console.log('❌ Login failed:', userData.error);
        setError(userData.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Store token and user info
      console.log('✅ User login successful!');
      localStorage.setItem('userToken', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.user));

      // Redirect to home
      router.push('/');
    } catch (err) {
      console.error('💥 Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-50 text-slate-800 overflow-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
        }
      `}</style>

      {/* Navbar */}
      <nav className="py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              MyPsychologist
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-blue-600 transition font-medium">Home</Link>
            <Link href="/about" className="text-slate-700 hover:text-blue-600 transition font-medium">About</Link>
            <Link href="/service" className="text-slate-700 hover:text-blue-600 transition font-medium">Services</Link>
            <Link href="/contact" className="text-slate-700 hover:text-blue-600 transition font-medium">Contact</Link>
          </div>

          <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-effect mx-4 rounded-2xl p-6 shadow-lg">
            <Link href="/" className="block py-3 text-slate-700 hover:text-blue-600 font-medium">Home</Link>
            <Link href="/about" className="block py-3 text-slate-700 hover:text-blue-600 font-medium">About</Link>
            <Link href="/service" className="block py-3 text-slate-700 hover:text-blue-600 font-medium">Services</Link>
            <Link href="/contact" className="block py-3 text-slate-700 hover:text-blue-600 font-medium">Contact</Link>
          </div>
        )}
      </nav>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-28 h-28 bg-gradient-to-r from-blue-100/40 to-sky-100/40 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-teal-100/40 to-green-100/40 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-to-r from-indigo-100/40 to-blue-100/40 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Login Form */}
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="text-slate-600">Log in to access your account and appointments</p>
          </div>

          <div className="glass-effect rounded-2xl p-8 shadow-md">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/70 rounded-lg px-4 py-3 pl-10 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/70 rounded-lg px-4 py-3 pl-10 pr-10 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-500" />
                  </div>
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg hover:from-blue-600 hover:to-teal-500 disabled:from-gray-400 disabled:to-gray-500 text-white transition font-medium text-lg flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {loading ? 'Logging in...' : 'Sign In'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                Don't have an account?{' '}
                <Link href="/user/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
