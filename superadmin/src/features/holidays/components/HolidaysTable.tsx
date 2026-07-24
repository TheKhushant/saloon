import { useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { Holiday } from "../types";
import type { Branch } from "@/features/branches/types";

function safeDate(iso: string) {
  try {
    return format(parseISO(iso), "EEE, MMM d, yyyy");
  } catch {
    return iso;
  }
}

export interface HolidayActions {
  onEdit: (h: Holiday) => void;
  onDelete: (h: Holiday) => void;
}

export function HolidaysTable({
  data,
  loading,
  branches,
  actions,
}: {
  data: Holiday[];
  loading: boolean;
  branches: Branch[];
  actions: HolidayActions;
}) {
  const branchName = (id?: string) => (id ? branches.find((b) => b._id === id)?.name ?? "—" : "All branches");

  const columns = useMemo<ColumnDef<Holiday>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => safeDate(row.original.date),
      },
      {
        accessorKey: "reason",
        header: "Reason",
      },
      {
        accessorKey: "branchId",
        header: "Branch",
        cell: ({ row }) => <span className="text-sm">{branchName(row.original.branchId)}</span>,
      },
      {
        accessorKey: "closedAllDay",
        header: "Hours",
        cell: ({ row }) =>
          row.original.closedAllDay ? (
            <Badge
              variant="outline"
              className="border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-300"
            >
              Closed all day
            </Badge>
          ) : (
            <span className="text-sm">
              {row.original.openTime} – {row.original.closeTime}
            </span>
          ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const h = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => actions.onEdit(h)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => actions.onDelete(h)} className="text-destructive">
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
            Array.from({ length: 4 }).map((_, i) => (
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
                No holidays scheduled
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
