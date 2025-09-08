import path from 'path';
import { fileURLToPath } from 'url'; // Import for robust pathing
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';
import userRoutes from './routes/userRoutes.js';
import formRoutes from './routes/formRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
// THE FIX: Use Render's port or fall back to 5001 for local development
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);

// THE FIX: A more reliable way to define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('✅ Successfully connected to the database');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
};

startServer();