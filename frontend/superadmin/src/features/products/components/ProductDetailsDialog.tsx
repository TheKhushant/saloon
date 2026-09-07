import { format, parseISO } from "date-fns";
import { MapPin, X, AlertTriangle, PackagePlus, Pencil, Trash2, Star, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  getAssignedQty,
  getProductStatus,
  getRemainingQty,
  LOW_STOCK_THRESHOLD,
  type Product,
} from "../types";
import type { Branch } from "@/features/branches/types";

const STATUS_LABEL: Record<ReturnType<typeof getProductStatus>, string> = {
  available: "Available",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
  coming_soon: "Coming Soon",
};

const STATUS_CLASS: Record<ReturnType<typeof getProductStatus>, string> = {
  available: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  low_stock: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300",
  out_of_stock: "border-destructive/30 bg-destructive/15 text-destructive",
  coming_soon: "border-sky-500/30 bg-sky-500/15 text-sky-700 dark:text-sky-300",
};

function safeDate(iso: string) {
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

export function ProductDetailsDialog({
  open,
  onOpenChange,
  product,
  branches,
  onEdit,
  onAssign,
  onUnassign,
  onRequestStock,
  onDelete,
  requestingStock,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  branches: Branch[];
  onEdit: () => void;
  onAssign: () => void;
  onUnassign: (allocationId: string) => void;
  onRequestStock: () => void;
  onDelete: () => void;
  requestingStock: boolean;
}) {
  if (!product) return null;

  const assigned = getAssignedQty(product);
  const remaining = getRemainingQty(product);
  const status = getProductStatus(product);
  const isLow = status === "low_stock" || status === "out_of_stock";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Full product details and quick actions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant="outline" className={STATUS_CLASS[status]}>
              {STATUS_LABEL[status]}
            </Badge>
            <Badge
              variant="outline"
              className={
                product.active
                  ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "border-zinc-500/30 bg-zinc-500/15 text-zinc-700 dark:text-zinc-300"
              }
            >
              {product.active ? "Active" : "Inactive"}
            </Badge>
          </div>

          {typeof product.rating === "number" && (
            <div className="flex items-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              {typeof product.reviewCount === "number" && (
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              )}
            </div>
          )}

          <div className="text-2xl font-semibold">{formatCurrency(product.price)}</div>

          {product.tag && <Badge variant="outline">{product.tag}</Badge>}

          {product.description && (
            <p className="text-sm text-muted-foreground">{product.description}</p>
          )}

          {product.benefits && product.benefits.length > 0 && (
            <div>
              <p className="mb-1.5 text-sm font-medium">Key Benefits</p>
              <ul className="space-y-1">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.howToUse && (
            <div>
              <p className="mb-1 text-sm font-medium">How to Use</p>
              <p className="text-sm text-muted-foreground">{product.howToUse}</p>
            </div>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <p className="mb-1 text-sm font-medium">Key Ingredients</p>
              <p className="text-sm text-muted-foreground">{product.ingredients.join(", ")}</p>
            </div>
          )}

          <div className="rounded-md border p-3 text-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="font-medium">{product.totalStock}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Assigned</div>
                <div className="font-medium">{assigned}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Remaining</div>
                <div className={`font-medium ${isLow ? "text-destructive" : ""}`}>{remaining}</div>
              </div>
            </div>
            {isLow && !product.comingSoon && (
              <div className="mt-2 flex items-center justify-between gap-2 rounded-sm bg-destructive/10 px-2 py-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Low stock (below {LOW_STOCK_THRESHOLD})
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={requestingStock}
                  onClick={onRequestStock}
                >
                  <PackagePlus className="mr-1 h-3.5 w-3.5" />
                  Request Stock
                </Button>
              </div>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Branch allocations
            </p>
            {product.allocations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Not assigned to any branch yet.</p>
            ) : (
              <div className="space-y-1.5">
                {product.allocations.map((a) => {
                  const branch = branches.find((b) => b._id === a.branchId);
                  return (
                    <div
                      key={a._id}
                      className="flex items-start justify-between gap-2 rounded-sm border px-2.5 py-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <span className="truncate font-medium">{branch?.name ?? "—"}</span>
                        </div>
                        <div className="mt-0.5 pl-[18px] text-muted-foreground">{a.quantity} qty</div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">{safeDate(a.assignedDate)}</span>
                          <button
                            type="button"
                            onClick={() => onUnassign(a._id)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${branch?.name ?? "branch"} assignment`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="flex items-center gap-1.5 font-medium">
                          <span
                            className={cn(
                              "h-2.5 w-2.5 shrink-0 rounded-full ring-2",
                              a.status === "assigned"
                                ? "bg-emerald-500 ring-emerald-200 dark:ring-emerald-900"
                                : "bg-amber-500 ring-amber-200 dark:ring-amber-900"
                            )}
                          />
                          <span
                            className={
                              a.status === "assigned"
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-amber-700 dark:text-amber-300"
                            }
                          >
                            {a.status === "assigned" ? "Assigned" : "Pending"}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-row flex-wrap justify-between gap-2 sm:justify-between">
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onAssign}>
              <MapPin className="mr-1.5 h-3.5 w-3.5" /> Assign to Branch
            </Button>
            <Button size="sm" onClick={onEdit}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
