import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBooking, TUpdateBookingInput } from "@/models/booking.model";
import { BookingService } from "@/services/booking.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateBooking = async ({
  bookingId,
  data,
}: {
  bookingId: string;
  data: TUpdateBookingInput;
}): Promise<TBooking> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BookingService.updateBooking(bookingId, data);
};

export const useUpdateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBooking,
    mutationKey: ["booking"],
    onSuccess: (data, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["business", data.businessId, "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["court", data.courtId, "bookings"] });
    },
  });
};
