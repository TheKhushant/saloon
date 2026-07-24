import { formatDistanceToNow } from "date-fns";
import { Bell, Check, PackageSearch } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fetchStockRequests, fulfillStockRequest } from "../api";

export function StockRequestsPanel() {
  const queryClient = useQueryClient();
  const requestsQ = useQuery({ queryKey: ["stock-requests"], queryFn: fetchStockRequests });

  const pending = (requestsQ.data ?? []).filter((r) => r.status === "pending");

  const fulfillMutation = useMutation({
    mutationFn: (id: string) => fulfillStockRequest(id),
    onSuccess: () => {
      toast.success("Marked as fulfilled");
      queryClient.invalidateQueries({ queryKey: ["stock-requests"] });
    },
    onError: () => toast.error("Failed to update request"),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="mr-2 h-4 w-4" />
          Stock Requests
          {pending.length > 0 && (
            <Badge className="ml-2 h-5 min-w-5 justify-center rounded-full px-1.5">
              {pending.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Stock Requests</SheetTitle>
          <SheetDescription>
            Branches asking for more stock once their allocation runs low.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {(requestsQ.data ?? []).length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
              <PackageSearch className="h-8 w-8" />
              <p className="text-sm">No stock requests yet</p>
            </div>
          ) : (
            requestsQ.data!.map((r) => (
              <div key={r._id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{r.productName}</div>
                    <div className="text-xs text-muted-foreground">{r.branchName}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      r.status === "pending"
                        ? "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                        : "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    }
                  >
                    {r.status === "pending" ? "Pending" : "Fulfilled"}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(r.requestedAt), { addSuffix: true })}
                  </span>
                  {r.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={fulfillMutation.isPending}
                      onClick={() => fulfillMutation.mutate(r._id)}
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Mark fulfilled
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
