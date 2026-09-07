import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  Active: "bg-status-active/15 text-status-active border-status-active/30",
  Confirmed: "bg-status-active/15 text-status-active border-status-active/30",
  Paused: "bg-status-paused/15 text-status-paused border-status-paused/30",
  Pending: "bg-status-paused/15 text-status-paused border-status-paused/30",
  Disabled: "bg-status-disabled/15 text-status-disabled border-status-disabled/30",
  Completed: "bg-status-disabled/15 text-status-disabled border-status-disabled/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  Blocked: "bg-destructive/15 text-destructive border-destructive/30",
  Approved: "bg-status-active/15 text-status-active border-status-active/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-body text-xs font-medium", statusStyles[status] || "")}
    >
      {status}
    </Badge>
  );
}
