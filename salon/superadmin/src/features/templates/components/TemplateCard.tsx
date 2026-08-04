import { MoreHorizontal, Pencil, Trash2, Copy, Archive, MapPin, Heart, Star } from "lucide-react";
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
import { getEstimatedCost, STATUS_META, type Template } from "../types";
import type { Branch } from "@/features/branches/types";

export function TemplateCard({
  template,
  branches: _branches,
  index,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onToggleFavorite,
  onAssign,
  onUnassign: _onUnassign,
  onPreview,
}: {
  template: Template;
  branches: Branch[];
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onToggleFavorite: () => void;
  onAssign: () => void;
  onUnassign: (assignmentId: string) => void;
  onPreview: () => void;
}) {
  const status = STATUS_META[template.status];

  return (
    <Card
      className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-muted"
        onClick={onPreview}
        role="button"
        aria-label={`View details for ${template.name}`}
      >
        {template.imageUrl ? (
          <img
            src={template.imageUrl}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {template.rating.toFixed(1)}
        </span>

        <div className="absolute right-2 top-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            aria-label={template.favorite ? "Remove favorite" : "Mark favorite"}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-colors hover:bg-background"
          >
            <Heart
              className={`h-3.5 w-3.5 ${template.favorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`}
            />
          </button>

          <div onClick={(e) => e.stopPropagation()}>
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
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAssign}>
                  <MapPin className="mr-2 h-4 w-4" /> Assign
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onArchive} disabled={template.status === "archived"}>
                  <Archive className="mr-2 h-4 w-4" /> Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <CardContent className="space-y-2 p-3">
        <Badge variant="secondary" className="text-[11px] font-normal">
          {template.category}
        </Badge>

        <div className="cursor-pointer" onClick={onPreview}>
          <div className="truncate text-sm font-semibold leading-tight hover:underline">
            {template.name}
          </div>
          {template.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className={`gap-1 text-[11px] ${status.badgeClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </Badge>
        </div>

        <div className="text-base font-semibold">{formatCurrency(getEstimatedCost(template))}</div>

        <Button variant="outline" size="sm" className="w-full" onClick={onPreview}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
