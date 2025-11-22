import { Request, Response } from "express";
import Operation from "../models/Operation";
import Vendor from "../models/Vendor";
import Product from "../models/Product";
import Warehouse from "../models/Warehouse";
import Transaction from "../models/Transaction";
import mongoose, { Types } from "mongoose";

// Helper to generate a simple reference number (incremental-ish with timestamp)
const genRef = (prefix: string) =>
  `${prefix.toUpperCase()}-${Date.now().toString().slice(-8)}`;

// Create Receipt: records operation, optionally creates vendor, and if status is completed, creates IN transactions
export const createReceipt = async (req: Request, res: Response) => {
  try {
    const { vendor, date, items, notes, status } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Receipt must include items." });
    }

    // vendor may be an id or a name
    let vendorId = undefined;
    if (vendor) {
      if (Types.ObjectId.isValid(vendor)) vendorId = vendor;
      else {
        let v = await Vendor.findOne({ name: vendor });
        if (!v) v = await Vendor.create({ name: vendor });
        vendorId = v._id;
      }
    }

    const op = await Operation.create({
      type: "receipt",
      referenceNo: genRef("REC"),
      vendor: vendorId || vendor || null,
      items: items.map((it: any) => ({
        product: it.productId,
        quantity: it.quantity,
        location: it.locationId,
      })),
      notes,
      status: status || "waiting",
      date: date ? new Date(date) : new Date(),
    });

    // If the receipt is completed, create IN transactions and update product stock
    if ((status || "waiting") === "completed") {
      for (const it of items) {
        // create transaction and update product stock using transaction controller logic
        const warehouseId = Types.ObjectId.isValid(it.locationId)
          ? it.locationId
          : undefined;
        // Attempt to find warehouse if provided by name
        let resolvedWarehouseId = warehouseId;
        if (!resolvedWarehouseId && it.locationName) {
          const w = await Warehouse.findOne({ name: it.locationName });
          if (w) resolvedWarehouseId = w._id;
        }

        if (!resolvedWarehouseId) {
          // fallback to first warehouse or create one
          let first = await Warehouse.findOne();
          if (!first)
            first = await Warehouse.create({
              name: "Main Warehouse",
              location: "Default",
            });
          resolvedWarehouseId = first._id;
        }

        // Update product stock (add location entry if missing) and create Transaction
        const product = await Product.findById(it.productId);
        if (!product) continue;

        const loc = product.stockLocations.find(
          (l) => l.warehouseId.toString() === resolvedWarehouseId.toString()
        );
        if (!loc) {
          product.stockLocations.push({
            warehouseId: resolvedWarehouseId,
            quantity: it.quantity,
          });
        } else {
          loc.quantity += it.quantity;
        }
        await product.save();

        const tx = new Transaction({
          type: "IN",
          product: product._id,
          warehouseId: resolvedWarehouseId,
          quantity: it.quantity,
          notes: notes || "Receipt completed",
          user: req.body.userId
            ? new Types.ObjectId(req.body.userId)
            : undefined,
        });
        await tx.save();
      }
    }

    return res
      .status(201)
      .json({ message: "Receipt recorded.", operation: op });
  } catch (error) {
    console.error("createReceipt error", error);
    return res
      .status(500)
      .json({
        message: "Server error creating receipt.",
        details: (error as Error).message,
      });
  }
};

// Create Delivery: records operation and if completed, creates OUT transactions
export const createDelivery = async (req: Request, res: Response) => {
  try {
    const { customerName, date, items, notes, status } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Delivery must include items." });
    }

    const op = await Operation.create({
      type: "delivery",
      referenceNo: genRef("DEL"),
      customerName: customerName || null,
      items: items.map((it: any) => ({
        product: it.productId,
        quantity: it.quantity,
        location: it.locationId,
      })),
      notes,
      status: status || "waiting",
      date: date ? new Date(date) : new Date(),
    });

    if ((status || "waiting") === "completed") {
      for (const it of items) {
        let resolvedWarehouseId = Types.ObjectId.isValid(it.locationId)
          ? it.locationId
          : undefined;
        if (!resolvedWarehouseId && it.locationName) {
          const w = await Warehouse.findOne({ name: it.locationName });
          if (w) resolvedWarehouseId = w._id;
        }
        if (!resolvedWarehouseId) {
          let first = await Warehouse.findOne();
          if (!first)
            first = await Warehouse.create({
              name: "Main Warehouse",
              location: "Default",
            });
          resolvedWarehouseId = first._id;
        }

        const product = await Product.findById(it.productId);
        if (!product) continue;

        const loc = product.stockLocations.find(
          (l) => l.warehouseId.toString() === resolvedWarehouseId.toString()
        );
        const currentQty = loc ? loc.quantity : 0;
        if (currentQty < it.quantity) {
          // skip or clamp - here we return error to caller
          return res
            .status(400)
            .json({
              message: `Insufficient stock for product ${product._id} at warehouse ${resolvedWarehouseId}`,
            });
        }
        if (loc) loc.quantity -= it.quantity;
        else
          product.stockLocations.push({
            warehouseId: resolvedWarehouseId,
            quantity: 0 - it.quantity,
          });
        await product.save();

        const tx = new Transaction({
          type: "OUT",
          product: product._id,
          warehouseId: resolvedWarehouseId,
          quantity: it.quantity,
          notes: notes || "Delivery completed",
          user: req.body.userId
            ? new Types.ObjectId(req.body.userId)
            : undefined,
        });
        await tx.save();
      }
    }

    return res
      .status(201)
      .json({ message: "Delivery recorded.", operation: op });
  } catch (error) {
    console.error("createDelivery error", error);
    return res
      .status(500)
      .json({
        message: "Server error creating delivery.",
        details: (error as Error).message,
      });
  }
};

// Create Transfer: records transfer and applies OUT and IN atomically per item
export const createTransfer = async (req: Request, res: Response) => {
  try {
    const {
      fromLocationId,
      toLocationId,
      productId,
      quantity,
      date,
      notes,
      status,
    } = req.body;
    if (!fromLocationId || !toLocationId || !productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Missing required transfer fields." });
    }

    const op = await Operation.create({
      type: "transfer",
      referenceNo: genRef("TRF"),
      items: [
        {
          product: productId,
          quantity,
          fromLocation: fromLocationId,
          toLocation: toLocationId,
        },
      ],
      notes,
      status: status || "pending",
      date: date ? new Date(date) : new Date(),
    });

    // Apply now if completed
    if ((status || "pending") === "completed") {
      // OUT from source
      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found." });

      const fromLoc = product.stockLocations.find(
        (l) => l.warehouseId.toString() === fromLocationId
      );
      const fromQty = fromLoc ? fromLoc.quantity : 0;
      if (fromQty < quantity)
        return res
          .status(400)
          .json({ message: "Insufficient stock at source." });
      if (fromLoc) fromLoc.quantity -= quantity;
      else
        product.stockLocations.push({
          warehouseId: fromLocationId,
          quantity: -quantity,
        });

      // IN to destination
      const toLoc = product.stockLocations.find(
        (l) => l.warehouseId.toString() === toLocationId
      );
      if (toLoc) toLoc.quantity += quantity;
      else product.stockLocations.push({ warehouseId: toLocationId, quantity });

      await product.save();

      await Transaction.create({
        type: "OUT",
        product: product._id,
        warehouseId: fromLocationId,
        quantity,
        notes: notes || "Transfer out",
        user: req.body.userId ? new Types.ObjectId(req.body.userId) : undefined,
      });
      await Transaction.create({
        type: "IN",
        product: product._id,
        warehouseId: toLocationId,
        quantity,
        notes: notes || "Transfer in",
        user: req.body.userId ? new Types.ObjectId(req.body.userId) : undefined,
      });
    }

    return res
      .status(201)
      .json({ message: "Transfer recorded.", operation: op });
  } catch (error) {
    console.error("createTransfer error", error);
    return res
      .status(500)
      .json({
        message: "Server error creating transfer.",
        details: (error as Error).message,
      });
  }
};

// Create Adjustment: records adjustment and applies ADJUST transaction
export const createAdjustment = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      locationId,
      systemQty,
      countedQty,
      reason,
      date,
      status,
    } = req.body;
    if (!productId || !locationId || typeof countedQty === "undefined") {
      return res
        .status(400)
        .json({ message: "Missing required adjustment fields." });
    }

    const difference = Number(countedQty) - Number(systemQty || 0);

    const op = await Operation.create({
      type: "adjustment",
      referenceNo: genRef("ADJ"),
      items: [
        {
          product: productId,
          quantity: Math.abs(difference),
          location: locationId,
        },
      ],
      notes: reason,
      status: status || "completed",
      date: date ? new Date(date) : new Date(),
    });

    // Apply adjustment
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    const loc = product.stockLocations.find(
      (l) => l.warehouseId.toString() === locationId
    );
    if (!loc) {
      product.stockLocations.push({
        warehouseId: locationId,
        quantity: countedQty,
      });
    } else {
      loc.quantity = countedQty;
    }
    await product.save();

    await Transaction.create({
      type: "ADJUST",
      product: product._id,
      warehouseId: locationId,
      quantity: Math.abs(difference),
      notes: reason || "Stock adjustment",
      user: req.body.userId ? new Types.ObjectId(req.body.userId) : undefined,
    });

    return res
      .status(201)
      .json({ message: "Adjustment recorded.", operation: op });
  } catch (error) {
    console.error("createAdjustment error", error);
    return res
      .status(500)
      .json({
        message: "Server error creating adjustment.",
        details: (error as Error).message,
      });
  }
};

export const listHistory = async (req: Request, res: Response) => {
  try {
    const ops = await Operation.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("items.product", "name sku")
      .populate("items.location", "name");
    return res.status(200).json(ops);
  } catch (error) {
    console.error("listHistory error", error);
    return res.status(500).json({ message: "Server error fetching history." });
  }
};
