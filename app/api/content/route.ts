import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase } from '@/lib/mongodb';

// GET - Fetch public content (published only)
export async function GET(request: NextRequest) {
  try {
    const db = await initializeMongoDatabase();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // exercise, audio, article

    // Build filter - only published content
    const filter: any = {
      status: 'published'
    };
    
    if (type) {
      filter.type = type;
    }

    const content = await db.collection('content').find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
