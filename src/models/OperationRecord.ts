import mongoose, { Schema } from 'mongoose';

import { IOperationRecord } from "../types/OperationRecord";


const OperationRecordSchema: Schema = new Schema({
  description: { type: String, required: true },
  recordNumber: { type: Number, required: true },
  operationCode: { type: Schema.Types.ObjectId, ref: 'OperationCode', required: true },
  operationMaker: { type: Schema.Types.ObjectId, ref: 'OperationMaker', required: true },
  creditorBalance: { type: Number, required: true },
  debitorBalance: { type: Number, required: true },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const OperationRecord = mongoose.model<IOperationRecord>('OperationRecord', OperationRecordSchema);
