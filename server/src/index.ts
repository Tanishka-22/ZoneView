import mongoose from "mongoose";
import express from 'express';
const cors = require('cors');
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes';
import connectDB from './config/db';
import analyticsRoutes from './routes/analyticsRoutes';
import filtersRoutes from './routes/filtersRoutes';
import uploadRoutes from './routes/uploadRoutes';
import uploadProjectsRoutes from './routes/uploadProjectsRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection and server start
(async () => {
  await connectDB();

  // Routes
 
// index.ts
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
