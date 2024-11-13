export class CreateProductRequest {
  name: string;
  price: number;
  category: string;
  weight: number;
  stock: number;
  description?: string;
}

export class UpdateProductRequest {
  name?: string;
  price?: number;
  category?: string;
  weight?: number;
  stock?: number;
  description?: string;
}

export class ProductResponse {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  weight: number;
  image: string;
  image_public_id: string;
  description?: string;
}
