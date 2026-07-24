import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function titleCase(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function NamedBarChart({
  title,
  data,
  loading,
  dataKey = "count",
  nameKey = "name",
  formatLabel,
}: {
  title: string;
  data?: { count: number; [k: string]: string | number }[];
  loading: boolean;
  dataKey?: string;
  nameKey?: string;
  formatLabel?: (v: string) => string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : !data || data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey={nameKey}
                stroke="var(--muted-foreground)"
                fontSize={12}
                width={90}
                tickFormatter={(v) => (formatLabel ? formatLabel(v) : titleCase(String(v)))}
              />
              <Tooltip
                labelFormatter={(v) => (formatLabel ? formatLabel(v as string) : titleCase(String(v)))}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--popover-foreground)",
                }}
              />
              <Bar dataKey={dataKey} fill="var(--primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
