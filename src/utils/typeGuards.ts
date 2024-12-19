// src/utils/typeGuards.ts
import mongoose from "mongoose";
import { IOperationCode, IOperationMaker } from "../types/OperationRecord";

// Type Guard for Populated `operationCode`
export const isOperationCodePopulated = (
  operationCode: mongoose.Types.ObjectId | IOperationCode
): operationCode is IOperationCode => {
  return !(operationCode instanceof mongoose.Types.ObjectId);
};

// Type Guard for Populated `operationMaker`
export const isOperationMakerPopulated = (
  operationMaker: mongoose.Types.ObjectId | IOperationMaker
): operationMaker is IOperationMaker => {
  return !(operationMaker instanceof mongoose.Types.ObjectId);
};