import { barbers as seedBarbers, type Barber } from "@/data/mockData";

const STORAGE_KEY = "admin_barbers";
const VERSION_KEY = "admin_barbers_version";
const SEED_VERSION = "1";

function load(): Barber[] {
  const cachedVersion = localStorage.getItem(VERSION_KEY);
  if (cachedVersion !== SEED_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBarbers));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
    return seedBarbers;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Barber[];
  } catch {
    // fall through to seed data
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBarbers));
  return seedBarbers;
}

function save(barbers: Barber[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(barbers));
}

export function getBarbers(): Barber[] {
  return load();
}

export function addBarber(barber: Omit<Barber, "id">): Barber {
  const barbers = load();
  const newBarber: Barber = { ...barber, id: `BR${Date.now()}` };
  save([newBarber, ...barbers]);
  return newBarber;
}

export function updateBarber(id: string, updates: Partial<Barber>): void {
  const barbers = load().map((b) => (b.id === id ? { ...b, ...updates } : b));
  save(barbers);
}

export function deleteBarber(id: string): void {
  save(load().filter((b) => b.id !== id));
}
