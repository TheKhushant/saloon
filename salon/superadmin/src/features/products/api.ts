import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
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
import type { Product, ProductAllocationInput, ProductInput, StockRequest } from "./types";

export async function fetchProducts(branchId?: string): Promise<Product[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Product[]>("/admin/products", { params: { branchId } });
      return data;
    },
    () => mockFetchProductList(branchId)
  );
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Product>("/admin/products", input);
      return data;
    },
    () => mockCreateProduct(input)
  );
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Product>(`/admin/products/${id}`, input);
      return data;
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

export async function assignProductToBranch(
  productId: string,
  input: ProductAllocationInput
): Promise<Product> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Product>(`/admin/products/${productId}/allocations`, input);
      return data;
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
      return data;
    },
    () => mockRemoveProductAllocation(productId, allocationId)
  );
}

export async function fetchStockRequests(): Promise<StockRequest[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<StockRequest[]>("/admin/stock-requests");
      return data;
    },
    () => mockFetchStockRequests()
  );
}

export async function createStockRequest(productId: string, branchId: string): Promise<StockRequest> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<StockRequest>("/admin/stock-requests", { productId, branchId });
      return data;
    },
    () => mockCreateStockRequest(productId, branchId)
  );
}

export async function fulfillStockRequest(id: string): Promise<StockRequest> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<StockRequest>(`/admin/stock-requests/${id}/fulfill`, {});
      return data;
    },
    () => mockFulfillStockRequest(id)
  );
}
