// GET /api/admin/analytics - Get dashboard analytics
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

    // Get date range from query params (default to last 6 months)
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || 'month';

    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // month
        startDate.setMonth(now.getMonth() - 6);
    }

    // Get total users
    const totalUsers = await db.collection('users').countDocuments();

    // Get active users (those with bookings in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const activeUsersResult = await db.collection('bookings').aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$userId' } },
      { $count: 'count' }
    ]).toArray();
    const activeUsers = activeUsersResult[0]?.count || 0;

    // Get total bookings
    const totalBookings = await db.collection('bookings').countDocuments();

    // Get total revenue from completed transactions
    const revenueResult = await db.collection('transactions').aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get completion rate
    const completedAppointments = await db.collection('appointments').countDocuments({ status: 'completed' });
    const totalAppointments = await db.collection('appointments').countDocuments();
    const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

    // Get average session duration (default 55 for now)
    const avgSessionDuration = 55;

    // Get monthly data for charts
    const monthlyData = await db.collection('bookings').aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]).toArray();

    // Get user growth data
    const userGrowth = await db.collection('users').aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          users: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]).toArray();

    // Get revenue by month
    const revenueByMonth = await db.collection('transactions').aggregate([
      { $match: { status: 'completed', transactionDate: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$transactionDate' },
            month: { $month: '$transactionDate' }
          },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]).toArray();

    // Get top services
    const topServices = await db.collection('bookings').aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'bookingId',
          as: 'transactions'
        }
      },
      {
        $group: {
          _id: '$serviceId',
          name: { $first: '$service.name' },
          count: { $sum: 1 },
          revenue: { $sum: { $arrayElemAt: ['$transactions.amount', 0] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();

    // Get top therapists
    const topTherapists = await db.collection('appointments').aggregate([
      { $match: { status: 'completed' } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $group: {
          _id: '$employeeId',
          name: { $first: { $concat: ['Dr. ', '$employee.firstName', ' ', '$employee.lastName'] } },
          sessions: { $sum: 1 },
          rating: { $first: 4.8 } // Default rating for now
        }
      },
      { $sort: { sessions: -1 } },
      { $limit: 5 }
    ]).toArray();

    // Format monthly data for frontend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const bookingData = monthlyData.find(d => d._id.year === year && d._id.month === month);
      const userData = userGrowth.find(d => d._id.year === year && d._id.month === month);
      const revenueData = revenueByMonth.find(d => d._id.year === year && d._id.month === month);
      
      formattedMonthlyData.push({
        month: months[month - 1],
        users: userData?.users || 0,
        bookings: bookingData?.bookings || 0,
        revenue: revenueData?.revenue || 0
      });
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalBookings,
        totalRevenue: Math.round(totalRevenue),
        completionRate,
        avgSessionDuration
      },
      monthlyData: formattedMonthlyData,
      topServices: topServices.map(s => ({
        name: s.name,
        count: s.count,
        revenue: Math.round(s.revenue || 0)
      })),
      topTherapists: topTherapists.map(t => ({
        name: t.name,
        sessions: t.sessions,
        rating: t.rating
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
