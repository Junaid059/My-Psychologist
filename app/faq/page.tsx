'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Brain, Heart, Shield, Users, Menu, X, ArrowRight, Sparkles, Zap, Clock, MessageCircle, Video, Calendar, Phone, Mail, MapPin, User, BookOpen, Lightbulb, Compass, Smile, Plus, Minus } from 'lucide-react';

const FAQPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqCategories = [
    {
      category: "General",
      items: [
        {
          question: "What is psychotherapy and how does it work?",
          answer: "Psychotherapy is a collaborative treatment process between a mental health professional and a client. It works by exploring thoughts, feelings, and behaviors in a safe, confidential environment to address psychological challenges, develop coping strategies, and improve overall wellbeing. Different therapeutic approaches may be used depending on your specific needs and goals."
        },
        {
          question: "How do I know if therapy is right for me?",
          answer: "Therapy can be beneficial for anyone facing challenges with emotions, relationships, life transitions, or specific mental health concerns. If you're experiencing persistent distress, having difficulty functioning in daily life, or simply seeking personal growth, therapy may be helpful. Our free consultation can help determine if our services match your needs."
        },
        {
          question: "What happens during the first therapy session?",
          answer: "The first session is primarily an assessment where your therapist will gather information about your history, current concerns, and goals for therapy. You'll discuss confidentiality, payment, scheduling, and have the opportunity to ask questions about the therapeutic process. This session helps establish rapport and determine the best approach for your unique situation."
        }
      ]
    },
    {
      category: "Services & Approach",
      items: [
        {
          question: "How long does therapy typically take?",
          answer: "The duration of therapy varies based on individual needs and goals. Some clients see improvement in a few sessions for specific issues, while others benefit from longer-term therapy for complex or chronic concerns. We regularly review progress and adjust treatment plans accordingly. Most clients attend weekly sessions for 3-6 months, gradually reducing frequency as improvement occurs."
        },
        {
          question: "What therapeutic approaches do you use?",
          answer: "Our therapists are trained in multiple evidence-based approaches including Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), Dialectical Behavior Therapy (DBT), Psychodynamic Therapy, EMDR, and Mindfulness-based interventions. We tailor our approach to each client's unique needs, often integrating multiple techniques for the most effective treatment."
        },
        {
          question: "What's the difference between online and in-person therapy?",
          answer: "Both formats offer the same quality of care and therapeutic benefits. Online therapy provides convenience, accessibility, and comfort of your own space, while in-person sessions offer face-to-face interaction and may be preferred for certain therapeutic techniques. Many clients find both equally effective, and we can discuss which format would work best for your specific situation."
        }
      ]
    },
    {
      category: "Logistics & Policies",
      items: [
        {
          question: "Do you accept insurance?",
          answer: "We accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. We also provide superbills for out-of-network reimbursement. Our administrative team can verify your benefits before your first appointment and explain any out-of-pocket costs you might incur."
        },
        {
          question: "What are your fees and payment options?",
          answer: "Our session fees vary depending on the service and provider, typically ranging from $120-$200 per session. We offer sliding scale options for those with financial need. Payment is due at the time of service and can be made via credit card, HSA/FSA cards, or online payment. We require 24-hour notice for cancellations to avoid full session charges."
        },
        {
          question: "Is everything I share completely confidential?",
          answer: "Yes, we maintain strict confidentiality according to professional ethics and HIPAA regulations. Information is only shared with your written consent or in rare situations required by law, such as when there is imminent danger to yourself or others, suspected abuse of children or vulnerable adults, or if required by court order. We'll discuss these limitations to confidentiality in detail during your first session."
        }
      ]
    },
    {
      category: "Specialized Treatment",
      items: [
        {
          question: "How do you work with anxiety and depression?",
          answer: "For anxiety and depression, we typically employ evidence-based approaches like Cognitive Behavioral Therapy (CBT), which helps identify and change negative thought patterns; mindfulness techniques to manage symptoms; and behavioral activation to rebuild engagement with positive activities. Treatment is always personalized, may include skills training for emotional regulation, and sometimes incorporates collaboration with psychiatric providers when medication might be beneficial."
        },
        {
          question: "Do you provide couples or family therapy?",
          answer: "Yes, we offer both couples and family therapy. Our approach to couples work draws from research-backed methods like the Gottman Method and Emotionally Focused Therapy (EFT) to improve communication, resolve conflicts, and rebuild connection. Family therapy addresses dynamics between family members, parenting challenges, and supporting families through transitions or crises, using systemic approaches that consider the family as an interconnected unit."
        },
        {
          question: "How do you treat trauma?",
          answer: "Our trauma treatment incorporates specialized approaches including Eye Movement Desensitization and Reprocessing (EMDR), Trauma-Focused Cognitive Behavioral Therapy (TF-CBT), and somatic experiencing techniques. We emphasize creating safety, building coping skills, and processing traumatic memories at a pace that feels manageable. Our trauma-informed therapists understand the complex impacts of trauma and focus on both symptom reduction and post-traumatic growth."
        }
      ]
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
                  item.name === 'FAQ' ? 'text-blue-600' : ''
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
                  item.name === 'FAQ' ? 'text-blue-600' : ''
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
              <span className="text-sm font-medium text-slate-600">Get Answers to Your Questions</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                Frequently
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent animate-float">
                Asked Questions
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our services, approach, and mental health care.
              If you can't find what you're looking for, feel free to reach out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact" className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full hover:from-blue-600 hover:to-teal-500 transition-all duration-300 hover:scale-105 hover:shadow-lg font-bold text-lg flex items-center text-white">
                Ask a Question
                <MessageCircle className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link href="/service" className="px-8 py-4 glass-effect rounded-full hover:bg-white/60 transition-all duration-300 hover:scale-105 font-bold text-lg border border-sky-200 text-slate-600">
                View Services
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-blue-300" />
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div 
                key={categoryIndex} 
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                      {category.category}
                    </span>
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  {category.items.map((item, index) => {
                    const questionIndex = categoryIndex * 10 + index;
                    return (
                      <motion.div
                        key={questionIndex}
                        className="gradient-border hover-lift"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (categoryIndex * 0.2) + (index * 0.1), duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="glass-effect rounded-2xl overflow-hidden border border-slate-200">
                          <motion.button
                            className="w-full text-left px-6 md:px-8 py-6 flex items-center justify-between group"
                            onClick={() => toggleFAQ(questionIndex)}
                            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                            transition={{ duration: 0.2 }}
                          >
                            <h3 className="text-lg md:text-xl font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-300 pr-4">
                              {item.question}
                            </h3>
                            <motion.div
                              animate={{ 
                                rotate: activeIndex === questionIndex ? 180 : 0,
                                scale: activeIndex === questionIndex ? 1.1 : 1
                              }}
                              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                              className="flex-shrink-0"
                            >
                              <ChevronDown className={`w-6 h-6 transition-colors duration-300 ${
                                activeIndex === questionIndex ? 'text-blue-500' : 'text-slate-400'
                              }`} />
                            </motion.div>
                          </motion.button>
                          
                          <AnimatePresence>
                            {activeIndex === questionIndex && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ 
                                  duration: 0.4,
                                  ease: [0.04, 0.62, 0.23, 0.98]
                                }}
                                className="overflow-hidden"
                              >
                                <motion.div 
                                  className="px-6 md:px-8 pb-6 border-t border-slate-200"
                                  initial={{ y: -10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.1, duration: 0.3 }}
                                >
                                  <div className="pt-4">
                                    <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                                      {item.answer}
                                    </p>
                                  </div>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="gradient-border max-w-4xl mx-auto">
            <div className="glass-effect rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-300/10 to-cyan-300/10"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black mb-6">
                  <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                    Still Have
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    Questions?
                  </span>
                </h2>
                
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  We're here to help. Reach out to our team for personalized answers to your questions
                  or to book a free consultation.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href="/contact" className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full hover:from-blue-600 hover:to-teal-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl font-bold text-lg flex items-center text-white">
                    Contact Us
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link href="/service" className="px-8 py-4 glass-effect rounded-full hover:bg-white/50 transition-all duration-300 hover:scale-105 font-bold text-lg border border-slate-200 text-slate-700 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Consultation
                  </Link>
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

export default FAQPage;
