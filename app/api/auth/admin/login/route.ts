// POST /api/auth/admin/login
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { comparePassword, generateToken, isValidEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initializeMongoDatabase();
    const db = await getDatabase();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await db.collection('admin_users').findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 401 }
      );
    }

    // Check password
    if (!comparePassword(password, admin.password as string)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Admin account is disabled' },
        { status: 403 }
      );
    }

    // Update last login date
    await db.collection('admin_users').updateOne({ _id: admin._id }, { $set: { lastLoginDate: new Date() } });

    // Generate token
    const token = generateToken({ id: (admin._id as any).toString(), email: admin.email as string, userType: 'admin' });

    return NextResponse.json(
      {
        message: 'Admin login successful',
        admin: {
          id: (admin._id as any).toString(),
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        },
        token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
