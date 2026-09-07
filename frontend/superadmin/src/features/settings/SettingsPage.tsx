// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import { PageHeader } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Skeleton } from "@/components/ui/skeleton";
// import { fetchSettings, updateSettings } from "./api";

// const schema = z.object({
//   businessName: z.string().min(1, "Business name is required"),
//   phone: z
//     .string()
//     .min(1, "Phone number is required")
//     .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
//   email: z.string().min(1, "Email is required").email("Enter a valid email address"),
//   address: z.string().min(1, "Address is required"),
//   currency: z.string().min(1, "Currency is required"),
//   timezone: z.string().min(1, "Timezone is required"),
//   openTime: z.string().min(1),
//   closeTime: z.string().min(1),
//   slotDurationMinutes: z.coerce.number().int().positive("Must be greater than 0"),
//   allowOnlineBooking: z.boolean(),
//   requireDepositForBooking: z.boolean(),
// });

// type FormValues = z.infer<typeof schema>;

// const PHONE_COUNTRY_CODE = "+91";

// /** Pulls the last 10 digits out of any stored phone format for the form field. */
// function toPhoneDigits(phone: string): string {
//   return phone.replace(/\D/g, "").slice(-10);
// }

// export default function SettingsPage() {
//   const queryClient = useQueryClient();
//   const settingsQ = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });

//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       businessName: "",
//       phone: "",
//       email: "",
//       address: "",
//       currency: "INR",
//       timezone: "",
//       openTime: "09:00",
//       closeTime: "19:00",
//       slotDurationMinutes: 30,
//       allowOnlineBooking: true,
//       requireDepositForBooking: false,
//     },
//   });

//   useEffect(() => {
//     if (settingsQ.data) {
//       form.reset({ ...settingsQ.data, phone: toPhoneDigits(settingsQ.data.phone) } as FormValues);
//     }
//   }, [settingsQ.data, form]);

//   const saveMutation = useMutation({
//     mutationFn: (values: FormValues) =>
//       updateSettings({ ...values, phone: `${PHONE_COUNTRY_CODE}${values.phone}` }),
//     onSuccess: (data) => {
//       toast.success("Settings saved");
//       queryClient.setQueryData(["settings"], data);
//     },
//     onError: (e: unknown) => toast.error(extractMessage(e, "Failed to save settings")),
//   });

//   if (settingsQ.isLoading) {
//     return (
//       <>
//         <PageHeader title="Settings" description="Business info and booking preferences" />
//         <div className="space-y-4">
//           <Skeleton className="h-48 w-full" />
//           <Skeleton className="h-48 w-full" />
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <PageHeader title="Settings" description="Business info and booking preferences" />
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
//           className="space-y-6"
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle>Business info</CardTitle>
//               <CardDescription>Shown to customers when they book online</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="businessName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Business name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Glam Aura" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone</FormLabel>
//                       <FormControl>
//                         <div className="flex items-center gap-2">
//                           <span className="flex h-9 shrink-0 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
//                             {PHONE_COUNTRY_CODE}
//                           </span>
//                           <Input
//                             inputMode="numeric"
//                             placeholder="9876543210"
//                             maxLength={10}
//                             value={field.value}
//                             onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input type="email" required placeholder="hello@salon.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name="address"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address</FormLabel>
//                     <FormControl>
//                       <Input placeholder="123 Main St, Springfield" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Booking preferences</CardTitle>
//               <CardDescription>Controls how customers can book online</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="openTime"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Opens at</FormLabel>
//                       <FormControl>
//                         <Input type="time" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="closeTime"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Closes at</FormLabel>
//                       <FormControl>
//                         <Input type="time" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="slotDurationMinutes"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Slot duration (min)</FormLabel>
//                       <FormControl>
//                         <Input type="number" min={5} step={5} {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="currency"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Currency</FormLabel>
//                       <FormControl>
//                         <Input placeholder="INR" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name="timezone"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Timezone</FormLabel>
//                     <FormControl>
//                       <Input placeholder="America/New_York" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="allowOnlineBooking"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center justify-between rounded-md border p-3">
//                     <div>
//                       <FormLabel className="mb-0">Allow online booking</FormLabel>
//                       <p className="text-xs text-muted-foreground">
//                         Customers can book appointments themselves
//                       </p>
//                     </div>
//                     <FormControl>
//                       <Switch checked={field.value} onCheckedChange={field.onChange} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="requireDepositForBooking"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center justify-between rounded-md border p-3">
//                     <div>
//                       <FormLabel className="mb-0">Require deposit</FormLabel>
//                       <p className="text-xs text-muted-foreground">
//                         Customers must pay a deposit to confirm a booking
//                       </p>
//                     </div>
//                     <FormControl>
//                       <Switch checked={field.value} onCheckedChange={field.onChange} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//           </Card>

//           <div className="flex justify-end">
//             <Button type="submit" disabled={saveMutation.isPending}>
//               {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Save changes
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </>
//   );
// }

// function extractMessage(err: unknown, fallback: string) {
//   const e = err as { response?: { data?: { message?: string } }; message?: string };
//   return e?.response?.data?.message ?? e?.message ?? fallback;
// }
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSettings, updateSettings } from "./api";

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  address: z.string().min(1, "Address is required"),
  currency: z.string().min(1, "Currency is required"),
  timezone: z.string().min(1, "Timezone is required"),
  openTime: z.string().min(1),
  closeTime: z.string().min(1),
  slotDurationMinutes: z.coerce.number().int().positive("Must be greater than 0"),
  allowOnlineBooking: z.boolean(),
  requireDepositForBooking: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const PHONE_COUNTRY_CODE = "+91";

/** Pulls the last 10 digits out of any stored phone format for the form field. */
function toPhoneDigits(phone: string | null | undefined): string {
  return (phone ?? "").replace(/\D/g, "").slice(-10);
}

const DEFAULT_SETTINGS_FORM: FormValues = {
  businessName: "",
  phone: "",
  email: "",
  address: "",
  currency: "INR",
  timezone: "",
  openTime: "09:00",
  closeTime: "19:00",
  slotDurationMinutes: 30,
  allowOnlineBooking: true,
  requireDepositForBooking: false,
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const settingsQ = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_SETTINGS_FORM,
  });

  useEffect(() => {
    if (settingsQ.data) {
      // Backend fields (phone/email/address, etc.) can come back null on a
      // freshly-created settings record - fall back to defaults so the form
      // never resets with null/undefined values.
      form.reset({
        ...DEFAULT_SETTINGS_FORM,
        ...settingsQ.data,
        phone: toPhoneDigits(settingsQ.data.phone),
        email: settingsQ.data.email ?? DEFAULT_SETTINGS_FORM.email,
        address: settingsQ.data.address ?? DEFAULT_SETTINGS_FORM.address,
      });
    }
  }, [settingsQ.data, form]);

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateSettings({ ...values, phone: `${PHONE_COUNTRY_CODE}${values.phone}` }),
    onSuccess: (data) => {
      toast.success("Settings saved");
      queryClient.setQueryData(["settings"], data);
    },
    onError: (e: unknown) => toast.error(extractMessage(e, "Failed to save settings")),
  });

  if (settingsQ.isLoading) {
    return (
      <>
        <PageHeader title="Settings" description="Business info and booking preferences" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Settings" description="Business info and booking preferences" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Business info</CardTitle>
              <CardDescription>Shown to customers when they book online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business name</FormLabel>
                    <FormControl>
                      <Input placeholder="Glam Aura" {...field} />
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
                        <div className="flex items-center gap-2">
                          <span className="flex h-9 shrink-0 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                            {PHONE_COUNTRY_CODE}
                          </span>
                          <Input
                            inputMode="numeric"
                            placeholder="9876543210"
                            maxLength={10}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          />
                        </div>
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
                        <Input type="email" required placeholder="hello@salon.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Springfield" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking preferences</CardTitle>
              <CardDescription>Controls how customers can book online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="slotDurationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slot duration (min)</FormLabel>
                      <FormControl>
                        <Input type="number" min={5} step={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="INR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <FormControl>
                      <Input placeholder="America/New_York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allowOnlineBooking"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel className="mb-0">Allow online booking</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Customers can book appointments themselves
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requireDepositForBooking"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel className="mb-0">Require deposit</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Customers must pay a deposit to confirm a booking
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

function extractMessage(err: unknown, fallback: string) {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message ?? e?.message ?? fallback;
}