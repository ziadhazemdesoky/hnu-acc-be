import { Request, Response } from "express";
import { OperationCode } from "../models/OperationCode";

export const createOperationCode = async (req: Request, res: Response) => {
  const { code, description } = req.body;

  try {
    const operationCode = new OperationCode({ code, description });
    await operationCode.save();
    res.status(201).json(operationCode);
  } catch (err) {
    res.status(500).json({ message: "Failed to create operation code", error: err });
  }
};

export const listOperationCodes = async (req: Request, res: Response) => {
  try {
    const codes = await OperationCode.find();
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch operation codes", error: err });
  }
};
