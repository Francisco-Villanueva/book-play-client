import z from 'zod';

export const BusinessUserSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(['OWNER', 'ADMIN', 'STAFF']),
  createdAt: z.string().datetime(),
});

export const CreateBusinessUserSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['OWNER', 'ADMIN', 'STAFF']),
});

export const UpdateBusinessUserSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'STAFF']),
});

export type TBusinessUser = z.infer<typeof BusinessUserSchema>;
export type TCreateBusinessUserInput = z.infer<typeof CreateBusinessUserSchema>;
export type TUpdateBusinessUserInput = z.infer<typeof UpdateBusinessUserSchema>;
