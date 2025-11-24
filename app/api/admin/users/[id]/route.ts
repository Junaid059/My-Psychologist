// GET /api/admin/users/[id] - Get user
// PUT /api/admin/users/[id] - Update user
// DELETE /api/admin/users/[id] - Delete user (soft delete)
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

    // Get user
    const user = await db.collection('users').findOne({ _id: new ObjectId(id), isActive: true });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's recent bookings
    const bookings = await db.collection('bookings')
      .find({ userId: new ObjectId(id), isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ user, bookings }, { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);
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

    // Check if user exists
    const existing = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, location, country, currency, therapyFocus, isActive } = body;

    const now = new Date();

    // Build update object
    const updateData: Record<string, any> = { updatedAt: now };
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (country) updateData.country = country;
    if (currency) updateData.currency = currency;
    if (therapyFocus) updateData.therapyFocus = therapyFocus;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update user
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Get updated user
    const updated = await db.collection('users').findOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      { message: 'User updated', user: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update user error:', error);
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

    // Check if user exists
    const existing = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Soft delete by marking as inactive
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    return NextResponse.json(
      { message: 'User deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
