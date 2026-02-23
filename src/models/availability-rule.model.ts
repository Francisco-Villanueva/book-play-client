import z from 'zod';

export const AvailabilityRuleSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAvailabilityRuleSchema = z.object({
  name: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isActive: z.boolean(),
});

export const UpdateAvailabilityRuleSchema = CreateAvailabilityRuleSchema.partial();

export type TAvailabilityRule = z.infer<typeof AvailabilityRuleSchema>;
export type TCreateAvailabilityRuleInput = z.infer<typeof CreateAvailabilityRuleSchema>;
export type TUpdateAvailabilityRuleInput = z.infer<typeof UpdateAvailabilityRuleSchema>;
