import path from 'path';
import { fileURLToPath } from 'url'; // Import necessary modules for pathing
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import formRoutes from './routes/formRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// --- NEW: Create an absolute path to the .env file ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// --- END OF NEW CODE ---

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);

// Use the reliable __dirname for the static path as well
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Successfully connected to the database');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
};

startServer();