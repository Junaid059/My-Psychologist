// GET /api/admin/employees - Get all employees
// POST /api/admin/employees - Create employee
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

    // Get all employees
    const employees = await db.collection('employees').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error('Get employees error:', error);
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
    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      qualification,
      experience,
      hourlyRate,
      monthlySalary,
      bio
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !specialization) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email exists
    const existing = await db.collection('employees').findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Create employee
    const employeeId = generateId('emp');
    const now = new Date();

    const result = await db.collection('employees').insertOne({
      _id: employeeId,
      firstName,
      lastName,
      email,
      phone: phone || null,
      specialization,
      qualification: qualification || null,
      experience: experience || 0,
      hourlyRate: hourlyRate || 0,
      monthlySalary: monthlySalary || 0,
      bio: bio || '',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    } as any);

    // Prepare response (return the inserted object without _id conversion issues)
    return NextResponse.json(
      { 
        message: 'Employee created', 
        employee: {
          _id: employeeId,
          firstName,
          lastName,
          email,
          phone: phone || null,
          specialization,
          qualification: qualification || null,
          experience: experience || 0,
          hourlyRate: hourlyRate || 0,
          monthlySalary: monthlySalary || 0,
          bio: bio || '',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create employee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
