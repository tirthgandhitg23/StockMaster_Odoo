import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { AddLocationModal } from "@/components/modals/AddLocationModal";
import { mockLocations } from "@/data/mockData";
import { Location } from "@/types";

export const LocationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: "Location Name", accessor: "name" as const },
    { header: "Code", accessor: "code" as const },
    { header: "Description", accessor: (item: Location) => item.description || "N/A" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Locations</h1>
          <p className="text-muted-foreground mt-1">Manage warehouse and storage locations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      <DataTable data={mockLocations} columns={columns} />

      <AddLocationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
