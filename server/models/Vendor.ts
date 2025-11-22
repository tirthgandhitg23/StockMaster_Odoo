import mongoose, { Document, Schema, Model } from "mongoose";

export interface IVendor extends Document {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

const VendorSchema = new Schema<IVendor>({
  name: { type: String, required: true, unique: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
});

const Vendor: Model<IVendor> = mongoose.model<IVendor>("Vendor", VendorSchema);
export default Vendor;
