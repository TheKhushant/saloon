export type DiscountType = "percentage" | "fixed";

export interface Offer {
  _id: string;
  title: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  active: boolean;
  expiresAt?: string; // ISO date
  description?: string;
}

export interface OfferInput {
  title: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  active: boolean;
  expiresAt?: string;
  description?: string;
}
