import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { generateReport } from "../controllers/reportController";

const router = express.Router();

router.use(authenticateToken);

router.get('/approved-records', generateReport)
export default router;
