import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Building2, ImagePlus, Package, Search } from "lucide-react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setProductBranches,
  uploadProductImage,
} from "@/lib/productStore";
import { getBranches } from "@/lib/branchStore";
import useAuth from "@/hooks/useAuth";
import type { Product, ProductCategory, Branch } from "@/data/mockData";

const CATEGORIES: ProductCategory[] = ["Face Care", "Hair Care", "Body Care", "Beard Care", "Tools"];
type DialogMode = "form" | "assign" | null;

export default function ProductsPage() {
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";

  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "Hair Care" as ProductCategory,
    price: "",
    stock: "",
    description: "",
    image: "",
    active: true,
  });
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);

  const load = async () => {
    const all = await getProducts();
    const scoped = isBranchAdmin
      ? all.filter((p) => p.assignedBranchIds?.includes(user?.branchId ?? ""))
      : all;
    setProducts(scoped);
    setBranches(await getBranches());
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { active: !product.active });
      toast.success(`Product ${product.active ? "disabled" : "enabled"}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  const openAdd = () => {
    setActiveProduct(null);
    setForm({ name: "", category: "Hair Care", price: "", stock: "", description: "", image: "", active: true });
    setDialogMode("form");
  };

  const openEdit = (product: Product) => {
    setActiveProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description ?? "",
      image: product.image,
      active: product.active,
    });
    setDialogMode("form");
  };

  const openAssign = (product: Product) => {
    setActiveProduct(product);
    setSelectedBranchIds(product.assignedBranchIds ?? []);
    setDialogMode("assign");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setActiveProduct(null);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Please enter a product name");
      return false;
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      toast.error("Please enter a valid stock quantity");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim() || undefined,
      image: form.image.trim() || "/placeholder.svg",
      active: form.active,
    };

    try {
      if (activeProduct) {
        await updateProduct(activeProduct.id, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product added");
      }
      closeDialog();
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const handleSaveAssign = async () => {
    if (!activeProduct) return;
    try {
      await setProductBranches(activeProduct.id, selectedBranchIds);
      toast.success("Branch assignment updated");
      closeDialog();
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update branch assignment");
    }
  };

  const toggleBranchSelection = (branchId: string) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {isBranchAdmin ? `${user?.branchName} Products` : "Products"}
        </h1>
        {!isBranchAdmin && (
          <Button className="gap-2" onClick={openAdd}>
            <Plus className="h-4 w-4" /><span>Add Product</span>
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or category..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const assignedCount = product.assignedBranchIds?.length ?? 0;
          return (
            <Card key={product.id} className="overflow-hidden group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/3] w-full bg-muted overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground font-body">
                    No image
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{product.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="font-body text-xs">{product.category}</Badge>
                      {product.approvalStatus && product.approvalStatus !== "APPROVED" && (
                        <StatusBadge
                          status={product.approvalStatus === "PENDING" ? "Pending" : "Rejected"}
                        />
                      )}
                    </div>
                  </div>
                  <StatusBadge status={product.active ? "Active" : "Disabled"} />
                </div>
                {product.approvalStatus === "PENDING" && (
                  <p className="text-xs text-muted-foreground font-body">
                    Awaiting superadmin approval — not visible to customers yet.
                  </p>
                )}
                {product.approvalStatus === "REJECTED" && (
                  <p className="text-xs text-destructive font-body">
                    Rejected by superadmin — not visible to customers.
                  </p>
                )}
                <div className="flex items-center justify-between text-sm font-body">
                  <span className="text-foreground font-medium">₹{product.price}</span>
                  <span className={product.stock === 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                  </span>
                </div>
                {product.description && (
                  <p className="text-xs text-muted-foreground font-body line-clamp-2">{product.description}</p>
                )}
                {!isBranchAdmin && (
                  <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {assignedCount} branch{assignedCount === 1 ? "" : "es"} assigned
                  </p>
                )}
                {!isBranchAdmin && (
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => openAssign(product)}>
                      Assign to Branch
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(product)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={product.active ? "destructive" : "default"}
                      onClick={() => toggleActive(product)}
                    >
                      {product.active ? "Disable" : "Enable"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(product)}>
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-muted-foreground font-body col-span-full text-center py-8">No products found</p>
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={dialogMode === "form"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              {activeProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Product Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Beard Oil"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body">Category</Label>
              <Select value={form.category} onValueChange={(v: ProductCategory) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Price (₹)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 299"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body">Product Image</Label>
              {form.image && (
                <div className="aspect-video w-full bg-muted rounded-md overflow-hidden border">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="gap-2" disabled={uploadingImage} asChild>
                  <label className="cursor-pointer">
                    <ImagePlus className="h-4 w-4" />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </Button>
                <span className="text-xs text-muted-foreground font-body">or paste a URL below</span>
              </div>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body">Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional details shown to customers"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="font-body mb-0">Active</Label>
                <p className="text-xs text-muted-foreground font-body">Available for sale when on</p>
              </div>
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={uploadingImage}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to branch dialog */}
      <Dialog open={dialogMode === "assign"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              Assign "{activeProduct?.name}" to Branches
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-72 overflow-auto">
            {branches.length === 0 && (
              <p className="text-sm text-muted-foreground font-body">No branches available yet.</p>
            )}
            {branches.map((branch) => (
              <label key={branch.id} className="flex items-center gap-3 font-body text-sm cursor-pointer">
                <Checkbox
                  checked={selectedBranchIds.includes(branch.id)}
                  onCheckedChange={() => toggleBranchSelection(branch.id)}
                />
                <span>{branch.branch_name}</span>
                <span className="text-muted-foreground">({branch.city})</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSaveAssign}>Save Assignments</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this product?"
        description="This removes the product from the catalog. This can't be undone."
        confirmText="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
