export class CreateCartRequest {
  product_id: string;
  quantity: number;
  total: number;
}
export class UpdateCartRequest {
  quantity?: number;
  total?: number;
}

export class CartResponse {
  id: string;
  product_id: string;
  quantity: number;
  total: number;
  user_id: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  weight: number;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface CartsResponse {
  id: string;
  quantity: number;
  total: number;
  product: Product;
  user: User;
}
