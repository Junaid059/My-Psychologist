// GET /api/admin/employees/[id] - Get employee
// PUT /api/admin/employees/[id] - Update employee
// DELETE /api/admin/employees/[id] - Delete employee
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

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
    if (!decoded) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get employee
    const employee = await db.collection('employees').findOne({ _id: id } as any);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ employee }, { status: 200 });
  } catch (error) {
    console.error('Get employee error:', error);
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

    // Check if employee exists
    const existing = await db.collection('employees').findOne({ _id: id } as any);
    if (!existing) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      specialization,
      qualification,
      experience,
      hourlyRate,
      monthlySalary,
      bio,
      isActive
    } = body;

    const now = new Date();

    // Build update object dynamically
    const updateObj: any = { updatedAt: now };
    if (firstName) updateObj.firstName = firstName;
    if (lastName) updateObj.lastName = lastName;
    if (phone !== undefined) updateObj.phone = phone;
    if (specialization) updateObj.specialization = specialization;
    if (qualification !== undefined) updateObj.qualification = qualification;
    if (experience !== undefined) updateObj.experience = experience;
    if (hourlyRate !== undefined) updateObj.hourlyRate = hourlyRate;
    if (monthlySalary !== undefined) updateObj.monthlySalary = monthlySalary;
    if (bio !== undefined) updateObj.bio = bio;
    if (isActive !== undefined) updateObj.isActive = isActive;

    // Update employee
    await db.collection('employees').updateOne(
      { _id: id } as any,
      { $set: updateObj }
    );

    return NextResponse.json(
      { message: 'Employee updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update employee error:', error);
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

    // Check if employee exists
    const existing = await db.collection('employees').findOne({ _id: id } as any);
    if (!existing) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Soft delete by marking as inactive
    await db.collection('employees').updateOne(
      { _id: id } as any,
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    return NextResponse.json(
      { message: 'Employee deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete employee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
