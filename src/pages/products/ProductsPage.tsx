import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { mockProducts, mockLocations } from "@/data/mockData";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

export const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.totalStock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (product.lowStockThreshold && product.totalStock < product.lowStockThreshold) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    }
    return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
  };

  const columns = [
    { header: "Product Name", accessor: "name" as const },
    { header: "SKU", accessor: "sku" as const },
    { header: "Category", accessor: "category" as const },
    { header: "Total Stock", accessor: (item: Product) => `${item.totalStock} ${item.unit}` },
    {
      header: "Stock by Location",
      accessor: (item: Product) => (
        <div className="space-y-1">
          {mockLocations.map((loc) => (
            <div key={loc.id} className="text-sm">
              <span className="text-muted-foreground">{loc.name}:</span>{" "}
              <span className="text-foreground">{item.stockByLocation[loc.id] || 0} {item.unit}</span>
            </div>
          ))}
        </div>
      ),
    },
    { header: "Status", accessor: (item: Product) => getStockStatus(item) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input border-border text-foreground"
          />
        </div>
      </div>

      <DataTable data={filteredProducts} columns={columns} />

      <AddProductModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
