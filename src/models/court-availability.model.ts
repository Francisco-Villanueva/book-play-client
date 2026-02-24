import z from 'zod';

export const CreateCourtAvailabilitySchema = z.object({
  ruleId: z.string().uuid(),
});

export type TCreateCourtAvailabilityInput = z.infer<typeof CreateCourtAvailabilitySchema>;
