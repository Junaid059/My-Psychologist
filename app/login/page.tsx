'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, Menu, X, Eye, EyeOff, Mail, Lock, ArrowRight, User } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      // In a real app, you would register the user here
      console.log('Registering new user:', formData);
      
      // Simulate successful registration and auto-login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      // In a real app, you would authenticate the user here
      console.log('Logging in user:', formData);
      
      // Simulate successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
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
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              MyPsychologist
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium">
              Home
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium">
              About
            </Link>
            <Link href="/service" className="text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium">
              Services
            </Link>
            <Link href="/faq" className="text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium">
              FAQ
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-effect mx-4 rounded-2xl p-6 animate-slide-up shadow-lg">
            <Link href="/" className="block py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="block py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/service" className="block py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
            <Link href="/faq" className="block py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              FAQ
            </Link>
            <Link href="/contact" className="block py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </div>
        )}
      </nav>

      {/* Floating Elements - Calming Natural Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-28 h-28 bg-gradient-to-r from-blue-100/40 to-sky-100/40 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-teal-100/40 to-green-100/40 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-to-r from-amber-50/40 to-yellow-50/40 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Login Form */}
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </span>
            </h1>
            <p className="text-slate-600">
              {isSignUp 
                ? 'Sign up to start your mental wellness journey' 
                : 'Log in to access your account and appointments'}
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-8 shadow-md">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={isSignUp}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/70 rounded-lg px-4 py-3 pl-10 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/70 rounded-lg px-4 py-3 pl-10 pr-10 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-500" />
                  </div>
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required={isSignUp}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-white/70 rounded-lg px-4 py-3 pl-10 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 bg-white text-blue-500 focus:ring-blue-200"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="group w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg hover:from-blue-600 hover:to-teal-500 text-white transition-all duration-300 font-medium text-lg flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="ml-2 font-medium text-blue-600 hover:text-blue-800"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simplified for login page */}
      <footer className="py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-slate-500 text-sm">
            <p>&copy; 2024 MyPsychologist. All rights reserved.</p>
            <div className="mt-2">
              <Link href="/privacy" className="hover:text-blue-600 mx-2">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-600 mx-2">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
