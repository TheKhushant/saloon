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
import type { Barber, BarberInput } from "../types";
import type { Branch } from "@/features/branches/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  specialties: z.string().optional(),
  branchId: z.string().min(1, "Branch is required"),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function emptyValues(defaultBranchId?: string): FormValues {
  return {
    name: "",
    phone: "",
    email: "",
    specialties: "",
    branchId: defaultBranchId ?? "",
    active: true,
  };
}

export function BarberFormDialog({
  open,
  onOpenChange,
  barber,
  branches,
  defaultBranchId,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: Barber;
  branches: Branch[];
  defaultBranchId?: string;
  submitting: boolean;
  onSubmit: (values: BarberInput) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues(defaultBranchId),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        barber
          ? {
              name: barber.name,
              phone: barber.phone,
              email: barber.email ?? "",
              specialties: barber.specialties?.join(", ") ?? "",
              branchId: barber.branchId,
              active: barber.active,
            }
          : emptyValues(defaultBranchId ?? branches[0]?._id)
      );
    }
  }, [open, barber, defaultBranchId, branches, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      specialties: values.specialties
        ? values.specialties.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
      branchId: values.branchId,
      active: values.active,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{barber ? "Edit Barber" : "Add Barber"}</DialogTitle>
          <DialogDescription>
            {barber ? "Update this staff member's details." : "Add a new staff member who takes bookings."}
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
                    <Input placeholder="Marco Rossi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555 0100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="marco@salon.com" {...field} />
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
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <FormControl>
                    <Input placeholder="Fades, Beard trim, Color" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Comma-separated</p>
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
                    <p className="text-xs text-muted-foreground">Available for new bookings when on</p>
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
                {barber ? "Save changes" : "Add barber"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
