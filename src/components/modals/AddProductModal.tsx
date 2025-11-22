import { useState } from "react";
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

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddProductModal = ({
  open,
  onOpenChange,
}: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    unit: "pcs",
    initialStock: "",
    unitPrice: "0.01",
    reorderPoint: "10",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit to backend
    const payload = {
      sku: formData.sku,
      name: formData.name,
      category: formData.category || formData.name,
      unitPrice: parseFloat(formData.unitPrice) || 0.01,
      reorderPoint: parseInt(formData.reorderPoint, 10) || 10,
      initialStock: formData.initialStock
        ? parseInt(formData.initialStock, 10)
        : 0,
    };

    // Determine API base (allow override with VITE_API_URL)
    const API_BASE =
      (import.meta.env && (import.meta.env.VITE_API_URL as string)) ||
      `http://${window.location.hostname}:5000`;

    fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        // Try to parse JSON, but fall back to text if response isn't JSON
        const text = await res.text();
        let body: any = null;
        try {
          body = text ? JSON.parse(text) : null;
        } catch (e) {
          body = null;
        }

        if (!res.ok) {
          const msg = body?.message || text || `HTTP ${res.status}`;
          throw new Error(msg);
        }

        return body;
      })
      .then((data) => {
        console.log("Product created:", data);
        onOpenChange(false);
        setFormData({
          name: "",
          sku: "",
          category: "",
          unit: "pcs",
          initialStock: "",
          unitPrice: "0.01",
          reorderPoint: "10",
        });
        // dispatch custom event so parent can refresh
        window.dispatchEvent(
          new CustomEvent("product:added", { detail: data?.product })
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Error creating product: " + err.message);
      });
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Product"
      description="Enter the details of the new product"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Product Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku" className="text-foreground">
              SKU
            </Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              required
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Category
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unitPrice" className="text-foreground">
              Unit Price
            </Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: e.target.value })
              }
              required
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reorderPoint" className="text-foreground">
              Reorder Point
            </Label>
            <Input
              id="reorderPoint"
              type="number"
              min="0"
              value={formData.reorderPoint}
              onChange={(e) =>
                setFormData({ ...formData, reorderPoint: e.target.value })
              }
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit" className="text-foreground">
              Unit
            </Label>
            <Select
              value={formData.unit}
              onValueChange={(value) =>
                setFormData({ ...formData, unit: value })
              }
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="pcs">Pieces</SelectItem>
                <SelectItem value="kg">Kilograms</SelectItem>
                <SelectItem value="ltr">Liters</SelectItem>
                <SelectItem value="box">Boxes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="initialStock" className="text-foreground">
            Initial Stock (Optional)
          </Label>
          <Input
            id="initialStock"
            type="number"
            min="0"
            value={formData.initialStock}
            onChange={(e) =>
              setFormData({ ...formData, initialStock: e.target.value })
            }
            className="bg-input border-border text-foreground"
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
            Add Product
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
