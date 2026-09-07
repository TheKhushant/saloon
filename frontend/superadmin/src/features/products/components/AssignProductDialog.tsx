import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, ProductAllocationInput } from "../types";
import type { Branch } from "@/features/branches/types";

const schema = z.object({
  branchId: z.string().min(1, "Select a branch"),
  quantity: z.coerce.number().int().positive("Must be greater than 0"),
  assignedDate: z.string().min(1, "Date is required"),
  status: z.enum(["assigned", "pending"]),
});

type FormValues = z.infer<typeof schema>;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function AssignProductDialog({
  open,
  onOpenChange,
  product,
  branches,
  defaultBranchId,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  branches: Branch[];
  defaultBranchId?: string;
  submitting: boolean;
  onSubmit: (values: ProductAllocationInput) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      branchId: defaultBranchId ?? "",
      quantity: 10,
      assignedDate: today(),
      status: "assigned",
    },
  });

  useEffect(() => {
    if (open) {
      const preset = defaultBranchId
        ? product?.allocations.find((a) => a.branchId === defaultBranchId)
        : undefined;
      form.reset({
        branchId: defaultBranchId ?? "",
        quantity: preset?.quantity ?? 10,
        assignedDate: preset?.assignedDate ?? today(),
        status: preset?.status ?? "assigned",
      });
    }
  }, [open, defaultBranchId, product, form]);

  // When the branch selection changes, prefill with that branch's existing
  // allocation (if any) so re-opening to edit shows current values.
  const branchId = form.watch("branchId");
  useEffect(() => {
    if (!open) return;
    const existing = product?.allocations.find((a) => a.branchId === branchId);
    if (existing) {
      form.setValue("quantity", existing.quantity);
      form.setValue("assignedDate", existing.assignedDate);
      form.setValue("status", existing.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to Branch</DialogTitle>
          <DialogDescription>
            {product ? `Assign "${product.name}" stock to a branch.` : "Assign stock to a branch."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of assignment</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
