import { Request, Response } from "express";
import { OperationMaker } from "../models/OperationMaker";
import mongoose from "mongoose";

export const createOperationMaker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { makerId, name } = req.body;

    if (!makerId || !name) {
      res.status(400).json({ message: "Both makerId and name are required" });
      return;
    }

    const operationMaker = new OperationMaker({ makerId, name });
    await operationMaker.save();
    res.status(201).json(operationMaker);
  } catch (err) {
    res.status(500).json({ message: "Failed to create operation maker", error: err });
  }
};

export const listOperationMakers = async (req: Request, res: Response): Promise<void> => {
  try {
    const makers = await OperationMaker.find();
    res.status(200).json(makers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch operation makers", error: err });
  }
};

export const deleteOperationMaker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if the ID is valid
    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid operation maker ID" });
      return;
    }

    // Attempt to find and delete the operation maker
    const operationMaker = await OperationMaker.findByIdAndDelete(id);
    if (!operationMaker) {
      res.status(404).json({ message: "Operation maker not found" });
      return;
    }

    res.status(200).json({ message: "Operation maker deleted successfully", operationMaker });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete operation maker", error: err });
  }
};

export const updateOperationMaker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if the ID is valid
    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid operation maker ID" });
      return;
    }

    // Attempt to find and update the operation maker
    const operationMaker = await OperationMaker.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!operationMaker) {
      res.status(404).json({ message: "Operation maker not found" });
      return;
    }

    res.status(200).json({ message: "Operation maker updated successfully", operationMaker });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to update operation maker", error: err.message });
  }
};