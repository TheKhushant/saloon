const API_URL = "http://localhost:5000/api";

export const api = async (endpoint, method = "GET", body = null) => {

  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : null
  });

  return res.json();
};