import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { OffersTable } from "./components/OffersTable";
import { OfferFormDialog } from "./components/OfferFormDialog";
import { createOffer, deleteOffer, fetchOffers, updateOffer } from "./api";
import type { Offer, OfferInput } from "./types";

export default function OffersPage() {
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Offer | undefined>();

  const queryClient = useQueryClient();

  const offersQ = useQuery({ queryKey: ["offers"], queryFn: fetchOffers });

  const filtered = useMemo(() => {
    const list = offersQ.data ?? [];
    if (!q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter(
      (o) => o.title.toLowerCase().includes(needle) || o.code.toLowerCase().includes(needle)
    );
  }, [offersQ.data, q]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["offers"] });

  const createMutation = useMutation({
    mutationFn: (input: OfferInput) => createOffer(input),
    onSuccess: () => {
      toast.success("Offer added");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to add offer")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: OfferInput }) => updateOffer(id, input),
    onSuccess: () => {
      toast.success("Offer updated");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update offer")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOffer(id),
    onSuccess: () => {
      toast.success("Offer deleted");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to delete offer")),
  });

  return (
    <>
      <PageHeader
        title="Offers"
        description="Discount codes customers can redeem"
        actions={
          <Button
            onClick={() => {
              setSelected(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Offer
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-md border bg-card p-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or code"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <OffersTable
        data={filtered}
        loading={offersQ.isLoading}
        actions={{
          onEdit: (o) => {
            setSelected(o);
            setFormOpen(true);
          },
          onDelete: (o) => {
            setSelected(o);
            setDeleteOpen(true);
          },
        }}
      />

      <OfferFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        offer={selected}
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
        title="Delete this offer?"
        description="This permanently removes the offer. Customers won't be able to redeem this code anymore."
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
