import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { CreateTransferModal } from "@/components/modals/CreateTransferModal";
import { mockTransfers } from "@/data/mockData";
import { InternalTransfer } from "@/types";
import { Badge } from "@/components/ui/badge";

export const TransfersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: InternalTransfer["status"]) => {
    const variants = {
      pending: <Badge className="bg-status-pending text-warning-foreground">Pending</Badge>,
      completed: <Badge className="bg-status-completed text-success-foreground">Completed</Badge>,
    };
    return variants[status];
  };

  const columns = [
    { header: "Transfer No", accessor: "transferNo" as const },
    { header: "Product", accessor: "productName" as const },
    { header: "From", accessor: "fromLocationName" as const },
    { header: "To", accessor: "toLocationName" as const },
    { header: "Quantity", accessor: "quantity" as const },
    { header: "Date", accessor: (item: InternalTransfer) => new Date(item.date).toLocaleDateString() },
    { header: "Status", accessor: (item: InternalTransfer) => getStatusBadge(item.status) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Internal Transfers</h1>
          <p className="text-muted-foreground mt-1">Manage stock movements between locations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Transfer
        </Button>
      </div>

      <DataTable data={mockTransfers} columns={columns} />

      <CreateTransferModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
