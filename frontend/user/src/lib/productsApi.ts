const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiProduct {
  id: string;
  name: string;
  category: "HAIR_CARE" | "BEARD_CARE" | "SKIN_CARE" | "TOOLS";
  price: number;
  totalStock: number;
  comingSoon: boolean;
  active: boolean;
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  tag?: string;
  howToUse?: string;
  benefits?: string[];
  ingredients?: string[];
}

export async function fetchPublicProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/public/products`);
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
  return res.json();
}

export const CATEGORY_LABELS: Record<ApiProduct["category"], { label: string; icon: string }> = {
  HAIR_CARE: { label: "Hair Care", icon: "🧴" },
  BEARD_CARE: { label: "Beard Care", icon: "🪒" },
  SKIN_CARE: { label: "Skin & Face Care", icon: "🧖" },
  TOOLS: { label: "Tools", icon: "✂️" },
};
