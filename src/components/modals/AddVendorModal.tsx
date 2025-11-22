import { useState } from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddVendorModal = ({ open, onOpenChange }: AddVendorModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Vendor data:", formData);
    onOpenChange(false);
    setFormData({ name: "", phone: "", email: "", address: "" });
  };

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} title="Add Vendor" description="Enter vendor details">
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">Vendor Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-input border-border text-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-foreground">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            className="bg-input border-border text-foreground"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Vendor
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
