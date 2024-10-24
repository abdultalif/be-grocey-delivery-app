export class CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
}

export class CreateProductResponse {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  image_public_id: string;
  description?: string;
}
