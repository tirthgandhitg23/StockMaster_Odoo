import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { mockMoveHistory } from "@/data/mockData";
import { MoveHistoryEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [operationType, setOperationType] = useState<string>("all");

  const filteredHistory = mockMoveHistory.filter((entry) => {
    const matchesSearch =
      entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.operationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.locationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = operationType === "all" || entry.operationType === operationType;

    return matchesSearch && matchesType;
  });

  const getOperationBadge = (type: MoveHistoryEntry["operationType"]) => {
    const variants = {
      receipt: <Badge className="bg-primary/20 text-primary">Receipt</Badge>,
      delivery: <Badge className="bg-success/20 text-success">Delivery</Badge>,
      transfer: <Badge className="bg-chart-4/20 text-chart-4">Transfer</Badge>,
      adjustment: <Badge className="bg-warning/20 text-warning">Adjustment</Badge>,
    };
    return variants[type];
  };

  const columns = [
    { header: "Date", accessor: (item: MoveHistoryEntry) => new Date(item.date).toLocaleDateString() },
    { header: "Type", accessor: (item: MoveHistoryEntry) => getOperationBadge(item.operationType) },
    { header: "Operation No", accessor: "operationNo" as const },
    { header: "Product", accessor: "productName" as const },
    { header: "Location", accessor: "locationName" as const },
    {
      header: "Quantity",
      accessor: (item: MoveHistoryEntry) => (
        <span className={item.quantity > 0 ? "text-success" : item.quantity < 0 ? "text-destructive" : "text-foreground"}>
          {item.quantity > 0 ? "+" : ""}{item.quantity}
        </span>
      ),
    },
    { header: "Status", accessor: "status" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Move History</h1>
        <p className="text-muted-foreground mt-1">Track all inventory movements</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product, operation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input border-border text-foreground"
          />
        </div>
        <Select value={operationType} onValueChange={setOperationType}>
          <SelectTrigger className="w-48 bg-input border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="receipt">Receipts</SelectItem>
            <SelectItem value="delivery">Deliveries</SelectItem>
            <SelectItem value="transfer">Transfers</SelectItem>
            <SelectItem value="adjustment">Adjustments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredHistory} columns={columns} />
    </div>
  );
};
