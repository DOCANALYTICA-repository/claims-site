import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs'; // <-- 1. IMPORT FILE SYSTEM MODULE
import userRoutes from './routes/userRoutes.js';
import formRoutes from './routes/formRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

// --- 2. CREATE UPLOADS FOLDER IF IT DOESN'T EXIST ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// --- END OF NEW CODE ---

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'https://claims-site.vercel.app', // Allow your Vercel site
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);

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