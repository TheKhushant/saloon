import type { Booking, BookingListResponse, BookingsQuery, BookingStatus } from "@/features/bookings/types";
import type { OverviewStats, PopularService } from "@/features/dashboard/api";
import type { Barber, BarberInput } from "@/features/barbers/types";
import type { Service, ServiceInput } from "@/features/services/types";
import type { Customer, CustomerInput } from "@/features/customers/types";
import type { Offer, OfferInput } from "@/features/offers/types";
import type { Holiday, HolidayInput } from "@/features/holidays/types";
import type { SalonSettings, SalonSettingsInput } from "@/features/settings/types";
import type { ReportSummary } from "@/features/reports/types";
import type { Branch } from "@/features/branches/types";
import type { Template, TemplateInput } from "@/features/templates/types";
import type {
  Product,
  ProductAllocation,
  ProductAllocationInput,
  ProductInput,
  StockRequest,
} from "@/features/products/types";
import {
  buildMockBookings,
  mockBarbersFullSeed,
  mockBranchesSeed,
  mockCustomersSeed,
  mockHolidaysSeed,
  mockOffersSeed,
  mockProductsSeed,
  mockServicesFullSeed,
  mockSettingsSeed,
  mockStockRequestsSeed,
  mockTemplatesSeed,
} from "./seed";

// A mutable in-memory copy so demo actions (confirm/cancel/reschedule/delete)
// feel real for the duration of the session, without needing a live backend.
let bookings: Booking[] = buildMockBookings();
let services: Service[] = mockServicesFullSeed.map((s) => ({ ...s }));
let staff: Barber[] = mockBarbersFullSeed.map((b) => ({ ...b }));
let customers: Customer[] = mockCustomersSeed.map((c) => ({ ...c }));
let offers: Offer[] = mockOffersSeed.map((o) => ({ ...o }));
let holidays: Holiday[] = mockHolidaysSeed.map((h) => ({ ...h }));
let settings: SalonSettings = { ...mockSettingsSeed };
let templates: Template[] = mockTemplatesSeed.map((t) => ({
  ...t,
  branchIds: [...t.branchIds],
  images: [...t.images],
  themeColors: [...t.themeColors],
  furniture: [...t.furniture],
  costBreakdown: t.costBreakdown.map((c) => ({ ...c })),
  tags: [...t.tags],
}));
let products: Product[] = mockProductsSeed.map((p) => ({
  ...p,
  allocations: p.allocations.map((a) => ({ ...a })),
}));
let stockRequests: StockRequest[] = mockStockRequestsSeed.map((r) => ({ ...r }));

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}


function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Filters a branch-scoped list to a single branch. Empty/undefined branchId means "all branches". */
function byBranch<T extends { branchId?: string }>(list: T[], branchId?: string): T[] {
  if (!branchId) return list;
  return list.filter((item) => item.branchId === branchId);
}

// ---- Branches ----

export function mockFetchBranchList(): Branch[] {
  return mockBranchesSeed;
}

// ---- Dashboard ----

export function mockFetchOverview(branchId?: string): OverviewStats {
  const scoped = byBranch(bookings, branchId);
  const today = todayISO();
  const month = today.slice(0, 7);
  const todayBookings = scoped.filter((b) => b.date === today);
  const monthBookings = scoped.filter((b) => b.date.startsWith(month));
  const revenueOf = (list: Booking[]) =>
    list.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.total, 0);
  const totalSlots = branchId ? 12 : 40; // assumed daily capacity, scaled down for a single branch
  return {
    todayBookings: todayBookings.length,
    monthBookings: monthBookings.length,
    todayRevenue: revenueOf(todayBookings),
    monthRevenue: revenueOf(monthBookings),
    occupancyRate: Math.min(100, Math.round((todayBookings.length / totalSlots) * 100)),
  };
}

export function mockFetchPopularServices(branchId?: string): PopularService[] {
  const scoped = byBranch(bookings, branchId).filter((b) => b.status !== "cancelled");
  const counts = new Map<string, number>();
  for (const b of scoped) counts.set(b.service, (counts.get(b.service) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function mockFetchUpcomingAppointments(limit: number, branchId?: string): Booking[] {
  const now = todayISO();
  return byBranch(bookings, branchId)
    .filter((b) => b.date >= now && b.status !== "cancelled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, limit);
}

// ---- Bookings ----

export function mockFetchBookings(query: BookingsQuery): BookingListResponse {
  let list = byBranch(bookings, query.branchId);

  if (query.status) list = list.filter((b) => b.status === query.status);
  if (query.from) list = list.filter((b) => b.date >= query.from!);
  if (query.to) list = list.filter((b) => b.date <= query.to!);
  if (query.barberId) list = list.filter((b) => b.barberId === query.barberId);
  if (query.q) {
    const needle = query.q.toLowerCase();
    list = list.filter(
      (b) =>
        b.customerName.toLowerCase().includes(needle) ||
        b.customerPhone.includes(needle) ||
        b.bookingId?.toLowerCase().includes(needle)
    );
  }

  list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const pageItems = list.slice(start, start + pageSize);

  return { data: pageItems, total: list.length, page, pageSize };
}

export function mockUpdateBookingStatus(id: string, status: BookingStatus): Booking {
  const booking = bookings.find((b) => b._id === id);
  if (!booking) throw new Error("Booking not found");
  booking.status = status;
  return booking;
}

export function mockRescheduleBooking(id: string, date: string, time: string): Booking {
  const booking = bookings.find((b) => b._id === id);
  if (!booking) throw new Error("Booking not found");
  booking.date = date;
  booking.time = time;
  return booking;
}

export function mockDeleteBooking(id: string): void {
  bookings = bookings.filter((b) => b._id !== id);
}

export function mockFetchBarbers(branchId?: string): { _id: string; name: string; branchId: string }[] {
  return byBranch(staff, branchId).map(({ _id, name, branchId: bId }) => ({ _id, name, branchId: bId }));
}

// ---- Services admin CRUD ----
// A service with no branchId is offered at every branch; one with a
// branchId is only offered at that specific branch.

export function mockFetchServiceList(branchId?: string): Service[] {
  if (!branchId) return services;
  return services.filter((s) => !s.branchId || s.branchId === branchId);
}

export function mockCreateService(input: ServiceInput): Service {
  const service: Service = { _id: newId("service"), ...input };
  services = [service, ...services];
  return service;
}

export function mockUpdateServiceRecord(id: string, input: ServiceInput): Service {
  const existing = services.find((s) => s._id === id);
  if (!existing) throw new Error("Service not found");
  Object.assign(existing, input);
  return existing;
}

export function mockDeleteServiceRecord(id: string): void {
  services = services.filter((s) => s._id !== id);
}

// ---- Barbers admin CRUD ----

export function mockFetchBarberList(branchId?: string): Barber[] {
  return byBranch(staff, branchId);
}

export function mockCreateBarber(input: BarberInput): Barber {
  const barber: Barber = { _id: newId("barber"), ...input };
  staff = [barber, ...staff];
  return barber;
}

export function mockUpdateBarberRecord(id: string, input: BarberInput): Barber {
  const existing = staff.find((b) => b._id === id);
  if (!existing) throw new Error("Barber not found");
  Object.assign(existing, input);
  return existing;
}

export function mockDeleteBarberRecord(id: string): void {
  staff = staff.filter((b) => b._id !== id);
}

// ---- Customers admin CRUD ----

export function mockFetchCustomerList(branchId?: string): Customer[] {
  return byBranch(customers, branchId);
}

export function mockCreateCustomer(input: CustomerInput): Customer {
  const customer: Customer = { _id: newId("customer"), totalBookings: 0, totalSpent: 0, ...input };
  customers = [customer, ...customers];
  return customer;
}

export function mockUpdateCustomerRecord(id: string, input: CustomerInput): Customer {
  const existing = customers.find((c) => c._id === id);
  if (!existing) throw new Error("Customer not found");
  Object.assign(existing, input);
  return existing;
}

export function mockDeleteCustomerRecord(id: string): void {
  customers = customers.filter((c) => c._id !== id);
}

// ---- Offers admin CRUD (shared across all branches) ----

export function mockFetchOfferList(): Offer[] {
  return offers;
}

export function mockCreateOffer(input: OfferInput): Offer {
  const offer: Offer = { _id: newId("offer"), ...input };
  offers = [offer, ...offers];
  return offer;
}

export function mockUpdateOfferRecord(id: string, input: OfferInput): Offer {
  const existing = offers.find((o) => o._id === id);
  if (!existing) throw new Error("Offer not found");
  Object.assign(existing, input);
  return existing;
}

export function mockDeleteOfferRecord(id: string): void {
  offers = offers.filter((o) => o._id !== id);
}

// ---- Holidays admin CRUD ----
// A holiday with no branchId applies company-wide, so it's included for
// every branch view as well as "All Branches".

export function mockFetchHolidayList(branchId?: string): Holiday[] {
  if (!branchId) return holidays;
  return holidays.filter((h) => !h.branchId || h.branchId === branchId);
}

export function mockCreateHoliday(input: HolidayInput): Holiday {
  const holiday: Holiday = { _id: newId("holiday"), ...input };
  holidays = [holiday, ...holidays];
  return holiday;
}

export function mockUpdateHolidayRecord(id: string, input: HolidayInput): Holiday {
  const existing = holidays.find((h) => h._id === id);
  if (!existing) throw new Error("Holiday not found");
  Object.assign(existing, input);
  return existing;
}

export function mockDeleteHolidayRecord(id: string): void {
  holidays = holidays.filter((h) => h._id !== id);
}

// ---- Settings ----

export function mockFetchSettingsRecord(): SalonSettings {
  return settings;
}

export function mockUpdateSettingsRecord(input: SalonSettingsInput): SalonSettings {
  settings = { ...input };
  return settings;
}

// ---- Reports ----

export function mockFetchReportSummary(rangeDays: number, branchId?: string): ReportSummary {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - rangeDays);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  const inRange = byBranch(bookings, branchId).filter((b) => b.date >= cutoffISO);

  const revenueByDate = new Map<string, number>();
  const statusCounts = new Map<string, number>();
  const serviceCounts = new Map<string, number>();
  const barberCounts = new Map<string, number>();
  let totalRevenue = 0;
  let cancelled = 0;

  for (const b of inRange) {
    statusCounts.set(b.status, (statusCounts.get(b.status) ?? 0) + 1);
    if (b.status === "cancelled") cancelled++;
    if (b.status !== "cancelled") {
      totalRevenue += b.total;
      revenueByDate.set(b.date, (revenueByDate.get(b.date) ?? 0) + b.total);
      serviceCounts.set(b.service, (serviceCounts.get(b.service) ?? 0) + 1);
      barberCounts.set(b.barber, (barberCounts.get(b.barber) ?? 0) + 1);
    }
  }

  const revenueTrend = Array.from({ length: rangeDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (rangeDays - 1 - i));
    const iso = d.toISOString().slice(0, 10);
    return { date: iso, revenue: revenueByDate.get(iso) ?? 0 };
  });

  const topN = (m: Map<string, number>) =>
    Array.from(m.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

  return {
    totalBookings: inRange.length,
    totalRevenue,
    avgTicket: inRange.length ? Math.round((totalRevenue / (inRange.length - cancelled || 1)) * 100) / 100 : 0,
    cancellationRate: inRange.length ? Math.round((cancelled / inRange.length) * 1000) / 10 : 0,
    revenueTrend,
    bookingsByStatus: Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count })),
    topServices: topN(serviceCounts),
    topBarbers: topN(barberCounts),
  };
}

// ---- Templates admin CRUD ----
// A template with no branchIds assigned still shows under "All Branches",
// it just won't appear when filtering to a specific branch.

export function mockFetchTemplateList(branchId?: string): Template[] {
  if (!branchId) return templates;
  return templates.filter((t) => t.branchIds.includes(branchId));
}

export function mockCreateTemplate(input: TemplateInput, createdBy: string): Template {
  const template: Template = {
    _id: newId("template"),
    ...input,
    branchIds: [],
    favorite: false,
    version: "1.0",
    updatedAt: new Date().toISOString(),
    createdBy,
  };
  templates = [template, ...templates];
  return template;
}

function bumpVersion(version: string): string {
  const n = parseFloat(version);
  if (Number.isNaN(n)) return "1.0";
  return (Math.round((n + 0.1) * 10) / 10).toFixed(1);
}

export function mockUpdateTemplateRecord(id: string, input: TemplateInput): Template {
  const existing = templates.find((t) => t._id === id);
  if (!existing) throw new Error("Template not found");
  Object.assign(existing, input, {
    version: bumpVersion(existing.version),
    updatedAt: new Date().toISOString(),
  });
  return existing;
}

export function mockDeleteTemplateRecord(id: string): void {
  templates = templates.filter((t) => t._id !== id);
}

export function mockDuplicateTemplate(id: string): Template {
  const existing = templates.find((t) => t._id === id);
  if (!existing) throw new Error("Template not found");
  const copy: Template = {
    ...existing,
    _id: newId("template"),
    name: `${existing.name} (Copy)`,
    status: "draft",
    branchIds: [],
    favorite: false,
    version: "1.0",
    updatedAt: new Date().toISOString(),
  };
  templates = [copy, ...templates];
  return copy;
}

export function mockToggleTemplateFavorite(id: string): Template {
  const existing = templates.find((t) => t._id === id);
  if (!existing) throw new Error("Template not found");
  existing.favorite = !existing.favorite;
  return existing;
}

export function mockAssignTemplateBranches(id: string, branchIds: string[]): Template {
  const existing = templates.find((t) => t._id === id);
  if (!existing) throw new Error("Template not found");
  existing.branchIds = branchIds;
  return existing;
}

// ---- Products admin CRUD ----
// A product's "branch list" is now derived from its allocations, not a flat
// branchIds array: filtering by branch shows only products that have been
// assigned (or have a pending assignment) to that branch.

export function mockFetchProductList(branchId?: string): Product[] {
  if (!branchId) return products;
  return products.filter((p) => p.allocations.some((a) => a.branchId === branchId));
}

export function mockCreateProduct(input: ProductInput): Product {
  const product: Product = { _id: newId("product"), allocations: [], ...input };
  products = [product, ...products];
  return product;
}

export function mockUpdateProductRecord(id: string, input: ProductInput): Product {
  const existing = products.find((p) => p._id === id);
  if (!existing) throw new Error("Product not found");
  Object.assign(existing, input);
  return existing;
}

export function mockDeleteProductRecord(id: string): void {
  products = products.filter((p) => p._id !== id);
}

// Assigning a branch that already has an allocation on this product updates
// that allocation (quantity/date/status) in place, rather than duplicating it.
export function mockAssignProductBranch(productId: string, input: ProductAllocationInput): Product {
  const product = products.find((p) => p._id === productId);
  if (!product) throw new Error("Product not found");
  const existing = product.allocations.find((a) => a.branchId === input.branchId);
  if (existing) {
    existing.quantity = input.quantity;
    existing.assignedDate = input.assignedDate;
    existing.status = input.status;
  } else {
    const allocation: ProductAllocation = { _id: newId("alloc"), ...input };
    product.allocations = [...product.allocations, allocation];
  }
  return product;
}

export function mockRemoveProductAllocation(productId: string, allocationId: string): Product {
  const product = products.find((p) => p._id === productId);
  if (!product) throw new Error("Product not found");
  product.allocations = product.allocations.filter((a) => a._id !== allocationId);
  return product;
}

// ---- Stock requests ----
// A branch files a request when its allocation on a product runs low; these
// surface as notifications for the super admin to fulfill.

export function mockFetchStockRequests(): StockRequest[] {
  return [...stockRequests].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
}

export function mockCreateStockRequest(productId: string, branchId: string): StockRequest {
  const product = products.find((p) => p._id === productId);
  if (!product) throw new Error("Product not found");
  const branch = mockBranchesSeed.find((b) => b._id === branchId);
  if (!branch) throw new Error("Branch not found");
  const request: StockRequest = {
    _id: newId("request"),
    productId,
    productName: product.name,
    branchId,
    branchName: branch.name,
    requestedAt: new Date().toISOString(),
    status: "pending",
  };
  stockRequests = [request, ...stockRequests];
  return request;
}

export function mockFulfillStockRequest(id: string): StockRequest {
  const request = stockRequests.find((r) => r._id === id);
  if (!request) throw new Error("Request not found");
  request.status = "fulfilled";
  return request;
}
