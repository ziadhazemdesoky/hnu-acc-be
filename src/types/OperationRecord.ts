// src/types/OperationRecord.ts
import { Types } from "mongoose";

export interface IOperationCode {
  _id: Types.ObjectId;
  code: string;
  description: string;
}

export interface IOperationMaker {
  _id: Types.ObjectId;
  makerId: string;
  name: string;
}

export interface IOperationRecord {
  _id: Types.ObjectId;
  recordNumber: number;
  description: string;
  operationCode: Types.ObjectId | IOperationCode;
  operationMaker: Types.ObjectId | IOperationMaker;
  creditorBalance: number;
  debitorBalance: number;
  status: "approved" | "pending" | "rejected";
  createdAt: Date;
}
