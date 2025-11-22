// server/models/Warehouse.ts

import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IWarehouse extends Document {
    name: string;
    location: string; // e.g., 'Mumbai', 'Warehouse B'
    managerId: mongoose.Types.ObjectId; // Reference to the User managing this warehouse
}

const WarehouseSchema: Schema = new Schema<IWarehouse>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
    },
    managerId: {
        type: Schema.Types.ObjectId,
        required: false, // Optional if no manager is assigned
        ref: 'User',
    }
}, {
    timestamps: true
});

const Warehouse: Model<IWarehouse> = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export default Warehouse;