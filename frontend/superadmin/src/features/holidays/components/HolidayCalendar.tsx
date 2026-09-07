import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Tag, ShoppingBag, IndianRupee, Pencil, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Holiday } from "../types";
import type { Branch } from "@/features/branches/types";
import { getDayStatsForBranches } from "../dayStats";

const ALL_BRANCHES_FILTER = "all";

function parseLocalDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function HolidayCalendar({
  holidays,
  branches,
  onEditHoliday,
}: {
  holidays: Holiday[];
  branches: Branch[];
  onEditHoliday: (holiday: Holiday) => void;
}) {
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [branchFilter, setBranchFilter] = useState<string>(ALL_BRANCHES_FILTER);

  const byDate = useMemo(() => {
    const map = new Map<string, Holiday[]>();
    for (const h of holidays) {
      const key = h.date.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(h);
      map.set(key, list);
    }
    return map;
  }, [holidays]);

  const holidayDates = useMemo(() => [...byDate.keys()].map(parseLocalDate), [byDate]);

  const branchName = (id?: string) =>
    id ? (branches.find((b) => b._id === id)?.name ?? "Unknown branch") : "All branches";

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setBranchFilter(ALL_BRANCHES_FILTER);
  };

  const selectedIso = selectedDate ? toIsoDate(selectedDate) : undefined;
  const holidaysForSelected = selectedIso ? (byDate.get(selectedIso) ?? []) : [];
  const isHoliday = holidaysForSelected.length > 0;

  const dayStats = useMemo(
    () => (selectedIso ? getDayStatsForBranches(selectedIso, branches) : []),
    [selectedIso, branches]
  );

  const displayedStats = useMemo(() => {
    if (branchFilter === ALL_BRANCHES_FILTER) {
      return dayStats.reduce(
        (acc, s) => ({
          customers: acc.customers + s.customers,
          offers: acc.offers + s.offers,
          productsSold: acc.productsSold + s.productsSold,
          totalAmount: acc.totalAmount + s.totalAmount,
          expenses: acc.expenses + s.expenses,
          profit: acc.profit + s.profit,
        }),
        { customers: 0, offers: 0, productsSold: 0, totalAmount: 0, expenses: 0, profit: 0 }
      );
    }
    const found = dayStats.find((s) => s.branchId === branchFilter);
    return found ?? { customers: 0, offers: 0, productsSold: 0, totalAmount: 0, expenses: 0, profit: 0 };
  }, [branchFilter, dayStats]);

  const monthHolidays = [...byDate.entries()]
    .filter(([dateIso]) => {
      const d = parseLocalDate(dateIso);
      return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
    })
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Holiday Calendar</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left: calendar */}
          <div className="lg:shrink-0">
            <div className="w-full overflow-x-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                month={month}
                onMonthChange={setMonth}
                modifiers={{ holiday: holidayDates }}
                modifiersClassNames={{
                  holiday: "rounded-full bg-red-500 text-white font-semibold hover:bg-red-600",
                }}
                className="mx-auto w-fit [--cell-size:2.1rem] text-xs sm:[--cell-size:3rem] sm:text-sm lg:[--cell-size:3.75rem] lg:text-base"
              />
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-4 w-4 shrink-0 rounded-full bg-red-500" />
              Red = holiday. Click a date to see its details.
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Holidays this month</p>
              {monthHolidays.length === 0 && (
                <p className="text-sm text-muted-foreground">No holidays this month.</p>
              )}
              {monthHolidays.map(([dateIso, items]) => (
                <div key={dateIso} className="flex flex-wrap items-center gap-2 rounded-md border p-2 text-sm">
                  <span className="w-14 shrink-0 font-medium">
                    {parseLocalDate(dateIso).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((h) => (
                      <Badge
                        key={h._id}
                        variant="outline"
                        className="cursor-pointer border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => onEditHoliday(h)}
                      >
                        {h.reason} · {branchName(h.branchId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: selected-date detail + branch dropdown + stats */}
          <div className="flex-1">
            {selectedDate && selectedIso ? (
              <div
                className={cn(
                  "rounded-xl border-2 p-4 transition-colors",
                  isHoliday ? "border-red-400 bg-red-50" : "border-emerald-400 bg-emerald-50"
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full text-white",
                        isHoliday ? "bg-red-500" : "bg-emerald-500"
                      )}
                    >
                      <span className="text-lg font-bold leading-none">{selectedDate.getDate()}</span>
                      <span className="text-[10px] uppercase leading-none">
                        {selectedDate.toLocaleDateString(undefined, { month: "short" })}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedDate.toLocaleDateString(undefined, {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className={cn("text-sm font-medium", isHoliday ? "text-red-700" : "text-emerald-700")}>
                        {isHoliday
                          ? `Holiday · ${holidaysForSelected.map((h) => h.reason).join(", ")}`
                          : "Working day"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="mr-1.5 h-3.5 w-3.5" /> View stats
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-[calc(100vw-2rem)] max-w-80">
                        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Branch</p>
                        <Select value={branchFilter} onValueChange={setBranchFilter}>
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL_BRANCHES_FILTER}>All branches</SelectItem>
                            {branches.map((b) => (
                              <SelectItem key={b._id} value={b._id}>
                                {b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div className="rounded-lg border bg-background p-3">
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <IndianRupee className="h-3.5 w-3.5" /> Revenue
                            </p>
                            <p className="text-xl font-semibold">
                              ₹{displayedStats.totalAmount.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="rounded-lg border bg-background p-3">
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              {displayedStats.profit >= 0 ? (
                                <TrendingUp className="h-3.5 w-3.5" />
                              ) : (
                                <TrendingDown className="h-3.5 w-3.5" />
                              )}
                              {displayedStats.profit >= 0 ? "Profit" : "Loss"}
                            </p>
                            <p
                              className={cn(
                                "text-xl font-semibold",
                                displayedStats.profit >= 0 ? "text-emerald-600" : "text-red-600"
                              )}
                            >
                              ₹{Math.abs(displayedStats.profit).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="rounded-lg border bg-background p-3">
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Tag className="h-3.5 w-3.5" /> Offers
                            </p>
                            <p className="text-xl font-semibold">{displayedStats.offers}</p>
                          </div>
                          <div className="rounded-lg border bg-background p-3">
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <ShoppingBag className="h-3.5 w-3.5" /> Product sale
                            </p>
                            <p className="text-xl font-semibold">{displayedStats.productsSold}</p>
                          </div>
                          <div className="rounded-lg border bg-background p-3">
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Users className="h-3.5 w-3.5" /> Customer count
                            </p>
                            <p className="text-xl font-semibold">{displayedStats.customers}</p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <div className="flex flex-col items-end">
                      <span className="text-[11px] text-muted-foreground">
                        {displayedStats.profit >= 0 ? "Profit" : "Loss"}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-base font-semibold",
                          displayedStats.profit >= 0 ? "text-emerald-600" : "text-red-600"
                        )}
                      >
                        {displayedStats.profit >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        ₹{Math.abs(displayedStats.profit).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {isHoliday && (
                      <Button size="sm" variant="outline" onClick={() => onEditHoliday(holidaysForSelected[0])}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit holiday
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed p-8 text-sm text-muted-foreground">
                Select a date to view its details.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
