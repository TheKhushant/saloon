const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const USER_TOKEN_KEY = "glamaura_user_token";

interface AuthApiResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  token: string;
  message?: string; // present on error responses instead of the fields above
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

async function patch<T>(path: string, body: unknown, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export const signupApi = (input: { name: string; email: string; phone: string; password: string }) =>
  post<AuthApiResponse>("/auth/signup", input);

export const loginApi = (input: { email: string; password: string }) =>
  post<AuthApiResponse>("/auth/login", input);

export const updateProfileApi = (
  token: string,
  input: { name?: string; email?: string; phone?: string }
) => patch<{ id: string; name: string; email: string; phone: string }>("/auth/me", input, token);

export const forgotPasswordApi = (email: string) =>
  post<{ message: string; devResetToken?: string }>("/auth/forgot-password", { email });

export const resetPasswordApi = (token: string, password: string) =>
  post<{ message: string }>("/auth/reset-password", { token, password });
