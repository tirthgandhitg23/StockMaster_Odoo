import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { AddVendorModal } from "@/components/modals/AddVendorModal";
import { mockVendors } from "@/data/mockData";
import { Vendor } from "@/types";

export const VendorsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: "Vendor Name", accessor: "name" as const },
    { header: "Phone", accessor: "phone" as const },
    { header: "Email", accessor: (item: Vendor) => item.email || "N/A" },
    { header: "Address", accessor: "address" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground mt-1">Manage your supplier relationships</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <DataTable data={mockVendors} columns={columns} />

      <AddVendorModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
