import z from 'zod';

export const CourtSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string(),
  sportType: z.string().optional(),
  surface: z.string().optional(),
  capacity: z.number().int().optional(),
  isIndoor: z.boolean(),
  hasLighting: z.boolean(),
  pricePerHour: z.number().optional(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCourtSchema = z.object({
  name: z.string().min(1),
  sportType: z.string().optional(),
  surface: z.string().optional(),
  capacity: z.number().int().optional(),
  isIndoor: z.boolean(),
  hasLighting: z.boolean(),
  pricePerHour: z.number().optional(),
  description: z.string().optional(),
});

export const UpdateCourtSchema = CreateCourtSchema.partial();

export type TCourt = z.infer<typeof CourtSchema>;
export type TCreateCourtInput = z.infer<typeof CreateCourtSchema>;
export type TUpdateCourtInput = z.infer<typeof UpdateCourtSchema>;
