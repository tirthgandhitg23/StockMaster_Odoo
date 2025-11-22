// server/models/Product.ts

// server/models/Product.ts

import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// --- 1. TypeScript Interfaces ---

// Interface for the sub-document: Stock quantity at a specific warehouse
export interface IStockLocation {
    warehouseId: Types.ObjectId;
    quantity: number;
}

// Interface for the main Product document
export interface IProduct extends Document {
    sku: string;
    name: string;
    description?: string;
    category: Types.ObjectId; // Reference to the Category model
    unitPrice: number;
    // Array of objects to store stock quantity for each warehouse
    stockLocations: IStockLocation[]; 
    reorderPoint: number;
    createdAt: Date;
    updatedAt: Date;
}

// --- 2. Mongoose Schema ---

const ProductSchema: Schema = new Schema<IProduct>({
    sku: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        uppercase: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: false 
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category' // Links to the Category model
    },
    unitPrice: {
        type: Number,
        required: true,
        // Robust input validation
        min: [0.01, 'Unit price must be greater than zero.'] 
    },
    // --- Multi-Warehouse Stock Management ---
    stockLocations: [{
        warehouseId: {
            type: Schema.Types.ObjectId,
            ref: 'Warehouse', // Links to the new Warehouse model
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            // Robust input validation: stock cannot be negative at any location
            min: [0, 'Stock quantity cannot be negative.'], 
            default: 0
        }
    }],
    // ----------------------------------------
    reorderPoint: {
        type: Number,
        required: true,
        min: [0, 'Reorder point cannot be negative.'],
        default: 10
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// --- 3. Export Model ---
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;