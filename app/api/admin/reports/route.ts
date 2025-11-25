import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET - Fetch all reports
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token || '');
    
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await initializeMongoDatabase();
    
    // Get filter parameters from query string
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, resolved, dismissed
    const type = searchParams.get('type'); // post, comment, user

    // Build filter query
    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    // Fetch reports with aggregation to get reporter and reported user details
    const reports = await db.collection('reports').aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'reporterId',
          foreignField: '_id',
          as: 'reporter'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reportedUserId',
          foreignField: '_id',
          as: 'reportedUser'
        }
      },
      {
        $project: {
          type: 1,
          reason: 1,
          description: 1,
          status: 1,
          priority: 1,
          createdAt: 1,
          updatedAt: 1,
          action: 1,
          actionBy: 1,
          actionDate: 1,
          notes: 1,
          reporter: {
            $arrayElemAt: [
              {
                $map: {
                  input: '$reporter',
                  as: 'r',
                  in: {
                    _id: '$$r._id',
                    firstName: '$$r.firstName',
                    lastName: '$$r.lastName',
                    email: '$$r.email'
                  }
                }
              },
              0
            ]
          },
          reportedUser: {
            $arrayElemAt: [
              {
                $map: {
                  input: '$reportedUser',
                  as: 'ru',
                  in: {
                    _id: '$$ru._id',
                    firstName: '$$ru.firstName',
                    lastName: '$$ru.lastName',
                    email: '$$ru.email',
                    userType: '$$ru.userType'
                  }
                }
              },
              0
            ]
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

// POST - Create new report
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token || '');
    
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { reporterId, reportedUserId, type, reason, description, priority } = body;

    // Validate required fields
    if (!reporterId || !reportedUserId || !type || !reason) {
      return NextResponse.json({ 
        error: 'reporterId, reportedUserId, type, and reason are required' 
      }, { status: 400 });
    }

    const db = await initializeMongoDatabase();
    
    const newReport = {
      reporterId: new ObjectId(reporterId),
      reportedUserId: new ObjectId(reportedUserId),
      type, // 'post', 'comment', 'user'
      reason, // 'spam', 'harassment', 'inappropriate', 'other'
      description: description || '',
      status: 'pending', // 'pending', 'resolved', 'dismissed'
      priority: priority || 'medium', // 'low', 'medium', 'high'
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('reports').insertOne(newReport);

    return NextResponse.json({ 
      message: 'Report created successfully',
      reportId: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
