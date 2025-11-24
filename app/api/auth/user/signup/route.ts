// POST /api/auth/user/signup
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { hashPassword, generateToken, isValidEmail, generateId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Initialize MongoDB if needed
    await initializeMongoDatabase();
    const db = await getDatabase();

    const body = await request.json();
    const { email, password, confirmPassword, firstName, lastName, phone } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user
    const userId = generateId('user');
    const hashedPassword = hashPassword(password);
    const now = new Date();

    const result = await db.collection('users').insertOne({
      _id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      location: '',
      country: '',
      currency: 'USD',
      therapyFocus: [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    } as any);

    // Generate token
    const token = generateToken({ id: userId, email, userType: 'user' });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: userId, email, firstName, lastName },
        token
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
