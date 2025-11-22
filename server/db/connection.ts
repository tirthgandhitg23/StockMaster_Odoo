// server/db/connection.ts

import mongoose from 'mongoose';
import util from 'util';

// The MONGO_URI is pulled from the .env file in the server folder (loaded in index.ts)
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/stock';

const maskUri = (uri: string) => {
    try {
        // Basic masking to avoid logging password in plaintext
        return uri.replace(/(:).*(@)/, ':*****$2');
    } catch {
        return uri;
    }
};

export const connectDB = async (): Promise<void> => {
    try {
        console.log('Attempting MongoDB connect with URI:', maskUri(MONGO_URI));
        await mongoose.connect(MONGO_URI);
        const dbName = mongoose.connection.db?.databaseName;
        const host = mongoose.connection.host;
        const port = mongoose.connection.port;
        console.log(`💚 MongoDB connected successfully to database: ${dbName} at ${host}:${port}`);
        // Also print full connection state for debugging
        console.log('Mongoose connection state:', util.inspect(mongoose.connection.readyState));
    } catch (error) {
        // Use a type guard or 'as any' to access the error message
        console.error('❌ MongoDB connection failed:', (error as any).message);
        // Exit process with failure
        process.exit(1);
    }
};