import type { Service } from "@/data/mockData";
import { addServiceApi, deleteServiceApi, getServicesApi, updateServiceApi } from "./adminApi";

export async function getServices(): Promise<Service[]> {
  return getServicesApi();
}

export async function addService(service: Omit<Service, "id">): Promise<Service> {
  return addServiceApi(service);
}

export async function updateService(id: string, updates: Partial<Service>): Promise<void> {
  return updateServiceApi(id, updates);
}

export async function deleteService(id: string): Promise<void> {
  return deleteServiceApi(id);
}
