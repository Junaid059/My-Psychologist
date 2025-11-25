import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Initialize MongoDB
    await initializeMongoDatabase();
    const db = await getDatabase();

    const userId = decoded.id;
    
    console.log('🔍 Dashboard API - Looking for user:', userId);

    // 1. Get User Profile - try both id and _id fields
    let user = await db.collection('users').findOne({ id: userId });
    
    if (!user) {
      // Try with _id as ObjectId if userId looks like one
      const { ObjectId } = require('mongodb');
      try {
        user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      } catch (e) {
        // Not a valid ObjectId, continue
      }
    }
    
    if (!user) {
      console.log('❌ User not found in MongoDB. UserId:', userId);
      console.log('🔍 Checking all users...');
      const allUsers = await db.collection('users').find({}).limit(5).toArray();
      console.log('📋 Sample users:', allUsers.map(u => ({ id: u.id, _id: u._id, email: u.email })));
      
      return NextResponse.json(
        { error: 'User not found', userId, debug: 'Check server console for details' },
        { status: 404 }
      );
    }
    
    console.log('✅ User found:', user.email);

    // 2. Get Pomodoro Sessions
    const pomodoroSessions = await db.collection('pomodoro_sessions')
      .find({ userId })
      .sort({ completedAt: -1 })
      .limit(50)
      .toArray();

    const totalPomodoros = pomodoroSessions.filter((s: any) => s.mode === 'work').length;
    const totalFocusMinutes = pomodoroSessions
      .filter((s: any) => s.mode === 'work')
      .reduce((acc: number, s: any) => acc + (s.duration || 0), 0);

    // Today's pomodoros
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayPomodoros = pomodoroSessions.filter((s: any) => 
      s.mode === 'work' && new Date(s.completedAt) >= today
    ).length;

    // This week's pomodoros
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekPomodoros = pomodoroSessions.filter((s: any) => 
      s.mode === 'work' && new Date(s.completedAt) >= weekStart
    ).length;

    // 3. Get Mood Entries
    const moodEntries = await db.collection('mood_entries')
      .find({ userId })
      .sort({ date: -1 })
      .limit(30)
      .toArray();

    const averageMood = moodEntries.length > 0
      ? moodEntries.reduce((acc: number, e: any) => acc + (e.moodLevel || 0), 0) / moodEntries.length
      : 0;

    // Calculate mood streak
    let moodStreak = 0;
    const checkDate = new Date();
    for (let i = 0; i < 365; i++) {
      checkDate.setDate(today.getDate() - i);
      const hasEntry = moodEntries.some((e: any) => 
        new Date(e.date).toDateString() === checkDate.toDateString()
      );
      if (hasEntry) {
        moodStreak++;
      } else {
        break;
      }
    }

    // 4. Get Appointments
    const appointments = await db.collection('appointments')
      .find({ userId })
      .sort({ appointmentDate: -1 })
      .toArray();

    const upcomingAppointments = appointments.filter((a: any) => 
      new Date(a.appointmentDate) > new Date() && a.status !== 'cancelled'
    );

    const completedAppointments = appointments.filter((a: any) => 
      a.status === 'completed'
    );

    const cancelledAppointments = appointments.filter((a: any) => 
      a.status === 'cancelled'
    );

    const pendingAppointments = appointments.filter((a: any) => 
      a.status === 'pending' || a.status === 'confirmed'
    );

    // 5. Get Bookings
    const bookings = await db.collection('bookings')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    const activeBookings = bookings.filter((b: any) => 
      b.status === 'confirmed' || b.status === 'pending'
    );

    const completedBookings = bookings.filter((b: any) => 
      b.status === 'completed'
    );

    // 6. Calculate Activity Stats
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentPomodoroSessions = pomodoroSessions.filter((s: any) => 
      new Date(s.completedAt) >= last7Days
    );

    const recentMoodEntries = moodEntries.filter((e: any) => 
      new Date(e.date) >= last7Days
    );

    // 7. Most common emotions (from mood entries)
    const emotionCounts: { [key: string]: number } = {};
    moodEntries.forEach((entry: any) => {
      (entry.emotions || []).forEach((emotion: string) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, count }));

    // Return comprehensive dashboard data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        avatar: user.avatar || null,
        phone: user.phone || '',
        location: user.location || '',
        createdAt: user.createdAt,
      },
      stats: {
        pomodoro: {
          total: totalPomodoros,
          today: todayPomodoros,
          thisWeek: weekPomodoros,
          totalFocusHours: Math.round(totalFocusMinutes / 60 * 10) / 10,
          totalFocusMinutes,
          recentSessions: recentPomodoroSessions.length,
        },
        mood: {
          totalEntries: moodEntries.length,
          averageMood: Math.round(averageMood * 10) / 10,
          currentStreak: moodStreak,
          recentEntries: recentMoodEntries.length,
          topEmotions,
        },
        appointments: {
          total: appointments.length,
          upcoming: upcomingAppointments.length,
          completed: completedAppointments.length,
          cancelled: cancelledAppointments.length,
          pending: pendingAppointments.length,
        },
        bookings: {
          total: bookings.length,
          active: activeBookings.length,
          completed: completedBookings.length,
        },
      },
      recentActivity: {
        pomodoroSessions: pomodoroSessions.slice(0, 10),
        moodEntries: moodEntries.slice(0, 5),
        appointments: upcomingAppointments.slice(0, 5),
        bookings: activeBookings.slice(0, 5),
      },
    });
  } catch (error: any) {
    console.error('💥 Dashboard fetch error:', error);
    console.error('💥 Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
