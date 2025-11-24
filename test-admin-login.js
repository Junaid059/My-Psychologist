// Test script to verify admin login credentials
const { MongoClient } = require('mongodb');
const bcryptjs = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-psychologist';
const DB_NAME = 'my-psychologist';

async function testAdminLogin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Find admin user
    const admin = await db.collection('admin_users').findOne({ email: 'admin@mypsychologist.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...');
      
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
      });
      
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user found!');
      console.log('Email:', admin.email);
      console.log('Is Active:', admin.isActive);
      console.log('Role:', admin.role);
      
      // Test password
      const testPassword = 'admin123';
      const passwordMatch = await bcryptjs.compare(testPassword, admin.password);
      
      if (passwordMatch) {
        console.log('✅ Password "admin123" is correct!');
      } else {
        console.log('❌ Password "admin123" does NOT match!');
        console.log('Resetting password to "admin123"...');
        
        const newHashedPassword = await bcryptjs.hash('admin123', 10);
        await db.collection('admin_users').updateOne(
          { email: 'admin@mypsychologist.com' },
          { $set: { password: newHashedPassword } }
        );
        
        console.log('✅ Password reset successfully!');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testAdminLogin();
