// backend/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // <-- NEW: Import bcrypt
const users = require('./data/users.js');
const User = require('./models/userModel.js');

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();

    // NEW: Hash passwords before inserting
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    await User.insertMany(createdUsers);

    console.log('✅ Data Imported with Hashed Passwords!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

// ... (The destroyData function remains the same) ...
const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    console.log('✅ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};


if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}