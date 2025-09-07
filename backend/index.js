import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js'; // <-- IMPORT CONFIG
import userRoutes from './routes/userRoutes.js';
import formRoutes from './routes/formRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
const PORT = 5001; // We can hardcode this or add it to the config file

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const startServer = async () => {
  try {
    // ADD THIS LINE to see the connection string
    console.log('Attempting to connect to:', config.mongoURI);

    await mongoose.connect(config.mongoURI);
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