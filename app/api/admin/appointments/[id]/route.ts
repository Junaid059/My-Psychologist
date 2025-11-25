// GET /api/admin/appointments/[id] - Get appointment
// PUT /api/admin/appointments/[id] - Update appointment
// DELETE /api/admin/appointments/[id] - Delete appointment
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

    // Get appointment with related data
    const appointment = await db.collection('appointments').aggregate([
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
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employeeDetails'
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

    if (!appointment || appointment.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ appointment: appointment[0] }, { status: 200 });
  } catch (error) {
    console.error('Get appointment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    // Check if appointment exists
    const existing = await db.collection('appointments').findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const body = await request.json();
    const { appointmentDate, startTime, endTime, status, notes, meetingLink, videoSessionRecording, cancellationReason, refundStatus, refundAmount } = body;

    const now = new Date();

    // Build update object with only provided fields
    const updateData: Record<string, any> = { updatedAt: now };
    if (appointmentDate) updateData.appointmentDate = appointmentDate;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (meetingLink !== undefined) updateData.meetingLink = meetingLink;
    if (videoSessionRecording !== undefined) updateData.videoSessionRecording = videoSessionRecording;
    if (cancellationReason !== undefined) updateData.cancellationReason = cancellationReason;
    if (refundStatus !== undefined) updateData.refundStatus = refundStatus;
    if (refundAmount !== undefined) updateData.refundAmount = refundAmount;

    // Update appointment
    await db.collection('appointments').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Get updated appointment
    const updated = await db.collection('appointments').aggregate([
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
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employeeDetails'
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
      { message: 'Appointment updated', appointment: updated[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update appointment error:', error);
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

    // Check if appointment exists
    const existing = await db.collection('appointments').findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Soft delete
    await db.collection('appointments').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    return NextResponse.json(
      { message: 'Appointment deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
