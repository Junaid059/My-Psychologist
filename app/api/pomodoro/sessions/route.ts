import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// GET - Fetch user's pomodoro sessions
export async function GET(request: NextRequest) {
  try {
    // Get userId from query params or Authorization header
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    
    // Try to get userId from token
    const authHeader = request.headers.get('Authorization');
    let userId = userIdParam;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded?.id) {
        userId = decoded.id;
      }
    }
    
    // Initialize MongoDB
    await initializeMongoDatabase();
    const db = await getDatabase();
    
    // Fetch user's pomodoro sessions from MongoDB
    const query = userId ? { userId } : {};
    const sessions = await db.collection('pomodoro_sessions')
      .find(query)
      .sort({ completedAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Error fetching pomodoro sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST - Save a completed pomodoro session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, mode, duration, completedAt, taskId, taskTitle, distractions } = body;

    if (!userId || !mode || !duration || !completedAt) {
      return NextResponse.json(
        { error: 'Missing required fields (userId, mode, duration, completedAt required)' },
        { status: 400 }
      );
    }

    // Initialize MongoDB
    await initializeMongoDatabase();
    const db = await getDatabase();

    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      mode,
      duration: parseInt(duration),
      completedAt: new Date(completedAt).toISOString(),
      taskId: taskId || null,
      taskTitle: taskTitle || null,
      distractions: distractions || 0,
      createdAt: new Date().toISOString(),
    };

    await db.collection('pomodoro_sessions').insertOne(session);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      message: 'Session saved successfully',
    });
  } catch (error) {
    console.error('Error saving pomodoro session:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all sessions (optional, for testing)
export async function DELETE(request: NextRequest) {
  try {
    // Initialize MongoDB
    await initializeMongoDatabase();
    const db = await getDatabase();
    
    // Delete all sessions
    await db.collection('pomodoro_sessions').deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'All sessions cleared',
    });
  } catch (error) {
    console.error('Error deleting sessions:', error);
    return NextResponse.json(
      { error: 'Failed to delete sessions' },
      { status: 500 }
    );
  }
}
