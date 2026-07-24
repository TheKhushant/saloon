import { useState } from "react";
import { Star, MapPin, IndianRupee, Clock, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { getEstimatedCost, STATUS_META, type Template } from "../types";
import type { Branch } from "@/features/branches/types";

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  template,
  branches,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: Template;
  branches: Branch[];
}) {
  const [showAfter, setShowAfter] = useState(true);

  if (!template) return null;

  const hasBeforeAfter = !!(template.beforeImageUrl && template.afterImageUrl);
  const heroImage = hasBeforeAfter
    ? showAfter
      ? template.afterImageUrl
      : template.beforeImageUrl
    : template.imageUrl;
  const assignedBranches = template.branchIds
    .map((id) => branches.find((b) => b._id === id)?.name)
    .filter((n): n is string => !!n);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="font-heading text-2xl">{template.name}</DialogTitle>
            <Badge variant="outline" className={STATUS_META[template.status].badgeClass}>
              {STATUS_META[template.status].label}
            </Badge>
            <Badge variant="secondary">{template.category}</Badge>
          </div>
          {template.description && <DialogDescription>{template.description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-5">
          {heroImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <img src={heroImage} alt={template.name} className="h-full w-full object-cover" />
              {hasBeforeAfter && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-3 right-3 shadow"
                  onClick={() => setShowAfter((v) => !v)}
                >
                  View {showAfter ? "Before" : "After"} (Transformation)
                </Button>
              )}
            </div>
          )}

          {template.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {template.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${template.name} ${i + 1}`}
                  className="h-16 w-24 shrink-0 rounded-md border object-cover"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md border p-2.5 text-center">
              <IndianRupee className="mx-auto h-4 w-4 text-muted-foreground" />
              <div className="mt-1 text-xs text-muted-foreground">Budget</div>
              <div className="text-sm font-medium">
                {formatCurrency(template.budgetMin)}–{formatCurrency(template.budgetMax)}
              </div>
            </div>
            <div className="rounded-md border p-2.5 text-center">
              <Clock className="mx-auto h-4 w-4 text-muted-foreground" />
              <div className="mt-1 text-xs text-muted-foreground">Setup time</div>
              <div className="text-sm font-medium">{template.setupDays} days</div>
            </div>
            <div className="rounded-md border p-2.5 text-center">
              <Users className="mx-auto h-4 w-4 text-muted-foreground" />
              <div className="mt-1 text-xs text-muted-foreground">Branches using</div>
              <div className="text-sm font-medium">{template.branchIds.length}</div>
            </div>
            <div className="rounded-md border p-2.5 text-center">
              <Star className="mx-auto h-4 w-4 fill-amber-400 text-amber-400" />
              <div className="mt-1 text-xs text-muted-foreground">Rating</div>
              <div className="text-sm font-medium">{template.rating.toFixed(1)}</div>
            </div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Suitable for: </span>
            <span className="font-medium">{template.suitableFor}</span>
          </div>

          {template.themeColors.length > 0 && (
            <div>
              <div className="mb-1.5 text-sm font-medium">Theme colors</div>
              <div className="flex gap-2">
                {template.themeColors.map((c) => (
                  <span
                    key={c}
                    title={c}
                    className="h-7 w-7 rounded-full border shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {template.furniture.length > 0 && (
            <div>
              <div className="mb-1.5 text-sm font-medium">Furniture list</div>
              <ul className="grid grid-cols-1 gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                {template.furniture.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {template.costBreakdown.length > 0 && (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium">Estimated cost</span>
                <span className="font-heading text-lg font-semibold">
                  {formatCurrency(getEstimatedCost(template))}
                </span>
              </div>
              <div className="divide-y rounded-md border text-sm">
                {template.costBreakdown.map((c) => (
                  <div key={c.label} className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-medium">{formatCurrency(c.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {template.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <div>
            <div className="mb-1.5 text-sm font-medium">Assigned to</div>
            {assignedBranches.length === 0 ? (
              <p className="text-sm text-muted-foreground">Not assigned to any branch yet</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {assignedBranches.map((name) => (
                  <Badge key={name} variant="outline" className="gap-1 font-normal">
                    <MapPin className="h-3 w-3" />
                    {name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
            <span>Version {template.version}</span>
            <span>Last updated {new Date(template.updatedAt).toLocaleDateString()}</span>
            <span>Created by {template.createdBy}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
