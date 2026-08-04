import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import {
  mockCreateOffer,
  mockDeleteOfferRecord,
  mockFetchOfferList,
  mockUpdateOfferRecord,
} from "@/lib/mock/store";
import type { Offer, OfferInput } from "./types";

export async function fetchOffers(): Promise<Offer[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Offer[]>("/admin/offers");
      return data;
    },
    () => mockFetchOfferList()
  );
}

export async function createOffer(input: OfferInput): Promise<Offer> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Offer>("/admin/offers", input);
      return data;
    },
    () => mockCreateOffer(input)
  );
}

export async function updateOffer(id: string, input: OfferInput): Promise<Offer> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Offer>(`/admin/offers/${id}`, input);
      return data;
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
