import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import type { Booking } from "../types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function safeDate(iso?: string) {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "PPP");
  } catch {
    return iso;
  }
}

export function BookingDetailsDialog({
  open,
  onOpenChange,
  booking,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            {booking?.bookingId ?? booking?._id ?? ""}
          </DialogDescription>
        </DialogHeader>
        {booking && (
          <div className="space-y-1">
            <Row label="Customer" value={booking.customerName} />
            <Row label="Phone" value={booking.customerPhone} />
            {booking.customerEmail && <Row label="Email" value={booking.customerEmail} />}
            <Separator className="my-2" />
            <Row label="Service" value={booking.service} />
            <Row label="Barber" value={booking.barber} />
            <Row label="Date" value={safeDate(booking.date)} />
            <Row label="Time" value={booking.time} />
            <Row label="Total" value={formatCurrency(booking.total)} />
            <Row label="Status" value={<StatusBadge status={booking.status} />} />
            {booking.notes && (
              <>
                <Separator className="my-2" />
                <div className="text-sm">
                  <div className="text-muted-foreground">Notes</div>
                  <p className="mt-1">{booking.notes}</p>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
