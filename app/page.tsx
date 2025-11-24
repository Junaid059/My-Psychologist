'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart, CheckCircle, Shield, Users, Star, Check, Menu, X, ArrowRight, Sparkles, Zap, Award } from 'lucide-react';

const MyPsychologist = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      content: "The transformation in my mental health has been incredible. Professional, caring, and truly life-changing sessions.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Software Engineer",
      content: "Finally found the support I needed. The approach is modern, effective, and genuinely understanding.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Teacher",
      content: "Exceptional care and guidance. Every session brings new insights and genuine progress in my healing journey.",
      rating: 5,
      avatar: "ET"
    }
  ];

  const packages = [
    {
      name: "Starter Journey",
      sessions: 3,
      price: 450,
      originalPrice: 540,
      features: [
        "Initial comprehensive assessment",
        "Personalized treatment roadmap",
        "Between-session email support",
        "Custom wellness resources",
        "Progress tracking dashboard"
      ],
      popular: false,
      gradient: "from-violet-500 to-purple-600",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      name: "Transformation Path",
      sessions: 6,
      price: 850,
      originalPrice: 1080,
      features: [
        "Everything in Starter Journey",
        "Advanced therapy techniques",
        "Weekly progress analytics",
        "Emergency support access",
        "Homework & skill-building tools",
        "Monthly wellness report"
      ],
      popular: true,
      gradient: "from-cyan-400 to-blue-500",
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: "Complete Healing",
      sessions: 12,
      price: 1600,
      originalPrice: 2160,
      features: [
        "Everything in Transformation Path",
        "Comprehensive therapy program",
        "Bi-weekly detailed reports",
        "Relapse prevention strategy",
        "Family support sessions",
        "Lifetime resource access",
        "Priority booking guarantee"
      ],
      popular: false,
      gradient: "from-emerald-400 to-teal-500",
      icon: <Award className="w-6 h-6" />
    }
  ];

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-sky-300/20 to-indigo-300/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-teal-300/20 to-emerald-300/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-xl animate-pulse delay-3000"></div>
    </div>
  );

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
        
        .glow-effect {
          box-shadow: 0 0 30px rgba(56, 189, 248, 0.2);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        .gradient-border {
          position: relative;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          border-radius: 24px;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
          border-radius: 24px;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask-composite: xor;
        }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? 'glass-effect py-4' : 'py-6'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              MyPsychologist
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-800 transition-all duration-300 hover:scale-105 font-medium relative">
              Home
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-105 font-medium">
              About
            </Link>
            <Link href="/service" className="text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-105 font-medium">
              Services
            </Link>
            <Link href="/faq" className="text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-105 font-medium">
              FAQ
            </Link>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-105 font-medium">
              Testimonials
            </a>
            <Link href="/contact" className="text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-105 font-medium">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium">
              Login
            </Link>
            <Link href="/booking" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium">
              Book Session
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
          <div className="md:hidden mt-4 glass-effect mx-4 rounded-2xl p-6 animate-slide-up">
            <Link href="/" className="block py-3 text-slate-800 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="block py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/service" className="block py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
            <Link href="/faq" className="block py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              FAQ
            </Link>
            <a href="#testimonials" className="block py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Testimonials
            </a>
            <Link href="/contact" className="block py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="flex flex-col space-y-3 mt-6">
              <Link href="/login" className="py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium">
                Login
              </Link>
              <Link href="/booking" className="py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 font-medium">
                Book Session
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <FloatingElements />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 glass-effect rounded-full mb-8 hover-lift">
                <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium text-slate-600">Transform Your Mind, Transform Your Life</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent block mb-2">
                  Your Mental
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent block">
                  Wellness Journey
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-4 leading-relaxed max-w-lg">
                Connect with licensed therapists who understand your unique challenges. Get professional support tailored to your needs with compassion and expertise.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Licensed Professionals</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Flexible Scheduling</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">100% Confidential</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link href="/booking" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl font-bold text-lg flex items-center text-white shadow-lg">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <Link href="/about" className="group px-8 py-4 glass-effect rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-105 font-bold text-lg border-2 border-slate-200 text-slate-700 hover:shadow-lg">
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-black text-blue-600">500+</div>
                  <div className="text-slate-600 font-medium">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-cyan-600">2000+</div>
                  <div className="text-slate-600 font-medium">Sessions</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-teal-600">98%</div>
                  <div className="text-slate-600 font-medium">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative h-96 flex items-center justify-center">
                {/* Gradient Background Shapes */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-3xl blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sky-200/40 to-blue-200/40 rounded-3xl blur-3xl animate-pulse delay-1000"></div>
                
                {/* Main Card */}
                <div className="relative glass-effect rounded-3xl p-12 w-full max-w-md hover-lift border-2 border-white/50">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">Professional Care</h3>
                        <p className="text-slate-600 text-sm">Expert therapists</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">Personalized</h3>
                        <p className="text-slate-600 text-sm">Tailored to your needs</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">Proven Results</h3>
                        <p className="text-slate-600 text-sm">Transformation guaranteed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Feature Cards */}
                <div className="absolute -top-8 -left-8 w-32 h-20 glass-effect rounded-2xl p-4 border border-white/40 animate-float">
                  <div className="text-2xl font-black text-blue-600">24/7</div>
                  <div className="text-xs text-slate-600 font-medium">Support</div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-32 h-20 glass-effect rounded-2xl p-4 border border-white/40 animate-float-delayed flex flex-col items-center justify-center">
                  <Star className="w-5 h-5 text-amber-400 fill-current mb-1" />
                  <div className="text-sm font-bold text-slate-700">4.9/5 Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-blue-300" />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative bg-gradient-to-b from-white/50 to-slate-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                Why Clients Choose
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                MyPsychologist
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Licensed & Certified",
                description: "All our therapists are board-certified with years of clinical experience"
              },
              {
                icon: Users,
                title: "Specialized Expertise",
                description: "We specialize in anxiety, depression, relationships, and trauma"
              },
              {
                icon: CheckCircle,
                title: "Proven Results",
                description: "98% of clients report significant improvement in their mental health"
              },
              {
                icon: Star,
                title: "Highly Rated",
                description: "Trusted by thousands with 4.9/5 average rating across platforms"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="glass-effect rounded-2xl p-8 hover-lift border border-white/40">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                Our Therapeutic
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive mental health support tailored to your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                gradient: "from-blue-500 to-blue-600",
                icon: Heart,
                title: "Individual Therapy",
                description: "One-on-one personalized sessions focusing on your specific challenges and goals",
                features: ["Deep personal work", "Customized approach", "Flexible scheduling"]
              },
              {
                gradient: "from-cyan-500 to-sky-600",
                icon: Users,
                title: "Couples Therapy",
                description: "Strengthen your relationship with evidence-based communication strategies",
                features: ["Relationship repair", "Communication skills", "Conflict resolution"]
              },
              {
                gradient: "from-teal-500 to-emerald-600",
                icon: CheckCircle,
                title: "Family Therapy",
                description: "Heal family dynamics and build stronger, healthier relationships",
                features: ["Family healing", "Parenting support", "Generational patterns"]
              }
            ].map((service, index) => (
              <div key={index} className="group relative hover-lift">
                <div className="glass-effect rounded-2xl p-8 border border-white/40 h-full relative overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br ${service.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-4`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-2xl mb-3 text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-slate-700">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link href="/service" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-500 transition-colors duration-300 group/link">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/service" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl font-bold text-lg text-white">
              Explore All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative bg-gradient-to-b from-slate-50/50 to-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                Real Transformations from
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Real People
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover how our clients have overcome challenges and built better lives
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="glass-effect rounded-3xl p-8 md:p-12 hover-lift border-2 border-white/60">
              {/* Quotation Mark */}
              <div className="text-6xl text-blue-300 mb-4 leading-none">"</div>
              
              <div className="flex items-center justify-center mb-8">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl md:text-3xl text-center mb-8 leading-relaxed font-semibold text-slate-800">
                {testimonials[currentTestimonial].content}
              </blockquote>
              
              <div className="flex items-center justify-center">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 font-bold text-white text-lg">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-slate-600 text-sm font-medium">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentTestimonial
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 scale-125'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 p-12 md:p-20">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Ready to Transform Your Mental Health?
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-95 leading-relaxed">
                Join hundreds of clients who have already started their healing journey with our expert therapists. Your first session is just a click away.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/booking" className="group px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 font-bold text-lg flex items-center shadow-lg">
                  Book Your First Session
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <Link href="/faq" className="px-8 py-4 border-2 border-white rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 font-bold text-lg text-white">
                  Have Questions? Check FAQs
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-white/30 flex flex-wrap justify-center items-center gap-8 text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Money-Back Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Start Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Session Packages */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                Choose Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Healing Journey
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Flexible packages designed to meet you wherever you are in your mental health journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative group hover-lift ${
                  pkg.popular ? 'md:scale-105 md:-mt-4' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full text-sm font-bold z-10 text-white">
                    Most Popular
                  </div>
                )}
                
                <div className="gradient-border h-full">
                  <div className="glass-effect rounded-3xl p-8 h-full relative overflow-hidden border-2 border-white/60">
                    {/* Background shimmer */}
                    <div className={`absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br ${pkg.gradient} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 bg-gradient-to-r ${pkg.gradient} rounded-xl flex items-center justify-center text-white`}>
                          {pkg.icon}
                        </div>
                        {pkg.popular && (
                          <div className="px-4 py-1.5 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full text-xs font-bold border border-amber-400/40 text-amber-600 flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>MOST POPULAR</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900">{pkg.name}</h3>
                      <div className="flex items-baseline mb-5">
                        <span className="text-5xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">${pkg.price}</span>
                        <span className="text-slate-400 ml-3 line-through text-lg font-medium">${pkg.originalPrice}</span>
                      </div>
                      <div className="text-slate-600 mb-8 text-lg font-semibold">
                        {pkg.sessions} Premium Sessions
                      </div>
                      
                      <ul className="space-y-4 mb-10">
                        {pkg.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 font-bold" />
                            <span className="text-slate-700 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Link 
                        href="/booking" 
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 block text-center ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg'
                            : 'glass-effect border-2 border-slate-200 hover:bg-white/80 text-slate-900 hover:shadow-lg'
                        }`}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-500 mb-4">All packages include a 30-day satisfaction guarantee</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                Secure Payments
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-blue-500" />
                Licensed Professionals
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2 text-blue-500" />
                Confidential Care
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  MyPsychologist
                </span>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                Transforming lives through innovative psychological care and personalized therapeutic approaches.
              </p>
              <div className="flex space-x-4 mt-6">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <div key={social} className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-slate-700">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Services', href: '/service' },
                  { name: 'FAQ', href: '/faq' },
                  { name: 'Contact', href: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-600 hover:text-blue-500 transition-colors duration-300">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-slate-700">Contact Info</h4>
              <div className="space-y-3 text-slate-600">
                <p>123 Wellness Street</p>
                <p>Mental Health City, MH 12345</p>
                <p>+1 (555) 123-4567</p>
                <p>hello@mypsychologist.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 text-center">
            <p className="text-slate-500">
              &copy; 2024 MyPsychologist. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyPsychologist;