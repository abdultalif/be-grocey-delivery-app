export class CreateProductRequest {
  name: string;
  price: string;
  stock: string;
  description?: string;
}

export class UpdateProductRequest {
  name?: string;
  price?: string;
  stock?: string;
  description?: string;
}

export class ProductResponse {
  id: string;
  name: string;
  price: string;
  stock: string;
  image: string;
  image_public_id: string;
  description?: string;
}
