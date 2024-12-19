import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { initializeCounters } from "./utils/initializeCounters";
import authRoutes from "./routes/authRoutes";
import operationCodeRoutes from "./routes/operationCodeRoutes";
import operationRecordRoutes from "./routes/operationRecordRoutes";
import operationMakerRoutes from "./routes/operationMakerRoutes";
import reportsRoutes from "./routes/reportRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // If you need to send cookies
  }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/operation-codes", operationCodeRoutes);
app.use("/api/operation-makers", operationMakerRoutes);
app.use("/api/operation-records", operationRecordRoutes);
app.use("/api/reports", reportsRoutes);


const startApp = async () => {
  await mongoose.connect(process.env.MONGO_URI || "");
  await initializeCounters();
  console.log("Connected to MongoDB and initialized counters.");
};

startApp();


export default app;
