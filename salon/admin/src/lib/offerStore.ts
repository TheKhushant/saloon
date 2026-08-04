import { offers as seedOffers, type Offer } from "@/data/mockData";

const STORAGE_KEY = "admin_offers";
const VERSION_KEY = "admin_offers_version";
const SEED_VERSION = "4";

function load(): Offer[] {
  const cachedVersion = localStorage.getItem(VERSION_KEY);
  if (cachedVersion !== SEED_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOffers));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
    return seedOffers;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Offer[];
  } catch {
    // fall through to seed data
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOffers));
  return seedOffers;
}

function save(offers: Offer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
}

export function getOffers(): Offer[] {
  return load();
}

export function addOffer(offer: Omit<Offer, "id">): Offer {
  const offers = load();
  const newOffer: Offer = { ...offer, id: `OF${Date.now()}` };
  save([newOffer, ...offers]);
  return newOffer;
}

export function updateOffer(id: string, updates: Partial<Offer>): void {
  const offers = load().map((o) => (o.id === id ? { ...o, ...updates } : o));
  save(offers);
}

export function deleteOffer(id: string): void {
  save(load().filter((o) => o.id !== id));
}
