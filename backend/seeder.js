const mongoose = require('mongoose');
const Admin = require('./src/models/Admin'); 
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    
    if (existingAdmin) {
      console.log('Admin already exists:', {
        email: existingAdmin.email,
        name: existingAdmin.name
      });
      process.exit();
    }

    // Create admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@krypto.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Admin'
    });

    console.log('✅ Admin created successfully:');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', process.env.ADMIN_PASSWORD || 'admin123');
    console.log('📛 Name:', admin.name);
    
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

const deleteAdmin = async () => {
  try {
    await Admin.deleteMany({});
    console.log('✅ All admins deleted');
    process.exit();
  } catch (error) {
    console.error('❌ Error deleting admins:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Check command line arguments
if (process.argv[2] === '-d') {
  deleteAdmin();
} else {
  createAdmin();
}