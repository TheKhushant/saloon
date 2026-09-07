const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiOffer {
  id: string;
  title: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  active: boolean;
  expiresAt?: string;
  description?: string;
}

export async function fetchPublicOffers(): Promise<ApiOffer[]> {
  const res = await fetch(`${API_URL}/public/offers`);
  if (!res.ok) throw new Error(`Failed to load offers (${res.status})`);
  return res.json();
}

export async function validateOfferCode(code: string): Promise<ApiOffer> {
  const res = await fetch(`${API_URL}/public/offers/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `That offer code isn't valid (${res.status})`);
  return data;
}
