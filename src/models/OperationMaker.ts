import mongoose, { Schema } from "mongoose";

const OperationMakerSchema = new Schema(
    {
      makerId: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      active: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
  
  export const OperationMaker = mongoose.model("OperationMaker", OperationMakerSchema);
  