import type {
  Product,
  Vendor,
  Location,
  Receipt,
  DeliveryOrder,
  InternalTransfer,
  StockAdjustment,
  MoveHistoryEntry,
  DashboardStats,
} from "@/types";

export const mockLocations: Location[] = [
  { id: "loc1", name: "Main Warehouse", code: "WH-01", description: "Primary storage facility" },
  { id: "loc2", name: "Retail Store A", code: "ST-A", description: "Downtown retail location" },
  { id: "loc3", name: "Distribution Center", code: "DC-01", description: "Regional distribution hub" },
];

export const mockVendors: Vendor[] = [
  { id: "ven1", name: "Global Supplies Co.", phone: "+1-555-0101", address: "123 Industrial Blvd", email: "contact@globalsupplies.com" },
  { id: "ven2", name: "Tech Components Ltd", phone: "+1-555-0202", address: "456 Tech Park", email: "sales@techcomponents.com" },
  { id: "ven3", name: "Premium Materials Inc", phone: "+1-555-0303", address: "789 Supply Chain Ave" },
];

export const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Industrial Widget A",
    sku: "IW-001",
    category: "Components",
    unit: "pcs",
    stockByLocation: { loc1: 450, loc2: 120, loc3: 80 },
    totalStock: 650,
    lowStockThreshold: 100,
  },
  {
    id: "prod2",
    name: "Premium Gadget B",
    sku: "PG-002",
    category: "Electronics",
    unit: "pcs",
    stockByLocation: { loc1: 30, loc2: 15, loc3: 5 },
    totalStock: 50,
    lowStockThreshold: 50,
  },
  {
    id: "prod3",
    name: "Standard Tool C",
    sku: "ST-003",
    category: "Tools",
    unit: "pcs",
    stockByLocation: { loc1: 0, loc2: 0, loc3: 0 },
    totalStock: 0,
    lowStockThreshold: 20,
  },
  {
    id: "prod4",
    name: "Quality Material D",
    sku: "QM-004",
    category: "Materials",
    unit: "kg",
    stockByLocation: { loc1: 1200, loc2: 300, loc3: 450 },
    totalStock: 1950,
  },
  {
    id: "prod5",
    name: "Specialized Part E",
    sku: "SP-005",
    category: "Components",
    unit: "pcs",
    stockByLocation: { loc1: 85, loc2: 40, loc3: 25 },
    totalStock: 150,
    lowStockThreshold: 100,
  },
];

export const mockReceipts: Receipt[] = [
  {
    id: "rec1",
    receiptNo: "REC-2024-001",
    vendorId: "ven1",
    vendorName: "Global Supplies Co.",
    date: "2024-01-15",
    status: "completed",
    items: [
      { productId: "prod1", productName: "Industrial Widget A", quantity: 100, locationId: "loc1" },
      { productId: "prod4", productName: "Quality Material D", quantity: 500, locationId: "loc1" },
    ],
    notes: "Delivery completed on time",
  },
  {
    id: "rec2",
    receiptNo: "REC-2024-002",
    vendorId: "ven2",
    vendorName: "Tech Components Ltd",
    date: "2024-01-20",
    status: "waiting",
    items: [
      { productId: "prod2", productName: "Premium Gadget B", quantity: 50, locationId: "loc1" },
    ],
  },
  {
    id: "rec3",
    receiptNo: "REC-2024-003",
    vendorId: "ven3",
    vendorName: "Premium Materials Inc",
    date: "2024-01-22",
    status: "draft",
    items: [
      { productId: "prod3", productName: "Standard Tool C", quantity: 30, locationId: "loc1" },
    ],
  },
];

export const mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: "del1",
    orderNo: "DEL-2024-001",
    customerName: "ABC Manufacturing",
    date: "2024-01-18",
    status: "completed",
    items: [
      { productId: "prod1", productName: "Industrial Widget A", quantity: 50, locationId: "loc2" },
    ],
  },
  {
    id: "del2",
    orderNo: "DEL-2024-002",
    customerName: "XYZ Industries",
    date: "2024-01-21",
    status: "waiting",
    items: [
      { productId: "prod4", productName: "Quality Material D", quantity: 200, locationId: "loc1" },
      { productId: "prod5", productName: "Specialized Part E", quantity: 25, locationId: "loc1" },
    ],
  },
];

export const mockTransfers: InternalTransfer[] = [
  {
    id: "trans1",
    transferNo: "TRF-2024-001",
    fromLocationId: "loc1",
    fromLocationName: "Main Warehouse",
    toLocationId: "loc2",
    toLocationName: "Retail Store A",
    productId: "prod1",
    productName: "Industrial Widget A",
    quantity: 50,
    date: "2024-01-16",
    status: "completed",
  },
  {
    id: "trans2",
    transferNo: "TRF-2024-002",
    fromLocationId: "loc1",
    fromLocationName: "Main Warehouse",
    toLocationId: "loc3",
    toLocationName: "Distribution Center",
    productId: "prod4",
    productName: "Quality Material D",
    quantity: 150,
    date: "2024-01-23",
    status: "pending",
  },
];

export const mockAdjustments: StockAdjustment[] = [
  {
    id: "adj1",
    adjustmentNo: "ADJ-2024-001",
    productId: "prod1",
    productName: "Industrial Widget A",
    locationId: "loc1",
    locationName: "Main Warehouse",
    systemQty: 450,
    countedQty: 445,
    difference: -5,
    date: "2024-01-10",
    reason: "Physical count variance",
  },
  {
    id: "adj2",
    adjustmentNo: "ADJ-2024-002",
    productId: "prod5",
    productName: "Specialized Part E",
    locationId: "loc2",
    locationName: "Retail Store A",
    systemQty: 40,
    countedQty: 42,
    difference: 2,
    date: "2024-01-19",
    reason: "Found additional units during inspection",
  },
];

export const mockMoveHistory: MoveHistoryEntry[] = [
  {
    id: "move1",
    operationType: "receipt",
    operationNo: "REC-2024-001",
    productName: "Industrial Widget A",
    locationName: "Main Warehouse",
    quantity: 100,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "move2",
    operationType: "delivery",
    operationNo: "DEL-2024-001",
    productName: "Industrial Widget A",
    locationName: "Retail Store A",
    quantity: -50,
    date: "2024-01-18",
    status: "completed",
  },
  {
    id: "move3",
    operationType: "transfer",
    operationNo: "TRF-2024-001",
    productName: "Industrial Widget A",
    locationName: "Main Warehouse → Retail Store A",
    quantity: 50,
    date: "2024-01-16",
    status: "completed",
  },
  {
    id: "move4",
    operationType: "adjustment",
    operationNo: "ADJ-2024-001",
    productName: "Industrial Widget A",
    locationName: "Main Warehouse",
    quantity: -5,
    date: "2024-01-10",
    status: "completed",
  },
];

export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  lowStock: mockProducts.filter((p) => p.lowStockThreshold && p.totalStock < p.lowStockThreshold && p.totalStock > 0).length,
  outOfStock: mockProducts.filter((p) => p.totalStock === 0).length,
  pendingReceipts: mockReceipts.filter((r) => r.status !== "completed").length,
  pendingDeliveries: mockDeliveryOrders.filter((d) => d.status !== "completed").length,
  scheduledTransfers: mockTransfers.filter((t) => t.status === "pending").length,
};
