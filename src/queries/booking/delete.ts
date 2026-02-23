import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { BookingService } from "@/services/booking.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteBooking = async ({
  bookingId,
}: {
  bookingId: string;
  businessId: string;
  courtId: string;
}): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await BookingService.deleteBooking(bookingId);
};

export const useDeleteBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBooking,
    mutationKey: ["booking"],
    onSuccess: (_, { bookingId, businessId, courtId }) => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({
        queryKey: ["business", businessId, "bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["court", courtId, "bookings"],
      });
    },
  });
};
