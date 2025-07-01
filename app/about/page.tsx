'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Brain, Heart, Shield, Users, Star, Check, Menu, X, ArrowRight, Sparkles, Zap, Award, Clock, Target, MessageCircle, Video, Calendar, Phone, Mail, MapPin, User, BookOpen, Lightbulb, Compass, Smile, Activity, Eye, Briefcase, Home, Baby, Puzzle, GraduationCap, ThumbsUp, Coffee } from 'lucide-react';

const AboutPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Clinical Psychologist",
      specialization: "Anxiety & Depression",
      experience: "15+ years",
      image: "SJ",
      bio: "Specialized in cognitive behavioral therapy with extensive experience in treating anxiety disorders and depression.",
      credentials: ["Ph.D. Clinical Psychology", "Licensed Clinical Psychologist", "CBT Certification"]
    },
    {
      name: "Dr. Michael Chen",
      role: "Family Therapist",
      specialization: "Family & Couples Therapy",
      experience: "12+ years",
      image: "MC",
      bio: "Expert in family systems therapy and relationship counseling with a focus on communication and conflict resolution.",
      credentials: ["Ph.D. Marriage & Family Therapy", "Licensed Marriage & Family Therapist", "Gottman Method Certification"]
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Child Psychologist",
      specialization: "Child & Adolescent Therapy",
      experience: "10+ years",
      image: "ER",
      bio: "Specialized in play therapy and developmental psychology with expertise in autism spectrum disorders and ADHD.",
      credentials: ["Ph.D. Child Psychology", "Licensed Clinical Psychologist", "Play Therapy Certification"]
    },
    {
      name: "Dr. David Thompson",
      role: "Trauma Specialist",
      specialization: "PTSD & Trauma Recovery",
      experience: "18+ years",
      image: "DT",
      bio: "Expert in EMDR therapy and trauma-informed care with extensive experience treating combat veterans and trauma survivors.",
      credentials: ["Ph.D. Clinical Psychology", "EMDR Certified Therapist", "Trauma-Informed Care Specialist"]
    }
  ];

  const values = [
    {
      title: "Compassionate Care",
      description: "We believe in treating every client with empathy, respect, and genuine care for their wellbeing.",
      icon: <Heart className="w-8 h-8" />,
      gradient: "from-pink-400 to-rose-500"
    },
    {
      title: "Evidence-Based Practice",
      description: "Our treatments are grounded in scientific research and proven therapeutic methodologies.",
      icon: <BookOpen className="w-8 h-8" />,
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      title: "Client-Centered Approach",
      description: "Every treatment plan is tailored to the unique needs, goals, and preferences of our clients.",
      icon: <Target className="w-8 h-8" />,
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      title: "Professional Excellence",
      description: "We maintain the highest standards of professional practice and continuous learning.",
      icon: <Award className="w-8 h-8" />,
      gradient: "from-violet-400 to-purple-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Clients Helped", icon: <Users className="w-6 h-6" /> },
    { number: "15+", label: "Years Experience", icon: <Clock className="w-6 h-6" /> },
    { number: "98%", label: "Success Rate", icon: <ThumbsUp className="w-6 h-6" /> },
    { number: "24/7", label: "Support Available", icon: <Shield className="w-6 h-6" /> }
  ];

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-100/30 to-sky-100/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-teal-100/30 to-cyan-100/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-amber-50/30 to-yellow-50/30 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-sky-100/30 to-indigo-100/30 rounded-full blur-xl animate-pulse delay-3000"></div>
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
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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
          background: linear-gradient(135deg, #3b82f6, #0ea5e9, #38bdf8, #7dd3fc);
          border-radius: 24px;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask-composite: xor;
        }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-white/90 backdrop-blur-sm shadow-lg py-4' : 'bg-white/80 backdrop-blur-sm py-6'
      }`}>
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
            {[
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
              { name: 'Services', href: '/service' },
              { name: 'FAQ', href: '/faq' },
              { name: 'Contact', href: '/contact' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium ${
                  item.name === 'About' ? 'text-blue-600' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="px-6 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium">
              Login
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
          <div className="md:hidden mt-4 bg-white/90 backdrop-blur-sm mx-4 rounded-2xl p-6 shadow-lg border border-blue-100">
            {[
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
              { name: 'Services', href: '/service' },
              { name: 'FAQ', href: '/faq' },
              { name: 'Contact', href: '/contact' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium ${
                  item.name === 'About' ? 'text-blue-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 mt-6">
              <Link href="/login" className="py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium">
                Login
              </Link>
              <Link href="/booking" className="py-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full hover:from-blue-600 hover:to-teal-500 transition-all duration-300 font-medium text-white text-center">
                Book Session
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <FloatingElements />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 glass-effect rounded-full mb-8 hover-lift">
              <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm font-medium text-slate-600">Professional Mental Health Care</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent animate-float">
                MyPsychologist
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Dedicated to transforming lives through compassionate, evidence-based mental health care. 
              Our mission is to provide accessible, professional psychological services that empower healing and growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact" className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl font-bold text-lg flex items-center">
                Get In Touch
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link href="/service" className="px-8 py-4 glass-effect rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 font-bold text-lg border border-white/30">
                Our Services
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-blue-300" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center h-full hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-blue-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-black text-slate-700 mb-2">{stat.number}</h3>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Story Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                  Our
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                At MyPsychologist, we believe that everyone deserves access to high-quality mental health care. 
                Our mission is to break down barriers to psychological wellness by providing compassionate, 
                evidence-based treatment in a welcoming and supportive environment.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed">
                Founded in 2015, we've grown from a small practice to a comprehensive mental health center, 
                always maintaining our commitment to personalized care and professional excellence. 
                We're not just treating symptoms – we're empowering people to live their best lives.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-100">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-700">Compassionate Care</h3>
                    <p className="text-slate-600">Every client is treated with empathy and respect</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-700">Safe Environment</h3>
                    <p className="text-slate-600">Confidential and secure therapeutic space</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-700">Personalized Treatment</h3>
                    <p className="text-slate-600">Tailored approaches for individual needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our approach to mental health care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 h-full text-center hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-blue-100">
                <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-700">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                Meet Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Expert Team
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Licensed professionals dedicated to your mental health and wellbeing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 h-full hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-blue-100">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{member.image}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-1 text-slate-700 text-center">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-2 text-center">{member.role}</p>
                <p className="text-slate-500 text-sm mb-3 text-center">{member.experience}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Specialization:</h4>
                  <p className="text-slate-600 text-sm">{member.specialization}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">About:</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Credentials:</h4>
                  <ul className="space-y-1">
                    {member.credentials.map((cred, i) => (
                      <li key={i} className="text-slate-600 text-xs flex items-center">
                        <Check className="w-3 h-3 text-teal-500 mr-1 flex-shrink-0" />
                        {cred}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center relative overflow-hidden border border-blue-100 max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-50/50 to-teal-50/50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                  Ready to Begin
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Your Journey?
                </span>
              </h2>
              
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Take the first step towards better mental health. Our experienced team is here to 
                support you every step of the way.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/contact" className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full hover:from-blue-600 hover:to-teal-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl font-bold text-lg flex items-center text-white">
                  Schedule Consultation
                  <Calendar className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link href="/faq" className="px-8 py-4 bg-white/80 rounded-full hover:bg-white transition-all duration-300 hover:scale-105 font-bold text-lg border border-slate-200 text-slate-700">
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  MyPsychologist
                </span>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                Transforming lives through innovative psychological care and personalized therapeutic approaches.
              </p>
              <div className="flex space-x-4 mt-6">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <div key={social} className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer border border-slate-200">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-teal-400 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-slate-800">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Services', href: '/service' },
                  { name: 'FAQ', href: '/faq' },
                  { name: 'Contact', href: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors duration-300">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-slate-800">Contact Info</h4>
              <div className="space-y-3 text-slate-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  123 Wellness Street
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  hello@mypsychologist.com
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  Mon-Fri: 8AM-8PM
                </div>
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

export default AboutPage;
