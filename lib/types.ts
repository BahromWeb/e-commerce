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
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: number;
  product?: Product;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  orderItems: OrderItemRequest[];
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
