import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL_BRANCHES, useBranch } from "@/context/BranchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { CustomersTable } from "./components/CustomersTable";
import { CustomerFormDialog } from "./components/CustomerFormDialog";
import { createCustomer, deleteCustomer, fetchCustomers, updateCustomer } from "./api";
import type { Customer, CustomerInput } from "./types";

export default function CustomersPage() {
  const { branches, selectedBranchId, selectedBranch } = useBranch();
  const branchId = selectedBranchId === ALL_BRANCHES ? undefined : selectedBranchId;

  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | undefined>();

  const queryClient = useQueryClient();

  const customersQ = useQuery({
    queryKey: ["customers", branchId],
    queryFn: () => fetchCustomers(branchId),
  });

  const filtered = useMemo(() => {
    const list = customersQ.data ?? [];
    if (!q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.phone.includes(needle) ||
        c.email?.toLowerCase().includes(needle)
    );
  }, [customersQ.data, q]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["customers"] });

  const createMutation = useMutation({
    mutationFn: (input: CustomerInput) => createCustomer(input),
    onSuccess: () => {
      toast.success("Customer added");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to add customer")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CustomerInput }) => updateCustomer(id, input),
    onSuccess: () => {
      toast.success("Customer updated");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update customer")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      toast.success("Customer deleted");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to delete customer")),
  });

  return (
    <>
      <PageHeader
        title="Customers"
        description={
          selectedBranch ? `Customers at ${selectedBranch.name}` : "Everyone who has booked with you"
        }
        actions={
          <Button
            onClick={() => {
              setSelected(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-md border bg-card p-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <CustomersTable
        data={filtered}
        loading={customersQ.isLoading}
        branches={branches}
        actions={{
          onEdit: (c) => {
            setSelected(c);
            setFormOpen(true);
          },
          onDelete: (c) => {
            setSelected(c);
            setDeleteOpen(true);
          },
        }}
      />

      <CustomerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={selected}
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
        title="Delete this customer?"
        description="This permanently removes the customer record. Existing bookings are not affected."
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
