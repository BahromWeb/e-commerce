import axios, { AxiosInstance } from "axios";
import { Product } from "./types";

const API_BASE_URL = "https://fakestoreapi.com";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Product APIs - fetching from fakestoreapi.com
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
};

export default api;
