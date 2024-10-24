import { z, ZodType } from 'zod';

export class ProductsValidation {
  static readonly CREATE: ZodType = z.object({
    name: z
      .string()
      .nonempty('nama harus di isi')
      .min(3, 'Name minimal 3 karakter'),
    price: z.number().min(1, 'harga minimal 1 angka'),
    stock: z.number().min(1, 'stok minimal 1 angka'),
    image: z
      .string()
      .nonempty('Gambar harus di isi')
      .min(3, 'Gambar minimal 3 karakter'),
    description: z.string().optional(),
  });
}
