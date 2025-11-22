import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  TruckIcon,
  ArrowLeftRight,
  Settings as SettingsIcon,
  Users,
  MapPin,
  History,
  ChevronLeft,
  BoxIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
  {
    label: "Operations",
    icon: BoxIcon,
    children: [
      { to: "/operations/receipts", icon: FileText, label: "Receipts" },
      { to: "/operations/deliveries", icon: TruckIcon, label: "Delivery Orders" },
      { to: "/operations/transfers", icon: ArrowLeftRight, label: "Internal Transfers" },
      { to: "/operations/adjustments", icon: SettingsIcon, label: "Stock Adjustments" },
      { to: "/operations/history", icon: History, label: "Move History" },
    ],
  },
  { to: "/vendors", icon: Users, label: "Vendors" },
  { to: "/locations", icon: MapPin, label: "Locations" },
  { to: "/settings", icon: SettingsIcon, label: "Settings" },
];

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">StockMaster</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.label} className="space-y-1">
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground",
                    "font-medium text-sm"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </div>
                {isOpen && (
                  <div className="ml-8 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )
                        }
                      >
                        <child.icon className="h-4 w-4 shrink-0" />
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
