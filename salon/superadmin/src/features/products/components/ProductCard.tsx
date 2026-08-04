import { MoreHorizontal, Pencil, Trash2, MapPin, AlertTriangle, PackagePlus, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { getProductStatus, getRemainingQty, type Product } from "../types";
import type { Branch } from "@/features/branches/types";

export function ProductCard({
  product,
  branches: _branches,
  index,
  onViewDetails,
  onEdit,
  onDelete,
  onAssign,
  onUnassign: _onUnassign,
  onRequestStock,
  requestingStock,
}: {
  product: Product;
  branches: Branch[];
  index: number;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onUnassign: (allocationId: string) => void;
  onRequestStock: () => void;
  requestingStock: boolean;
}) {
  const status = getProductStatus(product);
  const isLow = status === "low_stock" || status === "out_of_stock";
  const remaining = getRemainingQty(product);

  return (
    <Card
      className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-muted"
        onClick={onViewDetails}
        role="button"
        aria-label={`View details for ${product.name}`}
      >
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

        {typeof product.rating === "number" && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
            {typeof product.reviewCount === "number" && (
              <span className="text-muted-foreground">({product.reviewCount})</span>
            )}
          </span>
        )}

        <div onClick={(e) => e.stopPropagation()} className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/90 backdrop-blur hover:bg-background"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAssign}>
                <MapPin className="mr-2 h-4 w-4" /> Assign to Branch
              </DropdownMenuItem>
              {isLow && !product.comingSoon && (
                <DropdownMenuItem disabled={requestingStock} onClick={onRequestStock}>
                  <PackagePlus className="mr-2 h-4 w-4" /> Request Stock
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLow && !product.comingSoon && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium text-destructive backdrop-blur">
            <AlertTriangle className="h-3 w-3" />
            {remaining <= 0 ? "Out of stock" : "Low stock"}
          </span>
        )}
      </div>

      <CardContent className="space-y-2 p-3">
        {product.tag && (
          <Badge variant="secondary" className="text-[11px] font-normal">
            {product.tag}
          </Badge>
        )}

        <div className="cursor-pointer" onClick={onViewDetails}>
          <div className="truncate text-sm font-semibold leading-tight hover:underline">
            {product.name}
          </div>
          {product.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
          )}
        </div>

        <div className="text-base font-semibold">{formatCurrency(product.price)}</div>

        <Button variant="outline" size="sm" className="w-full" onClick={onViewDetails}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
