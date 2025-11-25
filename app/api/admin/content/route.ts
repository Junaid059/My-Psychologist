// GET /api/admin/content - Get all content (exercises, audios, articles)
// POST /api/admin/content - Create new content
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await initializeMongoDatabase();
    const db = await getDatabase();

    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get type filter from query params
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    const filter: any = {};
    if (type) {
      filter.type = type;
    }

    // Get all content
    const content = await db.collection('content')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeMongoDatabase();
    const db = await getDatabase();

    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { type, title, description, category, status, fileUrl } = body;

    // Validate required fields
    if (!type || !title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Create content
    const content = {
      type,
      title,
      description,
      category,
      status: status || 'draft',
      fileUrl: fileUrl || '',
      views: 0,
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection('content').insertOne(content);

    return NextResponse.json(
      {
        message: 'Content created successfully',
        contentId: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
