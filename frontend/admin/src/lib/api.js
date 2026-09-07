const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Surface the backend's {message: "..."} body as a real thrown error
    // instead of silently returning it as if the call had succeeded.
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
};
