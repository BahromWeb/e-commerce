import axios, { AxiosInstance, AxiosError } from "axios";
import { ApiResponse, Product, Order, CreateProductRequest, CreateOrderRequest, PageResponse } from "./types";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api-e-commerce.tenzorsoft.uz";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "uz",
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
  register: (username: string, email: string, password: string) =>
    api.post<ApiResponse<{ token: string; type: string; username: string; email: string; role: string }>>("/auth/register", {
      username,
      email,
      password,
    }),
  login: (username: string, password: string) =>
    api.post<ApiResponse<{ token: string; type: string; username: string; email: string; role: string }>>("/auth/login", {
      username,
      password,
    }),
};

// Product APIs
export const productAPI = {
  getAll: (page: number = 0, size: number = 10, sortBy: string = "id", sortDir: string = "asc") =>
    api.get<ApiResponse<PageResponse<Product>>>(
      `/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    ),
  getById: (id: number) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),
  search: (name?: string, category?: string, page: number = 0, size: number = 10, sortBy: string = "id", sortDir: string = "asc") =>
    api.get<ApiResponse<PageResponse<Product>>>("/products/search", {
      params: { name, category, page, size, sortBy, sortDir },
    }),
  create: (data: CreateProductRequest) =>
    api.post<ApiResponse<Product>>("/products", data),
  update: (id: number, data: CreateProductRequest) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, data),
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/products/${id}`),
};

// Order APIs
export const orderAPI = {
  getAll: (page: number = 0, size: number = 10, sortBy: string = "orderDate", sortDir: string = "desc") =>
    api.get<ApiResponse<PageResponse<Order>>>(
      `/orders?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    ),
  getById: (id: number) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),
  getByEmail: (email: string) =>
    api.get<ApiResponse<Order[]>>(`/orders/customer/${email}`),
  create: (data: CreateOrderRequest) =>
    api.post<ApiResponse<Order>>("/orders", data),
  updateStatus: (id: number, status: string) =>
    api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
  cancel: (id: number) =>
    api.delete<ApiResponse<void>>(`/orders/${id}`),
};

export default api;
