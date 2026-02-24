import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBooking, TCreateBookingInput } from "@/models/booking.model";
import { BookingService } from "@/services/booking.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createBooking = async ({
  businessId,
  data,
}: {
  businessId: string;
  data: TCreateBookingInput;
}): Promise<TBooking> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BookingService.createBooking(businessId, data);
};

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    mutationKey: ["booking"],
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["business", data.businessId, "bookings"],
      });
    },
  });
};
