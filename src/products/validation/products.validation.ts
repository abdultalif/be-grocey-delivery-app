import { z, ZodType } from 'zod';

export class ProductsValidation {
  static readonly CREATE: ZodType = z.object({
    name: z
      .string()
      .nonempty('nama harus di isi')
      .min(3, 'Name minimal 3 karakter'),
    category: z
      .string()
      .nonempty('nama harus di isi')
      .min(3, 'Name minimal 3 karakter'),
    weight: z.string().min(1, 'harga minimal 1 karakter'),
    price: z.string().min(1, 'harga minimal 1 karakter'),
    stock: z.string().min(1, 'stok minimal 1 karakter'),
    description: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3, 'Name minimal 3 karakter').optional(),
    category: z.string().min(3, 'Name minimal 3 karakter').optional(),
    weigth: z.string().min(3, 'Name minimal 3 karakter').optional(),
    price: z.string().min(1, 'harga minimal 1 karakter').optional(),
    stock: z.string().min(1, 'stok minimal 1 karakter').optional(),
    description: z.string().optional(),
  });
}
