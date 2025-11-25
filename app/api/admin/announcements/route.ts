import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET - Fetch all announcements
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token || '');
    
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await initializeMongoDatabase();
    
    // Get filter parameters from query string
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // draft, scheduled, sent
    const channel = searchParams.get('channel'); // email, sms, push

    // Build filter query
    const filter: any = {};
    if (status) filter.status = status;
    if (channel) filter.channels = { $in: [channel] };

    // Fetch announcements with creator details
    const announcements = await db.collection('announcements').aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'admin_users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $project: {
          title: 1,
          message: 1,
          channels: 1,
          targetAudience: 1,
          status: 1,
          scheduledFor: 1,
          sentAt: 1,
          deliveryStats: 1,
          createdAt: 1,
          updatedAt: 1,
          creator: {
            $arrayElemAt: [
              {
                $map: {
                  input: '$creator',
                  as: 'c',
                  in: {
                    _id: '$$c._id',
                    firstName: '$$c.firstName',
                    lastName: '$$c.lastName',
                    email: '$$c.email'
                  }
                }
              },
              0
            ]
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

// POST - Create new announcement
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token || '');
    
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, channels, targetAudience, scheduledFor, sendNow } = body;

    // Validate required fields
    if (!title || !message || !channels || channels.length === 0) {
      return NextResponse.json({ 
        error: 'title, message, and channels are required' 
      }, { status: 400 });
    }

    const db = await initializeMongoDatabase();
    
    const now = new Date();
    const newAnnouncement: any = {
      title,
      message,
      channels, // ['email', 'sms', 'push']
      targetAudience: targetAudience || 'all', // 'all', 'patients', 'therapists'
      status: sendNow ? 'sending' : scheduledFor ? 'scheduled' : 'draft',
      createdBy: new ObjectId(decoded.id),
      createdAt: now,
      updatedAt: now
    };

    if (scheduledFor && !sendNow) {
      newAnnouncement.scheduledFor = new Date(scheduledFor);
    }

    if (sendNow) {
      // Count target users
      let targetFilter: any = {};
      if (targetAudience === 'patients') {
        targetFilter.userType = 'patient';
      } else if (targetAudience === 'therapists') {
        targetFilter.userType = 'therapist';
      }

      const totalRecipients = await db.collection('users').countDocuments(targetFilter);
      
      newAnnouncement.sentAt = now;
      newAnnouncement.status = 'sent';
      newAnnouncement.deliveryStats = {
        totalRecipients,
        emailSent: channels.includes('email') ? totalRecipients : 0,
        smsSent: channels.includes('sms') ? totalRecipients : 0,
        pushSent: channels.includes('push') ? totalRecipients : 0,
        emailDelivered: 0,
        smsDelivered: 0,
        pushDelivered: 0
      };
    }

    const result = await db.collection('announcements').insertOne(newAnnouncement);

    return NextResponse.json({ 
      message: sendNow ? 'Announcement sent successfully' : 'Announcement created successfully',
      announcementId: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
