import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL_BRANCHES, useBranch } from "@/context/BranchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ProductCard } from "./components/ProductCard";
import { ProductFormDialog } from "./components/ProductFormDialog";
import { AssignProductDialog } from "./components/AssignProductDialog";
import { ProductDetailsDialog } from "./components/ProductDetailsDialog";
import { StockRequestsPanel } from "./components/StockRequestsPanel";
import {
  approveProduct,
  assignProductToBranch,
  createProduct,
  createStockRequest,
  deleteProduct,
  fetchProducts,
  rejectProduct,
  removeProductAllocation,
  updateProduct,
} from "./api";
import type { Product, ProductAllocationInput, ProductInput } from "./types";

export default function ProductsPage() {
  const { branches, selectedBranchId, selectedBranch } = useBranch();
  const branchId = selectedBranchId === ALL_BRANCHES ? undefined : selectedBranchId;

  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Product | undefined>();
  const [requestingId, setRequestingId] = useState<string | undefined>();

  const queryClient = useQueryClient();

  const productsQ = useQuery({
    queryKey: ["products", branchId],
    queryFn: () => fetchProducts(branchId),
  });

  const filtered = useMemo(() => {
    const list = productsQ.data ?? [];
    if (!q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter(
      (p) => p.name.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle)
    );
  }, [productsQ.data, q]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["products"] });

  const createMutation = useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: () => {
      toast.success("Product added");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to add product")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) => updateProduct(id, input),
    onSuccess: () => {
      toast.success("Product updated");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update product")),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductAllocationInput }) =>
      assignProductToBranch(id, input),
    onSuccess: () => {
      toast.success("Product assigned to branch");
      setAssignOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to assign product")),
  });

  const unassignMutation = useMutation({
    mutationFn: ({ id, allocationId }: { id: string; allocationId: string }) =>
      removeProductAllocation(id, allocationId),
    onSuccess: () => {
      toast.success("Assignment removed");
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to remove assignment")),
  });

  const requestStockMutation = useMutation({
    mutationFn: ({ productId, branchId }: { productId: string; branchId: string }) =>
      createStockRequest(productId, branchId),
    onMutate: ({ productId }) => setRequestingId(productId),
    onSuccess: () => {
      toast.success("Stock request sent to Super Admin");
      queryClient.invalidateQueries({ queryKey: ["stock-requests"] });
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to send stock request")),
    onSettled: () => setRequestingId(undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to delete product")),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveProduct(id),
    onSuccess: () => {
      toast.success("Product approved - now visible to customers");
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to approve product")),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectProduct(id),
    onSuccess: () => {
      toast.success("Product rejected");
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to reject product")),
  });

  return (
    <>
      <PageHeader
        title="Products"
        description={
          selectedBranch ? `Retail products stocked at ${selectedBranch.name}` : "Retail grooming products sold in-store"
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <StockRequestsPanel />
            <Button
              onClick={() => {
                setSelected(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-md border bg-card p-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or category"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {productsQ.isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-lg border bg-muted/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-md border bg-card py-16 text-center text-muted-foreground">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p, i) => (
            <ProductCard
              key={p._id}
              product={p}
              branches={branches}
              index={i}
              onViewDetails={() => {
                setSelected(p);
                setDetailsOpen(true);
              }}
              onEdit={() => {
                setSelected(p);
                setFormOpen(true);
              }}
              onDelete={() => {
                setSelected(p);
                setDeleteOpen(true);
              }}
              onAssign={() => {
                setSelected(p);
                setAssignOpen(true);
              }}
              onUnassign={(allocationId) => unassignMutation.mutate({ id: p._id, allocationId })}
              onApprove={() => approveMutation.mutate(p._id)}
              onReject={() => rejectMutation.mutate(p._id)}
              onRequestStock={() =>
                requestStockMutation.mutate({
                  productId: p._id,
                  branchId: branchId ?? p.allocations[0]?.branchId ?? branches[0]?._id,
                })
              }
              requestingStock={requestingId === p._id}
            />
          ))}
        </div>
      )}

      <ProductDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        product={selected}
        branches={branches}
        onEdit={() => {
          setDetailsOpen(false);
          setFormOpen(true);
        }}
        onAssign={() => {
          setDetailsOpen(false);
          setAssignOpen(true);
        }}
        onUnassign={(allocationId) =>
          selected && unassignMutation.mutate({ id: selected._id, allocationId })
        }
        onRequestStock={() =>
          selected &&
          requestStockMutation.mutate({
            productId: selected._id,
            branchId: branchId ?? selected.allocations[0]?.branchId ?? branches[0]?._id,
          })
        }
        onDelete={() => {
          setDetailsOpen(false);
          setDeleteOpen(true);
        }}
        requestingStock={requestingId === selected?._id}
      />
      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selected}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) =>
          selected
            ? updateMutation.mutate({ id: selected._id, input: values })
            : createMutation.mutate(values)
        }
      />
      <AssignProductDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        product={selected}
        branches={branches}
        defaultBranchId={branchId}
        submitting={assignMutation.isPending}
        onSubmit={(values) => selected && assignMutation.mutate({ id: selected._id, input: values })}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this product?"
        description="This removes the product and all of its branch assignments. This can't be undone."
        confirmText="Delete"
        destructive
        onConfirm={() => selected && deleteMutation.mutate(selected._id)}
      />
    </>
  );
}

function extractMessage(err: unknown, fallback: string) {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message ?? e?.message ?? fallback;
}
