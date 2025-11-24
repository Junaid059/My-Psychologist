// GET /api/admin/bookings/[id] - Get booking
// PUT /api/admin/bookings/[id] - Update booking
// DELETE /api/admin/bookings/[id] - Delete booking
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeMongoDatabase();
    const db = await getDatabase();

    const { id } = await params;

    // Verify token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get booking with related data
    const booking = await db.collection('bookings').aggregate([
      { $match: { _id: new ObjectId(id), isActive: true } },
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
      }
    ]).toArray();

    if (!booking || booking.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking: booking[0] }, { status: 200 });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeMongoDatabase();
    const db = await getDatabase();

    const { id } = await params;

    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if booking exists
    const existing = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const body = await request.json();
    const { packageName, quantity, paymentStatus, status, notes } = body;

    const now = new Date();

    // Build update object
    const updateData: Record<string, any> = { updatedAt: now };
    if (packageName) updateData.packageName = packageName;
    if (quantity) updateData.quantity = quantity;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // Update booking
    await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Get updated booking
    const updated = await db.collection('bookings').aggregate([
      { $match: { _id: new ObjectId(id) } },
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
      }
    ]).toArray();

    return NextResponse.json(
      { message: 'Booking updated', booking: updated[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeMongoDatabase();
    const db = await getDatabase();

    const { id } = await params;

    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if booking exists
    const existing = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Soft delete
    await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    return NextResponse.json(
      { message: 'Booking deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
