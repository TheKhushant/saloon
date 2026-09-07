import type { ApprovalStatus } from "@/lib/approval";

export type ProductCategory = "Hair Care" | "Beard Care" | "Skin Care" | "Tools";

export type AllocationStatus = "assigned" | "pending";

export interface ProductAllocation {
  _id: string;
  branchId: string;
  quantity: number;
  assignedDate: string; // ISO date
  status: AllocationStatus;
}

export interface ProductAllocationInput {
  branchId: string;
  quantity: number;
  assignedDate: string;
  status: AllocationStatus;
}

export interface Product {
  _id: string;
  name: string;
  category: ProductCategory;
  price: number;
  totalStock: number;
  comingSoon: boolean; // manual override; product not yet released regardless of stock
  active: boolean;
  approvalStatus: ApprovalStatus;
  description?: string;
  imageUrl?: string;
  rating?: number; // 0-5
  reviewCount?: number;
  tag?: string; // short highlight badge, e.g. "Hair Growth", "Best Seller"
  benefits?: string[];
  howToUse?: string;
  ingredients?: string[];
  allocations: ProductAllocation[]; // per-branch stock assignments
}

export interface ProductInput {
  name: string;
  category: ProductCategory;
  price: number;
  totalStock: number;
  comingSoon: boolean;
  active: boolean;
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  tag?: string;
  benefits?: string[];
  howToUse?: string;
  ingredients?: string[];
}

export type ProductStatus = "available" | "low_stock" | "out_of_stock" | "coming_soon";

export const LOW_STOCK_THRESHOLD = 20;

export function getAssignedQty(product: Product): number {
  return product.allocations.reduce((sum, a) => sum + a.quantity, 0);
}

export function getRemainingQty(product: Product): number {
  return product.totalStock - getAssignedQty(product);
}

export function getProductStatus(product: Product): ProductStatus {
  if (product.comingSoon) return "coming_soon";
  const remaining = getRemainingQty(product);
  if (remaining <= 0) return "out_of_stock";
  if (remaining < LOW_STOCK_THRESHOLD) return "low_stock";
  return "available";
}

export interface StockRequest {
  _id: string;
  productId: string;
  productName: string;
  branchId: string;
  branchName: string;
  requestedAt: string; // ISO datetime
  status: "pending" | "fulfilled";
}
