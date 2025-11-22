import { Router } from "express";
import {
  createReceipt,
  createDelivery,
  createTransfer,
  createAdjustment,
  listHistory,
} from "../controllers/operationController";

const router = Router();

router.post("/receipts", createReceipt);
router.post("/deliveries", createDelivery);
router.post("/transfers", createTransfer);
router.post("/adjustments", createAdjustment);

router.get("/history", listHistory);

export default router;
