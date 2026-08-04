import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { MoreHorizontal, Eye, Check, X, CalendarClock, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import type { Booking } from "../types";

function safeDate(iso: string) {
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

export interface BookingActions {
  onView: (b: Booking) => void;
  onConfirm: (b: Booking) => void;
  onCancel: (b: Booking) => void;
  onReschedule: (b: Booking) => void;
  onDelete: (b: Booking) => void;
}

export function BookingsTable({
  data,
  loading,
  actions,
}: {
  data: Booking[];
  loading: boolean;
  actions: BookingActions;
}) {
  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "bookingId",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs">
            {row.original.bookingId ?? row.original._id.slice(-6).toUpperCase()}
          </span>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.customerName}</div>
            <div className="text-xs text-muted-foreground">{row.original.customerPhone}</div>
          </div>
        ),
      },
      { accessorKey: "service", header: "Service" },
      { accessorKey: "barber", header: "Barber" },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            <div>{safeDate(row.original.date)}</div>
            <div className="text-xs text-muted-foreground">{row.original.time}</div>
          </div>
        ),
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => formatCurrency(row.original.total),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
                <DropdownMenuItem onClick={() => actions.onView(b)}>
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
                {b.status !== "confirmed" && b.status !== "cancelled" && (
                  <DropdownMenuItem onClick={() => actions.onConfirm(b)}>
                    <Check className="mr-2 h-4 w-4" /> Confirm
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => actions.onReschedule(b)}>
                  <CalendarClock className="mr-2 h-4 w-4" /> Reschedule
                </DropdownMenuItem>
                {b.status !== "cancelled" && (
                  <DropdownMenuItem onClick={() => actions.onCancel(b)}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => actions.onDelete(b)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [actions]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
            Array.from({ length: 6 }).map((_, i) => (
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
                No bookings found
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
