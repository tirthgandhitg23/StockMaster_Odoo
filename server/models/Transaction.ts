// server/models/Transaction.ts

import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// --- 1. TypeScript Interface ---
/**
 * Defines the structure and types for a Transaction document.
 */
export interface ITransaction extends Document {
    type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER'; // Stock movement type
    product: Types.ObjectId; // Reference to the Product being moved
    quantity: number;
    warehouseId: Types.ObjectId; // Reference to the Warehouse where the movement happened
    notes?: string;
    user: Types.ObjectId; // Reference to the User who performed the action
    timestamp: Date;
}

// --- 2. Mongoose Schema ---
const TransactionSchema: Schema = new Schema<ITransaction>({
    type: {
        type: String,
        required: true,
        // Define the possible transaction types
        enum: ['IN', 'OUT', 'ADJUST', 'TRANSFER'], 
        message: '{VALUE} is not a supported transaction type.'
    },
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product' // Links to the Product model
    },
    warehouseId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Warehouse' // Links to the Warehouse model
    },
    quantity: {
        type: Number,
        required: true,
        // Robust validation: quantity must be greater than zero for any movement
        min: [1, 'Quantity must be at least 1.'] 
    },
    notes: {
        type: String,
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links to the User model
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now // Records when the transaction happened
    }
});

// --- 3. Export Model ---
const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction;