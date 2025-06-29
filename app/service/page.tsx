'use client'
import React, { useState, useEffect } from 'react';
import { ChevronDown, Brain, Heart, Shield, Users, Star, Check, Menu, X, ArrowRight, Sparkles, Zap, Award, Clock, Target, MessageCircle, Video, Calendar, Phone, Mail, MapPin, User, BookOpen, Lightbulb, Compass, Smile, Activity, Eye, Briefcase, Home, Baby, Puzzle } from 'lucide-react';

const ServicesPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeService, setActiveService] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: 1,
      title: "Individual Therapy",
      subtitle: "One-on-One Healing",
      description: "Personalized therapy sessions tailored to your unique needs and goals. Work through challenges in a safe, confidential environment.",
      icon: <User className="w-8 h-8" />,
      gradient: "from-cyan-400 to-blue-500",
      features: [
        "Personalized treatment plans",
        "Evidence-based approaches",
        "Flexible scheduling options",
        "Progress tracking and monitoring",
        "Confidential and secure sessions"
      ],
      duration: "50 minutes",
      price: "Starting at $150",
      specialties: ["Anxiety", "Depression", "Trauma", "Stress Management", "Life Transitions"]
    },
    {
      id: 2,
      title: "Couples Therapy",
      subtitle: "Strengthening Relationships",
      description: "Rebuild connection, improve communication, and work through relationship challenges together with expert guidance.",
      icon: <Heart className="w-8 h-8" />,
      gradient: "from-pink-400 to-rose-500",
      features: [
        "Communication skill building",
        "Conflict resolution techniques",
        "Intimacy and connection work",
        "Goal setting for relationships",
        "Take-home exercises and tools"
      ],
      duration: "60 minutes",
      price: "Starting at $200",
      specialties: ["Communication Issues", "Trust Building", "Intimacy", "Pre-marital Counseling", "Separation Support"]
    },
    {
      id: 3,
      title: "Family Therapy",
      subtitle: "Healing Together",
      description: "Address family dynamics, improve relationships, and create a healthier home environment for everyone involved.",
      icon: <Home className="w-8 h-8" />,
      gradient: "from-emerald-400 to-teal-500",
      features: [
        "Family system assessment",
        "Multi-generational approach",
        "Conflict mediation",
        "Parenting support and guidance",
        "Family goal setting"
      ],
      duration: "75 minutes",
      price: "Starting at $250",
      specialties: ["Parent-Child Conflicts", "Blended Families", "Behavioral Issues", "Communication", "Major Life Changes"]
    },
    {
      id: 4,
      title: "Group Therapy",
      subtitle: "Shared Healing Journey",
      description: "Connect with others facing similar challenges in a supportive group environment led by experienced therapists.",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-violet-400 to-purple-500",
      features: [
        "Peer support and connection",
        "Shared experiences and insights",
        "Cost-effective therapy option",
        "Skill-building workshops",
        "Regular group activities"
      ],
      duration: "90 minutes",
      price: "Starting at $75",
      specialties: ["Anxiety Support", "Depression Support", "Grief & Loss", "Addiction Recovery", "Social Skills"]
    },
    {
      id: 5,
      title: "Child & Teen Therapy",
      subtitle: "Supporting Young Minds",
      description: "Specialized therapy for children and adolescents using age-appropriate techniques and engaging therapeutic methods.",
      icon: <Baby className="w-8 h-8" />,
      gradient: "from-orange-400 to-red-500",
      features: [
        "Play therapy techniques",
        "Age-appropriate interventions",
        "Parent involvement and support",
        "School collaboration",
        "Developmental assessments"
      ],
      duration: "45 minutes",
      price: "Starting at $130",
      specialties: ["ADHD", "Autism Support", "Behavioral Issues", "School Anxiety", "Social Skills Development"]
    },
    {
      id: 6,
      title: "Cognitive Behavioral Therapy",
      subtitle: "Change Your Thinking",
      description: "Evidence-based approach focusing on identifying and changing negative thought patterns and behaviors.",
      icon: <Brain className="w-8 h-8" />,
      gradient: "from-indigo-400 to-blue-600",
      features: [
        "Thought pattern analysis",
        "Behavioral modification techniques",
        "Homework assignments",
        "Skill-building exercises",
        "Relapse prevention strategies"
      ],
      duration: "50 minutes",
      price: "Starting at $160",
      specialties: ["Anxiety Disorders", "Depression", "OCD", "PTSD", "Panic Disorders"]
    },
    {
      id: 7,
      title: "EMDR Therapy",
      subtitle: "Trauma Processing",
      description: "Eye Movement Desensitization and Reprocessing therapy for trauma recovery and emotional healing.",
      icon: <Eye className="w-8 h-8" />,
      gradient: "from-teal-400 to-cyan-600",
      features: [
        "Trauma-focused approach",
        "Bilateral stimulation techniques",
        "Memory reprocessing",
        "Emotional regulation skills",
        "Post-traumatic growth support"
      ],
      duration: "60 minutes",
      price: "Starting at $180",
      specialties: ["PTSD", "Complex Trauma", "Anxiety", "Phobias", "Grief & Loss"]
    },
    {
      id: 8,
      title: "Career Counseling",
      subtitle: "Professional Growth",
      description: "Navigate career transitions, workplace challenges, and professional development with expert guidance.",
      icon: <Briefcase className="w-8 h-8" />,
      gradient: "from-yellow-400 to-orange-500",
      features: [
        "Career assessment tools",
        "Job search strategies",
        "Interview preparation",
        "Workplace conflict resolution",
        "Professional development planning"
      ],
      duration: "50 minutes",
      price: "Starting at $140",
      specialties: ["Career Transitions", "Work-Life Balance", "Workplace Stress", "Leadership Development", "Burnout Prevention"]
    }
  ];

  const sessionFormats = [
    {
      title: "In-Person Sessions",
      description: "Face-to-face therapy in our comfortable, welcoming office environment",
      icon: <MapPin className="w-6 h-6" />,
      features: ["Private therapy rooms", "Comfortable seating", "Confidential environment", "Easy parking"]
    },
    {
      title: "Online Therapy",
      description: "Secure video sessions from the comfort of your own home",
      icon: <Video className="w-6 h-6" />,
      features: ["HIPAA-compliant platform", "Flexible scheduling", "No travel required", "Same quality care"]
    },
    {
      title: "Phone Consultations",
      description: "Quick check-ins and support calls between regular sessions",
      icon: <Phone className="w-6 h-6" />,
      features: ["Crisis support", "Between-session check-ins", "Travel-friendly", "Immediate accessibility"]
    }
  ];

  const specializations = [
    { name: "Anxiety & Panic Disorders", icon: <Activity className="w-5 h-5" />, color: "text-cyan-400" },
    { name: "Depression & Mood Disorders", icon: <Heart className="w-5 h-5" />, color: "text-pink-400" },
    { name: "Trauma & PTSD", icon: <Shield className="w-5 h-5" />, color: "text-emerald-400" },
    { name: "Relationship Issues", icon: <Users className="w-5 h-5" />, color: "text-purple-400" },
    { name: "Stress Management", icon: <Target className="w-5 h-5" />, color: "text-orange-400" },
    { name: "Life Transitions", icon: <Compass className="w-5 h-5" />, color: "text-teal-400" },
    { name: "Grief & Loss", icon: <Lightbulb className="w-5 h-5" />, color: "text-yellow-400" },
    { name: "Self-Esteem Issues", icon: <Smile className="w-5 h-5" />, color: "text-rose-400" }
  ];

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-3000"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glow-effect {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              MyPsychologist
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'Services', 'Testimonials', 'Pricing', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium ${
                  item === 'Services' ? 'text-cyan-400' : ''
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 font-medium">
              Login
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium">
              Book Session
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-effect mx-4 rounded-2xl p-6 animate-slide-up">
            {['Home', 'About', 'Services', 'Testimonials', 'Pricing', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`block py-3 text-gray-300 hover:text-white transition-all duration-300 font-medium ${
                  item === 'Services' ? 'text-cyan-400' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col space-y-3 mt-6">
              <button className="py-3 text-gray-300 hover:text-white transition-all duration-300 font-medium">
                Login
              </button>
              <button className="py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 font-medium">
                Book Session
              </button>
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
              <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
              <span className="text-sm font-medium text-gray-300">Comprehensive Mental Health Services</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-float">
                Services
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover a comprehensive range of therapeutic services designed to support your mental health journey. 
              From individual therapy to specialized treatments, we're here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl font-bold text-lg flex items-center">
                Book Consultation
                <Calendar className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="px-8 py-4 glass-effect rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 font-bold text-lg border border-white/30">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Choose the Right
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Service for You
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Each service is designed with your unique needs in mind, delivered by licensed professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="gradient-border hover-lift group cursor-pointer"
                onClick={() => setActiveService(index)}
              >
                <div className="glass-effect rounded-3xl p-6 h-full relative overflow-hidden">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                  <p className="text-cyan-400 text-sm font-medium mb-3">{service.subtitle}</p>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{service.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </div>
                    <div className="font-medium text-cyan-400">{service.price}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.specialties.slice(0, 3).map((specialty, i) => (
                      <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                        {specialty}
                      </span>
                    ))}
                    {service.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                        +{service.specialties.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <button className="w-full py-2 bg-gradient-to-r from-white/10 to-white/5 rounded-lg hover:from-white/20 hover:to-white/10 transition-all duration-300 text-sm font-medium border border-white/20">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {activeService !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="gradient-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="glass-effect rounded-3xl p-8 relative">
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-6 right-6 w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
              
              {services[activeService] && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className={`w-20 h-20 bg-gradient-to-r ${services[activeService].gradient} rounded-2xl flex items-center justify-center mb-6`}>
                      {services[activeService].icon}
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-2">{services[activeService].title}</h3>
                    <p className="text-cyan-400 text-lg font-medium mb-4">{services[activeService].subtitle}</p>
                    <p className="text-gray-300 mb-6 leading-relaxed">{services[activeService].description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="glass-effect rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                          <span className="font-medium">Duration</span>
                        </div>
                        <p className="text-gray-300">{services[activeService].duration}</p>
                      </div>
                      <div className="glass-effect rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <Target className="w-5 h-5 mr-2 text-green-400" />
                          <span className="font-medium">Price</span>
                        </div>
                        <p className="text-gray-300">{services[activeService].price}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 font-bold">
                        Book Session
                      </button>
                      <button className="px-6 py-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/30">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold mb-4">What's Included</h4>
                    <ul className="space-y-3 mb-6">
                      {services[activeService].features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="text-xl font-bold mb-4">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {services[activeService].specialties.map((specialty, i) => (
                        <span key={i} className="px-3 py-2 bg-gradient-to-r from-white/10 to-white/5 rounded-lg text-sm border border-white/20">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Session Formats */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Flexible
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Session Options
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the format that works best for your lifestyle and comfort level
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sessionFormats.map((format, index) => (
              <div key={index} className="gradient-border hover-lift">
                <div className="glass-effect rounded-3xl p-6 text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {format.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{format.title}</h3>
                  <p className="text-gray-300 mb-6">{format.description}</p>
                  <ul className="space-y-2">
                    {format.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center text-sm text-gray-400">
                        <Check className="w-4 h-4 text-emerald-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Specializations
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Expert care across a wide range of mental health conditions and life challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {specializations.map((spec, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 hover-lift group">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-white/10 to-white/5 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={spec.color}>
                      {spec.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{spec.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="gradient-border max-w-4xl mx-auto">
            <div className="glass-effect rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400/10 to-purple-500/10"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
                  <Heart className="w-10 h-10" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black mb-6">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Ready to Start
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Your Journey?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Take the first step towards better mental health. Book a consultation today and discover 
                  how our personalized approach can help you achieve your goals.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl font-bold text-lg flex items-center">
                    Book Free Consultation
                    <Calendar className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  <button className="px-8 py-4 glass-effect rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 font-bold text-lg border border-white/30 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now: (555) 123-4567
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                    100% Confidential
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2 text-cyan-400" />
                    Licensed Professionals
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    Flexible Scheduling
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Frequently Asked
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get answers to common questions about our services and approach
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "How do I know which service is right for me?",
                answer: "During your initial consultation, we'll discuss your concerns, goals, and preferences to recommend the most suitable therapeutic approach. Our therapists are trained in multiple modalities and will tailor treatment to your specific needs."
              },
              {
                question: "Do you accept insurance?",
                answer: "We accept most major insurance plans and provide superbills for out-of-network reimbursement. Our team can help verify your benefits and explain your coverage options during your first call."
              },
              {
                question: "What's the difference between online and in-person therapy?",
                answer: "Both formats offer the same quality of care and therapeutic benefits. Online therapy provides convenience and accessibility, while in-person sessions offer face-to-face interaction. Many clients find both equally effective."
              },
              {
                question: "How long does therapy typically take?",
                answer: "The duration varies based on individual needs and goals. Some clients see improvement in a few sessions, while others benefit from longer-term therapy. We'll regularly review your progress and adjust the treatment plan accordingly."
              },
              {
                question: "Is everything I share completely confidential?",
                answer: "Yes, we maintain strict confidentiality according to professional ethics and HIPAA regulations. Information is only shared with your written consent or in rare situations required by law for safety reasons."
              }
            ].map((faq, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 hover-lift">
                <h3 className="text-xl font-bold mb-3 text-white">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  MyPsychologist
                </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Transforming lives through innovative psychological care and personalized therapeutic approaches.
              </p>
              <div className="flex space-x-4 mt-6">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <div key={social} className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer">
                    <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Services</h4>
              <ul className="space-y-3">
                {['Individual Therapy', 'Couples Therapy', 'Family Therapy', 'Group Therapy', 'Online Sessions'].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                  123 Wellness Street
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-cyan-400" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                  hello@mypsychologist.com
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                  Mon-Fri: 8AM-8PM
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 MyPsychologist. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;