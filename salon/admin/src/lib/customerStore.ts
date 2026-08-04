import { customers as seedCustomers, type Customer } from "@/data/mockData";

const STORAGE_KEY = "admin_customers";
const VERSION_KEY = "admin_customers_version";
// Bump this whenever the seed data in mockData.ts changes, so stale
// browser-cached customers get replaced instead of lingering forever.
const SEED_VERSION = "2";

function load(): Customer[] {
  const cachedVersion = localStorage.getItem(VERSION_KEY);
  if (cachedVersion !== SEED_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCustomers));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
    return seedCustomers;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Customer[];
  } catch {
    // fall through to seed data
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCustomers));
  return seedCustomers;
}

function save(customers: Customer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function getCustomers(): Customer[] {
  return load();
}

export function addCustomer(customer: Omit<Customer, "id" | "totalBookings" | "lastBooking" | "totalSpent">): Customer {
  const customers = load();
  const newCustomer: Customer = {
    ...customer,
    id: `C${Date.now()}`,
    totalBookings: 0,
    lastBooking: "—",
    totalSpent: 0,
  };
  save([newCustomer, ...customers]);
  return newCustomer;
}

export function updateCustomer(id: string, updates: Partial<Customer>): void {
  const customers = load().map((c) => (c.id === id ? { ...c, ...updates } : c));
  save(customers);
}

export function deleteCustomer(id: string): void {
  save(load().filter((c) => c.id !== id));
}
