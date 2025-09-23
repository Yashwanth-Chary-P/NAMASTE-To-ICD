// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import searchRoutes from "./routes/searchRoutes.js";
import icdRoutes from "./routes/icdRoutes.js";
import siddhaRoutes from "./routes/siddhaRoutes.js";
import ayurvedhaRoutes from "./routes/ayurvedhaRoutes.js"
import unaniRoutes from "./routes/unaniRoutes.js"

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/search", searchRoutes);
app.use("/api/icd", icdRoutes);
app.use("/api/ayurvedha", ayurvedhaRoutes);
app.use("/api/siddha", siddhaRoutes);
app.use("/api/unani", unaniRoutes);

export default app;
