import { email, z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name wajib di isi!"),
  email: z.email(),
  passwordHash: z
    .string()
    .min(1, "Password harus di isi!")
    .regex(/[A-Z]/, "Password harus mengandung 1 huruf kapital")
    .regex(/[0-9]/, "Password harus mengandung 1 angka minimal")
    .regex(
      /[^A-Za-z0-9]/,
      "Password harus punya minimal 1 special karakter @#$!",
    ),
});

export const LoginSchema = z.object({
  email: z.email(),
  passwordHash: z
    .string()
    .min(1, "Password harus di isi!")
    .regex(/[A-Z]/, "Password harus mengandung 1 huruf kapital")
    .regex(/[0-9]/, "Password harus mengandung 1 angka minimal")
    .regex(
      /[^A-Za-z0-9]/,
      "Password harus punya minimal 1 special karakter @#$!",
    ),
});
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>