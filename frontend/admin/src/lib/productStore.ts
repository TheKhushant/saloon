import type { Product } from "@/data/mockData";
import {
  addProductApi,
  deleteProductApi,
  getProductsApi,
  setProductBranchesApi,
  updateProductApi,
  uploadProductImageApi,
} from "./adminApi";

export async function getProducts(): Promise<Product[]> {
  return getProductsApi();
}

export async function addProduct(
  product: Omit<Product, "id" | "assignedBranchIds">
): Promise<Product> {
  return addProductApi(product);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  return updateProductApi(id, updates);
}

export async function deleteProduct(id: string): Promise<void> {
  return deleteProductApi(id);
}

export async function setProductBranches(id: string, branchIds: string[]): Promise<void> {
  return setProductBranchesApi(id, branchIds);
}

export async function uploadProductImage(file: File): Promise<string> {
  return uploadProductImageApi(file);
}
