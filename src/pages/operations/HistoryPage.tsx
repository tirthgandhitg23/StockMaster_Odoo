import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { mockMoveHistory } from "@/data/mockData";
import { MoveHistoryEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [operationType, setOperationType] = useState<string>("all");
  const [history, setHistory] = useState<any[]>(mockMoveHistory);

  useEffect(() => {
    const API_BASE =
      (import.meta.env && (import.meta.env.VITE_API_URL as string)) ||
      `http://${window.location.hostname}:5000`;
    fetch(`${API_BASE}/api/operations/history`)
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) setHistory(list as any[]);
      })
      .catch(() => {});
  }, []);

  const filteredHistory = history.filter((entry) => {
    const prodName =
      entry.items && entry.items[0] && entry.items[0].product
        ? entry.items[0].product.name || ""
        : "";
    const locName =
      entry.items && entry.items[0] && entry.items[0].location
        ? entry.items[0].location.name || ""
        : "";
    const matchesSearch =
      prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.referenceNo || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      locName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = operationType === "all" || entry.type === operationType;

    return matchesSearch && matchesType;
  });

  const getOperationBadge = (type: string) => {
    const variants: Record<string, JSX.Element> = {
      receipt: <Badge className="bg-primary/20 text-primary">Receipt</Badge>,
      delivery: <Badge className="bg-success/20 text-success">Delivery</Badge>,
      transfer: <Badge className="bg-chart-4/20 text-chart-4">Transfer</Badge>,
      adjustment: (
        <Badge className="bg-warning/20 text-warning">Adjustment</Badge>
      ),
    };
    return (
      variants[type] ?? <Badge className="bg-muted text-foreground">N/A</Badge>
    );
  };

  const columns = [
    {
      header: "Date",
      accessor: (item: any) =>
        new Date(item.date || item.createdAt).toLocaleDateString(),
    },
    { header: "Type", accessor: (item: any) => getOperationBadge(item.type) },
    {
      header: "Operation No",
      accessor: (item: any) => item.referenceNo || "-",
    },
    {
      header: "Product",
      accessor: (item: any) =>
        item.items && item.items[0] && item.items[0].product
          ? item.items[0].product.name || "-"
          : "-",
    },
    {
      header: "Location",
      accessor: (item: any) =>
        item.items && item.items[0] && item.items[0].location
          ? item.items[0].location.name || "-"
          : "-",
    },
    {
      header: "Quantity",
      accessor: (item: any) => {
        const qty = item.items && item.items[0] ? item.items[0].quantity : 0;
        const display = item.type === "delivery" ? -qty : qty;
        return (
          <span
            className={
              display > 0
                ? "text-success"
                : display < 0
                ? "text-destructive"
                : "text-foreground"
            }
          >
            {display > 0 ? "+" : ""}
            {display}
          </span>
        );
      },
    },
    { header: "Status", accessor: (item: any) => item.status || "-" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Move History</h1>
        <p className="text-muted-foreground mt-1">
          Track all inventory movements
        </p>
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
