import { api } from "./api";
import type { Branch, Barber, Customer, Offer, Product, ProductCategory, Booking, Service } from "@/data/mockData";

/* ============================== Branches ============================== */

interface ApiBranch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  active: boolean;
}

function mapBranch(b: ApiBranch): Branch {
  return {
    id: b.id,
    branch_name: b.name,
    // The backend has no "city" field - this app's own concept, not
    // trackable yet without a schema change.
    city: "",
    address: b.address ?? "",
    contact_number: b.phone ?? "",
    // The backend only has an active/inactive boolean, not a 3-way
    // active/paused/disabled state - "paused" isn't representable yet.
    status: b.active ? "active" : "disabled",
  };
}

export async function getBranchesApi(): Promise<Branch[]> {
  const data: ApiBranch[] = await api("/admin/branches");
  // A 2xx response with an empty/non-JSON body parses as null - treat
  // that as "no records" instead of crashing the whole page on .map.
  return (data ?? []).map(mapBranch);
}

export async function addBranchApi(branch: Omit<Branch, "id">): Promise<Branch> {
  const created: ApiBranch = await api("/admin/branches", "POST", {
    name: branch.branch_name,
    address: branch.address,
    phone: branch.contact_number,
    active: branch.status !== "disabled",
  });
  return mapBranch(created);
}

export async function updateBranchApi(id: string, updates: Partial<Branch>): Promise<void> {
  await api(`/admin/branches/${id}`, "PATCH", {
    ...(updates.branch_name !== undefined ? { name: updates.branch_name } : {}),
    ...(updates.address !== undefined ? { address: updates.address } : {}),
    ...(updates.contact_number !== undefined ? { phone: updates.contact_number } : {}),
    ...(updates.status !== undefined ? { active: updates.status !== "disabled" } : {}),
  });
}

export async function deleteBranchApi(id: string): Promise<void> {
  await api(`/admin/branches/${id}`, "DELETE");
}

/* =============================== Barbers =============================== */

interface ApiBarber {
  id: string;
  name: string;
  phone: string;
  email?: string;
  specialties?: string[];
  active: boolean;
  branchId: string;
}

function mapBarber(b: ApiBarber): Barber {
  return {
    id: b.id,
    name: b.name,
    phone: b.phone,
    email: b.email,
    specialties: b.specialties ?? [],
    active: b.active,
    branchId: b.branchId,
  };
}

export async function getBarbersApi(): Promise<Barber[]> {
  const data: ApiBarber[] = await api("/admin/barbers");
  // A 2xx response with an empty/non-JSON body parses as null - treat
  // that as "no records" instead of crashing the whole page on .map.
  return (data ?? []).map(mapBarber);
}

export async function addBarberApi(barber: Omit<Barber, "id">): Promise<Barber> {
  const created: ApiBarber = await api("/admin/barbers", "POST", barber);
  return mapBarber(created);
}

export async function updateBarberApi(id: string, updates: Partial<Barber>): Promise<void> {
  await api(`/admin/barbers/${id}`, "PATCH", updates);
}

export async function deleteBarberApi(id: string): Promise<void> {
  await api(`/admin/barbers/${id}`, "DELETE");
}

/* =============================== Services ================================ */

// Service maps almost 1:1 to the backend shape already - no field renaming
// needed, just plain pass-through typed as this app's local Service type.
interface ApiService {
  id: string;
  name: string;
  category?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  description?: string;
  branchId?: string;
}

export async function getServicesApi(): Promise<Service[]> {
  return api("/admin/services");
}

export async function addServiceApi(service: Omit<Service, "id">): Promise<Service> {
  const created: ApiService = await api("/admin/services", "POST", service);
  return created;
}

export async function updateServiceApi(id: string, updates: Partial<Service>): Promise<void> {
  await api(`/admin/services/${id}`, "PATCH", updates);
}

export async function deleteServiceApi(id: string): Promise<void> {
  await api(`/admin/services/${id}`, "DELETE");
}

/* ============================== Customers ============================== */

interface ApiCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalBookings: number;
  totalSpent: number;
  active: boolean;
  notes?: string;
  branchId?: string;
}

function mapCustomer(c: ApiCustomer): Customer {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email ?? "",
    totalBookings: c.totalBookings,
    // Not tracked on the backend yet (only a running count is kept, not the
    // date of the most recent booking).
    lastBooking: "",
    totalSpent: c.totalSpent,
    active: c.active,
    notes: c.notes,
    branchId: c.branchId,
  };
}

export async function getCustomersApi(): Promise<Customer[]> {
  const data: ApiCustomer[] = await api("/admin/customers");
  // A 2xx response with an empty/non-JSON body parses as null - treat
  // that as "no records" instead of crashing the whole page on .map.
  return (data ?? []).map(mapCustomer);
}

export async function addCustomerApi(
  customer: Omit<Customer, "id" | "totalBookings" | "lastBooking" | "totalSpent">
): Promise<Customer> {
  const created: ApiCustomer = await api("/admin/customers", "POST", customer);
  return mapCustomer(created);
}

export async function updateCustomerApi(id: string, updates: Partial<Customer>): Promise<void> {
  await api(`/admin/customers/${id}`, "PATCH", updates);
}

export async function deleteCustomerApi(id: string): Promise<void> {
  await api(`/admin/customers/${id}`, "DELETE");
}

/* ================================ Offers ================================ */

interface ApiOffer {
  id: string;
  title: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  active: boolean;
  expiresAt?: string;
  description?: string;
}

function mapOffer(o: ApiOffer): Offer {
  return {
    id: o.id,
    title: o.title,
    code: o.code,
    discountType: o.discountType === "PERCENTAGE" ? "percentage" : "fixed",
    discountValue: o.discountValue,
    active: o.active,
    expiresAt: o.expiresAt,
    description: o.description,
    // The backend's Offer isn't branch-scoped (it's a chain-wide catalog
    // item, like Product/Service) - this app's optional per-offer branchId
    // has no backend equivalent yet.
    branchId: undefined,
  };
}

export async function getOffersApi(): Promise<Offer[]> {
  const data: ApiOffer[] = await api("/admin/offers");
  // A 2xx response with an empty/non-JSON body parses as null - treat
  // that as "no records" instead of crashing the whole page on .map.
  return (data ?? []).map(mapOffer);
}

export async function addOfferApi(offer: Omit<Offer, "id">): Promise<Offer> {
  const created: ApiOffer = await api("/admin/offers", "POST", {
    title: offer.title,
    code: offer.code,
    discountType: offer.discountType === "percentage" ? "PERCENTAGE" : "FIXED",
    discountValue: offer.discountValue,
    active: offer.active,
    expiresAt: offer.expiresAt,
    description: offer.description,
  });
  return mapOffer(created);
}

export async function updateOfferApi(id: string, updates: Partial<Offer>): Promise<void> {
  await api(`/admin/offers/${id}`, "PATCH", {
    ...updates,
    ...(updates.discountType !== undefined
      ? { discountType: updates.discountType === "percentage" ? "PERCENTAGE" : "FIXED" }
      : {}),
  });
}

export async function deleteOfferApi(id: string): Promise<void> {
  await api(`/admin/offers/${id}`, "DELETE");
}

/* =============================== Products =============================== */

interface ApiProduct {
  id: string;
  name: string;
  category: "HAIR_CARE" | "BEARD_CARE" | "SKIN_CARE" | "TOOLS";
  price: number;
  totalStock: number;
  active: boolean;
  description?: string;
  imageUrl?: string;
  allocations?: { id: string; branchId: string }[];
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

const CATEGORY_TO_BACKEND: Record<ProductCategory, ApiProduct["category"]> = {
  "Hair Care": "HAIR_CARE",
  "Beard Care": "BEARD_CARE",
  "Face Care": "SKIN_CARE",
  // The backend has no direct equivalent for "Body Care" - falls back to
  // Skin Care rather than losing the product entirely.
  "Body Care": "SKIN_CARE",
  Tools: "TOOLS",
};

const CATEGORY_FROM_BACKEND: Record<ApiProduct["category"], ProductCategory> = {
  HAIR_CARE: "Hair Care",
  BEARD_CARE: "Beard Care",
  SKIN_CARE: "Face Care",
  TOOLS: "Tools",
};

function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: CATEGORY_FROM_BACKEND[p.category],
    price: p.price,
    stock: p.totalStock,
    image: p.imageUrl ?? "",
    active: p.active,
    description: p.description,
    assignedBranchIds: (p.allocations ?? []).map((a) => a.branchId),
    approvalStatus: p.approvalStatus,
  };
}

export async function getProductsApi(): Promise<Product[]> {
  const data: ApiProduct[] = await api("/admin/products");
  // A 2xx response with an empty/non-JSON body parses as null - treat
  // that as "no records" instead of crashing the whole page on .map.
  return (data ?? []).map(mapProduct);
}

export async function addProductApi(
  product: Omit<Product, "id" | "assignedBranchIds">
): Promise<Product> {
  const created: ApiProduct = await api("/admin/products", "POST", {
    name: product.name,
    category: CATEGORY_TO_BACKEND[product.category],
    price: product.price,
    totalStock: product.stock,
    active: product.active,
    description: product.description,
    imageUrl: product.image,
  });
  return mapProduct(created);
}

export async function updateProductApi(id: string, updates: Partial<Product>): Promise<void> {
  await api(`/admin/products/${id}`, "PATCH", {
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.category !== undefined ? { category: CATEGORY_TO_BACKEND[updates.category] } : {}),
    ...(updates.price !== undefined ? { price: updates.price } : {}),
    ...(updates.stock !== undefined ? { totalStock: updates.stock } : {}),
    ...(updates.active !== undefined ? { active: updates.active } : {}),
    ...(updates.description !== undefined ? { description: updates.description } : {}),
    ...(updates.image !== undefined ? { imageUrl: updates.image } : {}),
  });
}

export async function deleteProductApi(id: string): Promise<void> {
  await api(`/admin/products/${id}`, "DELETE");
}

/**
 * Uploads a product image to the real backend (see UploadController) and
 * returns its public URL. Uses plain fetch rather than the shared `api`
 * helper, since that helper always sets Content-Type: application/json,
 * which would break a multipart/form-data upload - the browser needs to
 * set that header itself (including the boundary) for a FormData body.
 */
export async function uploadProductImageApi(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("adminToken");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const res = await fetch(`${API_URL}/admin/uploads/products`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || "Failed to upload image");
  }
  return body.url as string;
}

/**
 * Reconciles a product's branch allocations with the target set of branch
 * ids - adding a minimal (quantity: 0, PENDING) allocation for any newly
 * assigned branch and removing allocations for any branch no longer in the
 * list. Fetches the product fresh first to get real allocation ids (the
 * local Product type only carries branch ids, not allocation ids, so the
 * caller can't supply these directly). Quantity/status management for
 * existing allocations stays in superadmin's fuller allocations UI; this
 * just covers "assign/unassign".
 */
export async function setProductBranchesApi(id: string, branchIds: string[]): Promise<void> {
  const current: ApiProduct = await api(`/admin/products/${id}`);
  const currentAllocations = current.allocations ?? [];
  const currentBranchIds = currentAllocations.map((a) => a.branchId);

  const toAdd = branchIds.filter((b) => !currentBranchIds.includes(b));
  const toRemove = currentAllocations.filter((a) => !branchIds.includes(a.branchId));

  await Promise.all([
    ...toAdd.map((branchId) =>
      api(`/admin/products/${id}/allocations`, "POST", {
        branchId,
        quantity: 0,
        assignedDate: new Date().toISOString().slice(0, 10),
        status: "PENDING",
      })
    ),
    ...toRemove.map((a) => api(`/admin/products/${id}/allocations/${a.id}`, "DELETE")),
  ]);
}

/* =============================== Bookings ================================ */

interface ApiBooking {
  id: string;
  customerName: string;
  branchName?: string;
  service: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
}

const STATUS_FROM_BACKEND: Record<ApiBooking["status"], Booking["status"]> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "Cancelled",
};

const STATUS_TO_BACKEND: Record<Booking["status"], ApiBooking["status"]> = {
  Pending: "PENDING",
  Confirmed: "CONFIRMED",
  Cancelled: "CANCELLED",
  Completed: "COMPLETED",
};

function mapBooking(b: ApiBooking): Booking {
  return {
    id: b.id,
    customerName: b.customerName,
    branch: b.branchName ?? "",
    service: b.service,
    date: b.date,
    time: b.time,
    status: STATUS_FROM_BACKEND[b.status],
  };
}

export async function getBookingsApi(): Promise<Booking[]> {
  const data: ApiBooking[] = await api("/admin/bookings");
  // A 2xx response with an empty/non-JSON body parses as null - treat
  // that as "no records" instead of crashing the whole page on .map.
  return (data ?? []).map(mapBooking);
}

export async function updateBookingStatusApi(id: string, status: Booking["status"]): Promise<void> {
  await api(`/admin/bookings/${id}`, "PATCH", { status: STATUS_TO_BACKEND[status] });
}

export async function deleteBookingApi(id: string): Promise<void> {
  await api(`/admin/bookings/${id}`, "DELETE");
}

export interface CreateBookingPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  barberId?: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24-hour)
  notes?: string;
}

export async function createBookingApi(payload: CreateBookingPayload): Promise<Booking> {
  const created: ApiBooking = await api("/admin/bookings", "POST", payload);
  return mapBooking(created);
}
