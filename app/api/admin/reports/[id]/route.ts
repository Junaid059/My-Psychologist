import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// PUT - Update report (take moderation action)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token || '');
    
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { action, status, notes, priority } = body;

    const db = await initializeMongoDatabase();
    
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    };

    if (action) {
      updateData.action = action; // 'approve', 'reject', 'delete', 'warn', 'suspend', 'ban'
      updateData.actionBy = decoded.id;
      updateData.actionDate = new Date();
    }
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (priority) updateData.priority = priority;

    const result = await db.collection('reports').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // If action is taken on a user, update the user's status
    if (action && ['warn', 'suspend', 'ban'].includes(action)) {
      const report = await db.collection('reports').findOne({ _id: new ObjectId(params.id) });
      
      if (report && report.reportedUserId) {
        const userUpdate: any = {
          updatedAt: new Date()
        };

        if (action === 'warn') {
          // Increment warning count
          await db.collection('users').updateOne(
            { _id: report.reportedUserId },
            { 
              $inc: { warningCount: 1 },
              $set: userUpdate
            }
          );
        } else if (action === 'suspend') {
          // Suspend user for 30 days
          userUpdate.status = 'suspended';
          userUpdate.suspendedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          
          await db.collection('users').updateOne(
            { _id: report.reportedUserId },
            { $set: userUpdate }
          );
        } else if (action === 'ban') {
          // Permanently ban user
          userUpdate.status = 'banned';
          userUpdate.bannedAt = new Date();
          
          await db.collection('users').updateOne(
            { _id: report.reportedUserId },
            { $set: userUpdate }
          );
        }
      }
    }

    return NextResponse.json({ message: 'Report updated successfully' });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

// DELETE - Delete report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token || '');
    
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await initializeMongoDatabase();
    
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
    }

    const result = await db.collection('reports').deleteOne({ 
      _id: new ObjectId(params.id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
