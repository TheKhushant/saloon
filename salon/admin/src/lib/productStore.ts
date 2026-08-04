import { products as seedProducts, type Product } from "@/data/mockData";

const STORAGE_KEY = "admin_products";
const VERSION_KEY = "admin_products_version";
// Bump this whenever the seed data in mockData.ts changes, so stale
// browser-cached products get replaced instead of lingering forever.
const SEED_VERSION = "8";

function load(): Product[] {
  const cachedVersion = localStorage.getItem(VERSION_KEY);
  if (cachedVersion !== SEED_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
    return seedProducts;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {
    // fall through to seed data
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
  return seedProducts;
}

function save(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getProducts(): Product[] {
  return load();
}

export function addProduct(product: Omit<Product, "id" | "assignedBranchIds">): Product {
  const products = load();
  const newProduct: Product = { ...product, id: `P${Date.now()}`, assignedBranchIds: [] };
  save([newProduct, ...products]);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const products = load().map((p) => (p.id === id ? { ...p, ...updates } : p));
  save(products);
}

export function deleteProduct(id: string): void {
  save(load().filter((p) => p.id !== id));
}

export function setProductBranches(id: string, branchIds: string[]): void {
  updateProduct(id, { assignedBranchIds: branchIds });
}
