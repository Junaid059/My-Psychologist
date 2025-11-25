import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// PUT - Update announcement
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
    const { title, message, channels, targetAudience, scheduledFor, status, sendNow } = body;

    const db = await initializeMongoDatabase();
    
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid announcement ID' }, { status: 400 });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title) updateData.title = title;
    if (message) updateData.message = message;
    if (channels) updateData.channels = channels;
    if (targetAudience) updateData.targetAudience = targetAudience;
    if (status) updateData.status = status;
    if (scheduledFor) updateData.scheduledFor = new Date(scheduledFor);

    // If sending now, update delivery stats
    if (sendNow) {
      let targetFilter: any = {};
      if (targetAudience === 'patients') {
        targetFilter.userType = 'patient';
      } else if (targetAudience === 'therapists') {
        targetFilter.userType = 'therapist';
      }

      const totalRecipients = await db.collection('users').countDocuments(targetFilter);
      
      updateData.sentAt = new Date();
      updateData.status = 'sent';
      updateData.deliveryStats = {
        totalRecipients,
        emailSent: (channels || []).includes('email') ? totalRecipients : 0,
        smsSent: (channels || []).includes('sms') ? totalRecipients : 0,
        pushSent: (channels || []).includes('push') ? totalRecipients : 0,
        emailDelivered: 0,
        smsDelivered: 0,
        pushDelivered: 0
      };
    }

    const result = await db.collection('announcements').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: sendNow ? 'Announcement sent successfully' : 'Announcement updated successfully' 
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

// DELETE - Delete announcement
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
      return NextResponse.json({ error: 'Invalid announcement ID' }, { status: 400 });
    }

    // Check if announcement is already sent
    const announcement = await db.collection('announcements').findOne({ 
      _id: new ObjectId(params.id) 
    });

    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    if (announcement.status === 'sent') {
      return NextResponse.json({ 
        error: 'Cannot delete sent announcements. They are kept for record purposes.' 
      }, { status: 400 });
    }

    const result = await db.collection('announcements').deleteOne({ 
      _id: new ObjectId(params.id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
