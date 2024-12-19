import mongoose, { Schema } from "mongoose";

const OperationCodeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const OperationCode = mongoose.model("OperationCode", OperationCodeSchema);
