import { useEffect, useState } from "react";
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
import { mockProducts, mockLocations } from "@/data/mockData";

interface CreateTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTransferModal = ({
  open,
  onOpenChange,
}: CreateTransferModalProps) => {
  const [formData, setFormData] = useState({
    fromLocationId: "",
    toLocationId: "",
    productId: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [products, setProducts] = useState<typeof mockProducts>(mockProducts);
  const [locations, setLocations] =
    useState<typeof mockLocations>(mockLocations);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE =
      (import.meta.env && (import.meta.env.VITE_API_URL as string)) ||
      `http://${window.location.hostname}:5000`;
    const payload = {
      fromLocationId: formData.fromLocationId,
      toLocationId: formData.toLocationId,
      productId: formData.productId,
      quantity: parseInt(formData.quantity, 10),
      date: formData.date,
      status: "pending",
    };

    fetch(`${API_BASE}/api/operations/transfers`, {
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
        console.error("Transfer create failed", err);
        alert("Error creating transfer: " + err.message);
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
      title="Create Internal Transfer"
      description="Move stock between locations"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromLocation" className="text-foreground">
              From Location
            </Label>
            <Select
              value={formData.fromLocationId}
              onValueChange={(value) =>
                setFormData({ ...formData, fromLocationId: value })
              }
              required
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
          <div className="space-y-2">
            <Label htmlFor="toLocation" className="text-foreground">
              To Location
            </Label>
            <Select
              value={formData.toLocationId}
              onValueChange={(value) =>
                setFormData({ ...formData, toLocationId: value })
              }
              required
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="product" className="text-foreground">
            Product
          </Label>
          <Select
            value={formData.productId}
            onValueChange={(value) =>
              setFormData({ ...formData, productId: value })
            }
            required
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
                  {product.name} {product.sku ? `(${product.sku})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-foreground">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
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
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="bg-input border-border text-foreground"
            />
          </div>
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
            Create Transfer
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
