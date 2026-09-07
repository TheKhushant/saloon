import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const TOKEN_KEY = "salon_admin_token";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The backend (Spring Boot/JPA) serializes entity identifiers as `id`.
// This codebase's feature types were written against the previous Mongo
// backend's convention (`_id`). Rather than touching every one of the ~40
// files across this app that read `_id`, every response gets a non-
// destructive `_id` alias added alongside the real `id` field, recursively
// (so nested arrays like Product.allocations or Template.assignments get
// it too). `id` is left in place - anything reading `.id` directly
// (e.g. AuthContext's login response) is unaffected.
function addIdAlias(value: unknown): unknown {
  if (Array.isArray(value)) {
    value.forEach(addIdAlias);
    return value;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.id === "string" && obj._id === undefined) {
      obj._id = obj.id;
    }
    Object.values(obj).forEach(addIdAlias);
  }
  return value;
}

api.interceptors.response.use(
  (res) => {
    addIdAlias(res.data);
    return res;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
