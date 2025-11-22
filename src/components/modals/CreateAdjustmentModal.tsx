import { useState, useEffect } from "react";
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

interface CreateAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAdjustmentModal = ({
  open,
  onOpenChange,
}: CreateAdjustmentModalProps) => {
  const [formData, setFormData] = useState({
    productId: "",
    locationId: "",
    systemQty: 0,
    countedQty: "",
    reason: "",
  });

  const [products, setProducts] = useState<typeof mockProducts>(mockProducts);
  const [locations, setLocations] =
    useState<typeof mockLocations>(mockLocations);

  const difference = formData.countedQty
    ? parseInt(formData.countedQty) - formData.systemQty
    : 0;

  useEffect(() => {
    if (formData.productId && formData.locationId) {
      const product = products.find(
        (p: any) => (p._id || p.id) === formData.productId
      );
      if (product) {
        // products from API have `stockLocations` array; try to find matching warehouse
        const locEntry = (product.stockLocations || []).find(
          (sl: any) =>
            (sl.warehouseId &&
              (sl.warehouseId._id || sl.warehouseId).toString() ===
                formData.locationId) ||
            sl.warehouseId?.toString() === formData.locationId
        );
        const qty = locEntry ? locEntry.quantity || 0 : 0;
        setFormData((prev) => ({ ...prev, systemQty: qty }));
      }
    }
  }, [formData.productId, formData.locationId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE =
      (import.meta.env && (import.meta.env.VITE_API_URL as string)) ||
      `http://${window.location.hostname}:5000`;
    const payload = {
      productId: formData.productId,
      locationId: formData.locationId,
      systemQty: formData.systemQty,
      countedQty: parseInt(formData.countedQty || "0", 10),
      reason: formData.reason,
      status: "completed",
    };

    fetch(`${API_BASE}/api/operations/adjustments`, {
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
        console.error("Adjustment create failed", err);
        alert("Error creating adjustment: " + err.message);
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
      title="Stock Adjustment"
      description="Record physical inventory count"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
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
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">
              Location
            </Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) =>
                setFormData({ ...formData, locationId: value })
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

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="systemQty" className="text-foreground">
              System Qty
            </Label>
            <Input
              id="systemQty"
              type="number"
              value={formData.systemQty}
              disabled
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countedQty" className="text-foreground">
              Counted Qty
            </Label>
            <Input
              id="countedQty"
              type="number"
              min="0"
              value={formData.countedQty}
              onChange={(e) =>
                setFormData({ ...formData, countedQty: e.target.value })
              }
              required
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Difference</Label>
            <div
              className={`h-10 px-3 rounded-md border border-border flex items-center font-medium ${
                difference > 0
                  ? "text-success bg-success/10"
                  : difference < 0
                  ? "text-destructive bg-destructive/10"
                  : "text-foreground bg-muted"
              }`}
            >
              {difference > 0 ? "+" : ""}
              {difference}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason" className="text-foreground">
            Reason
          </Label>
          <Textarea
            id="reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            placeholder="Explain the reason for adjustment"
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
            Save Adjustment
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
