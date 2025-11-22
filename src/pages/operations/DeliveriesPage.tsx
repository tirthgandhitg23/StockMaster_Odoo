import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { CreateDeliveryModal } from "@/components/modals/CreateDeliveryModal";
import { mockDeliveryOrders } from "@/data/mockData";
import { DeliveryOrder } from "@/types";
import { Badge } from "@/components/ui/badge";

export const DeliveriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<(DeliveryOrder & { step?: "draft" | "picked" | "packed" | "completed" })[]>(
    mockDeliveryOrders.map((o) => ({
      ...o,
      step: o.status === "completed" ? "completed" : o.status === "waiting" ? "packed" : "draft",
    }))
  );

  const getStatusBadge = (statusOrStep: string) => {
    // Normalize to status values for badge rendering
    const norm = statusOrStep === "picked" ? "waiting" : statusOrStep === "packed" ? "waiting" : statusOrStep;
    const variants: Record<string, JSX.Element> = {
      draft: <Badge className="bg-status-draft text-foreground">Draft</Badge>,
      waiting: <Badge className="bg-status-pending text-warning-foreground">Waiting</Badge>,
      completed: <Badge className="bg-status-completed text-success-foreground">Completed</Badge>,
    };
    return variants[norm] ?? <Badge className="bg-muted text-foreground">N/A</Badge>;
  };

  const updateOrderStep = (id: string, newStep: "draft" | "picked" | "packed" | "completed") => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              step: newStep,
              status: newStep === "completed" ? "completed" : newStep === "draft" ? "draft" : "waiting",
            }
          : o
      )
    );
  };

  const columns = [
    { header: "Order No", accessor: "orderNo" as const },
    { header: "Customer", accessor: (item: DeliveryOrder) => item.customerName || "N/A" },
    { header: "Date", accessor: (item: DeliveryOrder) => new Date(item.date).toLocaleDateString() },
    { header: "Items", accessor: (item: DeliveryOrder) => item.items.length },
    { header: "Status", accessor: (item: DeliveryOrder & { step?: string }) => getStatusBadge(item.step ?? item.status) },
    {
      header: "Actions",
      accessor: (item: DeliveryOrder & { step?: string }) => {
        const step = item.step ?? item.status;
        const disabledPick = step !== "draft";
        const disabledPack = step !== "picked";
        const disabledValidate = step !== "packed";

        return (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => updateOrderStep(item.id, "picked")} disabled={disabledPick}>
              Pick
            </Button>
            <Button size="sm" variant="ghost" onClick={() => updateOrderStep(item.id, "packed")} disabled={disabledPack}>
              Pack
            </Button>
            <Button size="sm" variant="ghost" onClick={() => updateOrderStep(item.id, "completed")} disabled={disabledValidate}>
              Validate
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Orders (Outgoing Goods)</h1>
          <p className="text-muted-foreground mt-1">Used when stock leaves the warehouse for customer shipment.</p>
          <div className="mt-3 text-sm text-muted-foreground">Example: Sales order for 10 chairs → Delivery order reduces chairs by 10.</div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Delivery
        </Button>
      </div>

      <DataTable data={orders} columns={columns} />

      <CreateDeliveryModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
