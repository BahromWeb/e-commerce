import axios, { AxiosInstance, AxiosError } from "axios";
import { ApiResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api-e-commerce.tenzorsoft.uz";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post<ApiResponse<{ token: string; user: any }>>("/auth/register", {
      email,
      password,
      name,
    }),
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ token: string; user: any }>>("/auth/login", {
      email,
      password,
    }),
};

// Product APIs
export const productAPI = {
  getAll: (page: number = 1, size: number = 10) =>
    api.get<ApiResponse<{ products: any[]; total: number }>>(
      `/products?page=${page}&size=${size}`
    ),
  getById: (id: string) =>
    api.get<ApiResponse<any>>(`/products/${id}`),
  search: (name?: string, category?: string) =>
    api.get<ApiResponse<any[]>>("/products/search", {
      params: { name, category },
    }),
  create: (data: any) =>
    api.post<ApiResponse<any>>("/products", data),
  update: (id: string, data: any) =>
    api.put<ApiResponse<any>>(`/products/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<any>>(`/products/${id}`),
};

// Order APIs
export const orderAPI = {
  getAll: (page: number = 1, size: number = 10) =>
    api.get<ApiResponse<{ orders: any[]; total: number }>>(
      `/orders?page=${page}&size=${size}`
    ),
  getById: (id: string) =>
    api.get<ApiResponse<any>>(`/orders/${id}`),
  getByEmail: (email: string) =>
    api.get<ApiResponse<any[]>>(`/orders/customer/${email}`),
  create: (data: any) =>
    api.post<ApiResponse<any>>("/orders", data),
  updateStatus: (id: string, status: string) =>
    api.put<ApiResponse<any>>(`/orders/${id}/status`, { status }),
  cancel: (id: string) =>
    api.delete<ApiResponse<any>>(`/orders/${id}`),
};

export default api;
