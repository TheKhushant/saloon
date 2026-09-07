// import { api } from "@/lib/api";
// import { withMockFallback } from "@/lib/mock/withFallback";
// import { withId, withIds } from "@/lib/normalizeId";
// import {
//   mockCreateService,
//   mockDeleteServiceRecord,
//   mockFetchServiceList,
//   mockUpdateServiceRecord,
// } from "@/lib/mock/store";
// import type { Service, ServiceInput } from "./types";

// export async function fetchServices(branchId?: string): Promise<Service[]> {
//   return withMockFallback(
//     async () => {
//       const { data } = await api.get<Service[]>("/admin/services", { params: { branchId } });
//       return withIds(data);
//     },
//     () => mockFetchServiceList(branchId)
//   );
// }

// export async function createService(input: ServiceInput): Promise<Service> {
//   return withMockFallback(
//     async () => {
//       const { data } = await api.post<Service>("/admin/services", input);
//       return withId(data);
//     },
//     () => mockCreateService(input)
//   );
// }

// export async function updateService(id: string, input: ServiceInput): Promise<Service> {
//   return withMockFallback(
//     async () => {
//       const { data } = await api.patch<Service>(`/admin/services/${id}`, input);
//       return withId(data);
//     },
//     () => mockUpdateServiceRecord(id, input)
//   );
// }

// export async function deleteService(id: string): Promise<void> {
//   return withMockFallback(
//     async () => {
//       await api.delete(`/admin/services/${id}`);
//     },
//     () => mockDeleteServiceRecord(id)
//   );
// }

// // No mock fallback for these two - they're new actions tied to the real
// // approval workflow and don't have an equivalent in the old mock data model.
// export async function approveService(id: string): Promise<Service> {
//   const { data } = await api.patch<Service>(`/admin/services/${id}/approve`);
//   return withId(data);
// }

// export async function rejectService(id: string): Promise<Service> {
//   const { data } = await api.patch<Service>(`/admin/services/${id}/reject`);
//   return withId(data);
// }
import { api, API_BASE_URL, TOKEN_KEY } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { withId, withIds } from "@/lib/normalizeId";
import {
  mockCreateService,
  mockDeleteServiceRecord,
  mockFetchServiceList,
  mockUpdateServiceRecord,
} from "@/lib/mock/store";
import type { Service, ServiceInput } from "./types";

export async function fetchServices(branchId?: string): Promise<Service[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Service[]>("/admin/services", { params: { branchId } });
      return withIds(data);
    },
    () => mockFetchServiceList(branchId)
  );
}

export async function createService(input: ServiceInput): Promise<Service> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Service>("/admin/services", input);
      return withId(data);
    },
    () => mockCreateService(input)
  );
}

export async function updateService(id: string, input: ServiceInput): Promise<Service> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Service>(`/admin/services/${id}`, input);
      return withId(data);
    },
    () => mockUpdateServiceRecord(id, input)
  );
}

export async function deleteService(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/services/${id}`);
    },
    () => mockDeleteServiceRecord(id)
  );
}

/**
 * Uploads an image file for a service and returns its public URL. Sends a
 * raw fetch (not the shared `api` axios client) because that client sets a
 * default `Content-Type: application/json` header which would break a
 * multipart/form-data upload - the browser needs to set that header itself
 * (including the multipart boundary) when sending a FormData body.
 *
 * No mock fallback: if there's no reachable backend, there's nowhere for a
 * real file to go, so this always requires the real API.
 */
export async function uploadServiceImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_BASE_URL}/admin/uploads/services`, {
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

// No mock fallback for these two - they're new actions tied to the real
// approval workflow and don't have an equivalent in the old mock data model.
export async function approveService(id: string): Promise<Service> {
  const { data } = await api.patch<Service>(`/admin/services/${id}/approve`);
  return withId(data);
}

export async function rejectService(id: string): Promise<Service> {
  const { data } = await api.patch<Service>(`/admin/services/${id}/reject`);
  return withId(data);
}