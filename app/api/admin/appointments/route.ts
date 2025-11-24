// GET /api/admin/appointments - Get all appointments
// POST /api/admin/appointments - Create appointment
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken, generateId } from '@/lib/auth';

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

    // Get all appointments with aggregation
    const appointments = await db.collection('appointments')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'employee',
          },
        },
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'service',
          },
        },
        {
          $sort: { appointmentDate: -1 },
        },
      ])
      .toArray();

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    const { userId, employeeId, serviceId, appointmentDate, startTime, endTime, notes, status } = body;

    // Validation
    if (!userId || !employeeId || !serviceId || !appointmentDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user, employee, and service exist
    const user = await db.collection('users').findOne({ _id: userId } as any);
    const employee = await db.collection('employees').findOne({ _id: employeeId } as any);
    const service = await db.collection('services').findOne({ _id: serviceId } as any);

    if (!user || !employee || !service) {
      return NextResponse.json(
        { error: 'Invalid user, employee, or service' },
        { status: 404 }
      );
    }

    // Create appointment
    const appointmentId = generateId('apt');
    const now = new Date();

    await db.collection('appointments').insertOne({
      _id: appointmentId,
      userId,
      employeeId,
      serviceId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      status: status || 'scheduled',
      notes: notes || '',
      meetingLink: '',
      videoSessionRecording: '',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    } as any);

    return NextResponse.json(
      { message: 'Appointment created', appointmentId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
