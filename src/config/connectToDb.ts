import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log(' Connected to database');
  } catch (e) {
    console.error(' Error connecting to database:', e);
  }
};

export default connectDB;
