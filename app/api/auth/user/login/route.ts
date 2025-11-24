// POST /api/auth/user/login
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

    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Check password
    if (!comparePassword(password, user.password as string)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'User account is disabled' },
        { status: 403 }
      );
    }

    // Generate token
    const token = generateToken({ id: (user._id as any).toString(), email: user.email as string, userType: 'user' });

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          country: user.country,
          currency: user.currency
        },
        token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
