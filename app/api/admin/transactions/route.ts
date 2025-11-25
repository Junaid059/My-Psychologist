// GET /api/admin/transactions - Get all transactions
// POST /api/admin/transactions - Create transaction
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

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

    // Get all transactions with related data
    const transactions = await db.collection('transactions').aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: 'bookingId',
          foreignField: '_id',
          as: 'bookingDetails'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $unwind: { path: '$bookingDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'bookingDetails.serviceId',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: { path: '$serviceDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          bookingId: {
            _id: '$bookingDetails._id',
            serviceName: '$serviceDetails.name'
          },
          userId: {
            firstName: '$userDetails.firstName',
            lastName: '$userDetails.lastName',
            email: '$userDetails.email'
          },
          amount: 1,
          paymentMethod: 1,
          status: 1,
          transactionDate: 1,
          refundAmount: 1,
          notes: 1,
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error('Get transactions error:', error);
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
    const { bookingId, userId, amount, paymentMethod, status, notes } = body;

    // Validate required fields
    if (!bookingId || !userId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Create transaction
    const transaction = {
      bookingId: new ObjectId(bookingId),
      userId: new ObjectId(userId),
      amount: parseFloat(amount),
      paymentMethod,
      status: status || 'completed',
      transactionDate: now,
      notes: notes || '',
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection('transactions').insertOne(transaction);

    return NextResponse.json(
      {
        message: 'Transaction created successfully',
        transactionId: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
