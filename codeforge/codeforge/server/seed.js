require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  try {
    // Delete existing user if present
    await User.deleteOne({ username: 'khushi' });

    // Create user — password will be hashed by pre-save hook
    const user = await User.create({
      username: 'khushi',
      password: '1234@pp',
    });

    console.log(`✅ User created successfully:`);
    console.log(`   Username: khushi`);
    console.log(`   Password: 1234@pp`);
    console.log(`   ID: ${user._id}`);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

seed();
