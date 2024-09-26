import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/rentinito-api';

mongoose.connect(dbURI)
  .then(async () => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
