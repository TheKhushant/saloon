import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { BookingFilters, type FiltersState } from "./components/BookingFilters";
import { BookingsTable } from "./components/BookingsTable";
import { BookingDetailsDialog } from "./components/BookingDetailsDialog";
import { RescheduleDialog } from "./components/RescheduleDialog";
import {
  deleteBooking,
  fetchBarbers,
  fetchBookings,
  rescheduleBooking,
  updateBookingStatus,
} from "./api";
import type { Booking, BookingsQuery, BookingStatus } from "./types";

type TabKey = "today" | "upcoming" | "past" | "confirmed" | "cancelled";

const TABS: { key: TabKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

const PAGE_SIZE = 20;

export default function BookingsPage() {
  const [tab, setTab] = useState<TabKey>("today");
  const [filters, setFilters] = useState<FiltersState>({ q: "", from: "", to: "", barberId: "" });
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Booking | undefined>();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const query = useMemo<BookingsQuery>(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const base: BookingsQuery = {
      q: filters.q || undefined,
      barberId: filters.barberId || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      page,
      pageSize: PAGE_SIZE,
    };
    switch (tab) {
      case "today":
        return { ...base, from: base.from ?? today, to: base.to ?? today };
      case "upcoming":
        return { ...base, from: base.from ?? today };
      case "past":
        return { ...base, to: base.to ?? today };
      case "confirmed":
        return { ...base, status: "confirmed" satisfies BookingStatus };
      case "cancelled":
        return { ...base, status: "cancelled" satisfies BookingStatus };
    }
  }, [tab, filters, page]);

  const bookingsQ = useQuery({
    queryKey: ["bookings", query],
    queryFn: () => fetchBookings(query),
  });

  const barbersQ = useQuery({ queryKey: ["barbers"], queryFn: fetchBarbers });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["bookings"] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateBookingStatus(id, status),
    onSuccess: () => {
      toast.success("Booking updated");
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to update")),
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, date, time }: { id: string; date: string; time: string }) =>
      rescheduleBooking(id, date, time),
    onSuccess: () => {
      toast.success("Booking rescheduled");
      setRescheduleOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to reschedule")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      toast.success("Booking deleted");
      setDeleteOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to delete")),
  });

  const totalPages = bookingsQ.data
    ? Math.max(1, Math.ceil(bookingsQ.data.total / PAGE_SIZE))
    : 1;

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Manage all customer appointments"
      />

      <Tabs value={tab} onValueChange={(v) => { setTab(v as TabKey); setPage(1); }}>
        <TabsList className="mb-4 flex flex-wrap">
          {TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mb-4 rounded-md border bg-card p-4">
        <BookingFilters
          value={filters}
          onChange={(v) => { setFilters(v); setPage(1); }}
          barbers={barbersQ.data ?? []}
        />
      </div>

      <BookingsTable
        data={bookingsQ.data?.data ?? []}
        loading={bookingsQ.isLoading}
        actions={{
          onView: (b) => { setSelected(b); setDetailsOpen(true); },
          onConfirm: (b) =>
            statusMutation.mutate({ id: b._id, status: "confirmed" }),
          onCancel: (b) => { setSelected(b); setCancelOpen(true); },
          onReschedule: (b) => { setSelected(b); setRescheduleOpen(true); },
          onDelete: (b) => { setSelected(b); setDeleteOpen(true); },
        }}
      />

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {page} of {totalPages} • {bookingsQ.data?.total ?? 0} bookings
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || bookingsQ.isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || bookingsQ.isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <BookingDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        booking={selected}
      />
      <RescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        booking={selected}
        submitting={rescheduleMutation.isPending}
        onSubmit={(values) =>
          selected &&
          rescheduleMutation.mutate({ id: selected._id, date: values.date, time: values.time })
        }
      />
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel this booking?"
        description="The customer will be notified. This action can be reversed by confirming again."
        confirmText="Cancel Booking"
        destructive
        onConfirm={() => {
          if (selected) {
            statusMutation.mutate(
              { id: selected._id, status: "cancelled" },
              { onSettled: () => setCancelOpen(false) }
            );
          }
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this booking?"
        description="This permanently removes the booking record."
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
