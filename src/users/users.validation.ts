import { z, ZodType } from 'zod';

export class UsersValidation {
  static readonly CHANGE_PASSWORD: ZodType = z
    .object({
      current_password: z
        .string()
        .nonempty('Password harus diisi')
        .min(8, 'Password minimal 8 karakter')
        .regex(/[A-Z]/, 'Password harus memiliki minimal 1 huruf besar')
        .regex(/[a-z]/, 'Password harus memiliki minimal 1 huruf kecil')
        .regex(/[0-9]/, 'Password harus memiliki minimal 1 angka')
        .regex(/[!@#$%^&*()]/, 'Password harus menerapkan setidaknya 1 simbol'),
      new_password: z
        .string()
        .nonempty('Password harus diisi')
        .min(8, 'Password minimal 8 karakter')
        .regex(/[A-Z]/, 'Password harus memiliki minimal 1 huruf besar')
        .regex(/[a-z]/, 'Password harus memiliki minimal 1 huruf kecil')
        .regex(/[0-9]/, 'Password harus memiliki minimal 1 angka')
        .regex(/[!@#$%^&*()]/, 'Password harus menerapkan setidaknya 1 simbol'),
      new_confirm_password: z
        .string()
        .nonempty('Konfirmasi password harus diisi'),
    })
    .refine((data) => data.new_password === data.new_confirm_password, {
      message: 'Password baru dan konfirmasi password baru harus sama',
      path: ['new_confirm_password'],
    });
}
