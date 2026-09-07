import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/features/bookings/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function safeDate(iso: string) {
  try {
    return format(parseISO(iso), "MMM d");
  } catch {
    return iso;
  }
}

export function UpcomingAppointments({
  bookings,
  loading,
}: {
  bookings?: Booking[];
  loading: boolean;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No upcoming appointments
          </div>
        ) : (
          <ul className="divide-y">
            {bookings.map((b) => (
              <li key={b._id} className="flex items-center gap-3 py-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials(b.customerName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{b.customerName}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {b.service} • {b.barber}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-medium">{b.time}</div>
                  <div className="text-xs text-muted-foreground">{safeDate(b.date)}</div>
                </div>
                <Badge variant="secondary" className="shrink-0 capitalize">
                  {b.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
