import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { mockLocations } from "@/data/mockData";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

export const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = () => {
    const API_BASE =
      (import.meta.env && (import.meta.env.VITE_API_URL as string)) ||
      `http://${window.location.hostname}:5000`;
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        // Normalize returned products to match Product type used by UI
        const normalized = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          sku: p.sku,
          category: p.category?.name || p.category,
          totalStock:
            p.totalStock ??
            (p.stockLocations
              ? p.stockLocations.reduce(
                  (s: number, l: any) => s + (l.quantity || 0),
                  0
                )
              : 0),
          unit: p.unit || "pcs",
          stockLocations: p.stockLocations || [],
        }));
        setProducts(normalized);
      })
      .catch((err) => console.error("Failed to fetch products", err));
  };

  useEffect(() => {
    fetchProducts();
    const handler = () => fetchProducts();
    window.addEventListener("product:added", handler);
    return () => window.removeEventListener("product:added", handler);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.totalStock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (
      product.lowStockThreshold &&
      product.totalStock < product.lowStockThreshold
    ) {
      return (
        <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
      );
    }
    return (
      <Badge className="bg-success text-success-foreground">In Stock</Badge>
    );
  };

  const columns = [
    { header: "Product Name", accessor: "name" as const },
    { header: "SKU", accessor: "sku" as const },
    { header: "Category", accessor: "category" as const },
    {
      header: "Total Stock",
      accessor: (item: Product) => `${item.totalStock} ${item.unit}`,
    },
    {
      header: "Stock by Location",
      accessor: (item: Product) => (
        <div className="space-y-1">
          {item.stockLocations && item.stockLocations.length > 0 ? (
            item.stockLocations.map((loc: any) => (
              <div
                key={loc.warehouseId?._id || loc.warehouseId}
                className="text-sm"
              >
                <span className="text-muted-foreground">
                  {loc.warehouseId?.name || "Warehouse"}:
                </span>{" "}
                <span className="text-foreground">
                  {loc.quantity || 0} {item.unit}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No stock locations
            </div>
          )}
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
          <p className="text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
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
