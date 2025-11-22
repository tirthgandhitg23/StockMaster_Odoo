import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockProducts, mockLocations } from "@/data/mockData";

interface DeliveryItem {
  productId: string;
  quantity: number;
  locationId: string;
}

interface CreateDeliveryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateDeliveryModal = ({
  open,
  onOpenChange,
}: CreateDeliveryModalProps) => {
  const [customerName, setCustomerName] = useState("");
  const [products, setProducts] = useState<typeof mockProducts>(mockProducts);
  const [locations, setLocations] =
    useState<typeof mockLocations>(mockLocations);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DeliveryItem[]>([
    { productId: "", quantity: 0, locationId: "" },
  ]);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 0, locationId: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof DeliveryItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE =
      (import.meta.env && (import.meta.env.VITE_API_URL as string)) ||
      `http://${window.location.hostname}:5000`;
    const payload = {
      customerName,
      date,
      items: items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        locationId: it.locationId,
      })),
      notes,
      status: "waiting",
    };

    fetch(`${API_BASE}/api/operations/deliveries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const text = await res.text();
        let body: any = null;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          body = null;
        }
        if (!res.ok)
          throw new Error(body?.message || text || `HTTP ${res.status}`);
        return body;
      })
      .then((data) => {
        window.dispatchEvent(
          new CustomEvent("operation:created", { detail: data.operation })
        );
        onOpenChange(false);
      })
      .catch((err) => {
        console.error("Delivery create failed", err);
        alert("Error creating delivery: " + err.message);
      });
  };

  useEffect(() => {
    const API_BASE =
      (import.meta.env && (import.meta.env.VITE_API_URL as string)) ||
      `http://${window.location.hostname}:5000`;
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) setProducts(list);
      })
      .catch(() => {});
    fetch(`${API_BASE}/api/warehouses`)
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) setLocations(list);
      })
      .catch(() => {});
  }, []);

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Delivery Order"
      description="Prepare outgoing delivery"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer" className="text-foreground">
              Customer Name
            </Label>
            <Input
              id="customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Items</Label>
            <Button
              type="button"
              size="sm"
              onClick={addItem}
              variant="outline"
              className="border-border"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-end p-3 bg-secondary/20 rounded-md"
            >
              <div className="col-span-5 space-y-1">
                <Label className="text-xs text-foreground">Product</Label>
                <Select
                  value={item.productId}
                  onValueChange={(value) =>
                    updateItem(index, "productId", value)
                  }
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {products.map((product: any) => (
                      <SelectItem
                        key={product._id || product.id}
                        value={product._id || product.id}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs text-foreground">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    updateItem(index, "quantity", parseInt(e.target.value))
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="col-span-4 space-y-1">
                <Label className="text-xs text-foreground">From Location</Label>
                <Select
                  value={item.locationId}
                  onValueChange={(value) =>
                    updateItem(index, "locationId", value)
                  }
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {locations.map((location: any) => (
                      <SelectItem
                        key={location._id || location.id || location.name}
                        value={location._id || location.id || location.name}
                      >
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-foreground">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-input border-border text-foreground"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Delivery
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
