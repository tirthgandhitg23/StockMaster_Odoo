// server/db/connection.ts

import mongoose from 'mongoose';

// The MONGO_URI is pulled from the .env file in the root
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/stock';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('💚 MongoDB connected successfully!');
    } catch (error) {
        // Use a type guard or 'as any' to access the error message
        console.error('❌ MongoDB connection failed:', (error as any).message);
        // Exit process with failure
        process.exit(1);
    }
};