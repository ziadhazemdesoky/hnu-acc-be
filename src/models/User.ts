import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
      username: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true },
      role: { type: String, enum: ["admin", "accountant"], required: true },
    },
    { timestamps: true }
  );
  
  export const User = mongoose.model("User", UserSchema);
  