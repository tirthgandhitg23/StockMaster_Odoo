import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { CreateAdjustmentModal } from "@/components/modals/CreateAdjustmentModal";
import { mockAdjustments } from "@/data/mockData";
import { StockAdjustment } from "@/types";

export const AdjustmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: "Adjustment No", accessor: "adjustmentNo" as const },
    { header: "Product", accessor: "productName" as const },
    { header: "Location", accessor: "locationName" as const },
    { header: "System Qty", accessor: "systemQty" as const },
    { header: "Counted Qty", accessor: "countedQty" as const },
    {
      header: "Difference",
      accessor: (item: StockAdjustment) => (
        <span className={item.difference > 0 ? "text-success" : item.difference < 0 ? "text-destructive" : "text-foreground"}>
          {item.difference > 0 ? "+" : ""}{item.difference}
        </span>
      ),
    },
    { header: "Date", accessor: (item: StockAdjustment) => new Date(item.date).toLocaleDateString() },
    { header: "Reason", accessor: (item: StockAdjustment) => item.reason || "-" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Adjustments</h1>
          <p className="text-muted-foreground mt-1">Record inventory count variances</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Adjust Stock
        </Button>
      </div>

      <DataTable data={mockAdjustments} columns={columns} />

      <CreateAdjustmentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
