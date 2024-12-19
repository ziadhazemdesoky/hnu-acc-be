import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createOperationRecord, approveOperationRecord, getOperationRecords, deleteOperationRecord, refuseOperationRecord } from "../controllers/operationRecordController";
const router = express.Router();

router.use(authenticateToken)
router.get('/', getOperationRecords);
router.post("/", createOperationRecord);
router.put("/:id/approve", approveOperationRecord);
router.put("/:id/refuse", refuseOperationRecord);

router.delete("/:id", deleteOperationRecord);

export default router;
