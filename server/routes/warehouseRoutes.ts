import { Router } from "express";
import Warehouse from "../models/Warehouse";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const list = await Warehouse.find().select("name location");
    res.status(200).json(list);
  } catch (err) {
    console.error("Error fetching warehouses", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
