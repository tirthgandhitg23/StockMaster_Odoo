import { useState } from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLocationModal = ({ open, onOpenChange }: AddLocationModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Location data:", formData);
    onOpenChange(false);
    setFormData({ name: "", code: "", description: "" });
  };

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} title="Add Location" description="Create a new storage location">
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Location Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Main Warehouse"
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground">Location Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              placeholder="e.g., WH-01"
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the location"
            className="bg-input border-border text-foreground"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Location
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
