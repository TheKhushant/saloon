const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiService {
  id: string;
  name: string;
  category?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  description?: string;
  image?: string;
  rating?: number;
  stylists?: number;
  popularity?: number;
  originalPrice?: number;
  tags?: string[];
  benefits?: string[];
}

export async function fetchPublicServices(params?: { category?: string; branchId?: string }): Promise<ApiService[]> {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")) as Record<
          string,
          string
        >
      ).toString()
    : "";
  const res = await fetch(`${API_URL}/public/services${qs}`);
  if (!res.ok) throw new Error(`Failed to load services (${res.status})`);
  return res.json();
}

export async function fetchPublicService(id: string): Promise<ApiService> {
  const res = await fetch(`${API_URL}/public/services/${id}`);
  if (!res.ok) throw new Error(`Failed to load service (${res.status})`);
  return res.json();
}
