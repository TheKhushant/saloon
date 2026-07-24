import { useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { Barber } from "../types";
import type { Branch } from "@/features/branches/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export interface BarberActions {
  onEdit: (b: Barber) => void;
  onDelete: (b: Barber) => void;
}

export function BarbersTable({
  data,
  loading,
  branches,
  actions,
}: {
  data: Barber[];
  loading: boolean;
  branches: Branch[];
  actions: BarberActions;
}) {
  const branchName = (id: string) => branches.find((b) => b._id === id)?.name ?? "—";

  const columns = useMemo<ColumnDef<Barber>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Barber",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              {row.original.specialties && row.original.specialties.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {row.original.specialties.join(", ")}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "branchId",
        header: "Branch",
        cell: ({ row }) => <span className="text-sm">{branchName(row.original.branchId)}</span>,
      },
      {
        accessorKey: "phone",
        header: "Contact",
        cell: ({ row }) => (
          <div>
            <div>{row.original.phone}</div>
            {row.original.email && (
              <div className="text-xs text-muted-foreground">{row.original.email}</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.original.active
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "border-zinc-500/30 bg-zinc-500/15 text-zinc-700 dark:text-zinc-300"
            }
          >
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const b = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => actions.onEdit(b)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => actions.onDelete(b)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [actions, branches]
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((_c, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                No barbers found
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
