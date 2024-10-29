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
