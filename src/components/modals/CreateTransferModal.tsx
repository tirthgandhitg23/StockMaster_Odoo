import { useState } from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProducts, mockLocations } from "@/data/mockData";

interface CreateTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTransferModal = ({ open, onOpenChange }: CreateTransferModalProps) => {
  const [formData, setFormData] = useState({
    fromLocationId: "",
    toLocationId: "",
    productId: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transfer data:", formData);
    onOpenChange(false);
  };

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
            <Label htmlFor="fromLocation" className="text-foreground">From Location</Label>
            <Select
              value={formData.fromLocationId}
              onValueChange={(value) => setFormData({ ...formData, fromLocationId: value })}
              required
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {mockLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="toLocation" className="text-foreground">To Location</Label>
            <Select
              value={formData.toLocationId}
              onValueChange={(value) => setFormData({ ...formData, toLocationId: value })}
              required
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {mockLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product" className="text-foreground">Product</Label>
          <Select
            value={formData.productId}
            onValueChange={(value) => setFormData({ ...formData, productId: value })}
            required
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {mockProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create Transfer
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
