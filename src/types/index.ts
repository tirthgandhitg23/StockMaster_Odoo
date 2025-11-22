// Core types for StockMaster inventory system

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  stockByLocation: Record<string, number>;
  totalStock: number;
  lowStockThreshold?: number;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Receipt {
  id: string;
  receiptNo: string;
  vendorId: string;
  vendorName: string;
  date: string;
  status: 'draft' | 'waiting' | 'completed';
  items: ReceiptItem[];
  notes?: string;
}

export interface ReceiptItem {
  productId: string;
  productName: string;
  quantity: number;
  locationId: string;
}

export interface DeliveryOrder {
  id: string;
  orderNo: string;
  customerName?: string;
  date: string;
  status: 'draft' | 'waiting' | 'completed';
  items: DeliveryItem[];
  notes?: string;
}

export interface DeliveryItem {
  productId: string;
  productName: string;
  quantity: number;
  locationId: string;
}

export interface InternalTransfer {
  id: string;
  transferNo: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  productId: string;
  productName: string;
  quantity: number;
  date: string;
  status: 'pending' | 'completed';
}

export interface StockAdjustment {
  id: string;
  adjustmentNo: string;
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  systemQty: number;
  countedQty: number;
  difference: number;
  date: string;
  reason?: string;
}

export interface MoveHistoryEntry {
  id: string;
  operationType: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  operationNo: string;
  productName: string;
  locationName: string;
  quantity: number;
  date: string;
  status: string;
}

export interface User {
  id: string;
  loginId: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  name?: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  scheduledTransfers: number;
}
