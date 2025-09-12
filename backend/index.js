import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import formRoutes from './routes/formRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Define __dirname for ES Modules (do this only once at the top)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This will load the .env file ONLY if we are not in a production environment
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const app = express();
const PORT = process.env.PORT || 5001;

// Use specific CORS configuration for your live site
app.use(cors({
  origin: 'https://claims-site.vercel.app'
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);

// Use the reliable __dirname (defined at the top) to serve your uploads folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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