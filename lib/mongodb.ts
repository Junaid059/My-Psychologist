import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-psychologist';
const DB_NAME = 'my-psychologist';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // Return cached database if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    cachedClient = client;
    cachedDb = db;

    console.log('✅ Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function initializeMongoDatabase() {
  const { db } = await connectToDatabase();

  // Create collections if they don't exist
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  // 1. Users collection
  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: -1 });
  }

  // 2. Employees collection
  if (!collectionNames.includes('employees')) {
    await db.createCollection('employees');
    await db.collection('employees').createIndex({ email: 1 }, { unique: true });
    await db.collection('employees').createIndex({ specialization: 1 });
    await db.collection('employees').createIndex({ isActive: 1 });
  }

  // 3. Services collection
  if (!collectionNames.includes('services')) {
    await db.createCollection('services');
    await db.collection('services').createIndex({ name: 1 }, { unique: true });
    
    // Insert default services
    const servicesCount = await db.collection('services').countDocuments();
    if (servicesCount === 0) {
      await db.collection('services').insertMany([
        {
          name: 'Individual Therapy',
          description: 'One-on-one therapy sessions',
          priceUSD: 100,
          pricePKR: 27700,
          durationMinutes: 60,
          category: 'individual',
          isActive: true,
          createdAt: new Date(),
        } as any,
        {
          name: 'Couples Therapy',
          description: 'Therapy for couples and relationships',
          priceUSD: 150,
          pricePKR: 41550,
          durationMinutes: 90,
          category: 'couples',
          isActive: true,
          createdAt: new Date(),
        } as any,
        {
          name: 'Family Therapy',
          description: 'Family counseling sessions',
          priceUSD: 120,
          pricePKR: 33240,
          durationMinutes: 75,
          category: 'family',
          isActive: true,
          createdAt: new Date(),
        } as any,
        {
          name: 'Group Therapy',
          description: 'Group therapy sessions',
          priceUSD: 75,
          pricePKR: 20775,
          durationMinutes: 90,
          category: 'group',
          isActive: true,
          createdAt: new Date(),
        } as any,
      ]);
    }
  }

  // 4. Appointments collection
  if (!collectionNames.includes('appointments')) {
    await db.createCollection('appointments');
    await db.collection('appointments').createIndex({ userId: 1 });
    await db.collection('appointments').createIndex({ employeeId: 1 });
    await db.collection('appointments').createIndex({ appointmentDate: -1 });
    await db.collection('appointments').createIndex({ status: 1 });
  }

  // 5. Bookings collection
  if (!collectionNames.includes('bookings')) {
    await db.createCollection('bookings');
    await db.collection('bookings').createIndex({ userId: 1 });
    await db.collection('bookings').createIndex({ serviceId: 1 });
    await db.collection('bookings').createIndex({ createdAt: -1 });
    await db.collection('bookings').createIndex({ status: 1 });
  }

  // 6. Admin users collection
  if (!collectionNames.includes('admin_users')) {
    await db.createCollection('admin_users');
    await db.collection('admin_users').createIndex({ email: 1 }, { unique: true });
    
    // Insert default admin user if none exist
    const adminCount = await db.collection('admin_users').countDocuments();
    if (adminCount === 0) {
      const bcryptjs = require('bcryptjs');
      const hashedPassword = await bcryptjs.hash('admin123', 10);
      
      await db.collection('admin_users').insertOne({
        email: 'admin@mypsychologist.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        lastLoginDate: null,
        createdAt: new Date(),
      } as any);
    }
  }

  // 7. Sessions collection
  if (!collectionNames.includes('sessions')) {
    await db.createCollection('sessions');
    await db.collection('sessions').createIndex({ userId: 1 });
    await db.collection('sessions').createIndex({ token: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  }

  console.log('✅ MongoDB database initialized with all collections');
  return db;
}

// Helper functions for common operations
export async function getDatabase() {
  const { db } = await connectToDatabase();
  return db;
}

export async function findUserByEmail(email: string) {
  const db = await getDatabase();
  return db.collection('users').findOne({ email });
}

export async function findAdminByEmail(email: string) {
  const db = await getDatabase();
  return db.collection('admin_users').findOne({ email });
}
