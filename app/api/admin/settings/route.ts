// GET /api/admin/settings - Get global settings
// PUT /api/admin/settings - Update global settings
import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDatabase, getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

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

    // Get settings (should only have one document)
    let settings = await db.collection('settings').findOne({});

    // If no settings exist, create default settings
    if (!settings) {
      const defaultSettings = {
        defaultCurrency: 'USD',
        conversionRates: {
          EUR: 0.85,
          GBP: 0.73,
          CAD: 1.25,
          AUD: 1.35
        },
        servicePrices: {
          individual: 120,
          couples: 180,
          family: 200,
          group: 80,
          child: 100
        },
        defaultDuration: 60,
        maxAppointmentsPerDay: 8,
        advanceBookingDays: 30,
        fullRefundHours: 24,
        partialRefundHours: 12,
        partialRefundPercent: 50,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        reminderHoursBefore: 24,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('settings').insertOne(defaultSettings);
      settings = await db.collection('settings').findOne({});
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    
    // Update settings (upsert)
    await db.collection('settings').updateOne(
      {},
      { 
        $set: {
          ...body,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json(
      { message: 'Settings updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
