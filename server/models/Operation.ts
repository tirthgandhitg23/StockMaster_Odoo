import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type OperationType = "receipt" | "delivery" | "transfer" | "adjustment";

export interface IOperationItem {
  product: Types.ObjectId;
  quantity: number;
  location?: Types.ObjectId; // For receipts/deliveries/adjustments
  fromLocation?: Types.ObjectId; // For transfers
  toLocation?: Types.ObjectId; // For transfers
}

export interface IOperation extends Document {
  type: OperationType;
  referenceNo: string;
  vendor?: Types.ObjectId | string;
  customerName?: string;
  items: IOperationItem[];
  status: "draft" | "waiting" | "completed" | "pending";
  notes?: string;
  createdBy?: Types.ObjectId;
  date: Date;
}

const OperationItemSchema = new Schema<IOperationItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  location: { type: Schema.Types.ObjectId, ref: "Warehouse" },
  fromLocation: { type: Schema.Types.ObjectId, ref: "Warehouse" },
  toLocation: { type: Schema.Types.ObjectId, ref: "Warehouse" },
});

const OperationSchema = new Schema<IOperation>(
  {
    type: {
      type: String,
      required: true,
      enum: ["receipt", "delivery", "transfer", "adjustment"],
    },
    referenceNo: { type: String, required: true, unique: true },
    vendor: { type: Schema.Types.Mixed },
    customerName: { type: String },
    items: { type: [OperationItemSchema], required: true },
    status: { type: String, default: "waiting" },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const Operation: Model<IOperation> = mongoose.model<IOperation>(
  "Operation",
  OperationSchema
);
export default Operation;
