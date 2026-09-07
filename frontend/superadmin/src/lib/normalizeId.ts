// The backend (Spring/JPA) serializes every entity's primary key as `id`.
// This app's types/UI were built around a MongoDB-style `_id` convention
// and reference `_id` throughout (row keys, edit/delete calls, dialogs).
// Rather than rewrite every component, this normalizes API responses at
// the boundary: attach `_id` (aliasing the real `id`) right where data
// comes back from the backend, so the rest of the app keeps working
// exactly as it already assumes.
export function withId<T extends { id?: string; _id?: string }>(obj: T): T & { _id: string } {
  const id = obj._id ?? obj.id;
  return { ...obj, _id: id as string };
}

export function withIds<T extends { id?: string; _id?: string }>(list: T[]): (T & { _id: string })[] {
  return list.map(withId);
}
