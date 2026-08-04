import { branches as seedBranches, type Branch } from "@/data/mockData";

const STORAGE_KEY = "admin_branches";
const VERSION_KEY = "admin_branches_version";
// Bump this whenever the seed data in mockData.ts changes, so stale
// browser-cached branches get replaced instead of lingering forever.
const SEED_VERSION = "2";

function load(): Branch[] {
  const cachedVersion = localStorage.getItem(VERSION_KEY);
  if (cachedVersion !== SEED_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBranches));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
    return seedBranches;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Branch[];
  } catch {
    // fall through to seed data
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBranches));
  return seedBranches;
}

function save(branches: Branch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(branches));
}

export function getBranches(): Branch[] {
  return load();
}

export function addBranch(branch: Omit<Branch, "id">): Branch {
  const branches = load();
  const newBranch: Branch = { ...branch, id: `B${Date.now()}` };
  save([newBranch, ...branches]);
  return newBranch;
}

export function getBranch(id: string): Branch | undefined {
  return load().find((b) => b.id === id);
}

export function updateBranch(id: string, updates: Partial<Branch>): void {
  const branches = load().map((b) => (b.id === id ? { ...b, ...updates } : b));
  save(branches);
}

export function deleteBranch(id: string): void {
  save(load().filter((b) => b.id !== id));
}
