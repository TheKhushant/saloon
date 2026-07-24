import { MoreHorizontal, Pencil, Trash2, MapPin, X, AlertTriangle, PackagePlus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/currency";
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

export function ProductCard({
  product,
  branches,
  index,
  onEdit,
  onDelete,
  onAssign,
  onUnassign,
  onRequestStock,
  requestingStock,
}: {
  product: Product;
  branches: Branch[];
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onUnassign: (allocationId: string) => void;
  onRequestStock: () => void;
  requestingStock: boolean;
}) {
  const assigned = getAssignedQty(product);
  const remaining = getRemainingQty(product);
  const status = getProductStatus(product);
  const isLow = status === "low_stock" || status === "out_of_stock";

  return (
    <Card
      className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div>
          <div className="font-heading text-lg font-semibold leading-tight">{product.name}</div>
          <Badge variant="secondary" className="mt-1">
            {product.category}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">{formatCurrency(product.price)}</span>
          <Badge variant="outline" className={STATUS_CLASS[status]}>
            {STATUS_LABEL[status]}
          </Badge>
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}

        {/* Inventory summary */}
        <div className="rounded-md border p-2.5 text-sm">
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

        {/* Branch allocations */}
        {product.allocations.length > 0 && (
          <div className="space-y-1.5">
            {product.allocations.map((a) => {
              const branch = branches.find((b) => b._id === a.branchId);
              return (
                <div
                  key={a._id}
                  className="flex items-center justify-between gap-2 rounded-sm border px-2 py-1.5 text-xs"
                >
                  <div className="flex min-w-0 items-center gap-1.5">
                    <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">{branch?.name ?? "—"}</span>
                    <span className="text-muted-foreground">· {a.quantity} qty</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-muted-foreground">{safeDate(a.assignedDate)}</span>
                    <Badge
                      variant="outline"
                      className={
                        a.status === "assigned"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      }
                    >
                      {a.status === "assigned" ? "Assigned" : "Pending"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => onUnassign(a._id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${branch?.name ?? "branch"} assignment`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 pt-0">
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
        <Button variant="outline" size="sm" onClick={onAssign}>
          <MapPin className="mr-1.5 h-3.5 w-3.5" />
          Assign to Branch
        </Button>
      </CardFooter>
    </Card>
  );
}
