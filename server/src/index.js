import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes.js';
import connectDB from './config/db.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import uploadProjectsRoutes from './routes/uploadProjectsRoutes.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

if (!existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  console.error('💡 Please create a .env file in the server directory with:');
  console.error('   MONGODB_URI=your_mongodb_connection_string');
  console.error('   PORT=5000');
  process.exit(1);
}

const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.error('❌ Error loading .env file:', dotenvResult.error.message);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection and server start
(async () => {
  await connectDB();

  // Routes
 
// index.js
  app.use('/api/projects/filters', filtersRoutes); // specific first
  app.use('/api/projects', projectRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/upload-projects', uploadProjectsRoutes);


  app.get('/', (req, res) => {
    res.send('ZoneView API is running');
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();

