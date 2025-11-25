// MongoDB Seed Script - Run with: node scripts/seed.js
// This will populate your local MongoDB with sample data

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/psychologist_db';

const sampleData = {
  // Admin user
  adminUsers: [
    {
      email: 'admin@mypsychologist.com',
      password: 'admin123', // Will be hashed
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      createdAt: new Date()
    }
  ],

  // Regular users (patients)
  users: [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '+1 (555) 123-4567',
      country: 'United States',
      currency: 'USD',
      isActive: true,
      createdAt: new Date()
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      password: 'password123',
      phone: '+1 (555) 234-5678',
      country: 'United States',
      currency: 'USD',
      isActive: true,
      createdAt: new Date()
    },
    {
      firstName: 'Michael',
      lastName: 'Smith',
      email: 'michael.smith@example.com',
      password: 'password123',
      phone: '+1 (555) 345-6789',
      country: 'Canada',
      currency: 'USD',
      isActive: true,
      createdAt: new Date()
    },
    {
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily.williams@example.com',
      password: 'password123',
      phone: '+1 (555) 456-7890',
      country: 'United Kingdom',
      currency: 'GBP',
      isActive: true,
      createdAt: new Date()
    },
    {
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      password: 'password123',
      phone: '+1 (555) 567-8901',
      country: 'Australia',
      currency: 'USD',
      isActive: true,
      createdAt: new Date()
    }
  ],

  // Therapists/Employees
  employees: [
    {
      firstName: 'Dr. Emma',
      lastName: 'Wilson',
      email: 'dr.emma.wilson@clinic.com',
      password: 'therapist123',
      phone: '+1 (555) 111-2222',
      specialization: 'Clinical Psychology',
      experience: 12,
      salary: 8500,
      isActive: true,
      createdAt: new Date()
    },
    {
      firstName: 'Dr. James',
      lastName: 'Anderson',
      email: 'dr.james.anderson@clinic.com',
      password: 'therapist123',
      phone: '+1 (555) 222-3333',
      specialization: 'Cognitive Behavioral Therapy',
      experience: 8,
      salary: 7500,
      isActive: true,
      createdAt: new Date()
    },
    {
      firstName: 'Dr. Olivia',
      lastName: 'Martinez',
      email: 'dr.olivia.martinez@clinic.com',
      password: 'therapist123',
      phone: '+1 (555) 333-4444',
      specialization: 'Family Therapy',
      experience: 10,
      salary: 8000,
      isActive: true,
      createdAt: new Date()
    },
    {
      firstName: 'Dr. William',
      lastName: 'Taylor',
      email: 'dr.william.taylor@clinic.com',
      password: 'therapist123',
      phone: '+1 (555) 444-5555',
      specialization: 'Child Psychology',
      experience: 15,
      salary: 9000,
      isActive: true,
      createdAt: new Date()
    },
    {
      firstName: 'Dr. Sophia',
      lastName: 'Garcia',
      email: 'dr.sophia.garcia@clinic.com',
      password: 'therapist123',
      phone: '+1 (555) 555-6666',
      specialization: 'Trauma Therapy',
      experience: 7,
      salary: 7000,
      isActive: true,
      createdAt: new Date()
    }
  ],

  // Services
  services: [
    {
      name: 'Individual Therapy',
      description: 'One-on-one therapy session with a licensed therapist',
      price: 120,
      duration: 60,
      category: 'Individual',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'Couples Therapy',
      description: 'Therapy session for couples to improve their relationship',
      price: 180,
      duration: 90,
      category: 'Couples',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'Family Therapy',
      description: 'Group therapy session for families',
      price: 200,
      duration: 90,
      category: 'Family',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'Group Therapy',
      description: 'Therapy session in a group setting',
      price: 80,
      duration: 90,
      category: 'Group',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'Crisis Support',
      description: 'Immediate support for crisis situations',
      price: 150,
      duration: 60,
      category: 'Crisis',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'Child Therapy',
      description: 'Specialized therapy for children and adolescents',
      price: 140,
      duration: 60,
      category: 'Child',
      isActive: true,
      createdAt: new Date()
    }
  ]
};

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await db.collection('admin_users').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('employees').deleteMany({});
    await db.collection('services').deleteMany({});
    await db.collection('bookings').deleteMany({});
    await db.collection('appointments').deleteMany({});
    console.log('✅ Existing data cleared');

    // Hash passwords for admin users
    console.log('\n🔐 Hashing admin passwords...');
    for (let admin of sampleData.adminUsers) {
      admin.password = await bcrypt.hash(admin.password, 10);
    }

    // Hash passwords for users
    console.log('🔐 Hashing user passwords...');
    for (let user of sampleData.users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Hash passwords for employees
    console.log('🔐 Hashing employee passwords...');
    for (let employee of sampleData.employees) {
      employee.password = await bcrypt.hash(employee.password, 10);
    }

    // Insert admin users
    console.log('\n👤 Inserting admin users...');
    const adminResult = await db.collection('admin_users').insertMany(sampleData.adminUsers);
    const adminId = Object.values(adminResult.insertedIds)[0];
    console.log(`✅ Inserted ${adminResult.insertedCount} admin users`);

    // Insert users
    console.log('\n👥 Inserting users...');
    const usersResult = await db.collection('users').insertMany(sampleData.users);
    console.log(`✅ Inserted ${usersResult.insertedCount} users`);

    // Insert employees
    console.log('\n👨‍⚕️ Inserting therapists/employees...');
    const employeesResult = await db.collection('employees').insertMany(sampleData.employees);
    console.log(`✅ Inserted ${employeesResult.insertedCount} therapists`);

    // Insert services
    console.log('\n🏥 Inserting services...');
    const servicesResult = await db.collection('services').insertMany(sampleData.services);
    console.log(`✅ Inserted ${servicesResult.insertedCount} services`);

    // Create sample bookings
    console.log('\n📅 Creating sample bookings...');
    const userIds = Object.values(usersResult.insertedIds);
    const serviceIds = Object.values(servicesResult.insertedIds);
    
    const bookings = [
      {
        userId: userIds[0],
        serviceId: serviceIds[0],
        bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        paymentStatus: 'pending',
        totalAmount: 120,
        isActive: true,
        createdAt: new Date()
      },
      {
        userId: userIds[1],
        serviceId: serviceIds[1],
        bookingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'confirmed',
        paymentStatus: 'paid',
        totalAmount: 180,
        isActive: true,
        createdAt: new Date()
      },
      {
        userId: userIds[2],
        serviceId: serviceIds[2],
        bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'confirmed',
        paymentStatus: 'paid',
        totalAmount: 200,
        isActive: true,
        createdAt: new Date()
      }
    ];

    const bookingsResult = await db.collection('bookings').insertMany(bookings);
    console.log(`✅ Inserted ${bookingsResult.insertedCount} bookings`);

    // Create sample appointments
    console.log('\n📆 Creating sample appointments...');
    const employeeIds = Object.values(employeesResult.insertedIds);
    
    const appointments = [
      {
        userId: userIds[0],
        employeeId: employeeIds[0],
        serviceId: serviceIds[0],
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: '10:00',
        status: 'scheduled',
        notes: 'First session for anxiety treatment',
        isActive: true,
        createdAt: new Date()
      },
      {
        userId: userIds[1],
        employeeId: employeeIds[1],
        serviceId: serviceIds[1],
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: '14:00',
        status: 'scheduled',
        notes: 'Couples counseling session',
        isActive: true,
        createdAt: new Date()
      },
      {
        userId: userIds[2],
        employeeId: employeeIds[2],
        serviceId: serviceIds[2],
        appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: '16:00',
        status: 'scheduled',
        notes: 'Family therapy - 4 members',
        isActive: true,
        createdAt: new Date()
      },
      {
        userId: userIds[3],
        employeeId: employeeIds[3],
        serviceId: serviceIds[5],
        appointmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: '11:00',
        status: 'completed',
        notes: 'Child therapy session completed',
        isActive: true,
        createdAt: new Date()
      }
    ];

    const appointmentsResult = await db.collection('appointments').insertMany(appointments);
    console.log(`✅ Inserted ${appointmentsResult.insertedCount} appointments`);

    // 6. Create transactions
    console.log('\n💳 Creating transactions...');
    const bookingIds = Object.values(bookingsResult.insertedIds);
    
    const transactions = [
      {
        bookingId: bookingIds[0],
        userId: userIds[0],
        amount: 120,
        paymentMethod: 'card',
        status: 'completed',
        transactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Payment for Individual Therapy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: bookingIds[1],
        userId: userIds[1],
        amount: 180,
        paymentMethod: 'online',
        status: 'completed',
        transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notes: 'Payment for Couples Therapy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookingId: bookingIds[2],
        userId: userIds[2],
        amount: 200,
        paymentMethod: 'card',
        status: 'pending',
        transactionDate: new Date(),
        notes: 'Payment for Family Therapy',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const transactionsResult = await db.collection('transactions').insertMany(transactions);
    console.log(`✅ Inserted ${transactionsResult.insertedCount} transactions`);

    // ===========================================
    // 7. Creating Reports
    // ===========================================
    console.log('\n7️⃣  Creating reports...');
    
    const reports = [
      {
        reporterId: userIds[0],
        reportedUserId: userIds[3],
        type: 'user',
        reason: 'harassment',
        description: 'User has been sending inappropriate messages to other members',
        status: 'pending',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reporterId: userIds[1],
        reportedUserId: userIds[4],
        type: 'post',
        reason: 'spam',
        description: 'Posting commercial links repeatedly in discussion forums',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        reporterId: userIds[2],
        reportedUserId: userIds[1],
        type: 'comment',
        reason: 'inappropriate',
        description: 'Sharing medical advice without credentials',
        status: 'resolved',
        priority: 'medium',
        action: 'warn',
        actionBy: adminId,
        actionDate: new Date(Date.now() - 86400000), // 1 day ago
        notes: 'User warned about community guidelines',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        reporterId: employeeIds[0],
        reportedUserId: userIds[0],
        type: 'user',
        reason: 'other',
        description: 'Missed multiple appointments without cancellation',
        status: 'dismissed',
        priority: 'low',
        action: 'dismiss',
        actionBy: adminId,
        actionDate: new Date(Date.now() - 86400000),
        notes: 'Patient had valid reasons, resolved with therapist',
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        updatedAt: new Date(Date.now() - 86400000)
      }
    ];

    const reportsResult = await db.collection('reports').insertMany(reports);
    console.log(`✅ Inserted ${reportsResult.insertedCount} reports`);

    // ===========================================
    // 8. Creating Announcements
    // ===========================================
    console.log('\n8️⃣  Creating announcements...');
    
    const announcements = [
      {
        title: 'New Group Therapy Sessions Available',
        message: 'We are excited to announce new group therapy sessions starting next week! These sessions focus on anxiety management and stress reduction. Space is limited, book your spot today.',
        channels: ['email', 'push'],
        targetAudience: 'patients',
        status: 'sent',
        sentAt: new Date(Date.now() - 86400000), // 1 day ago
        deliveryStats: {
          totalRecipients: 5,
          emailSent: 5,
          smsSent: 0,
          pushSent: 5,
          emailDelivered: 5,
          smsDelivered: 0,
          pushDelivered: 4
        },
        createdBy: adminId,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        title: 'Holiday Schedule Update',
        message: 'Please note our modified hours during the holiday season. We will be closed on December 25th and January 1st. Regular hours resume on January 2nd.',
        channels: ['email', 'sms', 'push'],
        targetAudience: 'all',
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 172800000), // 2 days from now
        createdBy: adminId,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        updatedAt: new Date(Date.now() - 7200000)
      },
      {
        title: 'Therapist Training Workshop',
        message: 'Mandatory training session for all therapists on new therapeutic protocols and patient safety guidelines. Session scheduled for next Friday at 9 AM.',
        channels: ['email'],
        targetAudience: 'therapists',
        status: 'draft',
        createdBy: adminId,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        title: 'Platform Maintenance Notice',
        message: 'Our booking platform will undergo scheduled maintenance this Saturday from 2 AM to 6 AM. During this time, online booking may be temporarily unavailable.',
        channels: ['email', 'push'],
        targetAudience: 'all',
        status: 'sent',
        sentAt: new Date(Date.now() - 172800000), // 2 days ago
        deliveryStats: {
          totalRecipients: 10,
          emailSent: 10,
          smsSent: 0,
          pushSent: 10,
          emailDelivered: 10,
          smsDelivered: 0,
          pushDelivered: 9
        },
        createdBy: adminId,
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        updatedAt: new Date(Date.now() - 172800000)
      }
    ];

    const announcementsResult = await db.collection('announcements').insertMany(announcements);
    console.log(`✅ Inserted ${announcementsResult.insertedCount} announcements`);

    console.log('\n\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Admin Users: ${adminResult.insertedCount}`);
    console.log(`   - Patients: ${usersResult.insertedCount}`);
    console.log(`   - Therapists: ${employeesResult.insertedCount}`);
    console.log(`   - Services: ${servicesResult.insertedCount}`);
    console.log(`   - Bookings: ${bookingsResult.insertedCount}`);
    console.log(`   - Appointments: ${appointmentsResult.insertedCount}`);
    console.log(`   - Transactions: ${transactionsResult.insertedCount}`);
    console.log(`   - Reports: ${reportsResult.insertedCount}`);
    console.log(`   - Announcements: ${announcementsResult.insertedCount}`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@mypsychologist.com / admin123');
    console.log('   Patient: john.doe@example.com / password123');
    console.log('   Therapist: dr.emma.wilson@clinic.com / therapist123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

seedDatabase();
