export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  name?: {
    firstname: string;
    lastname: string;
  };
  address?: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
  phone?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  productId: number;
  product?: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: { productId: number; quantity: number }[];
}

export interface Order {
  id: number;
  userId: number;
  date: string;
  products: { productId: number; quantity: number }[];
  status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount?: number;
}

export interface CreateCartRequest {
  userId: number;
  date: string;
  products: { productId: number; quantity: number }[];
}

export interface CreateProductRequest {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}
