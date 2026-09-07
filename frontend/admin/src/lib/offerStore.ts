import type { Offer } from "@/data/mockData";
import { addOfferApi, deleteOfferApi, getOffersApi, updateOfferApi } from "./adminApi";

export async function getOffers(): Promise<Offer[]> {
  return getOffersApi();
}

export async function addOffer(offer: Omit<Offer, "id">): Promise<Offer> {
  return addOfferApi(offer);
}

export async function updateOffer(id: string, updates: Partial<Offer>): Promise<void> {
  return updateOfferApi(id, updates);
}

export async function deleteOffer(id: string): Promise<void> {
  return deleteOfferApi(id);
}
