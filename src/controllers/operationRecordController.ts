import { Request, Response } from "express";
import { OperationRecord } from "../models/OperationRecord";
import { OperationCode } from "../models/OperationCode";
import { OperationMaker } from "../models/OperationMaker";
import { Counter } from "../models/Counter";
import { ParsedQs } from "qs";

import mongoose from "mongoose";

interface ApproveOperationRecordParams {
    id: string;
  }

  export const getOperationRecords = async (req: Request, res: Response): Promise<void> => {
    try {
      const page: string | ParsedQs | string[] | ParsedQs[] | undefined = req.query.page;
      const status: string | ParsedQs | string[] | ParsedQs[] | undefined = req.query.status;
      const search: string | ParsedQs | string[] | ParsedQs[] | undefined = req.query.search;

      
      // Default values
      let pageNumber = 1;
      let statusFilter = "all";
      // Handle `page`
      if (typeof page === "string") {
          const parsedPage = Number(page);
          if (!isNaN(parsedPage) && parsedPage > 0) {
              pageNumber = parsedPage;
          }
      }

      // Handle `status`
      const allowedStatuses = ["pending", "approved", "rejected", "all"];
      if (typeof status === "string" && allowedStatuses.includes(status)) {
          statusFilter = status;
      }

      // Build query
      const query : any = statusFilter === "all" ? {} : { status: statusFilter };
      if (search) {
        query.$or = [
          { description: { $regex: search, $options: "i" } },
          { "operationCode.name": { $regex: search, $options: "i" } },
          { "operationMaker.name": { $regex: search, $options: "i" } },
        ];
      }
      const itemsPerPage = 10;
      const offset = (pageNumber - 1) * itemsPerPage;
      console.log(offset)
      const records = await OperationRecord.find(query)
          .populate("operationCode")
          .populate("operationMaker")
          .skip(offset)
          .limit(itemsPerPage);
      const total = await OperationRecord.countDocuments(query);

      res.json({ records, total });
  } catch (error) {
      console.error("Error fetching operation records:", error);
      res.status(500).json({ message: "Server error" });
  }
  };

  export const createOperationRecord = async (req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      const { operationCode, operationMaker, description, creditorBalance, debitorBalance } = req.body;
  
      // Validate operationCode
      const codeFilter = mongoose.isValidObjectId(operationCode)
        ? { _id: operationCode }
        : { code: operationCode };
  
      const code = await OperationCode.findOne(codeFilter).session(session);
      if (!code) {
        await session.abortTransaction();
        res.status(400).json({ message: `Operation code "${operationCode}" not found` });
        return;
      }
  
      // Validate operationMaker
      const makerFilter = mongoose.isValidObjectId(operationMaker)
        ? { _id: operationMaker }
        : { $or: [{ makerId: operationMaker }, { name: operationMaker }] };
  
      const maker = await OperationMaker.findOne(makerFilter).session(session);
      if (!maker) {
        await session.abortTransaction();
        res.status(400).json({ message: `Operation maker "${operationMaker}" not found` });
        return;
      }
  
      const counter = await Counter.findOneAndUpdate(
        { name: "recordNumber" },
        { $inc: { value: 1 } },
        { new: true, upsert: true, session }
      );
      if (!counter) {
        await session.abortTransaction();
        res.status(500).json({ message: "Failed to initialize or increment counter" });
        return;
      }
  
      // Create the record
      const record = new OperationRecord({
        recordNumber: counter.value,
        operationCode: code._id,
        operationMaker: maker._id,
        description,
        creditorBalance,
        debitorBalance,
      });
  
      console.log("Creating record:", record);
      await record.save({ session });
  
      // Commit the transaction
      await session.commitTransaction();
      res.status(201).json(record);
    } catch (err: unknown) {
      await session.abortTransaction();
      res.status(500).json({
        message: "Failed to create operation record",
        error: (err as Error).message || "Unknown error",
      });
    } finally {
      session.endSession();
    }
  };

export const approveOperationRecord = async (req: Request<ApproveOperationRecordParams>, res: Response): Promise<void> => {
    try {
      // Extract the `id` parameter from the request
      const { id }: { id: string } = req.params;
  
      // Find the record by ID
      const record = await OperationRecord.findById(id);
      if (!record) {
        res.status(404).json({ message: "Record not found" });
        return;
      }
  
      // Update the status of the record
      record.status = "approved";
      await record.save();
  
      // Send the updated record as a response
      res.status(200).json(record);
    } catch (err: unknown) {
      // Handle unexpected errors safely
      res.status(500).json({
        message: "Failed to approve record",
        error: (err as Error).message || "Unknown error",
      });
    }
  };

  export const refuseOperationRecord = async (req: Request<ApproveOperationRecordParams>, res: Response): Promise<void> => {
    try {
      // Extract the `id` parameter from the request
      const { id }: { id: string } = req.params;
  
      // Find the record by ID
      const record = await OperationRecord.findById(id);
      if (!record) {
        res.status(404).json({ message: "Record not found" });
        return;
      }
  
      // Update the status of the record
      record.status = "rejected";
      await record.save();
  
      // Send the updated record as a response
      res.status(200).json(record);
    } catch (err: unknown) {
      // Handle unexpected errors safely
      res.status(500).json({
        message: "Failed to reject record",
        error: (err as Error).message || "Unknown error",
      });
    }
  };


  export const deleteOperationRecord = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      // Validate ID
      if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }
  
      // Find and delete the operation record
      const record = await OperationRecord.findByIdAndDelete(id);
      if (!record) {
        res.status(404).json({ message: "Operation record not found" });
        return;
      }
  
      res.status(200).json({ message: "Operation record deleted successfully", record });
    } catch (err: unknown) {
      res.status(500).json({
        message: "Failed to delete operation record",
        error: (err as Error).message || "Unknown error",
      });
    }
  };