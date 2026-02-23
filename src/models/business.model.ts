import z from "zod";

export const BusinessSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  timezone: z.string(),
  slotDuration: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateBusinessSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  timezone: z.string().min(1, "La zona horaria es requerida"),
  slotDuration: z
    .number()
    .int()
    .refine((v) => [30, 60, 90, 120].includes(v), {
      message: "La duración del turno debe ser 30, 60, 90 o 120 minutos",
    }),
});

export const UpdateBusinessSchema = CreateBusinessSchema.partial();

export type TBusiness = z.infer<typeof BusinessSchema>;
export type TCreateBusinessInput = z.infer<typeof CreateBusinessSchema>;
export type TUpdateBusinessInput = z.infer<typeof UpdateBusinessSchema>;
