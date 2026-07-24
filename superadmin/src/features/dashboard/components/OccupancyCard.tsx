import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function OccupancyCard({
  rate,
  loading,
}: {
  rate?: number;
  loading: boolean;
}) {
  const value = Math.round(rate ?? 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Rate</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold">{value}%</span>
              <span className="pb-1 text-sm text-muted-foreground">of slots booked</span>
            </div>
            <Progress value={value} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
