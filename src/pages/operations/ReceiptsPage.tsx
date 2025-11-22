import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { CreateReceiptModal } from "@/components/modals/CreateReceiptModal";
import { mockReceipts } from "@/data/mockData";
import { Receipt } from "@/types";
import { Badge } from "@/components/ui/badge";

export const ReceiptsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: Receipt["status"]) => {
    const variants = {
      draft: <Badge className="bg-status-draft text-foreground">Draft</Badge>,
      waiting: <Badge className="bg-status-pending text-warning-foreground">Waiting</Badge>,
      completed: <Badge className="bg-status-completed text-success-foreground">Completed</Badge>,
    };
    return variants[status];
  };

  const columns = [
    { header: "Receipt No", accessor: "receiptNo" as const },
    { header: "Vendor", accessor: "vendorName" as const },
    { header: "Date", accessor: (item: Receipt) => new Date(item.date).toLocaleDateString() },
    { header: "Items", accessor: (item: Receipt) => item.items.length },
    { header: "Status", accessor: (item: Receipt) => getStatusBadge(item.status) },
    { header: "Notes", accessor: (item: Receipt) => item.notes || "-" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receipts</h1>
          <p className="text-muted-foreground mt-1">Manage incoming goods and deliveries</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Receipt
        </Button>
      </div>

      <DataTable data={mockReceipts} columns={columns} />

      <CreateReceiptModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
