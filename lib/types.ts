export interface User {
  id?: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
}

export interface Order {
  id: string;
  email: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
