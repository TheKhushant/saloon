import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Archive,
  MapPin,
  Heart,
  Star,
  Clock,
  Users,
  Eye,
  IndianRupee,
} from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/currency";
import { getEstimatedCost, STATUS_META, type Template } from "../types";
import type { Branch } from "@/features/branches/types";

function BranchAssignPopover({
  template,
  branches,
  onApply,
  applying,
}: {
  template: Template;
  branches: Branch[];
  onApply: (branchIds: string[]) => void;
  applying: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string[]>(template.branchIds);

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) setPending(template.branchIds);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={applying}>
          <MapPin className="mr-1.5 h-3.5 w-3.5" />
          Assign to Branch
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-3">
        <div className="mb-2 text-xs font-medium text-muted-foreground">Select Branch</div>
        <div className="space-y-1">
          {branches.map((b) => {
            const checked = pending.includes(b._id);
            return (
              <label
                key={b._id}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1.5 text-sm hover:bg-accent"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) =>
                    setPending((prev) =>
                      v === true ? [...prev, b._id] : prev.filter((id) => id !== b._id)
                    )
                  }
                />
                {b.name}
              </label>
            );
          })}
          {branches.length === 0 && (
            <p className="px-1 py-1.5 text-sm text-muted-foreground">No branches available</p>
          )}
        </div>
        <Button
          size="sm"
          className="mt-3 w-full"
          disabled={applying}
          onClick={() => {
            onApply(pending);
            setOpen(false);
          }}
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function TemplateCard({
  template,
  branches,
  index,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onToggleFavorite,
  onAssignBranches,
  onPreview,
  assigning,
}: {
  template: Template;
  branches: Branch[];
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onToggleFavorite: () => void;
  onAssignBranches: (branchIds: string[]) => void;
  onPreview: () => void;
  assigning: boolean;
}) {
  const assignedBranches = template.branchIds
    .map((id) => branches.find((b) => b._id === id)?.name)
    .filter((n): n is string => !!n);
  const visibleBranches = assignedBranches.slice(0, 2);
  const moreCount = assignedBranches.length - visibleBranches.length;
  const status = STATUS_META[template.status];

  return (
    <Card
      className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
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
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={template.favorite ? "Remove favorite" : "Mark favorite"}
          className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        >
          <Heart
            className={`h-4 w-4 ${template.favorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`}
          />
        </button>
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {template.rating.toFixed(1)}
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-2 right-2 opacity-0 shadow transition-opacity group-hover:opacity-100"
          onClick={onPreview}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
      </div>

      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div className="min-w-0">
          <div className="font-heading text-lg font-semibold leading-tight">{template.name}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{template.category}</Badge>
            <Badge variant="outline" className={`gap-1 ${status.badgeClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </Badge>
          </div>
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
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
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
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {template.description && (
          <p className="text-sm text-muted-foreground">{template.description}</p>
        )}

        <div className="text-sm">
          <span className="text-muted-foreground">Suitable for: </span>
          <span className="font-medium">{template.suitableFor}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-md border p-2 text-center text-xs">
          <div>
            <IndianRupee className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
            <div className="mt-0.5 font-medium">
              {formatCurrency(template.budgetMin)}–{formatCurrency(template.budgetMax)}
            </div>
          </div>
          <div>
            <Clock className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
            <div className="mt-0.5 font-medium">{template.setupDays} days</div>
          </div>
          <div>
            <Users className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
            <div className="mt-0.5 font-medium">{assignedBranches.length} branches</div>
          </div>
        </div>

        {template.themeColors.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Colors:</span>
            {template.themeColors.map((c) => (
              <span
                key={c}
                title={c}
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated cost</span>
          <span className="font-medium">{formatCurrency(getEstimatedCost(template))}</span>
        </div>

        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {template.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-xs">
          <span className="text-muted-foreground">Assigned to: </span>
          {assignedBranches.length === 0 ? (
            <span className="text-muted-foreground">Not assigned</span>
          ) : (
            <span className="font-medium">
              {visibleBranches.join(", ")}
              {moreCount > 0 && <span className="text-muted-foreground"> +{moreCount} More</span>}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 border-t pt-2 text-[11px] text-muted-foreground">
          <span>Version {template.version}</span>
          <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
          <span>By {template.createdBy}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 pt-0">
        <Button variant="ghost" size="sm" onClick={onPreview}>
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
        <BranchAssignPopover
          template={template}
          branches={branches}
          onApply={onAssignBranches}
          applying={assigning}
        />
      </CardFooter>
    </Card>
  );
}
