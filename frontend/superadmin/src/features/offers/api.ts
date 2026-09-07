import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { withId } from "@/lib/normalizeId";
import {
  mockCreateOffer,
  mockDeleteOfferRecord,
  mockFetchOfferList,
  mockUpdateOfferRecord,
} from "@/lib/mock/store";
import type { Offer, OfferInput } from "./types";

// The backend serializes DiscountType as the Java enum name ("PERCENTAGE" /
// "FIXED") and the primary key as `id`, but this app's existing types/UI
// use lowercase discount types ("percentage" / "fixed") and `_id` - only
// applied to data coming back from the REAL API; mock data already uses
// this app's convention and passes through unchanged.
function normalizeOffer(offer: Offer): Offer {
  return withId({
    ...offer,
    discountType: (String(offer.discountType).toLowerCase() as Offer["discountType"]),
  });
}

export async function fetchOffers(): Promise<Offer[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Offer[]>("/admin/offers");
      return data.map(normalizeOffer);
    },
    () => mockFetchOfferList()
  );
}

export async function createOffer(input: OfferInput): Promise<Offer> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Offer>("/admin/offers", input);
      return normalizeOffer(data);
    },
    () => mockCreateOffer(input)
  );
}

export async function updateOffer(id: string, input: OfferInput): Promise<Offer> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Offer>(`/admin/offers/${id}`, input);
      return normalizeOffer(data);
    },
    () => mockUpdateOfferRecord(id, input)
  );
}

export async function deleteOffer(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/offers/${id}`);
    },
    () => mockDeleteOfferRecord(id)
  );
}

export async function approveOffer(id: string): Promise<Offer> {
  const { data } = await api.patch<Offer>(`/admin/offers/${id}/approve`);
  return normalizeOffer(data);
}

export async function rejectOffer(id: string): Promise<Offer> {
  const { data } = await api.patch<Offer>(`/admin/offers/${id}/reject`);
  return normalizeOffer(data);
}
