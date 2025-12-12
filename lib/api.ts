import axios, { AxiosInstance } from "axios";
import { Product, User, Cart, CreateProductRequest, CreateCartRequest } from "./types";

const API_BASE_URL = "https://fakestoreapi.com";

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

// Auth APIs
export const authAPI = {
  login: (username: string, password: string) =>
    api.post<{ token: string }>("/auth/login", {
      username,
      password,
    }),
  // Fake Store API doesn't have register, so we simulate it
  register: (username: string, email: string, password: string) =>
    api.post<User>("/users", {
      username,
      email,
      password,
    }),
};

// User APIs
export const userAPI = {
  getAll: () => api.get<User[]>("/users"),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => api.post<User>("/users", data),
  update: (id: number, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Product APIs
export const productAPI = {
  getAll: (limit?: number, sort?: "asc" | "desc") => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (sort) params.append("sort", sort);
    return api.get<Product[]>(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  },
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  getCategories: () => api.get<string[]>("/products/categories"),
  getByCategory: (category: string, limit?: number, sort?: "asc" | "desc") => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (sort) params.append("sort", sort);
    return api.get<Product[]>(`/products/category/${category}${params.toString() ? `?${params.toString()}` : ""}`);
  },
  create: (data: CreateProductRequest) => api.post<Product>("/products", data),
  update: (id: number, data: Partial<CreateProductRequest>) => api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Cart APIs (acts as orders in Fake Store API)
export const cartAPI = {
  getAll: (limit?: number, sort?: "asc" | "desc") => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (sort) params.append("sort", sort);
    return api.get<Cart[]>(`/carts${params.toString() ? `?${params.toString()}` : ""}`);
  },
  getById: (id: number) => api.get<Cart>(`/carts/${id}`),
  getByUser: (userId: number) => api.get<Cart[]>(`/carts/user/${userId}`),
  create: (data: CreateCartRequest) => api.post<Cart>("/carts", data),
  update: (id: number, data: Partial<CreateCartRequest>) => api.put<Cart>(`/carts/${id}`, data),
  delete: (id: number) => api.delete(`/carts/${id}`),
};

export default api;
