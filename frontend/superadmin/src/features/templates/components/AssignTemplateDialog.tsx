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
import type { Template, TemplateAssignmentInput } from "../types";
import type { Branch } from "@/features/branches/types";

const schema = z.object({
  branchId: z.string().min(1, "Select a branch"),
  assignedDate: z.string().min(1, "Date is required"),
  status: z.enum(["assigned", "pending"]),
});

type FormValues = z.infer<typeof schema>;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function AssignTemplateDialog({
  open,
  onOpenChange,
  template,
  branches,
  defaultBranchId,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: Template;
  branches: Branch[];
  defaultBranchId?: string;
  submitting: boolean;
  onSubmit: (values: TemplateAssignmentInput) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      branchId: defaultBranchId ?? "",
      assignedDate: today(),
      status: "assigned",
    },
  });

  useEffect(() => {
    if (open) {
      const preset = defaultBranchId
        ? template?.assignments.find((a) => a.branchId === defaultBranchId)
        : undefined;
      form.reset({
        branchId: defaultBranchId ?? "",
        assignedDate: preset?.assignedDate ?? today(),
        status: preset?.status ?? "assigned",
      });
    }
  }, [open, defaultBranchId, template, form]);

  // Prefill with the branch's existing assignment (if any) when the branch
  // selection changes, so re-opening to edit shows current values.
  const branchId = form.watch("branchId");
  useEffect(() => {
    if (!open) return;
    const existing = template?.assignments.find((a) => a.branchId === branchId);
    if (existing) {
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
            {template ? `Assign "${template.name}" to a branch.` : "Assign this template to a branch."}
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
