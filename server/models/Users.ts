import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// FIX: Ensure we use the existing model if it exists, or create a new one
// This prevents "OverwriteModelError"
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;