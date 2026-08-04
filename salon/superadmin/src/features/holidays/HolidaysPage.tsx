import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL_BRANCHES, useBranch } from "@/context/BranchContext";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { HolidaysTable } from "./components/HolidaysTable";
import { HolidayFormDialog } from "./components/HolidayFormDialog";
import { HolidayCalendar } from "./components/HolidayCalendar";
import { createHoliday, deleteHoliday, fetchHolidays, updateHoliday } from "./api";
import type { Holiday, HolidayInput } from "./types";

export default function HolidaysPage() {
  const { branches, selectedBranchId, selectedBranch } = useBranch();
  const branchId = selectedBranchId === ALL_BRANCHES ? undefined : selectedBranchId;

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Holiday | undefined>();
  const [calendarDate, setCalendarDate] = useState<string | undefined>();

  const queryClient = useQueryClient();

  const holidaysQ = useQuery({
    queryKey: ["holidays", branchId],
    queryFn: () => fetchHolidays(branchId),
  });

  const sorted = useMemo(
    () => [...(holidaysQ.data ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
    [holidaysQ.data]
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["holidays"] });

  const createMutation = useMutation({
    mutationFn: (input: HolidayInput) => createHoliday(input),
    onSuccess: () => {
      toast.success("Holiday added");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to add holiday")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: HolidayInput }) => updateHoliday(id, input),
    onSuccess: () => {
      toast.success("Holiday updated");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update holiday")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHoliday(id),
    onSuccess: () => {
      toast.success("Holiday removed");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to remove holiday")),
  });

  return (
    <>
      <PageHeader
        title="Holidays & Timings"
        description={
          selectedBranch
            ? `Closures and special hours at ${selectedBranch.name}`
            : "Closures and special hours that block out booking slots"
        }
        actions={
          <Button
            onClick={() => {
              setSelected(undefined);
              setCalendarDate(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Holiday
          </Button>
        }
      />

      <div className="mb-6">
        <HolidayCalendar
          holidays={sorted}
          branches={branches}
          onEditHoliday={(h) => {
            setSelected(h);
            setCalendarDate(undefined);
            setFormOpen(true);
          }}
        />
      </div>

      <HolidaysTable
        data={sorted}
        loading={holidaysQ.isLoading}
        branches={branches}
        actions={{
          onEdit: (h) => {
            setSelected(h);
            setCalendarDate(undefined);
            setFormOpen(true);
          },
          onDelete: (h) => {
            setSelected(h);
            setDeleteOpen(true);
          },
        }}
      />

      <HolidayFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        holiday={selected}
        branches={branches}
        defaultBranchId={branchId}
        defaultDate={calendarDate}
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
        title="Remove this holiday?"
        description="Booking slots on this date will reopen to customers."
        confirmText="Remove"
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
