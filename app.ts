// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));