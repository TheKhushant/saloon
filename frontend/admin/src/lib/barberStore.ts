import type { Barber } from "@/data/mockData";
import { addBarberApi, deleteBarberApi, getBarbersApi, updateBarberApi } from "./adminApi";

export async function getBarbers(): Promise<Barber[]> {
  return getBarbersApi();
}

export async function addBarber(barber: Omit<Barber, "id">): Promise<Barber> {
  return addBarberApi(barber);
}

export async function updateBarber(id: string, updates: Partial<Barber>): Promise<void> {
  return updateBarberApi(id, updates);
}

export async function deleteBarber(id: string): Promise<void> {
  return deleteBarberApi(id);
}
