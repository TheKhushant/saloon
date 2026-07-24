export type TemplateCategory = "Modern" | "Classic" | "Luxury" | "Industrial" | "Minimalist" | "Premium";

export type TemplateStatus = "active" | "draft" | "featured" | "archived";

export interface TemplateCostItem {
  label: string;
  amount: number;
}

export interface Template {
  _id: string;
  name: string;
  category: TemplateCategory;
  status: TemplateStatus;
  description?: string;
  imageUrl?: string;
  images: string[]; // gallery shown in the preview modal
  beforeImageUrl?: string;
  afterImageUrl?: string;
  branchIds: string[]; // branches this template is assigned to
  suitableFor: string;
  budgetMin: number;
  budgetMax: number;
  setupDays: number;
  rating: number; // 0-5
  version: string;
  updatedAt: string; // ISO datetime
  createdBy: string;
  themeColors: string[]; // hex codes
  furniture: string[];
  costBreakdown: TemplateCostItem[];
  tags: string[];
  favorite: boolean;
}

export interface TemplateInput {
  name: string;
  category: TemplateCategory;
  status: TemplateStatus;
  description?: string;
  imageUrl?: string;
  images: string[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
  suitableFor: string;
  budgetMin: number;
  budgetMax: number;
  setupDays: number;
  rating: number;
  themeColors: string[];
  furniture: string[];
  costBreakdown: TemplateCostItem[];
  tags: string[];
}

export function getEstimatedCost(t: Template): number {
  return t.costBreakdown.reduce((sum, c) => sum + c.amount, 0);
}

export const STATUS_META: Record<TemplateStatus, { label: string; dot: string; badgeClass: string }> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    badgeClass: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  draft: {
    label: "Draft",
    dot: "bg-amber-500",
    badgeClass: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  featured: {
    label: "Featured",
    dot: "bg-sky-500",
    badgeClass: "border-sky-500/30 bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  archived: {
    label: "Archived",
    dot: "bg-rose-500",
    badgeClass: "border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Modern",
  "Classic",
  "Luxury",
  "Industrial",
  "Minimalist",
  "Premium",
];
