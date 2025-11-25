import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase } from '@/lib/mongodb';

// GET - Fetch public announcements (sent only)
export async function GET(request: NextRequest) {
  try {
    const db = await initializeMongoDatabase();
    
    // Only fetch sent announcements for public viewing
    const announcements = await db.collection('announcements').find({
      status: 'sent'
    })
    .sort({ sentAt: -1 })
    .limit(50) // Limit to recent 50 announcements
    .toArray();

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}
