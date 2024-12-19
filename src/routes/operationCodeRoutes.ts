import express from "express";
import { createOperationCode, listOperationCodes } from "../controllers/operationCodeController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.use(authenticateToken);
router.post("/", createOperationCode);
router.get("/", listOperationCodes);

export default router;
