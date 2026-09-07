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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEMPLATE_CATEGORIES, STATUS_META, type Template, type TemplateInput } from "../types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["Modern", "Classic", "Luxury", "Industrial", "Minimalist", "Premium"]),
  status: z.enum(["active", "draft", "featured", "archived"]),
  description: z.string().optional(),
  suitableFor: z.string().min(1, "Required"),
  budgetMin: z.coerce.number().nonnegative(),
  budgetMax: z.coerce.number().nonnegative(),
  setupDays: z.coerce.number().int().positive(),
  rating: z.coerce.number().min(0).max(5),
  imageUrl: z.string().optional(),
  additionalImages: z.string().optional(),
  beforeImageUrl: z.string().optional(),
  afterImageUrl: z.string().optional(),
  themeColors: z.string().optional(),
  furniture: z.string().optional(),
  tags: z.string().optional(),
  furnitureCost: z.coerce.number().nonnegative(),
  mirrorCost: z.coerce.number().nonnegative(),
  lightingCost: z.coerce.number().nonnegative(),
  paintingCost: z.coerce.number().nonnegative(),
});

type FormValues = z.infer<typeof schema>;

function splitList(s?: string): string[] {
  return (s ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function emptyValues(): FormValues {
  return {
    name: "",
    category: "Modern",
    status: "draft",
    description: "",
    suitableFor: "Men's Salon",
    budgetMin: 150000,
    budgetMax: 300000,
    setupDays: 10,
    rating: 4.5,
    imageUrl: "",
    additionalImages: "",
    beforeImageUrl: "",
    afterImageUrl: "",
    themeColors: "",
    furniture: "",
    tags: "",
    furnitureCost: 0,
    mirrorCost: 0,
    lightingCost: 0,
    paintingCost: 0,
  };
}

function costOf(items: { label: string; amount: number }[], label: string): number {
  return items.find((c) => c.label === label)?.amount ?? 0;
}

export function TemplateFormDialog({
  open,
  onOpenChange,
  template,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: Template;
  submitting: boolean;
  onSubmit: (values: TemplateInput) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (open) {
      form.reset(
        template
          ? {
              name: template.name,
              category: template.category,
              status: template.status,
              description: template.description ?? "",
              suitableFor: template.suitableFor,
              budgetMin: template.budgetMin,
              budgetMax: template.budgetMax,
              setupDays: template.setupDays,
              rating: template.rating,
              imageUrl: template.imageUrl ?? "",
              additionalImages: template.images.filter((i) => i !== template.imageUrl).join(", "),
              beforeImageUrl: template.beforeImageUrl ?? "",
              afterImageUrl: template.afterImageUrl ?? "",
              themeColors: template.themeColors.join(", "),
              furniture: template.furniture.join(", "),
              tags: template.tags.join(", "),
              furnitureCost: costOf(template.costBreakdown, "Furniture"),
              mirrorCost: costOf(template.costBreakdown, "Mirror"),
              lightingCost: costOf(template.costBreakdown, "Lighting"),
              paintingCost: costOf(template.costBreakdown, "Painting"),
            }
          : emptyValues()
      );
    }
  }, [open, template, form]);

  const handleSubmit = (values: FormValues) => {
    const gallery = [values.imageUrl, ...splitList(values.additionalImages)].filter(
      (v): v is string => !!v
    );
    onSubmit({
      name: values.name,
      category: values.category,
      status: values.status,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
      images: gallery,
      beforeImageUrl: values.beforeImageUrl || undefined,
      afterImageUrl: values.afterImageUrl || undefined,
      suitableFor: values.suitableFor,
      budgetMin: values.budgetMin,
      budgetMax: values.budgetMax,
      setupDays: values.setupDays,
      rating: values.rating,
      themeColors: splitList(values.themeColors),
      furniture: splitList(values.furniture),
      tags: splitList(values.tags),
      costBreakdown: [
        { label: "Furniture", amount: values.furnitureCost },
        { label: "Mirror", amount: values.mirrorCost },
        { label: "Lighting", amount: values.lightingCost },
        { label: "Painting", amount: values.paintingCost },
      ],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Template" : "Add Template"}</DialogTitle>
          <DialogDescription>
            {template
              ? "Update this interior design template."
              : "Add a new salon interior/setup template. Assign it to branches afterward from its card."}
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
                    <Input placeholder="Modern Minimalist Lounge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        {TEMPLATE_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
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
                        {Object.entries(STATUS_META).map(([key, meta]) => (
                          <SelectItem key={key} value={key}>
                            {meta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Short description of the look" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="suitableFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suitable for</FormLabel>
                    <FormControl>
                      <Input placeholder="Men's Salon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="setupDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setup time (days)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget min (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget max (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={5} step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-md border p-3">
              <div className="mb-2 text-sm font-medium">Estimated cost breakdown (₹)</div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="furnitureCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Furniture</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mirrorCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Mirror</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lightingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Lighting</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paintingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Painting</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="furniture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furniture list</FormLabel>
                  <FormControl>
                    <Input placeholder="Barber chairs, Wash station, Reception desk" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Comma-separated</p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="themeColors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme colors</FormLabel>
                  <FormControl>
                    <Input placeholder="#1c1c1c, #f5f0e8, #a68a64" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Comma-separated hex codes</p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Modern, Trending, Best Seller" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Comma-separated</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional gallery images</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="https://..., https://..." {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Comma-separated URLs, shown in Preview</p>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="beforeImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Before photo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="afterImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>After photo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {template ? "Save changes" : "Add template"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
