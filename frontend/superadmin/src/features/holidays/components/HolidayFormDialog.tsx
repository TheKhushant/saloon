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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Holiday, HolidayInput } from "../types";
import type { Branch } from "@/features/branches/types";

const ALL_BRANCHES_OPTION = "all";

const schema = z
  .object({
    date: z.string().min(1, "Date is required"),
    reason: z.string().min(1, "Reason is required"),
    branchId: z.string(),
    closedAllDay: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  })
  .refine((v) => v.closedAllDay || (v.openTime && v.closeTime), {
    message: "Set open and close times, or mark closed all day",
    path: ["openTime"],
  });

type FormValues = z.infer<typeof schema>;

function emptyValues(defaultBranchId?: string, defaultDate?: string): FormValues {
  return {
    date: defaultDate ?? "",
    reason: "",
    branchId: defaultBranchId ?? ALL_BRANCHES_OPTION,
    closedAllDay: true,
    openTime: "",
    closeTime: "",
  };
}

export function HolidayFormDialog({
  open,
  onOpenChange,
  holiday,
  branches,
  defaultBranchId,
  defaultDate,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holiday?: Holiday;
  branches: Branch[];
  defaultBranchId?: string;
  defaultDate?: string;
  submitting: boolean;
  onSubmit: (values: HolidayInput) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues(defaultBranchId, defaultDate),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        holiday
          ? {
              date: holiday.date.slice(0, 10),
              reason: holiday.reason,
              branchId: holiday.branchId ?? ALL_BRANCHES_OPTION,
              closedAllDay: holiday.closedAllDay,
              openTime: holiday.openTime ?? "",
              closeTime: holiday.closeTime ?? "",
            }
          : emptyValues(defaultBranchId, defaultDate)
      );
    }
  }, [open, holiday, defaultBranchId, defaultDate, form]);

  const closedAllDay = form.watch("closedAllDay");

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      date: values.date,
      reason: values.reason,
      branchId: values.branchId === ALL_BRANCHES_OPTION ? undefined : values.branchId,
      closedAllDay: values.closedAllDay,
      openTime: values.closedAllDay ? undefined : values.openTime,
      closeTime: values.closedAllDay ? undefined : values.closeTime,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{holiday ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
          <DialogDescription>
            {holiday ? "Update this closure or special hours." : "Add a closure or special hours for a date."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input placeholder="New Year's Day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ALL_BRANCHES_OPTION}>All branches</SelectItem>
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
              name="closedAllDay"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <FormLabel className="mb-0">Closed all day</FormLabel>
                    <p className="text-xs text-muted-foreground">Turn off to set special hours instead</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            {!closedAllDay && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="openTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opens at</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="closeTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closes at</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {holiday ? "Save changes" : "Add holiday"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
