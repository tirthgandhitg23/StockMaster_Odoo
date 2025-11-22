// server/models/Category.ts

import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. TypeScript Interface
export interface ICategory extends Document {
    name: string;
    description?: string;
}

// 2. Mongoose Schema
const CategorySchema: Schema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [2, 'Category name must be at least 2 characters long.']
    },
    description: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
});

// 3. Export Model
const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;