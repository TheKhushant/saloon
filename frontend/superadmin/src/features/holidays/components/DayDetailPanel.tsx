import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Package, ShoppingBag, Tag, Users, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { fetchBookings } from "@/features/bookings/api";
import { fetchOffers } from "@/features/offers/api";
import { fetchProducts } from "@/features/products/api";
import type { Holiday } from "../types";
import type { Branch } from "@/features/branches/types";

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border bg-background p-3 text-center">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="text-base font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function DayDetailPanel({
  date,
  holiday,
  branches,
}: {
  date: Date;
  holiday?: Holiday;
  branches: Branch[];
}) {
  const dateIso = toIsoDate(date);
  const [activeBranchId, setActiveBranchId] = useState<string | undefined>();

  const bookingsQ = useQuery({
    queryKey: ["day-detail-bookings", dateIso],
    queryFn: () => fetchBookings({ from: dateIso, to: dateIso, pageSize: 1000 }),
  });
  const offersQ = useQuery({
    queryKey: ["day-detail-offers"],
    queryFn: () => fetchOffers(),
  });
  const productsQ = useQuery({
    queryKey: ["day-detail-products"],
    queryFn: () => fetchProducts(),
  });

  const bookings = bookingsQ.data?.data ?? [];
  const products = productsQ.data ?? [];

  const activeOffersCount = useMemo(
    () =>
      (offersQ.data ?? []).filter((o) => o.active && (!o.expiresAt || o.expiresAt.slice(0, 10) >= dateIso))
        .length,
    [offersQ.data, dateIso]
  );

  const totalCustomers = useMemo(() => {
    const set = new Set(bookings.map((b) => b.customerPhone || b.customerName));
    return set.size;
  }, [bookings]);

  const branchStats = useMemo(() => {
    if (!activeBranchId) return undefined;
    const branchBookings = bookings.filter((b) => b.branchId === activeBranchId);
    const customers = new Set(branchBookings.map((b) => b.customerPhone || b.customerName)).size;
    const salesCount = branchBookings.filter(
      (b) => b.status === "completed" || b.status === "confirmed"
    ).length;
    const totalAmount = branchBookings.reduce((sum, b) => sum + (b.total || 0), 0);
    const productsAssigned = products.reduce((sum, p) => {
      const qty = p.allocations
        .filter((a) => a.branchId === activeBranchId && a.assignedDate.slice(0, 10) === dateIso)
        .reduce((s, a) => s + a.quantity, 0);
      return sum + qty;
    }, 0);
    return { customers, salesCount, totalAmount, productsAssigned };
  }, [activeBranchId, bookings, products, dateIso]);

  const selectedBranch = branches.find((b) => b._id === activeBranchId);
  const loading = bookingsQ.isLoading || offersQ.isLoading || productsQ.isLoading;

  return (
    <Card className={cn("border-2 transition-colors", holiday ? "border-red-500" : "border-green-500")}>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white",
              holiday ? "bg-red-500" : "bg-green-500"
            )}
          >
            {date.getDate()}
          </div>

          <div>
            <p className="text-sm font-medium">
              {date.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {holiday ? (
              <Badge className="mt-1 bg-red-500 hover:bg-red-500">Holiday · {holiday.reason}</Badge>
            ) : (
              <Badge variant="outline" className="mt-1 border-green-500 text-green-700">
                Working day
              </Badge>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{totalCustomers}</span>
              <span className="text-muted-foreground">customers</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{branches.length}</span>
              <span className="text-muted-foreground">branches</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {branches.map((b) => (
            <button
              key={b._id}
              type="button"
              onClick={() => setActiveBranchId((cur) => (cur === b._id ? undefined : b._id))}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeBranchId === b._id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:bg-accent"
              )}
            >
              {b.name}
            </button>
          ))}
        </div>

        {activeBranchId && (
          <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <p className="mb-3 text-sm font-medium">
              {selectedBranch?.name} — {dateIso}
            </p>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading tally…</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <Stat icon={Users} label="Customers" value={branchStats?.customers ?? 0} />
                <Stat icon={Tag} label="Offers" value={activeOffersCount} />
                <Stat icon={ShoppingBag} label="Sales" value={branchStats?.salesCount ?? 0} />
                <Stat icon={Package} label="Products" value={branchStats?.productsAssigned ?? 0} />
                <Stat
                  icon={Wallet}
                  label="Total Amount"
                  value={formatCurrency(branchStats?.totalAmount ?? 0)}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
