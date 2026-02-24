import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBooking } from "@/models/booking.model";
import { BookingService } from "@/services/booking.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const cancelBooking = async ({
  businessId,
  bookingId,
}: {
  businessId: string;
  bookingId: string;
}): Promise<TBooking> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BookingService.cancelBooking(businessId, bookingId);
};

export const useCancelBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    mutationKey: ["booking"],
    onSuccess: (data, { bookingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["business", data.businessId, "booking", bookingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["business", data.businessId, "bookings"],
      });
    },
  });
};
