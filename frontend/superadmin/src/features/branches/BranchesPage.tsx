import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { BranchesTable } from "./components/BranchesTable";
import { BranchFormDialog } from "./components/BranchFormDialog";
import { CreateAdminDialog } from "@/features/admins/components/CreateAdminDialog";
import { createBranch, deleteBranch, fetchBranches, updateBranch } from "./api";
import { registerBranchAdmin } from "@/features/admins/api";
import type { Branch, BranchInput } from "./types";

export default function BranchesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [selected, setSelected] = useState<Branch | undefined>();

  const queryClient = useQueryClient();

  const branchesQ = useQuery({ queryKey: ["branches"], queryFn: fetchBranches });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["branches"] });

  const createMutation = useMutation({
    mutationFn: (input: BranchInput) => createBranch(input),
    onSuccess: () => {
      toast.success("Branch added");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to add branch")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: BranchInput }) => updateBranch(id, input),
    onSuccess: () => {
      toast.success("Branch updated");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update branch")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBranch(id),
    onSuccess: () => {
      toast.success("Branch deleted");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to delete branch")),
  });

  const createAdminMutation = useMutation({
    mutationFn: (values: { name: string; email: string; password: string }) => {
      if (!selected) throw new Error("No branch selected");
      return registerBranchAdmin({ ...values, branchId: selected._id });
    },
    onSuccess: (_data, values) => {
      toast.success(`Admin login created for ${selected?.name}`, {
        description: values.email,
      });
      setAdminOpen(false);
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to create admin login")),
  });

  return (
    <>
      <PageHeader
        title="Branches"
        description="Manage branches and create their admin logins"
        actions={
          <Button
            onClick={() => {
              setSelected(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Branch
          </Button>
        }
      />

      <BranchesTable
        data={branchesQ.data ?? []}
        loading={branchesQ.isLoading}
        actions={{
          onEdit: (b) => {
            setSelected(b);
            setFormOpen(true);
          },
          onDelete: (b) => {
            setSelected(b);
            setDeleteOpen(true);
          },
          onCreateAdmin: (b) => {
            setSelected(b);
            setAdminOpen(true);
          },
        }}
      />

      <BranchFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        branch={selected}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) =>
          selected
            ? updateMutation.mutate({ id: selected._id, input: values })
            : createMutation.mutate(values)
        }
      />

      <CreateAdminDialog
        open={adminOpen}
        onOpenChange={setAdminOpen}
        branch={selected}
        submitting={createAdminMutation.isPending}
        onSubmit={(values) => createAdminMutation.mutate(values)}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this branch?"
        description="This permanently removes the branch. It does not delete any admin logins already created for it."
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
