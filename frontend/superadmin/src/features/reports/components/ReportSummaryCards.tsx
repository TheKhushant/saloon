import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import type { ReportSummary } from "../types";

export function ReportSummaryCards({ data, loading }: { data?: ReportSummary; loading: boolean }) {
  const items = [
    { label: "Bookings", value: data ? data.totalBookings.toString() : undefined },
    { label: "Revenue", value: data ? formatCurrency(data.totalRevenue) : undefined },
    { label: "Avg. ticket", value: data ? formatCurrency(data.avgTicket) : undefined },
    { label: "Cancellation rate", value: data ? `${data.cancellationRate}%` : undefined },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</div>
            {loading || !item.value ? (
              <Skeleton className="mt-2 h-7 w-20" />
            ) : (
              <div className="mt-1 text-2xl font-semibold">{item.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
