// GET /api/admin/transactions/[id] - Get transaction
// PUT /api/admin/transactions/[id] - Update transaction (for refunds)
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

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

    const body = await request.json();
    const { status, refundAmount, notes } = body;

    const now = new Date();

    // Build update object
    const updateData: Record<string, any> = { updatedAt: now };
    if (status) updateData.status = status;
    if (refundAmount !== undefined) updateData.refundAmount = parseFloat(refundAmount);
    if (notes !== undefined) updateData.notes = notes;

    // Update transaction
    const result = await db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Transaction updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
