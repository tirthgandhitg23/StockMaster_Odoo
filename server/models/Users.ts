// server/models/User.ts

import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. TypeScript Interface
export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    role: 'Admin' | 'Manager' | 'Staff';
    createdAt: Date;
    updatedAt: Date;
}

// 2. Mongoose Schema
const UserSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // Robust validation for email format
        match: [/.+\@.+\..+/, 'Please enter a valid email address.']
    },
    passwordHash: { // Store only the hashed password
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Manager', 'Staff'], // Enforce specific roles
        default: 'Staff'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// 3. Export Model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;