import z from 'zod';

const CourtRefSchema = z.object({ id: z.string().uuid(), name: z.string() });

export const ExceptionRuleSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAvailable: z.boolean(),
  reason: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  courts: z.array(CourtRefSchema).optional(),
});

export const CreateExceptionRuleSchema = z.object({
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAvailable: z.boolean(),
  reason: z.string().optional(),
  courtIds: z.array(z.string().uuid()).optional(),
});

export const UpdateExceptionRuleSchema = CreateExceptionRuleSchema.partial();

export type TExceptionRule = z.infer<typeof ExceptionRuleSchema>;
export type TCreateExceptionRuleInput = z.infer<typeof CreateExceptionRuleSchema>;
export type TUpdateExceptionRuleInput = z.infer<typeof UpdateExceptionRuleSchema>;
