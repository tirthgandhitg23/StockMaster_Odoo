import { Package, AlertTriangle, XCircle, FileText, Truck, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDashboardStats } from "@/data/mockData";

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
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colors[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
};

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your inventory operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Products in Stock"
          value={mockDashboardStats.totalProducts}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Low Stock Items"
          value={mockDashboardStats.lowStock}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Out of Stock"
          value={mockDashboardStats.outOfStock}
          icon={XCircle}
          variant="danger"
        />
        <StatCard
          title="Pending Receipts"
          value={mockDashboardStats.pendingReceipts}
          icon={FileText}
          variant="default"
        />
        <StatCard
          title="Pending Deliveries"
          value={mockDashboardStats.pendingDeliveries}
          icon={Truck}
          variant="default"
        />
        <StatCard
          title="Scheduled Transfers"
          value={mockDashboardStats.scheduledTransfers}
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
              { action: "Receipt completed", detail: "REC-2024-001 from Global Supplies Co.", time: "2 hours ago" },
              { action: "Delivery pending", detail: "DEL-2024-002 for XYZ Industries", time: "4 hours ago" },
              { action: "Internal transfer", detail: "TRF-2024-002 scheduled", time: "6 hours ago" },
              { action: "Stock adjustment", detail: "ADJ-2024-002 completed", time: "1 day ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
