import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// GET - Fetch user's mood entries
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
    
    // Fetch user's mood entries from MongoDB
    const query = userId ? { userId } : {};
    const entries = await db.collection('mood_entries')
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood entries' },
      { status: 500 }
    );
  }
}

// POST - Create a new mood entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, moodLevel, emotions, triggers, activities, notes, gratitude } = body;

    if (!userId || !date || !moodLevel) {
      return NextResponse.json(
        { error: 'Missing required fields (userId, date, moodLevel)' },
        { status: 400 }
      );
    }

    // Initialize MongoDB
    await initializeMongoDatabase();
    const db = await getDatabase();

    const entry = {
      id: body.id || `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      date: new Date(date).toISOString(),
      moodLevel: parseInt(moodLevel),
      emotions: emotions || [],
      triggers: triggers || [],
      activities: activities || [],
      notes: notes || '',
      gratitude: gratitude || null,
      createdAt: new Date().toISOString(),
    };

    await db.collection('mood_entries').insertOne(entry);

    return NextResponse.json({
      success: true,
      entryId: entry.id,
      message: 'Mood entry saved successfully',
    });
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return NextResponse.json(
      { error: 'Failed to save mood entry' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing mood entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, date, moodLevel, emotions, triggers, activities, notes, gratitude } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing entry ID' },
        { status: 400 }
      );
    }

    // Initialize MongoDB
    await initializeMongoDatabase();
    const db = await getDatabase();

    const existingEntry = await db.collection('mood_entries').findOne({ id });
    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };
    
    if (date) updateData.date = new Date(date).toISOString();
    if (moodLevel) updateData.moodLevel = parseInt(moodLevel);
    if (emotions !== undefined) updateData.emotions = emotions;
    if (triggers !== undefined) updateData.triggers = triggers;
    if (activities !== undefined) updateData.activities = activities;
    if (notes !== undefined) updateData.notes = notes;
    if (gratitude !== undefined) updateData.gratitude = gratitude;

    await db.collection('mood_entries').updateOne(
      { id },
      { $set: updateData }
    );

    return NextResponse.json({
      success: true,
      message: 'Mood entry updated successfully',
    });
  } catch (error) {
    console.error('Error updating mood entry:', error);
    return NextResponse.json(
      { error: 'Failed to update mood entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a mood entry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing entry ID' },
        { status: 400 }
      );
    }

    // Initialize MongoDB
    await initializeMongoDatabase();
    const db = await getDatabase();

    // Find and delete the entry
    const result = await db.collection('mood_entries').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mood entry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete mood entry' },
      { status: 500 }
    );
  }
}
