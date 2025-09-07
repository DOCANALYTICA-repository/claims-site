import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from './config.js'; // <-- USE CONFIG
import users from './data/users.js';
import User from './models/userModel.js';
import Form from './models/formModel.js'; // Import Form model to delete forms

const importData = async () => {
  try {
    await mongoose.connect(config.mongoURI); // <-- USE CONFIG

    // Clear existing data
    await User.deleteMany();
    await Form.deleteMany(); // Also clear old forms for a clean slate

    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, 10); // Use 10 for saltRounds
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