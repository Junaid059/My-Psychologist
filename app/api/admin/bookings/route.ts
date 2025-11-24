// GET /api/admin/bookings - Get all bookings
// POST /api/admin/bookings - Create booking
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

    // Get all bookings with related data
    const bookings = await db.collection('bookings').aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employeeDetails'
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Get bookings error:', error);
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
    const {
      userId,
      serviceId,
      employeeId,
      packageName,
      quantity,
      priceUSD,
      pricePKR,
      currency,
      paymentMethod,
      transactionId,
      paymentStatus,
      scheduledDate,
      notes
    } = body;

    // Validation
    if (!userId || !serviceId) {
      return NextResponse.json(
        { error: 'User ID and Service ID are required' },
        { status: 400 }
      );
    }

    // Create booking
    const newBooking = {
      userId: new ObjectId(userId),
      serviceId: new ObjectId(serviceId),
      employeeId: employeeId ? new ObjectId(employeeId) : null,
      packageName: packageName || 'Standard Package',
      quantity: quantity || 1,
      priceUSD: priceUSD || 0,
      pricePKR: pricePKR || 0,
      currency: currency || 'PKR',
      paymentMethod: paymentMethod || 'pending',
      transactionId: transactionId || '',
      paymentStatus: paymentStatus || 'pending',
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      notes: notes || '',
      status: 'active',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('bookings').insertOne(newBooking);

    return NextResponse.json(
      {
        message: 'Booking created successfully',
        booking: { _id: result.insertedId, ...newBooking }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
