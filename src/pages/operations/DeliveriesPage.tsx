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

  const getStatusBadge = (status: DeliveryOrder["status"]) => {
    const variants = {
      draft: <Badge className="bg-status-draft text-foreground">Draft</Badge>,
      waiting: <Badge className="bg-status-pending text-warning-foreground">Waiting</Badge>,
      completed: <Badge className="bg-status-completed text-success-foreground">Completed</Badge>,
    };
    return variants[status];
  };

  const columns = [
    { header: "Order No", accessor: "orderNo" as const },
    { header: "Customer", accessor: (item: DeliveryOrder) => item.customerName || "N/A" },
    { header: "Date", accessor: (item: DeliveryOrder) => new Date(item.date).toLocaleDateString() },
    { header: "Items", accessor: (item: DeliveryOrder) => item.items.length },
    { header: "Status", accessor: (item: DeliveryOrder) => getStatusBadge(item.status) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Orders</h1>
          <p className="text-muted-foreground mt-1">Manage outgoing deliveries</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Delivery
        </Button>
      </div>

      <DataTable data={mockDeliveryOrders} columns={columns} />

      <CreateDeliveryModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
