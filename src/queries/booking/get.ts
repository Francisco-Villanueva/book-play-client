import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBooking } from "@/models/booking.model";
import { BookingService } from "@/services/booking.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchBookingsByBusiness = async (
  businessId: string,
): Promise<TBooking[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BookingService.getBookingsByBusiness(businessId);
};

const fetchBooking = async (
  businessId: string,
  bookingId: string,
): Promise<TBooking> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BookingService.getBookingDetails(businessId, bookingId);
};

export const useBookingsByBusinessQuery = (businessId: string) => {
  return useQuery({
    queryKey: ["business", businessId, "bookings"],
    queryFn: () => fetchBookingsByBusiness(businessId),
    enabled: !!businessId,
  });
};

export const useBookingQuery = (businessId: string, bookingId: string) => {
  return useQuery({
    queryKey: ["business", businessId, "booking", bookingId],
    queryFn: () => fetchBooking(businessId, bookingId),
    enabled: !!businessId && !!bookingId,
  });
};
