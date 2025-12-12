// Product interface matching fakestoreapi.com
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

// Cart item with product details
export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
}
