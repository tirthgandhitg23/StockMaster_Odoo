import React, { useMemo, useState } from "react";
import {
  Package,
  AlertTriangle,
  XCircle,
  FileText,
  Truck,
  ArrowLeftRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  mockProducts,
  mockReceipts,
  mockDeliveryOrders,
  mockTransfers,
  mockAdjustments,
  mockLocations,
} from "@/data/mockData";

const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "danger";
}) => {
  const colors = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${colors[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
};

export const DashboardPage = () => {
  // Filters state (single-select dropdowns; "__all" means no filter)
  const [selectedType, setSelectedType] = useState<string>("__all");
  const [selectedStatus, setSelectedStatus] = useState<string>("__all");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // derive available status options dynamically from mock data
  const availableStatuses = useMemo(() => {
    const s = new Set<string>();
    [
      ...mockReceipts,
      ...mockDeliveryOrders,
      ...mockTransfers,
      ...mockAdjustments,
    ].forEach((op: any) => {
      if (op.status) s.add(op.status);
    });
    return Array.from(s);
  }, []);

  const categories = useMemo(
    () =>
      Array.from(new Set(mockProducts.map((p) => p.category).filter(Boolean))),
    []
  );

  // helpers to check if an operation matches filters
  const matchesLocation = (locationId?: string) => {
    if (!selectedLocation) return true;
    if (!locationId) return false;
    return locationId === selectedLocation;
  };

  const matchesStatus = (status?: string) => {
    if (!selectedStatus || selectedStatus === "__all") return true;
    return status ? status === selectedStatus : false;
  };

  // compute filtered KPIs
  const filteredStats = useMemo(() => {
    // Products filtered by category/location
    const products = mockProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedLocation) {
        const qty = p.stockByLocation?.[selectedLocation] ?? 0;
        return qty > 0;
      }
      return true;
    });

    const totalProducts = products.length;
    const lowStock = products.filter(
      (p) =>
        p.lowStockThreshold &&
        p.totalStock < p.lowStockThreshold &&
        p.totalStock > 0
    ).length;
    const outOfStock = products.filter((p) => p.totalStock === 0).length;

    // Receipts
    const receipts = mockReceipts.filter((r) => {
      if (
        selectedType &&
        selectedType !== "__all" &&
        selectedType !== "receipt"
      )
        return false;
      if (!matchesStatus(r.status)) return false;
      if (selectedLocation) {
        return r.items.some((it) => it.locationId === selectedLocation);
      }
      return true;
    });

    const pendingReceipts = receipts.filter(
      (r) => r.status !== "completed"
    ).length;

    // Deliveries
    const deliveries = mockDeliveryOrders.filter((d) => {
      if (
        selectedType &&
        selectedType !== "__all" &&
        selectedType !== "delivery"
      )
        return false;
      if (!matchesStatus(d.status)) return false;
      if (selectedLocation)
        return d.items.some((it) => it.locationId === selectedLocation);
      return true;
    });

    const pendingDeliveries = deliveries.filter(
      (d) => d.status !== "completed"
    ).length;

    // Transfers
    const transfers = mockTransfers.filter((t) => {
      if (
        selectedType &&
        selectedType !== "__all" &&
        selectedType !== "transfer"
      )
        return false;
      if (!matchesStatus(t.status)) return false;
      if (selectedLocation)
        return (
          t.fromLocationId === selectedLocation ||
          t.toLocationId === selectedLocation
        );
      return true;
    });

    const scheduledTransfers = transfers.filter(
      (t) => t.status === "pending"
    ).length;

    return {
      totalProducts,
      lowStock,
      outOfStock,
      pendingReceipts,
      pendingDeliveries,
      scheduledTransfers,
    };
  }, [selectedCategory, selectedLocation, selectedStatus, selectedType]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your inventory operations
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-foreground">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 items-end">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Document Type
              </p>
              <Select onValueChange={(v) => setSelectedType(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedType === "__all"
                      ? "All types"
                      : selectedType === "receipt"
                      ? "Receipts"
                      : selectedType === "delivery"
                      ? "Delivery"
                      : selectedType === "transfer"
                      ? "Internal"
                      : selectedType === "adjustment"
                      ? "Adjustments"
                      : "All types"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All types</SelectItem>
                  <SelectItem value="receipt">Receipts</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="transfer">Internal</SelectItem>
                  <SelectItem value="adjustment">Adjustments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <Select onValueChange={(v) => setSelectedStatus(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedStatus === "__all"
                      ? "All statuses"
                      : selectedStatus}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All statuses</SelectItem>
                  {availableStatuses.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Location / Warehouse
              </p>
              <Select
                onValueChange={(v) =>
                  setSelectedLocation(v === "__all" ? null : v)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedLocation
                      ? mockLocations.find((l) => l.id === selectedLocation)
                          ?.name
                      : "All locations"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All locations</SelectItem>
                  {mockLocations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Product Category
              </p>
              <Select
                onValueChange={(v) =>
                  setSelectedCategory(v === "__all" ? null : v)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedCategory ?? "All categories"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Products in Stock"
          value={filteredStats.totalProducts}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Low Stock Items"
          value={filteredStats.lowStock}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Out of Stock"
          value={filteredStats.outOfStock}
          icon={XCircle}
          variant="danger"
        />
        <StatCard
          title="Pending Receipts"
          value={filteredStats.pendingReceipts}
          icon={FileText}
          variant="default"
        />
        <StatCard
          title="Pending Deliveries"
          value={filteredStats.pendingDeliveries}
          icon={Truck}
          variant="default"
        />
        <StatCard
          title="Scheduled Transfers"
          value={filteredStats.scheduledTransfers}
          icon={ArrowLeftRight}
          variant="default"
        />
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Receipt completed",
                detail: "REC-2024-001 from Global Supplies Co.",
                time: "2 hours ago",
              },
              {
                action: "Delivery pending",
                detail: "DEL-2024-002 for XYZ Industries",
                time: "4 hours ago",
              },
              {
                action: "Internal transfer",
                detail: "TRF-2024-002 scheduled",
                time: "6 hours ago",
              },
              {
                action: "Stock adjustment",
                detail: "ADJ-2024-002 completed",
                time: "1 day ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.detail}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
