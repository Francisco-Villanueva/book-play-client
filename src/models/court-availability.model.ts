import z from 'zod';

export const CourtAvailabilitySchema = z.object({
  id: z.string().uuid(),
  courtId: z.string().uuid(),
  availabilityRuleId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export const CreateCourtAvailabilitySchema = z.object({
  availabilityRuleId: z.string().uuid(),
});

export type TCourtAvailability = z.infer<typeof CourtAvailabilitySchema>;
export type TCreateCourtAvailabilityInput = z.infer<typeof CreateCourtAvailabilitySchema>;
