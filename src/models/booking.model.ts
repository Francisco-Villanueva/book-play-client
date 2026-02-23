import z from 'zod';

export const BookingSchema = z.object({
  id: z.string().uuid(),
  courtId: z.string().uuid(),
  businessId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestEmail: z.string().email().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(['ACTIVE', 'CANCELLED']),
  totalPrice: z.number().optional(),
  notes: z.string().optional(),
  cancelledAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateBookingSchema = z.object({
  courtId: z.string().uuid(),
  businessId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestEmail: z.string().email().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  totalPrice: z.number().optional(),
  notes: z.string().optional(),
});

export const UpdateBookingSchema = z.object({
  status: z.enum(['ACTIVE', 'CANCELLED']).optional(),
  notes: z.string().optional(),
  totalPrice: z.number().optional(),
});

export type TBooking = z.infer<typeof BookingSchema>;
export type TCreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type TUpdateBookingInput = z.infer<typeof UpdateBookingSchema>;
