import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FiltersState {
  q: string;
  from: string;
  to: string;
  barberId: string;
}

export function BookingFilters({
  value,
  onChange,
  barbers,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  barbers: { _id: string; name: string }[];
}) {
  const reset = () => onChange({ q: "", from: "", to: "", barberId: "" });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative min-w-[160px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or ID"
          className="pl-9"
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
        />
      </div>
      <div className="min-w-[140px] flex-1 sm:flex-none">
        <label className="mb-1 block text-xs text-muted-foreground">From</label>
        <Input
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
        />
      </div>
      <div className="min-w-[140px] flex-1 sm:flex-none">
        <label className="mb-1 block text-xs text-muted-foreground">To</label>
        <Input
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
        />
      </div>
      <div className="min-w-[160px] flex-1 sm:flex-none">
        <label className="mb-1 block text-xs text-muted-foreground">Barber</label>
        <Select
          value={value.barberId || "all"}
          onValueChange={(v) => onChange({ ...value, barberId: v === "all" ? "" : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All barbers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All barbers</SelectItem>
            {barbers.map((b) => (
              <SelectItem key={b._id} value={b._id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="ghost" size="sm" onClick={reset}>
        <X className="mr-1 h-4 w-4" /> Clear
      </Button>
    </div>
  );
}
