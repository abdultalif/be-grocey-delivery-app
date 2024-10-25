import { z, ZodType } from 'zod';

export class ProductsValidation {
  static readonly CREATE: ZodType = z.object({
    name: z
      .string()
      .nonempty('nama harus di isi')
      .min(3, 'Name minimal 3 karakter'),
    price: z.string().min(1, 'harga minimal 1 angka'),
    stock: z.string().min(1, 'stok minimal 1 angka'),
    description: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3, 'Name minimal 3 karakter').optional(),
    price: z.string().min(1, 'harga minimal 1 angka').optional(),
    stock: z.string().min(1, 'stok minimal 1 angka').optional(),
    description: z.string().optional(),
  });
}
