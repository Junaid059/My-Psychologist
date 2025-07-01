'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Menu, X, Calendar, Clock, ChevronLeft, ChevronRight, Check, CreditCard } from 'lucide-react';

const BookingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Initialize dates for the calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  // Generate calendar days for the current month view
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const days: Date[] = [];
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Add days from previous month to fill the first row
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to fill the last row
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    setCalendarDays(days);
  }, [currentMonth]);

  const services = [
    {
      id: "individual-therapy",
      name: "Individual Therapy",
      description: "One-on-one sessions focused on your specific needs",
      duration: "50 minutes",
      price: "$150"
    },
    {
      id: "couples-therapy",
      name: "Couples Therapy",
      description: "Work together to improve your relationship",
      duration: "60 minutes",
      price: "$200"
    },
    {
      id: "family-therapy",
      name: "Family Therapy",
      description: "Address challenges affecting the whole family",
      duration: "75 minutes",
      price: "$250"
    },
    {
      id: "group-therapy",
      name: "Group Therapy",
      description: "Connect with others facing similar challenges",
      duration: "90 minutes",
      price: "$75"
    }
  ];

  const therapists = [
    {
      id: "dr-williams",
      name: "Dr. Sarah Williams",
      specialty: "Trauma, Anxiety, Depression",
      image: "SW",
      availability: ["Monday", "Wednesday", "Friday"]
    },
    {
      id: "dr-chen",
      name: "Dr. Michael Chen",
      specialty: "Relationship Issues, Life Transitions",
      image: "MC",
      availability: ["Tuesday", "Thursday", "Saturday"]
    },
    {
      id: "dr-rodriguez",
      name: "Dr. Emily Rodriguez",
      specialty: "Family Dynamics, Child Psychology",
      image: "ER",
      availability: ["Monday", "Tuesday", "Wednesday"]
    },
    {
      id: "dr-thompson",
      name: "Dr. James Thompson",
      specialty: "Couples Therapy, Communication",
      image: "JT",
      availability: ["Thursday", "Friday", "Saturday"]
    }
  ];

  // Generate available time slots for the selected date
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const year = prevMonth.getFullYear();
      const month = prevMonth.getMonth();
      return new Date(year, month - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const year = prevMonth.getFullYear();
      const month = prevMonth.getMonth();
      return new Date(year, month + 1, 1);
    });
  };

  const isToday = (day: Date) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === currentMonth.getMonth();
  };

  const isSelected = (day: Date) => {
    return (
      selectedDate &&
      day.getDate() === selectedDate.getDate() &&
      day.getMonth() === selectedDate.getMonth() &&
      day.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isPastDate = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  };

  const handleDateClick = (day: Date) => {
    if (!isPastDate(day)) {
      setSelectedDate(day);
      setSelectedTime(null); // Reset time selection when date changes
    }
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prevStep => prevStep - 1);
  };

  const confirmBooking = () => {
    // In a real application, you would save the booking to a database here
    setIsConfirmed(true);
    window.scrollTo(0, 0);
    // Simulate booking confirmation
    setTimeout(() => {
      setCurrentStep(5);
    }, 1000);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>

      {/* Navbar */}
      <nav className="py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              MyPsychologist
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium">
              About
            </Link>
            <Link href="/service" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium">
              Services
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium">
              Contact
            </Link>
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
            <Link href="/" className="block py-3 text-gray-300 hover:text-white transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="block py-3 text-gray-300 hover:text-white transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/service" className="block py-3 text-gray-300 hover:text-white transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
            <Link href="/faq" className="block py-3 text-gray-300 hover:text-white transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              FAQ
            </Link>
            <Link href="/contact" className="block py-3 text-gray-300 hover:text-white transition-all duration-300 font-medium" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </div>
        )}
      </nav>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Booking Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Book Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Therapy Session
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Take the first step toward your mental wellness journey by scheduling an appointment with one of our experienced therapists.
            </p>
          </div>
          
          {/* Steps Progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                      : 'glass-effect'
                  }`}>
                    {currentStep > step ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 mt-2 hidden sm:block">
                    {step === 1 && "Service"}
                    {step === 2 && "Therapist"}
                    {step === 3 && "Date & Time"}
                    {step === 4 && "Payment"}
                    {step === 5 && "Confirmation"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-gray-700 mt-5 mb-10 max-w-3xl mx-auto">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                style={{ width: `${(currentStep - 1) * 25}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="glass-effect rounded-3xl p-8 animate-slide-up">
            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div 
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedService === service.id 
                          ? 'bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-2 border-cyan-400' 
                          : 'glass-effect'
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                      <p className="text-gray-400 mb-4">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-cyan-400 mr-2" />
                          <span className="text-sm">{service.duration}</span>
                        </div>
                        <span className="font-medium text-lg">{service.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={nextStep}
                    disabled={!selectedService}
                    className={`px-8 py-3 rounded-lg font-medium flex items-center ${
                      selectedService
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400' 
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Select Therapist */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Choose Your Therapist</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {therapists.map((therapist) => (
                    <div 
                      key={therapist.id}
                      onClick={() => setSelectedTherapist(therapist.id)}
                      className={`rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedTherapist === therapist.id 
                          ? 'bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-2 border-cyan-400' 
                          : 'glass-effect'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center font-bold text-xl">
                          {therapist.image}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{therapist.name}</h3>
                          <p className="text-cyan-400">{therapist.specialty}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Available on:</p>
                        <div className="flex flex-wrap gap-2">
                          {therapist.availability.map((day) => (
                            <span key={day} className="px-3 py-1 glass-effect text-xs rounded-full">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="px-8 py-3 glass-effect rounded-lg font-medium flex items-center hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!selectedTherapist}
                    className={`px-8 py-3 rounded-lg font-medium flex items-center ${
                      selectedTherapist
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400' 
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Select Date and Time */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
                
                {/* Calendar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handlePrevMonth}
                        className="p-2 glass-effect rounded-full"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handleNextMonth}
                        className="p-2 glass-effect rounded-full"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const dayClass = `
                        p-2 text-center rounded-lg transition-all duration-200
                        ${isToday(day) ? 'border border-cyan-400' : ''}
                        ${isSelected(day) ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : ''}
                        ${!isCurrentMonth(day) ? 'text-gray-600' : 'text-white'}
                        ${isPastDate(day) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
                      `;
                      
                      return (
                        <button
                          key={index}
                          disabled={isPastDate(day)}
                          className={dayClass}
                          onClick={() => handleDateClick(day)}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Available Times for {formatDate(selectedDate)}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 text-center rounded-lg transition-all duration-200 ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                              : 'glass-effect hover:bg-white/10'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="px-8 py-3 glass-effect rounded-lg font-medium flex items-center hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!selectedDate || !selectedTime}
                    className={`px-8 py-3 rounded-lg font-medium flex items-center ${
                      selectedDate && selectedTime
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400' 
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                
                {/* Booking Summary */}
                <div className="glass-effect rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="text-white font-medium">
                        {services.find(s => s.id === selectedService)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Therapist:</span>
                      <span className="text-white font-medium">
                        {therapists.find(t => t.id === selectedTherapist)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-white font-medium">
                        {selectedDate && formatDate(selectedDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="text-white font-medium">{selectedTime}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-3 flex justify-between">
                      <span>Total:</span>
                      <span className="text-cyan-400 font-bold text-lg">
                        {services.find(s => s.id === selectedService)?.price}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Options */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {['Credit Card', 'Insurance', 'PayPal'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl text-center transition-all duration-200 ${
                          paymentMethod === method
                            ? 'bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-2 border-cyan-400'
                            : 'glass-effect hover:bg-white/10'
                        }`}
                      >
                        <CreditCard className="w-6 h-6 mx-auto mb-2" />
                        <span>{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Credit Card Form - simplified for demo */}
                {paymentMethod === 'Credit Card' && (
                  <div className="glass-effect rounded-xl p-6 mb-8 animate-slide-up">
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="w-full glass-effect rounded-lg px-4 py-3 text-white bg-transparent border border-gray-600 focus:border-cyan-400 focus:outline-none"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            className="w-full glass-effect rounded-lg px-4 py-3 text-white bg-transparent border border-gray-600 focus:border-cyan-400 focus:outline-none"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            className="w-full glass-effect rounded-lg px-4 py-3 text-white bg-transparent border border-gray-600 focus:border-cyan-400 focus:outline-none"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          className="w-full glass-effect rounded-lg px-4 py-3 text-white bg-transparent border border-gray-600 focus:border-cyan-400 focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Insurance Form - simplified for demo */}
                {paymentMethod === 'Insurance' && (
                  <div className="glass-effect rounded-xl p-6 mb-8 animate-slide-up">
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Insurance Provider
                        </label>
                        <input
                          type="text"
                          className="w-full glass-effect rounded-lg px-4 py-3 text-white bg-transparent border border-gray-600 focus:border-cyan-400 focus:outline-none"
                          placeholder="Insurance Company Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Member ID
                        </label>
                        <input
                          type="text"
                          className="w-full glass-effect rounded-lg px-4 py-3 text-white bg-transparent border border-gray-600 focus:border-cyan-400 focus:outline-none"
                          placeholder="Member ID Number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Group Number
                        </label>
                        <input
                          type="text"
                          className="w-full glass-effect rounded-lg px-4 py-3 text-white bg-transparent border border-gray-600 focus:border-cyan-400 focus:outline-none"
                          placeholder="Group Number (if applicable)"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal - simplified for demo */}
                {paymentMethod === 'PayPal' && (
                  <div className="glass-effect rounded-xl p-6 mb-8 text-center animate-slide-up">
                    <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                      Continue to PayPal
                    </button>
                  </div>
                )}

                <div className="mt-10 flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="px-8 py-3 glass-effect rounded-lg font-medium flex items-center hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button 
                    onClick={confirmBooking}
                    disabled={!paymentMethod || isConfirmed}
                    className={`px-8 py-3 rounded-lg font-medium flex items-center ${
                      paymentMethod && !isConfirmed
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400' 
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    {isConfirmed ? 'Processing...' : 'Confirm Booking'}
                    {!isConfirmed && <ChevronRight className="ml-2 w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  Your appointment has been successfully scheduled. We've sent a confirmation email with all the details.
                </p>
                <div className="glass-effect rounded-xl p-6 max-w-md mx-auto mb-8">
                  <h3 className="font-bold mb-4">Appointment Details</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service:</span>
                      <span>{services.find(s => s.id === selectedService)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Therapist:</span>
                      <span>{therapists.find(t => t.id === selectedTherapist)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span>{selectedDate && formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                </div>
                <div className="space-x-4">
                  <Link 
                    href="/"
                    className="px-8 py-3 glass-effect rounded-lg font-medium inline-flex items-center hover:bg-white/10"
                  >
                    Return Home
                  </Link>
                  <Link 
                    href="/dashboard"
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium inline-flex items-center hover:from-cyan-400 hover:to-purple-400"
                  >
                    View Appointments
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Simplified for booking page */}
      <footer className="py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 MyPsychologist. All rights reserved.</p>
            <div className="mt-2">
              <Link href="/privacy" className="hover:text-white mx-2">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white mx-2">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookingPage;
