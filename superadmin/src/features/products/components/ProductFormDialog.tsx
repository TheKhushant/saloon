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
import type { Product, ProductInput } from "../types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["Hair Care", "Beard Care", "Skin Care", "Tools"]),
  price: z.coerce.number().nonnegative("Must be 0 or more"),
  totalStock: z.coerce.number().int().nonnegative("Must be 0 or more"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  active: z.boolean(),
  comingSoon: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  name: "",
  category: "Hair Care",
  price: 0,
  totalStock: 0,
  description: "",
  imageUrl: "",
  active: true,
  comingSoon: false,
};

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  submitting: boolean;
  onSubmit: (values: ProductInput) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        product
          ? {
              name: product.name,
              category: product.category,
              price: product.price,
              totalStock: product.totalStock,
              description: product.description ?? "",
              imageUrl: product.imageUrl ?? "",
              active: product.active,
              comingSoon: product.comingSoon,
            }
          : emptyValues
      );
    }
  }, [open, product, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      category: values.category,
      price: values.price,
      totalStock: values.totalStock,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
      active: values.active,
      comingSoon: values.comingSoon,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update this product's details."
              : "Add a new retail product. Assign it to branches afterward from its card."}
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
                    <Input placeholder="Matte Clay Pomade" {...field} />
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hair Care">Hair Care</SelectItem>
                      <SelectItem value="Beard Care">Beard Care</SelectItem>
                      <SelectItem value="Skin Care">Skin Care</SelectItem>
                      <SelectItem value="Tools">Tools</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <FormField
                control={form.control}
                name="totalStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total stock</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Across all branches</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-2 h-16 w-24 overflow-hidden rounded-md border bg-muted">
                      <img
                        src={field.value}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
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
              name="comingSoon"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <FormLabel className="mb-0">Coming soon</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Not released yet — shows a "Coming Soon" badge regardless of stock
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
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <FormLabel className="mb-0">Active</FormLabel>
                    <p className="text-xs text-muted-foreground">Available for sale when on</p>
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
                {product ? "Save changes" : "Add product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
