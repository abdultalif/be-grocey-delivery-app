import { z, ZodType } from 'zod';

export class ReviewsValidation {
  static readonly CREATE: ZodType = z.object({
    product_id: z
      .string()
      .nonempty('id harus di isi')
      .uuid('format id harus uuid'),
    transaction_id: z
      .string()
      .nonempty('id harus di isi')
      .uuid('format id harus uuid'),
    comment: z
      .string()
      .nonempty('comment harus di isi')
      .min(1, 'quantity minimal 5 huruf'),
    rating: z.number().min(1, 'quantity minimal 1 angka'),
  });

  //   static readonly UPDATE: ZodType = z.object({
  //     quantity: z.number().min(1, 'quantity minimal 1 angka').optional(),
  //     total: z.number().min(1, 'quantity minimal 1 angka').optional(),
  //   });
}
