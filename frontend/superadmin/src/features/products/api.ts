import { api, API_BASE_URL, TOKEN_KEY } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { withId } from "@/lib/normalizeId";
import {
  mockAssignProductBranch,
  mockCreateProduct,
  mockCreateStockRequest,
  mockDeleteProductRecord,
  mockFetchProductList,
  mockFetchStockRequests,
  mockFulfillStockRequest,
  mockRemoveProductAllocation,
  mockUpdateProductRecord,
} from "@/lib/mock/store";
import type { Product, ProductAllocationInput, ProductCategory, ProductInput, StockRequest } from "./types";

// The backend serializes ProductCategory as the Java enum name
// ("HAIR_CARE"), but this app's existing types/UI use Title Case with a
// space ("Hair Care") - only applied to data from the REAL API; mock data
// already uses the app's convention and passes through unchanged.
const CATEGORY_FROM_BACKEND: Record<string, ProductCategory> = {
  HAIR_CARE: "Hair Care",
  BEARD_CARE: "Beard Care",
  SKIN_CARE: "Skin Care",
  TOOLS: "Tools",
};

function normalizeProduct(product: Product): Product {
  return withId({
    ...product,
    category: CATEGORY_FROM_BACKEND[String(product.category)] ?? product.category,
    allocations: (product.allocations ?? []).map((a) => withId({
      ...a,
      status: String(a.status).toLowerCase() as Product["allocations"][number]["status"],
    })),
  });
}

function normalizeStockRequest(request: StockRequest): StockRequest {
  return withId({
    ...request,
    status: String(request.status).toLowerCase() as StockRequest["status"],
  });
}

export async function fetchProducts(branchId?: string): Promise<Product[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Product[]>("/admin/products", { params: { branchId } });
      return data.map(normalizeProduct);
    },
    () => mockFetchProductList(branchId)
  );
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Product>("/admin/products", input);
      return normalizeProduct(data);
    },
    () => mockCreateProduct(input)
  );
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Product>(`/admin/products/${id}`, input);
      return normalizeProduct(data);
    },
    () => mockUpdateProductRecord(id, input)
  );
}

export async function deleteProduct(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/products/${id}`);
    },
    () => mockDeleteProductRecord(id)
  );
}

export async function approveProduct(id: string): Promise<Product> {
  const { data } = await api.patch<Product>(`/admin/products/${id}/approve`);
  return normalizeProduct(data);
}

export async function rejectProduct(id: string): Promise<Product> {
  const { data } = await api.patch<Product>(`/admin/products/${id}/reject`);
  return normalizeProduct(data);
}

export async function assignProductToBranch(
  productId: string,
  input: ProductAllocationInput
): Promise<Product> {
  return withMockFallback(
    async () => {
      // Backend enum for allocation status is uppercase ("ASSIGNED"/"PENDING").
      const payload = { ...input, status: input.status.toUpperCase() };
      const { data } = await api.post<Product>(`/admin/products/${productId}/allocations`, payload);
      return normalizeProduct(data);
    },
    () => mockAssignProductBranch(productId, input)
  );
}

export async function removeProductAllocation(productId: string, allocationId: string): Promise<Product> {
  return withMockFallback(
    async () => {
      const { data } = await api.delete<Product>(
        `/admin/products/${productId}/allocations/${allocationId}`
      );
      return normalizeProduct(data);
    },
    () => mockRemoveProductAllocation(productId, allocationId)
  );
}

export async function fetchStockRequests(): Promise<StockRequest[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<StockRequest[]>("/admin/stock-requests");
      return data.map(normalizeStockRequest);
    },
    () => mockFetchStockRequests()
  );
}

export async function createStockRequest(productId: string, branchId: string): Promise<StockRequest> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<StockRequest>("/admin/stock-requests", { productId, branchId });
      return normalizeStockRequest(data);
    },
    () => mockCreateStockRequest(productId, branchId)
  );
}

export async function fulfillStockRequest(id: string): Promise<StockRequest> {
  return withMockFallback(
    async () => {
      // NOTE: fixed to match the real backend's contract - it exposes a
      // general PATCH /admin/stock-requests/{id} with a status body, not a
      // dedicated /fulfill sub-route (which doesn't exist on the backend).
      const { data } = await api.patch<StockRequest>(`/admin/stock-requests/${id}`, {
        status: "FULFILLED",
      });
      return normalizeStockRequest(data);
    },
    () => mockFulfillStockRequest(id)
  );
}

/**
 * Uploads a product image and returns its public URL. Uses plain fetch
 * rather than the shared `api` axios instance, since that instance sets a
 * default `Content-Type: application/json` header which would break a
 * multipart/form-data upload - the browser needs to set that header itself
 * (including the multipart boundary) when sending a FormData body.
 *
 * No mock fallback: if there's no reachable backend, there's nowhere for a
 * real file to go, so this always requires the real API.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_BASE_URL}/admin/uploads/products`, {
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
