import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "./types";

// Cart state interface
interface CartState {
  items: CartItem[];
}

// Initialize cart from localStorage if available
const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return [];
      }
    }
  }
  return [];
};

const initialCartState: CartState = {
  items: loadCartFromLocalStorage(),
};

// Cart slice with localStorage persistence
const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.product.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          productId: action.payload.product.id,
          product: action.payload.product,
          quantity: action.payload.quantity,
        });
      }
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state.items));
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },
    loadCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

// Configure store
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCart } =
  cartSlice.actions;

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
