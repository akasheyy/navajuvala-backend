import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminData = {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
