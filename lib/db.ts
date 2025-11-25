// Database initialization using in-memory database with persistence
import InMemoryDatabase from './in-memory-db';
import { hashPassword } from './auth';

const db = new InMemoryDatabase('psychologist.json');

/**
 * Initialize database schema and default data
 */
export function initializeDatabase() {
  // Create tables if they don't exist
  db.createTable('users');
  db.createTable('employees');
  db.createTable('services');
  db.createTable('appointments');
  db.createTable('bookings');
  db.createTable('admin_users');
  db.createTable('sessions');
  db.createTable('pomodoro_sessions');
  db.createTable('mood_entries');

  // Insert default services if none exist
  const existingServices = db.find('services');
  if (existingServices.length === 0) {
    const services = [
      {
        id: 'service_individual',
        name: 'Individual Therapy',
        description: 'One-on-one therapy session',
        durationMinutes: 60,
        basePriceUSD: 100,
        basePricePKR: 5000,
        category: 'Individual',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'service_couples',
        name: 'Couples Therapy',
        description: 'Therapy session for couples',
        durationMinutes: 90,
        basePriceUSD: 150,
        basePricePKR: 7500,
        category: 'Couples',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'service_family',
        name: 'Family Therapy',
        description: 'Family therapy session',
        durationMinutes: 90,
        basePriceUSD: 120,
        basePricePKR: 6000,
        category: 'Family',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'service_group',
        name: 'Group Therapy',
        description: 'Group therapy session',
        durationMinutes: 60,
        basePriceUSD: 75,
        basePricePKR: 3750,
        category: 'Group',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const service of services) {
      db.insert('services', service);
    }
  }

  // Create default admin user if none exist
  const existingAdmins = db.find('admin_users');
  if (existingAdmins.length === 0) {
    const adminEmail = 'admin@mypsychologist.com';
    const adminPassword = 'admin123';
    const hashedPassword = hashPassword(adminPassword);

    db.insert('admin_users', {
      id: 'admin_001',
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      permissions: JSON.stringify(['manage_all']),
      isActive: true,
      lastLoginDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Create default test user if none exist
  const existingUsers = db.find('users');
  if (existingUsers.length === 0) {
    const userEmail = 'user@test.com';
    const userPassword = 'password123';
    const hashedPassword = hashPassword(userPassword);

    db.insert('users', {
      id: 'user_001',
      email: userEmail,
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      country: 'USA',
      currency: 'USD',
      avatar: null,
      age: 25,
      location: 'New York, USA',
      language: 'English',
      bio: 'Test user account for demonstration',
      emergencyContact: '+1987654321',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    });
    
    console.log(`✅ Created test user: ${userEmail} / ${userPassword}`);
  }
}

// Database helper functions with better method names
export const database = {
  // Generic operations
  createTable: (name: string) => db.createTable(name),
  insert: (table: string, record: Record<string, any>) => {
    db.insert(table, record);
    return record;
  },
  find: (table: string, filter?: (record: Record<string, any>) => boolean) => db.find(table, filter),
  findOne: (table: string, filter: (record: Record<string, any>) => boolean) => db.findOne(table, filter),
  update: (table: string, filter: (record: Record<string, any>) => boolean, updates: Record<string, any>) => {
    db.update(table, filter, updates);
  },
  delete: (table: string, filter: (record: Record<string, any>) => boolean) => {
    db.delete(table, filter);
  },
  deleteOne: (table: string, filter: (record: Record<string, any>) => boolean) => {
    db.deleteOne(table, filter);
  },
  clear: (table: string) => db.clear(table),
  getAll: (table: string) => db.find(table),
  count: (table: string) => db.find(table).length,

  // Convenience methods for specific tables
  findUserByEmail: (email: string) => db.findOne('users', (u) => u.email === email),
  findUserById: (id: string) => db.findOne('users', (u) => u.id === id),
  findAdminByEmail: (email: string) => db.findOne('admin_users', (a) => a.email === email),
  findEmployeeById: (id: string) => db.findOne('employees', (e) => e.id === id),
  findAppointmentById: (id: string) => db.findOne('appointments', (a) => a.id === id),
  findBookingById: (id: string) => db.findOne('bookings', (b) => b.id === id)
};

// Initialize database on module load
initializeDatabase();

export default db;
