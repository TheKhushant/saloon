import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL_BRANCHES, useBranch } from "@/context/BranchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ServicesTable } from "./components/ServicesTable";
import { ServiceFormDialog } from "./components/ServiceFormDialog";
import { createService, deleteService, fetchServices, updateService } from "./api";
import type { Service, ServiceInput } from "./types";

export default function ServicesPage() {
  const { branches, selectedBranchId, selectedBranch } = useBranch();
  const branchId = selectedBranchId === ALL_BRANCHES ? undefined : selectedBranchId;

  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Service | undefined>();

  const queryClient = useQueryClient();

  const servicesQ = useQuery({
    queryKey: ["services", "admin", branchId],
    queryFn: () => fetchServices(branchId),
  });

  const filtered = useMemo(() => {
    const list = servicesQ.data ?? [];
    if (!q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter(
      (s) => s.name.toLowerCase().includes(needle) || s.category?.toLowerCase().includes(needle)
    );
  }, [servicesQ.data, q]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["services"], exact: false });

  const createMutation = useMutation({
    mutationFn: (input: ServiceInput) => createService(input),
    onSuccess: () => {
      toast.success("Service added");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to add service")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ServiceInput }) => updateService(id, input),
    onSuccess: () => {
      toast.success("Service updated");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update service")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      toast.success("Service deleted");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to delete service")),
  });

  return (
    <>
      <PageHeader
        title="Services"
        description={
          selectedBranch
            ? `Services available at ${selectedBranch.name}`
            : "Manage the services customers can book"
        }
        actions={
          <Button
            onClick={() => {
              setSelected(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
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

      <ServicesTable
        data={filtered}
        loading={servicesQ.isLoading}
        branches={branches}
        actions={{
          onEdit: (s) => {
            setSelected(s);
            setFormOpen(true);
          },
          onDelete: (s) => {
            setSelected(s);
            setDeleteOpen(true);
          },
        }}
      />

      <ServiceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        service={selected}
        branches={branches}
        defaultBranchId={branchId}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) =>
          selected
            ? updateMutation.mutate({ id: selected._id, input: values })
            : createMutation.mutate(values)
        }
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this service?"
        description="This permanently removes the service. Existing bookings are not affected."
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
