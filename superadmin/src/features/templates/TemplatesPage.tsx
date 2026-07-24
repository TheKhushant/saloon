import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search, TrendingUp, Star, Layers } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL_BRANCHES, useBranch } from "@/context/BranchContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateCard } from "./components/TemplateCard";
import { TemplateFormDialog } from "./components/TemplateFormDialog";
import { TemplatePreviewDialog } from "./components/TemplatePreviewDialog";
import {
  assignTemplateBranches,
  createTemplate,
  deleteTemplate,
  duplicateTemplate,
  fetchTemplates,
  toggleTemplateFavorite,
  updateTemplate,
} from "./api";
import { TEMPLATE_CATEGORIES, type Template, type TemplateCategory, type TemplateInput } from "./types";

const ALL_CATEGORIES = "all";

export default function TemplatesPage() {
  const { branches, selectedBranchId, selectedBranch } = useBranch();
  const { user } = useAuth();
  const branchId = selectedBranchId === ALL_BRANCHES ? undefined : selectedBranchId;

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<TemplateCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Template | undefined>();
  const [assigningId, setAssigningId] = useState<string | undefined>();

  const queryClient = useQueryClient();

  const templatesQ = useQuery({
    queryKey: ["templates", branchId],
    queryFn: () => fetchTemplates(branchId),
  });

  const filtered = useMemo(() => {
    let list = templatesQ.data ?? [];
    if (category !== ALL_CATEGORIES) list = list.filter((t) => t.category === category);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(needle) ||
          t.category.toLowerCase().includes(needle) ||
          t.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    }
    return list;
  }, [templatesQ.data, q, category]);

  const analytics = useMemo(() => {
    const list = templatesQ.data ?? [];
    if (list.length === 0) return undefined;
    const mostUsed = [...list].sort((a, b) => b.branchIds.length - a.branchIds.length)[0];
    const avgRating = list.reduce((sum, t) => sum + t.rating, 0) / list.length;
    return { total: list.length, mostUsed, avgRating };
  }, [templatesQ.data]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["templates"] });

  const createMutation = useMutation({
    mutationFn: (input: TemplateInput) => createTemplate(input, user?.name ?? "Admin"),
    onSuccess: () => {
      toast.success("Template added");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to add template")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: TemplateInput }) => updateTemplate(id, input),
    onSuccess: () => {
      toast.success("Template updated");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update template")),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicateTemplate(id),
    onSuccess: () => {
      toast.success("Template duplicated");
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to duplicate template")),
  });

  const archiveMutation = useMutation({
    mutationFn: (t: Template) =>
      updateTemplate(t._id, {
        name: t.name,
        category: t.category,
        status: "archived",
        description: t.description,
        imageUrl: t.imageUrl,
        images: t.images,
        beforeImageUrl: t.beforeImageUrl,
        afterImageUrl: t.afterImageUrl,
        suitableFor: t.suitableFor,
        budgetMin: t.budgetMin,
        budgetMax: t.budgetMax,
        setupDays: t.setupDays,
        rating: t.rating,
        themeColors: t.themeColors,
        furniture: t.furniture,
        costBreakdown: t.costBreakdown,
        tags: t.tags,
      }),
    onSuccess: () => {
      toast.success("Template archived");
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to archive template")),
  });

  const favoriteMutation = useMutation({
    mutationFn: (id: string) => toggleTemplateFavorite(id),
    onSuccess: invalidate,
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update favorite")),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, branchIds }: { id: string; branchIds: string[] }) =>
      assignTemplateBranches(id, branchIds),
    onMutate: ({ id }) => setAssigningId(id),
    onSuccess: () => {
      toast.success("Branch assignment updated");
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update branch assignment")),
    onSettled: () => setAssigningId(undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => {
      toast.success("Template deleted");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to delete template")),
  });

  return (
    <>
      <PageHeader
        title="Templates"
        description={
          selectedBranch
            ? `Interior design templates used at ${selectedBranch.name}`
            : "Interior design templates you can apply to your branches"
        }
        actions={
          <Button
            onClick={() => {
              setSelected(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Template
          </Button>
        }
      />

      {analytics && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Total templates</div>
                <div className="text-lg font-semibold">{analytics.total}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Most selected</div>
                <div className="truncate text-sm font-semibold">{analytics.mostUsed.name}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <div>
                <div className="text-xs text-muted-foreground">Average rating</div>
                <div className="text-lg font-semibold">{analytics.avgRating.toFixed(1)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-4 space-y-3 rounded-md border bg-card p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, category, or tag"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={category === ALL_CATEGORIES ? "default" : "outline"}
            onClick={() => setCategory(ALL_CATEGORIES)}
          >
            All Templates
          </Button>
          {TEMPLATE_CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {templatesQ.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-lg border bg-muted/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-md border bg-card py-16 text-center text-muted-foreground">
          No templates found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <TemplateCard
              key={t._id}
              template={t}
              branches={branches}
              index={i}
              onEdit={() => {
                setSelected(t);
                setFormOpen(true);
              }}
              onDelete={() => {
                setSelected(t);
                setDeleteOpen(true);
              }}
              onDuplicate={() => duplicateMutation.mutate(t._id)}
              onArchive={() => archiveMutation.mutate(t)}
              onToggleFavorite={() => favoriteMutation.mutate(t._id)}
              onPreview={() => {
                setSelected(t);
                setPreviewOpen(true);
              }}
              onAssignBranches={(branchIds) => assignMutation.mutate({ id: t._id, branchIds })}
              assigning={assigningId === t._id}
            />
          ))}
        </div>
      )}

      <TemplateFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        template={selected}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) =>
          selected
            ? updateMutation.mutate({ id: selected._id, input: values })
            : createMutation.mutate(values)
        }
      />
      <TemplatePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={selected}
        branches={branches}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this template?"
        description="This removes the interior design template. This can't be undone."
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
