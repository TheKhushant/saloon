import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL_BRANCHES, useBranch } from "@/context/BranchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { BarbersTable } from "./components/BarbersTable";
import { BarberFormDialog } from "./components/BarberFormDialog";
import { createBarber, deleteBarber, fetchBarbers, updateBarber } from "./api";
import type { Barber, BarberInput } from "./types";

export default function BarbersPage() {
  const { branches, selectedBranchId, selectedBranch } = useBranch();
  const branchId = selectedBranchId === ALL_BRANCHES ? undefined : selectedBranchId;

  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Barber | undefined>();

  const queryClient = useQueryClient();

  const barbersQ = useQuery({
    queryKey: ["barbers", "admin", branchId],
    queryFn: () => fetchBarbers(branchId),
  });

  const filtered = useMemo(() => {
    const list = barbersQ.data ?? [];
    if (!q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter(
      (b) =>
        b.name.toLowerCase().includes(needle) ||
        b.phone.includes(needle) ||
        b.specialties?.some((s) => s.toLowerCase().includes(needle))
    );
  }, [barbersQ.data, q]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["barbers"] });

  const createMutation = useMutation({
    mutationFn: (input: BarberInput) => createBarber(input),
    onSuccess: () => {
      toast.success("Barber added");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to add barber")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: BarberInput }) => updateBarber(id, input),
    onSuccess: () => {
      toast.success("Barber updated");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update barber")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBarber(id),
    onSuccess: () => {
      toast.success("Barber deleted");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to delete barber")),
  });

  return (
    <>
      <PageHeader
        title="Barbers"
        description={
          selectedBranch ? `Staff at ${selectedBranch.name}` : "Manage staff who take appointments"
        }
        actions={
          <Button
            onClick={() => {
              setSelected(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Barber
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-md border bg-card p-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or specialty"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <BarbersTable
        data={filtered}
        loading={barbersQ.isLoading}
        branches={branches}
        actions={{
          onEdit: (b) => {
            setSelected(b);
            setFormOpen(true);
          },
          onDelete: (b) => {
            setSelected(b);
            setDeleteOpen(true);
          },
        }}
      />

      <BarberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        barber={selected}
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
        title="Delete this barber?"
        description="This permanently removes the staff member. Existing bookings are not affected."
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
