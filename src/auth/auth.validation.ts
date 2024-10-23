import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly REGISTER: ZodType = z
    .object({
      email: z
        .string()
        .nonempty('Email Wajib Diisi')
        .email('Email tidak valid')
        .max(100),
      name: z
        .string()
        .nonempty('nama wajib diisi')
        .min(1, 'nama minimal 1 karakter')
        .max(100, 'nama maksimal 100 karakter'),
      password: z
        .string()
        .nonempty('Password harus diisi')
        .min(8, 'Password minimal 8 karakter')
        .regex(/[A-Z]/, 'Password harus memiliki minimal 1 huruf besar')
        .regex(/[a-z]/, 'Password harus memiliki minimal 1 huruf kecil')
        .regex(/[0-9]/, 'Password harus memiliki minimal 1 angka')
        .regex(/[!@#$%^&*()]/, 'Password harus menerapkan setidaknya 1 simbol'),
      confirmPassword: z.string().nonempty('Konfirmasi password harus diisi'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password dan konfirmasi password harus sama',
      path: ['confirmPassword'],
    });
}
