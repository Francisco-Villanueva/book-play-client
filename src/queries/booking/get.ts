import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBooking } from "@/models/booking.model";
import { BookingService } from "@/services/booking.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchBookingsByBusiness = async (businessId: string): Promise<TBooking[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BookingService.getBookingsByBusiness(businessId);
};

const fetchBookingsByCourt = async (courtId: string): Promise<TBooking[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BookingService.getBookingsByCourt(courtId);
};

const fetchBooking = async (bookingId: string): Promise<TBooking> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BookingService.getBookingDetails(bookingId);
};

export const useBookingsByBusinessQuery = (businessId: string) => {
  return useQuery({
    queryKey: ["business", businessId, "bookings"],
    queryFn: () => fetchBookingsByBusiness(businessId),
    enabled: !!businessId,
  });
};

export const useBookingsByCourtQuery = (courtId: string) => {
  return useQuery({
    queryKey: ["court", courtId, "bookings"],
    queryFn: () => fetchBookingsByCourt(courtId),
    enabled: !!courtId,
  });
};

export const useBookingQuery = (bookingId: string) => {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBooking(bookingId),
    enabled: !!bookingId,
  });
};
