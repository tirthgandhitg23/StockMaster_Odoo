// server/controllers/productController.ts

import { Request, Response } from "express";
import Product, { IProduct, IStockLocation } from "../models/Product";
import Transaction, { ITransaction } from "../models/Transaction";
import mongoose, { Types } from "mongoose";
import Warehouse from "../models/Warehouse"; // Needed for reference/validation

// --- Type Definitions for Request Bodies ---

// Base interface for creating a product
interface CreateProductBody {
  sku: string;
  name: string;
  description?: string;
  category: string; // Can be ObjectId string or a category name
  unitPrice: number;
  reorderPoint: number;
  initialStock?: number;
  warehouseId?: string; // optional preferred warehouse for initial stock
}

// Interface for creating a new transaction
interface NewTransactionRequestBody {
  type: "IN" | "OUT" | "ADJUST" | "TRANSFER";
  productId: string; // ID of the product
  warehouseId: string; // ID of the source/destination warehouse
  quantity: number;
  notes?: string;
  userId: string; // ID of the user performing the action (should come from Auth Middleware)
}

// --- Controller Functions ---

/**
 * Creates a new product entry in the database.
 */
export const createProduct = async (
  req: Request<{}, {}, CreateProductBody>,
  res: Response
): Promise<void> => {
  const {
    sku,
    name,
    description,
    category,
    unitPrice,
    reorderPoint,
    initialStock,
    warehouseId,
  } = req.body;

  if (!sku || !name || !category || !unitPrice) {
    res
      .status(400)
      .json({
        message:
          "Missing required fields: SKU, Name, Category, and Unit Price.",
      });
    return;
  }

  try {
    // Simple check to ensure product doesn't already exist
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      res
        .status(409)
        .json({ message: `Product with SKU ${sku} already exists.` });
      return;
    }

    // Determine category ID: accept either an ObjectId string or a category name
    let categoryId: Types.ObjectId;
    if (Types.ObjectId.isValid(category)) {
      categoryId = new Types.ObjectId(category);
    } else {
      // Try to find category by name, otherwise create it
      const CategoryModel = (await import("../models/Category")).default;
      let found = await CategoryModel.findOne({ name: category });
      if (!found) {
        found = new CategoryModel({ name: category });
        await found.save();
      }
      categoryId = found._id;
    }

    const productData: any = {
      sku,
      name,
      description,
      category: categoryId,
      unitPrice,
      reorderPoint,
    };

    // Handle initial stock (optional)
    if (initialStock && initialStock > 0) {
      // Resolve warehouseId: use provided, else try to find a default warehouse, else create one
      let targetWarehouseId: Types.ObjectId | null = null;
      if (warehouseId && Types.ObjectId.isValid(warehouseId)) {
        targetWarehouseId = new Types.ObjectId(warehouseId);
      } else {
        const existing = await Warehouse.findOne();
        if (existing) {
          targetWarehouseId = existing._id;
        } else {
          const created = new Warehouse({
            name: "Main Warehouse",
            location: "Default",
          });
          await created.save();
          targetWarehouseId = created._id;
        }
      }

      productData.stockLocations = [
        { warehouseId: targetWarehouseId, quantity: initialStock },
      ];
    } else {
      productData.stockLocations = [];
    }

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Server error while creating product.",
      details: (error as Error).message, // Display Mongoose validation errors
    });
  }
};

/**
 * Fetches all products and calculates the total stock across all warehouses.
 */
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Use .populate() to get Category and Warehouse details
    const products = await Product.find()
      .populate("category", "name") // Only fetch the name from Category
      .populate("stockLocations.warehouseId", "name location"); // Fetch name/location from Warehouse

    // Map over products to calculate total stock (useful for UI display)
    const productsWithTotalStock = products.map((product) => {
      const totalStock = product.stockLocations.reduce(
        (sum, location) => sum + location.quantity,
        0
      );
      return {
        ...product.toObject(), // Convert Mongoose document to plain JS object
        totalStock,
      };
    });

    res.status(200).json(productsWithTotalStock);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};

/**
 * Handles the creation of a new stock transaction and updates the product inventory
 * in the specified warehouse using atomic operations.
 * This function is critical for dynamic and real-time data updates.
 */
export const createTransaction = async (
  req: Request<{}, {}, NewTransactionRequestBody>,
  res: Response
): Promise<void> => {
  const { type, productId, warehouseId, quantity, notes, userId } = req.body;

  // --- Robust Input Validation (Required Fields) ---
  if (!type || !productId || !warehouseId || !quantity || !userId) {
    res.status(400).json({ message: "Missing required transaction fields." });
    return;
  }
  if (quantity <= 0) {
    res.status(400).json({ message: "Quantity must be a positive number." });
    return;
  }

  // Determine the change in stock quantity (e.g., IN=+10, OUT=-10)
  let stockChange: number;
  switch (type) {
    case "IN":
    case "ADJUST": // For simplicity, we treat ADJUST like IN for now
      stockChange = quantity;
      break;
    case "OUT":
      stockChange = -quantity;
      break;
    case "TRANSFER":
      // TRANSFER requires two transactions/updates: OUT from source, IN to destination.
      // We won't implement full TRANSFER here but reserve the type.
      res
        .status(400)
        .json({
          message:
            "TRANSFER type requires specific multi-step logic not yet implemented.",
        });
      return;
    default:
      res.status(400).json({ message: "Invalid transaction type." });
      return;
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    // --- Multi-Warehouse Pre-Check (Preventing Negative Stock) ---
    const stockLocation = product.stockLocations.find(
      (loc) => loc.warehouseId.toString() === warehouseId
    );
    const currentStock = stockLocation ? stockLocation.quantity : 0;

    if (type === "OUT" && currentStock + stockChange < 0) {
      res.status(400).json({
        message: `Insufficient stock at warehouse ID ${warehouseId}. Current stock: ${currentStock}`,
      });
      return;
    }

    // --- Atomic Stock Update Logic (Multi-Warehouse) ---

    // 1. First, ensure the warehouse entry exists in the stockLocations array.
    if (!stockLocation) {
      // If the warehouse is new to this product, add it to the array.
      await Product.findByIdAndUpdate(productId, {
        $addToSet: {
          // $addToSet prevents adding duplicates if it somehow already existed
          stockLocations: {
            warehouseId: new Types.ObjectId(warehouseId),
            quantity: 0, // Start quantity at 0 before the main update
          },
        },
      });
    }

    // 2. Atomically update the quantity in the specific warehouse entry.
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        // $inc updates the quantity field within the nested array that matches the filter criteria
        $inc: { "stockLocations.$[elem].quantity": stockChange },
      },
      {
        new: true,
        runValidators: true,
        // Array filter: find the element ('elem') in stockLocations where warehouseId matches
        arrayFilters: [{ "elem.warehouseId": new Types.ObjectId(warehouseId) }],
      }
    ).populate("stockLocations.warehouseId", "name");

    // --- Create Transaction Record ---
    const newTransaction = new Transaction({
      type,
      product: new Types.ObjectId(productId),
      warehouseId: new Types.ObjectId(warehouseId),
      quantity,
      notes,
      user: new Types.ObjectId(userId),
      timestamp: new Date(),
    });

    await newTransaction.save();

    res.status(201).json({
      message: "Transaction successfully processed and stock updated.",
      transaction: newTransaction,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({
      message: "Server error during transaction processing.",
      details: (error as Error).message,
    });
  }
};

// ... You will add more controller functions here (e.g., for Categories, Warehouses, Auth)
