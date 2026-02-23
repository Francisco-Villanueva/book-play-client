import z from "zod";

export const RegisterRequestSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  userName: z.string().min(1, "El nombre de usuario es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  phone: z.string().optional(),
});

export const LoginRequestSchema = z.object({
  username: z.string().min(1, "El email o usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  globalRole: z.string(),
});

export const RegisterResponseSchema = z.object({
  user: AuthUserSchema,
  accessToken: z.string(),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
});

export type TRegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type TLoginRequest = z.infer<typeof LoginRequestSchema>;
export type TRegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type TLoginResponse = z.infer<typeof LoginResponseSchema>;
