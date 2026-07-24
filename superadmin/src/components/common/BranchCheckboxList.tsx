import { Checkbox } from "@/components/ui/checkbox";
import type { Branch } from "@/features/branches/types";

export function BranchCheckboxList({
  branches,
  selectedIds,
  onChange,
}: {
  branches: Branch[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string, checked: boolean) => {
    onChange(checked ? [...selectedIds, id] : selectedIds.filter((b) => b !== id));
  };

  return (
    <div className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-2">
      {branches.map((b) => (
        <label key={b._id} className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={selectedIds.includes(b._id)}
            onCheckedChange={(checked) => toggle(b._id, checked === true)}
          />
          {b.name}
        </label>
      ))}
      {branches.length === 0 && (
        <p className="text-sm text-muted-foreground">No branches available</p>
      )}
    </div>
  );
}
