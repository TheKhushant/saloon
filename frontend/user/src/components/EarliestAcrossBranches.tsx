import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Zap, Loader2 } from "lucide-react";
import { fetchEarliestAvailability, type EarliestSlot } from "@/lib/bookingApi";

export function EarliestAcrossBranches({
  serviceId,
  onPick,
}: {
  serviceId: string;
  onPick: (slot: EarliestSlot) => void;
}) {
  const [slots, setSlots] = useState<EarliestSlot[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    setLoading(true);
    fetchEarliestAvailability(serviceId)
      .then((data) => {
        if (!cancelled) setSlots(data);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  if (loading) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Checking earliest availability across branches...
      </p>
    );
  }

  if (!slots || slots.length === 0) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
        <Zap className="h-3.5 w-3.5" /> Earliest availability by branch
      </p>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot.branchId}
            type="button"
            onClick={() => onPick(slot)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:bg-primary/10"
          >
            {slot.branchName} · {format(parseISO(slot.date), "EEE, MMM d")} at {formatTime(slot.time)}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
