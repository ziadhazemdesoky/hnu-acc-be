import express from "express";
import { createOperationMaker, deleteOperationMaker, listOperationMakers, updateOperationMaker } from "../controllers/operationMakerController";
import { authenticateToken } from "../middlewares/authenticateToken";
const router = express.Router();

router.use(authenticateToken)

// Route to create a new operation maker
router.post("/", createOperationMaker);

// Route to list all operation makers
router.get("/", listOperationMakers);

router.delete("/:id", deleteOperationMaker); // Add this line for the delete route
router.put("/:id", updateOperationMaker); // Add this line for the delete route


export default router;
