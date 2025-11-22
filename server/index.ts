// server/index.ts
import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors"; // Required for connecting frontend to backend
import { connectDB } from "./db/connection";
import productRoutes from "./routes/productRoutes";
import operationRoutes from "./routes/operationRoutes";
import warehouseRoutes from "./routes/warehouseRoutes";

// Load environment variables from the root .env file
// Note: You must ensure this path is correct if your setup differs.
dotenv.config({ path: "./.env" });

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);

// --- Middleware ---
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Body parser for JSON requests

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/warehouses", warehouseRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("StockMaster Backend API is running.");
});

// --- Server & DB Startup ---
const startServer = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Start Express server
  app.listen(PORT, () => {
    console.log(`⚡️ Server is listening on port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
  });
};

startServer();
