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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_BRANCHES } from "@/context/BranchContext";
import type { Service, ServiceInput } from "../types";
import type { Branch } from "@/features/branches/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  durationMinutes: z.coerce.number().int().positive("Must be greater than 0"),
  price: z.coerce.number().nonnegative("Must be 0 or more"),
  active: z.boolean(),
  description: z.string().optional(),
  branchId: z.string(),
});

type FormValues = z.infer<typeof schema>;

function emptyValues(defaultBranchId?: string): FormValues {
  return {
    name: "",
    category: "",
    durationMinutes: 30,
    price: 0,
    active: true,
    description: "",
    branchId: defaultBranchId ?? ALL_BRANCHES,
  };
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  branches,
  defaultBranchId,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service;
  branches: Branch[];
  defaultBranchId?: string;
  submitting: boolean;
  onSubmit: (values: ServiceInput) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues(defaultBranchId),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        service
          ? {
              name: service.name,
              category: service.category ?? "",
              durationMinutes: service.durationMinutes,
              price: service.price,
              active: service.active,
              description: service.description ?? "",
              branchId: service.branchId ?? ALL_BRANCHES,
            }
          : emptyValues(defaultBranchId)
      );
    }
  }, [open, service, defaultBranchId, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      category: values.category,
      durationMinutes: values.durationMinutes,
      price: values.price,
      active: values.active,
      description: values.description,
      branchId: values.branchId === ALL_BRANCHES ? undefined : values.branchId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle>
          <DialogDescription>
            {service ? "Update this service's details." : "Add a new service customers can book."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Haircut" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Hair" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                      <SelectItem value={ALL_BRANCHES}>All Branches</SelectItem>
                      {branches.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose a branch to offer this service there only, or leave as All Branches.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Optional details shown to customers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <FormLabel className="mb-0">Active</FormLabel>
                    <p className="text-xs text-muted-foreground">Visible for booking when on</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {service ? "Save changes" : "Add service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
