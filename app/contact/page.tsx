'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Brain, Heart, Shield, Users, Star, Check, Menu, X, ArrowRight, Sparkles, Zap, Award, Clock, Target, MessageCircle, Video, Calendar, Phone, Mail, MapPin, User, BookOpen, Lightbulb, Compass, Smile, Activity, Eye, Briefcase, Home, Baby, Send } from 'lucide-react';

const ContactPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send the data to your backend here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'General Inquiry',
        message: ''
      });
      setSubmitted(false);
    }, 5000);
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      subtext: "Mon-Fri, 8AM-8PM"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "hello@mypsychologist.com",
      subtext: "We'll respond within 24 hours"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office",
      details: "123 Wellness Street, Suite 100",
      subtext: "New York, NY 10001"
    }
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
                  item.name === 'Contact' ? 'text-blue-600' : ''
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
            <Link href="/booking" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full hover:from-blue-600 hover:to-teal-500 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium text-white">
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
                  item.name === 'Contact' ? 'text-blue-600' : ''
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
              <span className="text-sm font-medium text-slate-600">We'd Love to Hear from You</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                Get in
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent animate-float">
                Touch
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Whether you have questions about our services or want to schedule a consultation,
              we're here to help you on your mental health journey.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-blue-300" />
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <div key={index} className="gradient-border hover-lift">
                <div className="glass-effect rounded-3xl p-8 text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-700">{method.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{method.details}</p>
                  <p className="text-slate-500 text-sm">{method.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                  Send Us a
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Message
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            <div className="gradient-border">
              <div className="glass-effect rounded-3xl p-8 md:p-12">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-700">Message Sent Successfully!</h3>
                    <p className="text-slate-600 max-w-md mx-auto">
                      Thank you for reaching out. We'll respond to your inquiry as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-slate-700 font-medium mb-2">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/70 rounded-lg px-4 py-3 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-slate-700 font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/70 rounded-lg px-4 py-3 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                          placeholder="johndoe@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-slate-700 font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white/70 rounded-lg px-4 py-3 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="service" className="block text-slate-700 font-medium mb-2">Service Interest</label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full bg-white/70 rounded-lg px-4 py-3 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Individual Therapy">Individual Therapy</option>
                          <option value="Couples Therapy">Couples Therapy</option>
                          <option value="Family Therapy">Family Therapy</option>
                          <option value="Group Therapy">Group Therapy</option>
                          <option value="Child & Teen Therapy">Child & Teen Therapy</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-slate-700 font-medium mb-2">Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-white/70 rounded-lg px-4 py-3 text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 focus:outline-none transition-colors"
                        placeholder="Please let us know how we can help you..."
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="group w-full py-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-300 font-bold text-lg flex items-center justify-center text-white"
                      >
                        Send Message
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                Visit Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                Office
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're conveniently located in the heart of downtown
            </p>
          </div>

          <div className="gradient-border max-w-5xl mx-auto">
            <div className="glass-effect rounded-3xl p-4 md:p-6">
              {/* Placeholder for a map - in a real implementation, you might use Google Maps, Mapbox, etc. */}
              <div className="w-full h-96 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-700">123 Wellness Street, Suite 100</h3>
                  <p className="text-slate-600">New York, NY 10001</p>
                  <p className="text-blue-600 mt-4">Map view placeholder - implement with Google Maps API</p>
                </div>
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

export default ContactPage;
