import { services as seedServices, type Service } from "@/data/mockData";

const STORAGE_KEY = "admin_services";
const VERSION_KEY = "admin_services_version";
const SEED_VERSION = "1";

function load(): Service[] {
  const cachedVersion = localStorage.getItem(VERSION_KEY);
  if (cachedVersion !== SEED_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedServices));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
    return seedServices;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Service[];
  } catch {
    // fall through to seed data
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedServices));
  return seedServices;
}

function save(services: Service[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

export function getServices(): Service[] {
  return load();
}

export function addService(service: Omit<Service, "id">): Service {
  const services = load();
  const newService: Service = { ...service, id: `SV${Date.now()}` };
  save([newService, ...services]);
  return newService;
}

export function updateService(id: string, updates: Partial<Service>): void {
  const services = load().map((s) => (s.id === id ? { ...s, ...updates } : s));
  save(services);
}

export function deleteService(id: string): void {
  save(load().filter((s) => s.id !== id));
}
