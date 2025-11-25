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

    // Get user from MongoDB
    const user = await db.collection('users').findOne({ id: decoded.id });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user._id?.toString() || user.id;

    // Calculate stats from MongoDB
    const pomodoroSessions = await db.collection('pomodoro_sessions')
      .find({ userId })
      .toArray();
    const totalPomodoros = pomodoroSessions.filter((s: any) => s.mode === 'work').length;
    const totalMinutes = pomodoroSessions
      .filter((s: any) => s.mode === 'work')
      .reduce((acc: number, s: any) => acc + s.duration, 0);

    const moodEntries = await db.collection('mood_entries')
      .find({ userId })
      .toArray();
    const totalMoodEntries = moodEntries.length;
    const averageMood = moodEntries.length > 0
      ? moodEntries.reduce((acc: number, e: any) => acc + e.moodLevel, 0) / moodEntries.length
      : 0;

    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = moodEntries.some((e: any) => 
        new Date(e.date).toDateString() === checkDate.toDateString()
      );
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    // Return user profile with stats
    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        age: user.age || null,
        location: user.location || '',
        language: user.language || 'English',
        bio: user.bio || '',
        avatar: user.avatar || null,
        emergencyContact: user.emergencyContact || '',
        createdAt: user.createdAt || new Date().toISOString(),
      },
      stats: {
        totalPomodoros,
        totalFocusHours: Math.round(totalMinutes / 60 * 10) / 10,
        totalMoodEntries,
        averageMood: Math.round(averageMood * 10) / 10,
        currentMoodStreak: streak,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    // Get update data
    const body = await request.json();
    const { firstName, lastName, phone, age, location, language, bio, emergencyContact, avatar } = body;

    // Initialize MongoDB
    await initializeMongoDatabase();
    const db = await getDatabase();

    // Get current user - try both _id (MongoDB) and id (custom field)
    const user = await db.collection('users').findOne({ id: decoded.id });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user in MongoDB
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (age !== undefined) updateData.age = age;
    if (location !== undefined) updateData.location = location;
    if (language !== undefined) updateData.language = language;
    if (bio !== undefined) updateData.bio = bio;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (avatar !== undefined) updateData.avatar = avatar;
    updateData.updatedAt = new Date().toISOString();

    await db.collection('users').updateOne(
      { id: decoded.id },
      { $set: updateData }
    );

    // Get updated user
    const updatedUser = await db.collection('users').findOne({ id: decoded.id });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
