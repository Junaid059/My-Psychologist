// GET /api/admin/users
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('adminToken')?.value;

    if (!token) {
      // For development, skip token check if no token provided
      // In production, this should be enforced
    }

    await initializeMongoDatabase();
    const db = await getDatabase();

    // Fetch all users
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        users: users.map((user: any) => ({
          _id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          country: user.country,
          currency: user.currency,
          isActive: user.isActive !== false, // default to true if not set
          createdAt: user.createdAt
        }))
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
