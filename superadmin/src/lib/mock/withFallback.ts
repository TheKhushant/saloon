// When VITE_USE_MOCK_DATA=true (see .env), every admin API call skips the
// network entirely and resolves with mock data. Otherwise, a request is
// only satisfied by mock data if the real API call fails to reach the
// server at all (no backend running) — a real error response (4xx/5xx)
// still surfaces normally.
export const FORCE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === "true";

export async function withMockFallback<T>(live: () => Promise<T>, mock: () => T): Promise<T> {
  if (FORCE_MOCK) return mock();
  try {
    return await live();
  } catch (err) {
    const hasResponse = (err as { response?: unknown })?.response !== undefined;
    if (hasResponse) throw err;
    return mock();
  }
}
