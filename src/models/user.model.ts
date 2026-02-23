import z from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  userName: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string().optional(),
  globalRole: z.enum(['MASTER', 'PLAYER']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  userName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  phone: z.string().optional(),
});

export type TUser = z.infer<typeof UserSchema>;
export type TUpdateUserInput = z.infer<typeof UpdateUserSchema>;
